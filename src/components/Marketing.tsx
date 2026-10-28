import { Check, Star } from "lucide-react";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { cx, useControllableState } from "../lib/utils";
import { Card } from "./Core";
import { Accordion } from "./Navigation";
import { Badge, Button } from "./Primitives";

export type MarketingLink = {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
};

export function MarketingNav({
  brand,
  links = [],
  actions,
  className,
}: {
  brand: ReactNode;
  links?: readonly MarketingLink[];
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("pango-marketing-nav", className)}>
      <div className="pango-marketing-nav-brand">{brand}</div>
      {links.length > 0 && (
        <nav className="pango-marketing-nav-links" aria-label="Main navigation">
          {links.map((link, index) => (
            <MarketingLinkItem key={linkKey(link, index)} link={link} />
          ))}
        </nav>
      )}
      {actions && <div className="pango-marketing-nav-actions">{actions}</div>}
    </header>
  );
}

export type HeroStat = {
  label: ReactNode;
  value: ReactNode;
};

export function MarketingHero({
  eyebrow,
  title,
  description,
  actions,
  stats = [],
  visual,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  stats?: readonly HeroStat[];
  visual?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "pango-marketing-hero",
        Boolean(visual) && "has-visual",
        className,
      )}
    >
      <div className="pango-marketing-hero-copy">
        {eyebrow && <div className="pango-marketing-eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {actions && <div className="pango-marketing-hero-actions">{actions}</div>}
        {stats.length > 0 && (
          <dl className="pango-marketing-hero-stats">
            {stats.map((stat, index) => (
              <div key={`${String(stat.label)}-${index}`}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {visual && <div className="pango-marketing-hero-visual">{visual}</div>}
    </section>
  );
}

export function LogoCloud({
  title = "Trusted by teams worldwide",
  logos,
  className,
}: {
  title?: ReactNode;
  logos: readonly ReactNode[];
  className?: string;
}) {
  return (
    <section className={cx("pango-logo-cloud", className)}>
      {title && <p>{title}</p>}
      <div aria-label={String(title)}>
        {logos.map((logo, index) => (
          <span key={index}>{logo}</span>
        ))}
      </div>
    </section>
  );
}

export type FeatureItem = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
};

export function FeatureGrid({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
  className,
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  items: readonly FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <section className={cx("pango-feature-grid-section", className)}>
      {(eyebrow || title || description) && (
        <header className="pango-marketing-section-heading">
          {eyebrow && <span className="pango-marketing-eyebrow">{eyebrow}</span>}
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </header>
      )}
      <div className={cx("pango-feature-grid", `pango-feature-grid-${columns}`)}>
        {items.map((item) => (
          <Card className="pango-feature-card" key={item.id}>
            {item.icon && <span className="pango-feature-card-icon">{item.icon}</span>}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.action && <div className="pango-feature-card-action">{item.action}</div>}
          </Card>
        ))}
      </div>
    </section>
  );
}

export type SpotlightPoint = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

export function FeatureSpotlight({
  eyebrow,
  title,
  description,
  points = [],
  visual,
  tone = "dark",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  points?: readonly SpotlightPoint[];
  visual?: ReactNode;
  tone?: "dark" | "soft";
  className?: string;
}) {
  return (
    <section
      className={cx(
        "pango-feature-spotlight",
        `pango-feature-spotlight-${tone}`,
        className,
      )}
    >
      <div className="pango-feature-spotlight-copy">
        {eyebrow && <span className="pango-marketing-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {points.length > 0 && (
          <ul>
            {points.map((point) => (
              <li key={point.id}>
                <span className="pango-feature-spotlight-point-icon">
                  {point.icon ?? <Check size={13} strokeWidth={3} aria-hidden="true" />}
                </span>
                <span>
                  <strong>{point.title}</strong>
                  {point.description && <small>{point.description}</small>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {visual && <div className="pango-feature-spotlight-visual">{visual}</div>}
    </section>
  );
}

export type PricingPlan = {
  id: string;
  name: ReactNode;
  description?: ReactNode;
  price: PricingValue;
  note?: PricingValue;
  features?: readonly ReactNode[];
  action?: ReactNode;
  badge?: ReactNode;
  featured?: boolean;
};

export type PricingValue =
  | ReactNode
  | { byBilling: Readonly<Record<string, ReactNode>> };

export type BillingOption = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
};

export function PricingTable({
  plans,
  billingOptions = [],
  billing,
  defaultBilling,
  onBillingChange,
  eyebrow,
  title,
  description,
  footer,
  className,
}: {
  plans: readonly PricingPlan[];
  billingOptions?: readonly BillingOption[];
  billing?: string;
  defaultBilling?: string;
  onBillingChange?: (value: string) => void;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const fallbackBilling = defaultBilling ?? billingOptions[0]?.value ?? "";
  const [selectedBilling, setSelectedBilling] = useControllableState({
    value: billing,
    defaultValue: fallbackBilling,
    onChange: onBillingChange,
  });
  const activeBilling = billingOptions.length ? selectedBilling : undefined;

  return (
    <section className={cx("pango-pricing-table", className)}>
      {(eyebrow || title || description || billingOptions.length > 0) && (
        <header className="pango-marketing-section-heading">
          {eyebrow && <span className="pango-marketing-eyebrow">{eyebrow}</span>}
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
          {billingOptions.length > 0 && (
            <div className="pango-pricing-billing" role="group" aria-label="Billing period">
              {billingOptions.map((option) => {
                const selected = option.value === selectedBilling;
                return (
                  <button
                    type="button"
                    key={option.value}
                    aria-pressed={selected}
                    className={cx(selected && "is-selected")}
                    onClick={() => setSelectedBilling(option.value)}
                  >
                    <span>{option.label}</span>
                    {option.hint && <small>{option.hint}</small>}
                  </button>
                );
              })}
            </div>
          )}
        </header>
      )}
      <div className={cx("pango-pricing-plans", plans.length > 2 && "has-many-plans")}>
        {plans.map((plan) => (
          <Card
            className={cx("pango-pricing-plan", plan.featured && "is-featured")}
            key={plan.id}
          >
            <header>
              <div>
                <h3>{plan.name}</h3>
                {plan.description && <p>{plan.description}</p>}
              </div>
              {plan.badge && <Badge tone="accent">{plan.badge}</Badge>}
            </header>
            <div className="pango-pricing-price">
              <strong>{priceFor(plan.price, activeBilling)}</strong>
              {plan.note && <small>{priceFor(plan.note, activeBilling)}</small>}
            </div>
            {plan.action && <div className="pango-pricing-action">{plan.action}</div>}
            {plan.features && plan.features.length > 0 && (
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
      {footer && <footer className="pango-pricing-footer">{footer}</footer>}
    </section>
  );
}

export type Testimonial = {
  id: string;
  quote: ReactNode;
  name: ReactNode;
  detail?: ReactNode;
  avatar?: ReactNode;
  rating?: number;
};

export function TestimonialGrid({
  title,
  testimonials,
  className,
}: {
  title?: ReactNode;
  testimonials: readonly Testimonial[];
  className?: string;
}) {
  return (
    <section className={cx("pango-testimonial-grid-section", className)}>
      {title && <h2>{title}</h2>}
      <div className="pango-testimonial-grid">
        {testimonials.map((testimonial) => {
          const rating = Math.min(Math.max(testimonial.rating ?? 5, 0), 5);
          return (
            <blockquote className="pango-testimonial" key={testimonial.id}>
              <div className="pango-testimonial-rating" aria-label={`${rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={14}
                    aria-hidden="true"
                    fill={index < rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p>“{testimonial.quote}”</p>
              <footer>
                {testimonial.avatar && <span>{testimonial.avatar}</span>}
                <cite>
                  <strong>{testimonial.name}</strong>
                  {testimonial.detail && <small>{testimonial.detail}</small>}
                </cite>
              </footer>
            </blockquote>
          );
        })}
      </div>
    </section>
  );
}

export function MarketingCallToAction({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("pango-marketing-cta", className)}>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {actions && <div>{actions}</div>}
      </div>
    </section>
  );
}

export type FooterGroup = {
  id: string;
  title: ReactNode;
  links: readonly MarketingLink[];
};

export function MarketingFooter({
  brand,
  description,
  groups = [],
  legal,
  className,
}: {
  brand: ReactNode;
  description?: ReactNode;
  groups?: readonly FooterGroup[];
  legal?: ReactNode;
  className?: string;
}) {
  return (
    <footer className={cx("pango-marketing-footer", className)}>
      <div className="pango-marketing-footer-main">
        <div className="pango-marketing-footer-brand">
          {brand}
          {description && <p>{description}</p>}
        </div>
        {groups.length > 0 && (
          <div className="pango-marketing-footer-groups">
            {groups.map((group) => (
              <section key={group.id}>
                <h3>{group.title}</h3>
                {group.links.map((link, index) => (
                  <MarketingLinkItem key={linkKey(link, index)} link={link} />
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
      {legal && <div className="pango-marketing-footer-legal">{legal}</div>}
    </footer>
  );
}

export type StatusGridItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  tone?: "success" | "warning" | "danger" | "neutral" | "accent";
  disabled?: boolean;
};

export type StatusGridRow = {
  id: string;
  label: ReactNode;
  items: readonly StatusGridItem[];
};

export function StatusGrid({
  rows,
  onItemClick,
  selectedIds = [],
  className,
}: {
  rows: readonly StatusGridRow[];
  onItemClick?: (item: StatusGridItem) => void;
  selectedIds?: readonly string[];
  className?: string;
}) {
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  return (
    <div className={cx("pango-status-grid", className)}>
      {rows.map((row) => (
        <div className="pango-status-grid-row" key={row.id}>
          <span className="pango-status-grid-row-label">{row.label}</span>
          <div className="pango-status-grid-items">
            {row.items.map((item) => {
              const interactive = Boolean(onItemClick);
              const content = (
                <>
                  <span>{item.label}</span>
                  <small>{item.description}</small>
                  <i aria-hidden="true" />
                </>
              );
              return interactive ? (
                <button
                  type="button"
                  className={cx(
                    "pango-status-grid-item",
                    `is-${item.tone ?? "neutral"}`,
                    selected.has(item.id) && "is-selected",
                  )}
                  key={item.id}
                  disabled={item.disabled}
                  aria-pressed={selected.has(item.id)}
                  onClick={() => onItemClick?.(item)}
                >
                  {content}
                </button>
              ) : (
                <div
                  className={cx(
                    "pango-status-grid-item",
                    `is-${item.tone ?? "neutral"}`,
                    selected.has(item.id) && "is-selected",
                  )}
                  key={item.id}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FrequentlyAskedQuestions({
  items,
  defaultValue,
  className,
}: {
  items: Parameters<typeof Accordion>[0]["items"];
  defaultValue?: string[];
  className?: string;
}) {
  return (
    <section className={cx("pango-marketing-faq", className)}>
      <Accordion items={items} type="single" defaultValue={defaultValue} />
    </section>
  );
}

function MarketingLinkItem({ link }: { link: MarketingLink }) {
  if (link.href) return <a href={link.href}>{link.label}</a>;
  if (link.onClick)
    return (
      <button type="button" onClick={link.onClick}>
        {link.label}
      </button>
    );
  return <span>{link.label}</span>;
}

function linkKey(link: MarketingLink, index: number) {
  return `${typeof link.label === "string" ? link.label : "link"}-${index}`;
}

function priceFor(value: PricingValue, billing: string | undefined): ReactNode {
  if (typeof value === "object" && value !== null && "byBilling" in value) {
    return billing
      ? value.byBilling[billing] ?? Object.values(value.byBilling)[0]
      : Object.values(value.byBilling)[0];
  }
  return value;
}
