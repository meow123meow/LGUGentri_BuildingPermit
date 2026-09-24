import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  CheckCircle,
  Eye,
  ZoomIn,
  ZoomOut,
  Stamp,
  ShieldCheck,
  FileBadge,
} from 'lucide-react';
import { UploadedDocument } from '../../types/permit';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: UploadedDocument | null;
  requirementTitle: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
  requirementTitle,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || !document) return null;

  const isImage =
    document.type.includes('image') ||
    document.name.endsWith('.png') ||
    document.name.endsWith('.jpg') ||
    document.name.endsWith('.jpeg');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl relative overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-800 font-bold">{requirementTitle}</div>
              <h3 className="text-sm font-bold text-slate-900 font-mono truncate max-w-lg">
                {document.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-300">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold px-1.5 text-slate-700">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer Body */}
        <div className="flex-1 bg-slate-100 p-6 overflow-auto flex items-center justify-center relative">
          {document.dataUrl ? (
            isImage ? (
              <img
                src={document.dataUrl}
                alt={document.name}
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-xl transition-transform"
              />
            ) : (
              <iframe
                src={document.dataUrl}
                title={document.name}
                className="w-full h-full rounded-lg border border-slate-300 bg-white"
              />
            )
          ) : (
            /* Document Mock Inspector Preview with Official CBRDGTC Seal */
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
              className="w-[580px] bg-white border border-slate-300 rounded-xl p-8 shadow-xl space-y-6 transition-transform text-xs text-slate-900"
            >
              <div className="text-center border-b border-slate-200 pb-4">
                <div className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                  Republic of the Philippines · Province of Cavite
                </div>
                <div className="text-base font-black text-slate-900 tracking-tight mt-0.5">
                  CITY OF GENERAL TRIAS
                </div>
                <div className="text-xs font-bold text-slate-600">
                  OFFICE OF THE BUILDING OFFICIAL · CBRDGTC
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>DOCUMENT ARCHIVE ENTRY:</span>
                  <span className="font-mono text-amber-800 font-bold">{document.id}</span>
                </div>
                <div className="flex justify-between items-center text-slate-800 font-semibold">
                  <span>FILE ATTACHMENT:</span>
                  <span className="font-mono text-slate-900 truncate max-w-[280px] font-bold">{document.name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 font-medium">
                  <span>FILE METRICS:</span>
                  <span className="font-mono text-slate-600">
                    {(document.size / 1024 / 1024).toFixed(2)} MB · {document.type || 'application/pdf'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700 font-medium">
                  <span>TIMESTAMP:</span>
                  <span className="font-mono text-slate-600">{document.uploadedAt}</span>
                </div>
              </div>

              {document.remarks && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                  <strong>Inspection Notes:</strong> {document.remarks}
                </div>
              )}

              {/* Official Seal Mock Box */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center text-emerald-600 bg-emerald-50">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-800">DOCUMENT VALIDATED</div>
                    <div className="text-[10px] text-slate-600 font-semibold">
                      {document.verifiedBy || 'City Building Regulatory Division'}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-500 font-mono font-medium">
                  SECURITY CODE: GENTRI-OK-{Date.now().toString().slice(-6)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium shrink-0">
          <span>Uploaded: {document.uploadedAt}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
