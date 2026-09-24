import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase payload limit for multiple images/PDFs base64
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Initialize GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface UploadedFilePayload {
  fileData: string;
  mimeType?: string;
  fileName?: string;
}

// Candidate models in order of efficiency, cost, and speed:
// 1. 'gemini-3.1-flash-lite' (most cost-effective, high throughput, low latency vision processing)
// 2. 'gemini-flash-latest' (fallback standard flash)
// 3. 'gemini-3.8-flash' (flagship text & vision)
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

// Helper to execute generateContent with automatic model fallback and retries on 503/429
async function generateContentWithFallback(generateParams: any) {
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...generateParams,
          model: modelName,
        });

        if (response && response.text) {
          return { response, modelUsed: modelName };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTransient = errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED');

        console.warn(`[Gemini API] Model ${modelName} attempt ${attempt + 1} failed: ${errMsg}`);

        if (isTransient) {
          // Wait briefly before retry or next model fallback
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        } else {
          // Non-transient error, break to next candidate model
          break;
        }
      }
    }
  }

  throw lastError || new Error('All candidate AI models were unavailable. Please try again.');
}

// API endpoint to audit uploaded multiple documents and extract consolidated building permit information
app.post('/api/audit-document', async (req, res) => {
  try {
    const { files, fileData, mimeType, fileName } = req.body;

    // Normalize payload to an array of files
    let inputFiles: UploadedFilePayload[] = [];
    if (Array.isArray(files) && files.length > 0) {
      inputFiles = files;
    } else if (fileData) {
      inputFiles = [{ fileData, mimeType, fileName }];
    }

    if (inputFiles.length === 0) {
      return res.status(400).json({ error: 'No document files provided for auditing.' });
    }

    // Build multi-part payload
    const inlineParts: any[] = [];
    const fileNamesSummary: string[] = [];

    for (const f of inputFiles) {
      if (!f.fileData) continue;
      const base64Data = f.fileData.replace(/^data:.*?;base64,/, '');
      const cleanMimeType = f.mimeType || 'image/jpeg';
      fileNamesSummary.push(f.fileName || 'uploaded_document');

      inlineParts.push({
        inlineData: {
          mimeType: cleanMimeType,
          data: base64Data,
        },
      });
    }

    if (inlineParts.length === 0) {
      return res.status(400).json({ error: 'Failed to process document file data.' });
    }

    const systemInstruction = `You are the Senior Plan Evaluator and Document Processor for the City of General Trias, Cavite (City Building Regulatory Division - CBRDGTC).
Your job is to read, cross-reference, and audit all uploaded scanned building permit application documents (${inlineParts.length} files attached: ${fileNamesSummary.join(', ')}).
These documents may include:
- CBRDGTC Unified Building Permit Form (Box 1 Applicant & Location, Box 2 Technical schedules, Box 3 Cadastral, Box 4 Signatures & Box 5 Notary Jurat)
- Ancillary Permit Forms (Architectural, Civil/Structural, Electrical, Sanitary/Plumbing, Mechanical, Electronics)
- Geodetic Lot Plans & Vicinity Maps
- Transfer Certificate of Title (TCT) & Tax Declarations / Real Property Tax Receipts
- Notarized Cost Estimate & Bill of Materials, Technical Specifications
- DOLE CSHP Clearance, Barangay & HOA Clearances, Notice of Construction (NOC)

Analyze ALL attached files collectively and merge all findings into a single consolidated JSON schema:
1. Serial number / Application number (e.g. "0926001141" or generate if blank).
2. Owner / Enterprise name (e.g. "ASCEND TARGET DEVELOPMENT CORPORATION" or individual owner).
3. Authorized Signatory name, role, contact phone, official address, Community Tax Certificate (CTC) number, date, and place issued.
4. Cadastral details: Lot No., Block No., Street, Subdivision/Sitio, Barangay in General Trias, TCT Number, Tax Declaration Number.
5. Scope of work (e.g. "New Construction", "Addition", "Renovation") and Occupancy Group (e.g. "Group E - Commercial", "Group A - Residential", "Group F - Industrial").
6. Building specifics: Number of storeys, number of units, total floor area in sq. meters, lot area in sq. meters.
7. Estimated Cost Valuation breakdown: Building/Civil structure cost, Electrical installation cost, Plumbing/Sanitary cost, Mechanical cost, and Total Estimated Cost.
8. Signatory Engineers & Notary Public: Extract each professional's role (Architect, Civil/Structural Engineer, Professional Electrical Engineer, Registered Electrical Engineer, Master Plumber, Mechanical Engineer, Notary Public), full name, PRC License number and validity date, PTR receipt number, date and place issued, TIN number, IAPOA number and validity, address, and signature/seal status.
9. Audited Deficiencies & Flagged Issues: Check across all documents for omissions or discrepancies such as:
   - Declaring Mechanical Cost without a Mechanical Permit Ancillary Form or Professional Mechanical Engineer (PME) seal.
   - Blank or missing Competent Evidence of Identity / ID numbers in Box 5 Notary Jurat.
   - Unaccomplished Box 2 technical schedules (e.g. blank plumbing fixture count, blank civil works checkboxes, blank BP 344 accessibility items).
   - Missing professional signatures or expired PRC licenses.
   - Missing DOLE CSHP, Barangay, or HOA clearances.`;

    const promptText = `Perform a comprehensive multi-document CBRDGTC Form 1 audit and data extraction across all ${inlineParts.length} uploaded files (${fileNamesSummary.join(', ')}).
Cross-reference the pages to extract all applicant information, project location in General Trias, complete cost valuations, and all registered signatory engineers.
Identify all deficiencies, jurat omissions, and checklist rectifications.`;

    const { response, modelUsed } = await generateContentWithFallback({
      contents: {
        parts: [
          ...inlineParts,
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            serialNumber: { type: Type.STRING, description: 'Processing Serial Number (e.g. 0926001141)' },
            referenceCode: { type: Type.STRING, description: 'Reference code (e.g. GENTRI-BP-2026-0926001141)' },
            applicationType: { type: Type.STRING, description: 'New Construction, Addition, Renovation, etc.' },
            occupancyGroup: { type: Type.STRING, description: 'Group E - Commercial, Group A - Residential, etc.' },
            characterOfOccupancy: { type: Type.STRING, description: 'Specific character of occupancy description' },
            buildingDetails: {
              type: Type.OBJECT,
              properties: {
                storeys: { type: Type.NUMBER },
                units: { type: Type.NUMBER },
                totalFloorArea: { type: Type.NUMBER },
                lotArea: { type: Type.NUMBER },
                proposedStart: { type: Type.STRING },
                expectedCompletion: { type: Type.STRING },
              },
            },
            owner: {
              type: Type.OBJECT,
              properties: {
                enterpriseName: { type: Type.STRING },
                signatoryName: { type: Type.STRING },
                signatoryRole: { type: Type.STRING },
                agentName: { type: Type.STRING },
                address: { type: Type.STRING },
                contactNumber: { type: Type.STRING },
                secondaryContact: { type: Type.STRING },
                email: { type: Type.STRING },
                ctcNumber: { type: Type.STRING },
                ctcDateIssued: { type: Type.STRING },
                ctcPlaceIssued: { type: Type.STRING },
                tin: { type: Type.STRING },
              },
            },
            cadastral: {
              type: Type.OBJECT,
              properties: {
                lotNo: { type: Type.STRING },
                blockNo: { type: Type.STRING },
                street: { type: Type.STRING },
                subdivisionOrSitio: { type: Type.STRING },
                barangay: { type: Type.STRING },
                city: { type: Type.STRING },
                province: { type: Type.STRING },
                tctNo: { type: Type.STRING },
                taxDeclarationNo: { type: Type.STRING },
              },
            },
            valuation: {
              type: Type.OBJECT,
              properties: {
                buildingCost: { type: Type.NUMBER },
                electricalCost: { type: Type.NUMBER },
                plumbingCost: { type: Type.NUMBER },
                mechanicalCost: { type: Type.NUMBER },
                electronicsCost: { type: Type.NUMBER },
                otherCost: { type: Type.NUMBER },
                totalEstimatedCost: { type: Type.NUMBER },
              },
            },
            professionals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  name: { type: Type.STRING },
                  prcNo: { type: Type.STRING },
                  prcExpiry: { type: Type.STRING },
                  ptrNo: { type: Type.STRING },
                  ptrDate: { type: Type.STRING },
                  ptrPlace: { type: Type.STRING },
                  tin: { type: Type.STRING },
                  iapoaNo: { type: Type.STRING },
                  iapoaValidity: { type: Type.STRING },
                  address: { type: Type.STRING },
                  signatureStatus: { type: Type.STRING },
                  isCompliant: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING },
                },
              },
            },
            flaggedIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  targetDocument: { type: Type.STRING },
                  severity: { type: Type.STRING, description: 'CRITICAL, LEGAL, TECHNICAL, or ADMIN' },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  rectification: { type: Type.STRING },
                  flaggedBy: { type: Type.STRING },
                },
              },
            },
            summaryFindings: {
              type: Type.STRING,
              description: 'Executive overview of audit findings across all uploaded files and recommended routing',
            },
          },
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedJson, modelUsed });
  } catch (err: any) {
    console.error('Error in /api/audit-document:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to analyze documents with AI.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
