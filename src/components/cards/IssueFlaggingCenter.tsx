import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Scale,
  Wrench,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  Undo2,
  Trash2,
  Filter,
  Info,
} from 'lucide-react';
import { FlaggedIssue, IssueSeverity, IssueStatus } from '../../types/permit';

interface IssueFlaggingCenterProps {
  issues: FlaggedIssue[];
  onOpenAddIssueModal: () => void;
  onToggleIssueStatus: (issueId: string) => void;
  onDeleteIssue: (issueId: string) => void;
}

export const IssueFlaggingCenter: React.FC<IssueFlaggingCenterProps> = ({
  issues,
  onOpenAddIssueModal,
  onToggleIssueStatus,
  onDeleteIssue,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | IssueSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  const filteredIssues = issues.filter((issue) => {
    if (severityFilter !== 'ALL' && issue.severity !== severityFilter) return false;
    if (statusFilter === 'OPEN' && issue.status !== 'Open') return false;
    if (statusFilter === 'RESOLVED' && issue.status !== 'Resolved') return false;
    return true;
  });

  const openCount = issues.filter((i) => i.status === 'Open').length;
  const criticalCount = issues.filter((i) => i.status === 'Open' && i.severity === 'CRITICAL').length;
  const legalCount = issues.filter((i) => i.status === 'Open' && i.severity === 'LEGAL').length;
  const techCount = issues.filter((i) => i.status === 'Open' && i.severity === 'TECHNICAL').length;
  const adminCount = issues.filter((i) => i.status === 'Open' && i.severity === 'ADMIN').length;

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            CRITICAL
          </span>
        );
      case 'LEGAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Scale className="w-3 h-3 text-purple-600" />
            LEGAL / JURAT
          </span>
        );
      case 'TECHNICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Wrench className="w-3 h-3 text-amber-600" />
            TECHNICAL
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <FileSpreadsheet className="w-3 h-3 text-sky-600" />
            ADMIN / DATE
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Discrepancy & Issue Flagging Center</span>
              {openCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  {openCount} Open
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  All Clear
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Audit findings, missing ancillary forms, jurat omissions, and technical rectifications
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddIssueModal}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Flag New Issue</span>
        </button>
      </div>

      {/* Filter and Metric Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto max-w-full">
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              severityFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setSeverityFilter('CRITICAL')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              severityFilter === 'CRITICAL'
                ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <span>Critical</span>
            {criticalCount > 0 && <span className="text-[10px] font-mono font-bold">({criticalCount})</span>}
          </button>
          <button
            onClick={() => setSeverityFilter('LEGAL')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              severityFilter === 'LEGAL'
                ? 'bg-purple-100 text-purple-900 border border-purple-300 shadow-xs'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            <span>Legal</span>
            {legalCount > 0 && <span className="text-[10px] font-mono font-bold">({legalCount})</span>}
          </button>
          <button
            onClick={() => setSeverityFilter('TECHNICAL')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              severityFilter === 'TECHNICAL'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <span>Technical</span>
            {techCount > 0 && <span className="text-[10px] font-mono font-bold">({techCount})</span>}
          </button>
          <button
            onClick={() => setSeverityFilter('ADMIN')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              severityFilter === 'ADMIN'
                ? 'bg-sky-100 text-sky-900 border border-sky-300 shadow-xs'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            <span>Admin</span>
            {adminCount > 0 && <span className="text-[10px] font-mono font-bold">({adminCount})</span>}
          </button>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'ALL' ? 'text-slate-950 font-bold underline' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Status
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={() => setStatusFilter('OPEN')}
            className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'OPEN' ? 'text-amber-800 font-bold underline' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Open Only
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={() => setStatusFilter('RESOLVED')}
            className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'RESOLVED' ? 'text-emerald-800 font-bold underline' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.map((issue) => {
          const isResolved = issue.status === 'Resolved';
          return (
            <div
              key={issue.id}
              className={`p-4 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-slate-50 border-slate-200 opacity-70'
                  : issue.severity === 'CRITICAL'
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400'
                  : issue.severity === 'LEGAL'
                  ? 'bg-purple-50/40 border-purple-200 hover:border-purple-400'
                  : issue.severity === 'TECHNICAL'
                  ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSeverityBadge(issue.severity)}
                    <span className="text-xs font-semibold text-slate-600">
                      Target: <strong className="text-slate-900">{issue.targetDocument}</strong>
                    </span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-[11px] text-slate-500 font-mono">Flagged: {issue.flaggedAt}</span>
                  </div>

                  <h4
                    className={`text-sm font-bold mt-1 ${
                      isResolved ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                  >
                    {issue.title}
                  </h4>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-start mt-2 sm:mt-0">
                  <button
                    onClick={() => onToggleIssueStatus(issue.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      isResolved
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Reopen</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteIssue(issue.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Delete this issue record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-800 font-medium mt-2 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                {issue.description}
              </p>

              {/* Required Rectification */}
              <div className="mt-2.5 flex items-start gap-1.5 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900">Required Rectification:</strong> {issue.rectification}
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between">
                <span>Evaluator: {issue.flaggedBy}</span>
                {isResolved && issue.resolvedAt && (
                  <span className="text-emerald-700 font-bold">
                    Resolved at {issue.resolvedAt} by {issue.resolvedBy || 'Processor'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredIssues.length === 0 && (
          <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-900">No Flagged Issues In This Filter</div>
            <p className="text-xs text-slate-500 mt-0.5">
              All documents are compliant or no issues have been raised under this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
