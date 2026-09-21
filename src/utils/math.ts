import type {
  BaselineInterceptMode,
  ChiralAnalysisResult,
  ExtractedIntensities,
  RawSpectrumRow,
  RegressionResult,
  ResponseMode,
  StandardsConcentration,
  TotalArgAnalysisResult,
} from '../types';

/**
 * Calculate simple linear regression y = k * x + b
 */
export function calculateLinearRegression(
  x: number[],
  y: number[],
  labels?: string[]
): RegressionResult {
  const n = x.length;
  if (n < 2) {
    return {
      slope: 0,
      intercept: 0,
      rSquared: 0,
      equation: 'y = 0',
      points: [],
      quality: 'Warning',
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
    sumYY += y[i] * y[i];
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  const ssXX = sumXX - n * meanX * meanX;
  const ssYY = sumYY - n * meanY * meanY;
  const ssXY = sumXY - n * meanX * meanY;

  const slope = ssXX !== 0 ? ssXY / ssXX : 0;
  const intercept = meanY - slope * meanX;

  let rSquared = 0;
  if (ssXX > 0 && ssYY > 0) {
    const r = ssXY / Math.sqrt(ssXX * ssYY);
    rSquared = Math.min(1, Math.max(0, r * r));
  } else if (ssYY === 0) {
    rSquared = 1;
  }

  let quality: 'Good' | 'Acceptable' | 'Warning' = 'Warning';
  if (rSquared >= 0.99) {
    quality = 'Good';
  } else if (rSquared >= 0.95) {
    quality = 'Acceptable';
  }

  const sign = intercept >= 0 ? '+' : '-';
  const absIntercept = Math.abs(intercept);
  const equation = `y = ${slope.toFixed(4)}x ${sign} ${absIntercept.toFixed(4)}`;

  const points = x.map((xi, i) => ({
    x: xi,
    y: y[i],
    label: labels ? labels[i] : `Std ${i + 1}`,
  }));

  return {
    slope,
    intercept,
    rSquared,
    equation,
    points,
    quality,
  };
}

/**
 * Compute fluorescence response according to mode
 */
export function computeResponse(
  f: number,
  f0: number,
  mode: ResponseMode
): number {
  if (mode === 'raw') {
    return f;
  }
  if (mode === 'delta') {
    return f - f0;
  }
  // relative: (F - F0) / F0
  if (Math.abs(f0) < 1e-9) return 0;
  return (f - f0) / f0;
}

/**
 * Find the nearest wavelength row in the spectra dataset
 */
export function findNearestSpectrumRow(
  rows: RawSpectrumRow[],
  targetWavelength: number
): RawSpectrumRow | null {
  if (!rows || rows.length === 0) return null;

  let bestRow = rows[0];
  let minDiff = Math.abs(rows[0].wavelength - targetWavelength);

  for (let i = 1; i < rows.length; i++) {
    const diff = Math.abs(rows[i].wavelength - targetWavelength);
    if (diff < minDiff) {
      minDiff = diff;
      bestRow = rows[i];
    }
  }

  return bestRow;
}

/**
 * Automatically detect peak wavelength (lambda_max) across spectra
 */
export function autoDetectPeakWavelength(
  rows: RawSpectrumRow[],
  minWl?: number,
  maxWl?: number
): number {
  if (!rows || rows.length === 0) return 450;

  const validRows = rows.filter((r) => {
    if (minWl !== undefined && r.wavelength < minWl) return false;
    if (maxWl !== undefined && r.wavelength > maxWl) return false;
    return true;
  });

  const searchPool = validRows.length > 0 ? validRows : rows;

  let maxIntensity = -Infinity;
  let peakWl = searchPool[0].wavelength;

  for (const r of searchPool) {
    const compositeIntensity = r.arg_std3 + r.l_arg_std3 + r.s_tm_unknown;
    if (compositeIntensity > maxIntensity) {
      maxIntensity = compositeIntensity;
      peakWl = r.wavelength;
    }
  }

  return peakWl;
}

/**
 * Extract intensities at target wavelength
 */
export function extractIntensitiesAtWavelength(
  rows: RawSpectrumRow[],
  targetWavelength: number
): ExtractedIntensities | null {
  const row = findNearestSpectrumRow(rows, targetWavelength);
  if (!row) return null;

  return {
    wavelength: targetWavelength,
    actualWavelength: row.wavelength,
    s_tm: row.s_tm,
    arg_std1: row.arg_std1,
    arg_std2: row.arg_std2,
    arg_std3: row.arg_std3,
    s_tm_unknown: row.s_tm_unknown,
    s_tm_al: row.s_tm_al,
    l_arg_std1: row.l_arg_std1,
    l_arg_std2: row.l_arg_std2,
    l_arg_std3: row.l_arg_std3,
    d_arg_std1: row.d_arg_std1,
    d_arg_std2: row.d_arg_std2,
    d_arg_std3: row.d_arg_std3,
    chiral_unknown: row.chiral_unknown,
  };
}

/**
 * Calculate Total Arginine Quantification from S-TM assay
 */
export function performTotalArgAnalysis(
  extracted: ExtractedIntensities,
  standards: StandardsConcentration,
  responseMode: ResponseMode
): TotalArgAnalysisResult {
  const f0 = extracted.s_tm;
  const f1 = extracted.arg_std1;
  const f2 = extracted.arg_std2;
  const f3 = extracted.arg_std3;
  const fUnknown = extracted.s_tm_unknown;

  const y1 = computeResponse(f1, f0, responseMode);
  const y2 = computeResponse(f2, f0, responseMode);
  const y3 = computeResponse(f3, f0, responseMode);
  const yUnknown = computeResponse(fUnknown, f0, responseMode);

  const x = [standards.std1, standards.std2, standards.std3];
  const y = [y1, y2, y3];
  const labels = [
    `Std 1 (${standards.std1} ${standards.unit})`,
    `Std 2 (${standards.std2} ${standards.unit})`,
    `Std 3 (${standards.std3} ${standards.unit})`,
  ];

  const regression = calculateLinearRegression(x, y, labels);

  let calculatedTotalArg = 0;
  if (Math.abs(regression.slope) > 1e-12) {
    calculatedTotalArg = (yUnknown - regression.intercept) / regression.slope;
  }

  const minStd = Math.min(...x);
  const maxStd = Math.max(...x);
  const isExtrapolated =
    calculatedTotalArg < minStd || calculatedTotalArg > maxStd;

  let extrapolationWarning: string | undefined;
  if (isExtrapolated) {
    extrapolationWarning =
      'Warning: The sample response is outside the calibration range.';
  }

  return {
    extracted,
    responseMode,
    standards,
    responses: {
      f0,
      f1,
      f2,
      f3,
      fUnknown,
      y1,
      y2,
      y3,
      yUnknown,
    },
    regression,
    calculatedTotalArg,
    isExtrapolated,
    extrapolationWarning,
  };
}

/**
 * Solve Chiral System of Equations for L-Arg and D-Arg
 */
export function performChiralAnalysis(
  extracted: ExtractedIntensities,
  totalArgResult: TotalArgAnalysisResult,
  lStandards: StandardsConcentration,
  dStandards: StandardsConcentration,
  responseMode: ResponseMode,
  baselineMode: BaselineInterceptMode = 'average'
): ChiralAnalysisResult {
  const fAl = extracted.s_tm_al;

  const yL1 = computeResponse(extracted.l_arg_std1, fAl, responseMode);
  const yL2 = computeResponse(extracted.l_arg_std2, fAl, responseMode);
  const yL3 = computeResponse(extracted.l_arg_std3, fAl, responseMode);

  const yD1 = computeResponse(extracted.d_arg_std1, fAl, responseMode);
  const yD2 = computeResponse(extracted.d_arg_std2, fAl, responseMode);
  const yD3 = computeResponse(extracted.d_arg_std3, fAl, responseMode);

  const yChiralUnknown = computeResponse(
    extracted.chiral_unknown,
    fAl,
    responseMode
  );

  const xL = [lStandards.std1, lStandards.std2, lStandards.std3];
  const yL = [yL1, yL2, yL3];
  const lRegression = calculateLinearRegression(xL, yL);

  const xD = [dStandards.std1, dStandards.std2, dStandards.std3];
  const yD = [yD1, yD2, yD3];
  const dRegression = calculateLinearRegression(xD, yD);

  let discriminationFactor = 1;
  let discriminationFactorType: 'kL/kD' | 'kD/kL' = 'kL/kD';
  if (Math.abs(dRegression.slope) > 1e-12) {
    discriminationFactor = lRegression.slope / dRegression.slope;
  } else if (Math.abs(lRegression.slope) > 1e-12) {
    discriminationFactor = dRegression.slope / lRegression.slope;
    discriminationFactorType = 'kD/kL';
  }

  const cTotal = totalArgResult.calculatedTotalArg;
  const kL = lRegression.slope;
  const bL = lRegression.intercept;
  const kD = dRegression.slope;
  const bD = dRegression.intercept;

  let cL = 0;
  let cD = 0;
  const slopeDelta = kL - kD;

  if (Math.abs(slopeDelta) > 1e-9) {
    if (baselineMode === 'zero') {
      cL = (yChiralUnknown - kD * cTotal) / slopeDelta;
      cD = cTotal - cL;
    } else if (baselineMode === 'weighted') {
      const effKL = kL + (cTotal > 0 ? bL / cTotal : 0);
      const effKD = kD + (cTotal > 0 ? bD / cTotal : 0);
      const effDelta = effKL - effKD;
      if (Math.abs(effDelta) > 1e-9) {
        cL = (yChiralUnknown - effKD * cTotal) / effDelta;
        cD = cTotal - cL;
      } else {
        cL = (yChiralUnknown - (bL + bD) / 2 - kD * cTotal) / slopeDelta;
        cD = cTotal - cL;
      }
    } else {
      const bAvg = (bL + bD) / 2;
      cL = (yChiralUnknown - bAvg - kD * cTotal) / slopeDelta;
      cD = cTotal - cL;
    }
  } else {
    cL = cTotal / 2;
    cD = cTotal / 2;
  }

  const tolerance = -0.01 * Math.abs(cTotal);
  const isValidPhysical = cL >= tolerance && cD >= tolerance;

  let warningMessage: string | undefined;
  if (!isValidPhysical) {
    warningMessage =
      'The calculated chiral composition is outside the valid calibration model. Please check the calibration curves, fluorescence data, or linear additivity assumption.';
  }

  const clampedCL = Math.max(0, cL);
  const clampedCD = Math.max(0, cD);
  const sumEnantiomers = clampedCL + clampedCD;

  let lFraction = 50;
  let dFraction = 50;
  let ldRatio = 1;
  let ee = 0;
  let dominantEnantiomer: 'L' | 'D' | 'Racemic' = 'Racemic';

  if (sumEnantiomers > 1e-12) {
    lFraction = (clampedCL / sumEnantiomers) * 100;
    dFraction = (clampedCD / sumEnantiomers) * 100;
    ldRatio = clampedCD > 1e-12 ? clampedCL / clampedCD : Infinity;
    ee = (Math.abs(clampedCL - clampedCD) / sumEnantiomers) * 100;

    if (clampedCL > clampedCD + 1e-6) {
      dominantEnantiomer = 'L';
    } else if (clampedCD > clampedCL + 1e-6) {
      dominantEnantiomer = 'D';
    } else {
      dominantEnantiomer = 'Racemic';
    }
  }

  const minLStd = Math.min(...xL);
  const maxLStd = Math.max(...xL);
  const isExtrapolated = cL < minLStd || cL > maxLStd || cD < minLStd || cD > maxLStd;

  const lResponses = [
    { c: xL[0], f: extracted.l_arg_std1, y: yL1 },
    { c: xL[1], f: extracted.l_arg_std2, y: yL2 },
    { c: xL[2], f: extracted.l_arg_std3, y: yL3 },
  ];

  const dResponses = [
    { c: xD[0], f: extracted.d_arg_std1, y: yD1 },
    { c: xD[1], f: extracted.d_arg_std2, y: yD2 },
    { c: xD[2], f: extracted.d_arg_std3, y: yD3 },
  ];

  return {
    lRegression,
    dRegression,
    discriminationFactor,
    discriminationFactorType,
    lResponses,
    dResponses,
    yChiralUnknown,
    cL,
    cD,
    cTotal,
    lFraction,
    dFraction,
    ldRatio,
    ee,
    dominantEnantiomer,
    isValidPhysical,
    warningMessage,
    isExtrapolated,
    baselineMode,
  };
}
