import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DropdownMenu,
  Popover,
  ToastProvider,
  useToast,
} from "./Overlays";
import { Button, IconButton } from "./Primitives";

const meta = {
  title: "Overlays/Actions",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DialogAndToast: Story = {
  render: function DialogAndToastStory() {
    const [open, setOpen] = useState(false);
    return (
      <ToastProvider>
        <ToastExample open={open} onOpenChange={setOpen} />
      </ToastProvider>
    );
  },
};

function ToastExample({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { notify } = useToast();
  return (
    <>
      <Button onClick={() => onOpenChange(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title="Invite a collaborator"
        description="They will receive an email with access instructions."
      >
        <div className="pango-story-stack">
          <p>Review the workspace role before sending the invitation.</p>
          <Button
            onClick={() => {
              notify({
                tone: "success",
                title: "Invitation sent",
                description: "They can join from their inbox.",
              });
              onOpenChange(false);
            }}
          >
            Send invitation
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export const Menus: Story = {
  render: () => (
    <div className="pango-story-grid">
      <Popover trigger={<Button variant="outline">Open details</Button>}>
        <strong>Team capacity</strong>
        <p className="pango-story-copy">
          You have 14 days remaining on the current plan.
        </p>
      </Popover>
      <DropdownMenu
        label="Project actions"
        trigger={
          <IconButton label="Project actions">
            <MoreHorizontal size={17} />
          </IconButton>
        }
        items={[
          { label: "Rename project" },
          { label: "Duplicate project" },
          { label: "Archive project", destructive: true },
        ]}
      />
    </div>
  ),
};
