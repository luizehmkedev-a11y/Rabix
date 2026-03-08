import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })
        }

        // Fraud Prevention: Check IP Address
        const forwardedFor = request.headers.get('x-forwarded-for')
        const realIp = request.headers.get('x-real-ip')
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'unknown')

        // Skip restriction for local development
        if (ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
            const existingIp = await prisma.user.findFirst({ where: { ipAddress: ip } })
            if (existingIp) {
                return NextResponse.json({
                    error: 'Não é possível criar múltiplas contas a partir deste dispositivo (Proteção Anti-Fraude).'
                }, { status: 403 })
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                planType: 'free',
                photoLimit: 3,
                photosUsed: 0,
                ipAddress: ip === 'unknown' ? null : ip,
            },
        })

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
        console.error('Signup error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
