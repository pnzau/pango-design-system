import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Settings,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import {
  AccessScope,
  AmountField,
  ApplicationShell,
  AssistantChat,
  Checklist,
  EditableList,
  GuidedTour,
  KanbanBoard,
  ProgressCard,
  type AssistantMessage,
} from "./Workflows";
import { Button, StatusChip } from "./Primitives";

const meta = {
  title: "Patterns/Product workflows",
  component: ApplicationShell,
  args: {
    brand: "Workspace",
    navigation: [],
    current: "",
    onNavigate: () => undefined,
    children: null,
  },
} satisfies Meta<typeof ApplicationShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ApplicationLayout: Story = {
  render: function ApplicationLayoutStory() {
    const [current, setCurrent] = useState("overview");
    return (
      <ApplicationShell
        brand="Workspace"
        current={current}
        onNavigate={setCurrent}
        header={
          <strong>
            {current[0]?.toUpperCase()}
            {current.slice(1)}
          </strong>
        }
        footer={
          <Button size="sm" variant="ghost">
            Account
          </Button>
        }
        navigation={[
          {
            id: "overview",
            label: "Overview",
            icon: <LayoutDashboard size={15} />,
          },
          {
            id: "wallets",
            label: "Wallets",
            icon: <WalletCards size={15} />,
            badge: "4",
          },
          {
            id: "projects",
            label: "Projects",
            icon: <FolderKanban size={15} />,
          },
          { id: "lists", label: "Lists", icon: <ListChecks size={15} /> },
          { id: "settings", label: "Settings", icon: <Settings size={15} /> },
        ]}
      >
        <ProgressCard
          title="Emergency fund"
          description="Building resilience through the year"
          value={64000}
          max={100000}
          valueLabel="KSh 64,000 saved"
          remainingLabel="KSh 36,000 to go"
        />
      </ApplicationShell>
    );
  },
};

export const AmountAndChecklist: Story = {
  render: () => (
    <div className="pango-story-workflow-grid">
      <AmountField
        defaultValue={{
          mode: "unit",
          unitPrice: 1250,
          quantity: 4,
          unit: "bags",
        }}
        unitOptions={[
          { value: "bags", label: "Bags" },
          { value: "boxes", label: "Boxes" },
          { value: "hours", label: "Hours" },
        ]}
      />
      <Checklist
        defaultValue={["milk"]}
        items={[
          {
            id: "milk",
            label: "Milk",
            description: "2 litres",
            detail: "KSh 320",
          },
          {
            id: "bread",
            label: "Bread",
            description: "Whole wheat",
            detail: "KSh 180",
          },
          {
            id: "eggs",
            label: "Eggs",
            description: "One tray",
            detail: "KSh 540",
          },
        ]}
      />
    </div>
  ),
};

export const BoardAndAccess: Story = {
  render: () => (
    <div className="pango-story-workflow-stack">
      <KanbanBoard
        columns={[
          {
            id: "planning",
            title: "Planning",
            description: "2 tasks",
            cards: [
              {
                id: "scope",
                title: "Scope the kitchen work",
                description: "Confirm measurements and material list.",
                meta: "KSh 120,000",
              },
            ],
          },
          {
            id: "active",
            title: "In progress",
            cards: [
              {
                id: "tiles",
                title: "Order tiles",
                description: "Supplier quote is ready.",
                badge: <StatusChip tone="warning">Needs review</StatusChip>,
                meta: "Due Friday",
              },
            ],
          },
          {
            id: "done",
            title: "Done",
            cards: [
              {
                id: "deposit",
                title: "Pay contractor deposit",
                description: "Receipt attached.",
                badge: <StatusChip tone="success">Complete</StatusChip>,
              },
            ],
          },
        ]}
      />
      <AccessScope
        label="Caretaker access"
        defaultValue={["riverside"]}
        items={[
          {
            id: "riverside",
            title: "Riverside Court",
            description: "Apartment · 12 units",
            detail: "Can manage",
          },
          {
            id: "acacia",
            title: "Acacia Heights",
            description: "Bedsitter block · 18 units",
            detail: "Hidden",
          },
          {
            id: "baraka",
            title: "Baraka Villas",
            description: "Standalone houses · 5 units",
            detail: "Hidden",
          },
        ]}
      />
    </div>
  ),
};

export const AssistantAndTour: Story = {
  render: function AssistantAndTourStory() {
    const [messages, setMessages] = useState<AssistantMessage[]>([]);
    const [tourOpen, setTourOpen] = useState(false);
    return (
      <div className="pango-story-workflow-stack">
        <AssistantChat
          title="Ask your workspace"
          description="Answers from your own records"
          messages={messages}
          suggestions={[
            "How much did I spend on food?",
            "When is the next service due?",
            "What is left on the emergency fund?",
          ]}
          emptyDescription="Ask a question or start with a suggested prompt."
          onSend={(message) =>
            setMessages((current) => [
              ...current,
              { id: `user-${current.length}`, role: "user", content: message },
              {
                id: `assistant-${current.length}`,
                role: "assistant",
                content: "Here is the current summary from your records.",
                detail: "KSh 24,600 this month",
              },
            ])
          }
        />
        <Button onClick={() => setTourOpen(true)}>Open onboarding tour</Button>
        <GuidedTour
          open={tourOpen}
          onOpenChange={setTourOpen}
          steps={[
            {
              id: "welcome",
              title: "Welcome to your workspace",
              description:
                "Start with the overview to understand the current position.",
            },
            {
              id: "add",
              title: "Add your first record",
              description:
                "Use the primary action to add a transaction, task, or another record.",
            },
            {
              id: "invite",
              title: "Invite the team",
              description:
                "Give each person access only to the spaces they should manage.",
            },
          ]}
        />
      </div>
    );
  },
};

export const EditableSettingsList: Story = {
  render: () => (
    <EditableList
      label="Categories"
      onAdd={() => undefined}
      onEdit={() => undefined}
      onRemove={() => undefined}
      items={[
        {
          id: "home",
          title: "Home",
          description: "Rent, utilities, repairs",
          leading: <span className="pango-story-category-dot is-home" />,
        },
        {
          id: "food",
          title: "Food",
          description: "Groceries and restaurants",
          leading: <span className="pango-story-category-dot is-food" />,
        },
        {
          id: "travel",
          title: "Travel",
          description: "Fuel and transport",
          leading: <span className="pango-story-category-dot is-travel" />,
        },
      ]}
    />
  ),
};
