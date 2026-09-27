import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Upload,
  Sparkles,
  LineChart,
  Scale,
  Award,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface WorkflowDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowDemoModal: React.FC<WorkflowDemoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const STEP_DURATION = 3500;
  const TICK = 50;

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (!isPlaying) return;

      setProgress((prev) => {
        const next = prev + (TICK / STEP_DURATION) * 100;
        if (next >= 100) {
          setCurrentStep((s) => (s + 1) % 6);
          return 0;
        }
        return next;
      });
    }, TICK);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const isZh = language === 'zh';

  const stepsData = [
    {
      num: 1,
      name: isZh ? '1. 下载模板' : '1. Template',
      title: isZh ? '下载官方 14 列标准数据模板' : 'Download 14-Col Standard Template',
      desc: isZh
        ? '包含波长、S-TM空白、三级总Arg标样、待测样、Al³⁺基线以及各三级 L/D 手性标样通道。'
        : 'Includes wavelength, S-TM blank, 3 total Arg stds, unknown, Al³⁺ baseline & 6 L/D chiral stds.',
      icon: FileSpreadsheet,
      accent: 'from-blue-600 to-indigo-600',
    },
    {
      num: 2,
      name: isZh ? '2. 上传数据' : '2. Upload',
      title: isZh ? '拖拽上传原始荧光光谱数据' : 'Drag & Drop Spectra Upload',
      desc: isZh
        ? '纯前端本地解析，严格校验 14 列格式、波长单调性与空值，实时显示 121 个点预览。'
        : 'Pure in-browser parsing. Validates 14 columns, monotonic wavelengths & missing values.',
      icon: Upload,
      accent: 'from-sky-500 to-blue-600',
    },
    {
      num: 3,
      name: isZh ? '3. 自动寻峰' : '3. Peak λmax',
      title: isZh ? '全光谱交互浏览与自动提取 λmax' : 'Interactive Spectra & Auto λmax',
      desc: isZh
        ? '一键自动定位发射峰值 λ = 486 nm，同步提取全部 13 个检测通道在特征波长处的荧光强度。'
        : 'Instantly identifies emission maximum λ = 486 nm and extracts intensities across 13 channels.',
      icon: Sparkles,
      accent: 'from-rose-500 to-red-600',
    },
    {
      num: 4,
      name: isZh ? '4. 总Arg定量' : '4. Total Arg',
      title: isZh ? '左栏：总精氨酸标准曲线与未知样定量' : 'Left Panel: Total Arg Standard Curve',
      desc: isZh
        ? '拟合方程 y = kC + b (R² = 0.9999)，精准解出未知样总精氨酸浓度 C_total = 24.03 μM。'
        : 'Fits linear regression y = kC + b (R² = 0.9999), determining C_total = 24.03 μM.',
      icon: LineChart,
      accent: 'from-blue-600 to-cyan-600',
    },
    {
      num: 5,
      name: isZh ? '5. 手性拆分' : '5. Chiral Solving',
      title: isZh ? '右栏：L/D 双标线对比与光学叠加联立求解' : 'Right Panel: Dual Curves & Chiral Solver',
      desc: isZh
        ? '基于 S-TM/Al³⁺ 体系 (区分度 2.68×) 联立质量守恒，精确解出 CL = 17.97 μM 与 CD = 6.06 μM。'
        : 'Based on S-TM/Al³⁺ (2.68× gap) and mass balance, solves CL = 17.97 μM & CD = 6.06 μM.',
      icon: Scale,
      accent: 'from-purple-600 to-indigo-600',
    },
    {
      num: 6,
      name: isZh ? '6. 大屏与导出' : '6. Export',
      title: isZh ? '手性结果大屏展示与 6 工作表报告导出' : 'Dashboard & 6-Sheet Excel Export',
      desc: isZh
        ? '直观展示 ee = 49.6% (L) 与组成环形图，一键导出完整多工作表科研分析报告及论文级矢量图。'
        : 'Visualizes ee = 49.6% (L) & donut chart. 1-click export of multi-sheet scientific report.',
      icon: Award,
      accent: 'from-emerald-600 to-teal-600',
    },
  ];

  const current = stepsData[currentStep];
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${current.accent} flex items-center justify-center text-white shadow-xs`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isZh ? 'S-TM 平台操作流程动态演示' : 'S-TM Platform Operational Workflow Demo'}
              </h3>
              <p className="text-xs text-slate-500">
                {isZh ? '6步全流程动态分解指导' : 'Step-by-step interactive visual walkthrough'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-blue-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
              <span>{isPlaying ? (isZh ? '暂停' : 'Pause') : (isZh ? '播放' : 'Play')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6 Step Navigation Tabs */}
        <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-center divide-x divide-slate-200">
          {stepsData.map((s, idx) => (
            <button
              key={s.num}
              onClick={() => {
                setCurrentStep(idx);
                setProgress(0);
              }}
              className={`py-2 px-1 transition-all cursor-pointer ${
                currentStep === idx
                  ? 'bg-white text-blue-700 shadow-xs border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Dynamic Graphic Visual Area */}
        <div className="p-6 bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          
          {/* Step 1 Graphic */}
          {currentStep === 0 && (
            <div className="flex items-center gap-5 animate-fadeIn">
              <div className="p-4 bg-blue-50 border-2 border-dashed border-blue-400 rounded-2xl flex items-center gap-3.5 shadow-xs">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-xs">
                  XLSX
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800">S-TM_Fluorescence_Template.xlsx</div>
                  <div className="text-[11px] text-emerald-700 font-mono font-semibold mt-0.5">
                    {isZh ? '✓ 包含全部 14 列标准通道' : '✓ Standard 14 Columns Ready'}
                  </div>
                </div>
              </div>
              <div className="text-3xl text-blue-600 animate-bounce">⬇</div>
            </div>
          )}

          {/* Step 2 Graphic */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center gap-2 animate-fadeIn">
              <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-xs text-emerald-900 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold">{isZh ? '121 个光谱波长点解析成功' : '121 Spectral Points Verified'}</span>
                <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200">410 – 650 nm</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {isZh ? '14/14 列精确匹配 • 0 空值 • 纯本地离线运行' : '14/14 Columns Matched • 0 Missing Values • 100% Local'}
              </div>
            </div>
          )}

          {/* Step 3 Graphic */}
          {currentStep === 2 && (
            <div className="w-full max-w-sm h-28 relative flex items-center justify-center animate-fadeIn">
              <svg viewBox="0 0 300 90" className="w-full h-full overflow-visible">
                <path d="M 10,75 Q 70,72 110,65 T 150,15 T 190,65 T 290,75" fill="none" stroke="#93c5fd" strokeWidth="2" />
                <path d="M 10,72 Q 70,68 110,50 T 150,5 T 190,50 T 290,72" fill="none" stroke="#2563eb" strokeWidth="3" />
                <path d="M 10,77 Q 70,75 110,68 T 150,25 T 190,68 T 290,77" fill="none" stroke="#a855f7" strokeWidth="2" />
                <line x1="150" y1="0" x2="150" y2="85" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                <circle cx="150" cy="5" r="4" fill="#ef4444" className="animate-ping" />
                <circle cx="150" cy="5" r="3" fill="#ef4444" />
              </svg>
              <div className="absolute top-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                λmax = 486 nm
              </div>
            </div>
          )}

          {/* Step 4 Graphic */}
          {currentStep === 3 && (
            <div className="flex items-center gap-7 animate-fadeIn">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl p-2 flex flex-col justify-between shadow-xs">
                <div className="text-[9px] font-mono text-slate-400">y = kC + b</div>
                <svg viewBox="0 0 60 40" className="w-full h-12">
                  <line x1="5" y1="35" x2="55" y2="35" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="5" y1="35" x2="5" y2="5" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="5" y1="33" x2="55" y2="8" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="15" cy="27" r="2" fill="#1d4ed8" />
                  <circle cx="30" cy="20" r="2" fill="#1d4ed8" />
                  <circle cx="45" cy="13" r="2" fill="#1d4ed8" />
                  <polygon points="38,13 41,16 38,19 35,16" fill="#ef4444" />
                </svg>
                <div className="text-[9px] font-bold text-emerald-600 text-right">R² = 0.9999</div>
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-500 font-medium">
                  {isZh ? '总精氨酸浓度 (Total Arg)' : 'Total Arginine Concentration'}
                </div>
                <div className="text-2xl font-black font-mono text-blue-900 mt-0.5">
                  24.03 <span className="text-sm font-semibold text-blue-700">μM</span>
                </div>
                <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1 font-semibold">
                  {isZh ? '✓ 处于标准曲线线性范围内' : '✓ Within Linear Calibration Range'}
                </div>
              </div>
            </div>
          )}

          {/* Step 5 Graphic */}
          {currentStep === 4 && (
            <div className="flex items-center gap-7 animate-fadeIn">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl p-2 flex flex-col justify-between shadow-xs">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-purple-600 font-bold">L-Arg</span>
                  <span className="text-amber-600 font-bold">D-Arg</span>
                </div>
                <svg viewBox="0 0 60 40" className="w-full h-12">
                  <line x1="5" y1="35" x2="55" y2="35" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="5" y1="34" x2="55" y2="6" stroke="#7c3aed" strokeWidth="2" />
                  <line x1="5" y1="34" x2="55" y2="21" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" />
                </svg>
                <div className="text-[9px] font-bold text-indigo-700 text-center">
                  {isZh ? '区分度 2.68×' : 'kL/kD = 2.68×'}
                </div>
              </div>
              <div className="space-y-1.5 text-left font-mono text-xs">
                <div className="bg-purple-50 text-purple-900 px-3 py-1.5 rounded-lg border border-purple-200">
                  <strong>C_L</strong> = 17.97 μM <span className="text-[11px] text-purple-600 font-semibold">(74.8%)</span>
                </div>
                <div className="bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200">
                  <strong>C_D</strong> = 6.06 μM <span className="text-[11px] text-amber-600 font-semibold">(25.2%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 6 Graphic */}
          {currentStep === 5 && (
            <div className="flex items-center gap-7 animate-fadeIn">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray="25 75" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#7c3aed" strokeWidth="5" strokeDasharray="75 25" strokeDashoffset="-25" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xs font-black font-mono text-slate-800">50%</span>
                  <span className="block text-[8px] text-slate-500 font-semibold">ee (L)</span>
                </div>
              </div>
              <div className="text-left space-y-1">
                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{isZh ? '导出 6 工作表分析报告' : 'Export 6-Sheet Report (.xlsx)'}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isZh ? '含全部原始光谱、标线方程与 300 DPI 矢量图' : 'Includes raw spectra, equations & 300 DPI figures'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Bottom Details Banner & Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              setCurrentStep((s) => (s - 1 + 6) % 6);
              setProgress(0);
            }}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isZh ? '上一步' : 'Previous'}</span>
          </button>

          <div className="text-center max-w-sm px-2">
            <div className="font-bold text-slate-900 text-xs">{current.title}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{current.desc}</div>
          </div>

          <button
            onClick={() => {
              setCurrentStep((s) => (s + 1) % 6);
              setProgress(0);
            }}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <span>{isZh ? '下一步' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
