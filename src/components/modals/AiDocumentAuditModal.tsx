import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Scale,
  Wrench,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  DollarSign,
  HardHat,
  Eye,
  FileBadge,
  Zap,
  Trash2,
  Plus,
  Layers,
  Files,
} from 'lucide-react';
import { PermitApplication, IssueSeverity, SignatoryProfessional, FlaggedIssue, UploadedDocument } from '../../types/permit';
import { generateReferenceCode, formatCurrencyPHP } from '../../utils/storage';

interface UploadItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

interface AiDocumentAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommitApplication: (newApp: PermitApplication) => void;
}

export const AiDocumentAuditModal: React.FC<AiDocumentAuditModalProps> = ({
  isOpen,
  onClose,
  onCommitApplication,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadItem[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const auditSteps = [
    `Scanning ${uploadedFiles.length || 1} uploaded document(s) & identifying CBRDGTC form types...`,
    'Cross-referencing Box 1 applicant, enterprise & cadastral coordinates across pages...',
    'Consolidating multi-discipline cost valuations & technical schedules...',
    'Verifying registered signatory professionals (PRC, PTR, TIN, IAPOA seals)...',
    'Auditing jurat notarizations & detecting discrepancies across all files...',
  ];

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setErrorMessage(null);
    setExtractedData(null);

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newItem: UploadItem = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'application/pdf',
          dataUrl,
        };

        setUploadedFiles((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    if (uploadedFiles.length <= 1) {
      setExtractedData(null);
    }
  };

  const runAiAudit = async () => {
    if (uploadedFiles.length === 0) {
      setErrorMessage('Please upload at least one application form image or PDF.');
      return;
    }

    setIsAuditing(true);
    setErrorMessage(null);
    setAuditStep(0);

    const stepInterval = setInterval(() => {
      setAuditStep((prev) => (prev < auditSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const payloadFiles = uploadedFiles.map((f) => ({
        fileData: f.dataUrl,
        mimeType: f.type,
        fileName: f.name,
      }));

      const response = await fetch('/api/audit-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: payloadFiles,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setExtractedData(resData.data);
      } else {
        throw new Error('AI was unable to extract structured data from the uploaded documents.');
      }
    } catch (err: any) {
      console.error('Audit failed:', err);
      setErrorMessage(err.message || 'Audit failed. Please try again or check API connection.');
    } finally {
      setIsAuditing(false);
    }
  };

  const loadMultiPageSample = () => {
    // Generate Page 1: Unified Form Box 1 & 2
    const canvas1 = document.createElement('canvas');
    canvas1.width = 1000;
    canvas1.height = 1350;
    const ctx1 = canvas1.getContext('2d');
    if (ctx1) {
      ctx1.fillStyle = '#ffffff';
      ctx1.fillRect(0, 0, 1000, 1350);
      ctx1.fillStyle = '#0f172a';
      ctx1.font = 'bold 22px sans-serif';
      ctx1.fillText('CITY OF GENERAL TRIAS - CBRDGTC FORM 1 (UNIFIED APPLICATION)', 80, 60);
      ctx1.font = 'bold 16px monospace';
      ctx1.fillText('APPLICATION NO: 0926001148    AREA CODE: 04085', 80, 100);

      ctx1.font = 'bold 15px sans-serif';
      ctx1.fillText('BOX 1: APPLICANT & PROPERTY OWNER INFORMATION', 80, 150);
      ctx1.font = '14px sans-serif';
      ctx1.fillText('OWNER / ENTERPRISE: CAVITE HORIZONS LOGISTICS & COLD STORAGE HUB INC.', 100, 190);
      ctx1.fillText('AUTHORIZED SIGNATORY: ENGR. EDUARDO M. SANTOS (MANAGING DIRECTOR)', 100, 230);
      ctx1.fillText('OFFICE ADDRESS: GOV. DRIVE CORNER ARNALDO HWY, GENERAL TRIAS, CAVITE', 100, 270);
      ctx1.fillText('CONTACT NO: 0917-555-8822  |  EMAIL: permits@cavitehorizons.com.ph', 100, 310);
      ctx1.fillText('COMMUNITY TAX CERT (CTC): 2026-0926114  DATE: JAN 14, 2026 (GEN. TRIAS)', 100, 350);

      ctx1.font = 'bold 15px sans-serif';
      ctx1.fillText('BOX 2: LOCATION OF CONSTRUCTION & SCOPE OF WORK', 80, 410);
      ctx1.font = '14px sans-serif';
      ctx1.fillText('LOT NO: 8, BLOCK NO: 12  |  SUBD: GATEWAY INDUSTRIAL PARK', 100, 450);
      ctx1.fillText('BARANGAY: BARANGAY MANGGAHAN, GENERAL TRIAS, CAVITE', 100, 490);
      ctx1.fillText('TCT NO: 057-2026009841  |  TAX DECLARATION NO: 242-01994', 100, 530);
      ctx1.fillText('SCOPE OF WORK: NEW CONSTRUCTION', 100, 570);
      ctx1.fillText('OCCUPANCY: GROUP F - INDUSTRIAL (COMMERCIAL LOGISTICS & STORAGE)', 100, 610);
      ctx1.fillText('STOREYS: 2 STOREYS  |  TOTAL FLOOR AREA: 3,450.00 SQ.M.  |  LOT AREA: 5,200 SQ.M.', 100, 650);

      ctx1.font = 'bold 15px sans-serif';
      ctx1.fillText('ESTIMATED COST VALUATION:', 80, 710);
      ctx1.font = '14px sans-serif';
      ctx1.fillText('  1. Building / Civil Works: PHP 28,500,000.00', 100, 750);
      ctx1.fillText('  2. Electrical Works: PHP 6,200,000.00', 100, 790);
      ctx1.fillText('  3. Plumbing & Drainage: PHP 3,800,000.00', 100, 830);
      ctx1.fillText('  4. Mechanical Installation: PHP 4,500,000.00 (Cold Storage Chiller & HVAC)', 100, 870);
      ctx1.fillText('  TOTAL ESTIMATED COST: PHP 43,000,000.00', 100, 920);
    }

    // Generate Page 2: Signatures, Engineers & Notary Jurat
    const canvas2 = document.createElement('canvas');
    canvas2.width = 1000;
    canvas2.height = 1350;
    const ctx2 = canvas2.getContext('2d');
    if (ctx2) {
      ctx2.fillStyle = '#ffffff';
      ctx2.fillRect(0, 0, 1000, 1350);
      ctx2.fillStyle = '#0f172a';
      ctx2.font = 'bold 22px sans-serif';
      ctx2.fillText('CBRDGTC FORM 1 - PAGE 2: SIGNATORIES & NOTARY JURAT', 80, 60);

      ctx2.font = 'bold 15px sans-serif';
      ctx2.fillText('BOX 4: DESIGN PROFESSIONALS, SUPERVISORS & IN-CHARGE OF EXECUTION', 80, 120);
      ctx2.font = '14px sans-serif';
      ctx2.fillText('1. ARCHITECT: AR. LORENZO V. BAUTISTA (PRC 0028471, EXP: 2028-11-15)', 100, 160);
      ctx2.fillText('   PTR NO: 8819201 (GEN. TRIAS, JAN 2026) | TIN: 231-904-881 | IAPOA: 44109', 100, 195);
      ctx2.fillText('   SIGNATURE: [SIGNED & SEALED]', 100, 230);

      ctx2.fillText('2. CIVIL / STRUCTURAL: ENGR. DANILO T. ALCANTARA (PRC 0019482, EXP: 2027-04-10)', 100, 280);
      ctx2.fillText('   PTR NO: 4910291 (CAVITE, JAN 2026) | TIN: 182-441-209', 100, 315);
      ctx2.fillText('   SIGNATURE: [SIGNED & SEALED]', 100, 350);

      ctx2.fillText('3. PROFESSIONAL ELECTRICAL ENGINEER: ENGR. ALEX L. OLANO (PEE 005367)', 100, 400);
      ctx2.fillText('   PTR NO: 3918204 | TIN: 109-883-910', 100, 435);
      ctx2.fillText('   SIGNATURE: [SIGNED & SEALED]', 100, 470);

      ctx2.fillText('4. MASTER PLUMBER: ANTHONY N. APURILLO (PRC 0007147)', 100, 520);
      ctx2.fillText('   PTR NO: 0917781 | TIN: 290-119-481', 100, 555);
      ctx2.fillText('   SIGNATURE: [SIGNED & SEALED]', 100, 590);

      ctx2.font = 'bold 15px sans-serif';
      ctx2.fillText('BOX 5: NOTARY PUBLIC JURAT & ACKNOWLEDGEMENT', 80, 660);
      ctx2.font = '14px sans-serif';
      ctx2.fillText('SUBSCRIBED AND SWORN TO BEFORE ME THIS 18TH DAY OF FEBRUARY 2026.', 100, 700);
      ctx2.fillText('NOTARY PUBLIC: ATTY. KARLA KHATRINA A. GARCIA (ROLL NO. 70284)', 100, 740);
      ctx2.fillText('COMMISSION NO: 2025-14 (VALID UNTIL DEC 31, 2026, GENERAL TRIAS)', 100, 780);
      ctx2.fillText('NOTE DEFECT: JURAT BOX 5 IDENTIFICATION NUMBER FOR OWNER WAS LEFT BLANK', 100, 820);
      ctx2.fillText('NOTE DEFECT: PHP 4.5M MECHANICAL WORKS DECLARED WITHOUT ATTACHED PME FORM', 100, 860);
    }

    // Generate Page 3: Ancillary Plumbing & DOLE Clearance Note
    const canvas3 = document.createElement('canvas');
    canvas3.width = 1000;
    canvas3.height = 1350;
    const ctx3 = canvas3.getContext('2d');
    if (ctx3) {
      ctx3.fillStyle = '#ffffff';
      ctx3.fillRect(0, 0, 1000, 1350);
      ctx3.fillStyle = '#0f172a';
      ctx3.font = 'bold 22px sans-serif';
      ctx3.fillText('ANCILLARY SANITARY & PLUMBING PERMIT & CLEARANCES', 80, 60);

      ctx3.font = 'bold 15px sans-serif';
      ctx3.fillText('PLUMBING & SANITARY WORKS SPECIFICATIONS:', 80, 120);
      ctx3.font = '14px sans-serif';
      ctx3.fillText('- Water Closets: 18 Sets | Lavatories: 18 Sets | Urinals: 6 Sets', 100, 160);
      ctx3.fillText('- Industrial Septic Vault (STP Pre-treatment) Capacity: 45 cu.m.', 100, 200);
      ctx3.fillText('- Rainwater Harvesting & Stormwater Detention Tank: 60 cu.m.', 100, 240);
      ctx3.fillText('- Fire Sprinkler Standpipe Connection: 150mm Riser', 100, 280);

      ctx3.font = 'bold 15px sans-serif';
      ctx3.fillText('ATTACHED LOCAL CLEARANCES:', 80, 350);
      ctx3.font = '14px sans-serif';
      ctx3.fillText('1. BARANGAY CLEARANCE: BRGY. MANGGAHAN (ISSUED FEB 2026) - VERIFIED', 100, 390);
      ctx3.fillText('2. HOA / DEVELOPER APPROVAL: GATEWAY INDUSTRIAL PARK ASSOC. - VERIFIED', 100, 430);
      ctx3.fillText('3. DOLE CSHP CLEARANCE: PENDING DOLE REGION 4A APPROVAL CERTIFICATE', 100, 470);
    }

    const items: UploadItem[] = [
      {
        id: `sample-1-${Date.now()}`,
        name: 'CBRDGTC_Form1_Page1_Applicant_Location.jpg',
        size: 1850000,
        type: 'image/jpeg',
        dataUrl: canvas1.toDataURL('image/jpeg'),
      },
      {
        id: `sample-2-${Date.now()}`,
        name: 'CBRDGTC_Form1_Page2_Engineers_NotaryJurat.jpg',
        size: 1920000,
        type: 'image/jpeg',
        dataUrl: canvas2.toDataURL('image/jpeg'),
      },
      {
        id: `sample-3-${Date.now()}`,
        name: 'Ancillary_Sanitary_and_Clearances_Page3.jpg',
        size: 1780000,
        type: 'image/jpeg',
        dataUrl: canvas3.toDataURL('image/jpeg'),
      },
    ];

    setUploadedFiles(items);
    setExtractedData(null);
    setErrorMessage(null);
  };

  const handleCommit = () => {
    if (!extractedData) return;

    const serialNumber = extractedData.serialNumber || `092600${Math.floor(1000 + Math.random() * 9000)}`;
    const referenceCode = extractedData.referenceCode || generateReferenceCode(serialNumber);

    const professionals: SignatoryProfessional[] = (extractedData.professionals || []).map(
      (p: any, idx: number) => ({
        id: `prof-${Date.now()}-${idx}`,
        role: p.role || 'Architect (Design & Inspector)',
        name: p.name || 'Licensed Professional',
        prcNo: p.prcNo || 'N/A',
        prcExpiry: p.prcExpiry || '--',
        ptrNo: p.ptrNo || 'N/A',
        ptrDate: p.ptrDate || '--',
        ptrPlace: p.ptrPlace || 'General Trias',
        tin: p.tin || 'N/A',
        iapoaNo: p.iapoaNo,
        address: p.address || 'General Trias, Cavite',
        signatureStatus: p.signatureStatus || 'Signed & Sealed',
        isCompliant: p.signatureStatus === 'Signed & Sealed',
        notes: p.notes,
      })
    );

    const flaggedIssues: FlaggedIssue[] = (extractedData.flaggedIssues || []).map(
      (iss: any, idx: number) => ({
        id: `iss-ai-${Date.now()}-${idx}`,
        targetDocument: iss.targetDocument || 'Application Form',
        severity: (['CRITICAL', 'LEGAL', 'TECHNICAL', 'ADMIN'].includes(iss.severity)
          ? iss.severity
          : 'TECHNICAL') as IssueSeverity,
        title: iss.title || 'Audited Deficiency',
        description: iss.description || '',
        rectification: iss.rectification || 'Rectify with applicant.',
        flaggedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        flaggedBy: iss.flaggedBy || 'Gemini AI Evaluator (CBRDGTC)',
        status: 'Open',
      })
    );

    // Convert all uploaded items into UploadedDocument instances attached to requirements
    const convertedDocs: UploadedDocument[] = uploadedFiles.map((f, i) => ({
      id: `doc-ai-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      dataUrl: f.dataUrl,
      verifiedBy: 'Gemini AI Multi-Document Evaluator',
      remarks: `Audited in batch (${i + 1} of ${uploadedFiles.length})`,
    }));

    const newApp: PermitApplication = {
      id: `gentri-app-${Date.now()}`,
      serialNumber,
      referenceCode,
      areaCode: '04085',
      applicationType: extractedData.applicationType || 'New Construction',
      occupancyGroup: extractedData.occupancyGroup || 'Group E - Commercial (Business & Mercantile)',
      characterOfOccupancy: extractedData.characterOfOccupancy || 'Commercial Building',
      buildingDetails: {
        storeys: extractedData.buildingDetails?.storeys || 2,
        units: extractedData.buildingDetails?.units || 1,
        totalFloorArea: extractedData.buildingDetails?.totalFloorArea || 3000,
        lotArea: extractedData.buildingDetails?.lotArea || 4500,
        proposedStart: extractedData.buildingDetails?.proposedStart || 'Next Month',
        expectedCompletion: extractedData.buildingDetails?.expectedCompletion || '12 Months',
      },
      owner: {
        enterpriseName: extractedData.owner?.enterpriseName || 'Audited Applicant Entity',
        signatoryName: extractedData.owner?.signatoryName || 'Authorized Signatory',
        signatoryRole: extractedData.owner?.signatoryRole || 'Property Owner / Officer',
        agentName: extractedData.owner?.agentName,
        address: extractedData.owner?.address || 'General Trias, Cavite',
        contactNumber: extractedData.owner?.contactNumber || 'N/A',
        secondaryContact: extractedData.owner?.secondaryContact,
        email: extractedData.owner?.email,
        ctcNumber: extractedData.owner?.ctcNumber || 'N/A',
        ctcDateIssued: extractedData.owner?.ctcDateIssued || new Date().toISOString().split('T')[0],
        ctcPlaceIssued: extractedData.owner?.ctcPlaceIssued || 'General Trias, Cavite',
        tin: extractedData.owner?.tin,
      },
      cadastral: {
        lotNo: extractedData.cadastral?.lotNo || 'Lot 8',
        blockNo: extractedData.cadastral?.blockNo || 'Block 12',
        street: extractedData.cadastral?.street || 'Main Avenue',
        subdivisionOrSitio: extractedData.cadastral?.subdivisionOrSitio || 'Gateway Industrial Park',
        barangay: extractedData.cadastral?.barangay || 'Barangay Manggahan',
        city: 'City of General Trias',
        province: 'Cavite',
        tctNo: extractedData.cadastral?.tctNo || 'TCT-AUDITED',
        taxDeclarationNo: extractedData.cadastral?.taxDeclarationNo || 'TAXDEC-AUDITED',
      },
      valuation: {
        buildingCost: extractedData.valuation?.buildingCost || 0,
        electricalCost: extractedData.valuation?.electricalCost || 0,
        plumbingCost: extractedData.valuation?.plumbingCost || 0,
        mechanicalCost: extractedData.valuation?.mechanicalCost || 0,
        electronicsCost: extractedData.valuation?.electronicsCost || 0,
        otherCost: extractedData.valuation?.otherCost || 0,
        totalEstimatedCost: extractedData.valuation?.totalEstimatedCost || 10000000,
      },
      professionals,
      requirements: [
        {
          id: `req-ai-${Date.now()}-1`,
          itemNo: 1,
          category: 'Cadastral & Legal',
          title: 'Lot Plan (2 Copies)',
          specification: 'Signed and sealed by Geodetic Engineer',
          mandatoryCopies: 2,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-ai-${Date.now()}-2`,
          itemNo: 2,
          category: 'Cadastral & Legal',
          title: 'Transfer Certificate of Title (TCT)',
          specification: 'Certified True Copy from RD Cavite',
          mandatoryCopies: 2,
          status: extractedData.cadastral?.tctNo ? 'Verified' : 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-ai-${Date.now()}-3`,
          itemNo: 3,
          category: 'Application Forms',
          title: 'Unified Application Form for Building Permit (4 Copies)',
          specification: 'Audited and auto-extracted via AI multi-document scanner',
          mandatoryCopies: 4,
          status: flaggedIssues.length > 0 ? 'Flagged with Issues' : 'Verified',
          uploadedFiles: convertedDocs,
        },
        {
          id: `req-ai-${Date.now()}-4`,
          itemNo: 4,
          category: 'Application Forms',
          title: 'Ancillary Permit Forms (4 Copies each)',
          specification: 'Architectural, Civil, Electrical, Plumbing, Mechanical',
          mandatoryCopies: 4,
          status: flaggedIssues.some((i) => i.title.toLowerCase().includes('mechanical') || i.title.toLowerCase().includes('ancillary'))
            ? 'Flagged with Issues'
            : 'Verified',
          uploadedFiles: [],
        },
        {
          id: `req-ai-${Date.now()}-5`,
          itemNo: 5,
          category: 'Drawing Plans (20x30)',
          title: 'Blueprint Drawing Plans (5 Sets, 20" x 30")',
          specification: 'Signed & sealed by registered design professionals',
          mandatoryCopies: 5,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-ai-${Date.now()}-6`,
          itemNo: 6,
          category: 'Estimates & Specs',
          title: 'Cost Estimate and Bill of Materials (4 Copies)',
          specification: 'Notarized bill of materials matching declared total cost',
          mandatoryCopies: 4,
          status: 'Verified',
          uploadedFiles: [],
        },
      ],
      flaggedIssues,
      auditSummary: {
        overallStatus: flaggedIssues.length > 0 ? 'Action Required' : 'Ready for Approval',
        complianceRate: flaggedIssues.length > 0 ? 70 : 95,
        totalRequirements: 6,
        verifiedCount: flaggedIssues.length > 0 ? 4 : 5,
        flaggedCount: flaggedIssues.length,
        pendingCount: 1,
        reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reviewerName: 'Gemini AI Multi-Document Processor',
        reviewerOffice: 'CBRDGTC Automated Evaluation Node',
      },
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onCommitApplication(newApp);
    onClose();
  };

  const totalUploadedSizeMB = (
    uploadedFiles.reduce((acc, f) => acc + f.size, 0) /
    1024 /
    1024
  ).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-8 text-slate-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Multi-File AI Document Audit & Auto-Fill
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300">
                  Gemini 3.1 Flash Lite (Fast & Cost-Optimized)
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Upload multiple scanned application pages, ancillary forms, lot plans, or PDFs at once to cross-reference and auto-populate your permit database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs">
          {/* Upload Queue Section */}
          {!extractedData && (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 bg-slate-50 hover:bg-amber-50/20 transition-all text-center flex flex-col items-center justify-center cursor-pointer relative"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Drag & Drop Multiple Permit Files (Images or PDFs)
                </div>
                <p className="text-slate-500 mt-0.5 max-w-md text-[11px]">
                  Select multiple files at once: CBRDGTC Unified Form pages, Ancillary Permits (Electrical, Sanitary, Mechanical), Geodetic Lot Plans, Notarized Specs, and DOLE/Barangay Clearances
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs">
                    <Plus className="w-4 h-4" />
                    <span>Select Multiple Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Uploaded Files Queue Grid */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                      <Files className="w-4 h-4 text-amber-700" />
                      <span>Ready to Audit ({uploadedFiles.length} Documents · {totalUploadedSizeMB} MB)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUploadedFiles([])}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                    >
                      Clear All Files
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {uploadedFiles.map((fileItem, idx) => (
                      <div
                        key={fileItem.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs relative group flex items-start gap-2.5"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                          {fileItem.type.startsWith('image/') ? (
                            <img
                              src={fileItem.dataUrl}
                              alt={fileItem.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-sky-600" />
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="flex-1 min-w-0 pr-5">
                          <div className="text-[11px] font-bold text-slate-900 truncate" title={fileItem.name}>
                            {fileItem.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {(fileItem.size / 1024 / 1024).toFixed(2)} MB · Page {idx + 1}
                          </div>
                          <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 uppercase">
                            {fileItem.type.split('/')[1] || 'PDF'}
                          </span>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(fileItem.id)}
                          className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Multi-Page Quick Loader Helper */}
              {uploadedFiles.length === 0 && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <div className="text-slate-900 font-bold text-xs">
                        Want to test multi-page audit right now?
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Load 3 sample scanned pages: Unified Form Box 1-2, Engineers/Notary Jurat Box 4-5, and Sanitary Ancillary Form.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={loadMultiPageSample}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap text-xs"
                  >
                    Load 3 Sample Pages
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-medium">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-xs">{errorMessage}</span>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={runAiAudit}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
                    >
                      Retry Audit
                    </button>
                  )}
                </div>
              )}

              {/* Audit Progress or Action Button */}
              {isAuditing ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-amber-800 font-bold text-sm">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Cross-referencing {uploadedFiles.length} files with Gemini AI...</span>
                  </div>
                  <div className="text-xs text-slate-600 font-mono font-medium max-w-md mx-auto">
                    {auditSteps[auditStep]}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden max-w-md mx-auto">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${((auditStep + 1) / auditSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              ) : uploadedFiles.length > 0 ? (
                <div className="flex items-center justify-between gap-3 pt-2">
                  <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Add More Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={runAiAudit}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Run Multi-File AI Completeness Audit ({uploadedFiles.length} Files)</span>
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Results Review Screen */}
          {extractedData && (
            <div className="space-y-5">
              {/* Top Banner */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Multi-Document Audit Consolidated Successfully
                    </h4>
                    <p className="text-slate-700 text-xs mt-0.5 font-medium">
                      All data from {uploadedFiles.length} uploaded files merged into the CBRDGTC application schema. Review details below:
                    </p>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300 whitespace-nowrap">
                  Serial: {extractedData.serialNumber}
                </span>
              </div>

              {/* Grid 1: Applicant & Cadastral */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Owner & Signatory Profile</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {extractedData.owner?.enterpriseName}
                    </div>
                    <div className="text-slate-700 font-medium">
                      Signatory: {extractedData.owner?.signatoryName} ({extractedData.owner?.signatoryRole})
                    </div>
                    <div className="text-slate-600 mt-1">
                      Address: {extractedData.owner?.address}
                    </div>
                    <div className="text-slate-600 font-mono">
                      📞 {extractedData.owner?.contactNumber} · CTC: {extractedData.owner?.ctcNumber || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cadastral & Building Scope</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {extractedData.cadastral?.lotNo}, {extractedData.cadastral?.blockNo} ·{' '}
                      {extractedData.cadastral?.subdivisionOrSitio}, {extractedData.cadastral?.barangay}
                    </div>
                    <div className="text-slate-700 font-medium mt-0.5">
                      {extractedData.applicationType} · {extractedData.occupancyGroup}
                    </div>
                    <div className="text-slate-600 font-mono mt-1">
                      TCT: {extractedData.cadastral?.tctNo} · Tax Dec: {extractedData.cadastral?.taxDeclarationNo}
                    </div>
                    <div className="text-slate-600 font-medium">
                      {extractedData.buildingDetails?.storeys} Storeys · Floor Area:{' '}
                      {extractedData.buildingDetails?.totalFloorArea} m²
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2: Valuation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cost Valuation Breakdown</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-800 text-sm">
                    Total: {formatCurrencyPHP(extractedData.valuation?.totalEstimatedCost || 0)}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-500 block">Building/Civil:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrencyPHP(extractedData.valuation?.buildingCost || 0)}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-500 block">Electrical:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrencyPHP(extractedData.valuation?.electricalCost || 0)}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-500 block">Plumbing:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrencyPHP(extractedData.valuation?.plumbingCost || 0)}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-500 block">Mechanical:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrencyPHP(extractedData.valuation?.mechanicalCost || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid 3: Detected Issues & Omissions */}
              {extractedData.flaggedIssues && extractedData.flaggedIssues.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertOctagon className="w-4 h-4 text-rose-600" />
                    <span>
                      Audited Discrepancies & Deficiencies Detected ({extractedData.flaggedIssues.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {extractedData.flaggedIssues.map((iss: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-white border border-rose-200 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[9px] bg-rose-100 text-rose-900 border border-rose-300">
                            {iss.severity}
                          </span>
                          <span className="font-bold text-slate-900">{iss.title}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500">Target: {iss.targetDocument}</span>
                        </div>
                        <p className="text-slate-700">{iss.description}</p>
                        <div className="text-amber-900 font-medium">
                          <strong>Action Required:</strong> {iss.rectification}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid 4: Extracted Engineers */}
              {extractedData.professionals && extractedData.professionals.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-amber-600" />
                    <span>Registered Signatory Professionals ({extractedData.professionals.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {extractedData.professionals.map((p: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px]">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-amber-800 font-semibold">{p.role}</div>
                        <div className="text-slate-500 font-mono mt-0.5">
                          PRC: {p.prcNo} · PTR: {p.ptrNo} ({p.ptrPlace})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Files Summary Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Files className="w-4 h-4 text-slate-600" />
                  <span className="font-bold text-slate-800">
                    {uploadedFiles.length} file(s) will be attached to this application record
                  </span>
                </div>
                <span className="text-slate-500 font-mono">{totalUploadedSizeMB} MB Total</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200"
          >
            Close
          </button>

          {extractedData && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setExtractedData(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200"
              >
                Scan Different Files
              </button>
              <button
                type="button"
                onClick={handleCommit}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Commit to App Database & Open Bento Audit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
