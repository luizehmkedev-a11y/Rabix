import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import sharp from 'sharp'

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Get the user record to check limits
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (!dbUser) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        if (dbUser.photosUsed >= dbUser.photoLimit) {
            return NextResponse.json({ error: 'Limite de fotos atingido. Faça upgrade do seu plano.' }, { status: 403 })
        }

        const formData = await request.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.' }, { status: 400 })
        }

        // Validate size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'Arquivo muito grande. Máximo 10MB.' }, { status: 400 })
        }

        // Create uploads directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        // Save file
        const buffer = Buffer.from(await file.arrayBuffer())

        // Use Sharp to process and validate the image immediately (removes EXIF/metadata and prevents malicious files)
        let safeBuffer
        try {
            safeBuffer = await sharp(buffer)
                .rotate() // auto-rotate based on EXIF to keep orientation, then strips EXIF
                .webp({ quality: 90 }) // Convert everything to webp for better optimization
                .toBuffer()
        } catch (sharpError) {
            console.error('Sharp validation failed:', sharpError)
            return NextResponse.json({ error: 'Arquivo de imagem inválido ou corrompido.' }, { status: 400 })
        }

        const fileName = `${user.id}-${Date.now()}.webp`
        const filePath = path.join(uploadDir, fileName)
        await writeFile(filePath, safeBuffer)

        // Create database record
        const photo = await prisma.photo.create({
            data: {
                userId: user.id,
                fileUrl: `/uploads/${fileName}`,
                fileName: file.name || fileName,
                status: 'uploaded',
            },
        })

        // NOTE: Credit consumption (photosUsed increment) moved to process route 
        // to prevent charging users for failed processing.

        return NextResponse.json({ photo })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
    }
}
