import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Save the file
  const filename = `${Date.now()}_${file.name}`
  const path = join(process.cwd(), 'public', 'uploads', filename)
  await writeFile(path, buffer)

  // Generate the public URL
  const fileUrl = `https://pixelcast.vercel.app/uploads/${filename}`

  return NextResponse.json({ url: fileUrl })
}