import { Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { LinkItem } from '../services/links';
import { Button } from './Button';

type Props = { links: LinkItem[]; deletingSlug: string | null; onDelete: (shortUrl: string) => Promise<void> };

export function LinkTable({ links, deletingSlug, onDelete }: Props) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-y border-[var(--border)] text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
            <th className="px-2 py-3">Original</th>
            <th className="px-2 py-3">Encurtada</th>
            <th className="px-2 py-3">Acessos</th>
            <th className="px-2 py-3">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => {
            const shortLink = `${import.meta.env.VITE_FRONTEND_URL}/${link.shortUrl}`;
            return (
              <tr key={link.shortUrl} className="border-t border-[var(--border)]">
                <td className="max-w-72 truncate px-2 py-4 text-sm text-[var(--text-muted)]">{link.originalUrl}</td>
                <td className="px-2 py-4 font-bold text-[var(--primary)]">/{link.shortUrl}</td>
                <td className="px-2 py-4 text-[var(--text-muted)]">{link.accessCount}</td>
                <td className="px-2 py-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="h-8 w-8 rounded-md bg-[#e4e6ec] p-0 text-[var(--text-muted)] hover:bg-[#d8dce5]"
                      onClick={async () => {
                        await navigator.clipboard.writeText(shortLink);
                        toast.success('Link copiado');
                      }}
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      type="button"
                      className="h-8 w-8 rounded-md bg-[#e4e6ec] p-0 text-[var(--text-muted)] hover:bg-[#d8dce5]"
                      loading={deletingSlug === link.shortUrl}
                      onClick={() => onDelete(link.shortUrl)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

