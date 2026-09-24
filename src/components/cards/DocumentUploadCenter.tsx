import React, { useState } from 'react';
import {
  FileCheck2,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
  Flag,
  Search,
  Filter,
  Check,
  File,
  ShieldCheck,
  Paperclip,
} from 'lucide-react';
import {
  RequirementItem,
  RequirementCategory,
  RequirementStatus,
  UploadedDocument,
} from '../../types/permit';

interface DocumentUploadCenterProps {
  requirements: RequirementItem[];
  onUploadFile: (requirementId: string, file: File) => void;
  onDeleteFile: (requirementId: string, fileId: string) => void;
  onToggleVerification: (requirementId: string) => void;
  onOpenFlagModalForDoc: (requirement: RequirementItem) => void;
  onPreviewDocument: (doc: UploadedDocument, reqTitle: string) => void;
}

export const DocumentUploadCenter: React.FC<DocumentUploadCenterProps> = ({
  requirements,
  onUploadFile,
  onDeleteFile,
  onToggleVerification,
  onOpenFlagModalForDoc,
  onPreviewDocument,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Cadastral & Legal',
    'Drawing Plans (20x30)',
    'Application Forms',
    'Professional Credentials',
    'Estimates & Specs',
    'Technical Computations',
    'Clearances & Certifications',
    'Contractor Compliance',
  ];

  const filteredRequirements = requirements.filter((req) => {
    if (activeCategory !== 'ALL' && req.category !== activeCategory) return false;
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (
      searchTerm &&
      !req.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !req.specification.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const verifiedCount = requirements.filter(
    (r) => r.status === 'Verified' || r.status === 'Exempt / Not Applicable'
  ).length;
  const flaggedCount = requirements.filter((r) => r.status === 'Flagged with Issues').length;
  const pendingCount = requirements.filter(
    (r) => r.status === 'Pending Upload' || r.status === 'Uploaded'
  ).length;

  const getStatusBadge = (status: RequirementStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-700" />
            Verified
          </span>
        );
      case 'Flagged with Issues':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-700" />
            Issues Flagged
          </span>
        );
      case 'Uploaded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <FileText className="w-3 h-3 text-sky-700" />
            Uploaded (Pending Review)
          </span>
        );
      case 'Exempt / Not Applicable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Exempt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            Pending Upload
          </span>
        );
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, reqId: string) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFile(reqId, e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, reqId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFile(reqId, e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>General Trias Building Permit Requirements & Upload Center</span>
              <span className="text-xs font-mono font-medium text-slate-500">
                (CBRDGTC Checklist · {requirements.length} Mandatory Items)
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Drag-and-drop file upload, completeness auditing, and document-level issue verification
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <strong className="font-bold">{verifiedCount}</strong> Verified
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
            <strong className="font-bold">{flaggedCount}</strong> Flagged
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
            <strong className="font-bold">{pendingCount}</strong> Pending
          </span>
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search checklist (e.g. Lot Plan, TCT, CSHP, Blueprint, Notarized)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Flagged with Issues">Flagged Only</option>
              <option value="Pending Upload">Pending Upload</option>
              <option value="Uploaded">Uploaded Only</option>
            </select>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 font-semibold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-3">
        {filteredRequirements.map((req) => {
          const hasFiles = req.uploadedFiles && req.uploadedFiles.length > 0;
          return (
            <div
              key={req.id}
              className={`p-4 rounded-xl border transition-all ${
                req.status === 'Verified'
                  ? 'bg-emerald-50/20 border-emerald-200 hover:border-emerald-300'
                  : req.status === 'Flagged with Issues'
                  ? 'bg-rose-50/30 border-rose-200 hover:border-rose-400'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                {/* Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-700">
                      ITEM {req.itemNo}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {req.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    {getStatusBadge(req.status)}
                    {req.mandatoryCopies > 0 && (
                      <span className="text-[11px] text-slate-500 font-mono font-semibold">
                        ({req.mandatoryCopies} Copies Required)
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">{req.title}</h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{req.specification}</p>

                  {req.notes && (
                    <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-md border border-amber-200 mt-1 font-medium">
                      <strong className="text-amber-900">Audit Note:</strong> {req.notes}
                    </div>
                  )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-start shrink-0 flex-wrap">
                  {/* Flag Button */}
                  <button
                    onClick={() => onOpenFlagModalForDoc(req)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition-colors cursor-pointer"
                    title="Flag a deficiency or missing item on this document"
                  >
                    <Flag className="w-3.5 h-3.5 text-rose-600" />
                    <span>Flag Issue</span>
                  </button>

                  {/* Toggle Verification */}
                  <button
                    onClick={() => onToggleVerification(req.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      req.status === 'Verified'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{req.status === 'Verified' ? '✓ Verified' : 'Mark Verified'}</span>
                  </button>
                </div>
              </div>

              {/* Upload Drop Zone & Uploaded Files */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                {/* Upload Trigger / Dropzone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFileDrop(e, req.id)}
                  className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-dashed border-slate-300 hover:border-amber-500 transition-colors text-xs shadow-xs"
                >
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Upload className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Drag & drop signed document (PDF, PNG, JPG) or browse file</span>
                  </div>

                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-md cursor-pointer transition-colors whitespace-nowrap">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileInput(e, req.id)}
                    />
                  </label>
                </div>

                {/* Uploaded Files Pills / List */}
                {hasFiles && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Attached Document Files ({req.uploadedFiles.length}):
                    </div>
                    {req.uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs shadow-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                          <span className="text-slate-900 font-mono truncate font-bold">
                            {file.name}
                          </span>
                          <span className="text-slate-500 text-[11px] shrink-0 font-medium">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                          {file.verifiedBy && (
                            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                              Checked: {file.verifiedBy}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onPreviewDocument(file, req.title)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                            title="Inspect / Preview Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteFile(req.id, file.id)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-700 transition-colors cursor-pointer border border-slate-200"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredRequirements.length === 0 && (
          <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-xl">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-800">No Requirements Matched</div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Try resetting the filter or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
