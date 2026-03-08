'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Download, Calendar, FileImage, Plus, Palette, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CadernosPage() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [printLoading, setPrintLoading] = useState(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Check for success/cancel messages from print checkout
        const printStatus = searchParams.get('print')
        if (printStatus === 'success') {
            alert('Pedido de impressão confirmado! Em breve você receberá seu caderno em casa.')
        } else if (printStatus === 'cancelled') {
            alert('Pedido de impressão cancelado.')
        }
    }, [searchParams])

    useEffect(() => {
        fetchBooks()
    }, [router]) // Dependency on router for potential future navigation-related re-fetches

    const fetchBooks = async () => { // Renamed from loadBooks
        try {
            const token = localStorage.getItem('rabix-token')
            const res = await fetch('/api/books/list', {
                headers: { 'Authorization': `Bearer ${token}` },
            })
            const data = await res.json()
            if (res.ok) {
                setBooks(data.books || [])
            } else {
                setError(data.error || 'Erro ao carregar cadernos')
            }
        } catch (err) {
            console.error('Error loading books:', err)
            setError('Erro de conexão ao carregar cadernos')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async (bookId) => {
        const token = localStorage.getItem('rabix-token')
        window.open(`/api/books/download/${bookId}?token=${token}`, '_blank')
    }

    const handlePrintCheckout = async (bookId) => {
        setPrintLoading(bookId)
        try {
            const token = localStorage.getItem('rabix-token') // Use rabix-token as per existing code
            const res = await fetch('/api/payments/print', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ bookId }),
            })

            const data = await res.json()

            if (res.ok) {
                if (data.demo) {
                    alert('Redirecionaria para o checkout do Stripe para pagar o impresso + frete (Modo de Demonstração).')
                } else if (data.url) {
                    window.location.href = data.url
                }
            } else {
                alert(data.error || 'Erro ao processar pedido')
            }
        } catch (err) {
            console.error('Error during print checkout:', err)
            alert('Erro de conexão')
        } finally {
            setPrintLoading(null)
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ready':
                return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">✓ Pronto</span>
            case 'processing':
                return <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">⏳ Processando</span>
            case 'deleted':
                return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Expirado</span>
            default:
                return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Pendente</span>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-rabix-purple" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto py-20 text-center text-red-500">
                <p>{error}</p>
                <button onClick={fetchBooks} className="mt-4 px-4 py-2 bg-rabix-purple text-white rounded-lg">Tentar novamente</button>
            </div>
        )
    }

    const COVER_THEMES = {
        'heroes': { name: 'Super-Heróis', color: 'from-blue-500 to-red-500' },
        'forest': { name: 'Floresta Mágica', color: 'from-green-400 to-emerald-600' },
        'princess': { name: 'Castelo Princesa', color: 'from-pink-400 to-purple-500' },
        'space': { name: 'Aventura Espacial', color: 'from-indigo-900 to-purple-900' },
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Meus Cadernos</h2>
                <Link
                    href="/dashboard/upload"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-semibold text-sm rounded-xl hover:shadow-lg transition-all btn-glow"
                >
                    <Plus className="w-4 h-4" />
                    Novo Caderno
                </Link>
            </div>

            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-4 text-sm border border-amber-100">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 bg-amber-200 rounded-full flex items-center justify-center font-bold">!</div>
                <div>
                    <p className="font-bold mb-1">Política de Armazenamento</p>
                    <p>Para manter sua conta rápida, seus cadernos em PDF e fotos originais ficam armazenados em nossos servidores por <strong>30 dias</strong>. Faça o download para sua máquina!</p>
                </div>
            </div>

            {books.length === 0 ? (
                <div className="glass-card p-16 text-center">
                    <div className="w-24 h-24 bg-rabix-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Palette className="w-12 h-12 text-rabix-purple/30" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Nenhum caderno criado ainda</h3>
                    <p className="text-rabix-dark/40 mb-6 max-w-md mx-auto">
                        Envie suas fotos e transforme-as em um caderno de colorir personalizado!
                    </p>
                    <Link
                        href="/dashboard/upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-bold rounded-xl hover:shadow-lg transition-all btn-glow"
                    >
                        <FileImage className="w-5 h-5" />
                        Criar Primeiro Caderno
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {books.map((book) => {
                        const theme = COVER_THEMES[book.coverTheme] || COVER_THEMES['heroes']

                        return (
                            <div key={book.id} className="glass-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                {/* Custom Cover preview */}
                                <div className="relative aspect-[3/4] bg-rabix-dark overflow-hidden flex-shrink-0">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-90`} />

                                    {/* Overlay elements */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                        <div className="mb-auto mt-4 w-full">
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{theme.name}</p>
                                        </div>

                                        <h3 className="text-white font-black text-xl leading-tight drop-shadow-md">
                                            {book.title || 'Meu Caderno'}
                                        </h3>

                                        {book.childName && (
                                            <div className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30">
                                                <p className="text-white font-bold text-sm">
                                                    {book.childName}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-auto mb-2 text-white/50 flex items-center gap-1.5">
                                            <BookOpen className="w-4 h-4" />
                                            <span className="text-xs font-medium">{book.pages} páginas</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h4 className="font-bold mb-1 truncate">{book.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-rabix-dark/40 mb-4">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(book.createdAt).toLocaleDateString('pt-BR')}
                                    </div>

                                    <div className="flex flex-col gap-2 mt-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusBadge(book.status)}
                                        </div>

                                        {book.status === 'deleted' ? (
                                            <div className="p-2 border border-gray-200 text-gray-500 bg-gray-50 rounded-lg text-xs text-center">
                                                Arquivo expirado (30 dias)
                                            </div>
                                        ) : (
                                            <>
                                                {book.status === 'ready' && book.pdfUrl && (
                                                    <button
                                                        onClick={() => handleDownload(book.id)}
                                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Baixar PDF
                                                    </button>
                                                )}

                                                {book.status === 'ready' && (
                                                    <button
                                                        onClick={() => handlePrintCheckout(book.id)}
                                                        disabled={printLoading === book.id}
                                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rabix-purple text-white text-sm font-semibold rounded-lg hover:bg-rabix-purple-dark transition-colors disabled:opacity-50"
                                                    >
                                                        {printLoading === book.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <span>🚚</span>
                                                        )}
                                                        Receber em Casa (R$ 29,90)
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
