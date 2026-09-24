import React, { useState } from 'react';
import {
  Building2,
  LayoutDashboard,
  Users,
  HardHat,
  AlertTriangle,
  FileCheck,
  Plus,
  Search,
  ChevronRight,
  ShieldCheck,
  FileText,
  BadgeCheck,
  Sparkles,
  Zap,
  Trash2,
} from 'lucide-react';
import { PermitApplication } from '../types/permit';

export type ActiveView = 'audit-dashboard' | 'applicants-database' | 'engineers-database' | 'master-issues';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  applications: PermitApplication[];
  activeAppId: string;
  onSelectApplication: (id: string) => void;
  onOpenNewAppModal: () => void;
  onOpenAiAuditModal: () => void;
  onDeleteApplication?: (id: string, serialNumber: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  applications,
  activeAppId,
  onSelectApplication,
  onOpenNewAppModal,
  onOpenAiAuditModal,
  onDeleteApplication,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [appSearch, setAppSearch] = useState('');

  const filteredApps = applications.filter(
    (app) =>
      app.serialNumber.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.owner.enterpriseName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.cadastral.barangay.toLowerCase().includes(appSearch.toLowerCase())
  );

  const totalOpenIssues = applications.reduce(
    (acc, app) => acc + app.flaggedIssues.filter((i) => i.status === 'Open').length,
    0
  );

  // Collect unique engineers count across all applications
  const uniqueEngineersCount = new Set(
    applications.flatMap((a) => a.professionals.map((p) => p.prcNo || p.name))
  ).size;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } no-print shadow-sm`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-slate-900">City of GenTri</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-mono font-bold border border-amber-300">
                    CBRD
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Building Permit Document Registry</p>
              </div>
            </div>
          </div>

          {/* AI Document Audit CTA */}
          <div className="p-3 border-b border-slate-200 bg-amber-50/50">
            <button
              onClick={() => {
                onOpenAiAuditModal();
                onCloseMobile();
              }}
              className="w-full group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/30 backdrop-blur-xs text-slate-950">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-950 flex items-center gap-1">
                    <span>AI Document Audit</span>
                    <span className="text-[9px] px-1 rounded bg-slate-950 text-amber-300 font-mono">NEW</span>
                  </div>
                  <div className="text-[10px] text-slate-900 font-medium leading-tight">
                    Upload image/PDF to Auto-Fill
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          {/* Primary Navigation Links */}
          <div className="p-3 space-y-1 border-b border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Portal Modules
            </div>

            <button
              onClick={() => {
                onSelectView('audit-dashboard');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeView === 'audit-dashboard'
                  ? 'bg-amber-50 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard
                  className={`w-4 h-4 ${
                    activeView === 'audit-dashboard' ? 'text-amber-700' : 'text-slate-500'
                  }`}
                />
                <span>Active Permit Bento Audit</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                Live Grid
              </span>
            </button>

            <button
              onClick={() => {
                onSelectView('applicants-database');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeView === 'applicants-database'
                  ? 'bg-amber-50 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users
                  className={`w-4 h-4 ${
                    activeView === 'applicants-database' ? 'text-amber-700' : 'text-slate-500'
                  }`}
                />
                <span>Applicants & Owners List</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                {applications.length} Files
              </span>
            </button>

            <button
              onClick={() => {
                onSelectView('engineers-database');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeView === 'engineers-database'
                  ? 'bg-amber-50 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardHat
                  className={`w-4 h-4 ${
                    activeView === 'engineers-database' ? 'text-amber-700' : 'text-slate-500'
                  }`}
                />
                <span>Signatory Engineers Database</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {uniqueEngineersCount} Pros
              </span>
            </button>

            <button
              onClick={() => {
                onSelectView('master-issues');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeView === 'master-issues'
                  ? 'bg-amber-50 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    activeView === 'master-issues' ? 'text-rose-600' : 'text-slate-500'
                  }`}
                />
                <span>Discrepancies & Deficiencies</span>
              </div>
              {totalOpenIssues > 0 ? (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                  {totalOpenIssues} Open
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Clear
                </span>
              )}
            </button>
          </div>

          {/* Quick Applications Jump List */}
          <div className="p-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filed Permit Applications ({applications.length})
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenNewAppModal}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  title="Manual Entry"
                >
                  <Plus className="w-3 h-3" />
                  <span>Manual</span>
                </button>
              </div>
            </div>

            {/* Quick Filter */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter serial / applicant..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            {/* Application List Items */}
            <div className="max-h-[260px] overflow-y-auto space-y-1 pr-1">
              {filteredApps.map((app) => {
                const isSelected = app.id === activeAppId;
                const openCount = app.flaggedIssues.filter((i) => i.status === 'Open').length;

                return (
                  <div
                    key={app.id}
                    className={`group relative w-full flex items-center justify-between gap-1 p-2 rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectApplication(app.id);
                        onSelectView('audit-dashboard');
                        onCloseMobile();
                      }}
                      className="flex-1 text-left truncate cursor-pointer"
                    >
                      <div className="truncate space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              isSelected ? 'text-amber-400' : 'text-amber-700'
                            }`}
                          >
                            {app.serialNumber}
                          </span>
                          <span className="truncate text-[11px]">{app.owner.enterpriseName}</span>
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {app.cadastral.barangay} · {app.characterOfOccupancy.split(' ')[0]}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          app.auditSummary.overallStatus === 'Ready for Approval'
                            ? 'bg-emerald-100 text-emerald-900'
                            : openCount > 0
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {app.auditSummary.complianceRate}%
                      </span>

                      {onDeleteApplication && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteApplication(app.id, app.serialNumber);
                          }}
                          className={`p-1 rounded transition-all cursor-pointer ${
                            isSelected
                              ? 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={`Delete application ${app.serialNumber}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredApps.length === 0 && (
                <div className="text-[11px] text-slate-400 text-center py-4">No matching records.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-300 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">LGU General Trias</div>
              <div className="text-[10px] text-slate-500 truncate">Document Processor Hub</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
