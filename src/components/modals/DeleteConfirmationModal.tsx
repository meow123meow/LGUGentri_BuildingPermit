import React from 'react';
import { Trash2, AlertOctagon, X } from 'lucide-react';
import { PermitApplication } from '../../types/permit';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  app: PermitApplication | null;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  app,
}) => {
  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-8 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon and Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Delete Permit Application
            </h3>
            <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>This action cannot be undone</span>
            </p>
          </div>
        </div>

        {/* Target Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 my-4 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Serial Number:</span>
            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              {app.serialNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Enterprise / Owner:</span>
            <span className="font-bold text-slate-900 truncate max-w-[200px]" title={app.owner.enterpriseName}>
              {app.owner.enterpriseName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Signatory:</span>
            <span className="font-medium text-slate-800 truncate max-w-[200px]">
              {app.owner.signatoryName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Location:</span>
            <span className="font-medium text-slate-700 truncate max-w-[200px]">
              {app.cadastral.barangay}, General Trias
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Deleting this record will permanently remove all associated 16-point checklist verifications, uploaded document attachments, registered signatory engineers, and flagged punchlist issues.
        </p>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-slate-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-md shadow-rose-600/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Yes, Permanently Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
