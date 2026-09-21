import React from 'react';
import { Atom } from 'lucide-react';

export const ModelAssumptions: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 mt-6 transition-all">
      <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100">
        <Atom className="w-5 h-5 text-blue-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Methodological Principles & Model Assumptions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theoretical framework, scientific rigor, and boundary conditions for S-TM arginine assay
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
              Chiral Differentiation via Al³⁺ Coordination
            </strong>
            <p className="text-slate-600 leading-relaxed">
              S-TM alone responds sensitively to total arginine regardless of chirality. In the presence of stoichiometric Al³⁺, the ternary complex [S-TM · Al³⁺ · Arg] creates an asymmetric coordination cavity, leading to distinct fluorescence enhancements ($k_L \neq k_D$).
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
              Linear Dynamic Range Fidelity
            </strong>
            <p className="text-slate-600 leading-relaxed">
              The probe concentration and fluorometer sensitivity are calibrated such that within the chosen standard range (e.g. 0 – 30 μM), both the total arginine and chiral enantiomers exhibit high linear correlation ($R^2 \ge 0.95$).
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
              Linear Optical Superposition Principle
            </strong>
            <p className="text-slate-600 leading-relaxed">
              For any enantiomeric mixture, the total fluorescence response in S-TM/Al³⁺ follows linear superposition:
              <span className="font-mono block my-1 font-semibold text-purple-900 bg-purple-50/70 p-1 rounded border border-purple-100">
                y_unknown = b + k_L × C_L + k_D × C_D
              </span>
              neglecting non-linear cross-association or cooperative competitive interactions at micro-molar regimes.
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
              Mass Conservation Coupling Constraint
            </strong>
            <p className="text-slate-600 leading-relaxed">
              The total concentration obtained from the metal-free S-TM standard curve serves as an invariant mass constraint:
              <span className="font-mono block my-1 font-semibold text-purple-900 bg-purple-50/70 p-1 rounded border border-purple-100">
                C_total = C_L + C_D
              </span>
              enabling exact algebraic determination of both enantiomeric concentrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
