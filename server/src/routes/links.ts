import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  createLink,
  deleteLinkByShortUrl,
  getLinkByShortUrl,
  listLinks,
  incrementAccessCount,
  getAllLinksForExport,
  ValidationError,
} from '../services/links-service'
import { generateCsvAndUpload } from '../services/csv-service'
import { SLUG_REGEX } from '../utils/random-slug'

export async function linksRoutes(app: FastifyInstance) {
  // POST /links - Criar link encurtado
  app.post('/links', async (request, reply) => {
    const bodySchema = z.object({
      originalUrl: z.string().url('URL original inválida'),
      shortUrl: z
        .string()
        .regex(SLUG_REGEX, 'URL encurtada mal formatada')
        .optional(),
    })

    const { originalUrl, shortUrl } = bodySchema.parse(request.body)

    const link = await createLink(originalUrl, shortUrl)

    return reply.status(201).send(link)
  })

  // GET /links - Listar links (paginado)
  app.get('/links', async (request, reply) => {
    const querySchema = z.object({
      limit: z.coerce.number().int().min(1).max(1000).default(100),
      cursor: z.string().regex(SLUG_REGEX, 'Cursor inválido').optional(),
    })

    const { limit, cursor } = querySchema.parse(request.query)

    const result = await listLinks(limit, cursor)

    return reply.send(result)
  })

  // DELETE /links/:shortUrl - Deletar link
  app.delete('/links/:shortUrl', async (request, reply) => {
    const paramsSchema = z.object({
      shortUrl: z.string().regex(SLUG_REGEX, 'URL encurtada mal formatada'),
    })

    const { shortUrl } = paramsSchema.parse(request.params)

    const deleted = await deleteLinkByShortUrl(shortUrl)

    return reply.send(deleted)
  })

  // GET /links/:shortUrl - Obter dados do link
  app.get('/links/:shortUrl', async (request, reply) => {
    const paramsSchema = z.object({
      shortUrl: z.string().regex(SLUG_REGEX, 'URL encurtada mal formatada'),
    })

    const { shortUrl } = paramsSchema.parse(request.params)

    const link = await getLinkByShortUrl(shortUrl)

    if (!link) {
      return reply.status(404).send({ message: 'Link não encontrado' })
    }

    return reply.send(link)
  })

  // GET /:shortUrl - Redirecionar
  app.get('/:shortUrl', async (request, reply) => {
    const paramsSchema = z.object({
      shortUrl: z.string().regex(SLUG_REGEX, 'URL encurtada mal formatada'),
    })

    const { shortUrl } = paramsSchema.parse(request.params)

    const link = await getLinkByShortUrl(shortUrl)

    if (!link) {
      return reply.status(404).send({ message: 'Link não encontrado' })
    }

    await incrementAccessCount(shortUrl)
    return reply.redirect(link.originalUrl, 302)
  })

  // PATCH /links/:shortUrl/access - Incrementar contador de acessos
  app.patch('/links/:shortUrl/access', async (request, reply) => {
    const paramsSchema = z.object({
      shortUrl: z.string().regex(SLUG_REGEX, 'URL encurtada mal formatada'),
    })

    const { shortUrl } = paramsSchema.parse(request.params)

    const updated = await incrementAccessCount(shortUrl)

    return reply.send(updated)
  })

  // POST /links/export - Exportar CSV
  app.post('/links/export', async (_request, reply) => {
    const links = await getAllLinksForExport()

    const result = await generateCsvAndUpload(links)

    return reply.send(result)
  })

  // Error handler global para ValidationError
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.issues,
      })
    }

    if (error instanceof ValidationError) {
      return reply.status(400).send({
        message: error.message,
      })
    }

    console.error('Erro interno:', error)
    return reply.status(500).send({
      message: 'Erro interno do servidor',
    })
  })
}
