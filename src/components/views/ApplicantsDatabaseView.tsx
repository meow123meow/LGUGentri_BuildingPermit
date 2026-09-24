import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Building,
  MapPin,
  Phone,
  FileCheck,
  DollarSign,
  Layers,
  ArrowUpDown,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { PermitApplication } from '../../types/permit';
import { formatCurrencyPHP } from '../../utils/storage';

interface ApplicantsDatabaseViewProps {
  applications: PermitApplication[];
  onSelectApplication: (id: string) => void;
  onOpenAudit: (id: string) => void;
  onEditApplication: (app: PermitApplication) => void;
  onDeleteApplication: (appId: string, serialNumber: string) => void;
  onOpenNewAppModal: () => void;
}

export const ApplicantsDatabaseView: React.FC<ApplicantsDatabaseViewProps> = ({
  applications,
  onSelectApplication,
  onOpenAudit,
  onEditApplication,
  onDeleteApplication,
  onOpenNewAppModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [occupancyFilter, setOccupancyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredApps = applications.filter((app) => {
    if (occupancyFilter !== 'ALL' && !app.occupancyGroup.includes(occupancyFilter)) return false;
    if (statusFilter !== 'ALL' && app.auditSummary.overallStatus !== statusFilter) return false;
    if (
      searchTerm &&
      !app.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.owner.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.owner.signatoryName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.cadastral.barangay.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.cadastral.tctNo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.owner.contactNumber.includes(searchTerm)
    ) {
      return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = [
      'Serial Number',
      'Reference Code',
      'Owner / Enterprise',
      'Authorized Signatory',
      'Contact Number',
      'Email',
      'Owner Address',
      'CTC Number',
      'CTC Date',
      'Application Type',
      'Occupancy Group',
      'Lot & Block',
      'Subdivision',
      'Barangay',
      'TCT Number',
      'Tax Dec Number',
      'Total Estimated Cost',
      'Storeys',
      'Floor Area (m2)',
      'Compliance Rate',
      'Audit Status',
    ];

    const rows = filteredApps.map((a) => [
      `"${a.serialNumber}"`,
      `"${a.referenceCode}"`,
      `"${a.owner.enterpriseName.replace(/"/g, '""')}"`,
      `"${a.owner.signatoryName.replace(/"/g, '""')}"`,
      `"${a.owner.contactNumber}"`,
      `"${a.owner.email || ''}"`,
      `"${a.owner.address.replace(/"/g, '""')}"`,
      `"${a.owner.ctcNumber || ''}"`,
      `"${a.owner.ctcDateIssued || ''}"`,
      `"${a.applicationType}"`,
      `"${a.occupancyGroup}"`,
      `"${a.cadastral.lotNo}, ${a.cadastral.blockNo}"`,
      `"${a.cadastral.subdivisionOrSitio}"`,
      `"${a.cadastral.barangay}"`,
      `"${a.cadastral.tctNo}"`,
      `"${a.cadastral.taxDeclarationNo}"`,
      a.valuation.totalEstimatedCost,
      a.buildingDetails.storeys,
      a.buildingDetails.totalFloorArea,
      `${a.auditSummary.complianceRate}%`,
      `"${a.auditSummary.overallStatus}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `General_Trias_Applicants_Database_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Master Applicants & Owners Registry
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Database of property owners, corporations, site addresses, application types, contact numbers, and cadastral records
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
            onClick={onOpenNewAppModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>+ Add New Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by owner name, signatory, serial no., ref code, TCT, barangay, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={occupancyFilter}
            onChange={(e) => setOccupancyFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Occupancies</option>
            <option value="Commercial">Commercial (Group E)</option>
            <option value="Residential">Residential (Group A/B)</option>
            <option value="Industrial">Industrial (Group F)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Audit Statuses</option>
            <option value="Ready for Approval">Ready for Approval</option>
            <option value="Action Required">Action Required</option>
            <option value="Under Initial Review">Under Initial Review</option>
          </select>

          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Database Display */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Serial & Ref No.</th>
                  <th className="py-3 px-4">Owner / Enterprise</th>
                  <th className="py-3 px-4">Type & Occupancy</th>
                  <th className="py-3 px-4">Site Location</th>
                  <th className="py-3 px-4">TCT / Tax Dec</th>
                  <th className="py-3 px-4">Valuation</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const openIssues = app.flaggedIssues.filter((i) => i.status === 'Open').length;
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-amber-800">{app.serialNumber}</div>
                        <div className="font-mono text-[10px] text-slate-500">{app.referenceCode}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.owner.enterpriseName}</div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <span className="text-amber-800 font-semibold">Signatory:</span> {app.owner.signatoryName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          📞 {app.owner.contactNumber} {app.owner.ctcNumber && `· CTC: ${app.owner.ctcNumber}`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{app.applicationType}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {app.characterOfOccupancy}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {app.buildingDetails.storeys} Storeys · {app.buildingDetails.totalFloorArea} m²
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {app.cadastral.lotNo}, {app.cadastral.blockNo}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {app.cadastral.subdivisionOrSitio}
                        </div>
                        <div className="text-[10px] text-slate-500">{app.cadastral.barangay}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 text-[11px]">
                          {app.cadastral.tctNo}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                          TD: {app.cadastral.taxDeclarationNo}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-800">
                          {formatCurrencyPHP(app.valuation.totalEstimatedCost)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.auditSummary.overallStatus === 'Ready for Approval'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : app.auditSummary.overallStatus === 'Action Required'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-sky-100 text-sky-800 border border-sky-300'
                          }`}
                        >
                          {app.auditSummary.complianceRate}% · {app.auditSummary.overallStatus}
                        </span>
                        {openIssues > 0 && (
                          <div className="text-[10px] text-rose-700 font-bold mt-0.5">
                            {openIssues} Open Action Items
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenAudit(app.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md text-xs transition-colors cursor-pointer shadow-2xs"
                            title="Open Bento Grid Audit for this applicant"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Audit</span>
                          </button>
                          <button
                            onClick={() => onEditApplication(app)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer border border-slate-200"
                            title="Edit applicant record"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteApplication(app.id, app.serialNumber)}
                            className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-md transition-colors cursor-pointer border border-slate-200 hover:border-rose-200"
                            title="Delete this application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      No applicant records matched your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      {app.serialNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      {app.owner.enterpriseName}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.auditSummary.overallStatus === 'Ready for Approval'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {app.auditSummary.complianceRate}%
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Signatory:</span>
                    <span className="font-semibold text-slate-900">{app.owner.signatoryName}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">Site Location:</span>
                    <span className="font-medium text-slate-800">
                      {app.cadastral.lotNo}, {app.cadastral.blockNo}, {app.cadastral.subdivisionOrSitio},{' '}
                      {app.cadastral.barangay}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 block">TCT Number:</span>
                      <span className="font-mono font-bold text-slate-900 truncate block">
                        {app.cadastral.tctNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total Valuation:</span>
                      <span className="font-mono font-bold text-emerald-800">
                        {formatCurrencyPHP(app.valuation.totalEstimatedCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">📞 {app.owner.contactNumber}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditApplication(app)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer border border-slate-200 text-xs"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteApplication(app.id, app.serialNumber)}
                    className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-md transition-colors cursor-pointer border border-slate-200 hover:border-rose-200 text-xs"
                    title="Delete Application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenAudit(app.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Audit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
