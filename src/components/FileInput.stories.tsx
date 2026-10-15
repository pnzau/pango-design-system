import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileInput, type FileUploadHandler } from './FileInput'

const meta = {
  title: 'Forms/File uploader',
  component: FileInput,
} satisfies Meta<typeof FileInput>

export default meta
type Story = StoryObj<typeof meta>

const simulateUpload: FileUploadHandler = async (file, { onProgress }) => {
  for (const progress of [20, 45, 70, 100]) {
    await new Promise((resolve) => window.setTimeout(resolve, 220))
    onProgress(progress)
  }
  if (file.name.toLowerCase().includes('fail')) throw new Error('The demo server rejected this file.')
}

export const UploadQueue: Story = {
  render: () => <FileInput label="Project files" description="Drop files here or browse from your device." allowedFileTypes={['.pdf', '.png', '.jpg']} maxFiles={5} maxFileSize={10 * 1024 * 1024} upload={simulateUpload} helperText="PDF, PNG, or JPG · 10 MB maximum per file" />,
}

export const EndpointTransport: Story = {
  render: () => <FileInput label="Endpoint-backed files" description="This example sends each file as multipart/form-data." allowedFileTypes="image/*" uploadEndpoint="/api/uploads" uploadFieldName="file" uploadHeaders={{ Authorization: 'Bearer demo-token' }} />,
}

export const InvalidState: Story = {
  render: () => <FileInput label="Required attachments" invalid error="Add at least one approved attachment before continuing." allowedFileTypes="application/pdf" />,
}
