import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  FilterBuilder,
  type FilterCondition,
  type FilterField,
  type SavedFilterView,
} from "./FilterBuilder";

const fields: readonly FilterField[] = [
  { id: "status", label: "Status", type: "select", options: [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In progress" },
    { value: "closed", label: "Closed" },
  ] },
  { id: "owner", label: "Owner", type: "text" },
  { id: "priority", label: "Priority", type: "select", options: [
    { value: "high", label: "High" },
    { value: "normal", label: "Normal" },
  ] },
  { id: "created", label: "Created", type: "date" },
];

const initialFilters: readonly FilterCondition[] = [
  { id: "status-filter", field: "status", operator: "is", value: "open" },
];

const initialViews: readonly SavedFilterView[] = [
  { id: "my-open-items", name: "My open items", filters: initialFilters },
];

const groupedFilters: readonly FilterCondition[] = [
  { id: "status-filter", field: "status", operator: "is", value: "open" },
  {
    id: "priority-owner-and",
    type: "and",
    rules: [
      { id: "priority-filter", field: "priority", operator: "is", value: "high" },
      { id: "owner-filter", field: "owner", operator: "contains", value: "Amina" },
    ],
  },
];

const meta = {
  title: "Data/Filter builder",
  component: FilterBuilder,
  args: {
    fields,
    defaultValue: initialFilters,
  },
} satisfies Meta<typeof FilterBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SavedViews: Story = {
  render: function SavedViewsStory(args) {
    const [filters, setFilters] = useState<readonly FilterCondition[]>(initialFilters);
    const [views, setViews] = useState<readonly SavedFilterView[]>(initialViews);

    return (
      <FilterBuilder
        {...args}
        value={filters}
        savedViews={views}
        onChange={setFilters}
        onSaveView={(view) => setViews((current) => [...current, view])}
        onDeleteView={(view) => setViews((current) => current.filter((item) => item.id !== view.id))}
      />
    );
  },
};

export const Empty: Story = {
  args: {
    defaultValue: [],
  },
};

export const AndGroups: Story = {
  args: {
    defaultValue: groupedFilters,
  },
};
