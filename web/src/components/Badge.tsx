import type { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-[#dfe5ff] px-3 py-1 text-xs font-bold text-[var(--primary)]">{children}</span>;
}

