// server/api/tickets/upload.post.ts
import { writeFile, mkdirSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400 })

  const files = []
  const uploadDir = join(process.cwd(), 'server/uploads')
  try { mkdirSync(uploadDir, { recursive: true }) } catch {}

  for (const file of formData) {
    // Проверка размера (10MB)
    if (file.data.length > 10 * 1024 * 1024) {
      throw createError({ statusCode: 400, message: `Файл ${file.filename} слишком большой` })
    }

    // Проверка типа
    const ext = file.filename?.split('.').pop()?.toLowerCase()
    if (!['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'].includes(ext || '')) {
      throw createError({ statusCode: 400, message: `Недопустимый формат: ${ext}` })
    }

    const fileName = `${Date.now()}-${file.filename}`
    const filePath = join(uploadDir, fileName)

    // Оптимизируем изображения
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) {
      const optimized = await sharp(file.data)
        .resize(1920, 1080, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toBuffer()
      
      writeFile(filePath, optimized, () => {})
    } else {
      writeFile(filePath, file.data, () => {})
    }

    files.push({
      fileName: file.filename,
      filePath: `/uploads/${fileName}`,
      fileSize: file.data.length,
      mimeType: file.type
    })
  }

  return { files }
})