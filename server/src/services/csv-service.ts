import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

interface LinkRecord {
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: Date
}

function generateCsvContent(links: LinkRecord[]): string {
  const header = 'original_url,short_url,access_count,created_at'
  
  const rows = links.map((link) => {
    const escapedOriginal = `"${link.originalUrl.replace(/"/g, '""')}"`
    const escapedShort = `"${link.shortUrl.replace(/"/g, '""')}"`
    return `${escapedOriginal},${escapedShort},${link.accessCount},${link.createdAt.toISOString()}`
  })

  return [header, ...rows].join('\n')
}

export async function generateCsvAndUpload(links: LinkRecord[]) {
  const csvContent = generateCsvContent(links)
  
  // Nome único para o arquivo
  const fileName = `exports/${uuidv4()}.csv`

  // Configurar cliente S3 para Cloudflare R2
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
    },
  })

  // Upload para R2
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET!,
    Key: fileName,
    Body: csvContent,
    ContentType: 'text/csv',
  })

  await s3Client.send(command)

  // URL pública do arquivo
  const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`

  return {
    fileUrl: publicUrl,
    fileName,
    recordCount: links.length,
  }
}
