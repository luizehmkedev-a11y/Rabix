import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.passwordHash)
        if (!validPassword) {
            return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
        }

        // Generate token
        const token = signToken({ id: user.id, email: user.email, name: user.name })

        // Set HttpOnly cookie
        cookies().set('rabix-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                planType: user.planType,
                photoLimit: user.photoLimit,
                photosUsed: user.photosUsed,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
