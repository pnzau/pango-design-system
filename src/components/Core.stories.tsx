import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelpCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, RadioGroup, Separator, Skeleton, Spinner, Switch, Textarea, Tooltip, ValidationMessage } from './Core'
import { Button, IconButton } from './Primitives'

const meta = {
  title: 'Core/Controls and surfaces',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const ChoiceControls: Story = {
  render: () => <div className="pango-story-stack"><Checkbox label="Share product diagnostics" description="Includes performance and interaction metrics only." defaultChecked /><RadioGroup name="release" label="Release channel" defaultValue="stable" options={[{ value: 'stable', label: 'Stable', description: 'Recommended for production.' }, { value: 'early', label: 'Early access', description: 'See new features first.' }]} /><Switch label="Notify on failed checks" description="Get a message when an automated check fails." defaultChecked /></div>,
}

export const FeedbackAndLoading: Story = {
  render: () => <div className="pango-story-grid"><Spinner /><Spinner size="sm" label="Saving" /><Skeleton className="pango-story-skeleton" /><ValidationMessage>Choose a name with at least three characters.</ValidationMessage><Tooltip content="A concise explanation that appears after a short hover delay."><IconButton label="What is this?"><HelpCircle size={16} /></IconButton></Tooltip></div>,
}

export const CardComposition: Story = {
  render: () => <Card className="pango-story-surface"><CardHeader><div><CardTitle>Billing contact</CardTitle><CardDescription>Used for invoices and renewal notices.</CardDescription></div></CardHeader><Separator /><CardContent><Textarea aria-label="Billing note" placeholder="Add a private note" rows={4} /></CardContent><CardFooter><Button variant="outline">Discard</Button><Button>Save contact</Button></CardFooter></Card>,
}
