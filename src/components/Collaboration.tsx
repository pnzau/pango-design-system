import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "../lib/utils";
import { Avatar } from "./Primitives";

export type PresenceStatus = "online" | "away" | "busy" | "offline";

export function PresenceIndicator({
  status,
  label,
  showLabel = true,
  size = "md",
  className,
}: {
  status: PresenceStatus;
  label?: ReactNode;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const statusLabel = label ?? presenceLabel(status);
  return (
    <span
      className={cx(
        "pango-presence-indicator",
        `pango-presence-${size}`,
        `is-${status}`,
        className,
      )}
      role={showLabel ? "status" : "img"}
      aria-label={String(statusLabel)}
      title={String(statusLabel)}
    >
      <span className="pango-presence-dot" aria-hidden="true" />
      {showLabel && <span>{statusLabel}</span>}
    </span>
  );
}

export type AvatarGroupItem = {
  id: string;
  name: string;
  initials?: string;
  tone?: string;
  src?: string;
  status?: PresenceStatus;
  href?: string;
};

export function AvatarGroup({
  items,
  max = 4,
  size = "md",
  label = "Collaborators",
  onOverflowClick,
  className,
}: {
  items: readonly AvatarGroupItem[];
  max?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  onOverflowClick?: () => void;
  className?: string;
}) {
  const visibleItems = items.slice(0, Math.max(0, max));
  const remainingCount = Math.max(0, items.length - visibleItems.length);

  return (
    <div
      className={cx("pango-avatar-group", `pango-avatar-group-${size}`, className)}
      role="group"
      aria-label={label}
    >
      {visibleItems.map((item) => {
        const content = (
          <span className="pango-avatar-group-avatar">
            {item.src ? (
              <span className={cx("avatar", `avatar-${size}`, "pango-avatar-image")}>
                <img src={item.src} alt="" />
              </span>
            ) : (
              <Avatar
                name={item.name}
                initials={item.initials}
                tone={item.tone}
                size={size}
              />
            )}
            {item.status && (
              <PresenceIndicator status={item.status} size="sm" showLabel={false} />
            )}
          </span>
        );
        return item.href ? (
          <a
            className="pango-avatar-group-member"
            href={item.href}
            key={item.id}
            aria-label={item.name}
          >
            {content}
          </a>
        ) : (
          <span className="pango-avatar-group-member" key={item.id} title={item.name}>
            {content}
          </span>
        );
      })}
      {remainingCount > 0 && (
        <button
          className="pango-avatar-group-overflow"
          type="button"
          aria-label={`${remainingCount} more ${label.toLowerCase()}`}
          disabled={!onOverflowClick}
          onClick={onOverflowClick}
        >
          <Plus
            className="pango-avatar-group-overflow-icon"
            size={size === "lg" ? 15 : 12}
            aria-hidden="true"
          />
          <span className="pango-avatar-group-overflow-count">
            {remainingCount}
          </span>
        </button>
      )}
    </div>
  );
}

function presenceLabel(status: PresenceStatus) {
  if (status === "online") return "Online";
  if (status === "away") return "Away";
  if (status === "busy") return "Busy";
  return "Offline";
}
