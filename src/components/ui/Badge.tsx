import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'border-ds-success/20 bg-ds-success-soft text-ds-success',
  danger: 'border-ds-danger/20 bg-ds-danger-soft text-ds-danger',
  warning: 'border-ds-warning/20 bg-ds-warning-soft text-ds-warning',
  info: 'border-ds-info/20 bg-ds-accent-soft text-ds-info',
  neutral: 'border-ds-border bg-ds-surface-2 text-ds-muted',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', className, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cn(
        'inline-flex min-h-ds-touch-target items-center rounded-full border px-3 py-1 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    />
  ),
);

Badge.displayName = 'Badge';
