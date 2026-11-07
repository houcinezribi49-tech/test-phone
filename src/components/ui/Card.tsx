import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        'rounded-ds-lg border border-ds-border bg-ds-surface p-4 shadow-ds-sm sm:p-6',
        className,
      )}
    />
  ),
);

Card.displayName = 'Card';
