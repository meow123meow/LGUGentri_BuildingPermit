import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Scale,
  Wrench,
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  Undo2,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { PermitApplication, IssueSeverity } from '../../types/permit';

interface MasterIssuesViewProps {
  applications: PermitApplication[];
  onOpenAudit: (appId: string) => void;
  onToggleIssueStatus: (appId: string, issueId: string) => void;
  onOpenAddIssueModal: () => void;
}

export const MasterIssuesView: React.FC<MasterIssuesViewProps> = ({
  applications,
  onOpenAudit,
  onToggleIssueStatus,
  onOpenAddIssueModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | IssueSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  // Collate all issues across applications
  const allIssues = applications.flatMap((app) =>
    app.flaggedIssues.map((issue) => ({
      issue,
      app,
    }))
  );

  const filtered = allIssues.filter(({ issue, app }) => {
    if (severityFilter !== 'ALL' && issue.severity !== severityFilter) return false;
    if (statusFilter === 'OPEN' && issue.status !== 'Open') return false;
    if (statusFilter === 'RESOLVED' && issue.status !== 'Resolved') return false;

    if (
      searchTerm &&
      !issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !issue.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !issue.targetDocument.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.serialNumber.includes(searchTerm) &&
      !app.owner.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            CRITICAL
          </span>
        );
      case 'LEGAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Scale className="w-3 h-3 text-purple-600" />
            LEGAL / JURAT
          </span>
        );
      case 'TECHNICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Wrench className="w-3 h-3 text-amber-600" />
            TECHNICAL
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <FileSpreadsheet className="w-3 h-3 text-sky-600" />
            ADMIN / DATE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Master Issues & Discrepancies Registry
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cross-application tracker for missing ancillary permits, jurat identification defects, and technical omissions
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddIssueModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Flag New Issue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search defects by title, target document, serial no., or applicant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as 'ALL' | IssueSeverity)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="LEGAL">Legal / Jurat Only</option>
            <option value="TECHNICAL">Technical Only</option>
            <option value="ADMIN">Admin / Date Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'OPEN' | 'RESOLVED')}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open Deficiencies Only</option>
            <option value="RESOLVED">Resolved Only</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filtered.map(({ issue, app }) => {
          const isResolved = issue.status === 'Resolved';
          return (
            <div
              key={`${app.id}-${issue.id}`}
              className={`p-4 rounded-xl border bg-white shadow-xs transition-all ${
                isResolved
                  ? 'border-slate-200 opacity-75'
                  : issue.severity === 'CRITICAL'
                  ? 'border-rose-300 bg-rose-50/20'
                  : issue.severity === 'LEGAL'
                  ? 'border-purple-300 bg-purple-50/20'
                  : issue.severity === 'TECHNICAL'
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSeverityBadge(issue.severity)}
                    <button
                      onClick={() => onOpenAudit(app.id)}
                      className="font-mono text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                    >
                      <span>Serial: {app.serialNumber}</span>
                      <ExternalLink className="w-3 h-3 text-amber-600" />
                    </button>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-900 text-xs">
                      {app.owner.enterpriseName}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500">Target: {issue.targetDocument}</span>
                  </div>

                  <h3
                    className={`text-sm font-bold mt-1 ${
                      isResolved ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                  >
                    {issue.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start shrink-0">
                  <button
                    onClick={() => onToggleIssueStatus(app.id, issue.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isResolved
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
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
                        <span>Mark Resolved</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-medium mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {issue.description}
              </p>

              <div className="mt-2 text-xs text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                <strong>Required Rectification:</strong> {issue.rectification}
              </div>

              <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between font-medium">
                <span>Evaluator: {issue.flaggedBy}</span>
                {isResolved && issue.resolvedAt && (
                  <span className="text-emerald-800 font-bold">
                    Resolved at {issue.resolvedAt} by {issue.resolvedBy || 'Processor'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-900">No Issues Found in Current Filter</div>
            <p className="text-xs text-slate-500 mt-0.5">All applications are clear of deficiencies.</p>
          </div>
        )}
      </div>
    </div>
  );
};
