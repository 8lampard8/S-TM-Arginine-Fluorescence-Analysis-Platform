import * as XLSX from 'xlsx';
import type {
  ChiralAnalysisResult,
  MixtureValidationItem,
  RawSpectrumRow,
  StandardsConcentration,
  TotalArgAnalysisResult,
} from '../types';

export const EXPECTED_COLUMN_NAMES = [
  'Wavelength (nm)',
  'S-TM',
  'S-TM + Arg Standard 1',
  'S-TM + Arg Standard 2',
  'S-TM + Arg Standard 3',
  'S-TM + Unknown Sample',
  'S-TM + Al3+',
  'S-TM + Al3+ + L-Arg Standard 1',
  'S-TM + Al3+ + L-Arg Standard 2',
  'S-TM + Al3+ + L-Arg Standard 3',
  'S-TM + Al3+ + D-Arg Standard 1',
  'S-TM + Al3+ + D-Arg Standard 2',
  'S-TM + Al3+ + D-Arg Standard 3',
  'S-TM + Al3+ + Unknown Sample',
];

/**
 * Generate and trigger download of the official 14-column Excel template
 */
export function downloadExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // 1. Instructions Sheet
  const instructionsData = [
    ['S-TM Arginine Fluorescence Assay - Data Template Guide'],
    [''],
    ['Column Index', 'Column Header', 'Description & Assay Role'],
    ['1', 'Wavelength (nm)', 'Fluorescence emission wavelength (e.g. 400 - 650 nm, step 1-5 nm)'],
    ['2', 'S-TM', 'Blank fluorescence of probe S-TM without metal and arginine'],
    ['3', 'S-TM + Arg Standard 1', 'Total Arg standard curve point 1 (e.g. 10 μM)'],
    ['4', 'S-TM + Arg Standard 2', 'Total Arg standard curve point 2 (e.g. 20 μM)'],
    ['5', 'S-TM + Arg Standard 3', 'Total Arg standard curve point 3 (e.g. 30 μM)'],
    ['6', 'S-TM + Unknown Sample', 'Unknown sample incubated with S-TM alone (for total Arg determination)'],
    ['7', 'S-TM + Al3+', 'Blank fluorescence of S-TM + Al3+ (coordination baseline for chiral assay)'],
    ['8', 'S-TM + Al3+ + L-Arg Standard 1', 'L-Arg chiral standard curve point 1 (e.g. 10 μM)'],
    ['9', 'S-TM + Al3+ + L-Arg Standard 2', 'L-Arg chiral standard curve point 2 (e.g. 20 μM)'],
    ['10', 'S-TM + Al3+ + L-Arg Standard 3', 'L-Arg chiral standard curve point 3 (e.g. 30 μM)'],
    ['11', 'S-TM + Al3+ + D-Arg Standard 1', 'D-Arg chiral standard curve point 1 (e.g. 10 μM)'],
    ['12', 'S-TM + Al3+ + D-Arg Standard 2', 'D-Arg chiral standard curve point 2 (e.g. 20 μM)'],
    ['13', 'S-TM + Al3+ + D-Arg Standard 3', 'D-Arg chiral standard curve point 3 (e.g. 30 μM)'],
    ['14', 'S-TM + Al3+ + Unknown Sample', 'Unknown sample incubated with S-TM + Al3+ (for L/D chiral solving)'],
    [''],
    ['Important Notes:'],
    ['* Fill in raw fluorescence emission data starting from Row 2 on the "Fluorescence_Data" sheet.'],
    ['* Do not change or delete the 14 column headers.'],
    ['* Ensure all wavelength and intensity cells contain valid numbers without text units or empty cells.'],
  ];
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);

  // 2. Data Sheet with template headers and sample wavelength placeholders
  const headerRow = [...EXPECTED_COLUMN_NAMES];
  const templateRows: (number | string)[][] = [headerRow];

  for (let wl = 420; wl <= 620; wl += 5) {
    templateRows.push([
      wl,
      '', '', '', '', '', '', '', '', '', '', '', '', ''
    ]);
  }

  const wsData = XLSX.utils.aoa_to_sheet(templateRows);

  const colWidths = EXPECTED_COLUMN_NAMES.map((h) => ({
    wch: Math.max(h.length + 3, 14),
  }));
  wsData['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, wsData, 'Fluorescence_Data');
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  XLSX.writeFile(wb, 'S-TM_Fluorescence_Template.xlsx');
}

export interface ParseResult {
  success: boolean;
  data?: RawSpectrumRow[];
  errors?: string[];
  rowCount?: number;
  wavelengthRange?: { min: number; max: number };
}

/**
 * Parse and validate uploaded fluorescence Excel file
 */
export async function parseFluorescenceExcel(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        if (!buffer) {
          resolve({ success: false, errors: ['File reading failed: buffer is empty.'] });
          return;
        }

        const workbook = XLSX.read(buffer, { type: 'array' });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          resolve({ success: false, errors: ['No worksheets found in the uploaded workbook.'] });
          return;
        }

        let sheetName = workbook.SheetNames[0];
        const dataSheetCandidate = workbook.SheetNames.find((name) =>
          /data|fluorescence|spectra/i.test(name)
        );
        if (dataSheetCandidate) {
          sheetName = dataSheetCandidate;
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          resolve({ success: false, errors: [`Cannot read worksheet "${sheetName}".`] });
          return;
        }

        const rawRows = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
          header: 1,
          defval: '',
        });

        if (rawRows.length < 2) {
          resolve({
            success: false,
            errors: [
              `Worksheet "${sheetName}" does not contain sufficient data (found ${rawRows.length} rows, need header + data).`,
            ],
          });
          return;
        }

        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(5, rawRows.length); i++) {
          const row = rawRows[i];
          if (
            row &&
            row.some((cell) =>
              typeof cell === 'string' && /wavelength|nm|s-tm/i.test(cell)
            )
          ) {
            headerRowIndex = i;
            break;
          }
        }

        const headerRow = rawRows[headerRowIndex] || [];
        const errors: string[] = [];

        if (headerRow.length < 14) {
          errors.push(
            `Found only ${headerRow.length} columns in sheet "${sheetName}". Expected exactly 14 columns as defined in the template.`
          );
        }

        const parsedData: RawSpectrumRow[] = [];
        let minWl = Infinity;
        let maxWl = -Infinity;

        for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
          const row = rawRows[r];
          if (!row || row.length === 0) continue;

          const allBlank = row.every((c) => c === '' || c === null || c === undefined);
          if (allBlank) continue;

          const rowNum = r + 1;

          if (row.length < 14) {
            errors.push(`Row ${rowNum}: Has only ${row.length} values (need 14 values).`);
            if (errors.length > 8) break;
            continue;
          }

          const wlVal = Number(row[0]);
          if (isNaN(wlVal) || wlVal <= 0) {
            errors.push(
              `Row ${rowNum}, Col 1 ("${EXPECTED_COLUMN_NAMES[0]}"): Invalid wavelength value "${row[0]}". Must be a positive number.`
            );
            if (errors.length > 8) break;
            continue;
          }

          const numericVals: number[] = [];
          let hasRowError = false;

          for (let colIdx = 1; colIdx < 14; colIdx++) {
            const rawVal = row[colIdx];
            if (rawVal === '' || rawVal === null || rawVal === undefined) {
              errors.push(
                `Row ${rowNum}, Col ${colIdx + 1} ("${EXPECTED_COLUMN_NAMES[colIdx]}"): Empty cell detected.`
              );
              hasRowError = true;
              break;
            }

            const num = Number(rawVal);
            if (isNaN(num)) {
              errors.push(
                `Row ${rowNum}, Col ${colIdx + 1} ("${EXPECTED_COLUMN_NAMES[colIdx]}"): Non-numeric value "${rawVal}" found.`
              );
              hasRowError = true;
              break;
            }
            numericVals.push(num);
          }

          if (hasRowError) {
            if (errors.length > 8) break;
            continue;
          }

          minWl = Math.min(minWl, wlVal);
          maxWl = Math.max(maxWl, wlVal);

          parsedData.push({
            wavelength: wlVal,
            s_tm: numericVals[0],
            arg_std1: numericVals[1],
            arg_std2: numericVals[2],
            arg_std3: numericVals[3],
            s_tm_unknown: numericVals[4],
            s_tm_al: numericVals[5],
            l_arg_std1: numericVals[6],
            l_arg_std2: numericVals[7],
            l_arg_std3: numericVals[8],
            d_arg_std1: numericVals[9],
            d_arg_std2: numericVals[10],
            d_arg_std3: numericVals[11],
            chiral_unknown: numericVals[12],
          });
        }

        if (errors.length > 0) {
          resolve({
            success: false,
            errors,
          });
          return;
        }

        if (parsedData.length === 0) {
          resolve({
            success: false,
            errors: ['No valid spectral data rows were found in the uploaded file.'],
          });
          return;
        }

        parsedData.sort((a, b) => a.wavelength - b.wavelength);

        resolve({
          success: true,
          data: parsedData,
          rowCount: parsedData.length,
          wavelengthRange: { min: minWl, max: maxWl },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        resolve({
          success: false,
          errors: [`Error parsing Excel file: ${message}`],
        });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, errors: ['Failed to read the file from disk.'] });
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export full scientific analysis report to multi-sheet Excel
 */
export function exportAnalysisWorkbook(params: {
  rawSpectra: RawSpectrumRow[];
  totalArgResult: TotalArgAnalysisResult;
  chiralResult: ChiralAnalysisResult;
  lStandards: StandardsConcentration;
  dStandards: StandardsConcentration;
  mixtureValidation?: MixtureValidationItem[];
}): void {
  const {
    rawSpectra,
    totalArgResult,
    chiralResult,
    lStandards,
    dStandards,
    mixtureValidation,
  } = params;

  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary & Sample Results
  const summaryRows = [
    ['S-TM Arginine Fluorescence Assay - Final Analysis Report'],
    ['Generated Date', new Date().toLocaleString()],
    ['Analysis Wavelength (nm)', totalArgResult.extracted.actualWavelength],
    ['Target Wavelength (nm)', totalArgResult.extracted.wavelength],
    ['Response Formulation Mode', totalArgResult.responseMode],
    [''],
    ['=== 1. UNKNOWN SAMPLE RESULTS ==='],
    ['Metric', 'Value', 'Unit / Note'],
    [
      'Total Arginine Concentration',
      Number(totalArgResult.calculatedTotalArg.toFixed(3)),
      totalArgResult.standards.unit,
    ],
    ['L-Arginine Concentration (CL)', Number(chiralResult.cL.toFixed(3)), lStandards.unit],
    ['D-Arginine Concentration (CD)', Number(chiralResult.cD.toFixed(3)), dStandards.unit],
    ['L-Enantiomer Fraction (L%)', Number(chiralResult.lFraction.toFixed(2)), '%'],
    ['D-Enantiomer Fraction (D%)', Number(chiralResult.dFraction.toFixed(2)), '%'],
    ['L/D Concentration Ratio', Number(chiralResult.ldRatio.toFixed(3)), 'ratio'],
    ['Enantiomeric Excess (ee)', Number(chiralResult.ee.toFixed(2)), `% (${chiralResult.dominantEnantiomer})`],
    ['Dominant Enantiomer', chiralResult.dominantEnantiomer, ''],
    ['Model Physical Validity', chiralResult.isValidPhysical ? 'Valid' : 'Invalid / Warning', ''],
    ['Extrapolation Status', totalArgResult.isExtrapolated || chiralResult.isExtrapolated ? 'Extrapolated' : 'Within Range', ''],
    [''],
    ['=== 2. CALIBRATION PERFORMANCE ==='],
    ['Assay', 'Equation (y = kC + b)', 'Slope (k)', 'Intercept (b)', 'R²', 'QC Status'],
    [
      'Total Arg (S-TM)',
      totalArgResult.regression.equation,
      Number(totalArgResult.regression.slope.toFixed(5)),
      Number(totalArgResult.regression.intercept.toFixed(5)),
      (Number.isFinite(totalArgResult.regression.rSquared) ? Number(totalArgResult.regression.rSquared.toFixed(5)) : 'n/a (published)'),
      totalArgResult.regression.quality,
    ],
    [
      'L-Arg (S-TM + Al3+)',
      chiralResult.lRegression.equation,
      Number(chiralResult.lRegression.slope.toFixed(5)),
      Number(chiralResult.lRegression.intercept.toFixed(5)),
      (Number.isFinite(chiralResult.lRegression.rSquared) ? Number(chiralResult.lRegression.rSquared.toFixed(5)) : 'n/a (published)'),
      chiralResult.lRegression.quality,
    ],
    [
      'D-Arg (S-TM + Al3+)',
      chiralResult.dRegression.equation,
      Number(chiralResult.dRegression.slope.toFixed(5)),
      Number(chiralResult.dRegression.intercept.toFixed(5)),
      (Number.isFinite(chiralResult.dRegression.rSquared) ? Number(chiralResult.dRegression.rSquared.toFixed(5)) : 'n/a (published)'),
      chiralResult.dRegression.quality,
    ],
    [
      'Chiral Discrimination Factor',
      `${chiralResult.discriminationFactorType} = ${chiralResult.discriminationFactor.toFixed(3)}`,
      '', '', '', ''
    ],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Sample_Results');

  // Sheet 2: Extracted Intensities
  const ext = totalArgResult.extracted;
  const extractedRows = [
    ['Extracted Fluorescence Intensities at Selected Wavelength'],
    ['Selected Analysis Wavelength', ext.wavelength, 'nm'],
    ['Actual Spectrum Wavelength', ext.actualWavelength, 'nm'],
    [''],
    ['Channel Name', 'Sample Description', 'Raw Fluorescence (a.u.)', 'Calculated Response'],
    ['S-TM', 'Probe Blank', ext.s_tm, totalArgResult.responses.f0],
    ['S-TM + Arg Std 1', `Arg Std 1 (${totalArgResult.standards.std1} ${totalArgResult.standards.unit})`, ext.arg_std1, totalArgResult.responses.y1],
    ['S-TM + Arg Std 2', `Arg Std 2 (${totalArgResult.standards.std2} ${totalArgResult.standards.unit})`, ext.arg_std2, totalArgResult.responses.y2],
    ['S-TM + Arg Std 3', `Arg Std 3 (${totalArgResult.standards.std3} ${totalArgResult.standards.unit})`, ext.arg_std3, totalArgResult.responses.y3],
    ['S-TM + Unknown', 'Unknown Sample (S-TM)', ext.s_tm_unknown, totalArgResult.responses.yUnknown],
    ['S-TM + Al3+', 'Probe + Al3+ Blank', ext.s_tm_al, '-'],
    ['S-TM + Al3+ + L-Arg Std 1', `L-Arg Std 1 (${lStandards.std1} ${lStandards.unit})`, ext.l_arg_std1, chiralResult.lResponses[0]?.y],
    ['S-TM + Al3+ + L-Arg Std 2', `L-Arg Std 2 (${lStandards.std2} ${lStandards.unit})`, ext.l_arg_std2, chiralResult.lResponses[1]?.y],
    ['S-TM + Al3+ + L-Arg Std 3', `L-Arg Std 3 (${lStandards.std3} ${lStandards.unit})`, ext.l_arg_std3, chiralResult.lResponses[2]?.y],
    ['S-TM + Al3+ + D-Arg Std 1', `D-Arg Std 1 (${dStandards.std1} ${dStandards.unit})`, ext.d_arg_std1, chiralResult.dResponses[0]?.y],
    ['S-TM + Al3+ + D-Arg Std 2', `D-Arg Std 2 (${dStandards.std2} ${dStandards.unit})`, ext.d_arg_std2, chiralResult.dResponses[1]?.y],
    ['S-TM + Al3+ + D-Arg Std 3', `D-Arg Std 3 (${dStandards.std3} ${dStandards.unit})`, ext.d_arg_std3, chiralResult.dResponses[2]?.y],
    ['S-TM + Al3+ + Unknown', 'Unknown Sample (Chiral)', ext.chiral_unknown, chiralResult.yChiralUnknown],
  ];
  const wsExtracted = XLSX.utils.aoa_to_sheet(extractedRows);
  wsExtracted['!cols'] = [{ wch: 28 }, { wch: 28 }, { wch: 22 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, wsExtracted, 'Extracted_Intensities');

  // Sheet 3: Total Arg Calibration
  const totalCalRows = [
    ['Total Arginine Standard Curve Data'],
    ['Concentration Unit', totalArgResult.standards.unit],
    ['Equation', totalArgResult.regression.equation],
    ['Slope (k)', totalArgResult.regression.slope],
    ['Intercept (b)', totalArgResult.regression.intercept],
    ['R-Squared (R²)', totalArgResult.regression.rSquared],
    ['QC Rating', totalArgResult.regression.quality],
    [''],
    ['Standard', 'Concentration', 'Raw Intensity F', 'Response y'],
    ['Blank', 0, ext.s_tm, 0],
    ['Std 1', totalArgResult.standards.std1, ext.arg_std1, totalArgResult.responses.y1],
    ['Std 2', totalArgResult.standards.std2, ext.arg_std2, totalArgResult.responses.y2],
    ['Std 3', totalArgResult.standards.std3, ext.arg_std3, totalArgResult.responses.y3],
    ['Unknown Sample', Number(totalArgResult.calculatedTotalArg.toFixed(3)), ext.s_tm_unknown, totalArgResult.responses.yUnknown],
  ];
  const wsTotalCal = XLSX.utils.aoa_to_sheet(totalCalRows);
  wsTotalCal['!cols'] = [{ wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsTotalCal, 'Total_Arg_Calibration');

  // Sheet 4: Chiral Calibration
  const chiralCalRows = [
    ['Chiral Quantification Calibration Data (L-Arg vs D-Arg)'],
    ['L-Arg Equation', chiralResult.lRegression.equation],
    ['L-Arg Slope (kL)', chiralResult.lRegression.slope],
    ['L-Arg Intercept (bL)', chiralResult.lRegression.intercept],
    ['L-Arg R²', chiralResult.lRegression.rSquared],
    ['D-Arg Equation', chiralResult.dRegression.equation],
    ['D-Arg Slope (kD)', chiralResult.dRegression.slope],
    ['D-Arg Intercept (bD)', chiralResult.dRegression.intercept],
    ['D-Arg R²', chiralResult.dRegression.rSquared],
    ['Chiral Discrimination Factor (kL/kD)', chiralResult.discriminationFactor],
    [''],
    ['Series', 'Standard', 'Concentration', 'Raw Intensity F', 'Response y'],
    ['Al3+ Blank', 'Baseline', 0, ext.s_tm_al, 0],
    ['L-Arg', 'L-Std 1', lStandards.std1, ext.l_arg_std1, chiralResult.lResponses[0]?.y],
    ['L-Arg', 'L-Std 2', lStandards.std2, ext.l_arg_std2, chiralResult.lResponses[1]?.y],
    ['L-Arg', 'L-Std 3', lStandards.std3, ext.l_arg_std3, chiralResult.lResponses[2]?.y],
    ['D-Arg', 'D-Std 1', dStandards.std1, ext.d_arg_std1, chiralResult.dResponses[0]?.y],
    ['D-Arg', 'D-Std 2', dStandards.std2, ext.d_arg_std2, chiralResult.dResponses[1]?.y],
    ['D-Arg', 'D-Std 3', dStandards.std3, ext.d_arg_std3, chiralResult.dResponses[2]?.y],
    ['Unknown (Chiral)', 'Unknown', 'Total: ' + totalArgResult.calculatedTotalArg.toFixed(2), ext.chiral_unknown, chiralResult.yChiralUnknown],
  ];
  const wsChiralCal = XLSX.utils.aoa_to_sheet(chiralCalRows);
  wsChiralCal['!cols'] = [{ wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsChiralCal, 'Chiral_Calibration');

  // Sheet 5: Mixture Validation (if present)
  if (mixtureValidation && mixtureValidation.length > 0) {
    const valRows = [
      ['Mixture Validation Results (Accuracy & Recovery Testing)'],
      [''],
      ['Sample ID', 'Mixture Label', 'Known L%', 'Known D%', 'Total Conc', 'Predicted L Conc', 'Predicted D Conc', 'Predicted L%', 'Recovery %', 'Absolute Error %', 'Relative Error %'],
      ...mixtureValidation.map((item) => [
        item.id,
        item.label,
        item.knownLPercent,
        item.knownDPercent,
        item.totalConc,
        item.predictedLConc ?? '-',
        item.predictedDConc ?? '-',
        item.predictedLPercent !== undefined ? Number(item.predictedLPercent.toFixed(2)) : '-',
        item.recoveryPercent !== undefined ? Number(item.recoveryPercent.toFixed(2)) : '-',
        item.absErrorPercent !== undefined ? Number(item.absErrorPercent.toFixed(2)) : '-',
        item.relErrorPercent !== undefined ? Number(item.relErrorPercent.toFixed(2)) : '-',
      ]),
    ];
    const wsVal = XLSX.utils.aoa_to_sheet(valRows);
    XLSX.utils.book_append_sheet(wb, wsVal, 'Mixture_Validation');
  }

  // Sheet 6: Raw Spectra
  const rawDataAoa: (string | number)[][] = [
    [...EXPECTED_COLUMN_NAMES],
    ...rawSpectra.map((r) => [
      r.wavelength,
      r.s_tm,
      r.arg_std1,
      r.arg_std2,
      r.arg_std3,
      r.s_tm_unknown,
      r.s_tm_al,
      r.l_arg_std1,
      r.l_arg_std2,
      r.l_arg_std3,
      r.d_arg_std1,
      r.d_arg_std2,
      r.d_arg_std3,
      r.chiral_unknown,
    ]),
  ];
  const wsRaw = XLSX.utils.aoa_to_sheet(rawDataAoa);
  XLSX.utils.book_append_sheet(wb, wsRaw, 'Raw_Spectra_Data');

  const filename = `S-TM_Arg_Analysis_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}
