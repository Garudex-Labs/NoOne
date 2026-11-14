import icons from '../../../agent_cli/data/ui/icons.json'

export type SvgIconName = keyof typeof icons

/** Trusted packaged markup for non-React renderers (composer chips, docs and exports). */
export function iconSvg(name: SvgIconName, size = 16): string {
  const svg = Object.hasOwn(icons, name) ? icons[name] : icons.package

  return svg.replace('width="24"', `width="${Number(size)}"`).replace('height="24"', `height="${Number(size)}"`).replace('<svg', '<svg aria-hidden="true"')
}
