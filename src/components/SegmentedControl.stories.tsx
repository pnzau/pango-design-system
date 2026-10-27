import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SegmentedControl, type SegmentOption } from "./SegmentedControl";

const viewOptions: readonly SegmentOption[] = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
];

const meta = {
  title: "Forms/Segmented control",
  component: SegmentedControl,
  args: {
    options: viewOptions,
    defaultValue: "list",
    ariaLabel: "Display mode",
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DisplayMode: Story = {
  render: function DisplayModeStory(args) {
    const [value, setValue] = useState("list");

    return (
      <div className="pango-story-stack">
        <SegmentedControl {...args} value={value} onValueChange={setValue} />
        <small>Selected: {value}</small>
      </div>
    );
  },
};

export const Compact: Story = {
  args: {
    size: "sm",
    options: [
      { value: "all", label: "All" },
      { value: "mine", label: "Mine" },
      { value: "archived", label: "Archived", disabled: true },
    ],
    defaultValue: "all",
  },
};
