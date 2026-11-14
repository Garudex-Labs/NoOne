import { AppIcon, type AppIconProps } from '@noone/ui/app-icon'

import { cn } from '@/lib/utils'

interface DisclosureCaretProps extends Omit<AppIconProps, 'name'> {
  open: boolean
}

// Chrome caret for collapsible sections: points right when closed (▶),
// rotates to point down (▼) when open. Override `className` to layer
// hover/opacity styling; twMerge resolves transition conflicts.
export function DisclosureCaret({ className, open, size = '0.75rem', ...props }: DisclosureCaretProps) {
  return (
    <AppIcon
      className={cn('shrink-0 transition-transform duration-150', open && 'rotate-90', className)}
      name="chevron-right"
      size={size}
      {...props}
    />
  )
}
