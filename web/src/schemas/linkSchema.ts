import { z } from 'zod';

const SLUG_REGEX = /^[a-zA-Z0-9-_]+$/;

export const createLinkSchema = z.object({
  originalUrl: z.string().url('URL original invalida'),
  shortUrl: z.string().regex(SLUG_REGEX, 'Formato de URL encurtada invalido').optional().or(z.literal('')),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
