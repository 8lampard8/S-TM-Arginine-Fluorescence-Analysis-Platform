import React from 'react';
import {
  FileSpreadsheet,
  FlaskConical,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { downloadExcelTemplate } from '../utils/excel';

interface HeaderProps {
  isDemoData: boolean;
  onLoadDemo: () => void;
  onReset: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDemoData,
  onLoadDemo,
  onReset,
  hasData,
}) => {
  const steps = [
    { num: 1, title: 'Download Template', desc: '14-Column XLSX' },
    { num: 2, title: 'Upload Spectra', desc: 'Import & Inspect' },
    { num: 3, title: 'Select λmax', desc: 'Feature Wavelength' },
    { num: 4, title: 'Total Arg Assay', desc: 'S-TM System' },
    { num: 5, title: 'Chiral Analysis', desc: 'S-TM + Al³⁺ System' },
    { num: 6, title: 'Export Report', desc: 'Multi-Sheet Excel' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                S-TM Arginine Fluorescence Analysis Platform
              </h1>
              {hasData && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isDemoData
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isDemoData ? '⚡ Demo Dataset' : '✓ Real User Data'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Quantitative Fluorescence Detection & Chiral Composition Analysis of L-/D-Arginine
            </p>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={downloadExcelTemplate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs cursor-pointer"
            title="Download the standardized 14-column fluorescence Excel template"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            Download Excel Template
          </button>

          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors shadow-xs cursor-pointer"
            title="Load authentic simulated S-TM assay dataset for demonstration"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Load Demo Data
          </button>

          {hasData && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Clear current dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Workflow Steps Breadcrumb */}
      <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto text-xs py-0.5 scrollbar-none">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center whitespace-nowrap min-w-fit px-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    hasData
                      ? 'bg-blue-600 text-white'
                      : idx === 0
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s.num}
                </span>
                <div>
                  <span className="font-semibold text-slate-800">{s.title}</span>
                  <span className="text-slate-400 text-[10px] ml-1.5 hidden md:inline">
                    ({s.desc})
                  </span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="h-0.5 w-6 sm:w-10 bg-slate-200 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};
