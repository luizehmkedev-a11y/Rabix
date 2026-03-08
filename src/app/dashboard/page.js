'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Upload, BookOpen, Image, TrendingUp, ArrowRight,
    Sparkles, Camera, Download, Palette
} from 'lucide-react'

export default function DashboardPage() {
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({ photos: 0, books: 0, downloads: 0 })

    useEffect(() => {
        const userData = localStorage.getItem('rabix-user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
        }
    }, [])

    const planLimits = {
        free: 3,
        basico: 20,
        premium: 40,
        familia: 80,
    }

    const quickActions = [
        {
            href: '/dashboard/upload',
            icon: Upload,
            title: 'Enviar Fotos',
            description: 'Faça upload das suas fotos',
            gradient: 'from-rabix-purple to-rabix-purple-dark',
        },
        {
            href: '/dashboard/cadernos',
            icon: BookOpen,
            title: 'Meus Cadernos',
            description: 'Ver cadernos gerados',
            gradient: 'from-rabix-orange to-rabix-orange-dark',
        },
        {
            href: '/dashboard/planos',
            icon: Sparkles,
            title: 'Upgrade',
            description: 'Melhorar meu plano',
            gradient: 'from-violet-500 to-purple-700',
        },
    ]

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome */}
            <div className="glass-card p-8 bg-gradient-to-r from-rabix-purple/5 to-rabix-orange/5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">
                            Olá, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Criador'}</span>! 👋
                        </h2>
                        <p className="text-rabix-dark/50">
                            Pronto para transformar suas fotos em arte para colorir?
                        </p>
                    </div>
                    <Link
                        href="/dashboard/upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rabix-purple/25 transition-all hover:-translate-y-0.5 btn-glow whitespace-nowrap"
                    >
                        <Camera className="w-5 h-5" />
                        Enviar Fotos
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-6">
                {[
                    { icon: Image, label: 'Fotos Enviadas', value: user?.photosUsed || 0, limit: planLimits[user?.planType] || 3, color: 'text-rabix-purple', bg: 'bg-rabix-purple/10' },
                    { icon: BookOpen, label: 'Cadernos Criados', value: stats.books, color: 'text-rabix-orange', bg: 'bg-rabix-orange/10' },
                    { icon: Download, label: 'Downloads', value: stats.downloads, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-sm text-rabix-dark/50 font-medium">{stat.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">{stat.value}</span>
                            {stat.limit && (
                                <span className="text-sm text-rabix-dark/30">/ {stat.limit}</span>
                            )}
                        </div>
                        {stat.limit && (
                            <div className="mt-3 progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${Math.min((stat.value / stat.limit) * 100, 100)}%` }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                    {quickActions.map((action, idx) => (
                        <Link
                            key={idx}
                            href={action.href}
                            className="glass-card p-6 group hover:shadow-xl hover:shadow-rabix-purple/10 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold mb-1">{action.title}</h4>
                            <p className="text-sm text-rabix-dark/50">{action.description}</p>
                            <ArrowRight className="w-4 h-4 text-rabix-purple mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Empty state for recent books */}
            <div>
                <h3 className="text-lg font-bold mb-4">Cadernos Recentes</h3>
                <div className="glass-card p-12 text-center">
                    <div className="w-20 h-20 bg-rabix-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Palette className="w-10 h-10 text-rabix-purple/40" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Nenhum caderno ainda</h4>
                    <p className="text-rabix-dark/40 mb-6 max-w-sm mx-auto">
                        Envie suas primeiras fotos e crie seu caderno de colorir personalizado!
                    </p>
                    <Link
                        href="/dashboard/upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all btn-glow"
                    >
                        <Upload className="w-4 h-4" />
                        Começar Agora
                    </Link>
                </div>
            </div>
        </div>
    )
}
