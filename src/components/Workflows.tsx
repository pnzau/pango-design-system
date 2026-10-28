import {
  Check,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cx, useControllableState } from "../lib/utils";
import { Checkbox, Card } from "./Core";
import { Money, Progress } from "./Data";
import { NumberInput } from "./Forms";
import { Dialog } from "./Overlays";
import { Button, IconButton, Input, Select } from "./Primitives";
import { SegmentedControl } from "./SegmentedControl";

export type AppNavigationItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
};

export function ApplicationShell({
  brand,
  navigation,
  current,
  onNavigate,
  header,
  footer,
  children,
  className,
}: {
  brand: ReactNode;
  navigation: readonly AppNavigationItem[];
  current: string;
  onNavigate: (id: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("pango-application-shell", className)}>
      <aside className="pango-application-sidebar">
        <div className="pango-application-brand">{brand}</div>
        <nav aria-label="Application navigation">
          {navigation.map((item) => {
            const selected = item.id === current;
            return (
              <button
                type="button"
                className={cx(selected && "is-current")}
                key={item.id}
                disabled={item.disabled}
                aria-current={selected ? "page" : undefined}
                onClick={() => onNavigate(item.id)}
              >
                {item.icon && (
                  <span className="pango-application-nav-icon">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="pango-application-nav-badge">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        {footer && (
          <div className="pango-application-sidebar-footer">{footer}</div>
        )}
      </aside>
      <div className="pango-application-main">
        {header && (
          <header className="pango-application-header">{header}</header>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}

export type AmountMode = "flat" | "unit";

export type AmountFieldValue = {
  mode: AmountMode;
  amount?: number;
  unitPrice?: number;
  quantity?: number;
  unit?: string;
};

export type AmountUnitOption = {
  value: string;
  label: ReactNode;
};

export function AmountField({
  value,
  defaultValue = { mode: "flat" },
  onValueChange,
  currency = "KES",
  locale = "en-KE",
  label = "Amount",
  unitOptions = [],
  className,
}: {
  value?: AmountFieldValue;
  defaultValue?: AmountFieldValue;
  onValueChange?: (value: AmountFieldValue) => void;
  currency?: string;
  locale?: string;
  label?: ReactNode;
  unitOptions?: readonly AmountUnitOption[];
  className?: string;
}) {
  const [amount, setAmount] = useControllableState<AmountFieldValue>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const total = (amount.unitPrice ?? 0) * (amount.quantity ?? 0);
  const effectiveAmount = amount.mode === "unit" ? total : (amount.amount ?? 0);
  const update = (change: Partial<AmountFieldValue>) =>
    setAmount((current) => ({ ...current, ...change }));

  return (
    <section className={cx("pango-amount-field", className)}>
      <header>
        <span className="field-label">{label}</span>
        <SegmentedControl
          ariaLabel="Amount calculation"
          size="sm"
          value={amount.mode}
          onValueChange={(mode) => {
            update({
              mode,
              unit:
                mode === "unit"
                  ? (amount.unit ?? unitOptions[0]?.value)
                  : amount.unit,
            });
          }}
          options={[
            { value: "flat", label: "Flat amount" },
            { value: "unit", label: "Price × quantity" },
          ]}
        />
      </header>
      {amount.mode === "flat" ? (
        <NumberInput
          prefix={currency}
          aria-label={`${String(label)} in ${currency}`}
          value={amount.amount}
          onValueChange={(nextValue) => update({ amount: nextValue })}
          locale={locale}
          formatOptions={{ maximumFractionDigits: 2 }}
          placeholder="0"
        />
      ) : (
        <>
          <div className="pango-amount-unit-inputs">
            <NumberInput
              label={`Unit price (${currency})`}
              value={amount.unitPrice}
              onValueChange={(nextValue) => update({ unitPrice: nextValue })}
              locale={locale}
              formatOptions={{ maximumFractionDigits: 2 }}
              placeholder="0"
            />
            <NumberInput
              label="Quantity"
              value={amount.quantity}
              onValueChange={(nextValue) => update({ quantity: nextValue })}
              formatOptions={{ maximumFractionDigits: 3 }}
              placeholder="0"
            />
            <div className="pango-amount-unit-select">
              <span className="field-label">Unit</span>
              <Select
                aria-label="Unit"
                value={amount.unit ?? ""}
                placeholder="Select a unit"
                onValueChange={(unit) => update({ unit })}
                options={unitOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
              />
            </div>
          </div>
          <div className="pango-amount-total" aria-live="polite">
            <span>
              {formatAmount(amount.unitPrice ?? 0, currency, locale)} ×{" "}
              {amount.quantity ?? 0} {unitLabel(amount.unit, unitOptions)}
            </span>
            <Money value={total} currency={currency} locale={locale} />
          </div>
        </>
      )}
      {amount.mode === "flat" && effectiveAmount > 0 && (
        <small>{formatAmount(effectiveAmount, currency, locale)}</small>
      )}
    </section>
  );
}

export type KanbanCardItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
};

export type KanbanColumn = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  cards: readonly KanbanCardItem[];
  action?: ReactNode;
};

export function KanbanBoard({
  columns,
  onCardClick,
  className,
}: {
  columns: readonly KanbanColumn[];
  onCardClick?: (card: KanbanCardItem, column: KanbanColumn) => void;
  className?: string;
}) {
  return (
    <div className={cx("pango-kanban-board", className)}>
      {columns.map((column) => (
        <section className="pango-kanban-column" key={column.id}>
          <header>
            <div>
              <h3>{column.title}</h3>
              {column.description && <p>{column.description}</p>}
            </div>
            <span>{column.cards.length}</span>
            {column.action}
          </header>
          <div className="pango-kanban-cards">
            {column.cards.map((card) => {
              const interactive = Boolean(onCardClick);
              const content = (
                <>
                  <div className="pango-kanban-card-heading">
                    <h4>{card.title}</h4>
                    {card.badge && <span>{card.badge}</span>}
                  </div>
                  {card.description && <p>{card.description}</p>}
                  {(card.meta || card.action) && (
                    <footer>
                      {card.meta && <span>{card.meta}</span>}
                      {card.action}
                    </footer>
                  )}
                </>
              );
              return interactive ? (
                <button
                  type="button"
                  className="pango-kanban-card"
                  key={card.id}
                  onClick={() => onCardClick?.(card, column)}
                >
                  {content}
                </button>
              ) : (
                <article className="pango-kanban-card" key={card.id}>
                  {content}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ProgressCard({
  title,
  description,
  value,
  max,
  valueLabel,
  remainingLabel,
  tone = "accent",
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  value: number;
  max: number;
  valueLabel?: ReactNode;
  remainingLabel?: ReactNode;
  tone?: "accent" | "success" | "warning" | "danger";
  action?: ReactNode;
  className?: string;
}) {
  const percent = max > 0 ? Math.round((Math.max(0, value) / max) * 100) : 0;
  return (
    <Card className={cx("pango-progress-card", `is-${tone}`, className)}>
      <header>
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {action}
      </header>
      <Progress value={value} max={max} showValue />
      <footer>
        <span>{valueLabel ?? `${percent}% complete`}</span>
        {remainingLabel && <span>{remainingLabel}</span>}
      </footer>
    </Card>
  );
}

export type ChecklistItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  detail?: ReactNode;
  disabled?: boolean;
};

export function Checklist({
  items,
  value,
  defaultValue = [],
  onValueChange,
  onItemAction,
  className,
}: {
  items: readonly ChecklistItem[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (ids: readonly string[]) => void;
  onItemAction?: (item: ChecklistItem) => void;
  className?: string;
}) {
  const [checkedIds, setCheckedIds] = useControllableState<readonly string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const checked = useMemo(() => new Set(checkedIds), [checkedIds]);
  const toggle = (id: string) =>
    setCheckedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );

  return (
    <ul className={cx("pango-checklist", className)}>
      {items.map((item) => {
        const isChecked = checked.has(item.id);
        return (
          <li className={cx(isChecked && "is-checked")} key={item.id}>
            <Checkbox
              label={item.label}
              description={item.description}
              checked={isChecked}
              disabled={item.disabled}
              onChange={() => toggle(item.id)}
            />
            {item.detail && (
              <span className="pango-checklist-detail">{item.detail}</span>
            )}
            {onItemAction && (
              <IconButton
                label={`Edit ${String(item.label)}`}
                size="sm"
                tone="soft"
                onClick={() => onItemAction(item)}
              >
                <Pencil size={13} aria-hidden="true" />
              </IconButton>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export type AccessScopeItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  detail?: ReactNode;
  disabled?: boolean;
};

export function AccessScope({
  items,
  value,
  defaultValue = [],
  onValueChange,
  label = "Access scope",
  emptyMessage = "No items are available.",
  className,
}: {
  items: readonly AccessScopeItem[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (ids: readonly string[]) => void;
  label?: ReactNode;
  emptyMessage?: ReactNode;
  className?: string;
}) {
  const [selectedIds, setSelectedIds] = useControllableState<readonly string[]>(
    {
      value,
      defaultValue,
      onChange: onValueChange,
    },
  );
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const toggle = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );

  return (
    <section
      className={cx("pango-access-scope", className)}
      aria-label={String(label)}
    >
      <header>
        <div>
          <span className="field-label">{label}</span>
          <small>
            {selectedIds.length
              ? `${selectedIds.length} of ${items.length} selected`
              : "No access selected"}
          </small>
        </div>
      </header>
      {items.length === 0 ? (
        <p className="pango-access-scope-empty">{emptyMessage}</p>
      ) : (
        <ul>
          {items.map((item) => {
            const isSelected = selected.has(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={cx(isSelected && "is-selected")}
                  disabled={item.disabled}
                  aria-pressed={isSelected}
                  onClick={() => toggle(item.id)}
                >
                  <span className="pango-access-scope-check" aria-hidden="true">
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    {item.description && <small>{item.description}</small>}
                  </span>
                  {item.detail && <em>{item.detail}</em>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  content: ReactNode;
  detail?: ReactNode;
};

export function AssistantChat({
  title = "Assistant",
  description,
  messages,
  suggestions = [],
  value,
  defaultValue = "",
  onValueChange,
  onSend,
  placeholder = "Ask a question…",
  emptyTitle = "What would you like to know?",
  emptyDescription,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  messages: readonly AssistantMessage[];
  suggestions?: readonly string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend: (message: string) => void | Promise<void>;
  placeholder?: string;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  className?: string;
}) {
  const [draft, setDraft] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [sending, setSending] = useState(false);
  const send = async (message = draft) => {
    const normalized = message.trim();
    if (!normalized || sending) return;
    setSending(true);
    try {
      await onSend(normalized);
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={cx("pango-assistant-chat", className)}>
      <header>
        <span className="pango-assistant-chat-icon" aria-hidden="true">
          <Sparkles size={16} />
        </span>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </header>
      <div className="pango-assistant-messages" aria-live="polite">
        {messages.length === 0 ? (
          <div className="pango-assistant-empty">
            <h3>{emptyTitle}</h3>
            {emptyDescription && <p>{emptyDescription}</p>}
            {suggestions.length > 0 && (
              <div>
                {suggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    disabled={sending}
                    onClick={() => void send(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <article className={cx(`is-${message.role}`)} key={message.id}>
              <span>{message.content}</span>
              {message.detail && <small>{message.detail}</small>}
            </article>
          ))
        )}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <Input
          value={draft}
          aria-label="Assistant message"
          placeholder={placeholder}
          disabled={sending}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button
          type="submit"
          aria-label="Send message"
          loading={sending}
          disabled={!draft.trim()}
        >
          <Send size={15} aria-hidden="true" />
          Send
        </Button>
      </form>
    </section>
  );
}

export type GuidedTourStep = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  visual?: ReactNode;
};

export function GuidedTour({
  open,
  onOpenChange,
  steps,
  current,
  defaultCurrent = 0,
  onCurrentChange,
  onComplete,
  closeLabel = "Skip tour",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: readonly GuidedTourStep[];
  current?: number;
  defaultCurrent?: number;
  onCurrentChange?: (current: number) => void;
  onComplete?: () => void;
  closeLabel?: string;
}) {
  const [stepIndex, setStepIndex] = useControllableState({
    value: current,
    defaultValue: defaultCurrent,
    onChange: onCurrentChange,
  });
  const boundedIndex = Math.min(
    Math.max(stepIndex, 0),
    Math.max(steps.length - 1, 0),
  );
  const step = steps[boundedIndex];
  const isLast = boundedIndex === steps.length - 1;
  const advance = () => {
    if (isLast) {
      onComplete?.();
      onOpenChange(false);
      return;
    }
    setStepIndex(boundedIndex + 1);
  };

  if (!step) return null;
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={step.title}
      description={`Step ${boundedIndex + 1} of ${steps.length}`}
      className="pango-guided-tour"
    >
      <div className="pango-guided-tour-content">
        {step.visual && (
          <div className="pango-guided-tour-visual">{step.visual}</div>
        )}
        <p>{step.description}</p>
        <div
          className="pango-guided-tour-progress"
          aria-label={`Step ${boundedIndex + 1} of ${steps.length}`}
        >
          {steps.map((tourStep, index) => (
            <span
              className={cx(index <= boundedIndex && "is-complete")}
              key={tourStep.id}
            />
          ))}
        </div>
        <footer>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            {closeLabel}
          </Button>
          <div>
            {boundedIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronLeft size={15} aria-hidden="true" />}
                onClick={() => setStepIndex(boundedIndex - 1)}
              >
                Back
              </Button>
            )}
            <Button
              size="sm"
              iconAfter={
                isLast ? (
                  <Check size={15} aria-hidden="true" />
                ) : (
                  <ChevronRight size={15} aria-hidden="true" />
                )
              }
              onClick={advance}
            >
              {isLast ? "Finish" : "Next"}
            </Button>
          </div>
        </footer>
      </div>
    </Dialog>
  );
}

export type EditableListItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  disabled?: boolean;
};

export function EditableList({
  label,
  items,
  onAdd,
  onEdit,
  onRemove,
  addLabel = "Add item",
  className,
}: {
  label?: ReactNode;
  items: readonly EditableListItem[];
  onAdd?: () => void;
  onEdit?: (item: EditableListItem) => void;
  onRemove?: (item: EditableListItem) => void;
  addLabel?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("pango-editable-list", className)}>
      {(label || onAdd) && (
        <header>
          {label && <h3>{label}</h3>}
          {onAdd && (
            <Button
              size="sm"
              variant="ghost"
              icon={<Plus size={14} aria-hidden="true" />}
              onClick={onAdd}
            >
              {addLabel}
            </Button>
          )}
        </header>
      )}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <div className="pango-editable-list-grip" aria-hidden="true">
              <GripVertical size={15} />
            </div>
            {item.leading && (
              <span className="pango-editable-list-leading">
                {item.leading}
              </span>
            )}
            <span className="pango-editable-list-copy">
              <strong>{item.title}</strong>
              {item.description && <small>{item.description}</small>}
            </span>
            {item.trailing && <span>{item.trailing}</span>}
            {onEdit && (
              <IconButton
                label={`Edit ${String(item.title)}`}
                size="sm"
                tone="soft"
                disabled={item.disabled}
                onClick={() => onEdit(item)}
              >
                <Pencil size={13} aria-hidden="true" />
              </IconButton>
            )}
            {onRemove && (
              <IconButton
                label={`Remove ${String(item.title)}`}
                size="sm"
                tone="soft"
                disabled={item.disabled}
                onClick={() => onRemove(item)}
              >
                <X size={13} aria-hidden="true" />
              </IconButton>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatAmount(value: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function unitLabel(
  value: string | undefined,
  options: readonly AmountUnitOption[],
) {
  if (!value) return "units";
  const option = options.find((candidate) => candidate.value === value);
  return typeof option?.label === "string" ? option.label : value;
}
