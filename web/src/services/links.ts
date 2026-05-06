import api from './api';

export type LinkItem = {
  id?: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt?: string;
};

export type LinksResponse = {
  data: LinkItem[];
  nextCursor?: string | null;
  hasNextPage?: boolean;
};

export type CreateLinkPayload = {
  originalUrl: string;
  shortUrl?: string;
};

export const createLink = async (payload: CreateLinkPayload) => (await api.post('/links', payload)).data;
export const getLinks = async (cursor?: string | null) => (await api.get<LinksResponse>('/links', { params: cursor ? { cursor } : undefined })).data;
export const getLink = async (shortUrl: string) => (await api.get<LinkItem>(`/links/${shortUrl}`)).data;
export const deleteLink = async (shortUrl: string) => { await api.delete(`/links/${shortUrl}`); };
export const incrementAccess = async (shortUrl: string) => { await api.patch(`/links/${shortUrl}/access`); };
export const exportCSV = async () => (await api.post<{ fileUrl: string }>('/links/export')).data;
