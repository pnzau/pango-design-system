export type DocumentationSection = {
  body: string
  id: string
  points?: string[]
  title: string
}

export type DocumentationPage = {
  accessibility: string
  description: string
  example: string
  group: 'Foundations' | 'Primitives' | 'Patterns' | 'Reference'
  id: string
  intendedUse: string
  keywords: string[]
  path: string
  sections: DocumentationSection[]
  states: string
  title: string
}

export const documentation: readonly DocumentationPage[] = [
  {
    id: 'overview',
    path: '/',
    group: 'Foundations',
    title: 'Overview',
    description: 'A restrained React system for dense operational product software.',
    intendedUse: 'Use Pango when people need to scan a state, make a decision, and move to the next piece of work.',
    example: 'A queue view can pair a compact summary, a semantic status, and one clear action without turning the surrounding surface into decoration.',
    states: 'The system distinguishes resting, hover, focus, disabled, loading, success, warning, and error states through tokens and clear copy.',
    accessibility: 'Choose the native element that matches the action, retain visible focus, and keep information available when reduced motion is enabled.',
    keywords: ['introduction', 'principles', 'react', 'theme'],
    sections: [
      { id: 'purpose', title: 'Made for operational work', body: 'Pango is for software where people arrive to check a state, make a decision, and move on. It fits dashboards, queues, schedules, inventory, finance, and back-office tools.' },
      { id: 'character', title: 'A quiet visual baseline', body: 'Warm greys do most of the work. One accent marks action and status. Cards have a hairline and radius, not a resting shadow. The result keeps attention on the information instead of the interface.', points: ['Use one accent at a time.', 'Use semantic status tones for feedback.', 'Treat depth as an interaction state.'] },
      { id: 'themes', title: 'Theme through tokens', body: 'Light and dark mode are switched with data-theme on the document element. Components consume semantic values, so a component that reads tokens works in both modes without a dark prop.' },
    ],
  },
  {
    id: 'tokens',
    path: '/tokens',
    group: 'Foundations',
    title: 'Tokens',
    description: 'Semantic colour, type, spacing, radius, elevation, and motion values.',
    intendedUse: 'Use semantic tokens whenever a component needs colour, type, spacing, radius, elevation, or motion.',
    example: 'A status label reads the semantic success token instead of a green hex value, so it remains coherent in both themes.',
    states: 'Use base, hover, selected, focus, disabled, and semantic status tokens instead of creating an isolated state palette for a component.',
    accessibility: 'Do not rely on colour alone. Pair semantic tones with text, an icon, a dot, or another visible distinction.',
    keywords: ['colour', 'color', 'typography', 'spacing', 'dark mode', 'motion'],
    sections: [
      { id: 'semantic-colour', title: 'Semantic colour', body: 'Components use surface, ink, border, accent, and status tokens instead of a component-specific hex value. The default accent is green, with blue, violet, and vermilion alternatives for a shell-level choice.' },
      { id: 'type-roles', title: 'Three type roles', body: 'Space Grotesk carries display text and headings. Manrope carries interface copy. JetBrains Mono carries counts, IDs, currency, references, and machine-like values.' },
      { id: 'measure', title: 'Exact but consistent measure', body: 'Pango uses a small vocabulary of component sizes and intentionally uneven spacing values. Use the component size first. Reach for raw spacing only when composing a layout that a component does not already own.' },
    ],
  },
  {
    id: 'accessibility',
    path: '/accessibility',
    group: 'Foundations',
    title: 'Accessibility',
    description: 'Keyboard operation, native semantics, visible focus, and reduced motion.',
    intendedUse: 'Apply these rules to every Pango composition before treating a component as complete.',
    example: 'A form field keeps a visible label and places help or validation text alongside the field it describes.',
    states: 'Focus, validation, disabled, and loading states must remain understandable without hover or colour-only cues.',
    accessibility: 'Preserve native semantics, keyboard operation, the focus border token, and reduced-motion preferences.',
    keywords: ['keyboard', 'focus', 'screen reader', 'motion', 'wcag'],
    sections: [
      { id: 'semantics', title: 'Start with the native element', body: 'Use buttons for actions, links for navigation, labels for form fields, and tables for tabular data. Pango styles these elements without replacing the semantics people and assistive technology rely on.' },
      { id: 'focus', title: 'Focus is deliberate', body: 'Focused controls swap to the focus border token. Do not remove focus styles or rely on colour alone to explain a changed state.' },
      { id: 'motion', title: 'Motion has a ceiling', body: 'Ordinary interactions run between .14s and .22s. The longest transition is .34s. Reduced-motion preferences remove nonessential movement rather than hiding information.' },
    ],
  },
  {
    id: 'controls',
    path: '/components/controls',
    group: 'Primitives',
    title: 'Core controls',
    description: 'Buttons, inputs, selection controls, feedback, and form composition.',
    intendedUse: 'Use controls for a person’s next action or choice, with the page’s most important decision receiving the clearest priority.',
    example: 'A budget field uses NumberInput for localised grouping while its change callback receives the raw number.',
    states: 'Document resting, focus, invalid, disabled, read-only, and loading behaviour where the control supports it.',
    accessibility: 'Keep labels visible, associate help and validation text with the field, and use buttons for actions rather than links.',
    keywords: ['button', 'input', 'checkbox', 'radio', 'switch', 'textarea', 'number', 'date picker', 'date range'],
    sections: [
      { id: 'actions', title: 'Buttons state an action', body: 'Use verb-and-object labels such as “Save changes” or “Create project”. The solid button is the page’s primary decision. Outline, soft, and ghost variants carry decreasing visual priority.' },
      { id: 'fields', title: 'Fields explain themselves', body: 'Labels remain visible when context matters. Description and validation text belong close to the field. The NumberInput is text-based by design so it can display localised grouping while returning a number. DatePicker and DateRangePicker use the same custom calendar, rather than native date-field chrome.' },
      { id: 'selection', title: 'Selection has enough room to explain itself', body: 'Checkboxes suit independent choices. Radio groups suit one choice from a small known set. Card variants are useful when each option needs a title, description, or supporting value.' },
    ],
  },
  {
    id: 'data',
    path: '/components/data',
    group: 'Primitives',
    title: 'Data display',
    description: 'Status, progress, money, empty states, and compact summaries.',
    intendedUse: 'Use these components to make operational information scannable without competing with the task around it.',
    example: 'An order row can combine a mono reference, a semantic status, and a compact total for a fast visual scan.',
    states: 'Show loading, empty, progress, success, warning, danger, and neutral states with their semantic tone and an explanatory label.',
    accessibility: 'Express status with readable text or an accessible label in addition to its visual tone, and use table markup for tabular values.',
    keywords: ['status', 'money', 'progress', 'empty state', 'stats'],
    sections: [
      { id: 'status', title: 'Status is a tone, not a brand colour', body: 'Use success, warning, danger, info, slate, neutral, and empty to communicate state. A tone includes a dot, soft fill, border, and readable text rather than a saturated block.' },
      { id: 'numbers', title: 'Numbers get their own type role', body: 'Counts, money, references, and IDs use the mono role when scanning accuracy matters. Currency and locale belong to the consuming product, not to the colour or status layer.' },
      { id: 'absence', title: 'Empty states explain the next useful step', body: 'An empty state says what is missing, why the view is useful, and offers one clear action when a person can resolve it.' },
    ],
  },
  {
    id: 'overlays',
    path: '/components/overlays',
    group: 'Primitives',
    title: 'Overlays',
    description: 'Dialogs, drawers, popovers, menus, toasts, and confirmation flows.',
    intendedUse: 'Use an overlay only when the task needs contained context, confirmation, or a short-lived response outside the page flow.',
    example: 'A deletion flow uses a confirmation dialog with the consequence and the next safe action stated plainly.',
    states: 'Account for opening, closing, confirmation, error, and disabled-action states rather than treating the overlay as a static panel.',
    accessibility: 'Move focus into dialogs, close with Escape, return focus to the initiator, and keep menus compact and keyboard operable.',
    keywords: ['dialog', 'drawer', 'popover', 'toast', 'menu', 'confirmation'],
    sections: [
      { id: 'dialog', title: 'Use a dialog for a contained decision', body: 'Dialogs move focus into the decision, close with Escape, and restore focus to the initiating control. Keep the task short and make the consequence clear before the primary action.' },
      { id: 'menu', title: 'Menus are for a compact action set', body: 'A menu contains actions related to one object. For discovery or large collections, use the composable SearchMenu instead so people can search, scan, and use the keyboard.' },
      { id: 'notification', title: 'Notifications report a completed change', body: 'Toasts confirm a result without blocking work. Destructive or irreversible decisions belong in a confirmation flow, not in a transient message.' },
    ],
  },
  {
    id: 'app-shell',
    path: '/patterns/app-shell',
    group: 'Patterns',
    title: 'App shell',
    description: 'Persistent navigation, context, and a content area that stays readable.',
    intendedUse: 'Use the app shell to orient people across related, frequent product tasks.',
    example: 'A sidebar groups foundations, controls, and patterns while the header states the current document and offers search.',
    states: 'Show the active route clearly; on narrow screens move the navigation into a deliberate open and closed state.',
    accessibility: 'Use landmark elements for navigation and main content, mark the active page, and provide a labelled mobile navigation control.',
    keywords: ['sidebar', 'navigation', 'layout', 'responsive'],
    sections: [
      { id: 'navigation', title: 'Navigation shows the current place', body: 'A persistent sidebar groups related pages and gives the active route a restrained accent treatment. On narrow screens it becomes a deliberate navigation surface rather than a squeezed desktop sidebar.' },
      { id: 'context', title: 'Context stays near the work', body: 'Use breadcrumbs, page titles, descriptions, and local actions to tell a person where they are and what the current screen changes.' },
      { id: 'responsive', title: 'Responsive means reprioritised', body: 'On small screens, preserve the task and hierarchy. Collapse secondary controls, keep tap targets usable, and avoid relying on hover-only information.' },
    ],
  },
  {
    id: 'data-table',
    path: '/patterns/data-table',
    group: 'Patterns',
    title: 'Data table',
    description: 'Semantic tables first, with TanStack features when the data earns them.',
    intendedUse: 'Use a table for comparable records that benefit from rows, columns, sorting, filtering, or selection.',
    example: 'A work queue starts as a captioned semantic table and adds sorting or pagination only when the data requires it.',
    states: 'Cover loading, empty, selected, sorted, filtered, and paginated states; virtualise only once rendering scale justifies it.',
    accessibility: 'Keep headers, captions, rows, and cells in the markup so familiar table navigation remains available before enhancement.',
    keywords: ['table', 'sorting', 'filtering', 'selection', 'virtualization'],
    sections: [
      { id: 'native-first', title: 'Start with a semantic table', body: 'Use headers, captions, rows, and cells when the data is ordinary tabular content. This preserves expected navigation and works with assistive technology before any enhanced behaviour is added.' },
      { id: 'advanced', title: 'Add table behaviour as an opt-in layer', body: 'Pango’s table entry point exposes sorting, filtering, selection, visibility, and pagination through TanStack Table. Keep business-specific filters and bulk actions in the consuming product.' },
      { id: 'scale', title: 'Virtualise only at a real scale limit', body: 'Virtual rows help when the rendered list is genuinely large. Do not use virtualisation to compensate for a table that needs filtering, paging, or a clearer information structure.' },
    ],
  },
  {
    id: 'keyboard',
    path: '/patterns/keyboard-first',
    group: 'Patterns',
    title: 'Keyboard-first',
    description: 'Shortcuts and searchable navigation for work that repeats all day.',
    intendedUse: 'Use keyboard-first patterns to make repeated navigation and selection faster without hiding ordinary controls.',
    example: 'Documentation search opens with / or Command/Control K, moves with arrows, selects with Enter, and closes with Escape.',
    states: 'Search communicates idle, loading, result, active-result, empty, and closed states; long result sets scroll or virtualise as appropriate.',
    accessibility: 'Use combobox and listbox semantics, keep the active option exposed, and restore focus to the search control after Escape.',
    keywords: ['shortcut', 'command', 'search', 'combobox', 'hotkey'],
    sections: [
      { id: 'search', title: 'Search is a navigation tool', body: 'The documentation search opens with / or Command/Control K, and its visible key hint supports discovery. Arrow keys move through results, Enter opens the active result, and Escape closes the menu without losing your place.' },
      { id: 'shortcuts', title: 'Shortcuts support an existing action', body: 'A shortcut makes a repeated action quicker. It does not replace visible controls. Show the shortcut near the action and preserve a conventional fallback for people who do not use a keyboard.' },
      { id: 'large-lists', title: 'Large lists stay usable', body: 'The SearchMenu scrolls ordinary long lists within a bounded panel. Its virtual-list companion is for large data sets, such as countries, where rendering every option is unnecessary.' },
    ],
  },
  {
    id: 'architecture',
    path: '/architecture',
    group: 'Reference',
    title: 'Architecture',
    description: 'Keep core light and import advanced behaviour only where it is needed.',
    intendedUse: 'Use the package entry points to keep a product’s component imports proportional to the behaviour it actually needs.',
    example: 'A simple settings screen imports core controls, while a large data view opts into the table or virtual entry point.',
    states: 'Advanced integrations retain their own state model; Pango provides a visual starting point instead of hiding product-specific states.',
    accessibility: 'When composing an adapter, preserve the semantic and keyboard behaviour of the underlying library rather than styling it away.',
    keywords: ['package', 'forms', 'table', 'virtual', 'charts', 'hotkeys'],
    sections: [
      { id: 'entry-points', title: 'Small imports, clear boundaries', body: 'Core exports controls and common patterns. Forms, tables, virtualisation, drag-and-drop, charts, hotkeys, and motion have explicit entry points so a button does not bring a chart or virtualiser into the same bundle.' },
      { id: 'adapters', title: 'Adapters keep the underlying library visible', body: 'TanStack and dnd-kit integrations provide a Pango-shaped starting point without hiding the capability that a product eventually needs to configure.' },
    ],
  },
  {
    id: 'storybook',
    path: '/storybook',
    group: 'Reference',
    title: 'Storybook',
    description: 'Interactive component states, form galleries, and composable search examples.',
    intendedUse: 'Use Storybook to compare component behaviour and visual states while building or reviewing an interface.',
    example: 'The Forms and Search menu stories show standard controls, card choices, loading feedback, rich results, and a virtualised country list.',
    states: 'Stories cover normal, invalid, disabled, read-only, loading, long-content, narrow-container, and light or dark cases where relevant.',
    accessibility: 'Exercise controls by keyboard as well as pointer, especially focus movement, selection, Escape behaviour, and labels.',
    keywords: ['stories', 'examples', 'components', 'testing'],
    sections: [
      { id: 'coverage', title: 'Stories show states that screenshots skip', body: 'Each story should show ordinary use alongside disabled, invalid, loading, long-content, narrow-container, and dark-mode cases. The forms area includes every control available for a form, including the custom date and date-range pickers.' },
      { id: 'running', title: 'Run it locally', body: 'Run npm run storybook to browse the interactive catalogue. The landing page links here because documentation is more useful when you can test an interaction instead of only reading about it.' },
    ],
  },
] as const

export const navigationGroups = [
  { label: 'Foundations', pages: documentation.filter((page) => page.group === 'Foundations') },
  { label: 'Primitives', pages: documentation.filter((page) => page.group === 'Primitives') },
  { label: 'Patterns', pages: documentation.filter((page) => page.group === 'Patterns') },
] as const

export function findDocumentation(pathname: string) {
  return documentation.find((page) => page.path === pathname)
}
