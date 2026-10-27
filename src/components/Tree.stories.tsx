import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TreeSelect, TreeView, type TreeNode } from "./Tree";

const nodes: readonly TreeNode[] = [
  {
    id: "northstar",
    label: "Northstar workspace",
    description: "24 members",
    children: [
      {
        id: "product",
        label: "Product",
        children: [
          { id: "roadmap", label: "Roadmap" },
          { id: "research", label: "Research" },
        ],
      },
      {
        id: "operations",
        label: "Operations",
        children: [
          { id: "finance", label: "Finance" },
          { id: "people", label: "People" },
        ],
      },
    ],
  },
  {
    id: "atlas",
    label: "Atlas workspace",
    description: "8 members",
    children: [{ id: "shared", label: "Shared files" }],
  },
];

const meta = {
  title: "Navigation/Tree",
  component: TreeView,
  args: {
    nodes,
    defaultExpandedIds: ["northstar", "product"],
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NestedWorkspaces: Story = {
  render: function NestedWorkspacesStory(args) {
    const [selectedId, setSelectedId] = useState("roadmap");

    return (
      <div className="pango-story-grid pango-story-wide">
        <TreeView
          {...args}
          selectedId={selectedId}
          onSelectionChange={(selection) => setSelectedId(String(selection))}
        />
        <TreeSelect
          label="Workspace location"
          nodes={nodes}
          defaultValue="roadmap"
          defaultExpandedIds={["northstar", "product"]}
          description="Choose a nested folder or workspace."
        />
      </div>
    );
  },
};

export const MultipleSelection: Story = {
  args: {
    selectionMode: "multiple",
    defaultSelectedIds: ["roadmap", "research"],
    label: "Permission scope",
  },
};
