import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Navigation'

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const AccessibleTabs: Story = {
  args: {
    label: 'Documentation views',
    items: [
      { id: 'overview', label: 'Overview', content: <p className="pango-story-copy">Start with the component’s purpose and the task it supports.</p> },
      { id: 'usage', label: 'Usage', badge: '3', content: <p className="pango-story-copy">Use arrow keys to move between tabs, then continue into the active panel.</p> },
      { id: 'disabled', label: 'Unavailable', disabled: true, content: <p /> },
    ],
  },
}
