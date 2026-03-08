import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { processImageToLineArt } from '@/lib/imageProcessor'

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { photoId, style } = await request.json()

        if (!photoId) {
            return NextResponse.json({ error: 'ID da foto é obrigatório' }, { status: 400 })
        }

        // Get photo record
        const photo = await prisma.photo.findUnique({
            where: { id: photoId },
            include: { drawing: true },
        })

        if (!photo) {
            return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 })
        }

        if (photo.userId !== user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (dbUser.photosUsed >= dbUser.photoLimit) {
            return NextResponse.json({ error: 'Limite de fotos atingido. Faça upgrade do seu plano.' }, { status: 403 })
        }

        // If already processed, return existing drawing
        if (photo.drawing) {
            return NextResponse.json({ drawing: photo.drawing })
        }

        // Read the photo file
        const photoPath = path.join(process.cwd(), 'public', photo.fileUrl)
        if (!existsSync(photoPath)) {
            return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
        }

        const inputBuffer = await readFile(photoPath)

        // Process through AI pipeline with requested style
        const drawingBuffer = await processImageToLineArt(inputBuffer, style || 'cartoon')

        // Save the generated drawing
        const generatedDir = path.join(process.cwd(), 'public', 'generated')
        if (!existsSync(generatedDir)) {
            await mkdir(generatedDir, { recursive: true })
        }

        const drawingFileName = `drawing-${photoId}-${Date.now()}.png`
        const drawingPath = path.join(generatedDir, drawingFileName)
        await writeFile(drawingPath, drawingBuffer)

        // Perform Database Transaction so the user doesn't lose credit if something fails midway
        const [drawing] = await prisma.$transaction([
            prisma.drawing.create({
                data: {
                    photoId: photo.id,
                    drawingUrl: `/generated/${drawingFileName}`,
                },
            }),
            prisma.photo.update({
                where: { id: photoId },
                data: { status: 'processed' },
            }),
            prisma.user.update({
                where: { id: user.id },
                data: { photosUsed: { increment: 1 } },
            })
        ])

        return NextResponse.json({ drawing })
    } catch (error) {
        console.error('Process error:', error)
        return NextResponse.json({ error: 'Erro ao processar imagem: ' + error.message }, { status: 500 })
    }
}
