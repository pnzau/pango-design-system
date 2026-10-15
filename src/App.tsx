import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Check,
  ChevronRight,
  Component,
  Database,
  ExternalLink,
  FileCode2,
  Keyboard,
  Layers3,
  LayoutDashboard,
  Menu,
  Moon,
  Palette,
  PanelLeftClose,
  Search,
  ShieldCheck,
  Sun,
  Table2,
} from 'lucide-react'
import { Avatar, Badge, Button, IconButton, StatusChip } from './components/Primitives'
import { CodeBlock } from './components/CodeBlock'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Separator, Switch } from './components/Core'
import { Progress } from './components/Data'
import { SearchMenu } from './components/SearchMenu'
import { documentation, findDocumentation, navigationGroups } from './content/docs'

type Theme = 'light' | 'dark'
type PaletteName = 'green' | 'blue' | 'violet' | 'vermilion'
type SearchResult = { description: string; group: string; id: string; path: string; title: string }

const pageIcons: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  accessibility: ShieldCheck,
  'app-shell': Boxes,
  architecture: Layers3,
  controls: Component,
  data: Database,
  'data-table': Table2,
  keyboard: Keyboard,
  overview: LayoutDashboard,
  overlays: Layers3,
  storybook: BookOpen,
  tokens: Palette,
}

const paletteOptions: Array<{ name: PaletteName; label: string; value: string }> = [
  { name: 'green', label: 'Pango green', value: '#0a8f5b' },
  { name: 'blue', label: 'Signal blue', value: '#3478f6' },
  { name: 'violet', label: 'Studio violet', value: '#8067d8' },
  { name: 'vermilion', label: 'Warm vermilion', value: '#e4684b' },
]

function readPathname() {
  const pathname = window.location.pathname.replace(/\/$/, '')
  return pathname || '/'
}

function App() {
  const [pathname, setPathname] = useState(readPathname)
  const [hash, setHash] = useState(window.location.hash)
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || 'light')
  const [palette, setPalette] = useState<PaletteName>('green')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const page = findDocumentation(pathname)

  const navigate = useCallback((destination: string) => {
    const target = new URL(destination, window.location.origin)
    window.history.pushState({}, '', `${target.pathname}${target.hash}`)
    setPathname(target.pathname || '/')
    setHash(target.hash)
    setSidebarOpen(false)
  }, [])

  const focusSearch = useCallback(() => {
    setSearchOpen(true)
    window.requestAnimationFrame(() => searchInputRef.current?.focus())
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setPathname(readPathname())
      setHash(window.location.hash)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { document.documentElement.dataset.palette = palette }, [palette])

  useEffect(() => {
    document.title = page ? `${page.title} · Pango` : 'Page not found · Pango'
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      return
    }
    window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }))
  }, [hash, page])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping = target?.matches('input, textarea, select, [contenteditable="true"]')
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        focusSearch()
      }
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        focusSearch()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [focusSearch])

  const results = useMemo(() => findSearchResults(searchQuery), [searchQuery])
  const groupedResults = useMemo(() => groupResults(results), [results])

  return (
    <div className="docs-app">
      <aside className={`docs-sidebar ${sidebarOpen ? 'is-open' : ''}`} aria-label="Documentation navigation">
        <div className="docs-brand-row">
          <AppLink to="/" navigate={navigate} className="docs-brand" aria-label="Pango documentation home"><BrandMark /><span><strong>pango</strong><small>design system</small></span></AppLink>
          <IconButton label="Close navigation" size="sm" className="docs-sidebar-close" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={17} /></IconButton>
        </div>
        <div className="docs-sidebar-scroll">
          <span className="docs-version"><span />v0.1 · preview</span>
          <nav>
            {navigationGroups.map((group) => <div className="docs-nav-group" key={group.label}><h2>{group.label}</h2>{group.pages.map((item) => {
              const Icon = pageIcons[item.id] ?? FileCode2
              const active = pathname === item.path
              return <AppLink key={item.id} to={item.path} navigate={navigate} className={`docs-nav-link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}><Icon size={16} strokeWidth={active ? 2.2 : 1.75} /><span>{item.title}</span>{active && <ChevronRight size={14} />}</AppLink>
            })}</div>)}
          </nav>
        </div>
        <div className="docs-sidebar-footer"><p>Dense product work needs a quiet interface and obvious exits.</p><AppLink to="/architecture" navigate={navigate}><Layers3 size={15} /> Read the architecture</AppLink></div>
      </aside>

      {sidebarOpen && <button className="docs-sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <div className="docs-main-shell">
        <header className="docs-topbar">
          <div className="docs-topbar-start"><IconButton label="Open navigation" size="sm" className="docs-sidebar-open" onClick={() => setSidebarOpen(true)}><Menu size={18} /></IconButton><div className="docs-breadcrumbs"><AppLink to="/" navigate={navigate}>Documentation</AppLink><ChevronRight size={14} /><strong>{page?.title ?? 'Not found'}</strong></div></div>
          <div className="docs-topbar-actions">
            <SearchMenu className="docs-site-search" query={searchQuery} onQueryChange={setSearchQuery} open={searchOpen} onOpenChange={setSearchOpen} inputRef={searchInputRef}>
              <SearchMenu.Input aria-label="Search Pango documentation" placeholder="Search documentation" shortcut="⌘ K" />
              <SearchMenu.Content maxHeight={360}>
                {Object.entries(groupedResults).map(([group, groupResults]) => <SearchMenu.Group key={group} label={group}>{groupResults.map((result) => <SearchMenu.Item key={result.id} id={result.id} onSelect={() => navigate(result.path)}><SearchResultRow result={result} /></SearchMenu.Item>)}</SearchMenu.Group>)}
                {!results.length && <SearchMenu.Empty>No documentation matches “{searchQuery}”. Try “table”, “focus”, or “NumberInput”.</SearchMenu.Empty>}
              </SearchMenu.Content>
            </SearchMenu>
            <div className="docs-palette"><span style={{ background: paletteOptions.find((item) => item.name === palette)?.value }} /><select aria-label="Choose accent palette" value={palette} onChange={(event) => setPalette(event.target.value as PaletteName)}>{paletteOptions.map((option) => <option value={option.name} key={option.name}>{option.label}</option>)}</select></div>
            <IconButton label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} size="sm" tone="soft" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</IconButton>
            <Avatar name="Pango documentation" initials="P" size="sm" tone="green" />
          </div>
        </header>

        <main className="docs-content">{page?.id === 'overview' ? <LandingPage navigate={navigate} /> : page ? <DocumentationPage page={page} navigate={navigate} /> : <NotFoundPage navigate={navigate} />}</main>
        <footer className="docs-footer"><div><BrandMark /><span>Designed for operational clarity.</span></div><nav><AppLink to="/accessibility" navigate={navigate}>Accessibility</AppLink><AppLink to="/architecture" navigate={navigate}>Architecture</AppLink><AppLink to="/storybook" navigate={navigate}>Storybook</AppLink></nav></footer>
      </div>
    </div>
  )
}

function LandingPage({ navigate }: { navigate: (to: string) => void }) {
  const foundationPages = documentation.filter((page) => page.group === 'Foundations' && page.id !== 'overview')
  const componentPages = documentation.filter((page) => page.group === 'Primitives')
  const patternPages = documentation.filter((page) => page.group === 'Patterns')
  return <>
    <section className="docs-hero">
      <div><span className="docs-eyebrow"><span />React component system</span><h1>Ship calm, capable interfaces.</h1><p>Pango gives dense product software a durable visual language: warm neutrals, one accent, direct copy, and components that tell people what happens next.</p><div className="docs-hero-actions"><AppLink to="/components/controls" navigate={navigate}><Button icon={<Component size={16} />}>Browse components</Button></AppLink><AppLink to="/architecture" navigate={navigate}><Button variant="outline" icon={<FileCode2 size={16} />}>View architecture</Button></AppLink></div><div className="docs-hero-meta"><span><Check size={14} /> Keyboard-ready defaults</span><span><Check size={14} /> Semantic themes</span><span><Check size={14} /> Optional advanced layers</span></div></div>
      <CodeBlock className="docs-hero-panel" label="System canvas" language="tsx" title="The smallest useful abstraction." code={"import { Button } from 'pango-design-system'\n\n<Button>Save changes</Button>"} description="Composition over configuration. Bring the advanced code only when the product has earned it." />
    </section>
    <section className="docs-stat-grid" aria-label="Pango characteristics"><StatLink icon={<Component size={17} />} value="Core" label="Controls and feedback" to="/components/controls" navigate={navigate} /><StatLink icon={<Layers3 size={17} />} value="Opt-in" label="Table, virtual, charts, and hotkeys" to="/architecture" navigate={navigate} /><StatLink icon={<Keyboard size={17} />} value="Keyboard" label="Search and shortcut patterns" to="/patterns/keyboard-first" navigate={navigate} /><StatLink icon={<Palette size={17} />} value="Two themes" label="Semantic token contract" to="/tokens" navigate={navigate} /></section>
    <ComponentShowcase navigate={navigate} />
    <DocumentationCollection title="Start with the foundations" copy="Tokens and interaction rules that make every component feel like it belongs to the same product." pages={foundationPages} navigate={navigate} />
    <DocumentationCollection title="Build with components" copy="Use straightforward controls first. Add rich selection, overlays, and data patterns when the work needs more explanation." pages={componentPages} navigate={navigate} />
    <DocumentationCollection title="Apply product patterns" copy="Shared structures for navigation, large datasets, and frequent keyboard-driven work." pages={patternPages} navigate={navigate} />
    <section className="docs-storybook-callout"><div><Badge tone="accent">Interactive catalogue</Badge><h2>See the states, not just the happy path.</h2><p>Storybook documents form controls, card selections, custom search menus, long lists, virtualised countries, and dark mode.</p></div><AppLink to="/storybook" navigate={navigate}><Button iconAfter={<ArrowRight size={15} />}>View Storybook examples</Button></AppLink></section>
  </>
}

function ComponentShowcase({ navigate }: { navigate: (to: string) => void }) {
  const [reviewed, setReviewed] = useState(true)
  const [notifyOwners, setNotifyOwners] = useState(true)
  const [saved, setSaved] = useState(false)
  const compositionCode = `import { Button, Checkbox, Switch } from 'pango-design-system'

<Checkbox
  label="Release notes reviewed"
  checked={reviewed}
  onChange={(event) => setReviewed(event.target.checked)}
/>
<Switch label="Notify owners" defaultChecked />
<Button onClick={save}>Save changes</Button>`
  const tokenCode = `:root[data-theme='dark'] {
  --surface: #171717;
  --ink: #f4f4f1;
  --accent: #12b673;
}`

  return <section className="docs-showcase" aria-labelledby="showcase-heading">
    <div className="docs-showcase-heading"><div><span className="docs-eyebrow"><span />Live composition</span><h2 id="showcase-heading">A system is better when you can feel it work.</h2><p>This is a small, working product moment—not a one-off mockup. Change a control, save the state, then copy the same composition into an app.</p></div><AppLink to="/components/controls" navigate={navigate} className="docs-showcase-link">Explore component states <ArrowRight size={14} /></AppLink></div>
    <div className="docs-showcase-grid">
      <Card className="docs-showcase-demo"><CardHeader><div><Badge tone="accent">Live demo</Badge><CardTitle>Release handoff</CardTitle><CardDescription>One focused surface, composed from ordinary Pango controls.</CardDescription></div><Avatar name="Maya Imani" size="sm" /></CardHeader><CardContent><div className="docs-showcase-progress"><div><span>Release readiness</span><strong>{reviewed && notifyOwners ? '100%' : '78%'}</strong></div><Progress value={reviewed && notifyOwners ? 100 : 78} /></div><div className="docs-showcase-controls"><Checkbox label="Release notes reviewed" description="Confirm customer-facing changes are clear." checked={reviewed} onChange={(event) => { setReviewed(event.target.checked); setSaved(false) }} /><Switch label="Notify owners" description="Send the handoff to responsible teams." checked={notifyOwners} onCheckedChange={(checked) => { setNotifyOwners(checked); setSaved(false) }} /></div></CardContent><CardFooter><StatusChip tone={saved ? 'success' : 'neutral'}>{saved ? 'Changes saved' : 'Draft changes'}</StatusChip><Button size="sm" icon={<Check size={14} />} onClick={() => setSaved(true)}>Save changes</Button></CardFooter></Card>
      <div className="docs-showcase-code"><CodeBlock label="React composition" language="tsx" title="State stays close to the work." code={compositionCode} description="The controls keep their semantics, focus treatment, and theme behavior when composed." /><CodeBlock label="Semantic tokens" language="css" title="Theme the contract, not each component." code={tokenCode} description="One token contract carries the same components through light and dark contexts." /></div>
    </div>
  </section>
}

function DocumentationPage({ page, navigate }: { page: typeof documentation[number]; navigate: (to: string) => void }) {
  const Icon = pageIcons[page.id] ?? FileCode2
  return <article className="docs-page"><header className="docs-page-header"><div className="docs-page-icon"><Icon size={20} /></div><div><span className="docs-eyebrow"><span />{page.group}</span><h1>{page.title}</h1><p>{page.description}</p></div></header><DocumentationDetails page={page} /><div className="docs-page-layout"><aside className="docs-on-this-page" aria-label="On this page"><span>On this page</span>{page.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</aside><div className="docs-page-body">{page.sections.map((section) => <section id={section.id} key={section.id} className="docs-section"><h2>{section.title}</h2><p>{section.body}</p>{section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}</section>)}{page.id === 'storybook' && <StorybookPanel />}{page.id === 'controls' && <ControlPreview navigate={navigate} />}{page.id === 'keyboard' && <KeyboardPreview navigate={navigate} />}</div></div></article>
}

function DocumentationDetails({ page }: { page: typeof documentation[number] }) {
  return <section className="docs-page-details" aria-labelledby="page-details-heading"><h2 id="page-details-heading">At a glance</h2><dl><div><dt>Intended use</dt><dd>{page.intendedUse}</dd></div><div><dt>Example</dt><dd>{page.example}</dd></div><div><dt>States</dt><dd>{page.states}</dd></div><div><dt>Accessibility</dt><dd>{page.accessibility}</dd></div></dl></section>
}

function ControlPreview({ navigate }: { navigate: (to: string) => void }) {
  return <Card className="docs-inline-preview"><CardHeader><div><CardTitle>Form controls in Storybook</CardTitle><CardDescription>Each component is documented with normal, disabled, invalid, loading, long-content, and narrow-layout states.</CardDescription></div></CardHeader><Separator /><CardContent><div className="docs-preview-points"><span><Check size={15} /> Locale-aware NumberInput</span><span><Check size={15} /> Checkbox and radio cards</span><span><Check size={15} /> Text, search, date, time, file, select, and textarea</span></div><AppLink to="/storybook" navigate={navigate} className="docs-inline-link">View the Forms and Search menu stories <ArrowRight size={14} /></AppLink></CardContent></Card>
}

function KeyboardPreview({ navigate }: { navigate: (to: string) => void }) {
  return <Card className="docs-inline-preview"><CardHeader><div><CardTitle>Try documentation search</CardTitle><CardDescription>Press / or Command/Control K from any non-editing context. Search results keep their page and section context.</CardDescription></div></CardHeader><CardContent><AppLink to="/" navigate={navigate}><Button variant="outline" icon={<Search size={15} />}>Return to the landing page</Button></AppLink></CardContent></Card>
}

function StorybookPanel() {
  return <Card className="docs-inline-preview"><CardHeader><div><CardTitle>Browse the catalogue locally</CardTitle><CardDescription>Run <code>npm run storybook</code> and open the local catalogue. It contains the component state examples used to keep Pango consistent.</CardDescription></div></CardHeader><CardContent><a className="button button-outline button-md" href="http://localhost:6006" target="_blank" rel="noreferrer"><ExternalLink size={15} /> Open local Storybook</a></CardContent></Card>
}

function DocumentationCollection({ title, copy, pages, navigate }: { title: string; copy: string; pages: readonly typeof documentation[number][]; navigate: (to: string) => void }) {
  return <section className="docs-collection"><div className="docs-collection-heading"><div><span className="docs-eyebrow"><span />Documentation</span><h2>{title}</h2><p>{copy}</p></div></div><div className="docs-card-grid">{pages.map((page) => { const Icon = pageIcons[page.id] ?? FileCode2; return <AppLink to={page.path} navigate={navigate} className="docs-card-link" key={page.id}><Card><CardHeader><div className="docs-card-icon"><Icon size={18} /></div><ArrowUpRight size={16} /></CardHeader><CardContent><CardTitle>{page.title}</CardTitle><CardDescription>{page.description}</CardDescription><span className="docs-card-meta">{page.sections.length} sections</span></CardContent></Card></AppLink> })}</div></section>
}

function StatLink({ icon, label, navigate, to, value }: { icon: ReactNode; label: string; navigate: (to: string) => void; to: string; value: string }) {
  return <AppLink to={to} navigate={navigate} className="docs-stat"><span>{icon}</span><strong>{value}</strong><small>{label}</small><ArrowUpRight size={14} /></AppLink>
}

function SearchResultRow({ result }: { result: SearchResult }) {
  return <><span className="docs-search-result-icon">{result.path.includes('#') ? <FileCode2 size={15} /> : <Search size={15} />}</span><span><strong>{result.title}</strong><small>{result.description}</small></span><span className="docs-search-result-group">{result.group}</span></>
}

function NotFoundPage({ navigate }: { navigate: (to: string) => void }) {
  return <section className="docs-not-found"><span className="docs-eyebrow"><span />404</span><h1>This page has moved or does not exist.</h1><p>Try the overview, browse the sidebar, or search the documentation with Command/Control K.</p><AppLink to="/" navigate={navigate}><Button>Go to overview</Button></AppLink></section>
}

function BrandMark() {
  return <span className="docs-brand-mark" aria-hidden="true"><span /><span /><span /></span>
}

function AppLink({ children, className, navigate, to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; navigate: (to: string) => void; to: string }) {
  return <a {...props} href={to} className={className} onClick={(event) => { props.onClick?.(event); if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return; event.preventDefault(); navigate(to) }}>{children}</a>
}

function findSearchResults(query: string): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase()
  const index = documentation.flatMap((page) => [{ id: page.id, path: page.path, title: page.title, description: page.description, group: page.group, searchable: [page.title, page.description, ...page.keywords].join(' ') }, ...page.sections.map((section) => ({ id: `${page.id}-${section.id}`, path: `${page.path}#${section.id}`, title: section.title, description: section.body, group: page.group, searchable: `${section.title} ${section.body}` }))])
  const matches = normalizedQuery ? index.filter((entry) => entry.searchable.toLowerCase().includes(normalizedQuery)) : index.filter((entry) => !entry.path.includes('#'))
  return matches.map(({ searchable: _searchable, ...result }) => result).slice(0, 12)
}

function groupResults(results: SearchResult[]) {
  return results.reduce<Record<string, SearchResult[]>>((groups, result) => { groups[result.group] ??= []; groups[result.group].push(result); return groups }, {})
}

export default App
