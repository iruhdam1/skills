#!/usr/bin/env python3
"""Generate skill visuals — ghost-wireframe style, Onest, light mode.

Adapted from generate-prefix-first-diagrams.py (Personal Website 2026).
Outputs one visual.png per skill folder plus assets/hero.png.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
ASSETS = ROOT / "assets"
ONEST_CANDIDATES = [
    ROOT / "assets/fonts/Onest-VariableFont_wght.ttf",
    Path.home() / "Library/Fonts/Onest-VariableFont_wght.ttf",
    Path("/Users/iruhdam/Personal- MM/AI Projects/Personal Website 2026/assets/fonts/Onest-VariableFont_wght.ttf"),
]

# Light-mode neutral palette
BG = "#fdfcfa"
PANEL = "#f2f0ec"
PANEL_INNER = "#e8e5df"
BORDER = "#d8d4cc"
GHOST = "#cfcac1"        # ghost-wireframe block fill
GHOST_SOFT = "#e0dcd4"
TEXT = "#1c1a17"
MUTED = "#736d63"
ACCENT = "#1c1a17"       # monochrome accent — outlines that matter
PASS = "#2f7d4f"
WARN = "#a97b23"
FAIL = "#b3402e"
PASS_BG = "#e3f0e8"
WARN_BG = "#f4ead6"
FAIL_BG = "#f6e2de"


def resolve_onest() -> Path:
    for path in ONEST_CANDIDATES:
        if path.is_file():
            return path
    raise FileNotFoundError("Onest not found — add Onest-VariableFont_wght.ttf to assets/fonts/")


def load_fonts():
    onest = str(resolve_onest())
    return {
        "title": ImageFont.truetype(onest, 54),
        "h2": ImageFont.truetype(onest, 40),
        "body": ImageFont.truetype(onest, 30),
        "small": ImageFont.truetype(onest, 24),
        "chip": ImageFont.truetype(onest, 22),
        "hero_title": ImageFont.truetype(onest, 84),
        "hero_sub": ImageFont.truetype(onest, 36),
    }


def canvas(w=1600, h=900):
    img = Image.new("RGB", (w, h), BG)
    return img, ImageDraw.Draw(img)


def chip(d, cx, cy, label, color, bg, font):
    tw = d.textlength(label, font=font)
    pad = 18
    d.rounded_rectangle([cx - tw / 2 - pad, cy - 24, cx + tw / 2 + pad, cy + 24], radius=24, fill=bg)
    d.text((cx, cy), label, fill=color, font=font, anchor="mm")


def ghost_lines(d, x, y, w, rows, gap=26, h=12, widths=None):
    """Rows of ghost text bars."""
    for i in range(rows):
        rw = w * (widths[i] if widths else (0.92 if i % 3 else 0.7))
        d.rounded_rectangle([x, y + i * gap, x + rw, y + i * gap + h], radius=6, fill=GHOST_SOFT)


def phone_frame(d, x, y, w, h, label, fonts):
    d.rounded_rectangle([x, y, x + w, y + h], radius=20, fill="white", outline=BORDER, width=3)
    d.text((x + w / 2, y - 34), label, fill=MUTED, font=fonts["small"], anchor="mm")


# ---------------------------------------------------------------- bake-the-brief

def save_bake_the_brief(path: Path, fonts) -> None:
    img, d = canvas()
    d.text((800, 80), "Bake the brief in once", fill=TEXT, font=fonts["title"], anchor="mm")
    d.text((800, 140), "Never re-explain your context again", fill=MUTED, font=fonts["body"], anchor="mm")

    stages = [
        ("Brief", "Problem · user · constraints\nprinciples · already decided", 90),
        ("Explore", "Wide, against the brief\nEXPLORING → DECIDED", 590),
        ("Close-out", "Decision ledger\npaste into the next session", 1090),
    ]
    top, bottom = 240, 700
    for title, sub, x in stages:
        d.rounded_rectangle([x, top, x + 420, bottom], radius=20, fill=PANEL, outline=BORDER, width=3)
        d.text((x + 210, top + 70), title, fill=TEXT, font=fonts["h2"], anchor="mm")
        for j, line in enumerate(sub.split("\n")):
            d.text((x + 210, top + 140 + j * 40), line, fill=MUTED, font=fonts["small"], anchor="mm")
        ghost_lines(d, x + 60, top + 260, 300, 4)

    # locked-decision block inside Brief stage
    d.rounded_rectangle([150, 560, 450, 640], radius=12, fill=PANEL_INNER, outline=ACCENT, width=2)
    d.text((300, 600), "locked decisions", fill=TEXT, font=fonts["small"], anchor="mm")

    for ax in (520, 1020):
        d.line([(ax, 470), (ax + 60, 470)], fill=ACCENT, width=5)
        d.polygon([(ax + 60, 470), (ax + 40, 456), (ax + 40, 484)], fill=ACCENT)

    # loop arrow: close-out back to brief
    d.arc([160, 690, 1440, 800], start=25, end=155, fill=MUTED, width=4)
    d.polygon([(178, 738), (158, 762), (198, 768)], fill=MUTED)
    d.text((800, 850), "the close-out becomes the next session's brief", fill=MUTED, font=fonts["small"], anchor="mm")
    img.save(path, optimize=True)


# ---------------------------------------------------------------- design-lint

def save_design_lint(path: Path, fonts) -> None:
    img, d = canvas()
    d.text((800, 80), "design-lint · ghost-column at 390", fill=TEXT, font=fonts["title"], anchor="mm")

    fw, fh = 340, 620
    # BEFORE — empty ghost column, content clipped right
    x, y = 260, 190
    phone_frame(d, x, y, fw, fh, "before", fonts)
    d.rectangle([x + 20, y + 20, x + 130, y + fh - 20], fill=PANEL)              # empty ghost column
    d.text((x + 75, y + fh / 2), "empty", fill=MUTED, font=fonts["chip"], anchor="mm")
    for i in range(4):                                                            # clipped content blocks
        by = y + 40 + i * 145
        d.rounded_rectangle([x + 150, by, x + fw + 60, by + 110], radius=10, fill=GHOST)
    d.rectangle([x + fw, y, x + fw + 70, y + fh], fill=BG)                        # clip mask outside frame
    d.line([(x + fw, y), (x + fw, y + fh)], fill=FAIL, width=4)                   # clip edge
    chip(d, x + fw / 2, y + fh + 60, "fail · ghost-column", FAIL, FAIL_BG, fonts["chip"])

    # AFTER — full-width stacked blocks
    x = 1000
    phone_frame(d, x, y, fw, fh, "after", fonts)
    for i in range(4):
        by = y + 40 + i * 145
        d.rounded_rectangle([x + 30, by, x + fw - 30, by + 110], radius=10, fill=GHOST)
    chip(d, x + fw / 2, y + fh + 60, "pass", PASS, PASS_BG, fonts["chip"])

    d.line([(680, 500), (920, 500)], fill=ACCENT, width=5)
    d.polygon([(920, 500), (898, 485), (898, 515)], fill=ACCENT)
    d.text((800, 460), "grid-column: 1", fill=MUTED, font=fonts["small"], anchor="mm")
    img.save(path, optimize=True)


# ---------------------------------------------------------------- adjust-logos

def _mark(d, x, base_y, kind, h):
    """Abstract logo marks of different visual weights, bottom-aligned to base_y."""
    if kind == "bold-square":
        d.rounded_rectangle([x, base_y - h, x + h, base_y], radius=8, fill=TEXT)
    elif kind == "circle":
        d.ellipse([x, base_y - h, x + h, base_y], outline=TEXT, width=6)
    elif kind == "thin-wordmark":
        for i in range(3):
            d.rounded_rectangle([x + i * (h * 0.8), base_y - h * 0.62, x + i * (h * 0.8) + h * 0.55, base_y - h * 0.1], radius=4, outline=MUTED, width=3)
    elif kind == "descender":
        d.rounded_rectangle([x, base_y - h, x + h * 1.4, base_y - h * 0.25], radius=6, fill=GHOST)
        d.rectangle([x + h * 0.5, base_y - h * 0.3, x + h * 0.7, base_y + h * 0.18], fill=GHOST)
    elif kind == "wide-word":
        d.rounded_rectangle([x, base_y - h * 0.6, x + h * 2.4, base_y], radius=6, fill=GHOST)


def save_adjust_logos(path: Path, fonts) -> None:
    img, d = canvas()
    d.text((800, 80), "Same height ≠ same size", fill=TEXT, font=fonts["title"], anchor="mm")
    d.text((800, 140), "logo rows align optically, not mathematically", fill=MUTED, font=fonts["body"], anchor="mm")

    kinds = ["bold-square", "thin-wordmark", "circle", "descender", "wide-word"]
    xs = [220, 480, 780, 1020, 1300]

    # Row 1 — mathematical: identical heights, looks uneven
    band_y = 300
    d.rectangle([160, band_y, 1440, band_y + 4], fill=BORDER)
    d.rectangle([160, band_y + 124, 1440, band_y + 128], fill=BORDER)
    for kind, x in zip(kinds, xs):
        _mark(d, x, band_y + 110, kind, 96)
    d.text((160, band_y - 40), "mathematical — one size fits all", fill=MUTED, font=fonts["small"])
    chip(d, 1330, band_y - 40, "looks uneven", FAIL, FAIL_BG, fonts["chip"])

    # Row 2 — optical: tuned heights/baselines, looks even
    band_y = 600
    d.rectangle([160, band_y, 1440, band_y + 4], fill=BORDER)
    d.rectangle([160, band_y + 124, 1440, band_y + 128], fill=BORDER)
    tuned = {"bold-square": (88, 0), "thin-wordmark": (104, 0), "circle": (94, 0), "descender": (90, -8), "wide-word": (78, -4)}
    for kind, x in zip(kinds, xs):
        h, dy = tuned[kind]
        _mark(d, x, band_y + 110 + dy, kind, h)
    d.text((160, band_y - 40), "optical — per-logo height + baseline nudges", fill=MUTED, font=fonts["small"])
    chip(d, 1330, band_y - 40, "looks even", PASS, PASS_BG, fonts["chip"])

    d.text((800, 830), "band stays fixed · marks get tuned · every nudge gets a comment", fill=MUTED, font=fonts["small"], anchor="mm")
    img.save(path, optimize=True)


# ---------------------------------------------------------------- responsive-preview

def _ghost_page(d, x, y, w, h, cols, nav_break=False):
    d.rounded_rectangle([x, y, x + w, y + h], radius=14, fill="white", outline=BORDER, width=3)
    # nav
    d.rounded_rectangle([x + 14, y + 14, x + 14 + w * 0.22, y + 34], radius=6, fill=GHOST)
    if nav_break:
        d.rounded_rectangle([x + w * 0.55, y + 14, x + w - 14, y + 46], radius=6, fill=FAIL_BG)
        d.text((x + w * 0.775 + 0, y + 30), "nav", fill=FAIL, font=ImageFont.load_default(), anchor="mm")
    else:
        for i in range(3):
            d.rounded_rectangle([x + w - 14 - (i + 1) * (w * 0.13), y + 18, x + w - 20 - i * (w * 0.13), y + 30], radius=4, fill=GHOST_SOFT)
    # hero
    d.rounded_rectangle([x + 14, y + 56, x + w - 14, y + h * 0.34], radius=8, fill=PANEL)
    # content grid
    gy = y + h * 0.38
    gw = (w - 28 - (cols - 1) * 10) / cols
    rows = 2 if cols > 1 else 3
    for r in range(rows):
        for c in range(cols):
            cy0 = gy + r * (h * 0.26)
            if cy0 + h * 0.22 > y + h - 14:
                continue
            d.rounded_rectangle([x + 14 + c * (gw + 10), cy0, x + 14 + c * (gw + 10) + gw, cy0 + h * 0.22], radius=8, fill=GHOST_SOFT)


def save_responsive_preview(path: Path, fonts) -> None:
    img, d = canvas()
    d.text((800, 80), "One page · three widths · one verdict", fill=TEXT, font=fonts["title"], anchor="mm")

    # 390 — warn (nav breaks)
    _ghost_page(d, 140, 220, 234, 506, cols=1, nav_break=True)
    d.text((257, 186), "Mobile · 390", fill=MUTED, font=fonts["small"], anchor="mm")
    chip(d, 257, 780, "warn · nav", WARN, WARN_BG, fonts["chip"])

    # 820 — pass
    _ghost_page(d, 470, 268, 410, 512, cols=2)
    d.text((675, 234), "Tablet · 820", fill=MUTED, font=fonts["small"], anchor="mm")
    chip(d, 675, 834, "pass", PASS, PASS_BG, fonts["chip"])

    # 1280 — pass
    _ghost_page(d, 960, 300, 512, 384, cols=3)
    d.text((1216, 266), "Desktop · 1280", fill=MUTED, font=fonts["small"], anchor="mm")
    chip(d, 1216, 740, "pass", PASS, PASS_BG, fonts["chip"])
    img.save(path, optimize=True)


# ---------------------------------------------------------------- hero

def save_hero(path: Path, fonts) -> None:
    img, d = canvas(1600, 720)
    d.text((110, 150), "Skills for designers who build", fill=TEXT, font=fonts["hero_title"])
    d.text((114, 270), "Bake the brief · preview responsively · lint the design · tune the logos", fill=MUTED, font=fonts["hero_sub"])
    labels = ["bake-the-brief", "responsive-preview", "design-lint", "adjust-logos"]
    x = 114
    for label in labels:
        tw = d.textlength(label, font=fonts["body"])
        d.rounded_rectangle([x, 400, x + tw + 56, 470], radius=35, fill=PANEL, outline=BORDER, width=3)
        d.text((x + 28 + tw / 2, 435), label, fill=TEXT, font=fonts["body"], anchor="mm")
        x += tw + 88
    ghost_lines(d, 114, 540, 1370, 3, gap=40, h=14, widths=[0.9, 0.65, 0.4])
    img.save(path, optimize=True)


def main() -> None:
    ASSETS.mkdir(exist_ok=True)
    fonts = load_fonts()
    save_bake_the_brief(SKILLS / "bake-the-brief/visual.png", fonts)
    save_design_lint(SKILLS / "design-lint/visual.png", fonts)
    save_adjust_logos(SKILLS / "adjust-logos/visual.png", fonts)
    save_responsive_preview(SKILLS / "responsive-preview/visual.png", fonts)
    save_hero(ASSETS / "hero.png", fonts)
    print("Wrote skill visuals.")


if __name__ == "__main__":
    main()
