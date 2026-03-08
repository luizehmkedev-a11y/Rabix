import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const stripeKey = process.env.STRIPE_SECRET_KEY
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

        if (!stripeKey || !webhookSecret) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 501 })
        }

        const stripe = (await import('stripe')).default(stripeKey)
        const body = await request.text()
        const sig = request.headers.get('stripe-signature')

        let event
        try {
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message)
            return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const metadata = session.metadata || {}

            const prisma = (await import('@/lib/prisma')).default

            if (metadata.orderType === 'print_delivery') {
                // Handle physical print order
                const { userId, bookId } = metadata

                // In a real app, you would save this to an Orders table
                // with the session.shipping_details and trigger an email to fulfillment team
                console.log('PRINT ORDER RECEIVED:', {
                    userId,
                    bookId,
                    amount: session.amount_total / 100,
                    shippingDetails: session.shipping_details,
                    customerEmail: session.customer_details?.email
                })

            } else {
                // Handle subscription/plan payment
                const { userId, plan } = metadata
                const planPhotos = { basico: 20, premium: 40, familia: 80 }

                // Idempotency check
                if (session.payment_intent) {
                    const existingPayment = await prisma.payment.findUnique({
                        where: { stripeId: session.payment_intent }
                    })

                    if (existingPayment) {
                        console.log('Payment already processed:', session.payment_intent)
                        return NextResponse.json({ received: true, status: 'already_processed' })
                    }
                }

                // Database Transaction
                await prisma.$transaction(async (tx) => {
                    // Update user plan
                    await tx.user.update({
                        where: { id: userId },
                        data: {
                            planType: plan,
                            photoLimit: planPhotos[plan] || 20,
                        },
                    })

                    // Record payment
                    await tx.payment.create({
                        data: {
                            userId,
                            plan,
                            amount: session.amount_total / 100,
                            paymentStatus: 'completed',
                            stripeId: session.payment_intent,
                        },
                    })
                })
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}
