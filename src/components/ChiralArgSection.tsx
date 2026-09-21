import React, { useMemo } from 'react';
import {
  Scale,
  Settings2,
} from 'lucide-react';
import type {
  BaselineInterceptMode,
  ChiralAnalysisResult,
  ResponseMode,
  StandardsConcentration,
  TotalArgAnalysisResult,
} from '../types';
import { PlotlyChart } from './PlotlyChart';
import type { Data, Layout } from 'plotly.js-dist-min';

interface ChiralArgSectionProps {
  chiralResult: ChiralAnalysisResult;
  totalArgResult: TotalArgAnalysisResult;
  lStandards: StandardsConcentration;
  dStandards: StandardsConcentration;
  onUpdateLStandards: (stds: StandardsConcentration) => void;
  onUpdateDStandards: (stds: StandardsConcentration) => void;
  responseMode: ResponseMode;
  baselineMode: BaselineInterceptMode;
  onChangeBaselineMode: (mode: BaselineInterceptMode) => void;
}

export const ChiralArgSection: React.FC<ChiralArgSectionProps> = ({
  chiralResult,
  totalArgResult,
  lStandards,
  dStandards,
  onUpdateLStandards,
  onUpdateDStandards,
  responseMode,
  baselineMode,
  onChangeBaselineMode,
}) => {
  const {
    lRegression,
    dRegression,
    discriminationFactor,
    discriminationFactorType,
    yChiralUnknown,
    cTotal,
  } = chiralResult;

  const handleLChange = (field: 'std1' | 'std2' | 'std3', val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      onUpdateLStandards({ ...lStandards, [field]: num });
    }
  };

  const handleDChange = (field: 'std1' | 'std2' | 'std3', val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      onUpdateDStandards({ ...dStandards, [field]: num });
    }
  };

  const plotData = useMemo(() => {
    const xL = [lStandards.std1, lStandards.std2, lStandards.std3];
    const yL = chiralResult.lResponses.map((r) => r.y);

    const xD = [dStandards.std1, dStandards.std2, dStandards.std3];
    const yD = chiralResult.dResponses.map((r) => r.y);

    const maxX = Math.max(...xL, ...xD, cTotal * 1.05);

    const xLineL = [0, maxX];
    const yLineL = xLineL.map((x) => lRegression.slope * x + lRegression.intercept);

    const xLineD = [0, maxX];
    const yLineD = xLineD.map((x) => dRegression.slope * x + dRegression.intercept);

    const traces: Data[] = [
      {
        x: xL,
        y: yL,
        mode: 'markers',
        type: 'scatter',
        name: 'L-Arg Standards',
        marker: {
          color: '#8b5cf6',
          size: 10,
          symbol: 'circle',
          line: { color: '#6d28d9', width: 1.5 },
        },
        hovertemplate:
          '<b>L-Arg Std</b><br>Conc: %{x} ' +
          lStandards.unit +
          '<br>Response: %{y:.4f}<extra></extra>',
      },
      {
        x: xLineL,
        y: yLineL,
        mode: 'lines',
        type: 'scatter',
        name: `L-Arg Fit (kL = ${lRegression.slope.toFixed(4)})`,
        line: { color: '#7c3aed', width: 2.5 },
        hoverinfo: 'none',
      },
      {
        x: xD,
        y: yD,
        mode: 'markers',
        type: 'scatter',
        name: 'D-Arg Standards',
        marker: {
          color: '#f59e0b',
          size: 10,
          symbol: 'square',
          line: { color: '#b45309', width: 1.5 },
        },
        hovertemplate:
          '<b>D-Arg Std</b><br>Conc: %{x} ' +
          dStandards.unit +
          '<br>Response: %{y:.4f}<extra></extra>',
      },
      {
        x: xLineD,
        y: yLineD,
        mode: 'lines',
        type: 'scatter',
        name: `D-Arg Fit (kD = ${dRegression.slope.toFixed(4)})`,
        line: { color: '#d97706', width: 2.5, dash: 'dash' },
        hoverinfo: 'none',
      },
      {
        x: [cTotal],
        y: [yChiralUnknown],
        mode: 'markers',
        type: 'scatter',
        name: 'Unknown Sample (S-TM+Al³⁺)',
        marker: {
          color: '#e11d48',
          size: 12,
          symbol: 'diamond',
          line: { color: '#9f1239', width: 2 },
        },
        hovertemplate:
          '<b>Unknown Sample Response</b><br>Total Arg: %{x:.2f} ' +
          lStandards.unit +
          '<br>Response: %{y:.4f}<extra></extra>',
      },
    ];

    return traces;
  }, [
    lStandards,
    dStandards,
    chiralResult.lResponses,
    chiralResult.dResponses,
    lRegression,
    dRegression,
    cTotal,
    yChiralUnknown,
  ]);

  const layout: Partial<Layout> = useMemo(() => {
    const yAxisTitle =
      responseMode === 'raw'
        ? 'Raw Intensity F / a.u.'
        : responseMode === 'delta'
        ? 'ΔF = F - F_Al / a.u.'
        : 'ΔF / F_Al (Relative Response)';

    return {
      title: {
        text: 'Dual Chiral Calibration Curves (L-Arg vs D-Arg in S-TM/Al³⁺)',
        font: { size: 13, color: '#1e293b', weight: 600 as any },
      },
      xaxis: {
        title: {
          text: `Enantiomer Concentration / ${lStandards.unit}`,
          font: { size: 11, color: '#475569' },
        },
        showgrid: true,
        gridcolor: '#f1f5f9',
      },
      yaxis: {
        title: { text: yAxisTitle, font: { size: 11, color: '#475569' } },
        showgrid: true,
        gridcolor: '#f1f5f9',
      },
      margin: { l: 55, r: 20, t: 35, b: 50 },
      legend: {
        orientation: 'h',
        x: 0,
        y: -0.28,
        font: { size: 10 },
      },
    };
  }, [responseMode, lStandards.unit]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            R
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Chiral Quantification of L-/D-Arginine
            </h2>
            <p className="text-[11px] text-slate-500">
              S-TM + Al³⁺ Coordinated System (Enantioselective Response)
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200">
          Step 5
        </span>
      </div>

      {/* Baseline Coordination Info */}
      <div className="mt-4 p-2.5 bg-purple-50/50 border border-purple-200/80 rounded-lg text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-purple-600" />
          <span className="font-semibold text-slate-700">
            Chiral Assay Baseline (S-TM + Al³⁺):
          </span>
        </div>
        <span className="font-mono font-bold text-purple-900">
          F_Al = {totalArgResult.extracted.s_tm_al.toFixed(1)} a.u.
        </span>
      </div>

      {/* Standard Concentrations Inputs: L-Arg & D-Arg */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        {/* L-Arg Inputs */}
        <div className="p-3 bg-slate-50 border border-purple-200/70 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
              L-Arg Standards ({lStandards.unit}):
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">L-Std 1</label>
              <input
                type="number"
                value={lStandards.std1}
                onChange={(e) => handleLChange('std1', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">L-Std 2</label>
              <input
                type="number"
                value={lStandards.std2}
                onChange={(e) => handleLChange('std2', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">L-Std 3</label>
              <input
                type="number"
                value={lStandards.std3}
                onChange={(e) => handleLChange('std3', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* D-Arg Inputs */}
        <div className="p-3 bg-slate-50 border border-amber-200/70 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              D-Arg Standards ({dStandards.unit}):
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">D-Std 1</label>
              <input
                type="number"
                value={dStandards.std1}
                onChange={(e) => handleDChange('std1', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">D-Std 2</label>
              <input
                type="number"
                value={dStandards.std2}
                onChange={(e) => handleDChange('std2', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">D-Std 3</label>
              <input
                type="number"
                value={dStandards.std3}
                onChange={(e) => handleDChange('std3', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dual Calibration Plot */}
      <div className="mt-3 flex-1">
        <PlotlyChart
          data={plotData}
          layout={layout}
          className="rounded-lg border border-slate-100"
          style={{ height: '270px' }}
        />
      </div>

      {/* Slopes & Chiral Discrimination Factor Highlight */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-purple-50/50 border border-purple-200 rounded-lg">
          <span className="text-[10px] text-purple-700 font-semibold block">L-Arg Calibration</span>
          <div className="font-mono text-[11px] font-bold text-purple-950 truncate">
            {lRegression.equation}
          </div>
          <div className="text-[10px] text-purple-600">R² = {lRegression.rSquared.toFixed(4)}</div>
        </div>

        <div className="p-2 bg-amber-50/50 border border-amber-200 rounded-lg">
          <span className="text-[10px] text-amber-700 font-semibold block">D-Arg Calibration</span>
          <div className="font-mono text-[11px] font-bold text-amber-950 truncate">
            {dRegression.equation}
          </div>
          <div className="text-[10px] text-amber-600">R² = {dRegression.rSquared.toFixed(4)}</div>
        </div>

        <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg text-center flex flex-col justify-center">
          <span className="text-[10px] text-indigo-700 font-bold block">
            Chiral Discrimination
          </span>
          <div className="font-mono text-sm font-extrabold text-indigo-900">
            {discriminationFactor.toFixed(2)}×
          </div>
          <div className="text-[9px] text-slate-500 font-mono">
            {discriminationFactorType} ratio
          </div>
        </div>
      </div>

      {/* Model Intercept Solver Option */}
      <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Settings2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-medium">Coupled Model Intercept (b):</span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => onChangeBaselineMode('average')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              baselineMode === 'average'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Use average of L and D intercepts: (bL + bD)/2"
          >
            (bL+bD)/2 (Default)
          </button>
          <button
            onClick={() => onChangeBaselineMode('zero')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              baselineMode === 'zero'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Assume zero intercept (b = 0)"
          >
            b = 0
          </button>
          <button
            onClick={() => onChangeBaselineMode('weighted')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              baselineMode === 'weighted'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Weighted fraction intercept: fL*bL + fD*bD"
          >
            Weighted
          </button>
        </div>
      </div>
    </div>
  );
};
