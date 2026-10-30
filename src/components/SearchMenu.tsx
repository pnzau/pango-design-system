import { Search, X } from "lucide-react";
import { createContext, forwardRef, useContext, useRef, useState } from "react";
import type {
  CSSProperties,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Spinner } from "./Core";
import {
  cx,
  useControllableState,
  useOutsidePointer,
  useStableId,
} from "../lib/utils";

type SearchMenuContextValue = {
  activeId: string | undefined;
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  listId: string;
  listRef: RefObject<HTMLDivElement | null>;
  loading: boolean;
  open: boolean;
  query: string;
  setActiveId: (id: string | undefined) => void;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
};

const SearchMenuContext = createContext<SearchMenuContextValue | null>(null);

function useSearchMenu() {
  const context = useContext(SearchMenuContext);
  if (!context)
    throw new Error("SearchMenu parts must be rendered inside SearchMenu");
  return context;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

function getEnabledItems(list: HTMLDivElement | null) {
  return list
    ? [
        ...list.querySelectorAll<HTMLButtonElement>(
          "[data-search-menu-item]:not(:disabled)",
        ),
      ]
    : [];
}

export function SearchMenu({
  children,
  className,
  defaultOpen = false,
  defaultQuery = "",
  inputRef: forwardedInputRef,
  loading = false,
  onOpenChange,
  onQueryChange,
  open,
  query,
}: {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  defaultQuery?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  loading?: boolean;
  onOpenChange?: (open: boolean) => void;
  onQueryChange?: (query: string) => void;
  open?: boolean;
  query?: string;
}) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [currentQuery, setQuery] = useControllableState({
    value: query,
    defaultValue: defaultQuery,
    onChange: onQueryChange,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const localInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputId = useStableId("search-menu-input");
  const listId = useStableId("search-menu-results");
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useOutsidePointer(isOpen, [rootRef], () => setOpen(false));

  const inputRef = forwardedInputRef ?? localInputRef;
  const value: SearchMenuContextValue = {
    activeId,
    inputId,
    inputRef,
    listId,
    listRef,
    loading,
    open: isOpen,
    query: currentQuery,
    setActiveId,
    setOpen,
    setQuery,
  };

  return (
    <SearchMenuContext.Provider value={value}>
      <div className={cx("pango-search-menu", className)} ref={rootRef}>
        {children}
      </div>
    </SearchMenuContext.Provider>
  );
}

export const SearchMenuInput = forwardRef<
  HTMLInputElement,
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange"
  > & { clearLabel?: string; shortcut?: ReactNode }
>(
  (
    {
      className,
      clearLabel = "Clear search",
      onKeyDown,
      onFocus,
      placeholder = "Search",
      shortcut,
      ...props
    },
    ref,
  ) => {
    const context = useSearchMenu();
    const setInputRef = (element: HTMLInputElement | null) => {
      context.inputRef.current = element;
      assignRef(ref, element);
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const items = getEnabledItems(context.listRef.current);
      const activeIndex = items.findIndex(
        (item) => item.id === context.activeId,
      );
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!context.open) context.setOpen(true);
        if (items.length) {
          const offset = event.key === "ArrowDown" ? 1 : -1;
          const nextIndex =
            activeIndex < 0
              ? offset > 0
                ? 0
                : items.length - 1
              : (activeIndex + offset + items.length) % items.length;
          context.setActiveId(items[nextIndex].id);
          items[nextIndex].scrollIntoView({ block: "nearest" });
        }
      }
      if (event.key === "Enter" && context.activeId) {
        const activeItem = document.getElementById(
          context.activeId,
        ) as HTMLButtonElement | null;
        if (activeItem) {
          event.preventDefault();
          activeItem.click();
        }
      }
      if (event.key === "Escape") {
        context.setOpen(false);
        context.setActiveId(undefined);
      }
      onKeyDown?.(event);
    };
    return (
      <div className={cx("pango-search-menu-input", className)}>
        <Search size={16} aria-hidden="true" />
        <input
          {...props}
          ref={setInputRef}
          id={context.inputId}
          aria-label={props["aria-label"] ?? placeholder}
          value={context.query}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={context.listId}
          aria-activedescendant={context.activeId}
          aria-expanded={context.open}
          placeholder={placeholder}
          onFocus={(event) => {
            context.setOpen(true);
            onFocus?.(event);
          }}
          onChange={(event) => {
            context.setQuery(event.target.value);
            context.setOpen(true);
            context.setActiveId(undefined);
          }}
          onKeyDown={handleKeyDown}
        />
        {shortcut && <kbd aria-hidden="true">{shortcut}</kbd>}
        {context.loading ? (
          <Spinner label="Searching" size="sm" />
        ) : (
          context.query && (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={() => {
                context.setQuery("");
                context.setActiveId(undefined);
                context.inputRef.current?.focus();
              }}
            >
              <X size={14} />
            </button>
          )
        )}
      </div>
    );
  },
);

SearchMenuInput.displayName = "SearchMenuInput";

export function SearchMenuContent({
  children,
  className,
  maxHeight = 320,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & { maxHeight?: number | string }) {
  const context = useSearchMenu();
  if (!context.open) return null;
  return (
    <div
      {...props}
      ref={context.listRef}
      id={context.listId}
      role="listbox"
      className={cx("pango-search-menu-content", className)}
      style={{ ...style, maxHeight }}
    >
      {children}
    </div>
  );
}

export function SearchMenuGroup({
  label,
  children,
  className,
}: {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("pango-search-menu-group", className)}>
      {label && <h3>{label}</h3>}
      {children}
    </section>
  );
}

export function SearchMenuItem({
  children,
  className,
  disabled = false,
  id,
  onSelect,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  onSelect?: () => void;
}) {
  const context = useSearchMenu();
  const itemId = useStableId("search-menu-item", id);
  const active = context.activeId === itemId;
  return (
    <button
      id={itemId}
      type="button"
      role="option"
      aria-selected={active}
      data-search-menu-item
      className={cx("pango-search-menu-item", active && "is-active", className)}
      disabled={disabled}
      onMouseEnter={() => context.setActiveId(itemId)}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        onSelect?.();
        context.setOpen(false);
        context.setActiveId(undefined);
      }}
    >
      {children}
    </button>
  );
}

export function SearchMenuEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="pango-search-menu-empty" role="status">
      {children}
    </div>
  );
}

export function SearchMenuVirtualList<T>({
  children,
  estimateSize = () => 56,
  getItemKey = (_, index) => index,
  height = 280,
  items,
}: {
  children: (item: T, index: number) => ReactNode;
  estimateSize?: (index: number) => number;
  getItemKey?: (item: T, index: number) => string | number;
  height?: number;
  items: readonly T[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    estimateSize,
    getItemKey: (index) => getItemKey(items[index], index),
    getScrollElement: () => scrollRef.current,
    overscan: 6,
  });
  return (
    <div
      className="pango-search-menu-virtual"
      ref={scrollRef}
      style={{ height }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            style={
              {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              } as CSSProperties
            }
          >
            {children(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export namespace SearchMenu {
  export const Input = SearchMenuInput;
  export const Content = SearchMenuContent;
  export const Group = SearchMenuGroup;
  export const Item = SearchMenuItem;
  export const Empty = SearchMenuEmpty;
  export const VirtualList = SearchMenuVirtualList;
}
