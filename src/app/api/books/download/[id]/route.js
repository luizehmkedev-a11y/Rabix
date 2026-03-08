import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request, { params }) {
    try {
        const { id } = params

        // Get token from query param or header
        const url = new URL(request.url)
        const queryToken = url.searchParams.get('token')
        const authHeader = request.headers.get('authorization')
        const token = queryToken || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null)

        if (!token) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
        }

        // Get book
        const book = await prisma.coloringBook.findUnique({ where: { id } })
        if (!book || book.userId !== decoded.id) {
            return NextResponse.json({ error: 'Caderno não encontrado' }, { status: 404 })
        }

        if (!book.pdfUrl) {
            return NextResponse.json({ error: 'PDF não disponível' }, { status: 404 })
        }

        // Read and serve PDF
        const pdfPath = path.join(process.cwd(), 'public', book.pdfUrl)
        if (!existsSync(pdfPath)) {
            return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
        }

        const pdfBuffer = await readFile(pdfPath)

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        })
    } catch (error) {
        console.error('Download error:', error)
        return NextResponse.json({ error: 'Erro ao baixar PDF' }, { status: 500 })
    }
}
