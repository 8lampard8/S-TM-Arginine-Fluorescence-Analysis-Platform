import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DataUploadSection } from './components/DataUploadSection';
import { SpectraViewer } from './components/SpectraViewer';
import { TotalArgSection } from './components/TotalArgSection';
import { ChiralArgSection } from './components/ChiralArgSection';
import { ChiralResultsDashboard } from './components/ChiralResultsDashboard';
import { MixtureValidationSection } from './components/MixtureValidationSection';
import { ModelAssumptions } from './components/ModelAssumptions';
import { ExportSection } from './components/ExportSection';
import { generateDemoSpectra } from './data/demoData';
import type {
  BaselineInterceptMode,
  MixtureValidationItem,
  RawSpectrumRow,
  ResponseMode,
  StandardsConcentration,
} from './types';
import {
  autoDetectPeakWavelength,
  extractIntensitiesAtWavelength,
  performChiralAnalysis,
  performTotalArgAnalysis,
} from './utils/math';
import { Sparkles, FileSpreadsheet } from 'lucide-react';
import { downloadExcelTemplate } from './utils/excel';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

function AppContent() {
  const { t } = useLanguage();

  // 1. Raw Spectra state (initialized with authentic demo data)
  const [spectra, setSpectra] = useState<RawSpectrumRow[]>(() => generateDemoSpectra());
  const [isDemoData, setIsDemoData] = useState<boolean>(true);

  // 2. Feature wavelength
  const [selectedWavelength, setSelectedWavelength] = useState<number>(486);

  // 3. Concentration Standards
  const [standardsTotal, setStandardsTotal] = useState<StandardsConcentration>({
    std1: 10,
    std2: 20,
    std3: 30,
    unit: 'μM',
  });

  const [standardsL, setStandardsL] = useState<StandardsConcentration>({
    std1: 10,
    std2: 20,
    std3: 30,
    unit: 'μM',
  });

  const [standardsD, setStandardsD] = useState<StandardsConcentration>({
    std1: 10,
    std2: 20,
    std3: 30,
    unit: 'μM',
  });

  // 4. Response Formulation & Baseline Intercept Mode
  const [responseMode, setResponseMode] = useState<ResponseMode>('relative');
  const [baselineMode, setBaselineMode] = useState<BaselineInterceptMode>('average');

  // 5. Mixture validation items
  const [validationItems, setValidationItems] = useState<MixtureValidationItem[]>([]);

  // Synchronize wavelength when new dataset is loaded
  const handleDataLoaded = (data: RawSpectrumRow[], isDemo: boolean) => {
    setSpectra(data);
    setIsDemoData(isDemo);
    const peak = autoDetectPeakWavelength(data);
    setSelectedWavelength(peak);
  };

  const handleLoadDemo = () => {
    const demo = generateDemoSpectra();
    handleDataLoaded(demo, true);
  };

  const handleReset = () => {
    setSpectra([]);
    setIsDemoData(false);
    setValidationItems([]);
  };

  // Extract intensities at selected wavelength
  const extracted = useMemo(() => {
    if (spectra.length === 0) return null;
    return extractIntensitiesAtWavelength(spectra, selectedWavelength);
  }, [spectra, selectedWavelength]);

  // Left column calculation: Total Arg Analysis
  const totalArgResult = useMemo(() => {
    if (!extracted) return null;
    return performTotalArgAnalysis(extracted, standardsTotal, responseMode);
  }, [extracted, standardsTotal, responseMode]);

  // Right column calculation: Chiral Analysis
  const chiralResult = useMemo(() => {
    if (!extracted || !totalArgResult) return null;
    return performChiralAnalysis(
      extracted,
      totalArgResult,
      standardsL,
      standardsD,
      responseMode,
      baselineMode
    );
  }, [extracted, totalArgResult, standardsL, standardsD, responseMode, baselineMode]);

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col text-slate-800 antialiased">
      {/* Top Navbar with Language Switcher */}
      <Header
        isDemoData={isDemoData}
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        hasData={spectra.length > 0}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step 1 & 2: Excel Data Import & Validation Area */}
        <DataUploadSection
          currentData={spectra}
          onDataLoaded={handleDataLoaded}
          isDemo={isDemoData}
        />

        {spectra.length === 0 ? (
          /* Empty State prompt when dataset is cleared */
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {t.noDataTitle}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              {t.noDataDesc}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleLoadDemo}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {t.loadDemoBtn}
              </button>
              <button
                onClick={downloadExcelTemplate}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                {t.downloadTemplate}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step 3: Interactive Spectral Viewer & Wavelength Selection */}
            <SpectraViewer
              spectra={spectra}
              selectedWavelength={selectedWavelength}
              onSelectWavelength={setSelectedWavelength}
            />

            {/* Step 4 & 5: Left & Right Dual-Column Quantification Layout */}
            {totalArgResult && chiralResult && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {/* Left Column: Total Arginine Quantification */}
                  <TotalArgSection
                    result={totalArgResult}
                    standards={standardsTotal}
                    onUpdateStandards={setStandardsTotal}
                    responseMode={responseMode}
                    onChangeResponseMode={setResponseMode}
                  />

                  {/* Right Column: Chiral Quantification of L-/D-Arginine */}
                  <ChiralArgSection
                    chiralResult={chiralResult}
                    totalArgResult={totalArgResult}
                    lStandards={standardsL}
                    dStandards={standardsD}
                    onUpdateLStandards={setStandardsL}
                    onUpdateDStandards={setStandardsD}
                    responseMode={responseMode}
                    baselineMode={baselineMode}
                    onChangeBaselineMode={setBaselineMode}
                  />
                </div>

                {/* Final Chiral Results Dashboard */}
                <ChiralResultsDashboard
                  chiralResult={chiralResult}
                  lStandards={standardsL}
                  dStandards={standardsD}
                />

                {/* Optional Scientific Mixture Validation Module (Section 19) */}
                <MixtureValidationSection
                  chiralResult={chiralResult}
                  lStandards={standardsL}
                  validationItems={validationItems}
                  onUpdateValidationItems={setValidationItems}
                />

                {/* Scientific Rigor: Model Assumptions (Section 18) */}
                <ModelAssumptions />

                {/* Step 6: Multi-Sheet Excel & High-Res Figure Export */}
                <ExportSection
                  rawSpectra={spectra}
                  totalArgResult={totalArgResult}
                  chiralResult={chiralResult}
                  lStandards={standardsL}
                  dStandards={standardsD}
                  mixtureValidation={validationItems}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>{t.footerPlatform}</p>
          <p className="text-slate-400">{t.footerSecurity}</p>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
