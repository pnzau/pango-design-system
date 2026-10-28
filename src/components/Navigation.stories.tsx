import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, Tabs } from "./Navigation";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  args: {
    items: [],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccessibleTabs: Story = {
  args: {
    label: "Documentation views",
    items: [
      {
        id: "overview",
        label: "Overview",
        content: (
          <p className="pango-story-copy">
            Start with the component’s purpose and the task it supports.
          </p>
        ),
      },
      {
        id: "usage",
        label: "Usage",
        badge: "3",
        content: (
          <p className="pango-story-copy">
            Use arrow keys to move between tabs, then continue into the active
            panel.
          </p>
        ),
      },
      { id: "disabled", label: "Unavailable", disabled: true, content: <p /> },
    ],
  },
};

export const MotionEnabled: Story = {
  render: () => (
    <div className="pango-story-stack">
      <Tabs
        motion
        label="Workspace views"
        items={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <p className="pango-story-copy">
                Workspace context and current work.
              </p>
            ),
          },
          {
            id: "activity",
            label: "Activity",
            content: (
              <p className="pango-story-copy">Recent changes appear here.</p>
            ),
          },
          {
            id: "members",
            label: "Members",
            content: (
              <p className="pango-story-copy">
                Six people currently have access.
              </p>
            ),
          },
        ]}
      />
      <Accordion
        motion
        type="single"
        defaultValue={["security"]}
        items={[
          {
            id: "security",
            title: "Security and access",
            content:
              "Two-factor authentication is required for workspace administrators.",
          },
          {
            id: "billing",
            title: "Billing details",
            content: "Your next invoice is due on the first of the month.",
          },
        ]}
      />
    </div>
  ),
};
