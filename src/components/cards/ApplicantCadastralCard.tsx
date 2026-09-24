import React from 'react';
import { UserCheck, MapPin, Phone, Mail, FileBadge, ShieldAlert, Edit } from 'lucide-react';
import { PermitApplication } from '../../types/permit';

interface ApplicantCadastralCardProps {
  app: PermitApplication;
  onEdit: () => void;
}

export const ApplicantCadastralCard: React.FC<ApplicantCadastralCardProps> = ({ app, onEdit }) => {
  const { owner, cadastral } = app;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Applicant & Cadastral Profile
            </h3>
          </div>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            title="Edit Owner & Cadastral Info"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Owner Info */}
        <div className="space-y-3">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Registered Owner / Entity</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{owner.enterpriseName}</div>
            <div className="text-xs text-slate-700 flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="text-amber-800 font-bold">Signatory:</span> {owner.signatoryName}
              {owner.agentName && <span className="text-slate-500 text-[11px]">({owner.agentName})</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Contact Phone:</span>
              <span className="font-mono text-slate-900 font-bold">{owner.contactNumber}</span>
              {owner.secondaryContact && (
                <span className="text-slate-600 text-[11px] block font-mono font-medium">{owner.secondaryContact}</span>
              )}
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Community Tax Cert (CTC):</span>
              <span className="font-mono text-slate-900 font-semibold">
                {owner.ctcNumber || 'N/A'}{' '}
                <span className="text-slate-500 text-[10px] font-normal">
                  ({owner.ctcDateIssued ? `Issued ${owner.ctcDateIssued}` : 'No date'})
                </span>
              </span>
            </div>
          </div>

          <div className="text-xs pt-1">
            <span className="text-[11px] text-slate-500 font-semibold block">Owner Address:</span>
            <span className="text-slate-700 font-medium leading-snug">{owner.address}</span>
          </div>
        </div>
      </div>

      {/* Cadastral & Land Registry */}
      <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 md:-mx-6 md:-mb-6 p-4 md:p-5 rounded-b-2xl border-t border-slate-200/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Cadastral & Registry Details</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Lot & Block:</span>
            <span className="font-bold text-amber-800">
              {cadastral.lotNo}, {cadastral.blockNo}
            </span>
            <div className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
              {cadastral.subdivisionOrSitio}, {cadastral.barangay}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">TCT No. (Registry of Deeds):</span>
            <span className="font-mono text-slate-900 font-bold truncate block select-all">
              {cadastral.tctNo}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold block mt-1">Tax Declaration:</span>
            <span className="font-mono text-slate-700 text-[11px] font-medium select-all">
              {cadastral.taxDeclarationNo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
