import React, { useMemo } from 'react';
import {
  Scale,
  AlertTriangle,
} from 'lucide-react';
import type { ChiralAnalysisResult, StandardsConcentration } from '../types';
import { PlotlyChart } from './PlotlyChart';
import type { Data, Layout } from 'plotly.js-dist-min';

interface ChiralResultsDashboardProps {
  chiralResult: ChiralAnalysisResult;
  lStandards: StandardsConcentration;
  dStandards: StandardsConcentration;
}

export const ChiralResultsDashboard: React.FC<ChiralResultsDashboardProps> = ({
  chiralResult,
  lStandards,
  dStandards,
}) => {
  const {
    cL,
    cD,
    cTotal,
    lFraction,
    dFraction,
    ldRatio,
    ee,
    dominantEnantiomer,
    isValidPhysical,
    warningMessage,
  } = chiralResult;

  const donutData = useMemo(() => {
    const traces: Data[] = [
      {
        values: [lFraction, dFraction],
        labels: ['L-Arginine', 'D-Arginine'],
        type: 'pie',
        hole: 0.6,
        marker: {
          colors: ['#7c3aed', '#f59e0b'],
        },
        textinfo: 'label+percent',
        hoverinfo: 'label+percent+value',
        textposition: 'outside',
      },
    ];
    return traces;
  }, [lFraction, dFraction]);

  const donutLayout: Partial<Layout> = useMemo(() => {
    return {
      title: {
        text: 'Enantiomer Composition (%)',
        font: { size: 12, color: '#334155', weight: 600 as any },
      },
      showlegend: false,
      margin: { l: 20, r: 20, t: 30, b: 20 },
      annotations: [
        {
          font: { size: 14, weight: 700 as any, color: '#1e293b' },
          showarrow: false,
          text: `${ee.toFixed(1)}%<br><span style="font-size:10px;font-weight:normal;color:#64748b">ee (${dominantEnantiomer})</span>`,
          x: 0.5,
          y: 0.5,
        },
      ],
    };
  }, [ee, dominantEnantiomer]);

  const barData = useMemo(() => {
    const traces: Data[] = [
      {
        x: ['L-Arg (C_L)', 'D-Arg (C_D)', 'Total Arg (C_total)'],
        y: [cL, cD, cTotal],
        type: 'bar',
        marker: {
          color: ['#7c3aed', '#f59e0b', '#2563eb'],
          line: { color: ['#5b21b6', '#b45309', '#1d4ed8'], width: 1.5 },
        },
        text: [
          `${cL.toFixed(2)} ${lStandards.unit}`,
          `${cD.toFixed(2)} ${dStandards.unit}`,
          `${cTotal.toFixed(2)} ${lStandards.unit}`,
        ],
        textposition: 'auto',
        hoverinfo: 'x+y',
      },
    ];
    return traces;
  }, [cL, cD, cTotal, lStandards.unit, dStandards.unit]);

  const barLayout: Partial<Layout> = useMemo(() => {
    return {
      title: {
        text: `Concentration Comparison (${lStandards.unit})`,
        font: { size: 12, color: '#334155', weight: 600 as any },
      },
      yaxis: {
        title: { text: `Concentration / ${lStandards.unit}`, font: { size: 10 } },
        showgrid: true,
        gridcolor: '#f1f5f9',
      },
      margin: { l: 45, r: 15, t: 30, b: 35 },
    };
  }, [lStandards.unit]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 mt-6 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            Chiral Quantification & Enantiomeric Excess Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simultaneous solution of L-Arg and D-Arg concentrations based on optical superposition and total mass balance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isValidPhysical ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Valid Physical Solution
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Non-Physical Model Warning
            </span>
          )}
        </div>
      </div>

      {/* Non-Physical Solution Warning Banner (Section 17) */}
      {!isValidPhysical && (
        <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold text-sm block mb-1">
              Model Assumption Discrepancy Alert
            </strong>
            <p className="leading-relaxed">{warningMessage}</p>
            <div className="mt-2 text-rose-700 font-mono text-[11px] bg-white/70 p-2 rounded border border-rose-200">
              Raw computed values: C_L = {cL.toFixed(3)} {lStandards.unit}, C_D = {cD.toFixed(3)}{' '}
              {dStandards.unit} (one value is negative, indicating sample response is outside the boundary defined by pure L and D standards).
            </div>
          </div>
        </div>
      )}

      {/* 4 Large Highlight Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: L-Arginine */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              L-Arginine Concentration
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-950 font-mono">
            {cL.toFixed(2)}{' '}
            <span className="text-sm font-semibold text-purple-700">{lStandards.unit}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-purple-800/80">
            <span>Fraction:</span>
            <strong className="font-mono text-purple-950 font-bold">{lFraction.toFixed(1)}%</strong>
          </div>
        </div>

        {/* Card 2: D-Arginine */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              D-Arginine Concentration
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-950 font-mono">
            {cD.toFixed(2)}{' '}
            <span className="text-sm font-semibold text-amber-700">{dStandards.unit}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-amber-800/80">
            <span>Fraction:</span>
            <strong className="font-mono text-amber-950 font-bold">{dFraction.toFixed(1)}%</strong>
          </div>
        </div>

        {/* Card 3: Total Arginine Check */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Total Arginine (C_L + C_D)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-950 font-mono">
            {cTotal.toFixed(2)}{' '}
            <span className="text-sm font-semibold text-blue-700">{lStandards.unit}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-blue-800/80">
            <span>L/D Ratio (C_L / C_D):</span>
            <strong className="font-mono text-blue-950 font-bold">
              {isFinite(ldRatio) ? ldRatio.toFixed(2) : '∞'}
            </strong>
          </div>
        </div>

        {/* Card 4: Enantiomeric Excess (ee) */}
        <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Enantiomeric Excess (ee)
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                dominantEnantiomer === 'L'
                  ? 'bg-purple-100 text-purple-800'
                  : dominantEnantiomer === 'D'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {dominantEnantiomer}
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-950 font-mono">
            {ee.toFixed(1)}%
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-rose-800/80">
            <span>Dominant:</span>
            <strong className="text-rose-950 font-bold">
              {dominantEnantiomer === 'Racemic'
                ? 'Racemic (1:1)'
                : `${dominantEnantiomer}-Arginine`}
            </strong>
          </div>
        </div>
      </div>

      {/* Visual Composition Charts (Donut + Bar) */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded-xl p-3">
          <PlotlyChart
            data={donutData}
            layout={donutLayout}
            style={{ height: '240px' }}
          />
        </div>

        <div className="border border-slate-200 rounded-xl p-3">
          <PlotlyChart
            data={barData}
            layout={barLayout}
            style={{ height: '240px' }}
          />
        </div>
      </div>
    </div>
  );
};
