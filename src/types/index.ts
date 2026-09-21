export type ConcentrationUnit = 'μM' | 'mM';

export type ResponseMode = 'raw' | 'delta' | 'relative';

export interface RawSpectrumRow {
  wavelength: number;
  s_tm: number; // Col 2: S-TM
  arg_std1: number; // Col 3: S-TM + Arg Std 1
  arg_std2: number; // Col 4: S-TM + Arg Std 2
  arg_std3: number; // Col 5: S-TM + Arg Std 3
  s_tm_unknown: number; // Col 6: S-TM + Unknown
  s_tm_al: number; // Col 7: S-TM + Al3+
  l_arg_std1: number; // Col 8: S-TM + Al3+ + L-Arg Std 1
  l_arg_std2: number; // Col 9: S-TM + Al3+ + L-Arg Std 2
  l_arg_std3: number; // Col 10: S-TM + Al3+ + L-Arg Std 3
  d_arg_std1: number; // Col 11: S-TM + Al3+ + D-Arg Std 1
  d_arg_std2: number; // Col 12: S-TM + Al3+ + D-Arg Std 2
  d_arg_std3: number; // Col 13: S-TM + Al3+ + D-Arg Std 3
  chiral_unknown: number; // Col 14: S-TM + Al3+ + Unknown
}

export interface ExtractedIntensities {
  wavelength: number;
  actualWavelength: number;
  s_tm: number;
  arg_std1: number;
  arg_std2: number;
  arg_std3: number;
  s_tm_unknown: number;
  s_tm_al: number;
  l_arg_std1: number;
  l_arg_std2: number;
  l_arg_std3: number;
  d_arg_std1: number;
  d_arg_std2: number;
  d_arg_std3: number;
  chiral_unknown: number;
}

export interface StandardsConcentration {
  std1: number;
  std2: number;
  std3: number;
  unit: ConcentrationUnit;
}

export interface RegressionResult {
  slope: number; // k
  intercept: number; // b
  rSquared: number; // R²
  equation: string;
  points: { x: number; y: number; label: string }[];
  quality: 'Good' | 'Acceptable' | 'Warning';
}

export interface TotalArgAnalysisResult {
  extracted: ExtractedIntensities;
  responseMode: ResponseMode;
  standards: StandardsConcentration;
  responses: {
    f0: number;
    f1: number;
    f2: number;
    f3: number;
    fUnknown: number;
    y1: number;
    y2: number;
    y3: number;
    yUnknown: number;
  };
  regression: RegressionResult;
  calculatedTotalArg: number;
  isExtrapolated: boolean;
  extrapolationWarning?: string;
}

export type BaselineInterceptMode = 'average' | 'zero' | 'weighted';

export interface ChiralAnalysisResult {
  lRegression: RegressionResult;
  dRegression: RegressionResult;
  discriminationFactor: number; // kL / kD
  discriminationFactorType: 'kL/kD' | 'kD/kL';
  lResponses: { c: number; f: number; y: number }[];
  dResponses: { c: number; f: number; y: number }[];
  yChiralUnknown: number;
  cL: number;
  cD: number;
  cTotal: number;
  lFraction: number; // percentage
  dFraction: number; // percentage
  ldRatio: number;
  ee: number; // percentage
  dominantEnantiomer: 'L' | 'D' | 'Racemic';
  isValidPhysical: boolean;
  warningMessage?: string;
  isExtrapolated: boolean;
  baselineMode: BaselineInterceptMode;
}

export interface MixtureValidationItem {
  id: string;
  label: string;
  knownLPercent: number;
  knownDPercent: number;
  totalConc: number;
  measuredY?: number;
  predictedLConc?: number;
  predictedDConc?: number;
  predictedLPercent?: number;
  recoveryPercent?: number;
  absErrorPercent?: number;
  relErrorPercent?: number;
}
