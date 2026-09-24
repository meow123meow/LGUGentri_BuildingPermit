import React, { useState, useEffect } from 'react';
import { X, HardHat, Save } from 'lucide-react';
import { SignatoryProfessional } from '../../types/permit';

interface AddProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalToEdit?: SignatoryProfessional | null;
  onSaveProfessional: (prof: SignatoryProfessional) => void;
}

export const AddProfessionalModal: React.FC<AddProfessionalModalProps> = ({
  isOpen,
  onClose,
  professionalToEdit,
  onSaveProfessional,
}) => {
  const [role, setRole] = useState<SignatoryProfessional['role']>(
    'Architect (Design & Inspector)'
  );
  const [name, setName] = useState('');
  const [prcNo, setPrcNo] = useState('');
  const [prcExpiry, setPrcExpiry] = useState('');
  const [ptrNo, setPtrNo] = useState('');
  const [ptrDate, setPtrDate] = useState('2026-01-15');
  const [ptrPlace, setPtrPlace] = useState('General Trias, Cavite');
  const [tin, setTin] = useState('');
  const [iapoaNo, setIapoaNo] = useState('');
  const [address, setAddress] = useState('General Trias, Cavite');
  const [signatureStatus, setSignatureStatus] = useState<SignatoryProfessional['signatureStatus']>(
    'Signed & Sealed'
  );
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (professionalToEdit) {
      setRole(professionalToEdit.role);
      setName(professionalToEdit.name);
      setPrcNo(professionalToEdit.prcNo);
      setPrcExpiry(professionalToEdit.prcExpiry);
      setPtrNo(professionalToEdit.ptrNo);
      setPtrDate(professionalToEdit.ptrDate);
      setPtrPlace(professionalToEdit.ptrPlace);
      setTin(professionalToEdit.tin);
      setIapoaNo(professionalToEdit.iapoaNo || '');
      setAddress(professionalToEdit.address);
      setSignatureStatus(professionalToEdit.signatureStatus);
      setNotes(professionalToEdit.notes || '');
    } else {
      setName('');
      setPrcNo('');
      setPrcExpiry('2028-01-01');
      setPtrNo('');
      setTin('');
      setIapoaNo('');
      setNotes('');
      setSignatureStatus('Signed & Sealed');
    }
  }, [professionalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const prof: SignatoryProfessional = {
      id: professionalToEdit?.id || `prof-${Date.now()}`,
      role,
      name: name.trim(),
      prcNo: prcNo.trim() || 'N/A',
      prcExpiry: prcExpiry || '--',
      ptrNo: ptrNo.trim() || 'N/A',
      ptrDate,
      ptrPlace,
      tin: tin.trim() || 'N/A',
      iapoaNo: iapoaNo.trim() || undefined,
      address,
      signatureStatus,
      isCompliant: signatureStatus === 'Signed & Sealed',
      notes: notes.trim() || undefined,
    };

    onSaveProfessional(prof);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {professionalToEdit ? 'Edit Signatory Credentials' : 'Add Licensed Professional'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              PRC License, PTR receipt, TIN, and IAPOA validity record
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Professional Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as SignatoryProfessional['role'])}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="Architect (Design & Inspector)">Architect (Design & Inspector)</option>
              <option value="Civil / Structural Engineer">Civil / Structural Engineer</option>
              <option value="Professional Electrical Engineer (PEE)">
                Professional Electrical Engineer (PEE)
              </option>
              <option value="Registered Electrical Engineer (REE - In-Charge)">
                Registered Electrical Engineer (REE - In-Charge)
              </option>
              <option value="Master Plumber / Sanitary Engineer">
                Master Plumber / Sanitary Engineer
              </option>
              <option value="Professional Mechanical Engineer (PME)">
                Professional Mechanical Engineer (PME)
              </option>
              <option value="Geodetic Engineer">Geodetic Engineer</option>
              <option value="Geotechnical Engineer">Geotechnical Engineer</option>
              <option value="Electronics Engineer">Electronics Engineer</option>
              <option value="Notary Public">Notary Public</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Engr. Juan S. Santos, PICE"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">PRC License No.</label>
              <input
                type="text"
                value={prcNo}
                onChange={(e) => setPrcNo(e.target.value)}
                placeholder="e.g. 0017586"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">PRC Validity Date</label>
              <input
                type="date"
                value={prcExpiry}
                onChange={(e) => setPrcExpiry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">PTR Number</label>
              <input
                type="text"
                value={ptrNo}
                onChange={(e) => setPtrNo(e.target.value)}
                placeholder="e.g. 0917788"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">PTR Place Issued</label>
              <input
                type="text"
                value={ptrPlace}
                onChange={(e) => setPtrPlace(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">TIN</label>
              <input
                type="text"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                placeholder="e.g. 221-051-108-000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">IAPOA No. (Optional)</label>
              <input
                type="text"
                value={iapoaNo}
                onChange={(e) => setIapoaNo(e.target.value)}
                placeholder="e.g. 001191-..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Signature & Seal Status</label>
            <select
              value={signatureStatus}
              onChange={(e) =>
                setSignatureStatus(e.target.value as SignatoryProfessional['signatureStatus'])
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="Signed & Sealed">Signed & Sealed (Compliant)</option>
              <option value="Signed Only">Signed Only (Missing Seal)</option>
              <option value="Missing Seal">Missing Seal</option>
              <option value="Pending Signature">Pending Signature</option>
              <option value="Missing / Required">Missing / Required</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Notes / Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prepared and certified structural computation sheets."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
