import React, { useState } from 'react';
import { X, Flag, AlertTriangle, AlertOctagon, Scale, Wrench, FileSpreadsheet } from 'lucide-react';
import { FlaggedIssue, IssueSeverity, RequirementItem } from '../../types/permit';

interface FlagIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRequirement?: RequirementItem | null;
  onSaveIssue: (issue: Omit<FlaggedIssue, 'id' | 'flaggedAt' | 'status'>) => void;
}

export const FlagIssueModal: React.FC<FlagIssueModalProps> = ({
  isOpen,
  onClose,
  targetRequirement,
  onSaveIssue,
}) => {
  const [severity, setSeverity] = useState<IssueSeverity>('TECHNICAL');
  const [targetDocument, setTargetDocument] = useState(
    targetRequirement ? targetRequirement.title : 'General Permit Submission'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rectification, setRectification] = useState('');
  const [flaggedBy, setFlaggedBy] = useState('Engr. Plan Evaluator (CBRDGTC)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSaveIssue({
      requirementId: targetRequirement?.id,
      targetDocument: targetDocument.trim(),
      severity,
      title: title.trim(),
      description: description.trim(),
      rectification: rectification.trim() || 'Provide complete and signed document for re-evaluation.',
      flaggedBy: flaggedBy.trim() || 'Document Processor (CBRDGTC)',
    });

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
          <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Flag Document Defect or Issue</h3>
            <p className="text-xs text-slate-500 font-medium">
              Record a deficiency on the building permit checklist for applicant rectification
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Document */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Target Document / Section *</label>
            <input
              type="text"
              value={targetDocument}
              onChange={(e) => setTargetDocument(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Severity Selector */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Deficiency Severity *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSeverity('CRITICAL')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  severity === 'CRITICAL'
                    ? 'bg-rose-100 border-rose-400 text-rose-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <AlertOctagon className="w-4 h-4 mx-auto mb-1 text-rose-600" />
                <div className="text-[10px]">CRITICAL</div>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('LEGAL')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  severity === 'LEGAL'
                    ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Scale className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                <div className="text-[10px]">LEGAL/JURAT</div>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('TECHNICAL')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  severity === 'TECHNICAL'
                    ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Wrench className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                <div className="text-[10px]">TECHNICAL</div>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('ADMIN')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  severity === 'ADMIN'
                    ? 'bg-sky-100 border-sky-400 text-sky-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                <div className="text-[10px]">ADMIN/DATE</div>
              </button>
            </div>
          </div>

          {/* Issue Headline */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Issue Summary / Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Missing Mechanical Permit & Professional Engineer Seal"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Detailed Finding / Reason *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe the discrepancy, missing signatures, blank tables, or missing clearance..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Required Rectification */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Required Applicant Rectification *
            </label>
            <textarea
              rows={2}
              value={rectification}
              onChange={(e) => setRectification(e.target.value)}
              required
              placeholder="State exactly what the applicant, architect, or engineer must submit to clear this issue..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Evaluator */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Evaluator / Processor Name</label>
            <input
              type="text"
              value={flaggedBy}
              onChange={(e) => setFlaggedBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Submit */}
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
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-md"
            >
              <Flag className="w-4 h-4" />
              <span>Flag Defect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
