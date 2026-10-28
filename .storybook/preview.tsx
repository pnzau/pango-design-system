import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Pango color mode",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div
        data-theme={context.globals.theme}
        style={{ minHeight: "100vh", padding: 24, background: "var(--page)" }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: { expanded: true },
    docs: {
      codePanel: true,
    },
    layout: "padded",
  },
};

export default preview;
