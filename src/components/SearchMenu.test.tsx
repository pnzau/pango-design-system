import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  SearchMenu,
  SearchMenuContent,
  SearchMenuInput,
  SearchMenuItem,
} from "./SearchMenu";

describe("SearchMenu", () => {
  it("selects the active item with ArrowDown and Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <SearchMenu defaultOpen>
        <SearchMenuInput placeholder="Search components" />
        <SearchMenuContent>
          <SearchMenuItem onSelect={onSelect}>Button</SearchMenuItem>
          <SearchMenuItem onSelect={onSelect}>Dialog</SearchMenuItem>
        </SearchMenuContent>
      </SearchMenu>,
    );

    const input = screen.getByRole("combobox", { name: "Search components" });
    await user.click(input);
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
