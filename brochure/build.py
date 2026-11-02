#!/usr/bin/env python3
"""Studio Galaxy field guide: writes brochure.html and prints it to a vector PDF.

    python3 brochure/build.py

Output: public/projects/flipbook/studio-galaxy-brochure.pdf (A4 portrait, 12 pages).
Same brand as the website (Geist, cream / ink / violet, the "point" motif), but its
own content and print-native layouts: what we do, how a project runs, how to start.
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
NIGHT = "#141217"
PAGES = 12
EMAIL, DOMAIN = "hello@studiogalaxy.org", "studiogalaxy.org"


def logo(size="9mm", dark=False):
    return f"""<svg viewBox="0 0 64 64" style="width:{size};height:{size}"><rect width="64" height="64" rx="16" fill="{"#2a2730" if dark else INK}"/>
<circle cx="32" cy="32" r="13" fill="none" stroke="{CREAM}" stroke-width="4"/><circle cx="45.5" cy="18.5" r="5.5" fill="#9b7bff"/></svg>"""


def head(section, n):
    return f'<div class="head"><span class="label">{section}</span><span class="label">{n:02d}</span></div>'


def foot():
    return f'<div class="foot"><span class="label">Studio Galaxy — Field guide</span><span class="label">{DOMAIN}</span></div>'


# ---------------------------------------------------------------- graphics (new, print-only)

GROUPS = [["Product Design", "UI / UX", "Design Systems", "Motion & Interaction"],
          ["Web", "Mobile", "Backend", "Cloud"],
          ["AI", "Automation", "Agents", "Data"],
          ["Creative Technology", "3D", "Interactive Experiences", "Custom Engines"]]


def galaxy(picked=("Web", "AI"), show_labels=True):
    """Cover: a still frame of the website's planet picker (components/galaxy/Universe.tsx) —
    same tilt, rotation, orbit radii, planet sizes and logo core."""
    W, H, cx, cy, tilt, rot = 500, 300, 250, 150, .4, -.18
    base = min(W * .47, H * 1.05)
    co, si = math.cos(rot), math.sin(rot)
    offsets = (.52, .13, 0, .65)  # orbit positions chosen so no two labels overlap

    def proj(ang, rx):
        x, y = math.cos(ang) * rx, math.sin(ang) * rx * tilt
        return cx + x * co - y * si, cy + x * si + y * co, math.sin(ang)

    rings = back = front = labels = ""
    for ring, items in enumerate(GROUPS):
        rx = base * (.3 + ring * .19)
        dash = ' stroke-dasharray="2 5"' if ring == 3 else ""
        rings += f'<ellipse cx="{cx}" cy="{cy}" rx="{rx:.1f}" ry="{rx*tilt:.1f}" transform="rotate({math.degrees(rot):.2f} {cx} {cy})" fill="none" stroke="{INK}" stroke-opacity=".13"{dash}/>'
        for k, name in enumerate(items):
            x, y, z = proj(k * math.pi / 2 + offsets[ring], rx)
            depth = .55 + .45 * (z + 1) / 2
            r = (4 + ((k + ring) % 3) * 1.4) * (.75 + .35 * depth)
            hot = name in picked
            g = (f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r+5:.1f}" fill="none" stroke="{VIOLET}" stroke-opacity=".45"/>' if hot else "")
            g += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{VIOLET if hot else INK}" fill-opacity="{1 if hot else depth:.2f}"/>'
            if z < 0:
                back += g
            else:
                front += g
            right = x + r + 7 + len(name) * 4.6 < W - 4
            labels += (f'<text x="{(x + r + 7) if right else (x - r - 7):.1f}" y="{y+3:.1f}" font-size="8" font-family="Geist Mono" '
                       f'text-anchor="{"start" if right else "end"}" fill="{VIOLET if hot else INK}" fill-opacity="{1 if hot else .45 * depth + .1:.2f}" '
                       f'font-weight="{600 if hot else 400}">{name}</text>')
    core, dot = 24, math.radians(-45)
    centre = (f'<circle cx="{cx}" cy="{cy}" r="{core*3.2}" fill="url(#core)"/>'
              f'<circle cx="{cx}" cy="{cy}" r="{core}" fill="{INK}"/>'
              f'<circle cx="{cx}" cy="{cy}" r="{core*.45}" fill="none" stroke="{CREAM}" stroke-width="{max(2.5, core*.13):.1f}"/>'
              f'<circle cx="{cx + math.cos(dot)*core*.62:.1f}" cy="{cy + math.sin(dot)*core*.62:.1f}" r="{core*.17:.1f}" fill="#9b7bff"/>')
    return f'<svg viewBox="0 0 {W} {H}">{rings}{back}{centre}{front}{labels if show_labels else ""}</svg>'


def glyph(kind):
    """One small geometric mark per discipline."""
    s = f'stroke="{INK}" stroke-width="1.4" fill="none"'
    v = f'fill="{VIOLET}"'
    marks = {
        "design": f'<circle cx="40" cy="40" r="26" {s}/><rect x="21.6" y="21.6" width="36.8" height="36.8" {s}/><circle cx="40" cy="40" r="4" {v}/>',
        "engineering": "".join(f'<rect x="{12+c*20}" y="{12+r*20}" width="15" height="15" rx="3" {s if (r, c) != (1, 1) else v}/>' for r in range(3) for c in range(3)),
        "intelligence": (f'<path d="M14 22 L40 40 L14 58 M66 22 L40 40 L66 58 M14 22 L66 22 M14 58 L66 58" {s} stroke-opacity=".5"/>'
                         + "".join(f'<circle cx="{x}" cy="{y}" r="4.5" fill="{INK}"/>' for x, y in [(14, 22), (14, 58), (66, 22), (66, 58)])
                         + f'<circle cx="40" cy="40" r="6" {v}/>'),
        "experimentation": (f'<ellipse cx="40" cy="40" rx="30" ry="12" {s} transform="rotate(-24 40 40)"/>'
                            f'<ellipse cx="40" cy="40" rx="30" ry="12" {s} stroke-opacity=".4" transform="rotate(36 40 40)"/>'
                            f'<circle cx="40" cy="40" r="5" {v}/><circle cx="65" cy="27" r="3.4" fill="{INK}"/>'),
    }
    return f'<svg viewBox="0 0 80 80" class="glyph">{marks[kind]}</svg>'


def book_curl():
    """A spread with its right page lifting: the Flipbook SDK, drawn."""
    return f"""<svg viewBox="0 0 420 270">
<ellipse cx="210" cy="252" rx="190" ry="10" fill="{INK}" fill-opacity=".08"/>
<rect x="20" y="20" width="185" height="230" rx="3" fill="{PAPER}" stroke="{INK}" stroke-opacity=".15"/>
<rect x="215" y="20" width="185" height="230" rx="3" fill="#ece3d6" stroke="{INK}" stroke-opacity=".12"/>
<path d="M205 20 V250" stroke="{INK}" stroke-opacity=".18"/>
{''.join(f'<rect x="40" y="{60+i*16}" width="{[120, 140, 96, 130, 110, 84][i]}" height="5" rx="2.5" fill="{INK}" fill-opacity="{.75 if i == 0 else .14}"/>' for i in range(6))}
<rect x="40" y="36" width="60" height="10" rx="5" fill="{INK}"/>
<path d="M215 20 H400 V172 C356 186 312 222 296 250 H215 Z" fill="{PAPER}" stroke="{INK}" stroke-opacity=".15"/>
<path d="M400 172 C356 186 312 222 296 250 C334 238 372 214 400 172 Z" fill="#ddd2c3"/>
<path d="M400 172 C356 186 312 222 296 250" fill="none" stroke="{INK}" stroke-opacity=".2"/>
{''.join(f'<rect x="235" y="{60+i*16}" width="{[118, 136, 90, 120][i]}" height="5" rx="2.5" fill="{INK}" fill-opacity=".14"/>' for i in range(4))}
<circle cx="356" cy="200" r="16" fill="url(#glow)"/><circle cx="356" cy="200" r="4" fill="{VIOLET}"/>
<path d="M352 206 L366 216 L359.5 217 L356 224 Z" fill="{INK}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round" transform="translate(6 2)"/>
</svg>"""


# ---------------------------------------------------------------- content

DISCIPLINES = [
    ("01", "design", "Design", "Interfaces people want to use.",
     ["Product strategy & research", "UX flows & wireframes", "Interface design", "Design systems", "Motion & interaction"],
     ["Clickable prototypes", "A complete design system", "Production-ready files"]),
    ("02", "engineering", "Engineering", "Systems built to actually work.",
     ["Websites & web apps", "iOS & Android apps", "Backends & APIs", "Cloud & infrastructure"],
     ["Clean, documented code", "Automated tests & deploys", "A product built to grow"]),
    ("03", "intelligence", "Intelligence", "Technology that does the work.",
     ["AI features in your product", "Workflow automation", "AI agents", "Data pipelines & dashboards"],
     ["Less repetitive work", "Assistants that know your business", "Decisions backed by data"]),
    ("04", "experimentation", "Experimentation", "Things people don’t expect.",
     ["Interactive websites", "3D & WebGL", "Creative technology", "Custom engines & SDKs"],
     ["Experiences people share", "Tools nobody else has"]),
]

STEPS = [
    ("Conversation", "You tell us the idea. We ask a lot of questions. No commitment, no pitch deck needed."),
    ("Discovery", "We map the problem, the people and the risks — then agree on scope, plan and budget."),
    ("Design", "Flows, prototypes and the look and feel, tested before a single feature is built."),
    ("Build", "We work in short cycles and show you working software as we go."),
    ("Launch", "We ship it, watch how it’s used and fix what needs fixing."),
    ("Grow", "Support, improvements and new features — for as long as you need us."),
]

MODELS = [
    ("Build a product", "From idea to launch. We design, build and ship it with you.", "You’re starting something new."),
    ("Join your team", "Our designers and engineers work inside your team, your tools, your rhythm.", "You have a product and need more hands."),
    ("Prototype an idea", "A short, focused sprint to make an idea real enough to test.", "You want proof before you commit."),
]

PROMISES = [
    ("You talk to the people building it.", "No account managers in between."),
    ("Honest estimates.", "And early warnings if anything changes."),
    ("Progress you can see.", "Working software as we go, not only at the end."),
    ("Work anyone can pick up.", "Clean, documented, handed over properly."),
    ("When it’s paid for, it’s yours.", "Code, designs and everything in between."),
    ("Details nobody asked for.", "Because that’s where products feel finished."),
]

FAQ = [
    ("What does a project cost?", "It depends on scope. After the first conversation you get a clear estimate — no surprises later."),
    ("How long does it take?", "A prototype takes weeks; a full product takes months. You get a real timeline after discovery."),
    ("Do I need a detailed brief?", "No. An idea and a few sentences are enough to start."),
    ("Can you work with what we have?", "Yes — an existing codebase, design system or team. Or we start fresh."),
    ("Will you sign an NDA?", "Of course. Your idea stays yours."),
    ("What happens after launch?", "We stay on for support and new features, if you want us to."),
]

BRIEF = ["The idea, in your own words", "Who it’s for", "What exists already", "When you’d like it", "A rough budget, if you have one"]

CONTENTS = [("Who we are", 3), ("What we do", 4), ("How a project runs", 6), ("Working together", 7),
            ("What to expect", 8), ("Made in the studio", 9), ("Questions", 10), ("Start a project", 11)]


# ---------------------------------------------------------------- pages

def p_cover():
    return f"""<section class="page dark cover">
<div class="head"><span class="label">Field guide</span><span class="label">2026</span></div>
<div class="cover-centre">
<svg class="cover-glow" viewBox="0 0 300 300"><circle cx="150" cy="150" r="148" fill="url(#glow)"/></svg>
{logo("30mm", dark=True)}
<h1 class="d cover-name">Studio Galaxy<span class="l">.</span></h1>
<p class="label" style="margin-top:7mm">A field guide to working with us</p>
</div>
<div class="foot"><span class="label">Digital products · Experiences · Intelligent systems</span><span class="label">{DOMAIN}</span></div></section>"""


def p_contents():
    rows = "".join(f"""<li><span class="label v">{i+1:02d}</span><span class="toc-t">{t}</span><span class="toc-dots"></span><span class="label">{p:02d}</span></li>"""
                   for i, (t, p) in enumerate(CONTENTS))
    return f"""<section class="page">{head("Contents", 2)}
<p class="d lg" style="margin-top:10mm">Inside.</p>
<p class="body" style="margin-top:6mm">This guide is for anyone thinking about building something with us — what we do, how we work, and how to start.</p>
<ol class="toc">{rows}</ol>
<div class="contents-map">{galaxy(show_labels=False)}</div>
{foot()}</section>"""


def p_who():
    beliefs = [("Design and engineering in one room.", "Decisions don’t get lost between teams, and what we design is what ships."),
               ("Simple outside, serious inside.", "Calm interfaces on top of systems that hold up."),
               ("Fewer things, built properly.", "We’d rather do your project well than do many at once.")]
    cols = "".join(f'<div><p class="label l">{i+1:02d}</p><p class="belief">{t}</p><p class="small">{d}</p></div>' for i, (t, d) in enumerate(beliefs))
    return f"""<section class="page dark">{head("01 — Who we are", 3)}
<svg class="who-line" viewBox="0 0 520 60"><path d="M0 30 H440" stroke="{CREAM}" stroke-opacity=".18"/>
<circle cx="470" cy="30" r="26" fill="url(#glow)"/><circle cx="470" cy="30" r="5" fill="#fff"/></svg>
<p class="manifesto">We’re Studio Galaxy — a development studio of designers and engineers who build digital products from the first sketch to the last line of code.</p>
<p class="manifesto-2">We work with founders, start-ups and companies who want something better than the default: products that are calm to use, solid underneath, and unmistakably theirs.</p>
<div class="push beliefs">{cols}</div>
{foot()}</section>"""


def discipline(n, kind, name, line, do, get):
    return f"""<article class="disc"><div class="disc-head"><span class="num">{n}</span>{glyph(kind)}</div>
<p class="d disc-name">{name}</p><p class="disc-line">{line}</p>
<div class="disc-cols"><div><p class="label">What we do</p><ul>{"".join(f"<li>{x}</li>" for x in do)}</ul></div>
<div><p class="label">What you get</p><ul class="get">{"".join(f"<li>{x}</li>" for x in get)}</ul></div></div></article>"""


def p_what(first):
    items = DISCIPLINES[:2] if first else DISCIPLINES[2:]
    title = '<p class="d lg" style="margin:8mm 0 2mm">Four disciplines,<br/>one team.</p>' if first else '<div style="height:8mm"></div>'
    return f"""<section class="page">{head("02 — What we do", 4 if first else 5)}{title}
<div class="discs">{"".join(discipline(*d) for d in items)}</div>{foot()}</section>"""


def p_process():
    steps = "".join(f"""<li><span class="node {"on" if i == 0 else ""}"></span><div><p class="label v">{i+1:02d}</p>
<p class="d step-t">{t}</p><p class="small">{d}</p></div></li>""" for i, (t, d) in enumerate(STEPS))
    return f"""<section class="page">{head("03 — How a project runs", 6)}
<p class="d lg" style="margin:8mm 0 10mm">From first call<br/>to launch — and after.</p>
<ol class="timeline">{steps}</ol>
<p class="note push">At every step, you talk to the people doing the work.</p>{foot()}</section>"""


def p_models():
    cards = "".join(f"""<div class="model"><p class="label v">{i+1:02d}</p><p class="d model-t">{t}</p><p class="small">{d}</p>
<p class="best"><span class="label">Best when</span>{b}</p></div>""" for i, (t, d, b) in enumerate(MODELS))
    return f"""<section class="page">{head("04 — Working together", 7)}
<p class="d lg" style="margin:8mm 0 10mm">Pick the shape<br/>that fits.</p>
<div class="models">{cards}</div>
<p class="d xl push m3" style="margin-bottom:8mm">Not sure which?<br/><span style="color:{INK}">That’s what the first<br/>conversation is for.</span></p>{foot()}</section>"""


def p_promises():
    rows = "".join(f'<div class="promise"><span class="label l">{i+1:02d}</span><p class="promise-t">{t}</p><p class="small">{d}</p></div>'
                   for i, (t, d) in enumerate(PROMISES))
    return f"""<section class="page dark">{head("05 — What to expect", 8)}
<p class="d lg" style="margin:8mm 0 12mm">Our promises,<br/><span class="l">in writing.</span></p>
<div class="promises">{rows}</div>{foot()}</section>"""


def p_sdk():
    feats = ["Real page curl, with soft paper shadows", "Two-page spreads on wide screens, one page on phones",
             "Pinch, double-tap and trackpad zoom", "Drag, flick and corner-lift gestures", "An optional page-turn sound",
             "On the web and in Flutter apps"]
    return f"""<section class="page">{head("06 — Made in the studio", 9)}
<p class="d lg" style="margin:8mm 0 4mm">You’re holding one<br/>of our products.</p>
<div class="curl">{book_curl()}</div>
<div class="sdk-cols"><p class="body" style="max-width:none">This guide is a flipbook — built with the Studio Galaxy Flipbook SDK, our own engine for turning PDFs into books people enjoy opening. We can put it behind your catalogue, magazine, menu or report.</p>
<ul class="feats">{"".join(f"<li>{f}</li>" for f in feats)}</ul></div>
<p class="d xl push m3" style="margin-bottom:8mm">Want one for your brand?<br/><span style="color:{INK}">Ask us<span class="v">.</span></span></p>{foot()}</section>"""


def p_faq():
    qa = "".join(f'<div class="qa"><p class="q">{q}</p><p class="small">{a}</p></div>' for q, a in FAQ)
    return f"""<section class="page">{head("07 — Questions", 10)}
<p class="d lg" style="margin:8mm 0 12mm">The things people<br/>usually ask.</p>
<div class="faq">{qa}</div>
<p class="d xl push m3" style="margin-bottom:8mm">Something else?<br/><span style="color:{INK}">Just ask<span class="v">.</span></span></p>{foot()}</section>"""


def p_start():
    items = "".join(f'<li><span class="box"></span>{b}</li>' for b in BRIEF)
    return f"""<section class="page">{head("08 — Start a project", 11)}
<p class="d lg" style="margin:8mm 0 10mm">Starting<br/>is simple.</p>
<p class="label" style="margin-bottom:5mm">Send us a few lines about</p><ul class="brief">{items}</ul>
<div class="push start-mail"><p class="small" style="max-width:110mm">We’ll reply within a few days and set up a call. That’s it.</p>
<p class="d mail">{EMAIL}</p></div>{foot()}</section>"""


def p_back():
    return f"""<section class="page dark back">
<div class="head"><span class="brand">{logo("8.5mm", dark=True)}<b style="color:{CREAM}">Studio Galaxy</b></span><span class="label">{DOMAIN}</span></div>
<svg class="back-point" viewBox="0 0 300 300"><circle cx="150" cy="150" r="140" fill="url(#glow)"/><circle cx="150" cy="150" r="5" fill="#fff"/></svg>
<div class="push"><p class="d xxl">Let’s build<br/>something worth<br/><span class="l">experiencing.</span></p>
<p class="d mail" style="margin-top:12mm;color:{CREAM}">{EMAIL}</p></div>
<div class="foot"><span class="label">© 2026 Studio Galaxy</span><span class="label">This guide is a flipbook made with our Flipbook SDK</span></div></section>"""


# ---------------------------------------------------------------- styles

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
/* the covers stand alone against the reader's dark room, so they get their own lifted, violet-tinted shade */
.cover, .back {{ background: #1e1b27; }}
.label {{ font-family: 'Geist Mono', monospace; font-size: 6.6pt; letter-spacing: .16em; text-transform: uppercase; color: {INK2}; }}
.dark .label {{ color: rgba(247,240,231,.55); }}
.d {{ font-weight: 600; letter-spacing: -.05em; line-height: .94; }}
.huge {{ font-size: 92pt; letter-spacing: -.06em; line-height: .86; }}
.xxl {{ font-size: 54pt; }} .xl {{ font-size: 34pt; }} .lg {{ font-size: 32pt; }}
.v {{ color: {VIOLET}; }} .l {{ color: {LAV} !important; }} .m3 {{ color: {INK3}; }}
.head {{ display: flex; justify-content: space-between; align-items: center; }}
.brand {{ display: flex; align-items: center; gap: 2.5mm; font-size: 11pt; letter-spacing: -.03em; }}
.push {{ margin-top: auto; }}
.push ~ .foot {{ margin-top: 0; }}
.foot {{ margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 4mm; border-top: .25mm solid rgba(36,34,32,.12); }}
.dark .foot {{ border-color: rgba(247,240,231,.14); }}
.push + .foot, .push ~ .foot {{ margin-top: 10mm; }}
.body {{ font-size: 10pt; line-height: 1.55; color: {INK2}; max-width: 120mm; }}
.small {{ font-size: 8.8pt; line-height: 1.5; color: {INK2}; margin-top: 1.5mm; }}
.dark .small {{ color: rgba(247,240,231,.62); }}

.cover-centre {{ margin: auto 0; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }}
.cover-glow {{ position: absolute; width: 120mm; top: -30mm; left: 50%; transform: translateX(-50%); }}
.cover-centre > svg:not(.cover-glow) {{ position: relative; }}
.cover-name {{ font-size: 60pt; margin-top: 14mm; position: relative; }}

.toc {{ list-style: none; margin-top: 10mm; border-top: .25mm solid rgba(36,34,32,.12); }}
.toc li {{ display: flex; align-items: baseline; gap: 4mm; padding: 3.6mm 0; border-bottom: .25mm solid rgba(36,34,32,.12); }}
.toc-t {{ font-size: 17pt; font-weight: 600; letter-spacing: -.04em; }}
.toc-dots {{ flex: 1; border-bottom: .35mm dotted rgba(36,34,32,.25); transform: translateY(-1mm); }}
.contents-map {{ flex: 1; display: flex; align-items: center; justify-content: center; }}
.contents-map svg {{ width: 100%; height: 70mm; display: block; }}

.who-line {{ width: 100%; margin-top: 14mm; }}
.manifesto-2 {{ font-size: 13pt; line-height: 1.5; color: rgba(247,240,231,.62); margin-top: 10mm; max-width: 140mm; letter-spacing: -.01em; }}
.manifesto {{ font-size: 34pt; font-weight: 500; letter-spacing: -.04em; line-height: 1.1; margin-top: 10mm; }}
.beliefs {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 7mm; border-top: .25mm solid rgba(247,240,231,.14); padding-top: 7mm; }}
.belief {{ font-size: 12.5pt; font-weight: 600; letter-spacing: -.02em; line-height: 1.2; margin-top: 3mm; }}

.discs {{ display: flex; flex-direction: column; gap: 6mm; margin-top: 6mm; }}
.disc {{ border-top: .25mm solid rgba(36,34,32,.12); padding-top: 6mm; }}
.disc-head {{ display: flex; justify-content: space-between; align-items: flex-start; }}
.num {{ font-size: 44pt; font-weight: 600; letter-spacing: -.05em; line-height: .8; color: {LAV}; }}
.glyph {{ width: 22mm; height: 22mm; }}
.disc-name {{ font-size: 30pt; margin-top: 4mm; }}
.disc-line {{ font-size: 12pt; color: {INK2}; margin-top: 2mm; letter-spacing: -.02em; }}
.disc-cols {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 6mm; }}
.disc-cols ul {{ list-style: none; margin-top: 3mm; display: flex; flex-direction: column; gap: 1.8mm; }}
.disc-cols li {{ font-size: 10pt; color: {INK}; letter-spacing: -.01em; padding-left: 4mm; position: relative; }}
.disc-cols li::before {{ content: ""; position: absolute; left: 0; top: .55em; width: 1.4mm; height: 1.4mm; border-radius: 50%; background: rgba(36,34,32,.3); }}
.disc-cols .get li::before {{ background: {VIOLET}; }}

.timeline {{ list-style: none; position: relative; display: flex; flex-direction: column; gap: 9mm; }}
.timeline::before {{ content: ""; position: absolute; left: 2.2mm; top: 2mm; bottom: 2mm; width: .3mm; background: rgba(36,34,32,.18); }}
.timeline li {{ display: grid; grid-template-columns: 9mm 1fr; }}
.node {{ width: 4.6mm; height: 4.6mm; border-radius: 50%; background: {CREAM}; border: .35mm solid {INK}; position: relative; z-index: 1; margin-top: .6mm; }}
.node.on {{ background: {VIOLET}; border-color: {VIOLET}; box-shadow: 0 0 0 2mm rgba(116,71,255,.15); }}
.step-t {{ font-size: 21pt; margin-top: 1.5mm; letter-spacing: -.04em; }}
.timeline .small {{ max-width: 125mm; font-size: 9.8pt; }}
.note {{ font-size: 12pt; font-weight: 500; letter-spacing: -.02em; border-top: .25mm solid rgba(36,34,32,.12); padding-top: 5mm; }}

.models {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }}
.model {{ background: {PAPER}; border: .25mm solid rgba(36,34,32,.1); border-radius: 4mm; padding: 6mm 5mm; display: flex; flex-direction: column; min-height: 118mm; }}
.model-t {{ font-size: 19pt; margin-top: 4mm; letter-spacing: -.04em; }}
.best {{ margin-top: auto; padding-top: 4mm; border-top: .25mm solid rgba(36,34,32,.1); font-size: 9pt; color: {INK}; line-height: 1.45; display: flex; flex-direction: column; gap: 1.5mm; }}

.promises {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0 10mm; border-top: .25mm solid rgba(247,240,231,.14); }}
.promise {{ padding: 11mm 0; border-bottom: .25mm solid rgba(247,240,231,.14); }}
.promise-t {{ font-size: 18pt; font-weight: 600; letter-spacing: -.035em; line-height: 1.15; margin-top: 3mm; }}

.curl {{ margin: 2mm -2mm 0; }}
.curl svg {{ width: 100%; display: block; }}
.sdk-cols {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 6mm; }}
.feats {{ list-style: none; display: flex; flex-direction: column; gap: 2mm; }}
.feats li {{ font-size: 9.5pt; padding-left: 4mm; position: relative; }}
.feats li::before {{ content: ""; position: absolute; left: 0; top: .55em; width: 1.4mm; height: 1.4mm; border-radius: 50%; background: {VIOLET}; }}

.faq {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0 10mm; border-top: .25mm solid rgba(36,34,32,.12); }}
.qa {{ padding: 11mm 0; border-bottom: .25mm solid rgba(36,34,32,.12); }}
.q {{ font-size: 15.5pt; font-weight: 600; letter-spacing: -.03em; line-height: 1.2; }}

.brief {{ list-style: none; border-top: .25mm solid rgba(36,34,32,.12); }}
.brief li {{ display: flex; align-items: center; gap: 4mm; font-size: 16pt; font-weight: 500; letter-spacing: -.03em; padding: 6.5mm 0; border-bottom: .25mm solid rgba(36,34,32,.12); }}
.box {{ width: 4.6mm; height: 4.6mm; border: .35mm solid {INK}; border-radius: 1.2mm; flex: none; }}
.mail {{ font-size: 22pt; margin-top: 4mm; letter-spacing: -.04em; }}
.start-mail {{ margin-bottom: 4mm; }}

.back-point {{ position: absolute; width: 95mm; right: -10mm; top: 30mm; }}
"""

DEFS = f"""<svg width="0" height="0" style="position:absolute"><defs>
<radialGradient id="core"><stop offset=".15" stop-color="{VIOLET}" stop-opacity=".16"/><stop offset="1" stop-color="{VIOLET}" stop-opacity="0"/></radialGradient>
<radialGradient id="glow"><stop offset="0" stop-color="{VIOLET}" stop-opacity=".38"/><stop offset=".45" stop-color="{VIOLET}" stop-opacity=".1"/><stop offset="1" stop-color="{VIOLET}" stop-opacity="0"/></radialGradient>
</defs></svg>"""


def build():
    pages = [p_cover(), p_contents(), p_who(), p_what(True), p_what(False), p_process(), p_models(),
             p_promises(), p_sdk(), p_faq(), p_start(), p_back()]
    assert len(pages) == PAGES
    html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Studio Galaxy — Field guide</title>
<style>{FONTS}{CSS}</style></head><body>{DEFS}{"".join(pages)}</body></html>"""
    HTML.write_text(html, encoding="utf-8")
    PDF.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=15000",
                    "--run-all-compositor-stages-before-draw", f"--print-to-pdf={PDF}", HTML.as_uri()],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"wrote {PDF.relative_to(ROOT.parent)} ({PDF.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    build()
