import React, { useState } from 'react';
import {
  HardHat,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  Plus,
  Edit2,
  Trash2,
  Download,
  ExternalLink,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { PermitApplication, SignatoryProfessional } from '../../types/permit';

interface EngineersDatabaseViewProps {
  applications: PermitApplication[];
  onOpenAudit: (appId: string) => void;
  onOpenAddProfessional: () => void;
  onEditProfessional: (prof: SignatoryProfessional, appId: string) => void;
}

interface CollationEntry {
  professional: SignatoryProfessional;
  application: PermitApplication;
}

export const EngineersDatabaseView: React.FC<EngineersDatabaseViewProps> = ({
  applications,
  onOpenAudit,
  onOpenAddProfessional,
  onEditProfessional,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [complianceFilter, setComplianceFilter] = useState('ALL');

  // Collate all professionals across all applications with their linked application metadata
  const collatedList: CollationEntry[] = applications.flatMap((app) =>
    app.professionals.map((prof) => ({
      professional: prof,
      application: app,
    }))
  );

  const filteredEntries = collatedList.filter(({ professional: prof, application: app }) => {
    if (roleFilter !== 'ALL' && !prof.role.toLowerCase().includes(roleFilter.toLowerCase())) return false;
    if (complianceFilter === 'COMPLIANT' && prof.signatureStatus !== 'Signed & Sealed') return false;
    if (complianceFilter === 'NON_COMPLIANT' && prof.signatureStatus === 'Signed & Sealed') return false;

    if (
      searchTerm &&
      !prof.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !prof.prcNo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !prof.ptrNo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !prof.tin.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !prof.role.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.serialNumber.includes(searchTerm) &&
      !app.owner.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = [
      'Professional Name',
      'Role / Discipline',
      'PRC License No.',
      'PRC Expiry',
      'PTR Number',
      'PTR Date',
      'PTR Place',
      'TIN',
      'IAPOA No.',
      'Signature Status',
      'Linked Application Serial',
      'Applicant Name',
      'Project Location',
    ];

    const rows = filteredEntries.map(({ professional: p, application: a }) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.role}"`,
      `"${p.prcNo}"`,
      `"${p.prcExpiry || ''}"`,
      `"${p.ptrNo}"`,
      `"${p.ptrDate || ''}"`,
      `"${p.ptrPlace || ''}"`,
      `"${p.tin}"`,
      `"${p.iapoaNo || ''}"`,
      `"${p.signatureStatus}"`,
      `"${a.serialNumber}"`,
      `"${a.owner.enterpriseName.replace(/"/g, '""')}"`,
      `"${a.cadastral.barangay}, General Trias"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `General_Trias_Signatory_Engineers_DB_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Signatory Engineers & Licensed Professionals Database
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Collated registry of Architects, Civil/Structural Engineers, PEE, REE, Master Plumbers, Mechanical Engineers, and Notaries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddProfessional}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Professional</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by engineer name, PRC license, PTR no., TIN, role, or serial no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Disciplines</option>
            <option value="Architect">Architects</option>
            <option value="Civil">Civil / Structural</option>
            <option value="Electrical">Electrical (PEE / REE)</option>
            <option value="Plumber">Master Plumber / Sanitary</option>
            <option value="Mechanical">Mechanical (PME)</option>
            <option value="Notary">Notary Public</option>
          </select>

          <select
            value={complianceFilter}
            onChange={(e) => setComplianceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Seal & Sign Statuses</option>
            <option value="COMPLIANT">Signed & Sealed Only</option>
            <option value="NON_COMPLIANT">Missing Seal / Defective</option>
          </select>
        </div>
      </div>

      {/* Engineers Collated Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Professional & Role</th>
                <th className="py-3 px-4">PRC License & Expiry</th>
                <th className="py-3 px-4">PTR Receipt & Jurisdiction</th>
                <th className="py-3 px-4">TIN & IAPOA</th>
                <th className="py-3 px-4">Signed Application</th>
                <th className="py-3 px-4 text-center">Seal Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map(({ professional: prof, application: app }) => {
                const isMissing = prof.signatureStatus === 'Missing / Required';
                return (
                  <tr key={`${app.id}-${prof.id}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className={`font-extrabold ${isMissing ? 'text-rose-700' : 'text-slate-900'}`}>
                        {prof.name}
                      </div>
                      <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide mt-0.5">
                        {prof.role}
                      </div>
                      {prof.notes && (
                        <div className="text-[10px] text-slate-500 mt-1 max-w-xs leading-snug">
                          {prof.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{prof.prcNo}</div>
                      {prof.prcExpiry && prof.prcExpiry !== '--' && (
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Expires: {prof.prcExpiry}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800">{prof.ptrNo}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {prof.ptrPlace} {prof.ptrDate ? `(${prof.ptrDate})` : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700 font-medium">TIN: {prof.tin}</div>
                      {prof.iapoaNo && (
                        <div className="font-mono text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5">
                          IAPOA: {prof.iapoaNo}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onOpenAudit(app.id)}
                        className="text-left group cursor-pointer"
                      >
                        <div className="font-mono font-bold text-amber-800 group-hover:underline flex items-center gap-1">
                          <span>{app.serialNumber}</span>
                          <ExternalLink className="w-3 h-3 text-amber-600 inline" />
                        </div>
                        <div className="font-semibold text-slate-800 text-[11px] truncate max-w-[160px]">
                          {app.owner.enterpriseName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                          {app.cadastral.barangay}
                        </div>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          prof.signatureStatus === 'Signed & Sealed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : prof.signatureStatus === 'Missing / Required'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {prof.signatureStatus === 'Signed & Sealed' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        {prof.signatureStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProfessional(prof, app.id)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer border border-slate-200"
                          title="Edit credentials"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No registered professionals found in this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
