# S-TM Arginine Fluorescence Analysis Platform

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-Interactive-3F4F75.svg)](https://plotly.com/javascript/)

> **Quantitative Fluorescence Detection & Chiral Composition Analysis of L-/D-Arginine using S-TM Fluorescent Probe**

---

## 📖 Background & Scientific Principle

1. **Probe Mechanism**: The fluorescent probe **S-TM** exhibits a pronounced fluorescence turn-on response upon binding to arginine (Arg). In the absence of metal ions, S-TM responds similarly to both L-Arg and D-Arg, making it ideal for **Total Arginine Quantification**.
2. **Chiral Discrimination with $\text{Al}^{3+}$**: Upon introduction of $\text{Al}^{3+}$, the resulting coordinated ternary complex $[\text{S-TM}\cdot\text{Al}^{3+}\cdot\text{Arg}]$ creates an asymmetric binding microenvironment. This induces distinct fluorescence sensitivities ($k_L \neq k_D$, typically $k_L / k_D \approx 2.7\times$), enabling precise **Chiral Quantification of L- and D-Arginine**.
3. **Simultaneous Chiral Solver**:
   $$\begin{cases} y_{unknown} = b + k_L C_L + k_D C_D \\ C_L + C_D = C_{total} \end{cases}$$
   Solving this system determines individual concentrations ($C_L, C_D$), enantiomeric excess ($ee$), and enantiomeric ratios with rigorous physical validity checks.

---

## 🌟 Key Features

- **100% Client-Side Privacy**: All data processing, Excel parsing, and regression solving occur purely in the local browser. No experimental spectra are sent to external servers.
- **Official 14-Column Excel Template**: Built-in template generator (`.xlsx`) with automated data validation, non-numeric checks, and pinpoint error reporting.
- **Interactive Spectroscopy**: Publication-quality spectra visualization with Plotly.js, zoom, pan, hover tooltips, and 300 DPI PNG/SVG vector export.
- **Automatic Peak Finding**: One-click feature wavelength ($\lambda_{\max}$) detection with dynamic marker lines.
- **Dual Analytical Workflows**:
  - **Left Panel**: Total Arginine Standard Curve ($F$, $\Delta F$, $\Delta F/F_0$), $R^2$ quality control, and $C_{total}$ quantification.
  - **Right Panel**: L-Arg and D-Arg dual calibration curves, chiral discrimination factor ($k_L/k_D$), and simultaneous mass-balance chiral solver.
- **Chiral Results Dashboard**: Enantiomeric Excess ($ee$), dominant enantiomer tag, L/D ratio, donut composition chart, and concentration bar charts.
- **Scientific Rigor & Validation**:
  - **Mixture Validation Module**: Evaluate recovery rates and absolute/relative errors across pre-set (100:0, 75:25, 50:50, 25:75, 0:100) or custom ratios.
  - **Model Assumptions Documentation**: Clear presentation of linear dynamic range, optical superposition, and mass conservation constraints.
- **Comprehensive Excel Report Export**: One-click generation of a multi-tab scientific report (`Sample_Results`, `Extracted_Intensities`, `Total_Arg_Calibration`, `Chiral_Calibration`, `Mixture_Validation`, `Raw_Spectra_Data`).
- **Authentic Demo Data**: Pre-loaded simulated experimental dataset for immediate out-of-the-box demonstration.

---

## 📋 14-Column Data Format

The uploaded Excel sheet (`.xlsx` or `.xls`) must contain the following 14 columns:

| Col | Column Header | Description |
|:---:|:---|:---|
| 1 | `Wavelength (nm)` | Emission wavelength sequence |
| 2 | `S-TM` | Free probe blank |
| 3 | `S-TM + Arg Standard 1` | Total Arg standard 1 (e.g. 10 μM) |
| 4 | `S-TM + Arg Standard 2` | Total Arg standard 2 (e.g. 20 μM) |
| 5 | `S-TM + Arg Standard 3` | Total Arg standard 3 (e.g. 30 μM) |
| 6 | `S-TM + Unknown Sample` | Unknown sample in S-TM system |
| 7 | `S-TM + Al3+` | Probe + $\text{Al}^{3+}$ chiral baseline |
| 8 | `S-TM + Al3+ + L-Arg Standard 1` | L-Arg standard 1 (e.g. 10 μM) |
| 9 | `S-TM + Al3+ + L-Arg Standard 2` | L-Arg standard 2 (e.g. 20 μM) |
| 10 | `S-TM + Al3+ + L-Arg Standard 3` | L-Arg standard 3 (e.g. 30 μM) |
| 11 | `S-TM + Al3+ + D-Arg Standard 1` | D-Arg standard 1 (e.g. 10 μM) |
| 12 | `S-TM + Al3+ + D-Arg Standard 2` | D-Arg standard 2 (e.g. 20 μM) |
| 13 | `S-TM + Al3+ + D-Arg Standard 3` | D-Arg standard 3 (e.g. 30 μM) |
| 14 | `S-TM + Al3+ + Unknown Sample` | Unknown sample in S-TM + $\text{Al}^{3+}$ system |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-github-repo-url>
cd arg-sensor

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License. Open for academic research and scientific publication.
