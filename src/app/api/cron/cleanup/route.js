import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { rm } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(request) {
    try {
        // Basic security to ensure only automated jobs or admins can run this
        // In production, require an Authorization header or Vercel Cron Secret
        const authHeader = request.headers.get('authorization')
        if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const RETENTION_DAYS = 30
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() - RETENTION_DAYS)

        console.log(`Starting cleanup job. Finding files older than: ${expirationDate.toISOString()}`)

        let deletedPhotosCount = 0
        let deletedDrawingsCount = 0
        let deletedBooksCount = 0

        // 1. Cleanup Old Photos
        const oldPhotos = await prisma.photo.findMany({
            where: {
                createdAt: { lt: expirationDate },
                status: { not: 'deleted' },
            },
        })

        for (const photo of oldPhotos) {
            if (photo.fileUrl) {
                const filePath = path.join(process.cwd(), 'public', photo.fileUrl)
                if (existsSync(filePath)) {
                    await rm(filePath, { force: true })
                }
            }
            await prisma.photo.update({
                where: { id: photo.id },
                data: { status: 'deleted', deletedAt: new Date(), fileUrl: '' },
            })
            deletedPhotosCount++
        }

        // 2. Cleanup Old Drawings
        const oldDrawings = await prisma.drawing.findMany({
            where: {
                createdAt: { lt: expirationDate },
                deletedAt: null,
            },
        })

        for (const drawing of oldDrawings) {
            if (drawing.drawingUrl) {
                const filePath = path.join(process.cwd(), 'public', drawing.drawingUrl)
                if (existsSync(filePath)) {
                    await rm(filePath, { force: true })
                }
            }
            await prisma.drawing.update({
                where: { id: drawing.id },
                data: { deletedAt: new Date(), drawingUrl: '' },
            })
            deletedDrawingsCount++
        }

        // 3. Cleanup Old PDFs
        const oldBooks = await prisma.coloringBook.findMany({
            where: {
                createdAt: { lt: expirationDate },
                status: { not: 'deleted' },
            },
        })

        for (const book of oldBooks) {
            if (book.pdfUrl) {
                const filePath = path.join(process.cwd(), 'public', book.pdfUrl)
                if (existsSync(filePath)) {
                    await rm(filePath, { force: true })
                }
            }
            await prisma.coloringBook.update({
                where: { id: book.id },
                data: { status: 'deleted', deletedAt: new Date(), pdfUrl: '' },
            })
            deletedBooksCount++
        }

        return NextResponse.json({
            success: true,
            message: 'Cleanup job finished successfully',
            stats: {
                retentionDays: RETENTION_DAYS,
                deletedPhotos: deletedPhotosCount,
                deletedDrawings: deletedDrawingsCount,
                deletedBooks: deletedBooksCount,
            }
        })

    } catch (error) {
        console.error('Cleanup job error:', error)
        return NextResponse.json({ error: 'Erro ao executar limpeza' }, { status: 500 })
    }
}
