import type { Meta, StoryObj } from "@storybook/react-vite";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CollapsibleBanner,
  RadioGroup,
  Skeleton,
  SkeletonSwap,
  Spinner,
  Switch,
  Textarea,
  Tooltip,
  ValidationMessage,
} from "./Core";
import { Badge, Button, IconButton } from "./Primitives";

const meta = {
  title: "Core/Controls and surfaces",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChoiceControls: Story = {
  render: () => (
    <div className="pango-story-stack">
      <Checkbox
        label="Share product diagnostics"
        description="Includes performance and interaction metrics only."
        defaultChecked
      />
      <RadioGroup
        name="release"
        label="Release channel"
        defaultValue="stable"
        options={[
          {
            value: "stable",
            label: "Stable",
            description: "Recommended for production.",
          },
          {
            value: "early",
            label: "Early access",
            description: "See new features first.",
          },
        ]}
      />
      <Switch
        label="Notify on failed checks"
        description="Get a message when an automated check fails."
        defaultChecked
      />
    </div>
  ),
};

export const FeedbackAndLoading: Story = {
  render: () => (
    <div className="pango-story-grid">
      <Spinner />
      <Spinner size="sm" label="Saving" />
      <Skeleton className="pango-story-skeleton" />
      <ValidationMessage>
        Choose a name with at least three characters.
      </ValidationMessage>
      <Tooltip content="A concise explanation that appears after a short hover delay.">
        <IconButton label="What is this?">
          <HelpCircle size={16} />
        </IconButton>
      </Tooltip>
    </div>
  ),
};

export const SmoothAsyncFeedback: Story = {
  render: function SmoothAsyncFeedbackStory() {
    const [loading, setLoading] = useState(true);
    return (
      <div className="pango-story-stack">
        <CollapsibleBanner
          motion
          dismissible
          tone="warning"
          title="Payments are delayed"
          action={
            <Button size="sm" variant="outline">
              View status
            </Button>
          }
        >
          Charges are queued and settle automatically when the provider
          recovers.
        </CollapsibleBanner>
        <SkeletonSwap
          loading={loading}
          motion
          skeleton={
            <div className="pango-story-skeleton-swap">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          }
        >
          <Card className="pango-story-skeleton-result">
            <CardTitle>October report</CardTitle>
            <CardDescription>All figures are up to date.</CardDescription>
          </Card>
        </SkeletonSwap>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLoading((current) => !current)}
        >
          {loading ? "Show loaded content" : "Replay loading"}
        </Button>
      </div>
    );
  },
};

export const CardComposition: Story = {
  render: () => (
    <Card className="pango-story-card-composition">
      <CardHeader>
        <div>
          <CardTitle>Project details</CardTitle>
          <CardDescription>
            Keep the working context close to the record.
          </CardDescription>
        </div>
        <Badge tone="accent">Draft</Badge>
      </CardHeader>
      <CardContent>
        <Textarea
          aria-label="Project note"
          placeholder="Add a private note"
          rows={4}
        />
      </CardContent>
      <CardFooter>
        <span className="pango-story-card-status">Saved just now</span>
        <div>
          <Button variant="outline">Discard</Button>
          <Button>Save changes</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};
