import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox, CheckboxCard, RadioCard, RadioGroup, Switch, Textarea } from './Core'
import { AutosaveStatus, Calendar, Combobox, DatePicker, DateRangePicker, MultiSelect, NumberInput, SearchField, TimePicker } from './Forms'
import { FileInput } from './FileInput'
import { PhoneInput } from './PhoneInput'
import { Button, Input, InputField, Select } from './Primitives'

const meta = {
  title: 'Forms/All controls',
  component: SearchField,
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

const people = [
  { value: 'maya', label: 'Maya Imani', keywords: ['designer'] },
  { value: 'chidi', label: 'Chidi Nwosu', keywords: ['engineer'] },
  { value: 'taylor', label: 'Taylor Okafor', keywords: ['operations'] },
]

const timezones = [
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'America/New_York', label: 'America/New York' },
]

export const TextAndSpecialisedInputs: Story = {
  render: () => <div className="pango-story-form-grid">
    <InputField label="Project name" labelFor="project-name" description="Visible to workspace members."><Input id="project-name" defaultValue="Northstar" required /></InputField>
    <InputField label="Email address" labelFor="project-email"><Input id="project-email" type="email" placeholder="name@example.com" /></InputField>
    <InputField label="Password" labelFor="project-password" helperText="Use at least twelve characters."><Input id="project-password" type="password" defaultValue="pango-secret" /></InputField>
    <InputField label="Website" labelFor="project-site"><Input id="project-site" type="url" placeholder="https://example.com" /></InputField>
    <PhoneInput id="project-phone" label="Phone number" defaultCountry="KE" placeholder="+254 700 000 000" />
    <InputField label="Search projects" labelFor="project-search"><SearchField id="project-search" placeholder="Search projects" onDebouncedChange={() => undefined} /></InputField>
    <InputField helperText="This unlabeled inline control still aligns from the top edge."><Input aria-label="Internal project note" placeholder="Unlabelled inline value" /></InputField>
    <DatePicker label="Start date" defaultValue="2026-10-07" />
    <TimePicker label="Meeting time" defaultValue="09:30" />
    <FileInput id="project-file" label="Project file" helperText="PDF, CSV, or image; 10 MB maximum." allowedFileTypes={['application/pdf', 'text/csv', 'image/*']} maxFileSize={10 * 1024 * 1024} />
    <InputField label="Project notes" labelFor="project-notes"><Textarea id="project-notes" placeholder="Add a short note for the team" rows={4} /></InputField>
    <InputField label="Project code" labelFor="project-code" action={<Button size="sm" variant="outline">Generate</Button>}><Input id="project-code" defaultValue="pg-2026-014" /></InputField>
    <InputField label="Workspace slug" labelFor="workspace-slug" error="Use lowercase letters, numbers, and hyphens."><Input id="workspace-slug" invalid defaultValue="Pango Team" /></InputField>
  </div>,
}

export const LocaleAwareNumberInput: Story = {
  render: function NumberInputStory() {
    const [budget, setBudget] = useState<number | undefined>(1000)
    return <div className="pango-story-stack"><NumberInput label="Monthly budget" value={budget} onValueChange={setBudget} min={0} step={100} locale="en-US" /><p className="pango-story-value">Raw numeric value: <code>{budget ?? 'undefined'}</code></p><NumberInput label="German formatting" defaultValue={1234.5} step={0.1} locale="de-DE" /><AutosaveStatus state="saved" updatedAt="just now" /></div>
  },
}

export const FieldStatesAndNarrowLayout: Story = {
  render: () => <div className="pango-story-narrow"><Input label="Workspace name used in contracts and customer-facing receipts" defaultValue="Pango Operations" required hint="This is visible to workspace members." /><Input label="Read-only workspace ID" defaultValue="wrk_24RNY" readOnly /><Input label="Unavailable owner" defaultValue="Maya Imani" disabled /><NumberInput label="Settlement amount" defaultValue={1200} locale="en-US" invalid hint="The amount exceeds the current settlement limit." /><NumberInput label="Saving transfer amount" defaultValue={1000} locale="en-US" loading /></div>,
}

export const SelectionControls: Story = {
  render: function SelectionControlsStory() {
    const [person, setPerson] = useState('maya')
    const [team, setTeam] = useState(['maya'])
    const [plan, setPlan] = useState('team')
    return <div className="pango-story-stack"><Checkbox label="Share product diagnostics" description="Includes performance and interaction metrics only." defaultChecked /><Switch label="Notify on failed checks" description="Get a message when an automated check fails." defaultChecked /><RadioGroup name="release" label="Release channel" defaultValue="stable" options={[{ value: 'stable', label: 'Stable', description: 'Recommended for production.' }, { value: 'early', label: 'Early access', description: 'See new features first.' }]} /><Select label="Timezone" options={timezones} defaultValue="Africa/Nairobi" /><Combobox label="Project lead" options={people} value={person} onValueChange={setPerson} /><MultiSelect options={people} value={team} onValueChange={setTeam} /><div className="pango-story-card-options"><CheckboxCard label="Keep activity history" description="Retain a read-only audit trail for this workspace." value="30 days" defaultChecked /><CheckboxCard label="Record the configuration history needed to explain a change months after it happened" description="Long copy demonstrates how card choices stay readable in a narrow container." value="90 days" /><RadioCard name="plan" value="starter" checked={plan === 'starter'} onCheckedChange={() => setPlan('starter')} label="Starter" description="For a small product team." /><RadioCard name="plan" value="team" checked={plan === 'team'} onCheckedChange={() => setPlan('team')} label="Team" description="For multiple projects and collaborators." /><CheckboxCard label="Unavailable option" description="Shown as disabled while preserving the option’s context." disabled /></div></div>
  },
}

export const DateControls: Story = {
  render: () => <div className="pango-story-stack"><DatePicker label="Invoice date" defaultValue="2026-10-07" /><DateRangePicker label="Billing period" defaultValue={{ start: '2026-10-07', end: '2026-10-14' }} /><TimePicker label="Review time" defaultValue="09:30" min="08:00" max="18:00" /><Calendar defaultValue={new Date(2026, 9, 7)} /></div>,
}

export const CalendarMonthAndYearPicker: Story = {
  render: () => <Calendar defaultValue={new Date(2026, 9, 7)} defaultView="months" />,
}

export const TimePickerQuickSelection: Story = {
  render: () => <TimePicker label="Select a time" defaultValue="13:30" defaultOpen step={15} min="08:00" max="18:00" />,
}

export const DateRangeIncomplete: Story = {
  render: () => <DateRangePicker label="Incomplete range" defaultValue={{ start: '2026-10-07' }} />,
}

export const DateRangeHoverPreview: Story = {
  render: () => <DateRangePicker label="Hover to preview the end date" defaultValue={{ start: '2026-10-07' }} defaultOpen />,
}

export const DateRangeSelected: Story = {
  render: () => <DateRangePicker label="Selected range" defaultValue={{ start: '2026-10-07', end: '2026-10-14' }} />,
}

export const DateRangeCleared: Story = {
  render: () => <DateRangePicker label="Cleared range" placeholder="No dates selected" />,
}
