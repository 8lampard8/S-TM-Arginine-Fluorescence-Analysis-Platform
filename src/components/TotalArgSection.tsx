import React, { useMemo } from 'react';
import {
  AlertTriangle,
} from 'lucide-react';
import type {
  ConcentrationUnit,
  ResponseMode,
  StandardsConcentration,
  TotalArgAnalysisResult,
} from '../types';
import { PlotlyChart } from './PlotlyChart';
import type { Data, Layout } from 'plotly.js-dist-min';
import { useLanguage } from '../i18n/LanguageContext';
import { convertConcentration } from '../utils/math';

interface TotalArgSectionProps {
  result: TotalArgAnalysisResult;
  standards: StandardsConcentration;
  onUpdateStandards: (standards: StandardsConcentration) => void;
  responseMode: ResponseMode;
  onChangeResponseMode: (mode: ResponseMode) => void;
}

export const TotalArgSection: React.FC<TotalArgSectionProps> = ({
  result,
  standards,
  onUpdateStandards,
  responseMode,
  onChangeResponseMode,
}) => {
  const { t } = useLanguage();
  const { regression, calculatedTotalArg, responses, isExtrapolated } =
    result;
  // Unit the result is reported in (published calibration always reports μM)
  const dispUnit = result.standards.unit;
  const isPublished = !!result.published;
  const rSqText = Number.isFinite(regression.rSquared) ? regression.rSquared.toFixed(4) : 'n/a';

  const handleStdChange = (field: 'std1' | 'std2' | 'std3', value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      onUpdateStandards({
        ...standards,
        [field]: num,
      });
    }
  };

  const handleUnitChange = (unit: ConcentrationUnit) => {
    onUpdateStandards({
      ...standards,
      unit,
    });
  };

  const plotData = useMemo(() => {
    const xPoints = regression.points.map((p) => p.x);
    const yPoints = regression.points.map((p) => p.y);

    const minX = Math.min(...xPoints, 0);
    const maxX = Math.max(...xPoints, calculatedTotalArg * 1.1);

    const xLine = [minX, maxX];
    const yLine = xLine.map((x) => regression.slope * x + regression.intercept);

    const traces: Data[] = [
      {
        x: xPoints,
        y: yPoints,
        mode: 'markers',
        type: 'scatter',
        name: 'Standards',
        marker: {
          color: '#2563eb',
          size: 10,
          symbol: 'circle',
          line: { color: '#1e3a8a', width: 1.5 },
        },
        text: regression.points.map((p) => p.label),
        hovertemplate: '<b>%{text}</b><br>Conc: %{x} ' + dispUnit + '<br>Response: %{y:.4f}<extra></extra>',
      },
      {
        x: xLine,
        y: yLine,
        mode: 'lines',
        type: 'scatter',
        name: `Fit: ${regression.equation}`,
        line: { color: '#3b82f6', width: 2, dash: 'solid' },
        hoverinfo: 'none',
      },
      {
        x: [calculatedTotalArg],
        y: [responses.yUnknown],
        mode: 'markers',
        type: 'scatter',
        name: 'Unknown Sample',
        marker: {
          color: '#ef4444',
          size: 12,
          symbol: 'diamond',
          line: { color: '#991b1b', width: 2 },
        },
        hovertemplate:
          '<b>Unknown Sample</b><br>Calculated Conc: %{x:.2f} ' +
          dispUnit +
          '<br>Response: %{y:.4f}<extra></extra>',
      },
    ];

    return traces;
  }, [regression, calculatedTotalArg, responses.yUnknown, dispUnit]);

  const layout: Partial<Layout> = useMemo(() => {
    const yAxisTitle =
      responseMode === 'raw'
        ? 'Raw Fluorescence F / a.u.'
        : responseMode === 'delta'
        ? 'ΔF = F - F₀ / a.u.'
        : 'ΔF / F₀ (Relative Response)';

    return {
      title: {
        text: t.chartTitleTotalCal,
        font: { size: 13, color: '#1e293b', weight: 600 as any },
      },
      xaxis: {
        title: {
          text: `${t.axisArgConc} ${dispUnit}`,
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
      margin: { l: 55, r: 20, t: 35, b: 40 },
      legend: {
        orientation: 'h',
        x: 0,
        y: -0.22,
        font: { size: 10 },
      },
    };
  }, [responseMode, dispUnit, t.chartTitleTotalCal, t.axisArgConc]);

  const qcLabel =
    regression.quality === 'Good'
      ? t.qcGood
      : regression.quality === 'Acceptable'
      ? t.qcAcceptable
      : t.qcWarning;

  const qcColor =
    regression.quality === 'Good'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : regression.quality === 'Acceptable'
      ? 'text-blue-700 bg-blue-50 border-blue-200'
      : 'text-amber-800 bg-amber-50 border-amber-200';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            L
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {t.totalArgTitle}
            </h2>
            <p className="text-[11px] text-slate-500">
              {t.totalArgSubtitle}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          {t.stepBadge4}
        </span>
      </div>

      {/* 1. Standards Concentration Setting */}
      <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">{t.standardsTitle}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">{t.unitLabel}</span>
            <select
              value={standards.unit}
              onChange={(e) => handleUnitChange(e.target.value as ConcentrationUnit)}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded font-semibold text-blue-700 focus:outline-hidden cursor-pointer"
            >
              <option value="μM">μM</option>
              <option value="mM">mM</option>
              <option value="eq">eq (×10 μM)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] text-slate-500 block mb-0.5">{t.argStd1}</label>
            <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-1">
              <input
                type="number"
                value={standards.std1}
                onChange={(e) => handleStdChange('std1', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 focus:outline-hidden"
                step="any"
              />
              <span className="text-[11px] text-slate-400 ml-1">{standards.unit}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 block mb-0.5">{t.argStd2}</label>
            <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-1">
              <input
                type="number"
                value={standards.std2}
                onChange={(e) => handleStdChange('std2', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 focus:outline-hidden"
                step="any"
              />
              <span className="text-[11px] text-slate-400 ml-1">{standards.unit}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 block mb-0.5">{t.argStd3}</label>
            <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-1">
              <input
                type="number"
                value={standards.std3}
                onChange={(e) => handleStdChange('std3', e.target.value)}
                className="w-full text-center font-mono font-bold text-slate-800 focus:outline-hidden"
                step="any"
              />
              <span className="text-[11px] text-slate-400 ml-1">{standards.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Response Metric Selection */}
      {!isPublished && (
      <div className="mt-3.5 p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
        <span className="font-semibold text-slate-700 block mb-2">
          {t.responseFormulationTitle}
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onChangeResponseMode('relative')}
            className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
              responseMode === 'relative'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="font-mono text-xs">ΔF / F₀</div>
            <div className="text-[10px] opacity-90">{t.modeRelative}</div>
          </button>

          <button
            onClick={() => onChangeResponseMode('delta')}
            className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
              responseMode === 'delta'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="font-mono text-xs">ΔF = F - F₀</div>
            <div className="text-[10px] opacity-90">{t.modeDelta}</div>
          </button>

          <button
            onClick={() => onChangeResponseMode('raw')}
            className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
              responseMode === 'raw'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="font-mono text-xs">F</div>
            <div className="text-[10px] opacity-90">{t.modeRaw}</div>
          </button>
        </div>
      </div>
      )}

      {/* Extracted Values & Responses Micro-table */}
      <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden text-xs">
        <div className="bg-slate-100/80 px-3 py-1.5 font-semibold text-slate-700 text-[11px] flex justify-between">
          <span>{t.extractedHeader} {result.extracted.actualWavelength} nm</span>
          <span className="text-slate-500 font-normal">{t.baselineProbe} {responses.f0.toFixed(1)} a.u.</span>
        </div>
        <div className="grid grid-cols-4 divide-x divide-slate-200 text-center font-mono text-[11px] bg-white">
          <div className="p-1.5">
            <div className="text-slate-400 text-[10px]">Std 1 ({standards.std1})</div>
            <div className="font-bold text-slate-800">{responses.f1.toFixed(1)}</div>
            <div className="text-blue-600 text-[10px]">{responses.y1.toFixed(3)}</div>
          </div>
          <div className="p-1.5">
            <div className="text-slate-400 text-[10px]">Std 2 ({standards.std2})</div>
            <div className="font-bold text-slate-800">{responses.f2.toFixed(1)}</div>
            <div className="text-blue-600 text-[10px]">{responses.y2.toFixed(3)}</div>
          </div>
          <div className="p-1.5">
            <div className="text-slate-400 text-[10px]">Std 3 ({standards.std3})</div>
            <div className="font-bold text-slate-800">{responses.f3.toFixed(1)}</div>
            <div className="text-blue-600 text-[10px]">{responses.y3.toFixed(3)}</div>
          </div>
          <div className="p-1.5 bg-blue-50/40">
            <div className="text-slate-400 text-[10px]">Unknown</div>
            <div className="font-bold text-blue-800">{responses.fUnknown.toFixed(1)}</div>
            <div className="text-blue-600 text-[10px] font-bold">{responses.yUnknown.toFixed(3)}</div>
          </div>
        </div>
      </div>

      {/* Calibration Plot */}
      <div className="mt-3 flex-1">
        <PlotlyChart
          data={plotData}
          layout={layout}
          className="rounded-lg border border-slate-100"
          style={{ height: '270px' }}
        />
      </div>

      {/* Regression Parameters & QC Rating */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
          <span className="text-[10px] text-slate-500 block">{t.fittedEquation}</span>
          <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">
            {regression.equation}
          </span>
        </div>

        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
          <span className="text-[10px] text-slate-500 block">{t.slopeIntercept}</span>
          <span className="font-mono font-semibold text-slate-700 text-[11px]">
            {regression.slope.toFixed(4)} / {regression.intercept.toFixed(4)}
          </span>
        </div>

        <div className={`p-2 border rounded-lg text-center ${qcColor}`}>
          <span className="text-[10px] block opacity-80">{t.rSquaredCoeff}</span>
          <span className="font-mono font-bold text-xs">
            {rSqText}{' '}
            <span className="text-[10px] font-normal">({qcLabel})</span>
          </span>
        </div>
      </div>

      {/* Unknown Sample Total Arg Result Banner */}
      <div className="mt-3 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              {t.totalArgBannerLabel}
            </span>
            <div className="text-xl font-extrabold text-blue-900 tracking-tight font-mono">
              C_total = {calculatedTotalArg.toFixed(2)} {dispUnit}
            </div>
            {dispUnit !== 'μM' && (
              <div className="text-xs font-mono text-blue-700">
                = {convertConcentration(calculatedTotalArg, dispUnit, 'μM').toFixed(2)} μM
              </div>
            )}
            {result.published && (
              <div className="text-[10px] text-slate-500 mt-0.5">LOD = {result.published.lod} μM</div>
            )}
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-500 text-[10px] block">Formula:</span>
            <span className="font-mono text-slate-700 text-[11px] font-medium">
              {isPublished ? '(F - 8097.84) / 2713.62' : '(y_unk - b) / k'}
            </span>
          </div>
        </div>

        {/* Extrapolation Warning */}
        {isExtrapolated && (
          <div className="mt-2.5 p-2 bg-amber-100/80 border border-amber-300 text-amber-900 rounded-md text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold">{t.extrapolationWarning}</span>
          </div>
        )}
      </div>
    </div>
  );
};
