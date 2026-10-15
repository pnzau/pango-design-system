import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { PhoneInput } from './PhoneInput'

const meta = {
  title: 'Forms/Phone input',
  component: PhoneInput,
} satisfies Meta<typeof PhoneInput>

export default meta
type Story = StoryObj<typeof meta>

export const LazyFormatting: Story = {
  render: function LazyFormattingStory() {
    const [phone, setPhone] = useState('')
    return <div className="pango-story-stack">
      <PhoneInput label="Kenya phone number" defaultCountry="KE" value={phone} onValueChange={setPhone} placeholder="0700 000000" />
      <p className="pango-story-value">E.164 value: <code>{phone || 'incomplete'}</code></p>
    </div>
  },
}
