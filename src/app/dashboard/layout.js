'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard, BookOpen, Upload, CreditCard, Settings,
    Palette, LogOut, Menu, X, ChevronRight, Bell
} from 'lucide-react'

const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/cadernos', icon: BookOpen, label: 'Meus Cadernos' },
    { href: '/dashboard/upload', icon: Upload, label: 'Enviar Fotos' },
    { href: '/dashboard/planos', icon: CreditCard, label: 'Planos' },
    { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
]

export default function DashboardLayout({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('rabix-token')
        const userData = localStorage.getItem('rabix-user')
        if (!token || !userData) {
            router.push('/login')
            return
        }
        try {
            setUser(JSON.parse(userData))
        } catch {
            router.push('/login')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('rabix-token')
        localStorage.removeItem('rabix-user')
        router.push('/')
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-rabix-gray flex items-center justify-center">
                <div className="spinner" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-rabix-gray flex">
            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-rabix-purple/5 flex flex-col transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                {/* Logo */}
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-rabix-purple to-rabix-orange rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                            <Palette className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">
                            <span className="text-rabix-purple">Ra</span>
                            <span className="text-rabix-orange">bix</span>
                        </span>
                    </Link>
                    <button
                        className="lg:hidden p-1 rounded-lg hover:bg-rabix-gray transition-colors"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 pb-4">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white shadow-lg shadow-rabix-purple/20'
                                            : 'text-rabix-dark/50 hover:text-rabix-purple hover:bg-rabix-purple/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-rabix-purple/5">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-rabix-purple to-rabix-orange rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-xs text-rabix-dark/40 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-rabix-purple/5 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 rounded-xl hover:bg-rabix-gray transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-rabix-dark">
                                {menuItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                            </h1>
                            <p className="text-xs text-rabix-dark/40">
                                Plano {user.planType === 'free' ? 'Gratuito' : user.planType}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-xl hover:bg-rabix-gray transition-colors relative">
                            <Bell className="w-5 h-5 text-rabix-dark/50" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rabix-orange rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
