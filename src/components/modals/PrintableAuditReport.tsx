import React from 'react';
import { PermitApplication } from '../../types/permit';
import { formatCurrencyPHP } from '../../utils/storage';

interface PrintableAuditReportProps {
  app: PermitApplication;
}

export const PrintableAuditReport: React.FC<PrintableAuditReportProps> = ({ app }) => {
  const verifiedCount = app.requirements.filter(
    (r) => r.status === 'Verified' || r.status === 'Exempt / Not Applicable'
  ).length;
  const openIssues = app.flaggedIssues.filter((i) => i.status === 'Open');

  return (
    <div className="hidden print-only p-8 text-black bg-white font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <div className="text-xs uppercase tracking-widest font-bold">
          Republic of the Philippines · Province of Cavite
        </div>
        <div className="text-xl font-black tracking-tight mt-0.5">
          CITY GOVERNMENT OF GENERAL TRIAS
        </div>
        <div className="text-sm font-bold text-slate-800">
          OFFICE OF THE BUILDING OFFICIAL · CITY BUILDING REGULATORY DIVISION (CBRDGTC)
        </div>
        <div className="text-xs uppercase tracking-wider mt-1 text-slate-600">
          DOCUMENT COMPLETENESS AUDIT & EVALUATION REPORT (CBRDGTC FORM 1)
        </div>
      </div>

      {/* Meta Bar */}
      <div className="grid grid-cols-2 gap-4 border border-black p-3 mb-4 text-xs">
        <div>
          <div>
            <strong>Processing Serial No.:</strong> <span className="font-mono font-bold">{app.serialNumber}</span>
          </div>
          <div>
            <strong>Reference Code:</strong> <span className="font-mono">{app.referenceCode}</span>
          </div>
          <div>
            <strong>Application Type:</strong> {app.applicationType}
          </div>
          <div>
            <strong>Character of Occupancy:</strong> {app.characterOfOccupancy} ({app.occupancyGroup.split(' - ')[0]})
          </div>
        </div>

        <div>
          <div>
            <strong>Applicant / Owner:</strong> <strong>{app.owner.enterpriseName}</strong>
          </div>
          <div>
            <strong>Signatory:</strong> {app.owner.signatoryName} ({app.owner.contactNumber})
          </div>
          <div>
            <strong>Site Location:</strong> {app.cadastral.lotNo}, {app.cadastral.blockNo},{' '}
            {app.cadastral.subdivisionOrSitio}, {app.cadastral.barangay}, General Trias
          </div>
          <div>
            <strong>TCT / Tax Dec:</strong> TCT {app.cadastral.tctNo} · Tax Dec {app.cadastral.taxDeclarationNo}
          </div>
        </div>
      </div>

      {/* Valuation & Project Scope */}
      <div className="border border-black p-3 mb-4 text-xs">
        <div className="font-bold border-b border-black pb-1 mb-2">PROJECT VALUATION & DIMENSIONS</div>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <span className="text-slate-600 block">Total Valuation:</span>
            <span className="font-bold font-mono">{formatCurrencyPHP(app.valuation.totalEstimatedCost)}</span>
          </div>
          <div>
            <span className="text-slate-600 block">Storeys & Units:</span>
            <span>{app.buildingDetails.storeys} Storeys / {app.buildingDetails.units} Unit</span>
          </div>
          <div>
            <span className="text-slate-600 block">Floor Area:</span>
            <span className="font-mono">{app.buildingDetails.totalFloorArea} m²</span>
          </div>
          <div>
            <span className="text-slate-600 block">Lot Area:</span>
            <span className="font-mono">{app.buildingDetails.lotArea} m²</span>
          </div>
        </div>
      </div>

      {/* 16-point Checklist Audit Table */}
      <div className="mb-4">
        <div className="font-bold text-xs uppercase border-b-2 border-black pb-1 mb-2">
          DOCUMENT CHECKLIST VERIFICATION STATUS (CBRDGTC FORM 1)
        </div>
        <table className="w-full text-[11px] border-collapse border border-black">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-black p-1 text-left w-8">#</th>
              <th className="border border-black p-1 text-left">Document Required</th>
              <th className="border border-black p-1 text-left">Mandatory Specification</th>
              <th className="border border-black p-1 text-center w-24">Status</th>
              <th className="border border-black p-1 text-left">Attached Files</th>
            </tr>
          </thead>
          <tbody>
            {app.requirements.map((r) => (
              <tr key={r.id}>
                <td className="border border-black p-1 text-center font-bold">{r.itemNo}</td>
                <td className="border border-black p-1 font-semibold">{r.title}</td>
                <td className="border border-black p-1 text-slate-700">{r.specification}</td>
                <td className="border border-black p-1 text-center font-bold">
                  {r.status === 'Verified' ? '✓ OK' : r.status === 'Flagged with Issues' ? '⚠ FLAGGED' : 'PENDING'}
                </td>
                <td className="border border-black p-1 font-mono text-[10px]">
                  {r.uploadedFiles.length > 0
                    ? r.uploadedFiles.map((f) => f.name).join(', ')
                    : 'None attached'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actionable Punchlist */}
      {openIssues.length > 0 && (
        <div className="mb-4 border border-black p-3">
          <div className="font-bold text-xs uppercase text-red-700 border-b border-black pb-1 mb-2">
            CRITICAL RECTIFICATION PUNCHLIST FOR APPLICANT ({openIssues.length} ISSUES)
          </div>
          <div className="space-y-2 text-xs">
            {openIssues.map((iss, i) => (
              <div key={iss.id} className="border-b border-slate-300 pb-1.5">
                <div className="font-bold">
                  {i + 1}. [{iss.severity}] {iss.title} ({iss.targetDocument})
                </div>
                <div className="text-slate-700 mt-0.5">{iss.description}</div>
                <div className="font-semibold text-red-900 mt-0.5">
                  Action Required: {iss.rectification}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory of Signatory Professionals */}
      <div className="mb-6">
        <div className="font-bold text-xs uppercase border-b-2 border-black pb-1 mb-2">
          REGISTERED SIGNATORY PROFESSIONALS DIRECTORY
        </div>
        <table className="w-full text-[11px] border-collapse border border-black">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-black p-1 text-left">Role</th>
              <th className="border border-black p-1 text-left">Professional Name</th>
              <th className="border border-black p-1 text-left">PRC License</th>
              <th className="border border-black p-1 text-left">PTR No. & Place</th>
              <th className="border border-black p-1 text-center">Seal & Signature</th>
            </tr>
          </thead>
          <tbody>
            {app.professionals.map((p) => (
              <tr key={p.id}>
                <td className="border border-black p-1 font-bold">{p.role}</td>
                <td className="border border-black p-1">{p.name}</td>
                <td className="border border-black p-1 font-mono">{p.prcNo}</td>
                <td className="border border-black p-1">{p.ptrNo} ({p.ptrPlace})</td>
                <td className="border border-black p-1 text-center font-semibold">{p.signatureStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Official Signatures Bar */}
      <div className="grid grid-cols-3 gap-6 pt-6 border-t-2 border-black text-center text-xs">
        <div>
          <div className="h-12 border-b border-black flex items-end justify-center pb-1 font-bold">
            {app.auditSummary.reviewerName}
          </div>
          <div className="mt-1 font-semibold">Document Processor / Evaluator</div>
          <div className="text-[10px] text-slate-600">CBRDGTC, General Trias</div>
        </div>

        <div>
          <div className="h-12 border-b border-black flex items-end justify-center pb-1 font-bold">
            ENGR. ROMEO V. GALVAN, M.ASEP
          </div>
          <div className="mt-1 font-semibold">Chief, Processing & Enforcement</div>
          <div className="text-[10px] text-slate-600">CBRDGTC, General Trias</div>
        </div>

        <div>
          <div className="h-12 border-b border-black flex items-end justify-center pb-1 font-bold">
            ENGR. REYNALDO C. DE GUZMAN
          </div>
          <div className="mt-1 font-semibold">City Building Official</div>
          <div className="text-[10px] text-slate-600">City of General Trias, Cavite</div>
        </div>
      </div>
    </div>
  );
};
