'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, Palette, ArrowRight, Sparkles } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirmPassword) {
            setError('As senhas não coincidem')
            return
        }

        if (form.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Erro ao criar conta')
                setLoading(false)
                return
            }

            localStorage.setItem('rabix-token', data.token)
            localStorage.setItem('rabix-user', JSON.stringify(data.user))
            router.push('/dashboard')
        } catch {
            setError('Erro de conexão. Tente novamente.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rabix-gray via-white to-rabix-purple/5 flex items-center justify-center p-6">
            <div className="absolute top-10 left-10 w-72 h-72 bg-rabix-purple/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-rabix-orange/10 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-rabix-purple to-rabix-orange rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                            <Palette className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold">
                            <span className="text-rabix-purple">Ra</span>
                            <span className="text-rabix-orange">bix</span>
                        </span>
                    </Link>
                    <p className="text-rabix-dark/50 mt-3">Crie sua conta gratuita ✨</p>
                </div>

                {/* Card */}
                <div className="glass-card p-8 shadow-xl shadow-rabix-purple/5">
                    <h1 className="text-2xl font-bold mb-6">Criar Conta</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-scale-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Nome</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rabix-dark/30" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Seu nome completo"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 focus:border-rabix-purple transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rabix-dark/30" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="seu@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 focus:border-rabix-purple transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rabix-dark/30" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    className="w-full pl-12 pr-12 py-3.5 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 focus:border-rabix-purple transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-rabix-dark/30 hover:text-rabix-purple transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Confirmar Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rabix-dark/30" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    placeholder="Repita a senha"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 focus:border-rabix-purple transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rabix-purple/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 btn-glow flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="spinner w-5 h-5 border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    Criar Conta
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-rabix-dark/50 text-sm">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-rabix-purple font-semibold hover:text-rabix-purple-dark transition-colors">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
