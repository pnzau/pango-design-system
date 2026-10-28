import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./CodeBlock";

const meta = {
  title: "Core/Code block",
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CopyableExample: Story = {
  args: {
    label: "Component example",
    language: "tsx",
    title: "Keep the smallest useful abstraction.",
    code: "import { Button } from 'pango-design-system'\n\n<Button>Save changes</Button>",
    description:
      "The copy control announces completion without changing the code sample.",
  },
};
