import { AppIcon, type AppIconProps } from '@noone/ui/app-icon'

export type ToolIconProps = Omit<AppIconProps, 'spinning'>

export function ToolIcon({ size = '0.875rem', ...props }: ToolIconProps) {
  return <AppIcon size={size} {...props} />
}
