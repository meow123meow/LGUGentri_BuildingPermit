import React from 'react';
import {
  ListChecks,
  CheckCircle,
  AlertOctagon,
  FileText,
  Printer,
  Stamp,
  UserCheck,
  Send,
  Building,
} from 'lucide-react';
import { PermitApplication } from '../../types/permit';

interface AuditPunchlistRoutingProps {
  app: PermitApplication;
  onPrintReport: () => void;
}

export const AuditPunchlistRouting: React.FC<AuditPunchlistRoutingProps> = ({
  app,
  onPrintReport,
}) => {
  const openIssues = app.flaggedIssues.filter((i) => i.status === 'Open');
  const isReady = openIssues.length === 0 && app.auditSummary.complianceRate >= 95;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Document Processor Actionable Punchlist & Official Routing</span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {isReady ? 'CLEARED FOR PERMIT ISSUANCE' : `${openIssues.length} ACTION ITEMS REMAINING`}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              City of General Trias CBRDGTC Technical Evaluation & Routing Endorsement
            </p>
          </div>
        </div>

        <button
          onClick={onPrintReport}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-amber-600" />
          <span>Generate Routing Slip</span>
        </button>
      </div>

      {/* Action Punchlist Grid */}
      <div className="space-y-2.5">
        {openIssues.map((issue, idx) => (
          <div
            key={issue.id}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
              {idx + 1}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{issue.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 font-mono font-bold border border-slate-300">
                  {issue.severity}
                </span>
              </div>
              <div className="text-slate-700 font-medium leading-relaxed">{issue.rectification}</div>
              <div className="text-[11px] text-slate-500 font-medium">Target: {issue.targetDocument}</div>
            </div>
          </div>
        ))}

        {openIssues.length === 0 && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3 text-xs text-emerald-900">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <strong className="text-sm font-bold text-emerald-950 block">
                All Document Completeness & Jurat Checks Verified
              </strong>
              This application has completed all 16 General Trias CBRDGTC checklist items and has 0 open
              discrepancies. It is ready for official assessment and Building Permit clearance.
            </div>
          </div>
        )}
      </div>

      {/* Official Sign-off & Routing Box */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
            Reviewing Officer:
          </span>
          <span className="font-bold text-slate-900 mt-0.5 block">{app.auditSummary.reviewerName}</span>
          <span className="text-[11px] text-slate-600 block">{app.auditSummary.reviewerOffice}</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
            Last Audit Timestamp:
          </span>
          <span className="font-mono font-bold text-slate-900 mt-0.5 block">{app.auditSummary.reviewedAt}</span>
          <span className="text-[11px] text-slate-600 block font-medium">Area Code: {app.areaCode}</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
            Building Official Status:
          </span>
          <span
            className={`font-bold mt-0.5 inline-block ${
              isReady ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {isReady ? 'Recommended for Issuance' : 'Pending Applicant Rectification'}
          </span>
        </div>
      </div>
    </div>
  );
};
