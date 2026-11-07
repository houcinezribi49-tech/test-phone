import React, { forwardRef, useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: ReactNode;
  helpText?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helpText, id, className, children, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const describedBy = [
      ariaDescribedBy,
      error ? `${selectId}-error` : undefined,
      helpText ? `${selectId}-help` : undefined,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className="grid min-w-0 gap-1.5">
        {label && <label htmlFor={selectId} className="text-sm font-medium text-ds-text">{label}</label>}
        <select
          {...props}
          ref={ref}
          id={selectId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
          className={cn(
            'min-h-ds-touch-target w-full min-w-0 rounded-ds-md border border-ds-border bg-ds-surface px-3 text-base text-ds-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-brand disabled:cursor-not-allowed disabled:bg-ds-surface-2 disabled:opacity-70',
            error && 'border-ds-danger focus-visible:outline-ds-danger',
            className,
          )}
        >
          {children}
        </select>
        {helpText && <p id={`${selectId}-help`} className="text-sm text-ds-muted">{helpText}</p>}
        {error && <p id={`${selectId}-error`} className="text-sm text-ds-danger" role="alert">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
