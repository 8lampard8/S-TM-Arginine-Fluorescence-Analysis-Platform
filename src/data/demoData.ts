import type { RawSpectrumRow } from '../types';

/**
 * Generate scientifically realistic fluorescence emission spectral band
 */
function spectralShape(wl: number, peakWl: number, width: number): number {
  const diff = (wl - peakWl) / width;
  const skew = wl > peakWl ? 1.25 : 0.9;
  return Math.exp(-0.5 * Math.pow(diff / skew, 2));
}

function pseudoNoise(wl: number, seed: number): number {
  const x = Math.sin(wl * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 0.8;
}

export function generateDemoSpectra(): RawSpectrumRow[] {
  const rows: RawSpectrumRow[] = [];
  const peakWl = 486;
  const bandWidth = 32;

  for (let wl = 410; wl <= 650; wl += 2) {
    const shape = spectralShape(wl, peakWl, bandWidth);
    const baselineNoise = 12 + pseudoNoise(wl, 1) * 0.5;

    // 1. S-TM blank
    const s_tm = baselineNoise + 142 * shape + pseudoNoise(wl, 2);

    // 2. S-TM + Arg standards (10, 20, 30 uM)
    const arg_std1 = baselineNoise + 218 * shape + pseudoNoise(wl, 3);
    const arg_std2 = baselineNoise + 294 * shape + pseudoNoise(wl, 4);
    const arg_std3 = baselineNoise + 370 * shape + pseudoNoise(wl, 5);

    // 3. S-TM + Unknown (e.g. 24.0 uM total Arg)
    const s_tm_unknown = baselineNoise + (142 + 24 * 7.6) * shape + pseudoNoise(wl, 6);

    // 4. S-TM + Al3+ blank (coordination baseline)
    const s_tm_al = baselineNoise + 210 * shape + pseudoNoise(wl, 7);

    // 5. S-TM + Al3+ + L-Arg standards (strong enhancement, ~14.4 a.u. per uM)
    const l_arg_std1 = baselineNoise + (210 + 10 * 14.4) * shape + pseudoNoise(wl, 8);
    const l_arg_std2 = baselineNoise + (210 + 20 * 14.4) * shape + pseudoNoise(wl, 9);
    const l_arg_std3 = baselineNoise + (210 + 30 * 14.4) * shape + pseudoNoise(wl, 10);

    // 6. S-TM + Al3+ + D-Arg standards (weaker enhancement, ~5.4 a.u. per uM, kL/kD ~ 2.67)
    const d_arg_std1 = baselineNoise + (210 + 10 * 5.4) * shape + pseudoNoise(wl, 11);
    const d_arg_std2 = baselineNoise + (210 + 20 * 5.4) * shape + pseudoNoise(wl, 12);
    const d_arg_std3 = baselineNoise + (210 + 30 * 5.4) * shape + pseudoNoise(wl, 13);

    // 7. S-TM + Al3+ + Unknown (18.0 uM L-Arg + 6.0 uM D-Arg = 24.0 uM total Arg, 75% L, 25% D, ee = 50% L)
    const unknownChiralEnhancement = 18.0 * 14.4 + 6.0 * 5.4;
    const chiral_unknown =
      baselineNoise + (210 + unknownChiralEnhancement) * shape + pseudoNoise(wl, 14);

    rows.push({
      wavelength: wl,
      s_tm: Number(s_tm.toFixed(2)),
      arg_std1: Number(arg_std1.toFixed(2)),
      arg_std2: Number(arg_std2.toFixed(2)),
      arg_std3: Number(arg_std3.toFixed(2)),
      s_tm_unknown: Number(s_tm_unknown.toFixed(2)),
      s_tm_al: Number(s_tm_al.toFixed(2)),
      l_arg_std1: Number(l_arg_std1.toFixed(2)),
      l_arg_std2: Number(l_arg_std2.toFixed(2)),
      l_arg_std3: Number(l_arg_std3.toFixed(2)),
      d_arg_std1: Number(d_arg_std1.toFixed(2)),
      d_arg_std2: Number(d_arg_std2.toFixed(2)),
      d_arg_std3: Number(d_arg_std3.toFixed(2)),
      chiral_unknown: Number(chiral_unknown.toFixed(2)),
    });
  }

  return rows;
}
