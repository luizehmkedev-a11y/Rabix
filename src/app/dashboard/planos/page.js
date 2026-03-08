'use client'

import { useState, useEffect } from 'react'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'

export default function PlanosPage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('rabix-user')
        if (userData) setUser(JSON.parse(userData))
    }, [])

    const plans = [
        {
            id: 'basico',
            name: 'Básico',
            price: 19,
            icon: Zap,
            photos: 20,
            features: ['Até 20 fotos', '1 caderno de colorir', 'PDF em alta qualidade', 'Download ilimitado', 'Suporte por email'],
            gradient: 'from-rabix-dark to-rabix-dark-light',
            buttonGradient: 'from-rabix-purple to-rabix-purple-dark',
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 39,
            icon: Sparkles,
            photos: 40,
            popular: true,
            features: ['Até 40 fotos', '3 cadernos de colorir', 'PDF em alta qualidade', 'Download ilimitado', 'Suporte prioritário', 'Capa personalizada'],
            gradient: 'from-rabix-purple to-rabix-purple-dark',
            buttonGradient: 'from-rabix-orange to-rabix-orange-dark',
        },
        {
            id: 'familia',
            name: 'Família',
            price: 59,
            icon: Crown,
            photos: 80,
            features: ['Até 80 fotos', 'Cadernos ilimitados', 'PDF em alta qualidade', 'Download ilimitado', 'Suporte VIP', 'Capa personalizada', 'Páginas de atividades extras'],
            gradient: 'from-rabix-dark to-rabix-dark-light',
            buttonGradient: 'from-rabix-purple to-rabix-purple-dark',
        },
    ]

    const handleSelectPlan = async (planId) => {
        setLoading(planId)
        try {
            const token = localStorage.getItem('rabix-token')
            const res = await fetch('/api/payments/checkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plan: planId }),
            })

            if (res.ok) {
                const data = await res.json()
                if (data.url) {
                    window.location.href = data.url
                } else {
                    // Demo mode: update user plan directly
                    const updatedUser = { ...user, planType: planId, photoLimit: plans.find(p => p.id === planId)?.photos || 20 }
                    localStorage.setItem('rabix-user', JSON.stringify(updatedUser))
                    setUser(updatedUser)
                    alert('Plano atualizado com sucesso! (modo demonstração)')
                }
            }
        } catch (err) {
            console.error('Checkout error:', err)
        }
        setLoading(null)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">
                    Escolha seu <span className="gradient-text">plano</span>
                </h2>
                <p className="text-rabix-dark/50">
                    Plano atual: <span className="font-semibold text-rabix-purple">{user?.planType === 'free' ? 'Gratuito' : user?.planType}</span>
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const isCurrentPlan = user?.planType === plan.id
                    return (
                        <div key={plan.id} className={`relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${plan.popular ? 'scale-105 shadow-2xl shadow-rabix-purple/20' : 'shadow-lg hover:shadow-xl'
                            }`}>
                            {plan.popular && (
                                <div className="absolute top-0 left-0 right-0 bg-rabix-orange text-white text-center py-2 text-sm font-bold z-10">
                                    ⭐ Mais Popular
                                </div>
                            )}
                            <div className={`bg-gradient-to-br ${plan.gradient} text-white p-6 ${plan.popular ? 'pt-12' : ''}`}>
                                <plan.icon className="w-8 h-8 mb-3 opacity-80" />
                                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm opacity-60">R$</span>
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                </div>
                                <p className="text-sm opacity-50 mt-1">pagamento único</p>
                            </div>
                            <div className="bg-white p-6">
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-rabix-dark/70">
                                            <Check className="w-4 h-4 text-rabix-purple flex-shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleSelectPlan(plan.id)}
                                    disabled={isCurrentPlan || loading === plan.id}
                                    className={`w-full py-3 font-bold rounded-xl text-center transition-all btn-glow ${isCurrentPlan
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : `bg-gradient-to-r ${plan.buttonGradient} text-white hover:shadow-lg hover:opacity-90`
                                        }`}
                                >
                                    {isCurrentPlan ? 'Plano Atual' : loading === plan.id ? 'Processando...' : 'Escolher Plano'}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
