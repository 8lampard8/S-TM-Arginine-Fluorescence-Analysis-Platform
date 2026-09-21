import React from 'react';
import { Atom } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const ModelAssumptions: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 mt-6 transition-all">
      <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100">
        <Atom className="w-5 h-5 text-blue-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {t.assumptionsTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.assumptionsSubtitle}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Assumption 1 */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
            1
          </div>
          <div>
            <strong className="text-slate-900 font-semibold block mb-1">
              {t.asmp1Title}
            </strong>
            <p className="text-slate-600 leading-relaxed">
              {t.asmp1Desc}
            </p>
          </div>
        </div>

        {/* Assumption 2 */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
            2
          </div>
          <div>
            <strong className="text-slate-900 font-semibold block mb-1">
              {t.asmp2Title}
            </strong>
            <p className="text-slate-600 leading-relaxed">
              {t.asmp2Desc}
            </p>
          </div>
        </div>

        {/* Assumption 3 */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex gap-3">
          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
            3
          </div>
          <div>
            <strong className="text-slate-900 font-semibold block mb-1">
              {t.asmp3Title}
            </strong>
            <p className="text-slate-600 leading-relaxed">
              {t.asmp3Desc}
            </p>
          </div>
        </div>

        {/* Assumption 4 */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex gap-3">
          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
            4
          </div>
          <div>
            <strong className="text-slate-900 font-semibold block mb-1">
              {t.asmp4Title}
            </strong>
            <p className="text-slate-600 leading-relaxed">
              {t.asmp4Desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
