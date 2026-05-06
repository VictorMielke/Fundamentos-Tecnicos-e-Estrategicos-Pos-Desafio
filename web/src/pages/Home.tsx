import { useEffect, type UIEvent } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import logo from '../assets/figma/logo.svg';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { LinkCard } from '../components/LinkCard';
import { LinkForm } from '../components/LinkForm';
import { createLinkMutationKey, deleteLinkMutationKey, useDeleteLink, useExportCSV, useLinks } from '../hooks/useLinks';

export default function Home() {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useLinks();
  const del = useDeleteLink();
  const csv = useExportCSV();
  const creatingLinks = useIsMutating({ mutationKey: createLinkMutationKey }) > 0;
  const deletingLinks = useIsMutating({ mutationKey: deleteLinkMutationKey }) > 0;
  const isMutatingLinks = creatingLinks || deletingLinks;
  const links = data?.pages.flatMap((page) => page.data) ?? [];
  const canExport = links.length > 0 && !csv.isPending;

  const handleDelete = async (shortUrl: string) => {
    if (!confirm(`Deseja deletar /${shortUrl}?`)) return;
    try {
      await del.mutateAsync(shortUrl);
      toast.success('Link deletado');
    } catch (error: any) {
      toast.error(error.friendlyMessage || 'Falha ao deletar link');
    }
  };

  const handleExport = async () => {
    try {
      const result = await csv.mutateAsync();
      window.open(result.fileUrl, '_blank');
      toast.success('CSV gerado com sucesso');
    } catch (error: any) {
      toast.error(error.friendlyMessage || 'Falha ao exportar CSV');
    }
  };

  const handleLinksScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;
    const target = event.currentTarget;
    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 40;
    if (nearBottom) {
      void fetchNextPage();
    }
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refetch();
      }
    };

    const onPageShow = () => {
      void refetch();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [refetch]);

  return (
    <main className="mx-auto flex h-dvh w-full max-w-[980px] flex-col overflow-hidden px-3 py-6 md:px-0 md:py-10">
      <header className="mb-6 flex flex-none justify-center md:mb-8 md:justify-start">
        <img src={logo} alt="brev.ly" className="h-[21px] w-auto" />
      </header>

      <section className="grid min-h-0 flex-1 items-start gap-5 overflow-hidden pb-3 md:grid-cols-[380px_580px]">
        <Card className="min-h-[340px] self-start">
          <h2 className="mb-5 mt-0 text-[24px] font-bold leading-none text-[#1F2025]">Novo link</h2>
          <LinkForm />
        </Card>

        <Card className={`relative flex min-h-[280px] max-h-full flex-col overflow-hidden ${links.length > 0 ? 'h-full self-stretch' : 'h-auto self-start'}`}>
          {isMutatingLinks ? (
            <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden rounded-t-lg bg-[#D9DCE4]">
              <div className="loading-topbar h-full w-1/3 rounded-r-full bg-[var(--primary)]" />
            </div>
          ) : null}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0 text-[24px] font-bold leading-none text-[#1F2025]">Meus links</h2>
            <button
              type="button"
              className={`ml-auto flex h-8 w-[100px] flex-none flex-row items-center justify-center gap-1.5 rounded-[4px] px-2 text-[11px] font-semibold transition-colors ${
                canExport
                  ? 'cursor-pointer bg-[#E4E6EC] text-[#4D505C] hover:bg-[#D9DCE4]'
                  : 'cursor-not-allowed bg-[#E4E6EC] text-[#9FA4B2]'
              }`}
              disabled={!canExport}
              onClick={handleExport}
            >
              <svg width="12" height="12" viewBox="10 9 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22 17V21C22 21.1326 21.9473 21.2598 21.8536 21.3536C21.7598 21.4473 21.6326 21.5 21.5 21.5H10.5C10.3674 21.5 10.2402 21.4473 10.1464 21.3536C10.0527 21.2598 10 21.1326 10 21V17C10 16.8674 10.0527 16.7402 10.1464 16.6464C10.2402 16.5527 10.3674 16.5 10.5 16.5C10.6326 16.5 10.7598 16.5527 10.8536 16.6464C10.9473 16.7402 11 16.8674 11 17V20.5H21V17C21 16.8674 21.0527 16.7402 21.1464 16.6464C21.2402 16.5527 21.3674 16.5 21.5 16.5C21.6326 16.5 21.7598 16.5527 21.8536 16.6464C21.9473 16.7402 22 16.8674 22 17ZM15.6462 17.3538C15.6927 17.4002 15.7478 17.4371 15.8085 17.4623C15.8692 17.4874 15.9343 17.5004 16 17.5004C16.0657 17.5004 16.1308 17.4874 16.1915 17.4623C16.2522 17.4371 16.3073 17.4002 16.3538 17.3538L18.8538 14.8538C18.9002 14.8073 18.9371 14.7521 18.9622 14.6914C18.9873 14.6308 19.0003 14.5657 19.0003 14.5C19.0003 14.4343 18.9873 14.3692 18.9622 14.3086C18.9371 14.2479 18.9002 14.1927 18.8538 14.1462C18.8073 14.0998 18.7521 14.0629 18.6914 14.0378C18.6308 14.0127 18.5657 13.9997 18.5 13.9997C18.4343 13.9997 18.3692 14.0127 18.3086 14.0378C18.2479 14.0629 18.1927 14.0998 18.1462 14.1462L16.5 15.7931V10C16.5 9.86739 16.4473 9.74021 16.3536 9.64645C16.2598 9.55268 16.1326 9.5 16 9.5C15.8674 9.5 15.7402 9.55268 15.6464 9.64645C15.5527 9.74021 15.5 9.86739 15.5 10V15.7931L13.8538 14.1462C13.7599 14.0524 13.6327 13.9997 13.5 13.9997C13.3673 13.9997 13.2401 14.0524 13.1462 14.1462C13.0524 14.2401 12.9997 14.3673 12.9997 14.5C12.9997 14.6327 13.0524 14.7599 13.1462 14.8538L15.6462 17.3538Z" fill="#1F2025" />
              </svg>
              <span>Baixar CSV</span>
            </button>
          </div>
          <div className="border-t border-[var(--border)] pb-2" />

          {isLoading ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D4D6DE] border-t-[#9CA1AF]" />
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA1AF]">Carregando links...</p>
            </div>
          ) : null}
          {isError ? (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-[var(--danger)]">Erro ao carregar links.</p>
              <Button type="button" onClick={() => refetch()}>Tentar novamente</Button>
            </div>
          ) : null}
          {!isLoading && !isError && links.length === 0 ? <EmptyState /> : null}
          {!isLoading && !isError && links.length > 0 ? (
            <div className="links-scroll flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-1 pr-1" onScroll={handleLinksScroll}>
              {links.map((link) => (
                <LinkCard key={link.shortUrl} link={link} deleting={del.isPending && del.variables === link.shortUrl} onDelete={handleDelete} />
              ))}
            </div>
          ) : null}
          {hasNextPage ? (
            <div className="mt-4">
              <Button type="button" loading={isFetchingNextPage} onClick={() => fetchNextPage()}>Carregar mais</Button>
            </div>
          ) : null}
        </Card>
      </section>
    </main>
  );
}

