import React from "react";
import footer from "../data/site-footer.json";
import { DocLink } from "./DocLink";

interface DocLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

/** Custom pages keep the source site's footer even when the shell omits it. */
export default function DocLayout({ children }: DocLayoutProps): React.JSX.Element {
  return <div className="not-prose docs-custom-page">
    {children}
    <footer className="docs-app-footer">
      <div className="docs-app-footer-links">
        {footer.links.map((column) => <section key={column.header}>
          <h4>{column.header}</h4>
          {column.items.map((item) => <DocLink key={item.label} to={item.href}>{item.label}</DocLink>)}
        </section>)}
      </div>
      <p data-docs-attribution="">{footer.copyright}</p>
    </footer>
  </div>;
}
