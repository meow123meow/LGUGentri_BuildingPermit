import React from 'react';
import {
  FileText,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Calendar,
  Sparkles,
  Edit,
  Trash2,
} from 'lucide-react';
import { PermitApplication } from '../../types/permit';

interface ApplicationProfileCardProps {
  app: PermitApplication;
  onEdit: () => void;
  onDelete?: () => void;
}

export const ApplicationProfileCard: React.FC<ApplicationProfileCardProps> = ({ app, onEdit, onDelete }) => {
  const verifiedCount = app.requirements.filter((r) => r.status === 'Verified' || r.status === 'Exempt / Not Applicable').length;
  const totalCount = app.requirements.length;
  const openIssuesCount = app.flaggedIssues.filter((i) => i.status === 'Open').length;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden shadow-xs">
      <div>
        {/* Top Kicker and Serial Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-700 font-mono font-bold tracking-wide">
              <span>CBRDGTC FORM 1</span>
              <span>·</span>
              <span>AREA {app.areaCode}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 font-mono">
              {app.serialNumber}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
              title="Edit Application Profile"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer border border-slate-200 hover:border-rose-200"
                title="Delete Application"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                app.auditSummary.overallStatus === 'Ready for Approval'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : app.auditSummary.overallStatus === 'Action Required'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-sky-100 text-sky-900 border border-sky-300'
              }`}
            >
              {app.auditSummary.overallStatus}
            </span>
          </div>
        </div>

        {/* Reference & Core Meta */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Processing Reference Code</div>
            <div className="text-sm font-mono font-bold text-slate-900 mt-0.5 select-all">
              {app.referenceCode}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Application Type</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{app.applicationType}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Occupancy Group</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5 truncate" title={app.occupancyGroup}>
                {app.occupancyGroup.split(' - ')[0]} ({app.characterOfOccupancy.split(' ')[0]})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Storeys & Units</div>
              <div className="text-xs font-semibold text-slate-800 mt-0.5">
                {app.buildingDetails.storeys} Storeys · {app.buildingDetails.units} Unit
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Total Floor Area</div>
              <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                {app.buildingDetails.totalFloorArea.toLocaleString()} m²
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Compliance Meter */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-700 font-semibold">Compliance Readiness</span>
          <span className="font-mono font-bold text-amber-700">
            {app.auditSummary.complianceRate}% ({verifiedCount}/{totalCount} Items)
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              app.auditSummary.complianceRate >= 95
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : app.auditSummary.complianceRate >= 75
                ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                : 'bg-gradient-to-r from-rose-500 to-amber-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, app.auditSummary.complianceRate))}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-500 font-medium">
          <span>Reviewed by: {app.auditSummary.reviewerName}</span>
          <span className="text-amber-800 font-bold">{openIssuesCount} Open Issues</span>
        </div>
      </div>
    </div>
  );
};
