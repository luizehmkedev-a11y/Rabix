import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { generateColoringBookPDF } from '@/lib/pdfGenerator'

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { title, drawingIds } = await request.json()

        if (!drawingIds || drawingIds.length === 0) {
            return NextResponse.json({ error: 'Selecione pelo menos um desenho' }, { status: 400 })
        }

        // Get drawings
        const drawings = await prisma.drawing.findMany({
            where: {
                id: { in: drawingIds },
                photo: { userId: user.id },
            },
        })

        if (drawings.length === 0) {
            return NextResponse.json({ error: 'Nenhum desenho encontrado' }, { status: 404 })
        }

        // Read drawing files
        const drawingBuffers = []
        for (const drawing of drawings) {
            const drawingPath = path.join(process.cwd(), 'public', drawing.drawingUrl)
            if (existsSync(drawingPath)) {
                const buffer = await readFile(drawingPath)
                drawingBuffers.push({ buffer, name: drawing.id })
            }
        }

        // Generate PDF
        const pdfBuffer = await generateColoringBookPDF({
            title: title || `Meu Caderno de Colorir`,
            drawings: drawingBuffers,
            userName: user.name,
        })

        // Save PDF
        const pdfDir = path.join(process.cwd(), 'public', 'pdfs')
        if (!existsSync(pdfDir)) {
            await mkdir(pdfDir, { recursive: true })
        }

        const pdfFileName = `caderno-${user.id}-${Date.now()}.pdf`
        const pdfPath = path.join(pdfDir, pdfFileName)
        await writeFile(pdfPath, pdfBuffer)

        // Create coloring book record
        const book = await prisma.coloringBook.create({
            data: {
                userId: user.id,
                title: title || 'Meu Caderno de Colorir',
                pdfUrl: `/pdfs/${pdfFileName}`,
                status: 'ready',
                pages: drawingBuffers.length,
            },
        })

        return NextResponse.json({ book })
    } catch (error) {
        console.error('Book generation error:', error)
        return NextResponse.json({ error: 'Erro ao gerar caderno: ' + error.message }, { status: 500 })
    }
}
