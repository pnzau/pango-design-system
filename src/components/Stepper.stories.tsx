import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Stepper } from './Data'
import { Button } from './Primitives'

const meta = {
  title: 'Navigation/Stepper',
  component: Stepper,
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

const steps = [
  { label: 'Choose files', description: 'Select the files to upload.' },
  { label: 'Upload files', description: 'Send the selected files.' },
]

export const UploadFlow: Story = {
  args: {
    steps,
    current: 0,
  },
  render: function UploadFlowStory(args) {
    const [current, setCurrent] = useState(args.current)

    return (
      <div className="pango-story-stack pango-story-wide">
        <Stepper {...args} current={current} onStepChange={setCurrent} />
        <div className="pango-story-actions">
          <Button
            variant="outline"
            size="sm"
            disabled={current === 0}
            onClick={() => setCurrent((step) => Math.max(0, step - 1))}
          >
            Back
          </Button>
          <Button
            size="sm"
            disabled={current === args.steps.length - 1}
            onClick={() =>
              setCurrent((step) => Math.min(args.steps.length - 1, step + 1))
            }
          >
            Continue
          </Button>
        </div>
      </div>
    )
  },
}
