# Pango Design System

A near-monochrome administrative design system: warm greys, one accent, three
typefaces with one job each, no resting shadows, and motion that never exceeds .34s.
It is built for **dense operational software** — the kind of product where a person
arrives to check a state, act on it, and leave. Portfolio dashboards, clinic schedules,
fleet and logistics boards, field-service queues, back-office finance, admin consoles,
inventory and asset management.

Nothing in the token or component layer names an industry. Statuses are tones
(`success` `warning` `danger` `info` `slate` `neutral` `empty`), categorical colour is
eight fixed hues you assign, currency is a setting, and the one signature pattern —
rows of status tiles — describes any fixed inventory: units in a building, desks on a
floor, machines in a rack, beds in a ward, shifts in a week.

**Two themes.** Light and dark, switched by `data-theme` on `<html>`. See
`guidelines/dark-mode.html`.

## Origin

The system was extracted from one source: `uploads/Pango - offline.html`, a
self-contained offline bundle of Pango, a property-management app for Kenyan
landlords. Every value here is that app's real value — 5px means 5px, and the three
webfonts are the files from the bundle, not substitutes. Three later components
(`DatePicker`, `Dropdown`, `NumberInput`) come from a second source, the Ganji finance
app, ported to this system's tokens.

That origin shows in two places only, both deliberate: `ui_kits/pango-app/` is still
the rental product, and the brand mark is still Pango's. Everything else has been
generalized — the domain token names (`--paid`, `--overdue`) survive as aliases onto
the semantic tones so existing product code keeps working.

## Using it in a product that isn't Pango

1. Link `styles.css`. Set `data-theme="light"` or `"dark"` on `<html>` (see
   `ThemeToggle.prompt.md` for the no-flash boot script).
2. Re-point `--accent` if the brand isn't green. Three alternates ship:
   `--accent-blue`, `--accent-violet`, `--accent-vermilion`.
3. `setCurrency('EUR', { locale: 'de-DE' })` once at boot, if the product shows money.
4. Register your vocabulary, don't invent tones: add keys to `STATUS` (chips) and
   `TILE_STATUS` (tile grids), and assign `CATEGORY_TONE[label]` for taxonomy colours.
5. Replace the brand layer: `PangoMark` is Pango's mark, not a generic logo slot.

## Index

| Path | What it is |
|---|---|
| `styles.css` | The one stylesheet consumers link. `@import` list only. |
| `tokens/` | `fonts.css`, `colors.css`, `dark.css`, `typography.css`, `spacing.css`, `radii.css`, `elevation.css`, `motion.css`, `base.css` |
| `assets/fonts/` | Self-hosted Space Grotesk, Manrope and JetBrains Mono woff2 subsets |
| `components/` | React primitives, grouped by concern (below) |
| `guidelines/` | Foundation specimen cards — colour, type, spacing, brand, dark mode |
| `ui_kits/pango-app/` | Interactive recreation of the origin product — see its own README |
| `templates/dashboard-screen/` | A blank app screen, ready to fill |
| `thumbnail.html` | Homepage tile |
| `SKILL.md` | Agent-skill front matter for use outside this workspace |

### Components

**`components/brand/`** — PangoMark
**`components/core/`** — Icon, Button, IconButton, Card, InsetPanel, DarkPanel, SectionHeading, EyebrowLabel, Avatar
**`components/data/`** — StatusChip, Tag, Badge, StatCard, Money, ProgressBar
**`components/forms/`** — Input, TextArea, Select, SearchField, Checkbox, CheckRow, Switch, Dropdown, DatePicker, MonthPicker, NumberInput
**`components/navigation/`** — NavItem, SegmentedControl, PageHeader
**`components/overlay/`** — Sheet, Popover, AnchoredPopover
**`components/patterns/`** — TileGrid, TileRow, TileDots, TileCell, TileDot, StatusLegend
**`components/theme/`** — ThemeToggle

Helpers exported alongside them. **Only capitalized names reach
`window.PangoDesignSystem_86a349`**, so each helper set has a capitalized holder for use
from plain HTML: `MoneyFormat.setCurrency` / `.formatMoney`, `NumberFormat.groupDigits` /
`.toRawNumber`, `Theme.apply` / `.stored` / `.system`, `CategoryTone(label)`,
`Initials(name)`, `IconNames`. The lowercase originals (`setCurrency`, `formatMoney`,
`groupDigits`, `toRawNumber`, `applyTheme`, `getStoredTheme`, `systemTheme`, `useTheme`,
`useAnchoredPopover`, `categoryTone`, `initialsOf`, `iconNames`) are ESM exports — import
them in JSX, don't read them off the namespace. The `STATUS`, `TONES`, `TILE_TONES`,
`TILE_STATUS`, `CATEGORY_TONE` maps are on the namespace as-is. `UnitGrid`, `FloorRow`,
`FloorDots`, `UnitCell` and `UnitDot` are aliases onto the tile-grid components.

Each component directory has a `@dsCard` HTML file showing its states, a `.d.ts` props
contract, and a `.prompt.md` with a usage example.

#### Where components came from

The origin app is hand-written markup with no component library, so the inventory is an
extraction of its repeated patterns. Four entries are conveniences rather than things a
source app names:

- **`Icon`** — wraps the app's inline 24×24 stroke SVGs (paths copied verbatim) so screens don't paste SVG.
- **`TileGrid`** — one component over the tile-row pattern the origin app open-codes in two places.
- **`ThemeToggle`** — added with dark mode; neither source app had a theme switch.
- **`Popover`** — the anchored layer under `Dropdown` and `DatePicker`, lifted out of the Ganji source.

Patterns neither source has and which this system therefore omits: toasts, tooltips,
tabs, accordions, breadcrumbs, pagination, skeleton loaders.

---

## Content fundamentals

**Plain, operational English. Short sentences that name the thing and the number.**

- **Second person, never first.** The product speaks *to* the user about *their* work; it never says "we" or "I".
- **Sentence case everywhere** — page titles, buttons, card headings. The only caps are 11px eyebrow labels (`EMAIL ADDRESS`, `BILLING PERIOD`) and tiny 9.5px flags (`AI`, `LIVE`).
- **Buttons are verb + object, no articles.** "Add property", "Save repair", "Send invitation". Never "Click here", never "Submit".
- **Subtitles carry the count.** Every page header pairs a noun title with a factual subline: "4 properties across Nairobi", "8 jobs logged this quarter".
- **Numbered steps use a middle dot.** "1 · Select what you've paid".
- **Local vocabulary is used unapologetically.** The origin product says *fundi*, *DSQ*, *M-Pesa* without translating itself. A product on this system should be equally specific to its own users rather than generically neutral.
- **AI copy is a recommendation with a reason, in one or two sentences.** It never says "AI suggests" or hedges with "you may want to consider".
- **Empty states explain the payoff**, not the mechanism.
- **Confirmations are reassurance plus what happens next.** "Sent for confirmation. You'll be notified once verified."
- **Em dashes appear sparingly**, to attach a reason. One per sentence at most.
- **No emoji in the interface.** Two typographic marks are used as glyphs: **✦** before an AI hint, **▲/▼** before a trend.

---

## Visual foundations

### The idea
A near-black-and-grey administrative interface with one accent and one recurring
graphic: **a fixed inventory drawn as rows of status-coloured tiles.** That grid is the
system's signature — dots on summary cards, full cells on a detail view — and it is the
fastest read of "which of these are fine and which are not".

### Colour
- **Accent:** a single colour, green `#0a8f5b` by default, `#12b673` in dark. Primary buttons, active states, confirmations. Three alternates ship as a shell-level swap.
- **Ink is `#0e0e0e`, never pure black** — except a logo tile, which is `#000`.
- **Neutrals are six near-identical warm-leaning greys**: page `#f4f4f3`, card `#fff`, inset `#fafafa`, chip `#f3f3f1`, hover `#f6f6f4`, divider `#f0f0ee`. They are distinguishable only in context — that is the point; the interface reads as one continuous paper surface. In dark they invert into a rising stack: page `#0e0e0e`, card `#171717`, inset `#1c1c1c`, chip `#252525`.
- **Borders are a four-step ladder**: inset → card → control → strong.
- **Status is five tones plus absence**: success, warning, danger, info, slate, neutral, and `empty` — a dashed grey outline with no fill. Each tone has a dot colour, a pale fill, a pale border and a darker text tone. Status is never a saturated block.
- **Categorical colour is eight fixed hues** (`--cat-1…8`: blue, amber, violet, green, red, slate, ochre, teal), assigned for the taxonomies a product knows and hashed from the same palette for anything a user types.
- **Two background colours only**: the app surface and cards. Dark panels are the third register, reserved for AI briefs and running totals.

### Dark mode
The dark theme remaps the semantic layer only — the grey ramp and brand palette keep
their light values. The rule this enforces: **a component that reads tokens is
dark-correct; a component that hardcodes a hex is the only thing that breaks.** No
component takes a `dark` prop; there is no second set of components.

### Gradients
Three, all very low-contrast dark-on-dark, all on panels rather than pages. There are no
colourful gradients anywhere. The only saturated gradient is the Instagram brand button.

### Type
Three families, each with one job.
- **Space Grotesk 700** — every heading, every figure, the wordmark. Tracking tightens as size grows: `-1px` at 38px, `-.6px` at 26px, `-.5px` at 23–27px, `-.3px` at 17px.
- **Manrope** — all UI text. 400 for prose, 600 for labels and nav, 700 for buttons and names, 800 for the two caps badges.
- **JetBrains Mono** — money, IDs, references, codes, row labels, counts, and quoted machine messages. Never prose.

Sizes are authored in half-pixel steps (10.5, 11.5, 12.5, 13.5, 14.5) — deliberate, not
rounding error. Line heights: 1.12 for the 38px display line, 1.5 for UI body, 1.6 for prose.

### Spacing & layout
- Exact pixels, **not** a 4/8 grid. 9, 11, 13 and 22 are all real recurring values.
- Fixed elements: a 248px sticky sidebar (full-height, right-hairline), a sticky translucent page header, and a 1240px max-width content well with `28px 34px 56px` padding.
- Card interiors are 20px; stat cards `18px 20px`; list and table rows `14px 20px`; the header `18px 34px`.
- Card grids use `repeat(auto-fit,minmax(190px,1fr))` for KPIs and `minmax(360px,1fr)` for record cards, with 14–16px gaps.
- Below `860px` the sidebar becomes a bottom sheet behind a hamburger, and two-column grids collapse to one.

### Corner radii
2px logo bars, 5px tile dots, 6–7px tags and chips, 8–9px small buttons and selects,
10–11px inputs, nav rows and icon tiles, 12–14px inset panels and stat cards, 16px cards,
18px large panels and desktop modals, 20px on the top corners of a mobile sheet, 20px
pill badges, 50% avatars. Nothing has a square corner.

### Cards
Card surface, one 1px hairline, 16px radius, **no resting shadow**. That is the whole
recipe. Depth is a state, not a style: an interactive card lifts `-2px` and firms its border.

### Shadows
Six, all large-blur and negative-spread so they read as ambient rather than drop: a
segmented thumb, a switch knob, the card lift, a dropdown/date panel, a desktop modal,
and an upward one on a mobile sheet. No inner shadows anywhere.

### Transparency & blur
Three places, never decoratively: the sticky header veil + `blur(8px)`, the modal/sheet
scrim + `blur(3px)`, and glass over photography (white at 14–16% + `blur(4px)`).
Protection over imagery is a **gradient scrim**, not a capsule.

### Motion
`.14s` on nav rows, buttons, CTAs and controls; `.16s` on the switch; `.18s` on the card
lift; `.22s` for a sheet sliding up; `.34s` for tile rows rising in. Sheets and rows use
`cubic-bezier(.2,.8,.2,1)`; everything else plain `ease`. Four keyframes exist:
`floorRise`, `sheetUp`, `cellPop`, `popIn`. **No bounce, no spring, no parallax,
nothing above .34s.**

### States
- **Hover:** the accent button brightens — it never darkens. Outlined buttons and nav rows fill to the hover surface. Tiles darken slightly. Cards lift.
- **Press:** nothing. No scale, no shift, no darken anywhere.
- **Focus:** a control swaps its border to `--border-focus` (ink in light, near-white in dark). No glow, no ring, no accent outline.
- **Disabled:** reduced opacity; prefer hiding unavailable actions.

### Imagery
The sources ship **zero images** — no photography, no illustration, no background
texture. Photos are user-supplied through a drop slot; the empty state is a tinted grid.
When a photo arrives it sits full-bleed under the ink scrim with white copy over it.
Where a diagram is needed it is drawn in CSS.

---

## Iconography

**One system: inline 24×24 stroke SVG.** No icon font, no sprite sheet, no icon package —
though the drawing style is close to Lucide's: geometric, single-weight, open paths.

- **Stroke, never fill.** `fill="none"`, `stroke="currentColor"`, so icons take the colour of their container.
- **Weights by role:** `1.7` in the sidebar, `1.8–2` inline beside text, `2.2–2.4` for chevrons and ticks, `3–3.4` for a checkmark inside a filled accent shape.
- **Always `stroke-linecap="round"`**, usually `stroke-linejoin="round"`.
- **Sizes:** 13–15px inline with 12–13px text, 17–19px in nav and headers, 20–22px inside a 38–42px icon tile.
- **Icon tiles**: a 34–42px rounded square (9–12px radius) filled with the glass fill on dark panels or the chip surface on light.
- **Two brand glyphs are filled, not stroked**: WhatsApp, and Instagram on the gradient button.
- **Unicode as iconography:** **✦** before an AI hint, **▲ ▼** for trends, **✕** to remove a chip, **→** inside a "Full insights →" link, **·** as the universal metadata separator.
- **No emoji on screen.**

Paths are copied verbatim into `components/core/Icon.jsx` — 22 named icons. Use
`<Icon name="…" />`; never paste raw SVG into a screen, and never substitute emoji.

## Fonts

All three families are self-hosted from `assets/fonts/` as the same variable woff2
subsets the source loaded from Google Fonts — **no substitution was needed.** Space
Grotesk ships latin, latin-ext and vietnamese; Manrope and JetBrains Mono add cyrillic,
cyrillic-ext and greek.

## No logo file exists

The source contains no logo asset — the Pango mark is **built in markup**: a dark rounded
tile (44/38/34px, 13/11/10px radius) holding three stacked 2px-radius bars in accent,
white at 85% and white at 55%. `PangoMark` reproduces it exactly, including the
translucent `glass` variant used over photography. No SVG, PNG or favicon has been
invented. A product on this system replaces this component entirely.
