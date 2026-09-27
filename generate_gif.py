import math
import os
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions (2x supersampled for ultra-sharp anti-aliased rendering)
W, H = 1760, 1040
OUT_W, OUT_H = 880, 520

# Color palette
C_BG = "#0B0F19"
C_PANEL = "#111827"
C_PANEL_HEADER = "#1E293B"
C_PANEL_BORDER = "#1F2937"
C_TOP_BG = "#0F172A"
C_CARD_BG = "#1A2234"
C_CARD_BORDER = "#2A364F"

C_CYAN = "#06B6D4"
C_CYAN_LIGHT = "#22D3EE"
C_CYAN_BG = "#083344"
C_BLUE = "#3B82F6"
C_BLUE_LIGHT = "#60A5FA"
C_PURPLE = "#A855F7"
C_PURPLE_LIGHT = "#C084FC"
C_PURPLE_BG = "#3B0764"
C_GREEN = "#10B981"
C_GREEN_LIGHT = "#34D399"
C_GREEN_BG = "#064E3B"
C_AMBER = "#F59E0B"
C_AMBER_LIGHT = "#FCD34D"
C_RED = "#EF4444"

C_TEXT_WHITE = "#F8FAFC"
C_TEXT_LIGHT = "#E2E8F0"
C_TEXT_GRAY = "#94A3B8"
C_TEXT_MUTED = "#64748B"

# Fonts - All using fonts with confirmed glyph coverage
font_title = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 30)
font_subtitle = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 19)
font_step_num = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 20)
font_step_txt = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 19)
font_step_sub = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 15)

font_panel_h = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 25)
font_h2 = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 22)
font_body = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 20)
font_body_b = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 20)
font_small = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 17)
font_small_b = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 17)
font_tiny = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 15)

# Large value font that supports both numbers and characters
font_val_large = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 36)
font_stat_val = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 38)
font_mono = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 19)
font_mono_b = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 21)

STEPS = [
    ("1", "模板下载", "Download"),
    ("2", "数据导入", "Validation"),
    ("3", "峰位识别", "Peak Detect"),
    ("4", "总精拟合", "Total Arg"),
    ("5", "手性拆分", "Chiral Dual"),
    ("6", "报表导出", "Dashboard"),
]

def draw_vector_check(draw, cx, cy, r=16, bg_color=C_GREEN, fg_color="#FFFFFF"):
    """Draws a vector circle with a crisp checkmark."""
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg_color)
    draw.line([cx - r * 0.45, cy, cx - r * 0.1, cy + r * 0.4], fill=fg_color, width=3)
    draw.line([cx - r * 0.1, cy + r * 0.4, cx + r * 0.5, cy - r * 0.4], fill=fg_color, width=3)

def create_base_canvas(active_step_idx):
    """Draws top header and step navigation bar."""
    img = Image.new("RGB", (W, H), C_BG)
    draw = ImageDraw.Draw(img)

    # Top header bar
    draw.rectangle([0, 0, W, 104], fill=C_TOP_BG)
    draw.line([0, 104, W, 104], fill=C_PANEL_BORDER, width=2)

    # App title & subtitle
    draw.ellipse([42, 34, 68, 60], fill=C_CYAN)
    draw.ellipse([48, 40, 62, 54], fill="#ECFEFF")
    draw.text((80, 24), "S-TM 荧光精氨酸手性分析平台", fill=C_TEXT_WHITE, font=font_title)
    draw.text((82, 65), "S-TM Arginine Fluorescence & Chiral Analysis Platform", fill=C_TEXT_GRAY, font=font_subtitle)

    # Right badge
    badge_x1, badge_y1, badge_x2, badge_y2 = W - 330, 28, W - 42, 76
    draw.rounded_rectangle([badge_x1, badge_y1, badge_x2, badge_y2], radius=24, fill=C_GREEN_BG, outline=C_GREEN, width=2)
    draw.ellipse([badge_x1 + 18, 44, badge_x1 + 34, 60], fill=C_GREEN_LIGHT)
    draw.text((badge_x1 + 46, 39), "实操演示 / Workflow Demo", fill="#D1FAE5", font=font_body_b)

    # Step navigation bar
    bar_y1, bar_y2 = 114, 196
    step_w = 264
    gap = 20
    start_x = 42

    for i, (num, title_zh, title_en) in enumerate(STEPS):
        sx1 = start_x + i * (step_w + gap)
        sx2 = sx1 + step_w
        is_active = (i == active_step_idx)
        is_done = (i < active_step_idx)

        if is_active:
            draw.rounded_rectangle([sx1, bar_y1, sx2, bar_y2], radius=14, fill="#0369A1", outline=C_CYAN_LIGHT, width=3)
            num_bg = C_CYAN_LIGHT
            num_fg = "#082F49"
            txt_fg = C_TEXT_WHITE
            sub_fg = "#BAE6FD"
        elif is_done:
            draw.rounded_rectangle([sx1, bar_y1, sx2, bar_y2], radius=14, fill="#1E293B", outline="#059669", width=2)
            num_bg = C_GREEN
            num_fg = "#022C22"
            txt_fg = C_TEXT_LIGHT
            sub_fg = C_TEXT_GRAY
        else:
            draw.rounded_rectangle([sx1, bar_y1, sx2, bar_y2], radius=14, fill=C_PANEL, outline=C_PANEL_BORDER, width=2)
            num_bg = "#1F2937"
            num_fg = C_TEXT_MUTED
            txt_fg = C_TEXT_MUTED
            sub_fg = "#475569"

        cx, cy = sx1 + 34, (bar_y1 + bar_y2) // 2
        if is_done:
            draw_vector_check(draw, cx, cy, r=20, bg_color=C_GREEN, fg_color="#022C22")
        else:
            draw.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=num_bg)
            draw.text((cx - 7, cy - 13), num, fill=num_fg, font=font_step_num)

        draw.text((sx1 + 66, bar_y1 + 13), title_zh, fill=txt_fg, font=font_step_txt)
        draw.text((sx1 + 66, bar_y1 + 44), title_en, fill=sub_fg, font=font_step_sub)

    return img, draw

def draw_panels(draw, title_left, title_right):
    """Draws left and right main stage panels."""
    lx1, ly1, lx2, ly2 = 42, 214, 940, 1004
    rx1, ry1, rx2, ry2 = 970, 214, 1718, 1004

    # Left panel
    draw.rounded_rectangle([lx1, ly1, lx2, ly2], radius=18, fill=C_PANEL, outline=C_PANEL_BORDER, width=2)
    draw.rectangle([lx1, ly1, lx2, ly1 + 66], fill=C_PANEL_HEADER)
    draw.line([lx1, ly1 + 66, lx2, ly1 + 66], fill=C_PANEL_BORDER, width=2)
    draw.text((lx1 + 26, ly1 + 18), title_left, fill=C_TEXT_WHITE, font=font_panel_h)

    # Right panel
    draw.rounded_rectangle([rx1, ry1, rx2, ry2], radius=18, fill=C_PANEL, outline=C_PANEL_BORDER, width=2)
    draw.rectangle([rx1, ly1, rx2, ry1 + 66], fill=C_PANEL_HEADER)
    draw.line([rx1, ry1 + 66, rx2, ry1 + 66], fill=C_PANEL_BORDER, width=2)
    draw.text((rx1 + 26, ry1 + 18), title_right, fill=C_TEXT_WHITE, font=font_panel_h)

    return (lx1, ly1 + 66, lx2, ly2), (rx1, ry1 + 66, rx2, ry2)

# ==========================================
# STEP 1: 模板下载 / Download Template
# ==========================================
def render_step_1(subframe):
    img, draw = create_base_canvas(0)
    (lx1, ly1, lx2, ly2), (rx1, ry1, rx2, ry2) = draw_panels(
        draw, 
        "步骤 1: 标准化荧光数据模板 (14 通道矩阵)", 
        "操作规范与数据约束要求"
    )

    # LEFT PANEL: Excel Card & 14-Col Table
    draw.rounded_rectangle([lx1 + 28, ly1 + 24, lx2 - 28, ly1 + 130], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
    # Excel green icon
    draw.rounded_rectangle([lx1 + 50, ly1 + 44, lx1 + 114, ly1 + 110], radius=10, fill="#15803D")
    draw.text((lx1 + 58, ly1 + 60), "XLSX", fill=C_TEXT_WHITE, font=font_body_b)
    # File details
    draw.text((lx1 + 134, ly1 + 46), "S-TM_Fluorescence_Template.xlsx", fill=C_TEXT_WHITE, font=font_h2)
    draw.text((lx1 + 134, ly1 + 84), "大小: 28.4 KB | 格式: 14 通道荧光光谱矩阵 (含模拟测试数据)", fill=C_TEXT_GRAY, font=font_small)

    # 14 Channels list box
    draw.rounded_rectangle([lx1 + 28, ly1 + 152, lx2 - 28, ly2 - 28], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
    draw.text((lx1 + 48, ly1 + 172), "模板包含的 14 个激发/发射光谱通道定义：", fill=C_CYAN_LIGHT, font=font_body_b)

    channels = [
        ("01. Wavelength (nm)", "410.0 ~ 650.0 nm (步长 2.0 nm, 严格 121 个采样点)", C_TEXT_LIGHT),
        ("02. S-TM Blank", "探针基线对照 (无金属离子 / 无精氨酸体系)", C_TEXT_GRAY),
        ("03-07. S-TM + Arg (5-40 μM)", "总精氨酸校准梯度 (5, 10, 20, 30, 40 μM)", C_CYAN),
        ("08. S-TM/Al3+ Blank", "手性体系基线对照 (加入 1.0 eq Al3+ 探针背景)", C_TEXT_GRAY),
        ("09-11. S-TM/Al3+ + L-Arg", "L-精氨酸手性梯度 (5, 10, 20, 30, 40 μM)", C_BLUE_LIGHT),
        ("12-14. S-TM/Al3+ + D-Arg", "D-精氨酸手性梯度 (5, 10, 20, 30, 40 μM)", C_PURPLE_LIGHT),
        ("15. Unknown Sample", "待测样品未知荧光光谱 (同步同批次测定)", C_AMBER_LIGHT),
    ]

    for idx, (col_name, col_desc, col_color) in enumerate(channels):
        cy = ly1 + 220 + idx * 62
        draw.rounded_rectangle([lx1 + 48, cy, lx2 - 48, cy + 50], radius=8, fill="#0F172A", outline="#1E293B")
        draw.ellipse([lx1 + 66, cy + 18, lx1 + 78, cy + 30], fill=col_color)
        draw.text((lx1 + 92, cy + 12), col_name, fill=col_color, font=font_small_b)
        draw.text((lx1 + 360, cy + 14), col_desc, fill=C_TEXT_GRAY, font=font_tiny)

    # RIGHT PANEL: Action & Instructions
    cards = [
        ("一、数据规范性要求", "光谱波长范围必须覆盖 410 至 650 nm，且采用 2.0 nm 固定步长。共 121 个连续波长数据点，确保峰位寻峰精度。", C_CYAN),
        ("二、体系化学条件规范", "实验测试体系采用 [S-TM] = 10 μM，加入 [Al3+] = 10 μM (1.0 当量)，溶剂为 HEPES 缓冲溶液 (pH 7.4)。", C_AMBER),
        ("三、同批次测定原则", "未知待测样品与标准曲线应在相同温湿度与仪器增益(Gain)参数下同批次完成，消除基线漂移。", C_GREEN),
    ]

    for idx, (head, text, color) in enumerate(cards):
        cy = ry1 + 24 + idx * 164
        draw.rounded_rectangle([rx1 + 28, cy, rx2 - 28, cy + 144], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
        draw.rectangle([rx1 + 28, cy, rx1 + 36, cy + 144], fill=color)
        draw.text((rx1 + 54, cy + 18), head, fill=C_TEXT_WHITE, font=font_h2)
        draw.text((rx1 + 54, cy + 58), text[:28], fill=C_TEXT_GRAY, font=font_body)
        draw.text((rx1 + 54, cy + 92), text[28:], fill=C_TEXT_GRAY, font=font_body)

    # Download Button Area at bottom
    btn_y1, btn_y2 = ry2 - 130, ry2 - 38
    if subframe == 0:
        draw.rounded_rectangle([rx1 + 28, btn_y1, rx2 - 28, btn_y2], radius=16, fill="#0284C7", outline=C_CYAN_LIGHT, width=2)
        draw.text((rx1 + 170, btn_y1 + 28), "[ 点击下载标准 Excel 模板文件 (.xlsx) ]", fill=C_TEXT_WHITE, font=font_h2)
        draw.polygon([(rx1 + 610, btn_y1 + 45), (rx1 + 626, btn_y1 + 65), (rx1 + 618, btn_y1 + 65), (rx1 + 622, btn_y1 + 77), (rx1 + 614, btn_y1 + 80), (rx1 + 610, btn_y1 + 68), (rx1 + 602, btn_y1 + 72)], fill="#FFFFFF")
    elif subframe == 1:
        draw.rounded_rectangle([rx1 + 28, btn_y1, rx2 - 28, btn_y2], radius=16, fill="#0369A1", outline="#38BDF8", width=3)
        draw.text((rx1 + 200, btn_y1 + 28), "正在生成并下载模板文件...", fill="#E0F2FE", font=font_h2)
    else:
        draw.rounded_rectangle([rx1 + 28, btn_y1, rx2 - 28, btn_y2], radius=16, fill=C_GREEN_BG, outline=C_GREEN_LIGHT, width=2)
        draw_vector_check(draw, rx1 + 80, (btn_y1 + btn_y2) // 2, r=18, bg_color=C_GREEN, fg_color="#022C22")
        draw.text((rx1 + 120, btn_y1 + 28), "模板已下载: S-TM_Fluorescence_Template.xlsx", fill="#DCFCE7", font=font_h2)

    return img

# ==========================================
# STEP 2: 数据导入与严格校验 / Upload & Data Validation
# ==========================================
def render_step_2(subframe):
    img, draw = create_base_canvas(1)
    (lx1, ly1, lx2, ly2), (rx1, ry1, rx2, ry2) = draw_panels(
        draw, 
        "步骤 2: 数据导入与结构解析", 
        "数据合规性校验引擎 (Data Integrity Verification)"
    )

    # LEFT PANEL: Upload Area
    if subframe == 0:
        draw.rounded_rectangle([lx1 + 28, ly1 + 24, lx2 - 28, ly2 - 28], radius=16, fill=C_CARD_BG, outline=C_CYAN, width=3)
        draw.ellipse([lx1 + 400, ly1 + 220, lx1 + 500, ly1 + 320], fill="#083344", outline=C_CYAN_LIGHT, width=2)
        draw.polygon([(lx1 + 450, ly1 + 246), (lx1 + 424, ly1 + 280), (lx1 + 440, ly1 + 280), (lx1 + 440, ly1 + 304), (lx1 + 460, ly1 + 304), (lx1 + 460, ly1 + 280), (lx1 + 476, ly1 + 280)], fill=C_CYAN_LIGHT)
        draw.text((lx1 + 270, ly1 + 350), "拖拽荧光原始数据至此处，或点击浏览文件", fill=C_TEXT_WHITE, font=font_h2)
        draw.text((lx1 + 310, ly1 + 396), "支持 .xlsx, .xls, .csv 格式 (14 通道矩阵)", fill=C_TEXT_GRAY, font=font_body)
    elif subframe == 1:
        draw.rounded_rectangle([lx1 + 28, ly1 + 24, lx2 - 28, ly2 - 28], radius=16, fill=C_CARD_BG, outline=C_AMBER, width=2)
        draw.text((lx1 + 290, ly1 + 260), "正在解析文件: 20260928_Raw_Spectra.xlsx", fill=C_TEXT_WHITE, font=font_h2)
        draw.rounded_rectangle([lx1 + 160, ly1 + 330, lx2 - 160, ly1 + 360], radius=15, fill="#1E293B")
        draw.rounded_rectangle([lx1 + 160, ly1 + 330, lx1 + 600, ly1 + 360], radius=15, fill=C_CYAN_LIGHT)
        draw.text((lx1 + 380, ly1 + 380), "解析矩阵中 68%...", fill=C_CYAN_LIGHT, font=font_body_b)
    else:
        draw.rounded_rectangle([lx1 + 28, ly1 + 24, lx2 - 28, ly1 + 140], radius=14, fill=C_CARD_BG, outline=C_GREEN, width=2)
        draw_vector_check(draw, lx1 + 70, ly1 + 82, r=18, bg_color=C_GREEN, fg_color="#022C22")
        draw.text((lx1 + 104, ly1 + 48), "数据文件加载成功: 20260928_Raw_Spectra.xlsx", fill=C_TEXT_WHITE, font=font_h2)
        draw.text((lx1 + 104, ly1 + 90), "矩阵规模: 121 行 × 14 列 (共计 1,694 个荧光发射强度采样值)", fill=C_GREEN_LIGHT, font=font_small)

        # Mini data table preview
        draw.rounded_rectangle([lx1 + 28, ly1 + 164, lx2 - 28, ly2 - 28], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
        draw.text((lx1 + 48, ly1 + 186), "光谱数据矩阵即时预览 (前 6 行采样点)：", fill=C_TEXT_LIGHT, font=font_body_b)

        headers = ["Wavelength", "Blank", "Arg 5uM", "Arg 10uM", "Arg 20uM", "Sample"]
        for hi, htext in enumerate(headers):
            draw.text((lx1 + 50 + hi * 135, ly1 + 230), htext, fill=C_CYAN_LIGHT, font=font_small_b)
        draw.line([lx1 + 40, ly1 + 266, lx2 - 40, ly1 + 266], fill=C_PANEL_BORDER, width=2)

        sample_rows = [
            ("410.0 nm", "30.20", "89.15", "154.20", "285.40", "340.20"),
            ("412.0 nm", "30.55", "92.40", "159.80", "294.60", "351.10"),
            ("414.0 nm", "31.02", "95.80", "165.40", "304.10", "362.40"),
            ("416.0 nm", "31.80", "99.20", "171.10", "314.50", "374.00"),
            ("418.0 nm", "32.40", "102.60", "176.80", "324.90", "385.60"),
            ("420.0 nm", "33.10", "106.10", "182.50", "335.20", "397.30"),
        ]
        for ri, row in enumerate(sample_rows):
            ry = ly1 + 284 + ri * 54
            row_bg = "#111827" if ri % 2 == 0 else "#162032"
            draw.rectangle([lx1 + 40, ry, lx2 - 40, ry + 46], fill=row_bg)
            for ci, val in enumerate(row):
                draw.text((lx1 + 50 + ci * 135, ry + 10), val, fill=C_TEXT_GRAY if ci > 0 else C_TEXT_LIGHT, font=font_mono)

        draw.text((lx1 + 280, ly2 - 68), "... 其余 115 行光谱采样点已全部正常装载 ...", fill=C_TEXT_MUTED, font=font_tiny)

    # RIGHT PANEL: Data Validation Checklist
    rules = [
        ("1. 矩阵维度与波长步长校验", "检测到 121 行采样点，波长连续自 410.0 nm 至 650.0 nm，Δλ = 2.0 nm 步长严格一致。", True if subframe == 2 else False),
        ("2. 通道完整性与数值有效性", "14 个通道无任何缺失值 (NaN)、文本畸变或异常负值荧光发射读数。", True if subframe == 2 else False),
        ("3. 探针空白对照基线校验", "S-TM 空白 (32.1 a.u.) 与 S-TM/Al3+ 空白 (28.4 a.u.) 处于正常仪器本底噪声范围。", True if subframe >= 1 else False),
        ("4. 标准浓度梯度响应单调性", "随着精氨酸浓度增加 (5->40 μM)，特征荧光发射强度呈严格单调递增规律。", True if subframe == 2 else False),
    ]

    for idx, (head, text, passed) in enumerate(rules):
        cy = ry1 + 24 + idx * 140
        draw.rounded_rectangle([rx1 + 28, cy, rx2 - 28, cy + 122], radius=14, fill=C_CARD_BG, outline="#059669" if passed else C_CARD_BORDER, width=2)
        if passed:
            draw_vector_check(draw, rx1 + 66, cy + 42, r=18, bg_color=C_GREEN, fg_color="#022C22")
            head_fg = C_GREEN_LIGHT
        else:
            draw.ellipse([rx1 + 48, cy + 24, rx1 + 84, cy + 60], fill="#374151")
            draw.text((rx1 + 60, cy + 30), "-", fill=C_TEXT_MUTED, font=font_body_b)
            head_fg = C_TEXT_GRAY

        draw.text((rx1 + 100, cy + 24), head, fill=head_fg, font=font_body_b)
        draw.text((rx1 + 100, cy + 64), text[:28], fill=C_TEXT_GRAY, font=font_small)
        draw.text((rx1 + 100, cy + 90), text[28:], fill=C_TEXT_GRAY, font=font_small)

    if subframe == 2:
        draw.rounded_rectangle([rx1 + 28, ry2 - 130, rx2 - 28, ry2 - 38], radius=16, fill=C_GREEN_BG, outline=C_GREEN_LIGHT, width=2)
        draw_vector_check(draw, rx1 + 80, (ry2 - 130 + ry2 - 38) // 2, r=18, bg_color=C_GREEN, fg_color="#022C22")
        draw.text((rx1 + 120, ry2 - 100), "全部 4 项科研数据质量规则校验通过！已就绪", fill="#DCFCE7", font=font_h2)
    else:
        draw.rounded_rectangle([rx1 + 28, ry2 - 130, rx2 - 28, ry2 - 38], radius=16, fill=C_CARD_BG, outline=C_AMBER, width=2)
        draw.text((rx1 + 180, ry2 - 100), "正在执行光谱数据矩阵合规性校验...", fill=C_AMBER_LIGHT, font=font_h2)

    return img

# ==========================================
# STEP 3: 自动峰位识别与强度提取 / Peak Detection & Extraction
# ==========================================
def render_step_3(subframe):
    img, draw = create_base_canvas(2)
    (lx1, ly1, lx2, ly2), (rx1, ry1, rx2, ry2) = draw_panels(
        draw, 
        "步骤 3: 荧光发射光谱与自动寻峰", 
        "特征峰 (486 nm) 荧光强度提取结果"
    )

    # LEFT PANEL: Emission Spectra Plot (Keep strictly inside boundaries!)
    plot_x1, plot_y1, plot_x2, plot_y2 = lx1 + 50, ly1 + 50, lx2 - 50, ly2 - 80
    draw.rectangle([plot_x1, plot_y1, plot_x2, plot_y2], fill="#0A0E17", outline="#1F2937", width=2)

    # Grid lines
    for wl in [440, 480, 520, 560, 600, 640]:
        gx = plot_x1 + int((wl - 410) / (650 - 410) * (plot_x2 - plot_x1))
        draw.line([gx, plot_y1, gx, plot_y2], fill="#162032", width=1)
        draw.text((gx - 18, plot_y2 + 12), f"{wl}", fill=C_TEXT_MUTED, font=font_tiny)

    for fl in [200, 400, 600, 800]:
        gy = plot_y2 - int(fl / 1100 * (plot_y2 - plot_y1))
        draw.line([plot_x1, gy, plot_x2, gy], fill="#162032", width=1)
        draw.text((plot_x1 - 42, gy - 10), f"{fl}", fill=C_TEXT_MUTED, font=font_tiny)

    draw.text(((plot_x1 + plot_x2) // 2 - 60, plot_y2 + 42), "波长 Wavelength (nm)", fill=C_TEXT_GRAY, font=font_small)

    # Spectra curves scaled to stay well inside the plot box
    curves = [
        (32, 25, "#475569", "S-TM Blank"),
        (106, 100, "#0284C7", "Arg 5uM"),
        (180, 200, "#0EA5E9", "Arg 10uM"),
        (329, 360, "#38BDF8", "Arg 20uM"),
        (477, 520, "#7DD3FC", "Arg 30uM"),
        (626, 700, "#BAE6FD", "Arg 40uM (Max)"),
        (388, 440, "#F59E0B", "Unknown Sample"),
    ]

    for base, amp, color, name in curves:
        pts = []
        for wl in range(410, 651, 3):
            val = base + amp * math.exp(-((wl - 486) ** 2) / (2 * 34 ** 2))
            val += amp * 0.15 * math.exp(-((wl - 530) ** 2) / (2 * 50 ** 2))
            px = plot_x1 + (wl - 410) / (650 - 410) * (plot_x2 - plot_x1)
            py = plot_y2 - (val / 1150) * (plot_y2 - plot_y1)
            pts.append((px, py))
        draw.line(pts, fill=color, width=3 if "Sample" in name else 2)

    # Dynamic scanning laser line
    scan_wl = 440 if subframe == 0 else (465 if subframe == 1 else 486)
    scan_x = plot_x1 + (scan_wl - 410) / (650 - 410) * (plot_x2 - plot_x1)

    if subframe == 2:
        draw.line([scan_x, plot_y1, scan_x, plot_y2], fill=C_CYAN_LIGHT, width=3)
        sample_apex_y = plot_y2 - ((388 + 440) / 1150) * (plot_y2 - plot_y1)
        draw.ellipse([scan_x - 9, sample_apex_y - 9, scan_x + 9, sample_apex_y + 9], fill=C_AMBER_LIGHT, outline="#FFFFFF", width=3)

        # Callout marker
        draw.rounded_rectangle([scan_x + 18, plot_y1 + 40, scan_x + 290, plot_y1 + 130], radius=10, fill="#082F49", outline=C_CYAN_LIGHT, width=2)
        draw.text((scan_x + 32, plot_y1 + 52), "[ 发射特征峰锁定 ]", fill=C_CYAN_LIGHT, font=font_small_b)
        draw.text((scan_x + 32, plot_y1 + 86), "λ_max = 486.0 nm", fill=C_TEXT_WHITE, font=font_h2)
    else:
        draw.line([scan_x, plot_y1, scan_x, plot_y2], fill=C_AMBER, width=2)
        draw.text((scan_x + 10, plot_y1 + 20), f"正在寻峰... λ={scan_wl}nm", fill=C_AMBER_LIGHT, font=font_small)

    # RIGHT PANEL: Extracted intensities table at 486 nm
    draw.rounded_rectangle([rx1 + 28, ry1 + 24, rx2 - 28, ry1 + 104], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
    draw.text((rx1 + 48, ry1 + 40), "算法定位特征波长: λ = 486.0 nm", fill=C_CYAN_LIGHT, font=font_h2)
    draw.text((rx1 + 48, ry1 + 72), "采用二阶导数极小值与局部极大值双重锁定，全通道瞬时提取完成", fill=C_TEXT_GRAY, font=font_small)

    # Extracted data table
    draw.rounded_rectangle([rx1 + 28, ry1 + 124, rx2 - 28, ry2 - 110], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
    draw.text((rx1 + 48, ry1 + 144), "486 nm 荧光强度提取特征值 (a.u.)：", fill=C_TEXT_LIGHT, font=font_body_b)

    ext_data = [
        ("S-TM 探针空白 (F0)", "32.10", C_TEXT_GRAY),
        ("S-TM + Arg 5 μM", "106.35", C_TEXT_LIGHT),
        ("S-TM + Arg 10 μM", "180.60", C_TEXT_LIGHT),
        ("S-TM + Arg 20 μM", "329.10", C_TEXT_LIGHT),
        ("S-TM + Arg 30 μM", "477.60", C_TEXT_LIGHT),
        ("S-TM + Arg 40 μM", "626.10", C_TEXT_LIGHT),
        ("S-TM/Al3+ 探针空白 (F0_chiral)", "28.40", C_TEXT_GRAY),
        ("待测样品 (总精通道 F_total)", "388.90", C_AMBER_LIGHT),
        ("待测样品 (手性通道 F_chiral)", "502.80", C_CYAN_LIGHT),
    ]

    for idx, (col_label, val_str, val_col) in enumerate(ext_data):
        ey = ry1 + 188 + idx * 46
        row_bg = "#111827" if idx % 2 == 0 else "#162032"
        draw.rectangle([rx1 + 40, ey, rx2 - 40, ey + 40], fill=row_bg)
        draw.text((rx1 + 54, ey + 8), col_label, fill=C_TEXT_LIGHT if "样品" in col_label else C_TEXT_GRAY, font=font_small)
        draw.text((rx2 - 180, ey + 8), val_str, fill=val_col, font=font_mono_b)

    # Bottom badge
    draw.rounded_rectangle([rx1 + 28, ry2 - 94, rx2 - 28, ry2 - 24], radius=14, fill=C_GREEN_BG, outline=C_GREEN, width=2)
    draw_vector_check(draw, rx1 + 70, (ry2 - 94 + ry2 - 24) // 2, r=16, bg_color=C_GREEN, fg_color="#022C22")
    draw.text((rx1 + 104, ry2 - 68), "486 nm 特征峰数据提取完成，自动注入标线拟合引擎", fill="#DCFCE7", font=font_body_b)

    return img

# ==========================================
# STEP 4: 总精氨酸拟合 / Total Arg Standard Curve
# ==========================================
def render_step_4(subframe):
    img, draw = create_base_canvas(3)
    (lx1, ly1, lx2, ly2), (rx1, ry1, rx2, ry2) = draw_panels(
        draw, 
        "步骤 4: 总精氨酸标准曲线拟合 (S-TM Probe)", 
        "总精氨酸一元线性回归与浓度反算"
    )

    # LEFT PANEL: Total Arg Calibration Curve
    plot_x1, plot_y1, plot_x2, plot_y2 = lx1 + 60, ly1 + 50, lx2 - 50, ly2 - 80
    draw.rectangle([plot_x1, plot_y1, plot_x2, plot_y2], fill="#0A0E17", outline="#1F2937", width=2)

    for c_val in [0, 10, 20, 30, 40]:
        gx = plot_x1 + int(c_val / 45 * (plot_x2 - plot_x1))
        draw.line([gx, plot_y1, gx, plot_y2], fill="#162032", width=1)
        draw.text((gx - 10, plot_y2 + 12), f"{c_val}", fill=C_TEXT_MUTED, font=font_tiny)

    for f_val in [0, 200, 400, 600]:
        gy = plot_y2 - int(f_val / 700 * (plot_y2 - plot_y1))
        draw.line([plot_x1, gy, plot_x2, gy], fill="#162032", width=1)
        draw.text((plot_x1 - 42, gy - 10), f"{f_val}", fill=C_TEXT_MUTED, font=font_tiny)

    draw.text(((plot_x1 + plot_x2) // 2 - 80, plot_y2 + 42), "精氨酸总浓度 Concentration (μM)", fill=C_TEXT_GRAY, font=font_small)

    calib_pts = [
        (0, 32.10),
        (5, 106.35),
        (10, 180.60),
        (20, 329.10),
        (30, 477.60),
        (40, 626.10),
    ]

    end_c = 20 if subframe == 0 else (35 if subframe == 1 else 45)
    line_x1 = plot_x1
    line_y1 = plot_y2 - int(32.10 / 700 * (plot_y2 - plot_y1))
    line_x2 = plot_x1 + int(end_c / 45 * (plot_x2 - plot_x1))
    line_y2 = plot_y2 - int((14.85 * end_c + 32.10) / 700 * (plot_y2 - plot_y1))
    draw.line([line_x1, line_y1, line_x2, line_y2], fill=C_CYAN_LIGHT, width=4)

    for c_val, f_val in calib_pts:
        px = plot_x1 + int(c_val / 45 * (plot_x2 - plot_x1))
        py = plot_y2 - int(f_val / 700 * (plot_y2 - plot_y1))
        draw.ellipse([px - 8, py - 8, px + 8, py + 8], fill=C_CYAN, outline="#FFFFFF", width=2)

    if subframe == 2:
        sx = plot_x1 + int(24.03 / 45 * (plot_x2 - plot_x1))
        sy = plot_y2 - int(388.90 / 700 * (plot_y2 - plot_y1))
        for dx in range(plot_x1, sx, 12):
            draw.line([dx, sy, min(dx + 6, sx), sy], fill=C_AMBER_LIGHT, width=2)
        for dy in range(sy, plot_y2, 12):
            draw.line([sx, dy, sx, min(dy + 6, plot_y2)], fill=C_AMBER_LIGHT, width=2)
        draw.ellipse([sx - 11, sy - 11, sx + 11, sy + 11], fill=C_AMBER, outline="#FFFFFF", width=3)
        draw.text((sx + 16, sy - 24), "待测样品 Sample\n(24.03 μM, 388.9 a.u.)", fill=C_AMBER_LIGHT, font=font_small_b)

    # RIGHT PANEL: Regression Details & Calculation
    draw.rounded_rectangle([rx1 + 28, ry1 + 24, rx2 - 28, ry1 + 190], radius=14, fill=C_CARD_BG, outline=C_CYAN, width=2)
    draw.text((rx1 + 48, ry1 + 44), "线性拟合方程 (Linear Calibration Model)", fill=C_CYAN_LIGHT, font=font_h2)
    draw.text((rx1 + 48, ry1 + 86), "y = 14.850 · C + 32.100", fill=C_TEXT_WHITE, font=font_stat_val)
    draw.text((rx1 + 48, ry1 + 144), "斜率 k = 14.850 a.u./μM  |  截距 b = 32.100 a.u.", fill=C_TEXT_GRAY, font=font_small)

    # R^2 card
    draw.rounded_rectangle([rx1 + 28, ry1 + 214, rx2 - 28, ry1 + 344], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
    draw.text((rx1 + 48, ry1 + 234), "决定系数 (拟合优度 R²)：", fill=C_TEXT_LIGHT, font=font_body_b)
    draw.text((rx1 + 48, ry1 + 270), "R² = 0.9999", fill=C_GREEN_LIGHT, font=font_stat_val)
    draw.text((rx1 + 330, ry1 + 282), "(极高线性相关性，拟合极佳)", fill=C_GREEN, font=font_small)

    # Inversion calculation card (Use font_val_large for Chinese + numbers)
    draw.rounded_rectangle([rx1 + 28, ry1 + 368, rx2 - 28, ry2 - 110], radius=14, fill="#082F49", outline=C_CYAN_LIGHT, width=2)
    draw.text((rx1 + 48, ry1 + 390), "待测样品总精氨酸浓度反算：", fill=C_CYAN_LIGHT, font=font_h2)
    draw.text((rx1 + 48, ry1 + 434), "样品测定荧光值: F_sample = 388.90 a.u.", fill=C_TEXT_LIGHT, font=font_body)
    draw.text((rx1 + 48, ry1 + 472), "反算公式: C_total = (F_sample - b) / k", fill=C_TEXT_GRAY, font=font_body)
    draw.text((rx1 + 48, ry1 + 510), "计算过程: (388.90 - 32.10) / 14.850", fill=C_TEXT_GRAY, font=font_body)
    draw.text((rx1 + 48, ry1 + 550), "总精氨酸浓度 = 24.03 μM", fill=C_AMBER_LIGHT, font=font_val_large)

    # Bottom badge
    draw.rounded_rectangle([rx1 + 28, ry2 - 94, rx2 - 28, ry2 - 24], radius=14, fill=C_GREEN_BG, outline=C_GREEN, width=2)
    draw_vector_check(draw, rx1 + 70, (ry2 - 94 + ry2 - 24) // 2, r=16, bg_color=C_GREEN, fg_color="#022C22")
    draw.text((rx1 + 104, ry2 - 68), "总精氨酸浓度锁定完成 (24.03 μM)，作为手性拆分总约束", fill="#DCFCE7", font=font_body_b)

    return img

# ==========================================
# STEP 5: 手性拆分计算 / S-TM/Al3+ Chiral Dual Calibration & Solving
# ==========================================
def render_step_5(subframe):
    img, draw = create_base_canvas(4)
    (lx1, ly1, lx2, ly2), (rx1, ry1, rx2, ry2) = draw_panels(
        draw, 
        "步骤 5: S-TM/Al3+ 手性双标线与灵敏度区分", 
        "二元一次方程组联立求解与加和性检验"
    )

    # LEFT PANEL: Dual Calibration Curves (L-Arg vs D-Arg)
    plot_x1, plot_y1, plot_x2, plot_y2 = lx1 + 60, ly1 + 50, lx2 - 50, ly2 - 80
    draw.rectangle([plot_x1, plot_y1, plot_x2, plot_y2], fill="#0A0E17", outline="#1F2937", width=2)

    for c_val in [0, 10, 20, 30, 40]:
        gx = plot_x1 + int(c_val / 45 * (plot_x2 - plot_x1))
        draw.line([gx, plot_y1, gx, plot_y2], fill="#162032", width=1)
        draw.text((gx - 10, plot_y2 + 12), f"{c_val}", fill=C_TEXT_MUTED, font=font_tiny)

    for f_val in [0, 250, 500, 750, 1000]:
        gy = plot_y2 - int(f_val / 1050 * (plot_y2 - plot_y1))
        draw.line([plot_x1, gy, plot_x2, gy], fill="#162032", width=1)
        draw.text((plot_x1 - 44, gy - 10), f"{f_val}", fill=C_TEXT_MUTED, font=font_tiny)

    draw.text(((plot_x1 + plot_x2) // 2 - 80, plot_y2 + 42), "对映体浓度 Concentration (μM)", fill=C_TEXT_GRAY, font=font_small)

    l_line_x2 = plot_x1 + int(40 / 45 * (plot_x2 - plot_x1))
    l_line_y2 = plot_y2 - int((23.42 * 40 + 28.40) / 1050 * (plot_y2 - plot_y1))
    draw.line([plot_x1, plot_y2 - int(28.4 / 1050 * (plot_y2 - plot_y1)), l_line_x2, l_line_y2], fill=C_CYAN_LIGHT, width=4)

    d_line_x2 = plot_x1 + int(40 / 45 * (plot_x2 - plot_x1))
    d_line_y2 = plot_y2 - int((8.74 * 40 + 28.40) / 1050 * (plot_y2 - plot_y1))
    draw.line([plot_x1, plot_y2 - int(28.4 / 1050 * (plot_y2 - plot_y1)), d_line_x2, d_line_y2], fill=C_PURPLE_LIGHT, width=4)

    for c_val in [0, 5, 10, 20, 30, 40]:
        px = plot_x1 + int(c_val / 45 * (plot_x2 - plot_x1))
        py = plot_y2 - int((23.42 * c_val + 28.40) / 1050 * (plot_y2 - plot_y1))
        draw.ellipse([px - 7, py - 7, px + 7, py + 7], fill=C_CYAN, outline="#FFFFFF", width=2)

    for c_val in [0, 5, 10, 20, 30, 40]:
        px = plot_x1 + int(c_val / 45 * (plot_x2 - plot_x1))
        py = plot_y2 - int((8.74 * c_val + 28.40) / 1050 * (plot_y2 - plot_y1))
        draw.ellipse([px - 7, py - 7, px + 7, py + 7], fill=C_PURPLE, outline="#FFFFFF", width=2)

    # Slope ratio banner
    draw.rounded_rectangle([plot_x1 + 30, plot_y1 + 24, plot_x1 + 410, plot_y1 + 148], radius=12, fill="#0F172A", outline=C_CYAN_LIGHT, width=2)
    draw.text((plot_x1 + 46, plot_y1 + 36), "手性响应灵敏度区分比：", fill=C_TEXT_LIGHT, font=font_small_b)
    draw.text((plot_x1 + 46, plot_y1 + 68), "k_L / k_D = 2.68 倍", fill=C_CYAN_LIGHT, font=font_val_large)
    draw.text((plot_x1 + 46, plot_y1 + 116), "(显著手性识别能力，满足拆分条件)", fill=C_GREEN_LIGHT, font=font_tiny)

    # RIGHT PANEL: System of Linear Equations
    draw.rounded_rectangle([rx1 + 28, ry1 + 24, rx2 - 28, ry1 + 204], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
    draw.text((rx1 + 48, ry1 + 40), "联立线性方程组 (System of Linear Equations)", fill=C_TEXT_WHITE, font=font_h2)
    draw.text((rx1 + 48, ry1 + 84), "[1] 总量守恒:  C_L + C_D = 24.03 μM", fill=C_CYAN_LIGHT, font=font_mono_b)
    draw.text((rx1 + 48, ry1 + 124), "[2] 荧光加和:  23.42·C_L + 8.74·C_D + 28.40 = 502.80", fill=C_PURPLE_LIGHT, font=font_mono_b)
    draw.text((rx1 + 48, ry1 + 166), "矩阵形式: [ 1.00   1.00 ] [ C_L ] = [ 24.03 ]", fill=C_TEXT_GRAY, font=font_mono)

    # Solved Results Box
    draw.rounded_rectangle([rx1 + 28, ry1 + 224, rx2 - 28, ry2 - 110], radius=14, fill="#022C22" if subframe == 2 else C_CARD_BG, outline=C_GREEN_LIGHT if subframe == 2 else C_CYAN, width=2)
    draw.text((rx1 + 48, ry1 + 244), "手性二元组分精确解算结果：" if subframe == 2 else "正在执行矩阵逆运算求解中...", fill=C_GREEN_LIGHT if subframe == 2 else C_CYAN_LIGHT, font=font_h2)

    # Results cards
    draw.rounded_rectangle([rx1 + 48, ry1 + 290, rx1 + 350, ry1 + 400], radius=12, fill="#0F172A", outline=C_CYAN)
    draw.text((rx1 + 68, ry1 + 304), "L-精氨酸浓度 (C_L)", fill=C_CYAN_LIGHT, font=font_small_b)
    draw.text((rx1 + 68, ry1 + 340), "17.97 μM", fill=C_TEXT_WHITE, font=font_stat_val)

    draw.rounded_rectangle([rx1 + 370, ry1 + 290, rx2 - 48, ry1 + 400], radius=12, fill="#0F172A", outline=C_PURPLE)
    draw.text((rx1 + 390, ry1 + 304), "D-精氨酸浓度 (C_D)", fill=C_PURPLE_LIGHT, font=font_small_b)
    draw.text((rx1 + 390, ry1 + 340), "6.06 μM", fill=C_TEXT_WHITE, font=font_stat_val)

    # Mixture Additivity Validation
    draw.text((rx1 + 48, ry1 + 430), "混合物独立荧光加和性假设检验：", fill=C_TEXT_LIGHT, font=font_body_b)
    draw.text((rx1 + 48, ry1 + 466), "理论预测荧光: F_pred = 23.42×17.97 + 8.74×6.06 + 28.40 = 502.82 a.u.", fill=C_TEXT_GRAY, font=font_small)
    draw.text((rx1 + 48, ry1 + 500), "实测荧光: 502.80 a.u.  |  相对残差: Δ = 0.004% << 5.0%", fill=C_GREEN_LIGHT, font=font_small_b)

    # Bottom badge
    draw.rounded_rectangle([rx1 + 28, ry2 - 94, rx2 - 28, ry2 - 24], radius=14, fill=C_GREEN_BG, outline=C_GREEN, width=2)
    draw_vector_check(draw, rx1 + 70, (ry2 - 94 + ry2 - 24) // 2, r=16, bg_color=C_GREEN, fg_color="#022C22")
    draw.text((rx1 + 104, ry2 - 68), "手性组分精确拆分成功，符合独立加和模型假设", fill="#DCFCE7", font=font_body_b)

    return img

# ==========================================
# STEP 6: 手性看板与多工作表导出 / Chiral Dashboard & Multi-Sheet Export
# ==========================================
def render_step_6(subframe):
    img, draw = create_base_canvas(5)
    (lx1, ly1, lx2, ly2), (rx1, ry1, rx2, ry2) = draw_panels(
        draw, 
        "步骤 6: 手性组成看板与对映体过量值 (ee)", 
        "科研级多工作表分析报告导出 (6-Sheet Excel)"
    )

    # LEFT PANEL: Chiral Composition Donut Chart & Metrics
    chart_cx, chart_cy, chart_r = lx1 + 230, ly1 + 220, 140
    draw.pieslice([chart_cx - chart_r, chart_cy - chart_r, chart_cx + chart_r, chart_cy + chart_r], start=-90, end=179, fill=C_CYAN)
    draw.pieslice([chart_cx - chart_r, chart_cy - chart_r, chart_cx + chart_r, chart_cy + chart_r], start=179, end=270, fill=C_PURPLE)
    inner_r = 85
    draw.ellipse([chart_cx - inner_r, chart_cy - inner_r, chart_cx + inner_r, chart_cy + inner_r], fill=C_PANEL)
    draw.text((chart_cx - 42, chart_cy - 24), "手性比例", fill=C_TEXT_GRAY, font=font_small)
    draw.text((chart_cx - 52, chart_cy + 4), "74.8% L", fill=C_CYAN_LIGHT, font=font_h2)

    # Legend next to chart
    draw.ellipse([lx1 + 420, ly1 + 140, lx1 + 444, ly1 + 164], fill=C_CYAN)
    draw.text((lx1 + 460, ly1 + 138), "L-精氨酸: 74.8% (17.97 μM)", fill=C_TEXT_WHITE, font=font_body_b)

    draw.ellipse([lx1 + 420, ly1 + 200, lx1 + 444, ly1 + 224], fill=C_PURPLE)
    draw.text((lx1 + 460, ly1 + 198), "D-精氨酸: 25.2% (6.06 μM)", fill=C_TEXT_WHITE, font=font_body_b)

    draw.ellipse([lx1 + 420, ly1 + 260, lx1 + 444, ly1 + 284], fill=C_AMBER)
    draw.text((lx1 + 460, ly1 + 258), "总精氨酸: 100.0% (24.03 μM)", fill=C_TEXT_WHITE, font=font_body_b)

    # Metric Cards at bottom of left panel
    draw.rounded_rectangle([lx1 + 28, ly1 + 390, lx1 + 430, ly2 - 28], radius=14, fill=C_CARD_BG, outline=C_CYAN, width=2)
    draw.text((lx1 + 48, ly1 + 410), "对映体过量值 (ee)", fill=C_CYAN_LIGHT, font=font_h2)
    draw.text((lx1 + 48, ly1 + 456), "ee = 49.6%", fill=C_TEXT_WHITE, font=font_stat_val)
    draw.text((lx1 + 48, ly1 + 510), "公式: (|C_L - C_D| / C_total) × 100%", fill=C_TEXT_GRAY, font=font_tiny)
    draw.text((lx1 + 48, ly1 + 540), "优势构型: L-构型显著占优", fill=C_GREEN_LIGHT, font=font_small_b)

    draw.rounded_rectangle([lx1 + 450, ly1 + 390, lx2 - 28, ly2 - 28], radius=14, fill=C_CARD_BG, outline=C_PURPLE, width=2)
    draw.text((lx1 + 470, ly1 + 410), "手性异构体比例 (Ratio)", fill=C_PURPLE_LIGHT, font=font_h2)
    draw.text((lx1 + 470, ly1 + 456), "L : D = 2.97 : 1", fill=C_TEXT_WHITE, font=font_stat_val)
    draw.text((lx1 + 470, ly1 + 510), "基质加和性残差: 0.004%", fill=C_TEXT_GRAY, font=font_tiny)
    draw.text((lx1 + 470, ly1 + 540), "质量控制检验: 优 (Passed)", fill=C_GREEN_LIGHT, font=font_small_b)

    # RIGHT PANEL: Multi-Sheet Excel Export
    draw.rounded_rectangle([rx1 + 28, ry1 + 24, rx2 - 28, ry1 + 390], radius=14, fill=C_CARD_BG, outline=C_CARD_BORDER, width=2)
    draw.text((rx1 + 48, ry1 + 40), "导出 Excel 科研分析报告包含的 6 个完整工作表：", fill=C_TEXT_LIGHT, font=font_body_b)

    sheets = [
        ("Sheet 1: 原始光谱矩阵 (Raw Spectra)", "121 行 × 14 通道全波段原始发射强度"),
        ("Sheet 2: 特征峰位与提取值 (Extracted)", "486 nm 单一波长全样本荧光响应矩阵"),
        ("Sheet 3: 总精氨酸标线拟合 (Total Calibration)", "回归方程、斜率、截距及 R² = 0.9999"),
        ("Sheet 4: 手性双标线拟合 (Chiral Dual Curves)", "S-TM/Al3+ 体系 L/D 斜率与区分度参数"),
        ("Sheet 5: 手性拆分结果与 ee (Chiral Results)", "C_total, C_L, C_D, ee% 及手性占比"),
        ("Sheet 6: 仪器参数与假设检验 (QC & Meta)", "实验条件、加和性残差及质控核验清单"),
    ]

    for idx, (s_name, s_desc) in enumerate(sheets):
        sy = ry1 + 84 + idx * 48
        draw.rounded_rectangle([rx1 + 48, sy, rx2 - 48, sy + 42], radius=8, fill="#0F172A", outline="#1E293B")
        draw.text((rx1 + 64, sy + 10), s_name, fill=C_CYAN_LIGHT, font=font_small_b)
        draw.text((rx1 + 440, sy + 12), s_desc, fill=C_TEXT_GRAY, font=font_tiny)

    # Export Button & Success Status
    btn_y1, btn_y2 = ry1 + 420, ry2 - 38
    if subframe == 0:
        draw.rounded_rectangle([rx1 + 28, btn_y1, rx2 - 28, btn_y2], radius=16, fill="#0284C7", outline=C_CYAN_LIGHT, width=2)
        draw.text((rx1 + 160, btn_y1 + 40), "[ 点击导出多工作表科研分析报告 (.xlsx) ]", fill=C_TEXT_WHITE, font=font_h2)
    elif subframe == 1:
        draw.rounded_rectangle([rx1 + 28, btn_y1, rx2 - 28, btn_y2], radius=16, fill="#0369A1", outline="#38BDF8", width=3)
        draw.text((rx1 + 190, btn_y1 + 40), "正在生成多工作表 Excel 报告...", fill="#E0F2FE", font=font_h2)
    else:
        draw.rounded_rectangle([rx1 + 28, btn_y1, rx2 - 28, btn_y2], radius=16, fill=C_GREEN_BG, outline=C_GREEN_LIGHT, width=2)
        draw_vector_check(draw, rx1 + 76, (btn_y1 + btn_y2) // 2, r=20, bg_color=C_GREEN, fg_color="#022C22")
        draw.text((rx1 + 116, btn_y1 + 28), "报告已生成: S-TM_Arg_Analysis_Report.xlsx", fill="#DCFCE7", font=font_h2)
        draw.text((rx1 + 116, btn_y1 + 72), "全流程 6 步科研级自动化处理完毕！分析结果精准可靠", fill="#A7F3D0", font=font_small)

    return img

def generate_all_frames():
    print("Generating frames...")
    frames_spec = [
        # (step_func, subframe, duration_ms)
        (render_step_1, 0, 700),
        (render_step_1, 1, 600),
        (render_step_1, 2, 1300),
        
        (render_step_2, 0, 700),
        (render_step_2, 1, 600),
        (render_step_2, 2, 1300),
        
        (render_step_3, 0, 600),
        (render_step_3, 1, 600),
        (render_step_3, 2, 1400),
        
        (render_step_4, 0, 600),
        (render_step_4, 1, 600),
        (render_step_4, 2, 1400),
        
        (render_step_5, 0, 600),
        (render_step_5, 1, 600),
        (render_step_5, 2, 1500),
        
        (render_step_6, 0, 700),
        (render_step_6, 1, 700),
        (render_step_6, 2, 2500),
    ]

    rendered_images = []
    durations = []

    for i, (fn, sub, dur) in enumerate(frames_spec):
        print(f"Rendering frame {i+1}/{len(frames_spec)} (Step {fn.__name__} sub {sub})...")
        hi_img = fn(sub)
        low_img = hi_img.resize((OUT_W, OUT_H), Image.Resampling.LANCZOS)
        quant_img = low_img.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
        rendered_images.append(quant_img)
        durations.append(dur)

    dest_public = os.path.join(os.path.dirname(__file__), "public", "workflow_demo.gif")
    dest_artifact = r"C:\Users\Yi-Hao He\.gemini\antigravity\brain\a2d10e77-7676-4485-bc06-7a1b100b6810\workflow_demo.gif"

    print(f"Saving GIF to {dest_public}...")
    os.makedirs(os.path.dirname(dest_public), exist_ok=True)
    rendered_images[0].save(
        dest_public,
        save_all=True,
        append_images=rendered_images[1:],
        duration=durations,
        loop=0,
        optimize=True
    )
    file_size_mb = os.path.getsize(dest_public) / (1024 * 1024)
    print(f"GIF saved successfully to public: {file_size_mb:.2f} MB")

    print(f"Saving copy to artifact dir: {dest_artifact}...")
    os.makedirs(os.path.dirname(dest_artifact), exist_ok=True)
    rendered_images[0].save(
        dest_artifact,
        save_all=True,
        append_images=rendered_images[1:],
        duration=durations,
        loop=0,
        optimize=True
    )
    print("Done! GIF successfully created at both destinations.")

if __name__ == "__main__":
    generate_all_frames()
