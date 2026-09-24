import React, { useState } from 'react';
import { X, Building, Plus, Check, Sparkles, ArrowRight } from 'lucide-react';
import { ApplicationType, OccupancyGroup, PermitApplication } from '../../types/permit';
import { generateReferenceCode } from '../../utils/storage';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateApplication: (newApp: PermitApplication) => void;
  onOpenAiAuditModal?: () => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  onCreateApplication,
  onOpenAiAuditModal,
}) => {
  const nextSerial = `092600${Math.floor(1000 + Math.random() * 9000)}`;
  const [serialNumber, setSerialNumber] = useState(nextSerial);
  const [applicationType, setApplicationType] = useState<ApplicationType>('New Construction');
  const [occupancyGroup, setOccupancyGroup] = useState<OccupancyGroup>(
    'Group E - Commercial (Business & Mercantile)'
  );
  const [characterOfOccupancy, setCharacterOfOccupancy] = useState('Commercial Building');
  const [enterpriseName, setEnterpriseName] = useState('');
  const [signatoryName, setSignatoryName] = useState('');
  const [signatoryRole, setSignatoryRole] = useState('Property Owner / Authorized Officer');
  const [address, setAddress] = useState('General Trias, Cavite');
  const [contactNumber, setContactNumber] = useState('09');
  const [email, setEmail] = useState('');
  const [ctcNumber, setCtcNumber] = useState('');
  const [lotNo, setLotNo] = useState('Lot 1');
  const [blockNo, setBlockNo] = useState('Block 1');
  const [subdivision, setSubdivision] = useState('');
  const [barangay, setBarangay] = useState('Barangay Manggahan');
  const [tctNo, setTctNo] = useState('');
  const [taxDecNo, setTaxDecNo] = useState('');
  const [totalCost, setTotalCost] = useState(5000000);
  const [storeys, setStoreys] = useState(2);
  const [floorArea, setFloorArea] = useState(250);
  const [lotArea, setLotArea] = useState(300);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanSerial = serialNumber.trim() || nextSerial;
    const refCode = generateReferenceCode(cleanSerial);

    // Baseline cost distribution
    const buildingCost = Math.round(totalCost * 0.65);
    const electricalCost = Math.round(totalCost * 0.15);
    const plumbingCost = Math.round(totalCost * 0.12);
    const mechanicalCost = occupancyGroup.includes('Commercial') || occupancyGroup.includes('Industrial')
      ? Math.round(totalCost * 0.08)
      : 0;

    const newApp: PermitApplication = {
      id: `gentri-app-${Date.now()}`,
      serialNumber: cleanSerial,
      referenceCode: refCode,
      areaCode: '04085',
      applicationType,
      occupancyGroup,
      characterOfOccupancy,
      buildingDetails: {
        storeys,
        units: 1,
        totalFloorArea: floorArea,
        lotArea,
        proposedStart: 'Next Month',
        expectedCompletion: '12 Months',
      },
      owner: {
        enterpriseName: enterpriseName.trim() || 'New Applicant',
        signatoryName: signatoryName.trim() || enterpriseName.trim() || 'Applicant Signatory',
        signatoryRole,
        address,
        contactNumber,
        email,
        ctcNumber,
        ctcDateIssued: new Date().toISOString().split('T')[0],
        ctcPlaceIssued: 'General Trias, Cavite',
      },
      cadastral: {
        lotNo,
        blockNo,
        street: 'Main Street',
        subdivisionOrSitio: subdivision || 'General Trias Area',
        barangay,
        city: 'City of General Trias',
        province: 'Cavite',
        tctNo: tctNo || 'TCT-PENDING',
        taxDeclarationNo: taxDecNo || 'TAXDEC-PENDING',
      },
      valuation: {
        buildingCost,
        electricalCost,
        plumbingCost,
        mechanicalCost,
        electronicsCost: 0,
        otherCost: 0,
        totalEstimatedCost: totalCost,
      },
      professionals: [
        {
          id: `prof-${Date.now()}-1`,
          role: 'Architect (Design & Inspector)',
          name: 'Pending Assignment',
          prcNo: 'Pending',
          prcExpiry: '--',
          ptrNo: 'Pending',
          ptrDate: '--',
          ptrPlace: 'General Trias',
          tin: 'Pending',
          address: 'General Trias, Cavite',
          signatureStatus: 'Pending Signature',
          isCompliant: false,
        },
        {
          id: `prof-${Date.now()}-2`,
          role: 'Civil / Structural Engineer',
          name: 'Pending Assignment',
          prcNo: 'Pending',
          prcExpiry: '--',
          ptrNo: 'Pending',
          ptrDate: '--',
          ptrPlace: 'General Trias',
          tin: 'Pending',
          address: 'General Trias, Cavite',
          signatureStatus: 'Pending Signature',
          isCompliant: false,
        },
      ],
      requirements: [
        {
          id: `req-${Date.now()}-1`,
          itemNo: 1,
          category: 'Cadastral & Legal',
          title: 'Lot Plan (2 Copies)',
          specification: 'Signed and sealed by Geodetic Engineer',
          mandatoryCopies: 2,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-2`,
          itemNo: 2,
          category: 'Cadastral & Legal',
          title: 'Transfer Certificate of Title (TCT)',
          specification: 'Certified True Copy from RD Cavite',
          mandatoryCopies: 2,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-3`,
          itemNo: 3,
          category: 'Cadastral & Legal',
          title: 'Updated Tax Declaration',
          specification: 'From City Assessor General Trias',
          mandatoryCopies: 2,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-4`,
          itemNo: 4,
          category: 'Cadastral & Legal',
          title: 'Real Property Tax Receipt (RPT OR)',
          specification: 'Current year updated tax receipt',
          mandatoryCopies: 2,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-5`,
          itemNo: 5,
          category: 'Drawing Plans (20x30)',
          title: 'Blueprint Drawing Plans (5 Sets, 20" x 30")',
          specification: 'Architectural, Structural, Electrical, Plumbing',
          mandatoryCopies: 5,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-6`,
          itemNo: 6,
          category: 'Application Forms',
          title: 'Unified Application Form for Building Permit (4 Copies)',
          specification: 'Notarized CBRDGTC Unified Form',
          mandatoryCopies: 4,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-7`,
          itemNo: 7,
          category: 'Application Forms',
          title: 'Ancillary Permit Forms (4 Copies each)',
          specification: 'Architectural, Civil/Structural, Electrical, Sanitary',
          mandatoryCopies: 4,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-8`,
          itemNo: 8,
          category: 'Professional Credentials',
          title: 'PTR & PRC Licenses of Professionals (2 Copies)',
          specification: 'With 3 specimen signatures each',
          mandatoryCopies: 2,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-9`,
          itemNo: 9,
          category: 'Estimates & Specs',
          title: 'Cost Estimate and Bill of Materials (4 Copies)',
          specification: 'Notarized and signed/sealed',
          mandatoryCopies: 4,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-10`,
          itemNo: 10,
          category: 'Estimates & Specs',
          title: 'Technical Specifications (4 Copies)',
          specification: 'Signed and sealed specifications',
          mandatoryCopies: 4,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-11`,
          itemNo: 11,
          category: 'Clearances & Certifications',
          title: 'DOLE CSHP Certificate',
          specification: 'Approved CSHP from DOLE 4A',
          mandatoryCopies: 1,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-12`,
          itemNo: 12,
          category: 'Clearances & Certifications',
          title: 'Barangay Clearance for Construction',
          specification: 'From host barangay in General Trias',
          mandatoryCopies: 2,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
        {
          id: `req-${Date.now()}-13`,
          itemNo: 13,
          category: 'Contractor Compliance',
          title: 'Notice of Construction (NOC)',
          specification: 'NOC Form signed by owner & contractor',
          mandatoryCopies: 1,
          status: 'Pending Upload',
          uploadedFiles: [],
        },
      ],
      flaggedIssues: [],
      auditSummary: {
        overallStatus: 'Under Initial Review',
        complianceRate: 0,
        totalRequirements: 13,
        verifiedCount: 0,
        flaggedCount: 0,
        pendingCount: 13,
        reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reviewerName: 'CBRDGTC Receiving Officer',
        reviewerOffice: 'City Building Regulatory Division (CBRDGTC), General Trias',
      },
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onCreateApplication(newApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* AI Quick Banner option */}
        {onOpenAiAuditModal && (
          <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-300/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500 text-slate-950 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Have a scanned permit form or PDF?
                </div>
                <div className="text-[11px] text-slate-600">
                  Let Gemini AI audit and auto-fill owner, cadastral, valuation, and engineers automatically.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAiAuditModal();
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1 shrink-0"
            >
              <span>Launch AI Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Manual Building Permit Application Entry</h3>
            <p className="text-xs text-slate-500 font-medium">
              City Building Regulatory Division (CBRDGTC) · General Trias, Cavite
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Serial & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Processing Serial Number *
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                placeholder="e.g. 0926001144"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Generated Reference</label>
              <input
                type="text"
                disabled
                value={generateReferenceCode(serialNumber)}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-amber-800 font-mono font-bold"
              />
            </div>
          </div>

          {/* Row 2: Occupancy & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Application Type *</label>
              <select
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="New Construction">New Construction</option>
                <option value="Addition">Addition</option>
                <option value="Renovation">Renovation</option>
                <option value="Alteration">Alteration</option>
                <option value="Repair">Repair</option>
                <option value="Demolition">Demolition</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Occupancy Classification *</label>
              <select
                value={occupancyGroup}
                onChange={(e) => setOccupancyGroup(e.target.value as OccupancyGroup)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="Group E - Commercial (Business & Mercantile)">Group E - Commercial</option>
                <option value="Group A - Residential (Dwellings)">Group A - Residential</option>
                <option value="Group B - Residential (Hotels/Apartments)">Group B - Hotels/Apartments</option>
                <option value="Group D - Institutional">Group D - Institutional</option>
                <option value="Group F - Industrial (Non-Hazardous)">Group F - Industrial</option>
              </select>
            </div>
          </div>

          {/* Row 3: Owner / Enterprise */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Registered Owner / Enterprise Name *
              </label>
              <input
                type="text"
                value={enterpriseName}
                onChange={(e) => setEnterpriseName(e.target.value)}
                required
                placeholder="e.g. ACME REALTY CORP or JUAN DELA CRUZ"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Authorized Signatory Name</label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 4: Cadastral */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Lot No.</label>
              <input
                type="text"
                value={lotNo}
                onChange={(e) => setLotNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Block No.</label>
              <input
                type="text"
                value={blockNo}
                onChange={(e) => setBlockNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Subdivision / Sitio</label>
              <input
                type="text"
                value={subdivision}
                onChange={(e) => setSubdivision(e.target.value)}
                placeholder="e.g. Metro South"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Barangay *</label>
              <input
                type="text"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 5: Registry & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">TCT Number</label>
              <input
                type="text"
                value={tctNo}
                onChange={(e) => setTctNo(e.target.value)}
                placeholder="e.g. 057-2026..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tax Declaration No.</label>
              <input
                type="text"
                value={taxDecNo}
                onChange={(e) => setTaxDecNo(e.target.value)}
                placeholder="e.g. 242-00..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Total Estimated Cost (PHP)</label>
              <input
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-emerald-700 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 6: Building specifics */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Storeys</label>
              <input
                type="number"
                value={storeys}
                onChange={(e) => setStoreys(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Floor Area (m²)</label>
              <input
                type="number"
                value={floorArea}
                onChange={(e) => setFloorArea(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Lot Area (m²)</label>
              <input
                type="number"
                value={lotArea}
                onChange={(e) => setLotArea(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Application Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
