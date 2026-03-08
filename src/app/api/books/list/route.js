import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const books = await prisma.coloringBook.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ books })
    } catch (error) {
        console.error('List books error:', error)
        return NextResponse.json({ error: 'Erro ao listar cadernos' }, { status: 500 })
    }
}
