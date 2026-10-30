import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Primitives";
import { Switch } from "./Core";

describe("Button", () => {
  it("disables itself and exposes a busy state while loading", () => {
    render(<Button loading>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toBeDisabled();
    expect(button.querySelector(".spin")).toBeInTheDocument();
  });
});

describe("Switch", () => {
  it("toggles through a real user click and reports the new value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Switch
        defaultChecked={false}
        label="Enable notifications"
        onCheckedChange={onCheckedChange}
      />,
    );

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
