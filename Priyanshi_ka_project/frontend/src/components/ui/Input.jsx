import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(
  ({ label, error, hint, leftIcon, rightIcon, className, ...rest }, ref) => (
    <label className="block">
      {label && <span className="label-base">{label}</span>}
      <span className="relative block">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{leftIcon}</span>
        )}
        <input
          ref={ref}
          className={cn(
            'input-base',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-rose-400 focus:ring-rose-300 focus:border-rose-400',
            className
          )}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">{rightIcon}</span>
        )}
      </span>
      {hint && !error && <span className="text-xs text-ink-400 mt-1 block">{hint}</span>}
      {error && <span className="text-xs text-rose-500 mt-1 block">{error}</span>}
    </label>
  )
);

Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, hint, className, ...rest }, ref) => (
  <label className="block">
    {label && <span className="label-base">{label}</span>}
    <textarea
      ref={ref}
      rows={4}
      className={cn(
        'input-base resize-none',
        error && 'border-rose-400 focus:ring-rose-300 focus:border-rose-400',
        className
      )}
      {...rest}
    />
    {hint && !error && <span className="text-xs text-ink-400 mt-1 block">{hint}</span>}
    {error && <span className="text-xs text-rose-500 mt-1 block">{error}</span>}
  </label>
));

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ label, error, hint, children, className, ...rest }, ref) => (
  <label className="block">
    {label && <span className="label-base">{label}</span>}
    <select
      ref={ref}
      className={cn(
        'input-base appearance-none bg-no-repeat bg-[right_0.75rem_center] pr-9',
        'bg-[url("data:image/svg+xml,%3Csvg%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2364748b%22%20stroke-width=%222%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M6%209l6%206%206-6%22/%3E%3C/svg%3E")]',
        'bg-[length:1.1rem_1.1rem]',
        error && 'border-rose-400 focus:ring-rose-300 focus:border-rose-400',
        className
      )}
      {...rest}
    >
      {children}
    </select>
    {hint && !error && <span className="text-xs text-ink-400 mt-1 block">{hint}</span>}
    {error && <span className="text-xs text-rose-500 mt-1 block">{error}</span>}
  </label>
));

Select.displayName = 'Select';

export default Input;
