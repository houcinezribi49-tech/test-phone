import React, { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: ReactNode;
  helpText?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, id, className, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const describedBy = [
      ariaDescribedBy,
      error ? `${inputId}-error` : undefined,
      helpText ? `${inputId}-help` : undefined,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className="grid min-w-0 gap-1.5">
        {label && <label htmlFor={inputId} className="text-sm font-medium text-ds-text">{label}</label>}
        <input
          {...props}
          ref={ref}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
          className={cn(
            'min-h-ds-touch-target w-full min-w-0 rounded-ds-md border border-ds-border bg-ds-surface px-3 text-base text-ds-text placeholder:text-ds-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-brand disabled:cursor-not-allowed disabled:bg-ds-surface-2 disabled:opacity-70',
            error && 'border-ds-danger focus-visible:outline-ds-danger',
            className,
          )}
        />
        {helpText && <p id={`${inputId}-help`} className="text-sm text-ds-muted">{helpText}</p>}
        {error && <p id={`${inputId}-error`} className="text-sm text-ds-danger" role="alert">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
