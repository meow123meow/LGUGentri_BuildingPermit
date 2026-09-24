import React from 'react';
import { DollarSign, PieChart, Calendar, Ruler, TrendingUp, Edit } from 'lucide-react';
import { PermitApplication } from '../../types/permit';
import { formatCurrencyPHP } from '../../utils/storage';

interface FinancialValuationCardProps {
  app: PermitApplication;
  onEdit: () => void;
}

export const FinancialValuationCard: React.FC<FinancialValuationCardProps> = ({ app, onEdit }) => {
  const { valuation, buildingDetails } = app;
  const total = valuation.totalEstimatedCost || 1;

  const bldgPct = Math.round((valuation.buildingCost / total) * 100);
  const elecPct = Math.round((valuation.electricalCost / total) * 100);
  const plumbPct = Math.round((valuation.plumbingCost / total) * 100);
  const mechPct = Math.round((valuation.mechanicalCost / total) * 100);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Estimated Cost & Valuation
            </h3>
          </div>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            title="Edit Valuation & Schedule"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Cost Display */}
        <div className="mb-4">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Total Project Valuation</div>
          <div className="text-2xl md:text-3xl font-black text-emerald-700 font-mono tracking-tight mt-0.5">
            {formatCurrencyPHP(valuation.totalEstimatedCost)}
          </div>
        </div>

        {/* Breakdown Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
            <div
              style={{ width: `${bldgPct}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`Building: ${bldgPct}%`}
            />
            <div
              style={{ width: `${elecPct}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Electrical: ${elecPct}%`}
            />
            <div
              style={{ width: `${plumbPct}%` }}
              className="bg-sky-500 h-full transition-all"
              title={`Plumbing: ${plumbPct}%`}
            />
            <div
              style={{ width: `${mechPct}%` }}
              className="bg-purple-500 h-full transition-all"
              title={`Mechanical: ${mechPct}%`}
            />
          </div>
        </div>

        {/* Breakdown Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-600 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                Building / Civil
              </span>
              <span>{bldgPct}%</span>
            </div>
            <div className="font-mono font-bold text-slate-900 mt-1">
              {formatCurrencyPHP(valuation.buildingCost)}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-600 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                Electrical
              </span>
              <span>{elecPct}%</span>
            </div>
            <div className="font-mono font-bold text-slate-900 mt-1">
              {formatCurrencyPHP(valuation.electricalCost)}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-600 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                Plumbing / Sanitary
              </span>
              <span>{plumbPct}%</span>
            </div>
            <div className="font-mono font-bold text-slate-900 mt-1">
              {formatCurrencyPHP(valuation.plumbingCost)}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-600 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                Mechanical
              </span>
              <span>{mechPct}%</span>
            </div>
            <div className="font-mono font-bold text-slate-900 mt-1">
              {formatCurrencyPHP(valuation.mechanicalCost)}
            </div>
          </div>
        </div>
      </div>

      {/* Project Schedule Timeline */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>
            <strong className="text-slate-900">{buildingDetails.proposedStart}</strong> →{' '}
            <strong className="text-slate-900">{buildingDetails.expectedCompletion}</strong>
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold text-slate-700">
          Lot: {buildingDetails.lotArea.toLocaleString()} m²
        </div>
      </div>
    </div>
  );
};
