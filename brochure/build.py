#!/usr/bin/env python3
"""Studio Galaxy brochure: writes brochure.html and prints it to a vector PDF.

    python3 brochure/build.py

Output: public/projects/flipbook/studio-galaxy-brochure.pdf (A4 portrait, 12 pages).
Same design tokens and font (Geist) as the website. Each page freezes one of the
site's interactions as a print graphic.
"""

import math
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent
HTML = ROOT / "brochure.html"
PDF = ROOT.parent / "public" / "projects" / "flipbook" / "studio-galaxy-brochure.pdf"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

INK, INK2, INK3 = "#242220", "#6f6961", "#a39b91"
CREAM, PAPER = "#f7f0e7", "#fbf7f1"
VIOLET, LAV, LILAC = "#7447ff", "#d8c9ff", "#ebe3ff"
NIGHT, DEEP = "#141217", "#1b1428"
PAGES = 12


def logo(size="9mm"):
    return f"""<svg viewBox="0 0 64 64" style="width:{size};height:{size}"><rect width="64" height="64" rx="16" fill="{INK}"/>
<circle cx="32" cy="32" r="13" fill="none" stroke="{CREAM}" stroke-width="4"/><circle cx="45.5" cy="18.5" r="5.5" fill="#9b7bff"/></svg>"""


def head(chapter, n, dark=False):
    return f"""<div class="head"><span class="label">{chapter}</span><span class="label">{n:02d} / {PAGES:02d}</span></div>"""


def foot(dark=False):
    return f"""<div class="foot"><span class="label">studiogalaxy.org</span><span class="label">Studio Galaxy</span></div>"""


# ---------------------------------------------------------------- process stages (viewBox 400)

def stage_idea():
    return f"""<svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="150" fill="url(#glow)"/>
<circle cx="200" cy="200" r="10" fill="{VIOLET}"/><circle cx="200" cy="200" r="4" fill="#fff"/></svg>"""


def stage_design():
    pts = [(200, 200), (200, 80), (320, 200), (200, 320), (80, 200), (115, 115), (285, 115), (285, 285), (115, 285)]
    nodes = "".join(f'<circle cx="{x}" cy="{y}" r="5" fill="{VIOLET if i == 0 else INK}"/>' for i, (x, y) in enumerate(pts))
    return f"""<svg viewBox="0 0 400 400"><g fill="none" stroke="{INK}" stroke-opacity=".32" stroke-width="1.2">
<circle cx="200" cy="200" r="120"/><circle cx="200" cy="200" r="60" stroke-dasharray="2 5"/>
<rect x="115" y="115" width="170" height="170"/><path d="M200 80 L320 200 L200 320 L80 200 Z"/>
<path d="M60 200 H340 M200 60 V340" stroke-dasharray="2 5"/></g>
<text x="326" y="72" font-size="10" fill="{INK2}" font-family="Geist Mono">r 120</text>{nodes}</svg>"""


ARCH_MODS = [
    ("web", 20, 96, 62), ("ios", 20, 128, 62), ("android", 20, 160, 62), ("gateway", 106, 90, 60, 92),
    ("api", 198, 90, 70), ("auth", 290, 90, 78), ("search", 198, 126, 64), ("agents", 276, 126, 92, 22, "ai"),
    ("jobs", 198, 162, 54), ("notify", 266, 162, 62), ("event bus", 198, 200, 170, 18, "bus"),
    ("postgres", 132, 282, 78), ("cache", 222, 282, 58), ("vector", 292, 282, 76), ("blob", 132, 312, 66),
    ("replica", 222, 312, 72), ("metrics", 20, 290, 76), ("logs", 20, 320, 56),
]
ARCH_ZONES = [("clients", 12, 70, 78, 122), ("services", 186, 64, 196, 164), ("data", 120, 254, 262, 88), ("observe", 12, 264, 92, 86)]
ARCH_WIRES = ["M82 107 H106", "M82 139 H106", "M82 171 H106", "M166 101 H198", "M166 137 H198", "M268 101 H290",
              "M262 112 V119 H300 V126", "M225 184 V200", "M297 184 V200", "M340 148 V200", "M240 218 V240 H171 V282",
              "M251 218 V282", "M368 137 H376 V293 H368", "M190 304 V323 H222", "M120 182 V250 H58 V290", "M76 331 H110 V240 H198 V218"]
ARCH_LIVE = [0, 3, 6, 12, 10]


def stage_engineering():
    z = "".join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{INK}" fill-opacity=".03" stroke="{INK}" stroke-opacity=".22" stroke-dasharray="3 4"/>'
                f'<text x="{x+8}" y="{y-5}" font-size="7.5" fill="{INK3}" font-family="Geist Mono" letter-spacing="1">{n.upper()}</text>' for n, x, y, w, h in ARCH_ZONES)
    wires = "".join(f'<path d="{d}"/>' for d in ARCH_WIRES)
    live = "".join(f'<path d="{ARCH_WIRES[k]}"/>' for k in ARCH_LIVE)
    mods = ""
    for m in ARCH_MODS:
        label, x, y, w = m[:4]
        h = m[4] if len(m) > 4 else 22
        tone = m[5] if len(m) > 5 else None
        fill = LILAC if tone == "ai" else LAV if tone == "bus" else PAPER
        stroke = VIOLET if tone else INK
        dot = VIOLET if tone or label == "api" else INK
        mods += (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7" fill="{fill}" stroke="{stroke}" stroke-opacity="{.5 if tone else .45}"/>'
                 f'<circle cx="{x+9}" cy="{y+11}" r="2.8" fill="{dot}"/>'
                 f'<text x="{x+17}" y="{y+14}" font-size="8.5" fill="{INK}" font-family="Geist Mono">{label}</text>')
    return f"""<svg viewBox="0 0 400 400">{z}<g fill="none" stroke="{INK}" stroke-opacity=".35" stroke-linejoin="round">{wires}</g>
<g fill="none" stroke="{VIOLET}" stroke-width="1.5" stroke-dasharray="4 6" stroke-linejoin="round">{live}</g>{mods}</svg>"""


def stage_intelligence():
    P = {0: (200, 200), 1: (200, 98), 2: (306, 202), 3: (200, 302), 4: (94, 204), 5: (96, 124), 6: (304, 122), 7: (302, 282), 8: (98, 280)}
    IN, MID, OUT = [5, 4, 8], [1, 0, 3], [6, 2, 7]

    def c(a, b):
        (x1, y1), (x2, y2) = P[a], P[b]
        mx = (x1 + x2) / 2
        return f"M{x1} {y1} C{mx} {y1} {mx} {y2} {x2} {y2}"
    links = "".join(f'<path d="{c(a, b)}"/>' for a in IN for b in MID) + "".join(f'<path d="{c(a, b)}"/>' for a in MID for b in OUT)
    hot = "".join(f'<path d="{c(a, b)}"/>' for a, b in [(5, 0), (4, 1), (0, 2), (3, 7), (1, 6)])
    nodes = "".join(f'<circle cx="{x}" cy="{y}" r="{7 if k == 0 else 6}" fill="{VIOLET if k == 0 else INK}"/>' for k, (x, y) in P.items())
    return f"""<svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="60" fill="url(#glow)"/>
<g fill="none" stroke="{INK}" stroke-opacity=".22">{links}</g><g fill="none" stroke="{VIOLET}" stroke-width="1.6" stroke-dasharray="4 6">{hot}</g>{nodes}</svg>"""


def stage_experience():
    return f"""<svg viewBox="0 0 400 400" font-family="Geist">
<rect x="120" y="34" width="160" height="332" rx="30" fill="{NIGHT}"/><rect x="126" y="40" width="148" height="320" rx="25" fill="{PAPER}"/>
<rect x="176" y="47" width="48" height="13" rx="6.5" fill="{NIGHT}"/>
<text x="140" y="57" font-size="7.5" font-weight="600" fill="{INK}">9:41</text>
<text x="140" y="84" font-size="7.5" fill="{INK2}">Good evening,</text>
<text x="140" y="101" font-size="14" font-weight="600" letter-spacing="-.4" fill="{INK}">Your universe</text>
<rect x="136" y="112" width="128" height="94" rx="16" fill="url(#art)"/>
<g fill="none" stroke="#fff" stroke-opacity=".3">{''.join(f'<ellipse cx="226" cy="146" rx="{r}" ry="{r*.4}" transform="rotate(-20 226 146)"/>' for r in (16, 28, 42, 58))}</g>
<circle cx="226" cy="146" r="4" fill="#fff"/>
<text x="146" y="186" font-size="10" font-weight="600" fill="#fff">Launch night</text><text x="146" y="197" font-size="7" fill="#fff" fill-opacity=".7">Tonight · 8 pm</text>
<rect x="136" y="214" width="26" height="16" rx="8" fill="{INK}"/><text x="149" y="224.5" font-size="7" text-anchor="middle" fill="#fff">All</text>
<rect x="166" y="214" width="34" height="16" rx="8" fill="none" stroke="{INK}" stroke-opacity=".15"/><text x="183" y="224.5" font-size="7" text-anchor="middle" fill="{INK}">Saved</text>
<rect x="204" y="214" width="40" height="16" rx="8" fill="none" stroke="{INK}" stroke-opacity=".15"/><text x="224" y="224.5" font-size="7" text-anchor="middle" fill="{INK}">Friends</text>
<circle cx="148" cy="252" r="8.5" fill="{INK}"/><text x="163" y="250" font-size="8" font-weight="600" fill="{INK}">Maya shared this</text><text x="163" y="260" font-size="6.5" fill="{INK3}">2 min ago</text>
<circle cx="148" cy="286" r="8.5" fill="{INK}"/><text x="163" y="284" font-size="8" font-weight="600" fill="{INK}">New chapter unlocked</text><text x="163" y="294" font-size="6.5" fill="{INK3}">Today</text>
<path d="M126 322 H274" stroke="{INK}" stroke-opacity=".08"/>
{''.join(f'<circle cx="{x}" cy="340" r="3.2" fill="{INK}"/>' for x in (152, 184, 216, 248))}
<rect x="146" y="347" width="12" height="2.5" rx="1.25" fill="{VIOLET}"/>
<rect x="226" y="44" width="158" height="40" rx="14" fill="#fff" stroke="{INK}" stroke-opacity=".06"/>
<rect x="236" y="54" width="20" height="20" rx="6" fill="{INK}"/><circle cx="246" cy="64" r="4.5" fill="none" stroke="{CREAM}" stroke-width="1.6"/><circle cx="250.5" cy="59.5" r="2" fill="#9b7bff"/>
<text x="264" y="61" font-size="7" font-weight="600" fill="{INK}">Studio Galaxy</text><text x="264" y="74" font-size="8" fill="{INK}">Your idea is live.</text>
<rect x="20" y="252" width="120" height="70" rx="16" fill="#fff" stroke="{INK}" stroke-opacity=".06"/>
<text x="32" y="268" font-size="7" fill="{INK2}">Moments</text><text x="32" y="282" font-size="11" font-weight="600" fill="{INK}">Growing</text>
<path d="M32 308 C48 306 54 298 66 300 S88 306 98 296 S116 292 126 290" fill="none" stroke="{VIOLET}" stroke-width="1.6" stroke-linecap="round"/>
<circle cx="126" cy="290" r="3" fill="{INK}"/></svg>"""


STAGES = [
    ("Idea", "A single point.", stage_idea),
    ("Design", "The point finds its form.", stage_design),
    ("Engineering", "Form becomes structure.", stage_engineering),
    ("Intelligence", "Structure starts to think.", stage_intelligence),
    ("Experience", "Everything, in someone’s hands.", stage_experience),
]


def stage_row(i):
    word, note, fn = STAGES[i]
    return f"""<div class="stage"><div class="stage-text"><span class="label v">0{i+1}</span>
<p class="d stage-word">{word}</p><p class="label">{note}</p></div><div class="stage-art">{fn()}</div></div>"""


# ---------------------------------------------------------------- capability panels

def panel_design():
    return f"""<svg viewBox="0 0 400 250" font-family="Geist"><rect width="400" height="250" rx="22" fill="{PAPER}"/>
<g stroke="{INK}" stroke-opacity=".05">{''.join(f'<path d="M{x} 0 V250"/>' for x in range(20, 400, 20))}{''.join(f'<path d="M0 {y} H400"/>' for y in range(20, 250, 20))}</g>
<rect x="24" y="24" width="150" height="150" rx="14" fill="#fff" stroke="{INK}" stroke-opacity=".06"/>
<text x="38" y="92" font-size="62" font-weight="600" letter-spacing="-4" fill="{INK}">Aa</text>
<text x="38" y="110" font-size="6.5" fill="{INK2}" font-family="Geist Mono" letter-spacing=".8">GEIST · DISPLAY 600</text>
<path d="M38 122 H160" stroke="{INK}" stroke-opacity=".1"/>
<text x="38" y="138" font-size="14" font-weight="600" letter-spacing="-.6" fill="{INK}">Display</text>
<text x="38" y="153" font-size="10" font-weight="500" fill="{INK}">Title</text><text x="38" y="166" font-size="7" fill="{INK2}">Body — calm, readable, small.</text>
<rect x="206" y="40" width="170" height="130" rx="14" fill="#fff" stroke="{INK}" stroke-opacity=".06"/>
<text x="220" y="66" font-size="9" font-weight="500" fill="{INK}">Notifications</text>
<rect x="334" y="55" width="28" height="15" rx="7.5" fill="{VIOLET}"/><circle cx="354.5" cy="62.5" r="5.5" fill="#fff"/>
<text x="220" y="90" font-size="7" fill="{INK2}">Intensity</text><text x="352" y="90" font-size="7" fill="{INK2}" font-family="Geist Mono">64</text>
<rect x="220" y="97" width="142" height="3" rx="1.5" fill="{CREAM}"/><rect x="220" y="97" width="91" height="3" rx="1.5" fill="{INK}"/><circle cx="311" cy="98.5" r="5" fill="#fff" stroke="{INK}" stroke-opacity=".2"/>
<rect x="220" y="122" width="142" height="26" rx="13" fill="{INK}"/><text x="291" y="138.5" font-size="8.5" font-weight="500" fill="{CREAM}" text-anchor="middle">Continue</text>
<rect x="215" y="117" width="152" height="36" rx="5" fill="none" stroke="{VIOLET}"/>
{''.join(f'<rect x="{x-2.5}" y="{y-2.5}" width="5" height="5" fill="#fff" stroke="{VIOLET}"/>' for x, y in ((215, 117), (367, 117), (215, 153), (367, 153)))}
<rect x="270" y="160" width="42" height="12" rx="3" fill="{VIOLET}"/><text x="291" y="168.5" font-size="6.5" fill="#fff" text-anchor="middle" font-family="Geist Mono">320 × 48</text>
{''.join(f'<circle cx="{40+i*22}" cy="214" r="15" fill="{c}" stroke="{PAPER}" stroke-width="3"/>' for i, c in enumerate([INK, VIOLET, LAV, "#e6dccd"]))}
<path d="M300 196 L314 206 L307.5 207 L304 214 Z" fill="{VIOLET}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>
<rect x="312" y="212" width="38" height="13" rx="6.5" fill="{VIOLET}"/><text x="331" y="221" font-size="7" font-weight="500" fill="#fff" text-anchor="middle">Studio</text></svg>"""


ENG_N = {"web": (150, 70), "ios": (300, 70), "android": (450, 70), "edge": (300, 160), "auth": (140, 250), "api": (300, 250),
         "queue": (460, 250), "db": (200, 350), "cache": (320, 350), "workers": (460, 350)}
ENG_E = [("web", "edge"), ("ios", "edge"), ("android", "edge"), ("edge", "api"), ("api", "auth"), ("api", "queue"),
         ("api", "db"), ("api", "cache"), ("queue", "workers"), ("workers", "cache")]


def panel_engineer():
    def p(a, b):
        (x1, y1), (x2, y2) = ENG_N[a], ENG_N[b]
        if y1 == y2:
            return f"M{x1} {y1} H{x2}"
        my = (y1 + y2) / 2
        return f"M{x1} {y1} C{x1} {my} {x2} {my} {x2} {y2}"
    dots = "".join(f'<circle cx="{x}" cy="{y}" r="1" fill="#fff" fill-opacity=".08"/>' for x in range(15, 600, 18) for y in range(15, 450, 18))
    base = "".join(f'<path d="{p(a, b)}"/>' for a, b in ENG_E)
    live = "".join(f'<path d="{p(*ENG_E[i])}"/>' for i in (0, 3, 5, 6, 8))
    nodes = ""
    for k, (x, y) in ENG_N.items():
        main = k == "api"
        nodes += (f'<g transform="translate({x-46} {y-17})"><rect width="92" height="34" rx="10" fill="{VIOLET if main else "#1f1c24"}" stroke="#fff" stroke-opacity="{0 if main else .12}"/>'
                  f'<circle cx="16" cy="17" r="3" fill="{"#fff" if main else "#b69cff"}"/><text x="28" y="21" font-size="11" fill="#fff" fill-opacity="{1 if main else .82}" font-family="Geist Mono">{k}</text></g>')
    return f"""<svg viewBox="0 0 600 375"><rect width="600" height="375" rx="32" fill="{NIGHT}"/><g transform="translate(0 -25)">{dots}
<g fill="none" stroke="#fff" stroke-opacity=".14">{base}</g><g fill="none" stroke="#b69cff" stroke-width="1.8" stroke-dasharray="3 14" stroke-linecap="round">{live}</g>{nodes}</g>
<text x="36" y="350" font-size="11" fill="#fff" fill-opacity=".45" font-family="Geist Mono">$ ship --production <tspan fill="#b69cff">▍</tspan></text>
<text x="564" y="350" font-size="11" fill="#fff" fill-opacity=".45" text-anchor="end" font-family="Geist Mono"><tspan fill="#b69cff">●</tspan> healthy</text></svg>"""


def panel_create():
    w, h, gap = 400, 250, 13
    fx, fy, sigma = 250, 115, 52
    out = ""
    y = gap / 2
    while y < h:
        x = gap / 2
        while x < w:
            dx, dy = x - fx, y - fy
            f = math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma))
            d = math.hypot(dx, dy) or 1
            px, py = x + dx / d * f * gap * .9, y + dy / d * f * gap * .9
            wave = math.sin(x * .02 + y * .015) * .5 + .5
            r = .9 + wave * .5 + f * 3.2
            a = .22 + wave * .12 + f * .66
            col = "#ffffff" if f > .35 else "#c9b6ff"
            out += f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{r:.2f}" fill="{col}" fill-opacity="{a:.2f}"/>'
            x += gap
        y += gap
    return f"""<svg viewBox="0 0 400 250"><defs><clipPath id="cr"><rect width="400" height="250" rx="22"/></clipPath></defs>
<g clip-path="url(#cr)"><rect width="400" height="250" fill="{DEEP}"/>{out}</g>
<path d="M{fx+18} {fy+10} L{fx+32} {fy+20} L{fx+25.5} {fy+21} L{fx+22} {fy+28} Z" fill="#fff" stroke="{DEEP}" stroke-width="1.2" stroke-linejoin="round"/>
<text x="20" y="234" font-size="7" fill="#fff" fill-opacity=".5" font-family="Geist Mono" letter-spacing="1.2">INTERACTIVE — MOVE ACROSS IT</text></svg>"""


def panel_automate():
    steps = ["Request comes in", "Understand what’s needed", "Draft the work", "Check against the rules", "Done — and filed"]
    rows = ""
    for i, s in enumerate(steps):
        y = 48 + i * 36
        done, now = i < 2, i == 2
        x = 66 if now else 60
        rows += (f'<rect x="{x}" y="{y}" width="280" height="28" rx="10" fill="#fff" fill-opacity="{1 if now else .6}" '
                 f'{"stroke=" + chr(34) + VIOLET + chr(34) + " stroke-opacity=" + chr(34) + ".25" + chr(34) if now else ""}/>')
        cx = x + 16
        if done:
            rows += f'<circle cx="{cx}" cy="{y+14}" r="7" fill="{VIOLET}"/><path d="M{cx-3} {y+14.5} l2.2 2.2 4-4.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
        elif now:
            rows += f'<circle cx="{cx}" cy="{y+14}" r="7" fill="{INK}"/><circle cx="{cx}" cy="{y+14}" r="11" fill="none" stroke="{INK}" stroke-opacity=".2"/>'
        else:
            rows += f'<circle cx="{cx}" cy="{y+14}" r="7" fill="#fff" stroke="{INK}" stroke-opacity=".2"/>'
        rows += f'<text x="{cx+16}" y="{y+17.5}" font-size="9" font-weight="500" fill="{INK}" fill-opacity="{1 if done or now else .45}">{s}</text>'
        if i == 1:
            rows += f'<rect x="{x+228}" y="{y+8}" width="40" height="13" rx="6.5" fill="{LILAC}"/><text x="{x+248}" y="{y+17}" font-size="7" fill="{VIOLET}" text-anchor="middle" font-family="Geist Mono">agent</text>'
    return f"""<svg viewBox="0 0 400 250" font-family="Geist"><rect width="400" height="250" rx="22" fill="{LILAC}"/>
<text x="60" y="34" font-size="7" fill="{INK2}" font-family="Geist Mono" letter-spacing="1.2">WORKFLOW</text>
<text x="340" y="34" font-size="7" fill="{INK2}" font-family="Geist Mono" letter-spacing="1.2" text-anchor="end">RUN #007</text>
<path d="M76 62 V218" stroke="{INK}" stroke-opacity=".15"/>{rows}</svg>"""


def create_block(n, verb, line, art):
    return f"""<div class="create"><p class="label"><span class="dot"></span>{n} <b>{verb}</b></p><p class="d create-line">{line}</p><div class="create-art">{art}</div></div>"""


# ---------------------------------------------------------------- possibilities

def frame_phone():
    bars = "".join(f'<rect x="{62+i*5.2:.1f}" y="{248-(6+((i*37)%70)/70*12)/2:.1f}" width="3" height="{6+((i*37)%70)/70*12:.1f}" rx="1.5" fill="#fff" fill-opacity="{1 if i < 14 else .25}"/>' for i in range(30))
    return f"""<svg viewBox="0 0 280 300" font-family="Geist"><rect x="40" y="6" width="200" height="288" rx="34" fill="#1f1c24" stroke="#fff" stroke-opacity=".12"/>
<rect x="114" y="16" width="52" height="14" rx="7" fill="#000"/>
<text x="140" y="50" font-size="7" fill="#fff" fill-opacity=".45" text-anchor="middle" font-family="Geist Mono" letter-spacing="1.4">NOW PLAYING</text>
<rect x="62" y="62" width="156" height="140" rx="16" fill="url(#art)"/>
<g fill="none" stroke="#fff" stroke-opacity=".35">{''.join(f'<ellipse cx="166" cy="110" rx="{r}" ry="{r*.42:.1f}" transform="rotate(-24 166 110)"/>' for r in (14, 26, 38, 50, 62))}</g>
<circle cx="166" cy="110" r="3.5" fill="#fff"/>
<text x="62" y="224" font-size="12" font-weight="600" fill="#fff" letter-spacing="-.3">Low Orbit</text>
<text x="62" y="235" font-size="7" fill="#fff" fill-opacity=".5">Side A — Night Drive</text>{bars}
<circle cx="140" cy="274" r="13" fill="#fff"/><path d="M136 268 L146 274 L136 280 Z" fill="{NIGHT}"/>
<path d="M98 269 L91 274 L98 279 Z M106 269 L99 274 L106 279 Z M174 269 L181 274 L174 279 Z M182 269 L189 274 L182 279 Z" fill="#fff"/></svg>"""


def frame_web():
    return f"""<svg viewBox="0 0 280 300" font-family="Geist"><g transform="translate(6 56)"><rect width="268" height="188" rx="12" fill="{PAPER}"/>
<path d="M0 22 H268" stroke="{INK}" stroke-opacity=".1"/>{''.join(f'<circle cx="{12+i*8}" cy="11" r="2.4" fill="{INK}" fill-opacity=".15"/>' for i in range(3))}
<rect x="94" y="6" width="80" height="10" rx="5" fill="#efe6da"/><text x="134" y="13.5" font-size="5" fill="{INK2}" text-anchor="middle" font-family="Geist Mono">yourproduct.com</text>
<path d="M66 22 V188" stroke="{INK}" stroke-opacity=".1"/><rect x="10" y="32" width="8" height="8" rx="2" fill="{INK}"/><text x="22" y="39" font-size="6.5" font-weight="600" fill="{INK}">Product</text>
<rect x="8" y="50" width="50" height="12" rx="4" fill="{LILAC}"/><text x="13" y="58.5" font-size="5.5" fill="{VIOLET}">Overview</text>
{''.join(f'<text x="13" y="{74+i*13}" font-size="5.5" fill="{INK2}">{t}</text>' for i, t in enumerate(["Projects", "People", "Insights", "Settings"]))}
<text x="76" y="42" font-size="11" font-weight="600" letter-spacing="-.5" fill="{INK}">Overview</text>
<rect x="210" y="33" width="48" height="12" rx="6" fill="#efe6da"/><rect x="211" y="34" width="23" height="10" rx="5" fill="#fff"/>
<text x="222.5" y="41" font-size="4.8" fill="{INK}" text-anchor="middle">Week</text><text x="246" y="41" font-size="4.8" fill="{INK2}" text-anchor="middle">Month</text>
<rect x="76" y="52" width="182" height="88" rx="9" fill="#fff" stroke="{INK}" stroke-opacity=".08"/>
<text x="84" y="64" font-size="5.5" fill="{INK2}">Activity</text><text x="84" y="76" font-size="10" font-weight="600" fill="{INK}">2,481</text>
<path d="M84 128 C96 124 104 112 116 114 S134 126 146 116 S164 92 178 98 S200 106 214 96 S236 84 250 82 V134 H84 Z" fill="url(#area)"/>
<path d="M84 128 C96 124 104 112 116 114 S134 126 146 116 S164 92 178 98 S200 106 214 96 S236 84 250 82" fill="none" stroke="{VIOLET}" stroke-width="1.6"/>
<circle cx="250" cy="82" r="3" fill="{VIOLET}" stroke="#fff" stroke-width="1.2"/>
{''.join(f'<rect x="{76+i*62}" y="148" width="58" height="30" rx="7" fill="#fff" stroke="{INK}" stroke-opacity=".08"/><text x="{82+i*62}" y="159" font-size="5" fill="{INK2}">{t}</text><rect x="{82+i*62}" y="166" width="46" height="3" rx="1.5" fill="#efe6da"/><rect x="{82+i*62}" y="166" width="{46*v:.0f}" height="3" rx="1.5" fill="{INK}"/>' for i, (t, v) in enumerate([("Projects", .7), ("People", .45), ("Insights", .85)]))}
</g></svg>"""


def frame_flow():
    nodes = [("TRIGGER", "New message", 14, 136), ("AI", "Understand", 100, 136), ("AI", "Summarise", 186, 92), ("ACTION", "Route to team", 186, 180)]
    n = "".join(f'<rect x="{x}" y="{y}" width="78" height="34" rx="8" fill="#1f1c24" stroke="#fff" stroke-opacity=".12"/>'
                f'<text x="{x+8}" y="{y+12}" font-size="5.5" fill="{"#c9b6ff" if k == "AI" else "#ffffff"}" fill-opacity="{1 if k == "AI" else .45}" font-family="Geist Mono" letter-spacing=".8">{k}</text>'
                f'<text x="{x+8}" y="{y+25}" font-size="8" font-weight="500" fill="#fff">{t}</text>' for k, t, x, y in nodes)
    dots = "".join(f'<circle cx="{x}" cy="{y}" r=".8" fill="#fff" fill-opacity=".1"/>' for x in range(12, 268, 12) for y in range(72, 236, 12))
    return f"""<svg viewBox="0 0 280 300" font-family="Geist"><rect x="6" y="56" width="268" height="188" rx="14" fill="{NIGHT}" stroke="#fff" stroke-opacity=".12"/>{dots}
<path d="M6 80 H274" stroke="#fff" stroke-opacity=".1"/><text x="16" y="71" font-size="6" fill="#fff" fill-opacity=".6" font-family="Geist Mono">workflow / inbox</text>
<rect x="232" y="62" width="34" height="12" rx="6" fill="#fff" fill-opacity=".1"/><circle cx="240" cy="68" r="2" fill="{LAV}"/><text x="246" y="70.5" font-size="6" fill="{LAV}" font-family="Geist Mono">live</text>
<g fill="none" stroke="#b69cff" stroke-width="1.4" stroke-dasharray="3 5"><path d="M92 153 H100"/><path d="M178 153 C182 153 182 109 186 109"/><path d="M178 153 C182 153 182 197 186 197"/></g>{n}</svg>"""


def frame_sphere():
    mer = "".join(f'<ellipse cx="140" cy="150" rx="{abs(math.cos(math.radians(a)))*92:.1f}" ry="92" fill="none" stroke="{"#d8c9ff" if a % 60 == 0 else "#ffffff"}" stroke-opacity="{.7 if a % 60 == 0 else .16}"/>' for a in range(0, 180, 15))
    return f"""<svg viewBox="0 0 280 300"><circle cx="140" cy="150" r="128" fill="{DEEP}"/>
<circle cx="140" cy="150" r="40" fill="url(#glowSoft)"/><g transform="rotate(-18 140 150)">{mer}<ellipse cx="140" cy="150" rx="92" ry="22" fill="none" stroke="#fff" stroke-opacity=".22"/></g>
<circle cx="140" cy="150" r="4" fill="#fff"/></svg>"""


POSS = [("A product people remember.", frame_phone), ("An experience that scales.", frame_web),
        ("Technology that works for you.", frame_flow), ("Something people don’t expect.", frame_sphere)]


# ---------------------------------------------------------------- galaxy

CAPS = [("Design", ["Product Design", "UI / UX", "Design Systems", "Motion & Interaction"]),
        ("Engineering", ["Web", "Mobile", "Backend", "Cloud"]),
        ("Intelligence", ["AI", "Automation", "Agents", "Data"]),
        ("Experimentation", ["Creative Technology", "3D", "Interactive Experiences", "Custom Engines"])]


def galaxy_svg():
    W, H, cx, cy, tilt, rot = 500, 330, 250, 165, .42, -.18
    co, si = math.cos(rot), math.sin(rot)

    def proj(ang, rx):
        x, y = math.cos(ang) * rx, math.sin(ang) * rx * tilt
        return cx + x * co - y * si, cy + x * si + y * co, math.sin(ang)
    rings, back, front, labels = "", "", "", ""  # labels go on top of everything
    picked = {"Web", "AI", "Motion & Interaction"}
    for ring, (_, items) in enumerate(CAPS):
        rx = 240 * (.3 + ring * .19)
        rings += f'<ellipse cx="{cx}" cy="{cy}" rx="{rx:.1f}" ry="{rx*tilt:.1f}" transform="rotate({math.degrees(rot):.2f} {cx} {cy})" fill="none" stroke="{INK}" stroke-opacity=".13" {"stroke-dasharray=" + chr(34) + "2 5" + chr(34) if ring == 3 else ""}/>'
        for k, name in enumerate(items):
            ang = k * math.pi / 2 + (.52, .13, 0, .65)[ring]  # offsets chosen so no two labels overlap
            x, y, z = proj(ang, rx)
            r = (4 + ((k + ring) % 3) * 1.4) * (.75 + .35 * (.55 + .45 * (z + 1) / 2))
            hot = name in picked
            g = ""
            if hot:
                g += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r+5:.1f}" fill="none" stroke="{VIOLET}" stroke-opacity=".45"/>'
            g += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{VIOLET if hot else INK}" fill-opacity="{1 if hot else .55 + .45 * (z + 1) / 2:.2f}"/>'
            right = x + 12 + len(name) * 4.8 < W - 4
            tx = x + r + 6 if right else x - r - 6
            labels += (f'<text x="{tx:.1f}" y="{y+3:.1f}" font-size="8" fill="{VIOLET if hot else INK}" fill-opacity="{1 if hot else .55}" '
                       f'font-family="Geist Mono" font-weight="{600 if hot else 400}" text-anchor="{"start" if right else "end"}">{name}</text>')
            if z < 0:
                back += g
            else:
                front += g
    core = (f'<circle cx="{cx}" cy="{cy}" r="70" fill="url(#glowSoft)"/><circle cx="{cx}" cy="{cy}" r="24" fill="{INK}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="11" fill="none" stroke="{CREAM}" stroke-width="3.2"/>'
            f'<circle cx="{cx+10.5}" cy="{cy-10.5}" r="4.2" fill="#9b7bff"/>')
    return f'<svg viewBox="0 0 {W} {H}">{rings}{back}{core}{front}{labels}</svg>'


# ---------------------------------------------------------------- pages

def p_cover():
    return f"""<section class="page cover">
<div class="head"><span class="brand">{logo("8.5mm")}<b>Studio Galaxy</b></span><span class="label">Studio brochure · 2026</span></div>
<svg class="orb" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" fill="url(#glow)"/><circle cx="100" cy="100" r="26" fill="url(#glowSoft)"/>
<circle cx="100" cy="100" r="6" fill="#fff"/><circle cx="100" cy="100" r="9" fill="none" stroke="#9b7bff" stroke-opacity=".7" stroke-width="2"/></svg>
<div class="cover-title push"><p class="label">Studio Galaxy — Development Studio</p>
<h1 class="d">We build things<br/>worth <span class="hl">experiencing.</span></h1></div>
<div class="foot"><span class="cover-sub">Digital products, experiences &amp; intelligent systems.</span><span class="label">Turn the page →</span></div>
</section>"""


def p_point():
    return f"""<section class="page dark">{head("01 — The idea", 2, True)}
<svg class="point" viewBox="0 0 300 300"><circle cx="150" cy="150" r="140" fill="url(#glow)"/><circle cx="150" cy="150" r="5" fill="#fff"/>
<circle cx="150" cy="150" r="10" fill="none" stroke="#9b7bff" stroke-opacity=".5"/></svg>
<div class="point-text push"><p class="d xl">Everything starts<br/>with a point.</p><p class="label" style="margin-top:7mm">An idea is only the beginning.</p></div>
{foot(True)}</section>"""


def p_idea():
    shapes = f"""<svg class="shapes" viewBox="0 0 520 110">
<circle cx="30" cy="55" r="7" fill="{INK}"/>
<rect x="105" y="20" width="38" height="70" rx="10" fill="none" stroke="{INK}" stroke-width="1.5"/>
<rect x="200" y="25" width="96" height="60" rx="8" fill="none" stroke="{INK}" stroke-width="1.5"/>
<circle cx="390" cy="55" r="36" fill="none" stroke="{VIOLET}" stroke-width="1.5" stroke-dasharray="4 4"/>
<circle cx="490" cy="55" r="22" fill="url(#glow)"/><circle cx="490" cy="55" r="7" fill="{VIOLET}"/>
<g stroke="{INK}" stroke-opacity=".25" stroke-dasharray="2 4"><path d="M44 55 H96"/><path d="M152 55 H192"/><path d="M304 55 H346"/><path d="M434 55 H462"/></g></svg>"""
    return f"""<section class="page">{head("01 — The idea", 3)}
<div class="idea"><p class="d xl">You have an idea.</p>
<div class="maybe"><p class="d lg m3">Maybe it’s an app.</p><p class="d lg m3" style="opacity:.75">Maybe it’s a website.</p>
<p class="d lg m3" style="opacity:.55">Maybe it’s something<br/>that doesn’t exist yet.</p></div>{shapes}</div>
<p class="d xl push" style="margin-bottom:8mm">That’s where<br/>we come in<span class="v">.</span></p>{foot()}</section>"""


def p_process(first):
    rows = "".join(stage_row(i) for i in ((0, 1, 2) if first else (3, 4)))
    top = (f'<p class="d lg" style="margin:6mm 0 4mm">From idea<br/>to reality.</p>' if first
           else '<p class="d lg" style="margin:6mm 0 4mm">One continuous<br/>line.</p>')
    tail = "" if first else ('<div class="push" style="margin-bottom:8mm"><p class="d xl">From a single point<br/>to someone’s hands<span class="v">.</span></p>'
                             '<p class="body" style="margin-top:6mm">Every project moves through the same five stages. Nothing is handed over half-finished.</p></div>')
    return f"""<section class="page">{head("02 — From idea to reality", 4 if first else 5)}{top}
<div class="stages {"first" if first else "second"}">{rows}</div>{tail}{foot()}</section>"""


def p_create(first):
    blocks = ([("01", "We design", "Interfaces people want to use.", panel_design()), ("02", "We engineer", "Systems built to actually work.", panel_engineer())]
              if first else
              [("03", "We create", "Experiences that feel alive.", panel_create()), ("04", "We automate", "Work that shouldn’t need to be repeated.", panel_automate())])
    return f"""<section class="page">{head("03 — What we create", 6 if first else 7)}
<div class="creates">{"".join(create_block(*b) for b in blocks)}</div>{foot()}</section>"""


def p_possibilities():
    cells = "".join(f'<div class="poss"><div class="poss-art">{fn()}</div><p class="label l">0{i+1} / 04</p><p class="d poss-line">{t}</p></div>' for i, (t, fn) in enumerate(POSS))
    return f"""<section class="page dark">{head("04 — Possibilities", 8, True)}
<p class="d lg" style="margin:6mm 0 6mm">What could<br/>we build<span class="l">?</span></p><div class="poss-grid">{cells}</div>
<p class="label" style="margin-top:5mm">Concepts, not client work — demonstrations of what’s possible.</p>{foot(True)}</section>"""


def p_how():
    problem = "".join(f'<span style="display:inline-block;transform:translate({dx}em,{dy}em) rotate({rz}deg);color:{c}">{ch}</span>'
                      for ch, dx, dy, rz, c in [("p", 0, 0, 0, INK), ("r", 0, 0, 0, INK), ("o", .02, -.05, -8, INK), ("b", .06, .12, 14, VIOLET),
                                                ("l", .1, -.18, -22, VIOLET), ("e", .16, .2, 28, VIOLET), ("m", .2, -.08, -16, VIOLET)])
    return f"""<section class="page">{head("05 — How we work", 9)}
<p class="d lg" style="margin:6mm 0 0"><span class="m3">Simple outside.</span><br/>Serious inside.</p>
<div class="how">
<p>We start with the <span class="nowrap">{problem}</span>.</p>
<p>We understand the <span class="hl2">experience<svg class="cur" viewBox="0 0 16 20"><path d="M1 1 L15 11 L8.5 12 L5 19 Z" fill="{INK}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></span>.</p>
<p>We design the <span class="frame">system<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i><em>Frame · Auto layout</em></span>.</p>
<p>We build the techno<span class="glyph">l{{0[</span>.</p>
<p>We refine every <span class="kern">de<span class="loupe">ta</span>il</span><span class="v">.</span></p>
</div>
<p class="d xl push" style="margin-bottom:8mm">Until it feels right<span class="v">.</span></p>{foot()}</section>"""


def p_caps():
    rows = "".join(f"""<div class="cap"><div class="cap-name"><span class="label v">0{i+1}</span><p class="d">{g}</p></div>
<ul>{"".join(f"<li>{it}</li>" for it in items)}</ul></div>""" for i, (g, items) in enumerate(CAPS))
    return f"""<section class="page">{head("06 — Capabilities", 10)}
<p class="d lg" style="margin:6mm 0 8mm">Everything<br/>an idea needs.</p><div class="caps">{rows}</div>
<p class="d xl push m3" style="margin-bottom:8mm">One studio, from first<br/>sketch to launch<span class="v">.</span></p>{foot()}</section>"""


def p_galaxy():
    return f"""<section class="page">{head("07 — The galaxy", 11)}
<p class="d lg" style="margin:6mm 0 0">Different ideas.<br/><span class="m3">One universe.</span></p>
<div class="galaxy">{galaxy_svg()}</div>
<div class="name push"><p class="d"><span class="name-word">Studio Galaxy<i></i></span><span class="v">.</span></p>
<p class="label" style="margin-top:5mm">An idea can become an entire universe.</p></div>{foot()}</section>"""


def p_back():
    return f"""<section class="page dark back">
<div class="head"><span class="brand">{logo("8.5mm")}<b style="color:{CREAM}">Studio Galaxy</b></span><span class="label">{PAGES:02d} / {PAGES:02d}</span></div>
<div class="back-cta push"><p class="d xxl">Have an idea?</p><p class="d xxl l">Let’s build it.</p>
<p class="back-sub">Tell us what you’re imagining.<br/>We’ll figure out the rest.</p>
<p class="back-mail">hello@studiogalaxy.org</p></div>
<div class="flipnote"><p class="label l">This brochure is a flipbook</p>
<p>You’ve been turning pages built with our own Flipbook SDK — realistic page curl, two-page spreads, zoom and gestures, right in the browser.
Want one for your catalogue, menu, magazine or report? Ask us.</p></div>
<div class="foot"><span class="label">studiogalaxy.org</span><span class="label">© 2026 Studio Galaxy</span></div></section>"""


# Geist (variable) from the copy Next.js ships, so the build works offline and embeds the real font.
FONT_DIR = ROOT.parent / "node_modules" / "next" / "dist" / "next-devtools" / "server" / "font"
FONTS = "".join(
    f"@font-face {{ font-family: '{fam}'; font-weight: 100 900; src: url('{(FONT_DIR / f).as_uri()}') format('woff2'); }}"
    for fam, f in [("Geist", "geist-latin.woff2"), ("Geist", "geist-latin-ext.woff2"), ("Geist Mono", "geist-mono-latin.woff2"), ("Geist Mono", "geist-mono-latin-ext.woff2")]
)

CSS = f"""
@page {{ size: 210mm 297mm; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ font-family: 'Geist', sans-serif; color: {INK}; font-feature-settings: "ss01", "cv11"; }}
.page {{ width: 210mm; height: 297mm; position: relative; overflow: hidden; background: {CREAM}; padding: 15mm 16mm 13mm;
  display: flex; flex-direction: column; break-after: page; }}
.page:last-child {{ break-after: auto; }}
.dark {{ background: {NIGHT}; color: {CREAM}; }}
.label {{ font-family: 'Geist Mono', monospace; font-size: 6.6pt; letter-spacing: .16em; text-transform: uppercase; color: {INK2}; }}
.dark .label {{ color: rgba(247,240,231,.55); }}
.d {{ font-weight: 600; letter-spacing: -.05em; line-height: .94; }}
.xxl {{ font-size: 64pt; }} .xl {{ font-size: 44pt; }} .lg {{ font-size: 30pt; }}
.v {{ color: {VIOLET}; }} .l {{ color: {LAV} !important; }} .m3 {{ color: {INK3}; }}
.head {{ display: flex; justify-content: space-between; align-items: center; }}
.brand {{ display: flex; align-items: center; gap: 2.5mm; font-size: 11pt; letter-spacing: -.03em; }}
.push {{ margin-top: auto; }}
.push ~ .foot {{ margin-top: 0; }}
.foot {{ margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 4mm; border-top: .25mm solid rgba(36,34,32,.12); }}
.dark .foot {{ border-color: rgba(247,240,231,.14); }}
.body {{ font-size: 9.5pt; line-height: 1.55; color: {INK2}; max-width: 125mm; }}
.nowrap {{ white-space: nowrap; }}

.cover .orb {{ position: absolute; width: 95mm; right: 4mm; top: 34mm; }}
.cover-title {{ margin-top: auto; margin-bottom: 14mm; }}
.cover-title .label {{ margin-bottom: 7mm; }}
.cover h1 {{ font-size: 60pt; }}
.hl {{ background: linear-gradient(transparent 46%, {LAV} 46%, {LAV} 94%, transparent 94%); padding: 0 .04em; }}
.cover-sub {{ font-size: 10pt; color: {INK2}; }}

.point {{ position: absolute; width: 110mm; left: 50%; top: 42%; transform: translate(-50%,-50%); }}
.point-text {{ margin-top: auto; margin-bottom: 10mm; }}

.idea {{ margin-top: 10mm; }}
.maybe {{ margin-top: 9mm; display: flex; flex-direction: column; gap: 3mm; }}
.shapes {{ width: 150mm; margin-top: 12mm; }}

.stages {{ position: relative; display: flex; flex-direction: column; gap: 3mm; }}
.stages::before {{ content: ""; position: absolute; left: 3.4mm; top: 0; bottom: 0; width: .35mm; background: {VIOLET}; opacity: .35; }}
.stages.second::before {{ bottom: 40%; }}
.stage {{ display: grid; grid-template-columns: 62mm 1fr; align-items: center; gap: 4mm; height: 66mm; }}
.stage-text {{ padding-left: 9mm; position: relative; }}
.stage-text::before {{ content: ""; position: absolute; left: 2.2mm; top: 1.2mm; width: 2.8mm; height: 2.8mm; border-radius: 50%; background: {VIOLET}; }}
.stage-word {{ font-size: 24pt; margin: 2mm 0 2.5mm; }}
.stage-art svg {{ width: 66mm; height: 66mm; display: block; margin-left: auto; }}

.creates {{ display: flex; flex-direction: column; gap: 10mm; margin-top: 9mm; }}
.create .label {{ display: flex; align-items: center; gap: 2mm; }}
.create .label b {{ color: {INK}; font-weight: 500; }}
.dot {{ width: 1.6mm; height: 1.6mm; border-radius: 50%; background: {VIOLET}; display: inline-block; }}
.create-line {{ font-size: 24pt; margin: 3mm 0 5mm; }}
.create-art {{ height: 86mm; }}
.create-art svg {{ width: 100%; height: 100%; display: block; }}

.poss-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 8mm; }}
.poss-art {{ background: rgba(247,240,231,.04); border: .25mm solid rgba(247,240,231,.1); border-radius: 5mm; }}
.poss-art svg {{ width: 100%; display: block; }}
.poss .label {{ margin-top: 3.5mm; }}
.poss-line {{ font-size: 13pt; margin-top: 1.5mm; letter-spacing: -.03em; }}

.how {{ margin-top: 16mm; display: flex; flex-direction: column; gap: 10mm; font-size: 25pt; font-weight: 500; letter-spacing: -.04em; line-height: 1.1; }}
.hl2 {{ position: relative; background: linear-gradient(transparent 52%, {LAV} 52%, {LAV} 96%, transparent 96%); }}
.cur {{ position: absolute; width: .32em; right: -.2em; bottom: -.32em; }}
.frame {{ position: relative; outline: .3mm solid {VIOLET}; outline-offset: .05em; }}
.frame .h {{ position: absolute; width: 1.5mm; height: 1.5mm; background: #fff; border: .3mm solid {VIOLET}; }}
.tl {{ left: -.12em; top: -.12em; }} .tr {{ right: -.12em; top: -.12em; }} .bl {{ left: -.12em; bottom: -.12em; }} .br {{ right: -.12em; bottom: -.12em; }}
.frame em {{ position: absolute; left: 50%; top: 100%; margin-top: 2.6mm; transform: translateX(-50%); white-space: nowrap; font-style: normal;
  font-family: 'Geist Mono', monospace; font-size: 5.6pt; letter-spacing: 0; background: {VIOLET}; color: #fff; padding: .5mm 1.4mm; border-radius: .8mm; }}
.glyph {{ font-family: 'Geist Mono', monospace; font-weight: 400; color: {VIOLET}; letter-spacing: 0; }}
.kern {{ letter-spacing: .18em; }}
.loupe {{ position: relative; }}
.loupe::after {{ content: ""; position: absolute; left: -.12em; top: -.08em; width: 1.15em; height: 1.15em; border-radius: 50%;
  border: .55mm solid {VIOLET}; background: rgba(116,71,255,.06); }}

.caps {{ border-bottom: .25mm solid rgba(36,34,32,.12); }}
.cap {{ display: grid; grid-template-columns: 70mm 1fr; gap: 6mm; border-top: .25mm solid rgba(36,34,32,.12); padding: 9mm 0; }}
.cap-name .d {{ font-size: 25pt; margin-top: 2mm; }}
.cap ul {{ list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 5mm; padding-top: 3mm; }}
.cap li {{ font-size: 11.5pt; color: {INK2}; letter-spacing: -.02em; display: flex; align-items: center; gap: 2mm; }}
.cap li::before {{ content: ""; width: 1.2mm; height: 1.2mm; border-radius: 50%; background: {VIOLET}; flex: none; }}

.galaxy {{ margin: 10mm -10mm 0; }}
.galaxy svg {{ width: 100%; display: block; }}
.name {{ margin-top: auto; margin-bottom: 8mm; }}
.name .d {{ font-size: 50pt; letter-spacing: -.055em; display: flex; align-items: flex-end; }}
.name-word {{ position: relative; }}
.name-word i {{ position: absolute; left: 62%; right: 0; bottom: -.06em; height: .5mm; background: {VIOLET}; border-radius: 1mm; }}

.back-cta {{ margin-top: auto; }}
.back-sub {{ font-size: 13pt; color: rgba(247,240,231,.7); margin-top: 10mm; line-height: 1.35; letter-spacing: -.02em; }}
.back-mail {{ font-size: 15pt; font-weight: 500; margin-top: 7mm; letter-spacing: -.02em; }}
.flipnote {{ margin: 16mm 0 10mm; border: .25mm solid rgba(247,240,231,.16); border-radius: 5mm; padding: 6mm 7mm; }}
.flipnote p:last-child {{ font-size: 9.5pt; line-height: 1.55; color: rgba(247,240,231,.72); margin-top: 3mm; max-width: 135mm; }}
"""

DEFS = f"""<svg width="0" height="0" style="position:absolute"><defs>
<radialGradient id="glow"><stop offset="0" stop-color="{VIOLET}" stop-opacity=".38"/><stop offset=".45" stop-color="{VIOLET}" stop-opacity=".1"/><stop offset="1" stop-color="{VIOLET}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowSoft"><stop offset="0" stop-color="#9b7bff" stop-opacity=".55"/><stop offset="1" stop-color="#9b7bff" stop-opacity="0"/></radialGradient>
<radialGradient id="art" cx=".66" cy=".36" r=".9"><stop offset="0" stop-color="{LAV}"/><stop offset=".35" stop-color="{VIOLET}"/><stop offset="1" stop-color="{DEEP}"/></radialGradient>
<linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="{VIOLET}" stop-opacity=".25"/><stop offset="1" stop-color="{VIOLET}" stop-opacity="0"/></linearGradient>
</defs></svg>"""


def build():
    pages = [p_cover(), p_point(), p_idea(), p_process(True), p_process(False), p_create(True), p_create(False),
             p_possibilities(), p_how(), p_caps(), p_galaxy(), p_back()]
    assert len(pages) == PAGES
    html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Studio Galaxy — Brochure</title>
<style>{FONTS}{CSS}</style></head><body>{DEFS}{"".join(pages)}</body></html>"""
    HTML.write_text(html, encoding="utf-8")
    PDF.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=15000",
                    "--run-all-compositor-stages-before-draw", f"--print-to-pdf={PDF}", HTML.as_uri()],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"wrote {PDF.relative_to(ROOT.parent)} ({PDF.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    build()
