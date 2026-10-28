import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Bell, Plus } from "lucide-react";
import {
  AsyncButton,
  Avatar,
  Badge,
  Button,
  CopyButton,
  IconButton,
  Input,
  Select,
  StatusChip,
  Surface,
} from "./Primitives";

const meta = {
  title: "Core/Primitives",
  component: Button,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  render: () => (
    <div className="pango-story-grid">
      <Button>Save changes</Button>
      <Button variant="outline" icon={<Plus size={15} />}>
        Create item
      </Button>
      <Button variant="soft" iconAfter={<ArrowRight size={15} />}>
        Continue
      </Button>
      <Button variant="ghost">Cancel</Button>
      <Button loading>Saving</Button>
      <Button disabled>Unavailable</Button>
      <IconButton label="Notifications">
        <Bell size={17} />
      </IconButton>
    </div>
  ),
};

export const FeedbackButtons: Story = {
  render: () => (
    <div className="pango-story-grid">
      <AsyncButton
        pendingLabel="Publishing…"
        successLabel="Published"
        errorLabel="Retry"
        onAction={() =>
          new Promise((resolve) => window.setTimeout(resolve, 750))
        }
      >
        Publish
      </AsyncButton>
      <CopyButton showLabel value="https://pango.design/components" />
      <CopyButton value="pango-design-system" />
    </div>
  ),
};

export const Inputs: Story = {
  render: () => (
    <div className="pango-story-stack">
      <Input label="Workspace name" defaultValue="Pango Studio" />
      <Input
        label="API key"
        invalid
        hint="This key is no longer active."
        defaultValue="pk_live_…"
      />
      <Select label="Timezone" defaultValue="Africa/Nairobi">
        <option>Africa/Nairobi</option>
        <option>Europe/London</option>
        <option>America/New_York</option>
      </Select>
    </div>
  ),
};

export const StatusAndIdentity: Story = {
  render: () => (
    <div className="pango-story-grid">
      <Avatar name="Taylor Okafor" />
      <Avatar initials="NK" tone="violet" size="lg" />
      <Badge tone="accent">New</Badge>
      <Badge tone="blue">Team</Badge>
      <StatusChip tone="success">Healthy</StatusChip>
      <StatusChip tone="warning">Needs review</StatusChip>
      <StatusChip tone="danger">Blocked</StatusChip>
    </div>
  ),
};

export const SurfaceExample: Story = {
  render: () => (
    <Surface as="article" className="pango-story-surface">
      <Badge tone="accent">Workspace</Badge>
      <h3>Quiet software, clear decisions.</h3>
      <p>
        Semantic colors and spacing tokens provide the structure; product
        content provides the emphasis.
      </p>
    </Surface>
  ),
};
