import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = InputHTMLAttributes<HTMLInputElement> & { error?: string };

type InputProps = Props & { prefix?: string };

export function Input({ className, error, prefix, ...props }: InputProps) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
            {prefix}
          </span>
        ) : null}
        <input
          className={clsx(
            'h-11 w-full rounded-lg border bg-[var(--surface-2)] px-3 text-sm outline-none transition focus:ring-2',
            prefix ? 'pl-[62px]' : null,
            error ? 'border-[var(--danger)] ring-[var(--danger)]/20' : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20',
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <span className="mt-1 flex items-center gap-1.5 text-xs text-[var(--danger)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M11.9999 8V12M11.9999 16H12.0099M10.2899 3.85999L1.81994 18C1.64431 18.304 1.5514 18.6485 1.55054 18.9992C1.54967 19.3499 1.64088 19.6949 1.815 19.9998C1.98912 20.3047 2.2402 20.5585 2.54317 20.7357C2.84615 20.9129 3.19032 21.0072 3.54094 21.009H20.4599C20.8106 21.0072 21.1547 20.9129 21.4577 20.7357C21.7607 20.5585 22.0118 20.3047 22.1859 19.9998C22.36 19.6949 22.4512 19.3499 22.4503 18.9992C22.4495 18.6485 22.3566 18.304 22.1809 18L13.7099 3.85999C13.5325 3.56441 13.2815 3.32006 12.9814 3.15085C12.6812 2.98164 12.3422 2.89331 11.9976 2.89453C11.6529 2.89575 11.3146 2.98647 11.0157 3.1578C10.7167 3.32914 10.4675 3.57525 10.2929 3.87208L10.2899 3.85999Z"
              stroke="#B12C4D"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {error}
        </span>
      ) : null}
    </div>
  );
}

