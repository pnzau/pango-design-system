import { Check, ChevronRight, X } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  cx,
  useControllableState,
  useEscapeKey,
  useOutsidePointer,
  useStableId,
} from "../lib/utils";
import { IconButton } from "./Primitives";

type OpenChange = (open: boolean) => void;

export function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  className,
  closeLabel = "Close dialog",
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChange;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
}) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useStableId("dialog-title");
  const descriptionId = useStableId("dialog-description");

  useEscapeKey(isOpen, () => setIsOpen(false));

  useEffect(() => {
    if (!isOpen) return;
    lastActiveElement.current = document.activeElement as HTMLElement | null;
    const focusTarget = dialogRef.current?.querySelector<HTMLElement>(
      '[data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusTarget?.focus();
    return () => lastActiveElement.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      className="pango-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <div
        className={cx("pango-dialog", className)}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="pango-dialog-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <IconButton
            label={closeLabel}
            size="sm"
            tone="soft"
            onClick={() => setIsOpen(false)}
          >
            <X size={17} />
          </IconButton>
        </div>
        <div className="pango-dialog-body">{children}</div>
      </div>
    </div>
  );
}

export function Drawer({
  side = "right",
  ...props
}: Omit<Parameters<typeof Dialog>[0], "className"> & {
  side?: "right" | "bottom";
  className?: string;
}) {
  return (
    <Dialog
      {...props}
      className={cx("pango-drawer", `pango-drawer-${side}`, props.className)}
    />
  );
}

export function Popover({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  align = "start",
  className,
}: {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChange;
  align?: "start" | "end" | "center";
  className?: string;
}) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef<HTMLSpanElement>(null);
  useEscapeKey(isOpen, () => setIsOpen(false));
  useOutsidePointer(isOpen, [rootRef], () => setIsOpen(false));

  return (
    <span ref={rootRef} className="pango-popover-root">
      <span
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
      >
        {trigger}
      </span>
      {isOpen && (
        <span
          className={cx("pango-popover", `pango-popover-${align}`, className)}
        >
          {children}
        </span>
      )}
    </span>
  );
}

export type MenuItem = {
  label: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  shortcut?: string;
  leading?: ReactNode;
};

export function DropdownMenu({
  trigger,
  items,
  label = "Menu",
}: {
  trigger: ReactNode;
  items: readonly MenuItem[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEscapeKey(open, () => setOpen(false));
  useOutsidePointer(open, [rootRef], () => setOpen(false));
  return (
    <div className="pango-menu-root" ref={rootRef}>
      <span
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </span>
      {open && (
        <div className="pango-menu" role="menu" aria-label={label}>
          {items.map((item, index) => (
            <button
              type="button"
              role="menuitem"
              className={cx(
                "pango-menu-item",
                item.destructive && "is-destructive",
              )}
              disabled={item.disabled}
              key={`${index}-${String(item.label)}`}
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
            >
              {item.leading && (
                <span className="pango-menu-leading">{item.leading}</span>
              )}
              <span>{item.label}</span>
              {item.shortcut && <kbd>{item.shortcut}</kbd>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContextMenu({
  children,
  items,
  label = "Context menu",
}: {
  children: ReactNode;
  items: readonly MenuItem[];
  label?: string;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsidePointer(Boolean(position), [rootRef], () => setPosition(null));
  useEscapeKey(Boolean(position), () => setPosition(null));
  return (
    <div
      className="pango-context-root"
      ref={rootRef}
      onContextMenu={(event) => {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
      }}
    >
      {children}
      {position && (
        <div
          className="pango-menu pango-context-menu"
          role="menu"
          aria-label={label}
          style={
            {
              "--context-x": `${position.x}px`,
              "--context-y": `${position.y}px`,
            } as CSSProperties
          }
        >
          {items.map((item, index) => (
            <button
              type="button"
              role="menuitem"
              className={cx(
                "pango-menu-item",
                item.destructive && "is-destructive",
              )}
              key={`${index}-${String(item.label)}`}
              disabled={item.disabled}
              onClick={() => {
                item.onSelect?.();
                setPosition(null);
              }}
            >
              {item.leading && (
                <span className="pango-menu-leading">{item.leading}</span>
              )}
              <span>{item.label}</span>
              {item.shortcut && <kbd>{item.shortcut}</kbd>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Toast = {
  id: number;
  title: ReactNode;
  description?: ReactNode;
  tone: "success" | "danger" | "info";
};
const ToastContext = createContext<{
  notify: (toast: Omit<Toast, "id">) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = (toast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((previous) => [...previous, { ...toast, id }]);
    window.setTimeout(
      () => setToasts((previous) => previous.filter((item) => item.id !== id)),
      4800,
    );
  };
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        className="pango-toast-viewport"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            className={cx("pango-toast", `pango-toast-${toast.tone}`)}
            role="status"
            key={toast.id}
          >
            <Check size={16} />
            <div>
              <strong>{toast.title}</strong>
              {toast.description && <span>{toast.description}</span>}
            </div>
            <button
              aria-label="Dismiss notification"
              onClick={() =>
                setToasts((previous) =>
                  previous.filter((item) => item.id !== toast.id),
                )
              }
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: OpenChange;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <div className="pango-confirm-actions">
        <button
          className="button button-outline"
          type="button"
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </button>
        <button
          className={cx(
            "button",
            destructive ? "pango-button-danger" : "button-solid",
          )}
          type="button"
          onClick={confirm}
          disabled={pending}
        >
          {pending ? "Working…" : confirmLabel}
          <ChevronRight size={15} />
        </button>
      </div>
    </Dialog>
  );
}
