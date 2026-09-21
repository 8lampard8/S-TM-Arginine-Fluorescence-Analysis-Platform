import React from 'react';
import {
  Download,
  FileSpreadsheet,
  Image,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import type {
  ChiralAnalysisResult,
  MixtureValidationItem,
  RawSpectrumRow,
  StandardsConcentration,
  TotalArgAnalysisResult,
} from '../types';
import { exportAnalysisWorkbook } from '../utils/excel';

interface ExportSectionProps {
  rawSpectra: RawSpectrumRow[];
  totalArgResult: TotalArgAnalysisResult;
  chiralResult: ChiralAnalysisResult;
  lStandards: StandardsConcentration;
  dStandards: StandardsConcentration;
  mixtureValidation: MixtureValidationItem[];
}

export const ExportSection: React.FC<ExportSectionProps> = ({
  rawSpectra,
  totalArgResult,
  chiralResult,
  lStandards,
  dStandards,
  mixtureValidation,
}) => {
  const handleExportExcel = () => {
    exportAnalysisWorkbook({
      rawSpectra,
      totalArgResult,
      chiralResult,
      lStandards,
      dStandards,
      mixtureValidation,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 mt-6 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Export Comprehensive Scientific Results
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Download publication-ready multi-tab Excel workbooks and high-resolution chart images.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Analysis Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Details on What Is Included */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 font-semibold block">
              Multi-Sheet Scientific Workbook
            </strong>
            <span className="text-slate-500 text-[11px]">
              Includes Raw Spectra, Extracted Intensities, Total Arg Calibration, Chiral Calibrations, and Full Sample Quantification.
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
          <Image className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 font-semibold block">
              Publication Figures (PNG / SVG)
            </strong>
            <span className="text-slate-500 text-[11px]">
              Hover over any chart toolbar to download 300 DPI publication-quality PNG or vector SVG directly.
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 font-semibold block">
              Complete Traceability
            </strong>
            <span className="text-slate-500 text-[11px]">
              All calculation parameters, fitted equations, R² coefficients, and analysis wavelength metadata are saved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
