import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Building2,
  CircleDollarSign,
  FileText,
  Paperclip,
  UsersRound,
} from "lucide-react";
import {
  FeatureGrid,
  FeatureSpotlight,
  FrequentlyAskedQuestions,
  LogoCloud,
  MarketingCallToAction,
  MarketingFooter,
  MarketingHero,
  MarketingNav,
  PricingTable,
  StatusGrid,
  TestimonialGrid,
  type PricingPlan,
} from "./Marketing";
import { Avatar, Button, StatusChip } from "./Primitives";

const pricingPlans: readonly PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For a growing team",
    price: { byBilling: { monthly: "$19 / mo", annual: "$15 / mo" } },
    note: {
      byBilling: {
        monthly: "Billed monthly",
        annual: "Billed annually · save 20%",
      },
    },
    features: ["10 projects", "Three collaborators", "Basic reporting"],
    action: <Button variant="outline">Start free</Button>,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For teams and studios",
    price: { byBilling: { monthly: "$55 / mo", annual: "$45 / mo" } },
    note: {
      byBilling: {
        monthly: "Billed monthly",
        annual: "Billed annually · save 20%",
      },
    },
    features: [
      "Unlimited projects",
      "Unlimited collaborators",
      "Advanced reporting",
    ],
    action: <Button>Start trial</Button>,
    badge: "Most popular",
    featured: true,
  },
];

const meta = {
  title: "Marketing/Compositions",
  component: MarketingHero,
  parameters: { layout: "fullscreen" },
  args: { title: "Marketing title" },
} satisfies Meta<typeof MarketingHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LandingPage: Story = {
  render: () => (
    <>
      <MarketingNav
        brand="Northstar"
        links={[
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ]}
        actions={
          <>
            <Button size="sm" variant="ghost">
              Sign in
            </Button>
            <Button size="sm">Start free</Button>
          </>
        }
      />
      <MarketingHero
        eyebrow="Built for focused teams"
        title={
          <>
            Work, <br />
            handled.
          </>
        }
        description="A single place for projects, reviews, decisions, and every person who keeps the work moving."
        actions={
          <>
            <Button size="lg">Start free</Button>
            <Button size="lg" variant="outline">
              See a demo
            </Button>
          </>
        }
        stats={[
          { value: "1,240+", label: "Work items" },
          { value: "86%", label: "Completed" },
          { value: "4.8 / 5", label: "Team rating" },
        ]}
        visual={
          <StatusGrid
            rows={[
              {
                id: "q3",
                label: "Q3",
                items: [
                  {
                    id: "c1",
                    label: "Plan",
                    description: "Needs review",
                    tone: "danger",
                  },
                  {
                    id: "c2",
                    label: "Build",
                    description: "On track",
                    tone: "success",
                  },
                  {
                    id: "c3",
                    label: "Launch",
                    description: "Queued",
                    tone: "neutral",
                  },
                ],
              },
              {
                id: "q2",
                label: "Q2",
                items: [
                  {
                    id: "b1",
                    label: "Research",
                    description: "Complete",
                    tone: "success",
                  },
                  {
                    id: "b2",
                    label: "Design",
                    description: "Due soon",
                    tone: "warning",
                  },
                  {
                    id: "b3",
                    label: "Review",
                    description: "Complete",
                    tone: "success",
                  },
                ],
              },
            ]}
          />
        }
      />
      <LogoCloud
        logos={[
          "Acacia Studio",
          "Runda Labs",
          "Kilimani Works",
          "Coastline Co.",
        ]}
      />
      <FeatureGrid
        eyebrow="Everything in one place"
        title="One dashboard for the whole team"
        description="Give teams a shared source of truth without making the day-to-day feel heavy."
        items={[
          {
            id: "projects",
            icon: <Building2 size={16} />,
            title: "Projects & work",
            description: "Represent ongoing work exactly as your team runs it.",
          },
          {
            id: "reviews",
            icon: <CircleDollarSign size={16} />,
            title: "Reviews",
            description: "Review, resolve, and understand every open decision.",
          },
          {
            id: "access",
            icon: <UsersRound size={16} />,
            title: "Scoped access",
            description: "Give each person only the areas they need.",
          },
        ]}
      />
      <FeatureSpotlight
        eyebrow="Decision tracking"
        title="Know exactly what needs attention"
        description="Review an item at the detail level, keep the context close, and update the record in one focused workflow."
        points={[
          {
            id: "context",
            title: "Context attached",
            description: "Keep notes and references with the work item.",
          },
          {
            id: "details",
            title: "Detail-level review",
            description: "Confirm what changed, not just a summary.",
          },
          {
            id: "action",
            title: "One clear action",
            description: "Resolve and update the status immediately.",
          },
        ]}
        visual={
          <div className="pango-story-spotlight-card">
            <div className="pango-story-spotlight-card-header">
              <div className="pango-story-spotlight-card-title">
                <span className="pango-story-spotlight-card-eyebrow">
                  Work item
                </span>
                <strong>Launch brief</strong>
              </div>
              <StatusChip tone="warning">Pending review</StatusChip>
            </div>
            <div className="pango-story-spotlight-card-meta">
              <span>
                <FileText size={14} aria-hidden="true" />
                12 notes
              </span>
              <span>
                <Paperclip size={14} aria-hidden="true" />4 files
              </span>
            </div>
            <div className="pango-story-spotlight-card-footer">
              <div className="pango-story-spotlight-card-owner">
                <Avatar initials="MI" tone="violet" size="sm" />
                <span>Maya Imani</span>
              </div>
              <Button size="sm">Review item</Button>
            </div>
          </div>
        }
      />
      <PricingTable
        eyebrow="Simple pricing"
        title="Plans that grow with the team"
        billingOptions={[
          { value: "monthly", label: "Monthly" },
          { value: "annual", label: "Annual", hint: "Save 20%" },
        ]}
        defaultBilling="annual"
        plans={pricingPlans}
        footer="Every plan includes core workflow, support, and secure access controls."
      />
      <TestimonialGrid
        title="Teams are sleeping better"
        testimonials={[
          {
            id: "james",
            quote: "The review queue finally gave us a reliable weekly rhythm.",
            name: "James Mwangi",
            detail: "Operations lead · 42 projects",
            avatar: <Avatar initials="JM" />,
          },
          {
            id: "grace",
            quote:
              "Status updates stopped the follow-up messages before they started.",
            name: "Grace Wambui",
            detail: "Product operations",
            avatar: <Avatar initials="GW" tone="blue" />,
          },
          {
            id: "fatuma",
            quote:
              "Scoped access is why I can confidently invite collaborators.",
            name: "Fatuma Ali",
            detail: "Team lead · Mombasa",
            avatar: <Avatar initials="FA" tone="violet" />,
          },
        ]}
      />
      <FrequentlyAskedQuestions
        items={[
          {
            id: "free",
            title: "How does the free plan work?",
            content:
              "Start with the essentials, then change plans when the team needs more.",
          },
          {
            id: "roles",
            title: "Can I limit what a teammate sees?",
            content:
              "Yes. Access can be scoped to exactly the records and projects a person manages.",
          },
          {
            id: "cancel",
            title: "Can I cancel anytime?",
            content: "Yes. Your plan is always controlled from your account.",
          },
        ]}
        defaultValue={["free"]}
      />
      <MarketingCallToAction
        title="Ready to bring the work together?"
        description="Set up the first workspace in minutes."
        actions={
          <>
            <Button>Start free</Button>
            <Button variant="outline">Talk to us</Button>
          </>
        }
      />
      <MarketingFooter
        brand="Northstar"
        description="The workspace platform built for focused teams."
        groups={[
          {
            id: "product",
            title: "PRODUCT",
            links: [
              { label: "Features" },
              { label: "Pricing" },
              { label: "Access" },
            ],
          },
          {
            id: "company",
            title: "COMPANY",
            links: [{ label: "About" }, { label: "Contact" }],
          },
        ]}
        legal="© 2026 Northstar · Terms · Privacy"
      />
    </>
  ),
};

export const StatusBoard: Story = {
  render: () => (
    <StatusGrid
      selectedIds={["a2"]}
      onItemClick={() => undefined}
      rows={[
        {
          id: "floor-1",
          label: "FL 1",
          items: [
            { id: "a1", label: "A1", description: "Paid", tone: "success" },
            { id: "a2", label: "A2", description: "Selected", tone: "accent" },
            {
              id: "a3",
              label: "A3",
              description: "Available",
              tone: "neutral",
            },
          ],
        },
      ]}
    />
  ),
};
