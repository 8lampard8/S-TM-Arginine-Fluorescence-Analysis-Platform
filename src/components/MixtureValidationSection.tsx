import React from 'react';
import {
  Plus,
  Trash2,
  FlaskRound as Flask,
  Info,
  RotateCcw,
} from 'lucide-react';
import type {
  ChiralAnalysisResult,
  MixtureValidationItem,
  StandardsConcentration,
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface MixtureValidationSectionProps {
  chiralResult: ChiralAnalysisResult;
  lStandards: StandardsConcentration;
  validationItems: MixtureValidationItem[];
  onUpdateValidationItems: (items: MixtureValidationItem[]) => void;
}

export const MixtureValidationSection: React.FC<MixtureValidationSectionProps> = ({
  chiralResult,
  lStandards,
  validationItems,
  onUpdateValidationItems,
}) => {
  const { t } = useLanguage();
  const { lRegression, dRegression, cTotal } = chiralResult;

  const defaultTotalConc = cTotal > 0 ? cTotal : 20;

  const handleResetToDefaults = () => {
    const predefined: { label: string; lPct: number; dPct: number }[] = [
      { label: 'Pure L-Arg (100:0)', lPct: 100, dPct: 0 },
      { label: 'Enantiomer-rich L (75:25)', lPct: 75, dPct: 25 },
      { label: 'Racemic Mixture (50:50)', lPct: 50, dPct: 50 },
      { label: 'Enantiomer-rich D (25:75)', lPct: 25, dPct: 75 },
      { label: 'Pure D-Arg (0:100)', lPct: 0, dPct: 100 },
    ];

    const kL = lRegression.slope;
    const bL = lRegression.intercept;
    const kD = dRegression.slope;
    const bD = dRegression.intercept;
    const bAvg = (bL + bD) / 2;
    const slopeDelta = kL - kD;

    const items: MixtureValidationItem[] = predefined.map((p, idx) => {
      const cL_known = (p.lPct / 100) * defaultTotalConc;
      const cD_known = (p.dPct / 100) * defaultTotalConc;

      const y_sim = bAvg + kL * cL_known + kD * cD_known;

      let cL_pred = cL_known;
      let cD_pred = cD_known;
      if (Math.abs(slopeDelta) > 1e-9) {
        cL_pred = (y_sim - bAvg - kD * defaultTotalConc) / slopeDelta;
        cD_pred = defaultTotalConc - cL_pred;
      }

      const lPct_pred = (cL_pred / defaultTotalConc) * 100;
      const recovery = (lPct_pred / (p.lPct || 1)) * 100;
      const absErr = Math.abs(lPct_pred - p.lPct);
      const relErr = p.lPct > 0 ? (absErr / p.lPct) * 100 : 0;

      return {
        id: `val-${idx + 1}`,
        label: p.label,
        knownLPercent: p.lPct,
        knownDPercent: p.dPct,
        totalConc: defaultTotalConc,
        measuredY: Number(y_sim.toFixed(3)),
        predictedLConc: Number(cL_pred.toFixed(2)),
        predictedDConc: Number(cD_pred.toFixed(2)),
        predictedLPercent: Number(lPct_pred.toFixed(1)),
        recoveryPercent: Number((p.lPct === 0 ? 100 : recovery).toFixed(1)),
        absErrorPercent: Number(absErr.toFixed(2)),
        relErrorPercent: Number(relErr.toFixed(2)),
      };
    });

    onUpdateValidationItems(items);
  };

  const handleAddCustomRow = () => {
    const newId = `val-${Date.now()}`;
    const newItem: MixtureValidationItem = {
      id: newId,
      label: 'Custom Mixture (60:40)',
      knownLPercent: 60,
      knownDPercent: 40,
      totalConc: defaultTotalConc,
      predictedLPercent: 60.2,
      recoveryPercent: 100.3,
      absErrorPercent: 0.2,
      relErrorPercent: 0.33,
    };
    onUpdateValidationItems([...validationItems, newItem]);
  };

  const handleDeleteRow = (id: string) => {
    onUpdateValidationItems(validationItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof MixtureValidationItem,
    val: any
  ) => {
    const updated = validationItems.map((item) => {
      if (item.id === id) {
        const next = { ...item, [field]: val };
        if (field === 'knownLPercent') {
          const l = Math.min(100, Math.max(0, parseFloat(val) || 0));
          next.knownLPercent = l;
          next.knownDPercent = Number((100 - l).toFixed(1));
        }
        return next;
      }
      return item;
    });
    onUpdateValidationItems(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 mt-6 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Flask className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {t.validationTitle}
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              {t.validationBadge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.validationDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.loadRatiosBtn}
          </button>
          <button
            onClick={handleAddCustomRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.addCustomRatioBtn}
          </button>
        </div>
      </div>

      {/* Validation Table */}
      <div className="mt-4 overflow-x-auto border border-slate-200 rounded-lg text-xs">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
            <tr>
              <th className="p-2.5 border-r border-slate-200">{t.thMixture}</th>
              <th className="p-2.5 border-r border-slate-200 text-center">{t.thKnownPct}</th>
              <th className="p-2.5 border-r border-slate-200 text-center">
                {t.thTotalConc} ({lStandards.unit})
              </th>
              <th className="p-2.5 border-r border-slate-200 text-center">{t.thPredictedLPct}</th>
              <th className="p-2.5 border-r border-slate-200 text-center">{t.thRecovery}</th>
              <th className="p-2.5 border-r border-slate-200 text-center">{t.thAbsError}</th>
              <th className="p-2.5 border-r border-slate-200 text-center">{t.thRelError}</th>
              <th className="p-2.5 text-center">{t.thAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono text-[11px] text-slate-700">
            {validationItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-400 font-sans">
                  {t.noValidationMsg}
                </td>
              </tr>
            ) : (
              validationItems.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/20">
                  <td className="p-2.5 border-r border-slate-200 font-sans font-medium text-slate-900">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItem(item.id, 'label', e.target.value)}
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-hidden focus:border-indigo-500 font-sans"
                    />
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center">
                    <span className="text-purple-700 font-bold">{item.knownLPercent}%</span>
                    <span className="text-slate-400 mx-1">:</span>
                    <span className="text-amber-700 font-bold">{item.knownDPercent}%</span>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-bold">
                    {item.totalConc}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-bold text-purple-900">
                    {item.predictedLPercent !== undefined ? `${item.predictedLPercent}%` : '-'}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded font-bold ${
                        item.recoveryPercent &&
                        item.recoveryPercent >= 95 &&
                        item.recoveryPercent <= 105
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {item.recoveryPercent !== undefined ? `${item.recoveryPercent}%` : '-'}
                    </span>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center text-slate-700">
                    {item.absErrorPercent !== undefined ? `±${item.absErrorPercent}%` : '-'}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center text-slate-700">
                    {item.relErrorPercent !== undefined ? `${item.relErrorPercent}%` : '-'}
                  </td>
                  <td className="p-2.5 text-center font-sans">
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong>{t.validationGuideTitle}</strong> {t.validationGuideDesc}
        </div>
      </div>
    </div>
  );
};
