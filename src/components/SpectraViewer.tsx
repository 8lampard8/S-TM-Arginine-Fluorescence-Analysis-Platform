import React, { useState, useMemo } from 'react';
import {
  Activity,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import type { RawSpectrumRow } from '../types';
import { PlotlyChart } from './PlotlyChart';
import { autoDetectPeakWavelength, findNearestSpectrumRow } from '../utils/math';
import type { Data, Layout } from 'plotly.js-dist-min';

interface SpectraViewerProps {
  spectra: RawSpectrumRow[];
  selectedWavelength: number;
  onSelectWavelength: (wl: number) => void;
}

type SeriesFilter = 'all' | 'total_arg' | 'chiral' | 'unknowns';

export const SpectraViewer: React.FC<SpectraViewerProps> = ({
  spectra,
  selectedWavelength,
  onSelectWavelength,
}) => {
  const [activeFilter, setActiveFilter] = useState<SeriesFilter>('all');
  const [manualInput, setManualInput] = useState<string>(
    selectedWavelength.toString()
  );

  React.useEffect(() => {
    setManualInput(selectedWavelength.toString());
  }, [selectedWavelength]);

  const nearestRow = useMemo(
    () => findNearestSpectrumRow(spectra, selectedWavelength),
    [spectra, selectedWavelength]
  );
  const actualWavelength = nearestRow ? nearestRow.wavelength : selectedWavelength;

  const handleAutoDetect = () => {
    const peak = autoDetectPeakWavelength(spectra);
    onSelectWavelength(peak);
    setManualInput(peak.toString());
  };

  const handleManualApply = () => {
    const val = parseFloat(manualInput);
    if (!isNaN(val) && val > 0) {
      onSelectWavelength(val);
    }
  };

  const traces = useMemo(() => {
    if (!spectra || spectra.length === 0) return [];

    const x = spectra.map((r) => r.wavelength);

    const allDefinitions = [
      // Total Arg Series
      {
        id: 's_tm',
        name: 'S-TM (Blank)',
        y: spectra.map((r) => r.s_tm),
        color: '#64748b',
        width: 2,
        dash: 'dash',
        group: 'total_arg',
      },
      {
        id: 'arg_std1',
        name: 'S-TM + Arg Std 1',
        y: spectra.map((r) => r.arg_std1),
        color: '#93c5fd',
        width: 1.8,
        group: 'total_arg',
      },
      {
        id: 'arg_std2',
        name: 'S-TM + Arg Std 2',
        y: spectra.map((r) => r.arg_std2),
        color: '#3b82f6',
        width: 2,
        group: 'total_arg',
      },
      {
        id: 'arg_std3',
        name: 'S-TM + Arg Std 3',
        y: spectra.map((r) => r.arg_std3),
        color: '#1d4ed8',
        width: 2.2,
        group: 'total_arg',
      },
      {
        id: 's_tm_unknown',
        name: 'S-TM + Unknown Sample',
        y: spectra.map((r) => r.s_tm_unknown),
        color: '#0284c7',
        width: 3,
        dash: 'dot',
        group: 'unknowns',
      },

      // Chiral Series
      {
        id: 's_tm_al',
        name: 'S-TM + Al³⁺ (Blank)',
        y: spectra.map((r) => r.s_tm_al),
        color: '#94a3b8',
        width: 2,
        dash: 'dash',
        group: 'chiral',
      },
      {
        id: 'l_arg_std1',
        name: 'S-TM + Al³⁺ + L-Arg Std 1',
        y: spectra.map((r) => r.l_arg_std1),
        color: '#c084fc',
        width: 1.8,
        group: 'chiral',
      },
      {
        id: 'l_arg_std2',
        name: 'S-TM + Al³⁺ + L-Arg Std 2',
        y: spectra.map((r) => r.l_arg_std2),
        color: '#a855f7',
        width: 2,
        group: 'chiral',
      },
      {
        id: 'l_arg_std3',
        name: 'S-TM + Al³⁺ + L-Arg Std 3',
        y: spectra.map((r) => r.l_arg_std3),
        color: '#7e22ce',
        width: 2.2,
        group: 'chiral',
      },
      {
        id: 'd_arg_std1',
        name: 'S-TM + Al³⁺ + D-Arg Std 1',
        y: spectra.map((r) => r.d_arg_std1),
        color: '#fcd34d',
        width: 1.8,
        group: 'chiral',
      },
      {
        id: 'd_arg_std2',
        name: 'S-TM + Al³⁺ + D-Arg Std 2',
        y: spectra.map((r) => r.d_arg_std2),
        color: '#f59e0b',
        width: 2,
        group: 'chiral',
      },
      {
        id: 'd_arg_std3',
        name: 'S-TM + Al³⁺ + D-Arg Std 3',
        y: spectra.map((r) => r.d_arg_std3),
        color: '#d97706',
        width: 2.2,
        group: 'chiral',
      },
      {
        id: 'chiral_unknown',
        name: 'S-TM + Al³⁺ + Unknown Sample',
        y: spectra.map((r) => r.chiral_unknown),
        color: '#e11d48',
        width: 3,
        dash: 'solid',
        group: 'unknowns',
      },
    ];

    const filtered = allDefinitions.filter((item) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'total_arg') {
        return item.group === 'total_arg' || item.id === 's_tm_unknown';
      }
      if (activeFilter === 'chiral') {
        return item.group === 'chiral' || item.id === 'chiral_unknown';
      }
      if (activeFilter === 'unknowns') {
        return item.id === 's_tm_unknown' || item.id === 'chiral_unknown';
      }
      return true;
    });

    const plotlyData: Data[] = filtered.map((item) => ({
      x,
      y: item.y,
      type: 'scatter',
      mode: 'lines',
      name: item.name,
      line: {
        color: item.color,
        width: item.width,
        dash: item.dash as any,
      },
      hovertemplate: `<b>${item.name}</b><br>Wavelength: %{x} nm<br>Intensity: %{y:.1f} a.u.<extra></extra>`,
    }));

    return plotlyData;
  }, [spectra, activeFilter]);

  const layout: Partial<Layout> = useMemo(() => {
    return {
      title: {
        text: 'Raw Fluorescence Emission Spectra',
        font: { size: 14, color: '#1e293b', weight: 600 as any },
      },
      xaxis: {
        title: { text: 'Wavelength / nm', font: { size: 12, color: '#475569' } },
        showgrid: true,
        gridcolor: '#f1f5f9',
        zeroline: false,
      },
      yaxis: {
        title: {
          text: 'Fluorescence Intensity / a.u.',
          font: { size: 12, color: '#475569' },
        },
        showgrid: true,
        gridcolor: '#f1f5f9',
        zeroline: false,
      },
      hovermode: 'closest',
      legend: {
        orientation: 'h',
        x: 0,
        y: -0.28,
        font: { size: 10, color: '#475569' },
      },
      shapes: [
        {
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: actualWavelength,
          x1: actualWavelength,
          y0: 0,
          y1: 1,
          line: {
            color: '#dc2626',
            width: 2,
            dash: 'dashdot',
          },
        },
      ],
      annotations: [
        {
          x: actualWavelength,
          y: 1,
          xref: 'x',
          yref: 'paper',
          text: `λ = ${actualWavelength} nm`,
          showarrow: true,
          arrowhead: 2,
          arrowcolor: '#dc2626',
          ax: 0,
          ay: -22,
          font: { color: '#dc2626', size: 11, weight: 600 as any },
          bgcolor: 'rgba(254, 242, 242, 0.95)',
          bordercolor: '#fca5a5',
          borderwidth: 1,
        },
      ],
    };
  }, [actualWavelength]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 transition-all">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Interactive Spectral Viewer & Wavelength Selection
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hover to inspect points, zoom into peaks, or extract intensities at the target feature wavelength.
          </p>
        </div>

        {/* Trace Group Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            All Spectra ({traces.length})
          </button>
          <button
            onClick={() => setActiveFilter('total_arg')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'total_arg'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Total Arg Series
          </button>
          <button
            onClick={() => setActiveFilter('chiral')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'chiral'
                ? 'bg-white text-purple-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Chiral Series (Al³⁺)
          </button>
          <button
            onClick={() => setActiveFilter('unknowns')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'unknowns'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Unknowns Only
          </button>
        </div>
      </div>

      {/* Feature Wavelength Selector Toolbar */}
      <div className="my-3 py-2.5 px-3.5 bg-blue-50/70 border border-blue-200/80 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-blue-700 shrink-0" />
          <span className="font-semibold text-slate-800">Analysis Wavelength:</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualApply()}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-center font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 486"
              step="1"
            />
            <span className="text-slate-500 font-medium">nm</span>
            <button
              onClick={handleManualApply}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>

          <button
            onClick={handleAutoDetect}
            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium shadow-xs transition-colors ml-1 cursor-pointer"
            title="Automatically detect emission maximum (λmax)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto Detect Peak (λmax)
          </button>
        </div>

        {/* Wavelength Match Feedback */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-white border border-blue-200 rounded text-slate-700 font-medium">
            Selected wavelength:{' '}
            <strong className="text-blue-700 font-mono text-sm">{actualWavelength} nm</strong>
            {actualWavelength !== selectedWavelength && (
              <span className="text-slate-500 text-[11px] ml-1.5">
                (Nearest data point to {selectedWavelength} nm)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Plotly Chart Container */}
      <div className="relative mt-2">
        <PlotlyChart
          data={traces}
          layout={layout}
          className="rounded-lg border border-slate-100"
          style={{ height: '420px' }}
        />
      </div>

      <div className="mt-2 text-right text-[11px] text-slate-400">
        Tip: Click on any legend item to toggle visibility. Double-click to isolate a single trace.
      </div>
    </div>
  );
};
