"""Generates the hand-drawn grain illustrations and injects them into index.html.

Run: python3 tools/build_art.py
Everything is deterministic (fixed seeds), so re-running produces identical output.
"""
import math
import os
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = Path(os.environ.get("ART_TARGET", ROOT / "index.html"))

# ---------------------------------------------------------------- grain symbols
# Each grain is drawn around (0,0) at roughly real-world proportion (1 unit ~ 0.5mm).

DEFS = """
<linearGradient id="gr-rajma" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#b3394a"/><stop offset=".55" stop-color="#7c1d2b"/><stop offset="1" stop-color="#4f0f19"/>
</linearGradient>
<linearGradient id="gr-urad" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#45434a"/><stop offset=".5" stop-color="#1d1c20"/><stop offset="1" stop-color="#0b0b0d"/>
</linearGradient>
<radialGradient id="gr-chana" cx=".38" cy=".35" r=".75">
  <stop offset="0" stop-color="#ecd08f"/><stop offset=".6" stop-color="#d1a55a"/><stop offset="1" stop-color="#a87936"/>
</radialGradient>
<radialGradient id="gr-kabuli" cx=".38" cy=".35" r=".78">
  <stop offset="0" stop-color="#fbf0d4"/><stop offset=".6" stop-color="#ead2a0"/><stop offset="1" stop-color="#c9a468"/>
</radialGradient>
<radialGradient id="gr-toor" cx=".4" cy=".38" r=".7">
  <stop offset="0" stop-color="#fbdc6c"/><stop offset=".7" stop-color="#f0bd34"/><stop offset="1" stop-color="#d3961c"/>
</radialGradient>
<linearGradient id="gr-lobia" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#fbf5e8"/><stop offset=".6" stop-color="#ebdfc6"/><stop offset="1" stop-color="#c9b690"/>
</linearGradient>
<radialGradient id="gr-besan" cx=".45" cy=".4" r=".7">
  <stop offset="0" stop-color="#f8e6ae"/><stop offset=".7" stop-color="#ecd08a"/><stop offset="1" stop-color="#d6b264"/>
</radialGradient>

<radialGradient id="gr-steel" cx=".38" cy=".32" r=".8">
  <stop offset="0" stop-color="#f7f8f9"/><stop offset=".55" stop-color="#d9dde1"/><stop offset="1" stop-color="#a9b0b7"/>
</radialGradient>
<linearGradient id="gr-rim" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#c3c9cf"/><stop offset=".7" stop-color="#eef0f2"/><stop offset="1" stop-color="#8e969e"/>
</linearGradient>
<radialGradient id="gr-bowl-in" cx=".5" cy=".5" r=".5">
  <stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/>
</radialGradient>

<filter id="f-grains" x="-10%" y="-10%" width="120%" height="120%">
  <feDropShadow dx=".5" dy=".9" stdDeviation=".7" flood-color="#2a1a0c" flood-opacity=".38"/>
</filter>
<filter id="f-soft" x="-20%" y="-20%" width="140%" height="140%">
  <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#3b2a17" flood-opacity=".28"/>
</filter>
<filter id="f-bowl" x="-20%" y="-20%" width="140%" height="140%">
  <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" flood-color="#1d232a" flood-opacity=".32"/>
</filter>
<filter id="f-powder" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 .62  0 0 0 0 .47  0 0 0 0 .2  0 0 0 -1.6 1.1" result="spk"/>
  <feComposite in="spk" in2="SourceGraphic" operator="in" result="spk2"/>
  <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="spk2"/></feMerge>
</filter>

<symbol id="g-rajma" overflow="visible">
  <path d="M-11 1C-11-5-6-7-1-6.2C2-5.8 3.5-4.2 5.5-4.8C8.5-5.6 11.5-3.5 11.5.5C11.5 5 7 7 0 7C-6 7-11 5.5-11 1Z" fill="url(#gr-rajma)"/>
  <ellipse cx="-4" cy="-2.6" rx="4.4" ry="1.3" fill="#fff" opacity=".32" transform="rotate(-8 -4 -2.6)"/>
  <ellipse cx="3.4" cy="-4.9" rx="1.5" ry=".55" fill="#ecdcc8" opacity=".85"/>
</symbol>
<symbol id="g-urad" overflow="visible">
  <ellipse rx="4.7" ry="3.4" fill="url(#gr-urad)"/>
  <rect x="-1.9" y="-3.75" width="3.8" height="1.1" rx=".55" fill="#f1ece0"/>
  <ellipse cx="-1.6" cy="-.6" rx="1.8" ry=".7" fill="#fff" opacity=".22"/>
</symbol>
<symbol id="g-chana" overflow="visible">
  <path d="M0-5.2C3.8-5.2 5.6-2.4 5.4.8C5.2 4 2.8 5.6 0 5.6C-3.2 5.6-5.5 3.4-5.5.3C-5.5-2-4.4-3.5-3.4-4.1L-3.9-5.4L-2.3-4.8C-1.5-5.1-.8-5.2 0-5.2Z" fill="url(#gr-chana)"/>
  <path d="M-2.8-3.8C-.6-1 .6 2 .1 5.3" fill="none" stroke="#9a6b2c" stroke-width=".45" opacity=".55"/>
  <circle cx="1.6" cy="-2" r="1" fill="#fff" opacity=".22"/>
</symbol>
<symbol id="g-kabuli" overflow="visible">
  <path d="M0-6.8C5-6.8 7.3-3.2 7.1 1C6.8 5.2 3.7 7.3 0 7.3C-4.2 7.3-7.2 4.4-7.2.4C-7.2-2.6-5.6-4.5-4.4-5.3L-5-6.9L-3-6.3C-2-6.7-1-6.8 0-6.8Z" fill="url(#gr-kabuli)"/>
  <path d="M-3.7-5C-1-1.6.6 2.5.1 7M-5.8-1.8C-3.5.6-2.8 3.5-3 6.1M2.2-6.3C3.4-3.6 4.6-.8 4.7 3.2" fill="none" stroke="#c7a36a" stroke-width=".45" opacity=".4"/>
  <ellipse cx="2" cy="-3" rx="1.8" ry="1.1" fill="#fff" opacity=".35"/>
</symbol>
<symbol id="g-toor" overflow="visible">
  <ellipse rx="4.7" ry="4.2" fill="#d39a1f"/>
  <ellipse rx="3.9" ry="3.4" cx="-.25" cy="-.3" fill="url(#gr-toor)"/>
  <path d="M-4.1 1.6C-3.6 3 -2.4 4 -1 4.3" fill="none" stroke="#b8801a" stroke-width=".5" opacity=".7"/>
  <circle cx="-1.3" cy="-1.5" r=".9" fill="#fff" opacity=".3"/>
</symbol>
<symbol id="g-lobia" overflow="visible">
  <path d="M-6.5.5C-6.5-3.5-3.5-4.6 0-4.4C3.8-4.2 6.5-2.8 6.5.4C6.5 3.6 3.6 4.8 0 4.7C-3.8 4.6-6.5 3.6-6.5.5Z" fill="url(#gr-lobia)"/>
  <ellipse cx=".2" cy="-3.3" rx="2.5" ry="1.25" fill="#17120f"/>
  <ellipse cx=".2" cy="-3.35" rx="1.05" ry=".42" fill="#d9c9a8"/>
  <ellipse cx="-2.8" cy=".6" rx="2.2" ry=".8" fill="#fff" opacity=".45"/>
</symbol>
"""

GRAIN = {
    "rajmash": dict(sym="g-rajma", size=23, spacing=15.5),
    "mash": dict(sym="g-urad", size=9.5, spacing=7.2),
    "chana": dict(sym="g-chana", size=11.5, spacing=8.8),
    "kabuli": dict(sym="g-kabuli", size=15, spacing=11.6),
    "toor": dict(sym="g-toor", size=9, spacing=7.0),
    "lobia": dict(sym="g-lobia", size=13.5, spacing=9.4),
}


SPILL_SCALE = {"rajmash": 1.55, "mash": 2.5, "chana": 2.15, "kabuli": 1.75, "toor": 2.3, "lobia": 2.0}


def fmt(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def use(sym, x, y, rot, sc):
    return f'<use href="#{sym}" transform="translate({fmt(x)} {fmt(y)}) rotate({fmt(rot)}) scale({sc:.2f})"/>'


def scatter_in_circle(rng, cx, cy, r, spacing, attempts=5000):
    pts = []
    for _ in range(attempts):
        a = rng.random() * math.tau
        d = r * math.sqrt(rng.random())
        x, y = cx + d * math.cos(a), cy + d * math.sin(a)
        if all((x - px) ** 2 + (y - py) ** 2 >= spacing ** 2 for px, py in pts):
            pts.append((x, y))
    return pts


def fill_circle(kind, cx, cy, r, seed):
    """Two layers of grains so the bowl looks full, not sprinkled."""
    g = GRAIN[kind]
    rng = random.Random(seed)
    out = []
    for layer, (sp, shade) in enumerate(((g["spacing"] * 1.05, True), (g["spacing"], False))):
        pts = scatter_in_circle(rng, cx, cy, r + g["size"] * 0.25, sp)
        pts.sort(key=lambda p: p[1])
        items = "".join(use(g["sym"], x, y, rng.uniform(0, 360), rng.uniform(0.86, 1.1)) for x, y in pts)
        if shade:
            out.append(f'<g opacity=".92" style="filter:brightness(.72)">{items}</g>')
        else:
            out.append(items)
    return "".join(out)


def bowl(kind, cx, cy, R, seed, key):
    ri = R * 0.84
    clip = f"clip-{key}"
    if kind == "besan":
        contents = (
            f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(ri)}" fill="url(#gr-besan)" filter="url(#f-powder)"/>'
            f'<path d="M{fmt(cx-ri*.45)} {fmt(cy+ri*.05)}c{fmt(ri*.2)} {fmt(-ri*.35)} {fmt(ri*.65)} {fmt(-ri*.4)} {fmt(ri*.9)} {fmt(-ri*.1)}" '
            f'fill="none" stroke="#c9a458" stroke-width="{fmt(ri*.06)}" stroke-linecap="round" opacity=".45"/>'
            f'<ellipse cx="{fmt(cx-ri*.25)}" cy="{fmt(cy-ri*.3)}" rx="{fmt(ri*.35)}" ry="{fmt(ri*.18)}" fill="#fff" opacity=".28"/>'
        )
    else:
        contents = f'<g filter="url(#f-grains)">{fill_circle(kind, cx, cy, ri, seed)}</g>'
    return (
        f'<g class="katori" data-item="{key}" filter="url(#f-bowl)">'
        f'<clipPath id="{clip}"><circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(ri)}"/></clipPath>'
        f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(R)}" fill="url(#gr-rim)"/>'
        f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(R*.93)}" fill="url(#gr-steel)"/>'
        f'<g clip-path="url(#{clip})">{contents}'
        f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(ri)}" fill="url(#gr-bowl-in)"/></g>'
        f'<path d="M{fmt(cx-R*.8)} {fmt(cy-R*.45)}A{fmt(R*.93)} {fmt(R*.93)} 0 0 1 {fmt(cx-R*.15)} {fmt(cy-R*.92)}" '
        f'fill="none" stroke="#fff" stroke-width="{fmt(R*.035)}" stroke-linecap="round" opacity=".9"/>'
        f"</g>"
    )


# order around the thali, clockwise from top; rajmash sits in the centre katori
RING = ["mash", "chana", "toor", "besan", "lobia", "kabuli"]


def thali():
    S = 600
    c = S / 2
    TR = 282
    parts = [
        f'<svg class="thali-art" viewBox="0 0 {S} {S}" role="img" aria-label="A steel thali with seven katoris: rajmash, mash, roosi chana, toor dal, besan, lobia and kabuli chana">',
        f'<g filter="url(#f-soft)"><circle cx="{c}" cy="{c}" r="{TR}" fill="url(#gr-rim)"/>',
        f'<circle cx="{c}" cy="{c}" r="{TR*.94}" fill="url(#gr-steel)"/></g>',
        f'<circle cx="{c}" cy="{c}" r="{TR*.94}" fill="none" stroke="#9aa1a8" stroke-width="1" opacity=".6"/>',
        f'<circle cx="{c}" cy="{c}" r="{TR*.8}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".55"/>',
        f'<path d="M{c-TR*.86} {c-TR*.3}A{TR*.94} {TR*.94} 0 0 1 {c-TR*.25} {c-TR*.9}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/>',
    ]
    ring_r = TR * 0.6
    R = 84
    for i, kind in enumerate(RING):
        a = -math.pi / 2 + i * math.tau / 6
        parts.append(bowl(kind, c + ring_r * math.cos(a), c + ring_r * math.sin(a), R, 100 + i, kind))
    parts.append(bowl("rajmash", c, c, 92, 99, "rajmash"))
    parts.append("</svg>")
    return "".join(parts)


# ------------------------------------------------------------- specimen spills
def spill(kind, seed):
    """A small handful dropped on paper, for each product card."""
    W, H = 320, 200
    rng = random.Random(seed)
    if kind == "besan":
        mound = (
            f'<ellipse cx="160" cy="132" rx="118" ry="30" fill="#000" opacity=".08"/>'
            f'<path d="M48 134C70 88 118 58 160 58C204 58 250 90 272 134C236 150 86 150 48 134Z" fill="url(#gr-besan)" filter="url(#f-powder)"/>'
            f'<path d="M118 76C140 64 176 62 200 74" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".35"/>'
        )
        dust = "".join(
            f'<circle cx="{fmt(rng.gauss(160, 70))}" cy="{fmt(rng.uniform(140, 172))}" r="{fmt(rng.uniform(.6, 1.8))}" fill="#dcbd72" opacity="{rng.uniform(.4, .9):.2f}"/>'
            for _ in range(70)
        )
        body = mound + dust
    else:
        g = GRAIN[kind]
        k = SPILL_SCALE[kind]
        sp = g["spacing"] * k * 0.92
        pts = []
        for _ in range(6000):
            x = rng.gauss(W / 2, W * 0.2)
            y = rng.gauss(H / 2 + 6, H * 0.17)
            if not (18 < x < W - 18 and 16 < y < H - 14):
                continue
            if all((x - px) ** 2 + (y - py) ** 2 >= sp ** 2 for px, py in pts):
                pts.append((x, y))
            if len(pts) >= 26:
                break
        pts.sort(key=lambda p: p[1])
        items = "".join(use(g["sym"], x, y, rng.uniform(0, 360), k * rng.uniform(.88, 1.08)) for x, y in pts)
        body = f'<g filter="url(#f-grains)">{items}</g>'
    return f'<svg class="spill" viewBox="0 0 {W} {H}" aria-hidden="true">{body}</svg>'


def inject(html, name, content):
    pat = re.compile(rf"(<!-- ART:{name} -->).*?(<!-- /ART:{name} -->)", re.S)
    if not pat.search(html):
        raise SystemExit(f"marker ART:{name} missing in index.html")
    return pat.sub(lambda m: m.group(1) + content + m.group(2), html)


def main():
    html = INDEX.read_text()
    html = inject(html, "defs", f'<svg class="art-defs" aria-hidden="true" focusable="false"><defs>{DEFS}</defs></svg>')
    html = inject(html, "thali", thali())
    for i, kind in enumerate(["rajmash", "mash", "chana", "kabuli", "toor", "besan", "lobia"]):
        html = inject(html, f"spill-{kind}", spill(kind, 500 + i))
    INDEX.write_text(html)
    print("art injected:", len(html) // 1024, "KB")


if __name__ == "__main__":
    main()
