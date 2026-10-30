# Pango design system

Pango is a React component library for dense, work-focused product software: dashboards, queues, settings, and data-heavy admin views. It follows the supplied Pango visual system—restrained surfaces, clear hierarchy, semantic tokens, compact but usable controls, and intentional motion.

The workspace includes a routed Vite documentation site, a publish-ready library build, and Storybook documentation. The supplied `Pango Design System` folder remains the visual reference; it is not modified by this implementation.

## Run the workspace

```sh
npm install
npm run dev
npm run storybook
```

`npm run build` verifies the preview app. `npm run build:library` emits the tree-shakeable ESM package and declarations into `dist-lib`. `npm run build-storybook` produces a static Storybook site.

## Documentation site

The preview app is the documentation experience. The overview is the landing page; the rest of the guidance lives in one anchored `/documentation` guide with topic-level examples, live compositions, and copyable code samples. Its client-side search indexes titles, descriptions, keywords, component names, and section copy. Press `/` or Command/Control + K to focus it, use the arrow keys and Enter to navigate results, and Escape to close it.

The documentation site opens the hosted Storybook catalogue through `VITE_STORYBOOK_URL`. Set that variable in the deployment environment to the remote Storybook URL; the interface does not fall back to the local Storybook server.

`SearchMenu` is a composable primitive rather than a native select: consumers provide groups, rows, rich cards, and actions as children. Ordinary long lists scroll within a configurable panel; `SearchMenu.VirtualList` is available for large result sets. The controlled `loading` prop displays the spinner needed for a future endpoint-backed provider without changing the UI contract.

`NumberInput` is a text-based numeric control with `inputMode="decimal"`. It formats the displayed value using the active or supplied locale, returns a raw number through `onValueChange`, and supports min, max, step, an optional in-field `prefix`, disabled, loading, validation, and accessible field messaging. `FileInput` adds a Pango dropzone, validated previews, per-file progress, retryable failures, and optional custom or endpoint-backed upload transport.

`PhoneInput` is an opt-in lazy entry point. Import it from `pango-design-system/phone` when a page needs phone formatting; the `libphonenumber-js` metadata loads on first focus and is not part of the core or forms entries.

```tsx
import { PhoneInput } from "pango-design-system/phone";

<PhoneInput
  defaultCountry="KE"
  label="Phone number"
  onValueChange={setPhone}
/>;
```

The core entry point also includes the advanced workflow controls: `TreeView` and `TreeSelect` for nested resources, `NotificationCenter` for persistent actionable inbox items, `FilterBuilder` with saved views and draggable OR/AND condition groups, `AvatarGroup` and `PresenceIndicator` for collaboration surfaces, and `SegmentedControl` for compact mutually exclusive settings.

## Opt-in micro-interactions

Pango keeps its baseline controls calm, but exposes focused enhancements for places where feedback earns its keep. Use `AsyncButton` for actions that need pending, success, and retry states without layout shift; `CopyButton` for clipboard feedback; `SkeletonSwap` and `CollapsibleBanner` for asynchronous and status surfaces; and `Slider` with `snapToDetents` for named range stops. Existing components gain opt-in props instead of changing their defaults: `SearchField` accepts `expandOnFocus`, `Tabs` and `Accordion` accept `motion`, `PageHeader` accepts `sticky`, and `PresenceIndicator`/`AvatarGroup` accept activity-pulse props. All use the same Pango tokens and respect `prefers-reduced-motion`.

## Package entry points

Import Pango styles once from the application boundary, then use the smallest entry point that fits the page.

```tsx
import "pango-design-system/styles.css";
import { Button, Card, Tooltip } from "pango-design-system";
import { Combobox, useForm, z } from "pango-design-system/forms";
import { DataTable } from "pango-design-system/table";
```

| Entry point              | Contents                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pango-design-system`    | Core controls, feedback, navigation, overlays, cards, workflow controls, and utilities.                                                                |
| `/styles.css`            | Fonts, semantic theme tokens, responsive rules, component styles, and reduced-motion defaults.                                                         |
| `/tokens` and `/motion`  | Shared control sizes, tone names, timing values, and opt-in Motion exports.                                                                            |
| `/forms`                 | Field composition, file uploader, combobox, multi-select, date controls, number input, slider detents, TanStack Form, and Zod.                         |
| `/phone`                 | Opt-in, lazy-formatted phone input backed by `libphonenumber-js`.                                                                                      |
| `/patterns`              | Page headers, filters, settings, command palette, list-detail layouts, empty/loading/error states, and responsive navigation.                          |
| `/marketing`             | Opt-in marketing compositions: navigation, hero, logo cloud, feature sections, pricing, testimonials, CTA, footer, FAQ, and availability grid.         |
| `/workflows`             | Opt-in product compositions: application shell, amount field, board, progress card, checklist, scoped access, assistant chat, tour, and editable list. |
| `/table` and `/virtual`  | Semantic tables, TanStack Table adapter, virtual lists, grids, and virtual data table.                                                                 |
| `/dnd`                   | Draggable, droppable, sortable-list, sortable-grid, drag-handle, and drag overlay primitives.                                                          |
| `/charts` and `/hotkeys` | TanStack Chart wrapper, sparklines, legends, product hotkeys, and shortcut-help UI.                                                                    |

The core entry point does not import tables, charts, forms, virtualisation, hotkeys, marketing, or product-workflow compositions. Drag-and-drop is included by `FilterBuilder` for its conditional reordering; the table, chart, form, virtualisation, hotkey, marketing, and workflow dependencies remain isolated until a consuming page explicitly imports the matching entry point.

## Design contract

- Semantic CSS variables drive every palette, including light and dark modes via `data-theme`. Components use `--surface`, `--ink`, `--border`, `--accent`, and semantic feedback tones instead of hard-coded component colors.
- Four palette choices—green, blue, violet, and vermilion—share the same public API.
- Controls share `sm`, `md`, and `lg` sizing; disabled, loading, invalid, focus, hover, and reduced-motion behavior are treated as component states rather than page-specific styling.
- Accessibility defaults include native control semantics where possible, descriptive labels, dialog focus restoration, Escape/outside-dismiss handling, live toast status, keyboard-operable menus, and semantic table markup.
- Space Grotesk, Manrope, and JetBrains Mono are self-hosted from the supplied Pango assets.

## Storybook

Stories cover primitive variants and states, controls and surfaces, a complete Forms gallery, dialogs and notifications, the TanStack-powered data table, composable search menus, marketing compositions, and product-workflow compositions. Forms includes text, email, password, URL, telephone, search, date, month, time, file, textarea, NumberInput, checkbox, switch, radios, select, combobox (including creation), multi-select, and checkbox/radio cards. Search menu stories cover grouped results, loading and empty states, scrollable card results, virtualised countries, and keyboard selection. The toolbar swaps the entire story canvas between light and dark token modes.

Storybook 9 is used instead of the initially requested Storybook 8 because this project uses Vite 7, while Storybook 8 declares compatibility only through Vite 6. The Storybook build is otherwise a standard React/Vite implementation. The Navigation/Tree, Feedback/Notification center, Data/Filter builder, Collaboration/Presence, and Forms/Segmented control stories provide interactive examples for the workflow controls.

## Verification

The following commands pass in this workspace:

```text
npm test
npm run build
npm run build:library
npm run build-storybook
```

The static Storybook build emits a size advisory for its combined preview bundle; the library build itself keeps advanced features as explicit entry points. The documentation site was also checked in a local browser: client-side search returned grouped semantic results and keyboard selection reached a valid section route.
