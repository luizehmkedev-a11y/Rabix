'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Lock, Save, Check, AlertCircle } from 'lucide-react'

export default function ConfiguracoesPage() {
    const [user, setUser] = useState(null)
    const [form, setForm] = useState({ name: '', email: '' })
    const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' })
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        const userData = localStorage.getItem('rabix-user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            setForm({ name: parsed.name, email: parsed.email })
        }
    }, [])

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })

        // Demo mode: update locally
        const updatedUser = { ...user, ...form }
        localStorage.setItem('rabix-user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        setSaving(false)
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (passwordForm.newPassword !== passwordForm.confirm) {
            setMessage({ type: 'error', text: 'As senhas não coincidem' })
            return
        }
        if (passwordForm.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' })
            return
        }
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
        setPasswordForm({ current: '', newPassword: '', confirm: '' })
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {message.text && (
                <div className={`flex items-center gap-2 p-4 rounded-xl animate-scale-in ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {/* Profile */}
            <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-rabix-purple" />
                    Perfil
                </h3>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Nome</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all btn-glow"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-rabix-purple" />
                    Alterar Senha
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Senha Atual</label>
                        <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className="w-full px-4 py-3 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Nova Senha</label>
                        <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-rabix-dark/70 mb-2">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full px-4 py-3 bg-rabix-gray border border-rabix-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rabix-purple/30 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rabix-orange to-rabix-orange-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all btn-glow"
                    >
                        <Lock className="w-4 h-4" />
                        Alterar Senha
                    </button>
                </form>
            </div>

            {/* Account Info */}
            <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-rabix-purple" />
                    Informações da Conta
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-rabix-purple/5">
                        <span className="text-rabix-dark/50">Plano</span>
                        <span className="font-semibold text-rabix-purple">{user?.planType === 'free' ? 'Gratuito' : user?.planType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-rabix-purple/5">
                        <span className="text-rabix-dark/50">Fotos usadas</span>
                        <span className="font-semibold">{user?.photosUsed || 0} / {user?.photoLimit || 3}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-rabix-dark/50">Membro desde</span>
                        <span className="font-semibold">{new Date().toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
