import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { plan } = await request.json()

        const planPrices = {
            basico: { amount: 1900, photos: 20 },
            premium: { amount: 3900, photos: 40 },
            familia: { amount: 5900, photos: 80 },
        }

        if (!planPrices[plan]) {
            return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
        }

        const stripeKey = process.env.STRIPE_SECRET_KEY

        // If Stripe is not configured, run in demo mode
        if (!stripeKey) {
            // Demo mode: directly update user plan
            const prisma = (await import('@/lib/prisma')).default
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    planType: plan,
                    photoLimit: planPrices[plan].photos,
                },
            })

            await prisma.payment.create({
                data: {
                    userId: user.id,
                    plan,
                    amount: planPrices[plan].amount / 100,
                    paymentStatus: 'completed',
                },
            })

            return NextResponse.json({
                success: true,
                demo: true,
                message: 'Plano atualizado (modo demonstração)',
            })
        }

        // Stripe checkout session
        const stripe = (await import('stripe')).default(stripeKey)

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: `Rabix - Plano ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
                            description: `Até ${planPrices[plan].photos} fotos para caderno de colorir`,
                        },
                        unit_amount: planPrices[plan].amount,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user.id,
                plan,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/planos?payment=cancelled`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 })
    }
}
