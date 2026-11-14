import React from 'react';

import { iconSvg, type SvgIconName } from '../../../apps/ui/src/svg';

interface IconProps { name: SvgIconName; size?: number; className?: string }

/** Packaged Tabler SVG; docs do not need a second React icon dependency. */
export default function Icon({ name, size = 16, className }: IconProps) {
  return <span aria-hidden="true" className={["noone-doc-icon", className].filter(Boolean).join(" ")} dangerouslySetInnerHTML={{ __html: iconSvg(name, size) }} />;
}
