export type Language = 'zh' | 'en';

export const translations = {
  en: {
    // Header
    platformTitle: 'S-TM Arginine Fluorescence Analysis Platform',
    platformSubtitle:
      'Quantitative Fluorescence Detection & Chiral Composition Analysis of L-/D-Arginine',
    demoBadge: '⚡ Demo Dataset',
    userBadge: '✓ Real User Data',
    downloadTemplate: 'Download Excel Template',
    loadDemo: 'Load Demo Data',
    workflowDemoBtn: '▶ Workflow Demo',
    reset: 'Reset',
    step1: 'Download Template',
    step1Desc: '14-Column XLSX',
    step2: 'Upload Spectra',
    step2Desc: 'Import & Inspect',
    step3: 'Select λmax',
    step3Desc: 'Feature Wavelength',
    step4: 'Total Arg Assay',
    step4Desc: 'S-TM System',
    step5: 'Chiral Analysis',
    step5Desc: 'S-TM + Al³⁺ System',
    step6: 'Export Report',
    step6Desc: 'Multi-Sheet Excel',

    // Upload
    uploadTitle: 'Fluorescence Data Import & Validation',
    uploadSubtitle:
      'Upload raw fluorescence emission spectra (.xlsx / .xls). Exactly 14 columns required.',
    pointsInfo: 'spectral points',
    previewHide: 'Hide Preview',
    previewShow: 'Data Preview',
    dragActive: 'Drop your Excel file here...',
    replacePrompt: 'Click or drag & drop to replace current fluorescence dataset',
    uploadPrompt: 'Drop your raw fluorescence data file here, or',
    browseFiles: 'browse files',
    parsingMessage: 'Parsing and strictly validating Excel columns...',
    uploadHint:
      'Supports Microsoft Excel (.xlsx, .xls). Browser-only client-side parsing ensures total data privacy.',
    validationErrorTitle: 'Data Validation Error',
    issuesFound: 'issues found',
    validationRuleNotice:
      'Please make sure the file strictly adheres to the 14-column layout in the official template.',
    previewTitle: 'First 5 Spectral Rows Preview (Total 14 Columns)',
    previewScrollHint: 'Scroll horizontally to view all series',

    // Empty state
    noDataTitle: 'No Fluorescence Spectra Loaded',
    noDataDesc:
      'Please upload your 14-column fluorescence dataset (.xlsx / .xls) or load the built-in demo dataset to begin analysis.',
    loadDemoBtn: 'Load Simulated Demo Data',

    // Spectra Viewer
    spectraViewerTitle: 'Interactive Spectral Viewer & Wavelength Selection',
    spectraViewerDesc:
      'Hover to inspect points, zoom into peaks, or extract intensities at the target feature wavelength.',
    filterAll: 'All Spectra',
    filterTotal: 'Total Arg Series',
    filterChiral: 'Chiral Series (Al³⁺)',
    filterUnknowns: 'Unknowns Only',
    analysisWavelength: 'Analysis Wavelength:',
    apply: 'Apply',
    autoDetectBtn: 'Auto Detect Peak (λmax)',
    selectedWl: 'Selected wavelength:',
    nearestPoint: 'Nearest data point to',
    chartTitleSpectra: 'Raw Fluorescence Emission Spectra',
    axisWavelength: 'Wavelength / nm',
    axisIntensity: 'Fluorescence Intensity / a.u.',
    spectraTip:
      'Tip: Click on any legend item to toggle visibility. Double-click to isolate a single trace.',

    // Left Panel: Total Arg
    totalArgTitle: 'Total Arginine Quantification',
    totalArgSubtitle: 'S-TM Probe System (No metal ion needed)',
    stepBadge4: 'Step 4',
    standardsTitle: '1. Arg Standard Concentrations:',
    unitLabel: 'Unit:',
    argStd1: 'Arg Standard 1',
    argStd2: 'Arg Standard 2',
    argStd3: 'Arg Standard 3',
    responseFormulationTitle: '2. Fluorescence Response Formulation:',
    modeRelative: 'Relative (Recommended)',
    modeDelta: 'Change',
    modeRaw: 'Raw Intensity',
    extractedHeader: 'Intensities & Responses at λ =',
    baselineProbe: 'F₀ =',
    chartTitleTotalCal: 'Total Arginine Calibration Curve (S-TM)',
    axisArgConc: 'Arginine Concentration /',
    qcGood: 'Good',
    qcAcceptable: 'Acceptable',
    qcWarning: 'Warning',
    fittedEquation: 'Fitted Equation',
    slopeIntercept: 'Slope (k) / Intercept (b)',
    rSquaredCoeff: 'R² Coefficient',
    totalArgBannerLabel: 'Total Arginine Concentration (C_total)',
    extrapolationWarning:
      'Warning: The sample response is outside the calibration range.',

    // Right Panel: Chiral Arg
    chiralArgTitle: 'Chiral Quantification of L-/D-Arginine',
    chiralArgSubtitle:
      'S-TM + Al³⁺ Coordinated System (Enantioselective Response)',
    stepBadge5: 'Step 5',
    chiralBaseline: 'Chiral Assay Baseline (S-TM + Al³⁺):',
    lArgStandards: 'L-Arg Standards',
    dArgStandards: 'D-Arg Standards',
    lStd1: 'L-Std 1',
    lStd2: 'L-Std 2',
    lStd3: 'L-Std 3',
    dStd1: 'D-Std 1',
    dStd2: 'D-Std 2',
    dStd3: 'D-Std 3',
    chartTitleChiralCal:
      'Dual Chiral Calibration Curves (L-Arg vs D-Arg in S-TM/Al³⁺)',
    axisEnantiomerConc: 'Enantiomer Concentration /',
    lCalCard: 'L-Arg Calibration',
    dCalCard: 'D-Arg Calibration',
    chiralDiscriminationTitle: 'Chiral Discrimination',
    ratioLabel: 'ratio',
    coupledInterceptLabel: 'Coupled Model Intercept (b):',
    interceptAvg: '(bL+bD)/2 (Default)',
    interceptZero: 'b = 0',
    interceptWeighted: 'Weighted',

    // Chiral Dashboard
    dashboardTitle: 'Chiral Quantification & Enantiomeric Excess Dashboard',
    dashboardSubtitle:
      'Simultaneous solution of L-Arg and D-Arg concentrations based on optical superposition and total mass balance.',
    validPhysicalBadge: 'Valid Physical Solution',
    nonPhysicalBadge: 'Non-Physical Model Warning',
    discrepancyAlertTitle: 'Model Assumption Discrepancy Alert',
    lArgConcTitle: 'L-Arginine Concentration',
    dArgConcTitle: 'D-Arginine Concentration',
    totalArgCheckTitle: 'Total Arginine (C_L + C_D)',
    eeTitle: 'Enantiomeric Excess (ee)',
    fractionLabel: 'Fraction:',
    ldRatioLabel: 'L/D Ratio (C_L / C_D):',
    dominantLabel: 'Dominant:',
    racemic: 'Racemic (1:1)',
    donutTitle: 'Enantiomer Composition (%)',
    barTitle: 'Concentration Comparison',

    // Mixture Validation
    validationTitle: 'Mixture Validation Module (Scientific Paper Rigor)',
    validationBadge: 'Optional Verification',
    validationDesc:
      'Validate chiral model accuracy across predetermined enantiomeric ratios (100:0, 75:25, 50:50, 25:75, 0:100).',
    loadRatiosBtn: 'Load Standard Ratios',
    addCustomRatioBtn: 'Add Custom Ratio',
    thMixture: 'Mixture Sample',
    thKnownPct: 'Known L% / D%',
    thTotalConc: 'Total Conc',
    thPredictedLPct: 'Predicted L%',
    thRecovery: 'Recovery (%)',
    thAbsError: 'Absolute Error (%)',
    thRelError: 'Relative Error (%)',
    thAction: 'Action',
    noValidationMsg:
      'No validation entries currently loaded. Click "Load Standard Ratios" above to test standard mixtures.',
    validationGuideTitle: 'Scientific Rigor Guide:',
    validationGuideDesc:
      'For manuscript preparation, measuring recovery across diverse L/D ratios (e.g., 90:10 to 10:90) demonstrates the robustness of the probe against potential synergistic or competitive cooperative binding effects.',

    // Model Assumptions
    assumptionsTitle: 'Methodological Principles & Model Assumptions',
    assumptionsSubtitle:
      'Theoretical framework, scientific rigor, and boundary conditions for S-TM arginine assay',
    asmp1Title: 'Chiral Differentiation via Al³⁺ Coordination',
    asmp1Desc:
      'S-TM alone responds sensitively to total arginine regardless of chirality. In the presence of stoichiometric Al³⁺, the ternary complex [S-TM · Al³⁺ · Arg] creates an asymmetric coordination cavity, leading to distinct fluorescence enhancements (kL ≠ kD).',
    asmp2Title: 'Linear Dynamic Range Fidelity',
    asmp2Desc:
      'The probe concentration and fluorometer sensitivity are calibrated such that within the chosen standard range (e.g. 0 – 30 μM), both the total arginine and chiral enantiomers exhibit high linear correlation (R² ≥ 0.95).',
    asmp3Title: 'Linear Optical Superposition Principle',
    asmp3Desc:
      'For any enantiomeric mixture, the total fluorescence response in S-TM/Al³⁺ follows linear superposition: y_unknown = b + kL × CL + kD × CD, neglecting non-linear cross-association or cooperative competitive interactions at micromolar regimes.',
    asmp4Title: 'Mass Conservation Coupling Constraint',
    asmp4Desc:
      'The total concentration obtained from the metal-free S-TM standard curve serves as an invariant mass constraint: C_total = CL + CD, enabling exact algebraic determination of both enantiomeric concentrations.',

    // Export
    exportTitle: 'Export Comprehensive Scientific Results',
    exportSubtitle:
      'Download publication-ready multi-tab Excel workbooks and high-resolution chart images.',
    exportExcelBtn: 'Export Analysis Excel (.xlsx)',
    exportCard1Title: 'Multi-Sheet Scientific Workbook',
    exportCard1Desc:
      'Includes Raw Spectra, Extracted Intensities, Total Arg Calibration, Chiral Calibrations, and Full Sample Quantification.',
    exportCard2Title: 'Publication Figures (PNG / SVG)',
    exportCard2Desc:
      'Hover over any chart toolbar to download 300 DPI publication-quality PNG or vector SVG directly.',
    exportCard3Title: 'Complete Traceability',
    exportCard3Desc:
      'All calculation parameters, fitted equations, R² coefficients, and analysis wavelength metadata are saved.',

    // Footer
    footerPlatform:
      'S-TM Arginine Fluorescence Assay & Chiral Analysis Platform • Scientific Data Processing System',
    footerSecurity:
      'Client-Side Browser Execution • 100% Data Confidentiality',
  },

  zh: {
    // Header
    platformTitle: 'S-TM 荧光探针精氨酸检测与手性组成分析平台',
    platformSubtitle:
      '基于 S-TM 荧光探针的精氨酸定量检测及 L-/D-精氨酸手性组成分析系统',
    demoBadge: '⚡ 演示数据集已载入',
    userBadge: '✓ 真实实验数据',
    downloadTemplate: '下载 Excel 模板',
    loadDemo: '载入演示数据',
    workflowDemoBtn: '▶ 流程动图演示',
    reset: '清空重置',
    step1: '下载数据模板',
    step1Desc: '标准 14 列 XLSX',
    step2: '上传光谱数据',
    step2Desc: '解析与校验',
    step3: '选择特征波长',
    step3Desc: '自动寻峰 λmax',
    step4: '总精氨酸定量',
    step4Desc: 'S-TM 探针体系',
    step5: '手性定量分析',
    step5Desc: 'S-TM + Al³⁺ 体系',
    step6: '导出分析报告',
    step6Desc: '多工作表 Excel',

    // Upload
    uploadTitle: '荧光光谱数据导入与格式校验',
    uploadSubtitle:
      '导入原始荧光发射光谱（.xlsx / .xls）。需严格包含标准 14 列数据。',
    pointsInfo: '个光谱数据点',
    previewHide: '收起预览',
    previewShow: '数据预览',
    dragActive: '释放鼠标上传 Excel 文件...',
    replacePrompt: '点击或拖拽上传以 替换 当前光谱数据集',
    uploadPrompt: '拖拽原始荧光数据文件至此处，或',
    browseFiles: '浏览本地文件',
    parsingMessage: '正在解析并严格校验 Excel 列与数据格式...',
    uploadHint:
      '支持 Microsoft Excel (.xlsx, .xls)。数据纯本地浏览器解析，杜绝上传服务器，严格保障科研数据隐私。',
    validationErrorTitle: '数据格式校验未通过',
    issuesFound: '处异常已定位',
    validationRuleNotice:
      '请确保数据文件严格遵循标准模板中的 14 列结构与数值格式。',
    previewTitle: '前 5 行光谱数据预览（共 14 列）',
    previewScrollHint: '可横向滚动查看所有列数据',

    // Empty state
    noDataTitle: '当前未载入任何荧光光谱数据',
    noDataDesc:
      '请上传包含 14 列荧光光谱的 Excel 文件（.xlsx / .xls），或点击下方按钮载入真实科研模拟演示数据。',
    loadDemoBtn: '载入科研模拟演示数据',

    // Spectra Viewer
    spectraViewerTitle: '交互式荧光光谱图谱与特征波长选择',
    spectraViewerDesc:
      '支持悬停精准读数、峰位局部缩放，以及提取特征分析波长处的荧光发射强度。',
    filterAll: '全部光谱',
    filterTotal: '总精氨酸系列',
    filterChiral: '手性体系系列 (Al³⁺)',
    filterUnknowns: '仅未知样品',
    analysisWavelength: '分析波长 (Analysis Wavelength):',
    apply: '应用',
    autoDetectBtn: '自动寻峰 (λmax)',
    selectedWl: '当前分析波长:',
    nearestPoint: '最近匹配数据点:',
    chartTitleSpectra: '原始荧光发射光谱 (Emission Spectra)',
    axisWavelength: '发射波长 (Wavelength) / nm',
    axisIntensity: '荧光强度 (Intensity) / a.u.',
    spectraTip:
      '提示：点击图例项可隐藏/显示对应光谱；双击图例项可单独隔离显示该光谱；右上角工具栏可一键下载矢量图。',

    // Left Panel: Total Arg
    totalArgTitle: '总精氨酸定量分析 (Total Arginine)',
    totalArgSubtitle: 'S-TM 探针体系（无需外加金属离子，灵敏响应总精氨酸）',
    stepBadge4: '流程 4',
    standardsTitle: '1. 精氨酸标准浓度设置:',
    unitLabel: '浓度单位:',
    argStd1: '总 Arg 标样 1',
    argStd2: '总 Arg 标样 2',
    argStd3: '总 Arg 标样 3',
    responseFormulationTitle: '2. 荧光响应计算方式 (Response Mode):',
    modeRelative: '相对荧光响应 (推荐)',
    modeDelta: '荧光差值',
    modeRaw: '原始荧光强度',
    extractedHeader: '特征波长 λ =',
    baselineProbe: '探针空白 F₀ =',
    chartTitleTotalCal: '总精氨酸标准曲线 (S-TM 校准曲线)',
    axisArgConc: '精氨酸浓度 /',
    qcGood: '优良 (Good)',
    qcAcceptable: '可用 (Acceptable)',
    qcWarning: '预警 (Warning)',
    fittedEquation: '拟合方程',
    slopeIntercept: '斜率 (k) / 截距 (b)',
    rSquaredCoeff: '拟合优度 R²',
    totalArgBannerLabel: '未知样品总精氨酸浓度 (Total Arg)',
    extrapolationWarning:
      '警告：未知样品的荧光响应超出了当前标准曲线的标定浓度范围（外推计算）。',

    // Right Panel: Chiral Arg
    chiralArgTitle: 'L/D-精氨酸手性定量分析 (Chiral Analysis)',
    chiralArgSubtitle:
      'S-TM + Al³⁺ 配位体系（诱导不对称微环境，产生手性异构体差异响应）',
    stepBadge5: '流程 5',
    chiralBaseline: '手性体系基线空白 (S-TM + Al³⁺):',
    lArgStandards: 'L-Arg 标样浓度',
    dArgStandards: 'D-Arg 标样浓度',
    lStd1: 'L-标样 1',
    lStd2: 'L-标样 2',
    lStd3: 'L-标样 3',
    dStd1: 'D-标样 1',
    dStd2: 'D-标样 2',
    dStd3: 'D-标样 3',
    chartTitleChiralCal:
      'L/D-精氨酸双校准曲线同图对比 (S-TM/Al³⁺体系)',
    axisEnantiomerConc: '对映体浓度 /',
    lCalCard: 'L-Arg 标线方程',
    dCalCard: 'D-Arg 标线方程',
    chiralDiscriminationTitle: '手性识别因子',
    ratioLabel: '倍斜率比',
    coupledInterceptLabel: '联立方程截距处理 (Intercept b):',
    interceptAvg: '平均截距 (bL+bD)/2 (默认)',
    interceptZero: '过原点 (b = 0)',
    interceptWeighted: '组分加权截距',

    // Chiral Dashboard
    dashboardTitle: '手性定量结果与对映体过量值 (ee) 看板',
    dashboardSubtitle:
      '基于光学线性叠加与质量守恒约束联立求解 L-Arg 与 D-Arg 的实际摩尔浓度。',
    validPhysicalBadge: '符合物理意义解',
    nonPhysicalBadge: '模型物理意义预警',
    discrepancyAlertTitle: '光学模型物理边界偏差警示',
    lArgConcTitle: 'L-精氨酸浓度 (C_L)',
    dArgConcTitle: 'D-精氨酸浓度 (C_D)',
    totalArgCheckTitle: '总精氨酸平衡 (C_L + C_D)',
    eeTitle: '对映体过量值 (Enantiomeric Excess, ee)',
    fractionLabel: '摩尔占比:',
    ldRatioLabel: 'L/D 浓度比 (C_L / C_D):',
    dominantLabel: '主导构型:',
    racemic: '外消旋体 (1:1 Racemic)',
    donutTitle: '对映体摩尔组成分布 (%)',
    barTitle: '对映体浓度对比柱状图',

    // Mixture Validation
    validationTitle: '混合标准验证模块 (Mixture Validation)',
    validationBadge: '科研论文方法学验证',
    validationDesc:
      '通过预设不同手性摩尔比例（100:0、75:25、50:50、25:75、0:100）验证手性定量模型的回收率与准确性。',
    loadRatiosBtn: '载入标准混合比',
    addCustomRatioBtn: '添加自定义比例',
    thMixture: '混合验证样品',
    thKnownPct: '理论已知 L% / D%',
    thTotalConc: '总浓度',
    thPredictedLPct: '预测 L%',
    thRecovery: '回收率 (Recovery %)',
    thAbsError: '绝对误差 (%)',
    thRelError: '相对误差 (%)',
    thAction: '操作',
    noValidationMsg:
      '当前未载入验证条目。点击上方“载入标准混合比”即可一键生成验证测试矩阵。',
    validationGuideTitle: '论文方法严谨性说明:',
    validationGuideDesc:
      '在论文发表中，覆盖多种 L/D 比例测试回收率可充分排除微摩尔浓度下对映体之间的协同竞争配位或非线性干扰，证实探针手性检测的稳健性。',

    // Model Assumptions
    assumptionsTitle: '方法学原理与核心模型假设 (Model Assumptions)',
    assumptionsSubtitle:
      'S-TM 荧光传感与手性定量分析背后的物理化学机理与数学边界条件',
    asmp1Title: '1. Al³⁺ 协同诱导手性微环境',
    asmp1Desc:
      'S-TM 自身对精氨酸手性无明显区分度；加入适量 Al³⁺ 后形成三元配合物 [S-TM · Al³⁺ · Arg]，构建了非对称配位微环境，导致对映体荧光响应产生显著差异 (kL ≠ kD)。',
    asmp2Title: '2. 动态线性响应区间假定',
    asmp2Desc:
      '探针浓度与检测条件设置合理，在待测标准浓度区间内（如 0 ～ 30 μM），总精氨酸以及两对映异构体的荧光响应均具有良好的线性拟合度 (R² ≥ 0.95)。',
    asmp3Title: '3. 光学线性叠加原理 (Optical Superposition)',
    asmp3Desc:
      '对于任意对映体混合物，在 S-TM/Al³⁺ 体系中的总响应可近似表达为各组分贡献的线性叠加：y_unknown = b + kL × CL + kD × CD，在微摩尔级浓度下无显著交叉干扰。',
    asmp4Title: '4. 质量守恒耦合约束 (Mass Conservation)',
    asmp4Desc:
      '左侧在无金属 S-TM 条件下测得的总精氨酸浓度作为绝对质量守恒约束条件：C_total = CL + CD，与手性响应方程联立，从而实现两未知数的唯一代数求解。',

    // Export
    exportTitle: '科研结果一键综合导出 (Export Results)',
    exportSubtitle:
      '支持导出包含全部原始数据、标线参数及分析结果的多工作表 Excel 文件，以及 300 DPI 论文级图表。',
    exportExcelBtn: '导出分析报告 Excel (.xlsx)',
    exportCard1Title: '多工作表专业数据报告',
    exportCard1Desc:
      '内含原始光谱、提取强度、总精氨酸标线、手性标线、样品最终定量及混合验证等 6 个完整工作表。',
    exportCard2Title: '论文发表级矢量图导出',
    exportCard2Desc:
      '鼠标悬停于任一图表右上角工具栏，点击相机图标即可无损导出 300 DPI 的 PNG 或矢量 SVG 图。',
    exportCard3Title: '完整科研溯源链',
    exportCard3Desc:
      '完整记录分析特征波长、响应模式、斜率截距、R² 以及数据质控状态，确保实验结果可重复、可追溯。',

    // Footer
    footerPlatform:
      'S-TM 荧光探针精氨酸检测与手性组成分析平台 • 科学数据分析系统',
    footerSecurity:
      '浏览器本地执行 • 零服务端交互 • 严格保障科研原始数据私密性',
  },
};
