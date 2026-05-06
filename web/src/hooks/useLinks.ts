import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLink, deleteLink, exportCSV, getLink, getLinks, incrementAccess } from '../services/links';
import type { CreateLinkPayload } from '../services/links';

export const linksQueryKey = ['links'];
export const createLinkMutationKey = ['create-link'];
export const deleteLinkMutationKey = ['delete-link'];

export function useLinks() {
  return useInfiniteQuery({
    queryKey: linksQueryKey,
    queryFn: ({ pageParam }) => getLinks(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: createLinkMutationKey,
    mutationFn: (payload: CreateLinkPayload) => createLink(payload),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: linksQueryKey }); },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: deleteLinkMutationKey,
    mutationFn: (shortUrl: string) => deleteLink(shortUrl),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: linksQueryKey }); },
  });
}

export function useExportCSV() {
  return useMutation({ mutationFn: () => exportCSV() });
}

export function useLink(shortUrl: string) {
  return useQuery({ queryKey: ['link', shortUrl], queryFn: () => getLink(shortUrl), enabled: Boolean(shortUrl), retry: false });
}

export function useIncrementAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shortUrl: string) => incrementAccess(shortUrl),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });
}
