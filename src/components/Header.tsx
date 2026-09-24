import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  Plus,
  RotateCcw,
  Download,
  Printer,
  ChevronDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Menu,
  Sparkles,
} from 'lucide-react';
import { PermitApplication } from '../types/permit';
import { ActiveView } from './Sidebar';

interface HeaderProps {
  applications: PermitApplication[];
  activeApp: PermitApplication;
  activeView: ActiveView;
  onSelectApplication: (id: string) => void;
  onOpenNewAppModal: () => void;
  onOpenAiAuditModal: () => void;
  onResetToSeed: () => void;
  onExportJson: () => void;
  onPrintReport: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  applications,
  activeApp,
  activeView,
  onSelectApplication,
  onOpenNewAppModal,
  onOpenAiAuditModal,
  onResetToSeed,
  onExportJson,
  onPrintReport,
  onToggleMobileSidebar,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredApps = applications.filter(
    (app) =>
      app.serialNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.referenceCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.owner.enterpriseName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.cadastral.barangay.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getViewTitle = () => {
    switch (activeView) {
      case 'applicants-database':
        return 'Applicants & Property Owners Database';
      case 'engineers-database':
        return 'Signatory Engineers & Legal Professionals Registry';
      case 'master-issues':
        return 'Discrepancies & Deficiencies Center';
      default:
        return 'Permit Completeness Audit';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 shadow-xs no-print">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Zone: Mobile toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors lg:hidden cursor-pointer"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                City Building Regulatory Division (CBRDGTC)
              </span>
              <span className="text-slate-300 text-xs">/</span>
              <span className="text-xs font-bold text-amber-800">
                {getViewTitle()}
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{activeApp.owner.enterpriseName}</span>
              <span className="text-xs font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                {activeApp.serialNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Zone: Quick Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-all text-left text-xs font-semibold text-slate-800 cursor-pointer shadow-2xs"
            >
              <div className="w-2 h-2 rounded-full shrink-0 bg-amber-500" />
              <div className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[260px]">
                <span className="font-mono text-amber-800 font-bold">{activeApp.serialNumber}</span>
                <span className="text-slate-400">·</span>
                <span className="truncate text-slate-700">{activeApp.owner.enterpriseName}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50">
                <div className="p-1.5 border-b border-slate-100">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Quick switch application..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-8 pr-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                  {filteredApps.map((app) => {
                    const isSelected = app.id === activeApp.id;
                    return (
                      <button
                        key={app.id}
                        onClick={() => {
                          onSelectApplication(app.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border border-amber-300 text-slate-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-amber-700">{app.serialNumber}</span>
                            <span className="font-semibold text-slate-900 truncate">{app.owner.enterpriseName}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {app.cadastral.barangay} · {app.characterOfOccupancy}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            app.auditSummary.overallStatus === 'Ready for Approval'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {app.auditSummary.complianceRate}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* AI Audit & Auto Fill Primary Button */}
          <button
            onClick={onOpenAiAuditModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Scan & Auto-Fill</span>
          </button>

          {/* Action Buttons */}
          <button
            onClick={onOpenNewAppModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>

          <button
            onClick={onPrintReport}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            title="Print Official Audit Summary"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            title="Export full database as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onResetToSeed}
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg transition-colors shadow-2xs cursor-pointer"
            title="Reset database to initial sample records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
