import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Table,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { parseFluorescenceExcel, EXPECTED_COLUMN_NAMES } from '../utils/excel';
import type { RawSpectrumRow } from '../types';

interface DataUploadSectionProps {
  onDataLoaded: (data: RawSpectrumRow[], isDemo: boolean) => void;
  currentData: RawSpectrumRow[];
  isDemo?: boolean;
}

export const DataUploadSection: React.FC<DataUploadSectionProps> = ({
  onDataLoaded,
  currentData,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setErrors(['Please upload a valid Excel file (.xlsx or .xls).']);
      return;
    }

    setIsProcessing(true);
    setErrors([]);

    const res = await parseFluorescenceExcel(file);
    setIsProcessing(false);

    if (res.success && res.data) {
      onDataLoaded(res.data, false);
    } else {
      setErrors(res.errors || ['Failed to parse Excel file.']);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const hasData = currentData.length > 0;
  const minWl = hasData ? currentData[0].wavelength : 0;
  const maxWl = hasData ? currentData[currentData.length - 1].wavelength : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" />
            Fluorescence Data Import & Validation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload raw fluorescence emission spectra (.xlsx / .xls). Exactly 14 columns required.
          </p>
        </div>

        {hasData && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                <strong>{currentData.length}</strong> spectral points ({minWl} – {maxWl} nm)
              </span>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors cursor-pointer"
            >
              <Table className="w-3.5 h-3.5" />
              {showPreview ? 'Hide Preview' : 'Data Preview'}
              {showPreview ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Upload Drag & Drop Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/60'
            : hasData
            ? 'border-slate-300 bg-slate-50/50 hover:bg-blue-50/20 hover:border-blue-400'
            : 'border-blue-300 bg-blue-50/30 hover:bg-blue-50/60 hover:border-blue-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>

          <div className="text-sm font-semibold text-slate-700">
            {isProcessing ? (
              <span className="text-blue-600 animate-pulse">
                Parsing and strictly validating Excel columns...
              </span>
            ) : hasData ? (
              <span>
                Click or drag & drop to <strong className="text-blue-600">replace</strong> current fluorescence dataset
              </span>
            ) : (
              <span>
                Drop your raw fluorescence data file here, or{' '}
                <span className="text-blue-600 underline underline-offset-2">browse files</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 max-w-lg">
            Supports Microsoft Excel (.xlsx, .xls). Browser-only client-side parsing ensures total data privacy.
          </p>
        </div>
      </div>

      {/* Error Message Box */}
      {errors.length > 0 && (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="text-xs text-red-800">
              <strong className="font-semibold block mb-1">
                Data Validation Error ({errors.length} issues found):
              </strong>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              <div className="mt-2 text-[11px] text-red-700">
                Please make sure the file strictly adheres to the 14-column layout in the official template.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Data Preview */}
      {hasData && showPreview && (
        <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>First 5 Spectral Rows Preview (Total 14 Columns)</span>
            <span className="text-[11px] text-slate-500 font-normal">
              Scroll horizontally to view all series
            </span>
          </div>
          <div className="overflow-x-auto max-h-56 text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] sticky top-0">
                <tr>
                  {EXPECTED_COLUMN_NAMES.map((col, idx) => (
                    <th key={idx} className="p-2 border-r border-slate-200 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px] text-slate-700">
                {currentData.slice(0, 5).map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/40">
                    <td className="p-2 border-r border-slate-200 font-semibold bg-slate-50/50">
                      {row.wavelength}
                    </td>
                    <td className="p-2 border-r border-slate-200">{row.s_tm}</td>
                    <td className="p-2 border-r border-slate-200">{row.arg_std1}</td>
                    <td className="p-2 border-r border-slate-200">{row.arg_std2}</td>
                    <td className="p-2 border-r border-slate-200">{row.arg_std3}</td>
                    <td className="p-2 border-r border-slate-200 font-medium text-blue-700">
                      {row.s_tm_unknown}
                    </td>
                    <td className="p-2 border-r border-slate-200 bg-purple-50/30">{row.s_tm_al}</td>
                    <td className="p-2 border-r border-slate-200">{row.l_arg_std1}</td>
                    <td className="p-2 border-r border-slate-200">{row.l_arg_std2}</td>
                    <td className="p-2 border-r border-slate-200">{row.l_arg_std3}</td>
                    <td className="p-2 border-r border-slate-200">{row.d_arg_std1}</td>
                    <td className="p-2 border-r border-slate-200">{row.d_arg_std2}</td>
                    <td className="p-2 border-r border-slate-200">{row.d_arg_std3}</td>
                    <td className="p-2 font-medium text-purple-700 bg-purple-50/30">
                      {row.chiral_unknown}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
