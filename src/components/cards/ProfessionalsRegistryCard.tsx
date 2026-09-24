import React from 'react';
import {
  HardHat,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { SignatoryProfessional } from '../../types/permit';

interface ProfessionalsRegistryCardProps {
  professionals: SignatoryProfessional[];
  onOpenAddProfessionalModal: () => void;
  onEditProfessional: (prof: SignatoryProfessional) => void;
  onDeleteProfessional: (profId: string) => void;
}

export const ProfessionalsRegistryCard: React.FC<ProfessionalsRegistryCardProps> = ({
  professionals,
  onOpenAddProfessionalModal,
  onEditProfessional,
  onDeleteProfessional,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Licensed Signatory Engineers & Legal Officials Registry</span>
              <span className="text-xs font-mono font-medium text-slate-500">({professionals.length} Registered)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              PRC Licenses, PTR Tax Receipts, TIN, IAPOA Validities, and Signatory Statuses
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddProfessionalModal}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-600" />
          <span>Add Signatory</span>
        </button>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {professionals.map((prof) => {
          const isMissing = prof.signatureStatus === 'Missing / Required';
          return (
            <div
              key={prof.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isMissing
                  ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400'
                  : !prof.isCompliant
                  ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Role Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    {prof.role}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProfessional(prof)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Edit details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProfessional(prof.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div
                  className={`text-sm font-extrabold tracking-tight ${
                    isMissing ? 'text-rose-700' : 'text-slate-900'
                  }`}
                >
                  {prof.name}
                </div>

                {/* Metadata */}
                <div className="space-y-1.5 mt-2.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">PRC License:</span>
                    <span className="font-mono font-bold text-slate-900">{prof.prcNo}</span>
                  </div>

                  {prof.prcExpiry && prof.prcExpiry !== '--' && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-semibold">PRC Expiry:</span>
                      <span className="font-mono text-slate-700 text-[11px] font-medium">{prof.prcExpiry}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">PTR Number:</span>
                    <span className="font-mono font-bold text-slate-900">{prof.ptrNo}</span>
                  </div>

                  {prof.ptrPlace && prof.ptrPlace !== '--' && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-semibold">PTR Issued:</span>
                      <span className="text-slate-700 text-[11px] font-medium">
                        {prof.ptrPlace} {prof.ptrDate ? `(${prof.ptrDate})` : ''}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">TIN:</span>
                    <span className="font-mono text-slate-700 text-[11px] font-medium">{prof.tin}</span>
                  </div>

                  {prof.iapoaNo && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-semibold">IAPOA:</span>
                      <span className="font-mono text-slate-700 text-[11px] truncate max-w-[150px] font-medium">
                        {prof.iapoaNo}
                      </span>
                    </div>
                  )}
                </div>

                {/* Audit remarks */}
                {prof.notes && (
                  <div className="mt-2.5 text-[11px] p-2 rounded-md bg-white border border-slate-200 text-slate-600 leading-snug font-medium shadow-2xs">
                    {prof.notes}
                  </div>
                )}
              </div>

              {/* Seal & Signature Status */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Signature & Seal:</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    prof.signatureStatus === 'Signed & Sealed'
                      ? 'text-emerald-700'
                      : prof.signatureStatus === 'Missing / Required'
                      ? 'text-rose-700'
                      : 'text-amber-700'
                  }`}
                >
                  {prof.signatureStatus === 'Signed & Sealed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {prof.signatureStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
