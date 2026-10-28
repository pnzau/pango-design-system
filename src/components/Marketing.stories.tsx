import type { Meta, StoryObj } from "@storybook/react-vite";
import { Building2, CircleDollarSign, UsersRound } from "lucide-react";
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
    description: "For a growing portfolio",
    price: { byBilling: { monthly: "KSh 1,900 / mo", annual: "KSh 1,500 / mo" } },
    note: { byBilling: { monthly: "Billed monthly", annual: "Billed annually · save 20%" } },
    features: ["25 spaces", "One manager", "Payment reconciliation"],
    action: <Button variant="outline">Start free</Button>,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For teams and agencies",
    price: { byBilling: { monthly: "KSh 5,500 / mo", annual: "KSh 4,500 / mo" } },
    note: { byBilling: { monthly: "Billed monthly", annual: "Billed annually · save 20%" } },
    features: ["Unlimited spaces", "Unlimited managers", "Advanced reporting"],
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
        brand="Nyumbani"
        links={[
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ]}
        actions={<><Button size="sm" variant="ghost">Sign in</Button><Button size="sm">Start free</Button></>}
      />
      <MarketingHero
        eyebrow="Built for landlord teams"
        title={<>Rentals, <br />handled.</>}
        description="A single place for spaces, payments, repairs, and every person who keeps a portfolio running."
        actions={<><Button size="lg">Start free</Button><Button size="lg" variant="outline">See a demo</Button></>}
        stats={[
          { value: "1,240+", label: "Spaces managed" },
          { value: "KSh 186M", label: "Collected" },
          { value: "4.8 / 5", label: "Team rating" },
        ]}
        visual={<StatusGrid rows={[
          { id: "floor-2", label: "FL 2", items: [
            { id: "c1", label: "C1", description: "Otieno O.", tone: "danger" },
            { id: "c2", label: "C2", description: "Achieng A.", tone: "success" },
            { id: "c3", label: "C3", description: "Vacant", tone: "neutral" },
          ] },
          { id: "floor-1", label: "FL 1", items: [
            { id: "b1", label: "B1", description: "Kibet R.", tone: "success" },
            { id: "b2", label: "B2", description: "Due soon", tone: "warning" },
            { id: "b3", label: "B3", description: "Salim H.", tone: "success" },
          ] },
        ]} />}
      />
      <LogoCloud logos={["Acacia PM", "Runda Estates", "Kilimani Homes", "Coast Realty"]} />
      <FeatureGrid
        eyebrow="Everything in one place"
        title="One dashboard for the whole portfolio"
        description="Give teams a shared source of truth without making the day-to-day feel heavy."
        items={[
          { id: "spaces", icon: <Building2 size={16} />, title: "Spaces & units", description: "Represent locations exactly as they are built." },
          { id: "payments", icon: <CircleDollarSign size={16} />, title: "Payments", description: "Review, reconcile, and understand each payment." },
          { id: "access", icon: <UsersRound size={16} />, title: "Scoped access", description: "Give each person only the areas they need." },
        ]}
      />
      <FeatureSpotlight
        eyebrow="Payment verification"
        title="Know exactly what was paid"
        description="Review a claim at the item level, verify proof, and update the record in one focused workflow."
        points={[
          { id: "proof", title: "Proof attached", description: "Keep confirmation messages with the request." },
          { id: "items", title: "Item-level review", description: "Confirm what was settled, not just a total." },
          { id: "approve", title: "One clear action", description: "Approve and update the status immediately." },
        ]}
        visual={<div className="pango-story-spotlight-card"><strong>Payment claim</strong><StatusChip tone="warning">Pending review</StatusChip><span>Rent · KSh 52,000</span><span>Water · KSh 1,500</span><Button size="sm">Confirm payment</Button></div>}
      />
      <PricingTable
        eyebrow="Simple pricing"
        title="Plans that grow with you"
        billingOptions={[{ value: "monthly", label: "Monthly" }, { value: "annual", label: "Annual", hint: "Save 20%" }]}
        defaultBilling="annual"
        plans={pricingPlans}
        footer="Every plan includes core workflow, support, and secure access controls."
      />
      <TestimonialGrid
        title="Teams are sleeping better"
        testimonials={[
          { id: "james", quote: "The overdue view finally gave us a reliable weekly rhythm.", name: "James Mwangi", detail: "Landlord · 42 units", avatar: <Avatar initials="JM" /> },
          { id: "grace", quote: "Repair updates stopped the calls before they started.", name: "Grace Wambui", detail: "Apex Property Management", avatar: <Avatar initials="GW" tone="blue" /> },
          { id: "fatuma", quote: "Scoped access is why I can confidently invite my caretaker.", name: "Fatuma Ali", detail: "Landlord · Mombasa", avatar: <Avatar initials="FA" tone="violet" /> },
        ]}
      />
      <FrequentlyAskedQuestions
        items={[
          { id: "free", title: "How does the free plan work?", content: "Start with the essentials, then change plans when the portfolio needs more." },
          { id: "roles", title: "Can I limit what a manager sees?", content: "Yes. Access can be scoped to exactly the records and spaces a person manages." },
          { id: "cancel", title: "Can I cancel anytime?", content: "Yes. Your plan is always controlled from your account." },
        ]}
        defaultValue={["free"]}
      />
      <MarketingCallToAction
        title="Ready to bring the work together?"
        description="Set up the first workspace in minutes."
        actions={<><Button>Start free</Button><Button variant="outline">Talk to us</Button></>}
      />
      <MarketingFooter
        brand="Nyumbani"
        description="The property management platform built for focused teams."
        groups={[
          { id: "product", title: "PRODUCT", links: [{ label: "Features" }, { label: "Pricing" }, { label: "Access" }] },
          { id: "company", title: "COMPANY", links: [{ label: "About" }, { label: "Contact" }] },
        ]}
        legal="© 2026 Nyumbani · Terms · Privacy"
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
        { id: "floor-1", label: "FL 1", items: [
          { id: "a1", label: "A1", description: "Paid", tone: "success" },
          { id: "a2", label: "A2", description: "Selected", tone: "accent" },
          { id: "a3", label: "A3", description: "Available", tone: "neutral" },
        ] },
      ]}
    />
  ),
};
