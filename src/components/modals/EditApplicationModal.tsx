import React, { useState } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { PermitApplication } from '../../types/permit';

interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: PermitApplication;
  onSave: (updatedApp: PermitApplication) => void;
}

export const EditApplicationModal: React.FC<EditApplicationModalProps> = ({
  isOpen,
  onClose,
  app,
  onSave,
}) => {
  const [enterpriseName, setEnterpriseName] = useState(app.owner.enterpriseName);
  const [signatoryName, setSignatoryName] = useState(app.owner.signatoryName);
  const [address, setAddress] = useState(app.owner.address);
  const [contactNumber, setContactNumber] = useState(app.owner.contactNumber);
  const [ctcNumber, setCtcNumber] = useState(app.owner.ctcNumber);
  const [ctcDateIssued, setCtcDateIssued] = useState(app.owner.ctcDateIssued);

  const [lotNo, setLotNo] = useState(app.cadastral.lotNo);
  const [blockNo, setBlockNo] = useState(app.cadastral.blockNo);
  const [subdivision, setSubdivision] = useState(app.cadastral.subdivisionOrSitio);
  const [barangay, setBarangay] = useState(app.cadastral.barangay);
  const [tctNo, setTctNo] = useState(app.cadastral.tctNo);
  const [taxDecNo, setTaxDecNo] = useState(app.cadastral.taxDeclarationNo);

  const [storeys, setStoreys] = useState(app.buildingDetails.storeys);
  const [floorArea, setFloorArea] = useState(app.buildingDetails.totalFloorArea);
  const [lotArea, setLotArea] = useState(app.buildingDetails.lotArea);
  const [totalCost, setTotalCost] = useState(app.valuation.totalEstimatedCost);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const buildingCost = Math.round(totalCost * 0.65);
    const electricalCost = Math.round(totalCost * 0.15);
    const plumbingCost = Math.round(totalCost * 0.12);
    const mechanicalCost = app.valuation.mechanicalCost > 0 ? Math.round(totalCost * 0.08) : 0;

    const updatedApp: PermitApplication = {
      ...app,
      owner: {
        ...app.owner,
        enterpriseName,
        signatoryName,
        address,
        contactNumber,
        ctcNumber,
        ctcDateIssued,
      },
      cadastral: {
        ...app.cadastral,
        lotNo,
        blockNo,
        subdivisionOrSitio: subdivision,
        barangay,
        tctNo,
        taxDeclarationNo: taxDecNo,
      },
      buildingDetails: {
        ...app.buildingDetails,
        storeys,
        totalFloorArea: floorArea,
        lotArea,
      },
      valuation: {
        ...app.valuation,
        buildingCost,
        electricalCost,
        plumbingCost,
        mechanicalCost,
        totalEstimatedCost: totalCost,
      },
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onSave(updatedApp);
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

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Edit Application: <span className="font-mono text-amber-800">{app.serialNumber}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Update owner, cadastral records, and valuation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Owner */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Owner / Enterprise Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Entity / Owner Name</label>
                <input
                  type="text"
                  value={enterpriseName}
                  onChange={(e) => setEnterpriseName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Authorized Signatory</label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Owner Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cadastral */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
              Cadastral & Land Registry
            </div>
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
                <label className="block text-slate-700 font-bold mb-1">Subdivision</label>
                <input
                  type="text"
                  value={subdivision}
                  onChange={(e) => setSubdivision(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Barangay</label>
                <input
                  type="text"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">TCT Number (RD Cavite)</label>
                <input
                  type="text"
                  value={tctNo}
                  onChange={(e) => setTctNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Tax Declaration (Assessor)
                </label>
                <input
                  type="text"
                  value={taxDecNo}
                  onChange={(e) => setTaxDecNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Cost & Building */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Building Specifications & Valuation
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              <div>
                <label className="block text-slate-700 font-bold mb-1">Total Valuation (PHP)</label>
                <input
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-emerald-700 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
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
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
