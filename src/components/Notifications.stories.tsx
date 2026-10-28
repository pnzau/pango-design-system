import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NotificationCenter, type NotificationItem } from "./Notifications";

const initialNotifications: readonly NotificationItem[] = [
  {
    id: "review-request",
    title: "Maya requested your review",
    description: "Q4 launch plan is ready for feedback.",
    timestamp: "8 min ago",
    tone: "info",
    action: { label: "Review" },
  },
  {
    id: "upload-complete",
    title: "Files uploaded successfully",
    description: "The campaign assets are now available to the team.",
    timestamp: "1 hour ago",
    tone: "success",
    read: true,
  },
  {
    id: "billing-warning",
    title: "Payment method expires soon",
    description: "Update your billing details before 30 November.",
    timestamp: "Yesterday",
    tone: "warning",
    action: { label: "Update" },
  },
];

const meta = {
  title: "Feedback/Notification center",
  component: NotificationCenter,
  args: {
    items: initialNotifications,
  },
} satisfies Meta<typeof NotificationCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActionableInbox: Story = {
  render: function ActionableInboxStory(args) {
    const [items, setItems] = useState<readonly NotificationItem[]>(args.items);
    const [lastAction, setLastAction] = useState("No action taken yet");

    const withActions = items.map((item) =>
      item.action
        ? {
            ...item,
            action: {
              ...item.action,
              onClick: () => setLastAction(`${item.action?.label} clicked`),
            },
          }
        : item,
    );

    return (
      <div className="pango-story-stack">
        <NotificationCenter
          {...args}
          items={withActions}
          onRead={(item) =>
            setItems((current) =>
              current.map((candidate) =>
                candidate.id === item.id
                  ? { ...candidate, read: true }
                  : candidate,
              ),
            )
          }
          onReadAll={() =>
            setItems((current) =>
              current.map((item) => ({ ...item, read: true })),
            )
          }
          onDismiss={(item) =>
            setItems((current) =>
              current.filter((candidate) => candidate.id !== item.id),
            )
          }
        />
        <small>{lastAction}</small>
      </div>
    );
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
