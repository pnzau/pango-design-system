import type { ReactNode } from "react";
import { cx } from "../lib/utils";
import { CopyButton } from "./Primitives";

export function CodeBlock({
  code,
  className,
  copyLabel = "Copy code",
  description,
  label,
  language = "tsx",
  title,
}: {
  code: string;
  className?: string;
  copyLabel?: string;
  description?: ReactNode;
  label?: ReactNode;
  language?: string;
  title?: ReactNode;
}) {
  return (
    <section className={cx("pango-code-block", className)}>
      <header className="pango-code-block-header">
        <span className="pango-code-block-label">
          {label ?? "Code example"}
        </span>
        <div>
          <code>{language}</code>
          <CopyButton
            className="pango-code-block-copy"
            copiedLabel="Code copied"
            label={copyLabel}
            size="sm"
            value={code}
          />
        </div>
      </header>
      {title && <h3>{title}</h3>}
      <pre>
        <code>{code}</code>
      </pre>
      {description && <p>{description}</p>}
    </section>
  );
}
