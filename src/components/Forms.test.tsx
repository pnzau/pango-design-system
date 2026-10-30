import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox, NumberInput } from "./Forms";

describe("NumberInput", () => {
  it("increments by the configured step and emits the numeric value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        defaultValue={10}
        label="Amount"
        onValueChange={onValueChange}
        step={5}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Increase value" }));

    expect(screen.getByLabelText("Amount")).toHaveValue("15");
    expect(onValueChange).toHaveBeenCalledWith(15);
  });

  it("clamps typed values to the configured maximum on blur", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        defaultValue={10}
        label="Amount"
        max={100}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByLabelText("Amount");
    await user.click(input);
    await user.clear(input);
    await user.type(input, "250");
    await user.tab();

    expect(input).toHaveValue("100");
    expect(onValueChange).toHaveBeenLastCalledWith(100);
  });
});

describe("Combobox", () => {
  it("filters options and commits the selected option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Combobox
        label="Color"
        onValueChange={onValueChange}
        options={[
          { label: "Blue", value: "blue" },
          { label: "Green", value: "green" },
        ]}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Color" });
    await user.click(input);
    await user.type(input, "blu");

    const blueOption = screen.getByRole("option", { name: "Blue" });
    await user.click(within(blueOption).getByRole("button"));

    expect(input).toHaveValue("Blue");
    expect(onValueChange).toHaveBeenCalledWith("blue");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
