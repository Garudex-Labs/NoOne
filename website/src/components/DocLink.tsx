import React, { useEffect } from "react";

/** Keep the site's subpath and language when navigating from a custom catalog. */
export function docUrl(to: string): string {
  if (!to.startsWith("/") || to.startsWith("//")) return to;
  const pathname = typeof window === "undefined" ? "/docs/" : window.location.pathname;
  const base = /^(.*\/docs)(?:\/|$)/.exec(pathname)?.[1] || "";
  if (to === "/docs" || to.startsWith("/docs/")) return base + to.slice(5);
  const localized = /(?:^|\/)zh-Hans(?:\/|$)/.test(pathname);
  const shared = /^\/(?:img|api|oauth|snippets)(?:\/|$)|^\/llms/.test(to);
  const locale = localized && !shared && !to.startsWith("/zh-Hans") ? "/zh-Hans" : "";
  return base + locale + to;
}

interface DocLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export function DocLink({ to, ...props }: DocLinkProps): React.JSX.Element {
  return <a href={docUrl(to)} {...props} />;
}

/** React hoists these elements; retain the original page-specific metadata. */
interface PageHeadProps {
  children: React.ReactNode;
  title?: string;
  metatags?: Record<string, string>;
}

export function PageHead({ children, title: explicitTitle, metatags = {} }: PageHeadProps): React.JSX.Element {
  useEffect(() => {
    const elements = (Array.isArray(children) ? children : [children]).flat() as React.ReactElement<{ children?: string; property?: string; name?: string; content?: string }>[];
    const title = explicitTitle || elements.find((element) => element?.type === "title")?.props.children;
    const frame = requestAnimationFrame(() => {
      if (title) document.title = title;
      for (const element of elements.filter((element) => element?.type === "meta")) {
        const property = element.props.property;
        const name = element.props.name;
        if (!property && !name) continue;
        const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
        let meta = document.head.querySelector<HTMLMetaElement>(selector);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute(property ? "property" : "name", property || name || "");
          document.head.append(meta);
        }
        meta.content = element.props.content || "";
      }
      for (const [property, content] of Object.entries(metatags)) {
        const meta = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
        if (meta) meta.content = content;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [children, explicitTitle, metatags]);
  return <>{children}</>;
}
