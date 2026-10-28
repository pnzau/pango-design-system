import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AvatarGroup,
  PresenceIndicator,
  type AvatarGroupItem,
} from "./Collaboration";

const collaborators: readonly AvatarGroupItem[] = [
  { id: "maya", name: "Maya Otieno", status: "online", tone: "violet" },
  { id: "daniel", name: "Daniel Kimani", status: "busy", tone: "blue" },
  { id: "aisha", name: "Aisha Noor", status: "away", tone: "green" },
  { id: "leo", name: "Leo Martins", status: "offline", tone: "orange" },
  { id: "sam", name: "Sam Wambui", status: "online", tone: "pink" },
];

const meta = {
  title: "Collaboration/Presence",
  component: AvatarGroup,
  args: {
    items: collaborators,
    max: 4,
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TeamMembers: Story = {
  render: function TeamMembersStory(args) {
    return (
      <div className="pango-story-stack">
        <AvatarGroup {...args} onOverflowClick={() => undefined} />
        <div className="pango-story-row">
          <PresenceIndicator status="online" />
          <PresenceIndicator status="away" />
          <PresenceIndicator status="busy" />
          <PresenceIndicator status="offline" />
        </div>
      </div>
    );
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    max: 3,
  },
};

export const LivePresence: Story = {
  args: {
    pulseOnline: true,
  },
};
