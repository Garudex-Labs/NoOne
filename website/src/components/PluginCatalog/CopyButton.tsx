import React, { useCallback, useState } from "react";

import styles from "../../pages/plugins/styles.module.css";
import Icon from "../Icon";

/** Copies an install command; shared by the catalog cards and the plugin pages. */
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard?.writeText(text).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
        () => {},
      );
    },
    [text],
  );
  return (
    <button
      className={styles.copyBtn}
      data-docs-copy={text}
      onClick={onCopy}
      title="Copy install command"
      aria-label="Copy install command"
    >
      <CopyButtonContents copied={copied} />
    </button>
  );
}

/** Identical feedback for React cards and server-rendered catalog views. */
export function CopyButtonContents({ copied }: { copied: boolean }) {
  return <>
      {copied ? (
        <Icon name="check" size={14} />
      ) : (
        <Icon name="copy" size={14} />
      )}
      <span className={styles.copyBtnLabel}>{copied ? "Copied" : "Copy"}</span>
  </>;
}
