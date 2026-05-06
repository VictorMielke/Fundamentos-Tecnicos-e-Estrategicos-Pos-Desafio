import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export function Button({ children, className, loading, disabled, ...props }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60',
        'bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)]',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}

