import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileCode2, Globe2, MapPin, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SearchMenu } from './SearchMenu'

const meta = {
  title: 'Forms/Search menu',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const documentation = [
  { group: 'Foundations', id: 'tokens', title: 'Tokens', copy: 'Colour, type, spacing, radius, and motion.' },
  { group: 'Primitives', id: 'number', title: 'NumberInput', copy: 'Locale-aware grouped numeric values.' },
  { group: 'Patterns', id: 'table', title: 'Data table', copy: 'Semantic tables with opt-in TanStack features.' },
]

const countries = ['Argentina', 'Australia', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Denmark', 'Egypt', 'Estonia', 'Finland', 'France', 'Germany', 'Ghana', 'India', 'Indonesia', 'Japan', 'Kenya', 'Mexico', 'Morocco', 'Netherlands', 'Nigeria', 'Norway', 'Portugal', 'Rwanda', 'South Africa', 'Spain', 'Sweden', 'Tanzania', 'Uganda', 'United Kingdom', 'United States', 'Vietnam', 'Zambia'].flatMap((country, index) => Array.from({ length: 8 }, (_, duplicate) => ({ id: `${country}-${duplicate}`, name: country, code: `${index + 1}-${duplicate + 1}` })))

export const GroupedDocumentationResults: Story = {
  render: function GroupedDocumentationResultsStory() {
    const [query, setQuery] = useState('')
    const results = useMemo(() => documentation.filter((item) => `${item.title} ${item.copy}`.toLowerCase().includes(query.toLowerCase())), [query])
    return <SearchMenu className="pango-story-search-menu" query={query} onQueryChange={setQuery} defaultOpen><SearchMenu.Input placeholder="Search documentation" /> <SearchMenu.Content>{results.map((item) => <SearchMenu.Group label={item.group} key={item.id}><SearchMenu.Item id={item.id} onSelect={() => undefined}><span className="pango-story-search-icon"><FileCode2 size={15} /></span><span><strong>{item.title}</strong><small>{item.copy}</small></span></SearchMenu.Item></SearchMenu.Group>)}{!results.length && <SearchMenu.Empty>No results. Try “table” or “tokens”.</SearchMenu.Empty>}</SearchMenu.Content></SearchMenu>
  },
}

export const LoadingAndEmptyStates: Story = {
  render: () => <div className="pango-story-search-pair"><SearchMenu className="pango-story-search-menu" defaultOpen loading defaultQuery="data"><SearchMenu.Input /><SearchMenu.Content><SearchMenu.Empty>Looking for matching records…</SearchMenu.Empty></SearchMenu.Content></SearchMenu><SearchMenu className="pango-story-search-menu" defaultOpen defaultQuery="qwerty"><SearchMenu.Input /><SearchMenu.Content><SearchMenu.Empty>No items match “qwerty”.</SearchMenu.Empty></SearchMenu.Content></SearchMenu></div>,
}

export const ScrollableCardResults: Story = {
  render: () => <SearchMenu className="pango-story-search-menu" defaultOpen><SearchMenu.Input placeholder="Search product patterns" /><SearchMenu.Content maxHeight={238}>{Array.from({ length: 16 }, (_, index) => <SearchMenu.Item className="pango-search-menu-card" id={`card-${index}`} key={index} onSelect={() => undefined}><span className="pango-story-search-icon"><Search size={15} /></span><span><strong>Product pattern {index + 1}</strong><small>Rich search content can hold context, a description, and supporting metadata.</small></span><span className="pango-story-search-meta">Pattern</span></SearchMenu.Item>)}</SearchMenu.Content></SearchMenu>,
}

export const VirtualisedCountries: Story = {
  render: function VirtualisedCountriesStory() {
    const [query, setQuery] = useState('')
    const matches = useMemo(() => countries.filter((country) => country.name.toLowerCase().includes(query.toLowerCase())), [query])
    return <SearchMenu className="pango-story-search-menu" query={query} onQueryChange={setQuery} defaultOpen><SearchMenu.Input placeholder="Search countries" /><SearchMenu.Content maxHeight="none"><SearchMenu.VirtualList items={matches} height={280} getItemKey={(country) => country.id}>{(country) => <SearchMenu.Item id={country.id} onSelect={() => undefined}><span className="pango-story-search-icon"><Globe2 size={15} /></span><span><strong>{country.name}</strong><small>Country collection example</small></span><span className="pango-story-search-meta"><MapPin size={13} /> {country.code}</span></SearchMenu.Item>}</SearchMenu.VirtualList>{!matches.length && <SearchMenu.Empty>No countries match “{query}”.</SearchMenu.Empty>}</SearchMenu.Content></SearchMenu>
  },
}

export const KeyboardNavigation: Story = {
  render: () => <SearchMenu className="pango-story-search-menu" defaultOpen><SearchMenu.Input placeholder="Use the arrow keys, Enter, and Escape" shortcut="⌘ K" /><SearchMenu.Content><SearchMenu.Group label="Keyboard behaviour"><SearchMenu.Item id="first" onSelect={() => undefined}><span className="pango-story-search-icon">1</span><span><strong>Arrow keys move the active result</strong><small>The input retains focus and exposes the active option.</small></span></SearchMenu.Item><SearchMenu.Item id="second" onSelect={() => undefined}><span className="pango-story-search-icon">2</span><span><strong>Enter selects the active result</strong><small>Escape closes the menu without moving focus away.</small></span></SearchMenu.Item></SearchMenu.Group></SearchMenu.Content></SearchMenu>,
}
