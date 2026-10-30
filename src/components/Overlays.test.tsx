import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Dialog } from "./Overlays";

describe("Dialog", () => {
  it("moves focus into the dialog and restores it after Escape", async () => {
    const user = userEvent.setup();

    render(<DialogHarness />);

    const openButton = screen.getByRole("button", { name: "Open dialog" });
    await user.click(openButton);

    expect(
      screen.getByRole("dialog", { name: "Delete item" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });
});

function DialogHarness() {
  return <DialogTrigger />;
}

function DialogTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete item"
        description="This cannot be undone."
      >
        <button type="button" data-autofocus>
          Continue
        </button>
      </Dialog>
    </>
  );
}
