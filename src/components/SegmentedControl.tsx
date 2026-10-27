import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cx, useControllableState } from "../lib/utils";

export type SegmentOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = "Choose an option",
  size = "md",
  className,
}: {
  options: readonly SegmentOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [selectedValue, setSelectedValue] = useControllableState<T>({
    value,
    defaultValue: defaultValue ?? options.find((option) => !option.disabled)?.value ?? options[0]?.value ?? ("" as T),
    onChange: onValueChange,
  });
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const moveSelection = (direction: 1 | -1) => {
    const enabled = options.filter((option) => !option.disabled);
    if (!enabled.length) return;
    const currentIndex = Math.max(
      enabled.findIndex((option) => option.value === selectedValue),
      0,
    );
    const next = enabled[(currentIndex + direction + enabled.length) % enabled.length];
    if (!next) return;
    setSelectedValue(next.value);
    buttonRefs.current[next.value]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const enabled = options.filter((option) => !option.disabled);
      const next = event.key === "Home" ? enabled[0] : enabled.at(-1);
      if (!next) return;
      setSelectedValue(next.value);
      buttonRefs.current[next.value]?.focus();
    }
  };

  return (
    <div
      className={cx(
        "pango-segmented-control",
        `pango-segmented-${size}`,
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const selected = option.value === selectedValue;
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttonRefs.current[option.value] = element;
            }}
            className={cx("pango-segment", selected && "is-selected")}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            disabled={option.disabled}
            onClick={() => setSelectedValue(option.value)}
            onKeyDown={handleKeyDown}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
