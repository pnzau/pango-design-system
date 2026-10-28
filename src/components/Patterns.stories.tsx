import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Primitives";
import { PageHeader } from "./Patterns";

const meta = {
  title: "Patterns/Page header",
  component: PageHeader,
  args: {
    title: "Workspace",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StickyContext: Story = {
  render: () => (
    <div className="pango-story-sticky-surface">
      <PageHeader
        sticky
        eyebrow="Workspace"
        title="Inbox"
        description="The page context and its primary action remain available as the list scrolls."
        actions={<Button size="sm">New message</Button>}
      />
      <div className="pango-story-sticky-content">
        {[
          "Invoice for October",
          "Build passed on main",
          "Notes from design weekly",
          "Contract redlines attached",
          "Region recovered",
          "Can we move standup?",
          "Two questions about the audit",
        ].map((subject, index) => (
          <article key={subject}>
            <strong>{subject}</strong>
            <small>
              {index % 2 ? "Updated a few minutes ago" : "New activity"}
            </small>
          </article>
        ))}
      </div>
    </div>
  ),
};
