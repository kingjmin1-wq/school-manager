# Design Brief

## Direction

Chalk & Ink — a Khmer-language school administration console that reads like a well-set ledger: dense, precise, and quietly authoritative.

## Tone

Refined institutional minimalism — serious enough for records and permissions, warm enough that teachers and parents are not intimidated.

## Differentiation

A marigold-amber active rail on indigo-slate ink, over paper-white data surfaces: the interface looks like a gilded school register rather than a generic SaaS admin.

## Color Palette

| Token      | OKLCH          | Role                                                    |
| ---------- | -------------- | ------------------------------------------------------- |
| background | 0.985 0.004 285 | Cool paper-white app ground                            |
| foreground | 0.22 0.035 285  | Indigo-slate ink for all primary text                  |
| card       | 1 0 0           | Pure-white data surfaces that lift off the ground      |
| primary    | 0.38 0.115 288  | Deep indigo-slate — nav, primary buttons, headings     |
| accent     | 0.78 0.155 78   | Marigold amber — active rail, highlights, focus        |
| muted      | 0.955 0.008 285 | Zebra rows, secondary panels, disabled fields          |

Supporting: `success` 0.55 0.13 152 (សកម្ម), `warning` 0.74 0.15 78, `destructive` 0.55 0.2 27 (លុប), `border` 0.905 0.008 285.

## Typography

- Display: Space Grotesk — page titles, section headings, KPI labels; tight tracking, bold.
- Body: DM Sans — table cells, forms, navigation, Khmer-adjacent Latin UI text.
- Mono: Geist Mono — counts, phone numbers, student IDs, dates (class `.tabular`).
- Scale: hero `text-4xl md:text-5xl font-bold tracking-tight`, h2 `text-2xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase text-muted-foreground`, body `text-sm md:text-base`.

## Elevation & Depth

Flat layered surfaces separated by 1px hairline borders; shadows are reserved for popovers, dropdowns, and dialogs (`shadow-raised`, `shadow-overlay`) — never for static cards.

## Structural Zones

| Zone    | Background          | Border              | Notes                                                        |
| ------- | ------------------- | ------------------- | ------------------------------------------------------------ |
| Header  | `bg-card`           | `border-b`          | Page title + search + account menu; sticky, 56px tall        |
| Sidebar | `bg-sidebar`        | `border-r`          | Tinted rail, collapsible on mobile; marigold rail on active  |
| Content | `bg-background`     | —                   | KPI row on `bg-card`, tables on `bg-card`, panels alternate  |
| Footer  | `bg-muted/40`       | `border-t`          | Compact meta row; hidden on small screens                    |

## Spacing & Rhythm

Page gutters `px-4 md:px-6 lg:px-8`, section gaps `gap-4 md:gap-6`, card padding `p-4 md:p-5`, table row height 44px with `px-3` cells — compact enough for real registers, airy enough to scan.

## Component Patterns

- Buttons: 6px radius, `bg-primary` solid for primary actions, `variant="outline"` for secondary, `variant="ghost"` for row actions; hover shifts to `bg-primary/90` or `bg-accent/10`; never a second saturated color.
- Cards: 6px radius, `bg-card`, `border` hairline, no resting shadow; KPI cards add a mono value in `text-2xl` plus a tiny sparkline.
- Badges: pill (`rounded-full`), `text-xs`, tinted fills — success/warning/muted only, never raw color literals.

## Motion

- Entrance: `animate-rise-in` (350ms) on KPI cards and table rows, staggered by index; `animate-fade-in` for panels.
- Hover: `transition-smooth` on rows, buttons, and nav items; row hover tints with `bg-accent/10`.
- Decorative: `animate-rail-in` scales the marigold active rail in on nav selection. No ambient or looping motion.

## Constraints

- Khmer-first UI copy; all labels, headings, and table headers in Khmer, numerals in Latin.
- Information density over decoration — no gradients, glassmorphism, ambient orbs, or neon glow.
- Semantic tokens only: no hex, `rgb()`, or arbitrary `bg-[#...]` classes in components.
- Mobile: sidebar collapses to a sheet; tables scroll horizontally rather than reflowing into cards.
- Do not build daily attendance tracking or grade entry / result reporting — out of scope.

## Signature Detail

The marigold-amber rail that slides in beside the active sidebar item — a 3px gilded mark that turns ordinary navigation into the spine of a school register.
