import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
    try {
        const { email } = await request.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
        }

        await prisma.lead.upsert({
            where: { email },
            update: {},
            create: { email },
        })

        return NextResponse.json({ success: true, message: 'Email cadastrado com sucesso!' })
    } catch (error) {
        console.error('Lead capture error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
