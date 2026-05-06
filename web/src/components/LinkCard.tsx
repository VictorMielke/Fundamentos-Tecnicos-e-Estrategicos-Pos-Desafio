import toast from 'react-hot-toast';
import type { LinkItem } from '../services/links';

type Props = { link: LinkItem; deleting: boolean; onDelete: (shortUrl: string) => Promise<void> };

export function LinkCard({ link, deleting, onDelete }: Props) {
  const baseUrl = (import.meta.env.VITE_FRONTEND_URL || window.location.origin).replace(/\/+$/, '');
  const shortLink = `${baseUrl}/${link.shortUrl}`;
  const shortDisplay = shortLink.replace(/^https?:\/\//, '');
  const openRedirect = () => window.open(shortLink, '_blank', 'noopener,noreferrer');

  return (
    <article
      className="flex h-[42px] min-h-[42px] max-h-[42px] w-full shrink-0 cursor-pointer items-center gap-2 overflow-hidden border-b border-[var(--border)]"
      role="link"
      tabIndex={0}
      onClick={openRedirect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openRedirect();
        }
      }}
    >
      <div className="w-0 flex-1 overflow-hidden">
        <p
          className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold leading-[120%] text-[#2C46B1]"
          title={shortDisplay}
        >
          {shortDisplay}
        </p>
        <p
          className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#4D505C]"
          title={link.originalUrl}
        >
          {link.originalUrl}
        </p>
      </div>

      <p className="w-24 shrink-0 text-right text-xs text-[#4D505C]">{link.accessCount} acessos</p>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#E4E6EC] text-[#1F2025] transition-colors hover:bg-[#d8dce5]"
          onClick={async (event) => {
            event.stopPropagation();
            await navigator.clipboard.writeText(shortLink);
            toast.success('Link copiado');
          }}
          aria-label="Copiar link"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M11.5 0H3.5C3.36739 0 3.24021 0.0526784 3.14645 0.146447C3.05268 0.240215 3 0.367392 3 0.5V3H0.5C0.367392 3 0.240215 3.05268 0.146447 3.14645C0.0526784 3.24021 0 3.36739 0 3.5V11.5C0 11.6326 0.0526784 11.7598 0.146447 11.8536C0.240215 11.9473 0.367392 12 0.5 12H8.5C8.63261 12 8.75979 11.9473 8.85355 11.8536C8.94732 11.7598 9 11.6326 9 11.5V9H11.5C11.6326 9 11.7598 8.94732 11.8536 8.85355C11.9473 8.75979 12 8.63261 12 8.5V0.5C12 0.367392 11.9473 0.240215 11.8536 0.146447C11.7598 0.0526784 11.6326 0 11.5 0ZM8 11H1V4H8V11ZM11 8H9V3.5C9 3.36739 8.94732 3.24021 8.85355 3.14645C8.75979 3.05268 8.63261 3 8.5 3H4V1H11V8Z" fill="currentColor" />
          </svg>
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#E4E6EC] text-[#1F2025] transition-colors hover:bg-[#d8dce5] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={deleting}
          onClick={(event) => {
            event.stopPropagation();
            void onDelete(link.shortUrl);
          }}
          aria-label="Excluir link"
        >
          <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M11.5 2H9V1.5C9 1.10218 8.84196 0.720644 8.56066 0.43934C8.27936 0.158035 7.89782 0 7.5 0H4.5C4.10218 0 3.72064 0.158035 3.43934 0.43934C3.15804 0.720644 3 1.10218 3 1.5V2H0.5C0.367392 2 0.240215 2.05268 0.146447 2.14645C0.0526784 2.24021 0 2.36739 0 2.5C0 2.63261 0.0526784 2.75979 0.146447 2.85355C0.240215 2.94732 0.367392 3 0.5 3H1V12C1 12.2652 1.10536 12.5196 1.29289 12.7071C1.48043 12.8946 1.73478 13 2 13H10C10.2652 13 10.5196 12.8946 10.7071 12.7071C10.8946 12.5196 11 12.2652 11 12V3H11.5C11.6326 3 11.7598 2.94732 11.8536 2.85355C11.9473 2.75979 12 2.63261 12 2.5C12 2.36739 11.9473 2.24021 11.8536 2.14645C11.7598 2.05268 11.6326 2 11.5 2ZM4 1.5C4 1.36739 4.05268 1.24021 4.14645 1.14645C4.24021 1.05268 4.36739 1 4.5 1H7.5C7.63261 1 7.75979 1.05268 7.85355 1.14645C7.94732 1.24021 8 1.36739 8 1.5V2H4V1.5ZM10 12H2V3H10V12ZM5 5.5V9.5C5 9.63261 4.94732 9.75979 4.85355 9.85355C4.75979 9.94732 4.63261 10 4.5 10C4.36739 10 4.24021 9.94732 4.14645 9.85355C4.05268 9.75979 4 9.63261 4 9.5V5.5C4 5.36739 4.05268 5.24021 4.14645 5.14645C4.24021 5.05268 4.36739 5 4.5 5C4.63261 5 4.75979 5.05268 4.85355 5.14645C4.94732 5.24021 5 5.36739 5 5.5ZM8 5.5V9.5C8 9.63261 7.94732 9.75979 7.85355 9.85355C7.75979 9.94732 7.63261 10 7.5 10C7.36739 10 7.24021 9.94732 7.14645 9.85355C7.05268 9.75979 7 9.63261 7 9.5V5.5C7 5.36739 7.05268 5.24021 7.14645 5.14645C7.24021 5.05268 7.36739 5 7.5 5C7.63261 5 7.75979 5.05268 7.85355 5.14645C7.94732 5.24021 8 5.36739 8 5.5Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </article>
  );
}
