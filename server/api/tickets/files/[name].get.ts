// server/api/tickets/files/[name].get.ts
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

export default defineEventHandler(async (event) => {
  const fileName = getRouterParam(event, 'name')
  if (!fileName) throw createError({ statusCode: 400 })

  const filePath = join(process.cwd(), 'server/uploads', fileName)
  
  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, message: 'Файл не найден' })
  }

  const file = readFileSync(filePath)
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }

  return new Response(file, {
    headers: {
      'Content-Type': mimeTypes[ext || ''] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600'
    }
  })
})