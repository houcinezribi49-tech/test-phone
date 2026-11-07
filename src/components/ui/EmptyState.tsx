import React, { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, icon, action, className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn('flex min-w-0 flex-col items-center gap-3 p-6 text-center', className)}
    >
      {icon && <div aria-hidden="true" className="text-ds-muted">{icon}</div>}
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-ds-text">{title}</h2>
        {description && <p className="mt-1 text-sm text-ds-muted">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  ),
);

EmptyState.displayName = 'EmptyState';
