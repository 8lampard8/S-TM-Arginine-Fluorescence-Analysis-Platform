import React, { useState } from 'react';
import { FlaskConical, ArrowLeftRight } from 'lucide-react';
import type { CalibrationSource } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  PUBLISHED_CALIBRATION as P,
  STM_CONC_LABEL,
  eqToUM,
  umToEq,
} from '../utils/math';

interface AnalysisParametersProps {
  calibrationSource: CalibrationSource;
  onChangeSource: (s: CalibrationSource) => void;
}

export const AnalysisParameters: React.FC<AnalysisParametersProps> = ({
  calibrationSource,
  onChangeSource,
}) => {
  const { language } = useLanguage();
  const zh = language === 'zh';
  const [eqValue, setEqValue] = useState<string>('1');
  const [umValue, setUmValue] = useState<string>('10');

  const onEq = (v: string) => {
    setEqValue(v);
    const n = parseFloat(v);
    if (!isNaN(n)) setUmValue(String(+eqToUM(n).toFixed(4)));
  };
  const onUm = (v: string) => {
    setUmValue(v);
    const n = parseFloat(v);
    if (!isNaN(n)) setEqValue(String(+umToEq(n).toFixed(4)));
  };

  const btn = (active: boolean) =>
    `px-3 py-1.5 rounded-md border text-xs transition-all cursor-pointer ${
      active
        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
    }`;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <FlaskConical className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          {zh ? '分析参数 (Analysis Parameters)' : 'Analysis Parameters'}
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        {/* Fixed S-TM concentration */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
          <div className="text-[11px] text-slate-500">
            {zh ? '探针浓度（固定，无需输入）' : 'Probe concentration (fixed, no input needed)'}
          </div>
          <div className="mt-1 font-mono font-bold text-emerald-900 text-sm">
            S-TM Concentration: {STM_CONC_LABEL}
          </div>
          <div className="mt-2 font-mono text-[11px] text-slate-700">
            C(μM) = 10 × x(eq)
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {zh ? '1 eq 精氨酸 = 10 μM' : '1 eq arginine = 10 μM'}
          </div>
        </div>

        {/* Live converter */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="text-[11px] text-slate-500 mb-1.5">
            {zh ? '当量 ⇄ 摩尔浓度 自动换算' : 'Equivalent ⇄ molar concentration'}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-1 flex-1">
              <input
                type="number"
                step="any"
                value={eqValue}
                onChange={(e) => onEq(e.target.value)}
                className="w-full text-center font-mono font-bold focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 ml-1">eq</span>
            </div>
            <ArrowLeftRight className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-1 flex-1">
              <input
                type="number"
                step="any"
                value={umValue}
                onChange={(e) => onUm(e.target.value)}
                className="w-full text-center font-mono font-bold focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 ml-1">μM</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5">
            {zh
              ? '标准浓度单位可直接选择 eq，结果将自动同时给出 μM。'
              : 'Select “eq” as a standards unit; results are also reported in μM.'}
          </div>
        </div>

        {/* Calibration source */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="text-[11px] text-slate-500 mb-1.5">
            {zh ? '标准曲线来源' : 'Calibration source'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button className={btn(calibrationSource === 'fit')} onClick={() => onChangeSource('fit')}>
              {zh ? '由上传数据拟合' : 'Fit uploaded standards'}
            </button>
            <button
              className={btn(calibrationSource === 'published')}
              onClick={() => onChangeSource('published')}
            >
              {zh ? '已建立标准曲线 (μM)' : 'Established calibration (μM)'}
            </button>
          </div>
        </div>
      </div>

      {calibrationSource === 'published' && (
        <div className="mt-4 border border-blue-200 rounded-lg overflow-hidden text-[11px]">
          <div className="bg-blue-50 px-3 py-1.5 font-semibold text-blue-900">
            {zh
              ? '已建立标准曲线（浓度单位 μM；ΔF = F_sample − F₀(S-TM+Al³⁺ 实测空白)）'
              : 'Established calibration (μM; ΔF = F_sample − measured F₀ of S-TM+Al³⁺)'}
          </div>
          <table className="w-full font-mono">
            <thead className="text-slate-500 bg-slate-50">
              <tr>
                <th className="text-left px-3 py-1">{zh ? '曲线' : 'Curve'}</th>
                <th className="text-left px-3 py-1">{zh ? '方程 (μM)' : 'Equation (μM)'}</th>
                <th className="text-left px-3 py-1">{zh ? '线性范围' : 'Linear range'}</th>
                <th className="text-left px-3 py-1">LOD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-1">Total Arg</td>
                <td className="px-3 py-1">F = {P.total.intercept} + {P.total.slope}·C</td>
                <td className="px-3 py-1">—</td>
                <td className="px-3 py-1">{P.total.lod} μM</td>
              </tr>
              <tr>
                <td className="px-3 py-1">L-Arg (1)</td>
                <td className="px-3 py-1">F_L = {P.l.intercept} + {P.l.slope}·C_L</td>
                <td className="px-3 py-1">0–{P.l.rangeMax} μM (0–4.32 eq)</td>
                <td className="px-3 py-1">{P.l.lod} μM</td>
              </tr>
              <tr className="text-slate-500">
                <td className="px-3 py-1">L-Arg (2)</td>
                <td className="px-3 py-1">F_L = {P.l.intercept2} + {P.l.slope2}·C_L</td>
                <td className="px-3 py-1">{zh ? '第二线性段' : '2nd region'}</td>
                <td className="px-3 py-1">—</td>
              </tr>
              <tr>
                <td className="px-3 py-1">D-Arg (1)</td>
                <td className="px-3 py-1">F_D = {P.d.intercept} + {P.d.slope}·C_D</td>
                <td className="px-3 py-1">0–{P.d.rangeMax} μM (0–1.99 eq)</td>
                <td className="px-3 py-1">{P.d.lod} μM</td>
              </tr>
              <tr className="text-slate-500">
                <td className="px-3 py-1">D-Arg (2)</td>
                <td className="px-3 py-1">F_D = {P.d.intercept2} + {P.d.slope2}·C_D</td>
                <td className="px-3 py-1">{zh ? '第二线性段' : '2nd region'}</td>
                <td className="px-3 py-1">—</td>
              </tr>
            </tbody>
          </table>
          <div className="px-3 py-2 bg-slate-50 font-mono text-[11px] text-slate-700 space-y-0.5">
            <div>C_L + C_D = C_total</div>
            <div>ΔF = {P.l.slope}·C_L + {P.d.slope}·C_D</div>
            <div>C_L = ({P.d.slope}·C_total − ΔF) / {(P.d.slope - P.l.slope).toFixed(2)}</div>
            <div>C_D = (ΔF − {P.l.slope}·C_total) / {(P.d.slope - P.l.slope).toFixed(2)}</div>
          </div>
        </div>
      )}
    </section>
  );
};
