import {
  Bell,
  Check,
  CheckCheck,
  CircleAlert,
  Info,
  CircleX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  cx,
  useControllableState,
  useEscapeKey,
  useOutsidePointer,
  useStableId,
} from "../lib/utils";
import { Button, IconButton } from "./Primitives";

export type NotificationTone = "info" | "success" | "warning" | "danger";

export type NotificationItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  tone?: NotificationTone;
  read?: boolean;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
  };
  href?: string;
};

export function NotificationCenter({
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  onRead,
  onReadAll,
  onDismiss,
  label = "Notifications",
  emptyState = "You’re all caught up.",
  className,
}: {
  items: readonly NotificationItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRead?: (item: NotificationItem) => void;
  onReadAll?: () => void;
  onDismiss?: (item: NotificationItem) => void;
  label?: string;
  emptyState?: ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [panelPosition, setPanelPosition] = useState<
    { top: number; left: number; width: number } | undefined
  >();
  const panelId = useStableId("notification-center");
  const unreadCount = items.filter((item) => !item.read).length;

  useOutsidePointer(isOpen, [rootRef], () => setIsOpen(false));
  useEscapeKey(isOpen, () => setIsOpen(false));

  useEffect(() => {
    if (!isOpen) {
      setPanelPosition(undefined);
      return;
    }

    const updatePanelPosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const viewportPadding = 16;
      const panelWidth = Math.min(
        390,
        Math.max(0, window.innerWidth - viewportPadding * 2),
      );
      const maxLeft = Math.max(
        viewportPadding,
        window.innerWidth - panelWidth - viewportPadding,
      );
      const left = Math.min(
        Math.max(viewportPadding, trigger.getBoundingClientRect().right - panelWidth),
        maxLeft,
      );

      setPanelPosition({
        top: trigger.getBoundingClientRect().bottom + 9,
        left,
        width: panelWidth,
      });
    };

    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [isOpen]);

  const markRead = (item: NotificationItem) => {
    if (!item.read) onRead?.(item);
  };

  return (
    <div className={cx("pango-notification-center", className)} ref={rootRef}>
      <span className="pango-notification-trigger-wrap" ref={triggerRef}>
        <IconButton
          label={label}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-haspopup="dialog"
          onClick={() => setIsOpen((current) => !current)}
        >
          <Bell size={17} aria-hidden="true" />
        </IconButton>
        {unreadCount > 0 && (
          <span className="pango-notification-count" aria-label={`${unreadCount} unread`}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>
      {isOpen && panelPosition && (
        <section
          className="pango-notification-panel"
          id={panelId}
          role="dialog"
          aria-label={label}
          style={panelPosition}
        >
          <header className="pango-notification-header">
            <div>
              <strong>{label}</strong>
              <small>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "Nothing needs your attention"}
              </small>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={<CheckCheck size={14} aria-hidden="true" />}
              disabled={!unreadCount || !onReadAll}
              onClick={onReadAll}
            >
              Mark all read
            </Button>
          </header>
          {items.length > 0 ? (
            <ul className="pango-notification-list">
              {items.map((item) => {
                const ToneIcon = toneIcon(item.tone);
                return (
                  <li
                    className={cx(
                      "pango-notification-item",
                      !item.read && "is-unread",
                      `is-${item.tone ?? "info"}`,
                    )}
                    key={item.id}
                  >
                    <button
                      className="pango-notification-item-main"
                      type="button"
                      onClick={() => markRead(item)}
                    >
                      <span className="pango-notification-icon">
                        {item.icon ?? <ToneIcon size={16} aria-hidden="true" />}
                      </span>
                      <span className="pango-notification-copy">
                        <strong>{item.title}</strong>
                        {item.description && <small>{item.description}</small>}
                        {item.timestamp && (
                          <span className="pango-notification-time">
                            {item.timestamp}
                          </span>
                        )}
                      </span>
                      {!item.read && (
                        <span
                          className="pango-notification-unread-dot"
                          aria-label="Unread"
                        />
                      )}
                    </button>
                    <div className="pango-notification-item-actions">
                      {item.action && (
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => {
                            markRead(item);
                            item.action?.onClick?.();
                          }}
                        >
                          {item.action.label}
                        </Button>
                      )}
                      {item.href && (
                        <a
                          className="pango-notification-link"
                          href={item.href}
                          onClick={() => markRead(item)}
                        >
                          Open
                        </a>
                      )}
                      {onDismiss && (
                        <IconButton
                          label={`Dismiss ${String(item.title)}`}
                          size="sm"
                          tone="soft"
                          onClick={() => onDismiss(item)}
                        >
                          <X size={14} aria-hidden="true" />
                        </IconButton>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="pango-notification-empty">
              <Check size={18} aria-hidden="true" />
              <span>{emptyState}</span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function toneIcon(tone: NotificationTone = "info") {
  if (tone === "success") return Check;
  if (tone === "warning") return CircleAlert;
  if (tone === "danger") return CircleX;
  return Info;
}
