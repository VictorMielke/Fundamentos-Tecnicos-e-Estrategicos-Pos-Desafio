import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx('rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5', className)}>{children}</section>;
}
