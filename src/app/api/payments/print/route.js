import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { bookId } = await request.json()

        if (!bookId) {
            return NextResponse.json({ error: 'ID do caderno é obrigatório' }, { status: 400 })
        }

        const book = await prisma.coloringBook.findUnique({
            where: { id: bookId },
        })

        if (!book || book.userId !== user.id) {
            return NextResponse.json({ error: 'Caderno não encontrado' }, { status: 404 })
        }

        if (book.status === 'deleted') {
            return NextResponse.json({ error: 'Este caderno já expirou e foi excluído.' }, { status: 400 })
        }

        const stripeKey = process.env.STRIPE_SECRET_KEY
        const printPrice = 2990 // R$ 29,90 em centavos

        // If Stripe is not configured, run in demo mode
        if (!stripeKey) {
            // Demo mode: just return success
            return NextResponse.json({
                success: true,
                demo: true,
                message: 'Pedido de impressão recebido (modo demonstração)',
            })
        }

        // Stripe checkout session with shipping address collection
        const stripe = (await import('stripe')).default(stripeKey)

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['BR'], // Shipping to Brazil only
            },
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: `Impressão Física - ${book.title}`,
                            description: `Caderno de colorir impresso e entregue na sua casa.`,
                        },
                        unit_amount: printPrice,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user.id,
                bookId: book.id,
                orderType: 'print_delivery',
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/cadernos?print=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/cadernos?print=cancelled`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Print checkout error:', error)
        return NextResponse.json({ error: 'Erro ao processar pedido de impressão' }, { status: 500 })
    }
}
