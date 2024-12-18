import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure the uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Save the file
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const path = join(uploadsDir, filename)
    await writeFile(path, buffer)

    // Generate the public URL
    const fileUrl = `https://pixelcast.vercel.app/uploads/${filename}`

    console.log('File saved successfully:', fileUrl)

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Error in upload-temp route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

