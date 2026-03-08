'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
    Upload, Wand2, Download, Star, ChevronDown, ChevronUp,
    Camera, Palette, BookOpen, Check, ArrowRight, Sparkles,
    Menu, X, Mail, Heart, Zap, Shield
} from 'lucide-react'

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-rabix-purple/5 py-3'
            : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-rabix-purple to-rabix-orange rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <Palette className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold">
                        <span className="text-rabix-purple">Ra</span>
                        <span className="text-rabix-orange">bix</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#como-funciona" className="text-rabix-dark/70 hover:text-rabix-purple transition-colors font-medium text-sm">Como Funciona</a>
                    <a href="#exemplos" className="text-rabix-dark/70 hover:text-rabix-purple transition-colors font-medium text-sm">Exemplos</a>
                    <a href="#planos" className="text-rabix-dark/70 hover:text-rabix-purple transition-colors font-medium text-sm">Planos</a>
                    <a href="#faq" className="text-rabix-dark/70 hover:text-rabix-purple transition-colors font-medium text-sm">FAQ</a>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="px-5 py-2.5 text-rabix-purple font-semibold text-sm hover:bg-rabix-purple/5 rounded-xl transition-all">
                        Entrar
                    </Link>
                    <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-rabix-purple/25 transition-all hover:-translate-y-0.5">
                        Criar Conta
                    </Link>
                </div>

                <button
                    className="md:hidden p-2 rounded-xl hover:bg-rabix-gray transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-rabix-purple/10 shadow-xl animate-slide-down">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
                        <a href="#como-funciona" className="py-2 text-rabix-dark/70 hover:text-rabix-purple font-medium" onClick={() => setMobileOpen(false)}>Como Funciona</a>
                        <a href="#exemplos" className="py-2 text-rabix-dark/70 hover:text-rabix-purple font-medium" onClick={() => setMobileOpen(false)}>Exemplos</a>
                        <a href="#planos" className="py-2 text-rabix-dark/70 hover:text-rabix-purple font-medium" onClick={() => setMobileOpen(false)}>Planos</a>
                        <a href="#faq" className="py-2 text-rabix-dark/70 hover:text-rabix-purple font-medium" onClick={() => setMobileOpen(false)}>FAQ</a>
                        <hr className="my-2 border-rabix-purple/10" />
                        <Link href="/login" className="py-2 text-rabix-purple font-semibold">Entrar</Link>
                        <Link href="/signup" className="py-2.5 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-semibold rounded-xl text-center">Criar Conta</Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-pattern">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-rabix-purple/5" />

            {/* Floating doodle elements */}
            <div className="absolute top-20 right-10 w-20 h-20 opacity-20 animate-float">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#6A3DF0" strokeWidth="3" strokeDasharray="10 5" />
                </svg>
            </div>
            <div className="absolute bottom-40 left-10 w-16 h-16 opacity-15 animate-float-delay">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="20" y="20" width="60" height="60" fill="none" stroke="#FF7A1A" strokeWidth="3" strokeDasharray="8 4" rx="10" />
                </svg>
            </div>
            <div className="absolute top-40 left-1/4 w-12 h-12 opacity-10 animate-wiggle">
                <Star className="w-full h-full text-rabix-orange" />
            </div>
            <div className="absolute bottom-60 right-1/3 w-8 h-8 opacity-10 animate-pulse-slow">
                <Sparkles className="w-full h-full text-rabix-purple" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Text */}
                <div className="animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-rabix-purple/10 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-rabix-purple" />
                        <span className="text-sm font-semibold text-rabix-purple">Fotos que viram criatividade</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                        Transforme suas fotos em um{' '}
                        <span className="doodle-underline gradient-text">caderno para colorir</span>
                    </h1>

                    <p className="text-lg text-rabix-dark/60 mb-8 max-w-lg leading-relaxed">
                        Com a <strong className="text-rabix-purple">Rabix AI</strong>, suas fotos viram desenhos incríveis prontos para colorir em segundos. Crie memórias que seus filhos podem pintar!
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/signup" className="btn-glow inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-rabix-purple/30 transition-all hover:-translate-y-1 text-lg">
                            <Wand2 className="w-5 h-5" />
                            Criar meu caderno
                        </Link>
                        <a href="#exemplos" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-rabix-purple/20 text-rabix-purple font-bold rounded-2xl hover:bg-rabix-purple/5 transition-all text-lg">
                            Ver exemplo
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>

                    <div className="flex items-center gap-6 mt-10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${i % 2 === 0 ? 'bg-rabix-orange' : 'bg-rabix-purple'
                                    }`}>
                                    {['M', 'A', 'R', 'J'][i - 1]}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-4 h-4 fill-rabix-orange text-rabix-orange" />
                                ))}
                            </div>
                            <p className="text-xs text-rabix-dark/50 mt-0.5">+2.000 cadernos criados</p>
                        </div>
                    </div>
                </div>

                {/* Right: Visual */}
                <div className="relative animate-fade-in lg:pl-8">
                    <div className="relative">
                        {/* Before card */}
                        <div className="glass-card p-3 w-56 sm:w-64 rotate-[-6deg] absolute -left-4 top-8 z-10 hover:rotate-0 transition-transform duration-500 shadow-xl">
                            <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center overflow-hidden">
                                <Camera className="w-16 h-16 text-rabix-purple/50" />
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                <span className="text-xs font-medium text-rabix-dark/50">Foto original</span>
                            </div>
                        </div>

                        {/* After card */}
                        <div className="glass-card p-3 w-56 sm:w-64 rotate-[4deg] ml-auto mr-0 relative z-20 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-rabix-purple/20">
                            <div className="aspect-square rounded-xl bg-white border-2 border-dashed border-rabix-purple/20 flex items-center justify-center">
                                <div className="text-center">
                                    <Palette className="w-16 h-16 text-rabix-purple/30 mx-auto" />
                                    <p className="text-xs text-rabix-dark/30 mt-2">Desenho para colorir</p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rabix-purple" />
                                <span className="text-xs font-medium text-rabix-purple">Pronto para pintar!</span>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                            <div className="w-14 h-14 bg-gradient-to-br from-rabix-orange to-rabix-orange-dark rounded-2xl flex items-center justify-center shadow-lg shadow-rabix-orange/30 animate-pulse-slow">
                                <Wand2 className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================================
// COMPARE SLIDER COMPONENT
// ============================================================
function CompareSlider({ originalImage, convertedImage, label }) {
    const [sliderPos, setSliderPos] = useState(50)
    const [isHovered, setIsHovered] = useState(false)

    // Pulse animation at start
    useEffect(() => {
        const timer1 = setTimeout(() => setSliderPos(55), 1000)
        const timer2 = setTimeout(() => setSliderPos(45), 1300)
        const timer3 = setTimeout(() => setSliderPos(50), 1600)
        return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); }
    }, [])

    return (
        <div className="group flex flex-col items-center">
            <div
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize shadow-xl border-2 border-white/50"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
                    setSliderPos((x / rect.width) * 100)
                }}
                onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const touch = e.touches[0]
                    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width))
                    setSliderPos((x / rect.width) * 100)
                }}
            >
                {/* After Image (Background) */}
                <div className="absolute inset-0 bg-white">
                    <img src={convertedImage} alt={`${label} convertido`} className="w-full h-full object-cover" />
                </div>

                {/* Before Image (Foreground, clipped) */}
                <div
                    className="absolute inset-0 bg-white"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                    <img src={originalImage} alt={`${label} original`} className="w-full h-full object-cover" />
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize transition-opacity duration-300 shadow-sm"
                    style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                >
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform ${isHovered ? 'scale-110 relative z-10' : 'scale-100 relative z-10'}`}>
                        <div className="flex gap-1">
                            <div className="w-0.5 h-3 bg-rabix-dark/30 rounded-full" />
                            <div className="w-0.5 h-3 bg-rabix-dark/30 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-bold text-rabix-dark shadow-sm pointer-events-none z-20">
                    📷 Foto Original
                </div>
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-bold text-rabix-purple shadow-sm pointer-events-none z-20">
                    ✏️ Para Colorir
                </div>
            </div>

            <p className="mt-4 font-bold text-rabix-dark/80">{label}</p>
        </div>
    )
}

// ============================================================
// BEFORE/AFTER SECTION
// ============================================================
function BeforeAfterSection() {
    const comparisons = [
        { label: 'Retrato de Família', original: '/examples/family_original.png', converted: '/examples/family_drawing.png' },
        { label: 'Paisagem Natural', original: '/examples/landscape_original.png', converted: '/examples/landscape_drawing.png' },
        { label: 'Animal de Estimação', original: '/examples/pet_original.png', converted: '/examples/pet_drawing.png' },
    ]

    return (
        <section className="py-24 bg-white relative" id="antes-depois">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-rabix-orange/10 rounded-full mb-4">
                        <Camera className="w-4 h-4 text-rabix-orange" />
                        <span className="text-sm font-semibold text-rabix-orange">Antes e Depois</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Veja a <span className="gradient-text">mágica acontecer</span>
                    </h2>
                    <p className="text-rabix-dark/50 max-w-2xl mx-auto">
                        Transformamos qualquer foto em um desenho profissional para colorir. Deslize a barra para visualizar o resultado!
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {comparisons.map((item, idx) => (
                        <CompareSlider
                            key={idx}
                            originalImage={item.original}
                            convertedImage={item.converted}
                            label={item.label}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================================
// HOW IT WORKS SECTION
// ============================================================
function HowItWorksSection() {
    const steps = [
        {
            icon: Upload,
            number: '01',
            title: 'Envie suas fotos',
            description: 'Faça upload das suas fotos favoritas. Aceita JPG, PNG e WEBP.',
            color: 'from-rabix-purple to-rabix-purple-dark',
        },
        {
            icon: Wand2,
            number: '02',
            title: 'A IA transforma em desenhos',
            description: 'Nossa inteligência artificial converte cada foto em um desenho para colorir.',
            color: 'from-rabix-orange to-rabix-orange-dark',
        },
        {
            icon: Download,
            number: '03',
            title: 'Baixe seu caderno em PDF',
            description: 'Receba um caderno completo em PDF, pronto para imprimir e colorir.',
            color: 'from-rabix-purple-dark to-rabix-purple',
        },
    ]

    return (
        <section className="py-24 bg-rabix-gray relative overflow-hidden" id="como-funciona">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rabix-purple/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rabix-orange/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-rabix-purple/10 rounded-full mb-4">
                        <Zap className="w-4 h-4 text-rabix-purple" />
                        <span className="text-sm font-semibold text-rabix-purple">Simples & Rápido</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Como <span className="gradient-text">Funciona</span>
                    </h2>
                    <p className="text-rabix-dark/50 max-w-2xl mx-auto">
                        Em apenas 3 passos, transforme suas fotos em um caderno de colorir personalizado.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-rabix-purple via-rabix-orange to-rabix-purple opacity-20" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative group">
                            <div className="glass-card p-8 text-center hover:shadow-xl hover:shadow-rabix-purple/10 transition-all duration-500 hover:-translate-y-2">
                                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-5xl font-black text-rabix-purple/5 absolute top-4 right-6">{step.number}</div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-rabix-dark/50 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================================
// STYLES SECTION (EX-EXAMPLES)
// ============================================================
function ExamplesSection() {
    const examples = [
        { title: 'Estilo Cartoon', subtitle: 'Traços grossos e divertidos (Ex: Bob Esponja)', icon: '🎨', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', text: 'text-yellow-700' },
        { title: 'Estilo Mangá/Anime', subtitle: 'Olhos expressivos e muito detalhe', icon: '⛩️', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', text: 'text-rose-700' },
        { title: 'Estilo Realista', subtitle: 'Sombreamento perfeito e fiel', icon: '📸', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', text: 'text-blue-700' },
        { title: 'Estilo Heróis Comics', subtitle: 'Ação, sombras duras e contraste', icon: '🦸', bgColor: 'bg-red-50', borderColor: 'border-red-200', text: 'text-red-700' },
        { title: 'Estilo Fantasia', subtitle: 'Traços mágicos e delicados', icon: '✨', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', text: 'text-purple-700' },
        { title: 'Estilo Sketch Livre', subtitle: 'Rabisco criativo e rápido', icon: '✏️', bgColor: 'bg-slate-50', borderColor: 'border-slate-300', text: 'text-slate-700' },
    ]

    return (
        <section className="py-24 bg-white" id="exemplos">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-rabix-orange/10 rounded-full mb-4">
                        <Palette className="w-4 h-4 text-rabix-orange" />
                        <span className="text-sm font-semibold text-rabix-orange">Vários Estilos de Arte</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Nossa IA domina <span className="gradient-text">qualquer traço</span>
                    </h2>
                    <p className="text-rabix-dark/50 max-w-2xl mx-auto">
                        Escolha um estilo diferente para cada caderno que criar! Veja algumas das variações que nossa IA consegue gerar.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {examples.map((ex, idx) => (
                        <div key={idx} className="group cursor-pointer">
                            <div className={`${ex.bgColor} rounded-2xl p-6 border-2 border-dashed ${ex.borderColor} hover:border-solid hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                                <div className="aspect-[4/3] bg-white/80 rounded-xl flex flex-col items-center justify-center shadow-sm border border-white backdrop-blur-sm relative overflow-hidden">
                                    <span className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-500">{ex.icon}</span>

                                    {/* Mock drawing lines to suggest the style */}
                                    <div className="absolute bottom-4 left-6 right-6 opacity-30 group-hover:opacity-100 transition-opacity flex flex-col gap-1.5">
                                        <div className={`h-1 ${ex.bgColor} w-full rounded-full`}></div>
                                        <div className={`h-1 ${ex.bgColor} w-4/5 rounded-full`}></div>
                                        <div className={`h-1 ${ex.bgColor} w-2/3 rounded-full`}></div>
                                    </div>
                                </div>
                                <div className="mt-5 text-center">
                                    <h3 className={`font-bold text-lg mb-1 ${ex.text}`}>{ex.title}</h3>
                                    <p className="text-sm text-rabix-dark/60">{ex.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================================
// PRICING SECTION
// ============================================================
function PricingSection() {
    const plans = [
        {
            name: 'Básico',
            price: 19,
            photos: 20,
            features: [
                'Até 20 fotos',
                '1 caderno de colorir',
                'PDF em alta qualidade',
                'Download ilimitado',
                'Suporte por email',
            ],
            popular: false,
            gradient: 'from-rabix-dark to-rabix-dark-light',
            buttonGradient: 'from-rabix-purple to-rabix-purple-dark',
        },
        {
            name: 'Premium',
            price: 39,
            photos: 40,
            features: [
                'Até 40 fotos',
                '3 cadernos de colorir',
                'PDF em alta qualidade',
                'Download ilimitado',
                'Suporte prioritário',
                'Capa personalizada',
            ],
            popular: true,
            gradient: 'from-rabix-purple to-rabix-purple-dark',
            buttonGradient: 'from-rabix-orange to-rabix-orange-dark',
        },
        {
            name: 'Família',
            price: 59,
            photos: 80,
            features: [
                'Até 80 fotos',
                'Cadernos ilimitados',
                'PDF em alta qualidade',
                'Download ilimitado',
                'Suporte VIP',
                'Capa personalizada',
                'Páginas de atividades extras',
            ],
            popular: false,
            gradient: 'from-rabix-dark to-rabix-dark-light',
            buttonGradient: 'from-rabix-purple to-rabix-purple-dark',
        },
    ]

    return (
        <section className="py-24 bg-rabix-gray relative overflow-hidden" id="planos">
            <div className="absolute top-10 left-0 w-72 h-72 bg-rabix-purple/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-0 w-72 h-72 bg-rabix-orange/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-rabix-purple/10 rounded-full mb-4">
                        <Zap className="w-4 h-4 text-rabix-purple" />
                        <span className="text-sm font-semibold text-rabix-purple">Planos</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Escolha seu <span className="gradient-text">plano</span>
                    </h2>
                    <p className="text-rabix-dark/50 max-w-2xl mx-auto">
                        Planos acessíveis para todos. Comece a criar seus cadernos de colorir agora!
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${plan.popular ? 'scale-105 shadow-2xl shadow-rabix-purple/20' : 'shadow-lg hover:shadow-xl'
                            }`}>
                            {plan.popular && (
                                <div className="absolute top-0 left-0 right-0 bg-rabix-orange text-white text-center py-2 text-sm font-bold z-10">
                                    ⭐ Mais Popular
                                </div>
                            )}
                            <div className={`bg-gradient-to-br ${plan.gradient} text-white p-8 ${plan.popular ? 'pt-14' : ''}`}>
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-sm opacity-70">R$</span>
                                    <span className="text-5xl font-extrabold">{plan.price}</span>
                                </div>
                                <p className="text-sm opacity-60">pagamento único</p>
                            </div>
                            <div className="bg-white p-8">
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feat, fidx) => (
                                        <li key={fidx} className="flex items-center gap-3 text-sm text-rabix-dark/70">
                                            <Check className="w-5 h-5 text-rabix-purple flex-shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/signup" className={`block w-full py-3.5 bg-gradient-to-r ${plan.buttonGradient} text-white font-bold rounded-xl text-center hover:shadow-lg hover:opacity-90 transition-all btn-glow`}>
                                    Começar Agora
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================================
// TESTIMONIALS SECTION
// ============================================================
function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Maria Silva',
            role: 'Mãe de 2 filhos',
            text: 'Incrível! Meus filhos amaram colorir as fotos da nossa viagem. O caderno ficou lindo e profissional!',
            rating: 5,
            initial: 'M',
            color: 'bg-rabix-purple',
        },
        {
            name: 'João Santos',
            role: 'Professor',
            text: 'Uso o Rabix para criar atividades para meus alunos. Eles adoram colorir as imagens dos temas das aulas!',
            rating: 5,
            initial: 'J',
            color: 'bg-rabix-orange',
        },
        {
            name: 'Ana Costa',
            role: 'Avó criativa',
            text: 'Presenteei meus netos com um caderno de colorir das fotos da família. Eles ficaram encantados!',
            rating: 5,
            initial: 'A',
            color: 'bg-rabix-purple-dark',
        },
    ]

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-rabix-orange/10 rounded-full mb-4">
                        <Heart className="w-4 h-4 text-rabix-orange" />
                        <span className="text-sm font-semibold text-rabix-orange">Depoimentos</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        O que nossos <span className="gradient-text">clientes dizem</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="glass-card p-8 hover:shadow-lg hover:shadow-rabix-purple/10 transition-all duration-300 hover:-translate-y-1">
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-rabix-orange text-rabix-orange" />
                                ))}
                            </div>
                            <p className="text-rabix-dark/70 mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                    {t.initial}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{t.name}</p>
                                    <p className="text-xs text-rabix-dark/50">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================================
// FAQ SECTION
// ============================================================
function FAQSection() {
    const [openIdx, setOpenIdx] = useState(null)

    const faqs = [
        { q: 'Quais tipos de fotos posso enviar?', a: 'Você pode enviar fotos em JPG, PNG ou WEBP. Recomendamos fotos com boa iluminação e resolução mínima de 800x600 pixels para melhores resultados.' },
        { q: 'Quanto tempo leva para gerar o caderno?', a: 'O processamento é quase instantâneo! Cada foto é convertida em desenho em poucos segundos. Um caderno completo com 20 páginas fica pronto em menos de 1 minuto.' },
        { q: 'O PDF vem pronto para impressão?', a: 'Sim! O PDF é gerado no formato A4 com margens adequadas para impressão. Basta imprimir em casa ou em uma gráfica.' },
        { q: 'Posso usar fotos de celular?', a: 'Com certeza! Fotos tiradas com celular funcionam perfeitamente. Nossa IA se adapta a diferentes qualidades de imagem.' },
        { q: 'Qual a diferença entre os planos?', a: 'A principal diferença é a quantidade de fotos que você pode converter. O plano Básico permite 20 fotos, o Premium 40 fotos com capa personalizada, e o Família permite 80 fotos com recursos extras.' },
        { q: 'Posso gerar mais de um caderno?', a: 'Sim! Dependendo do seu plano, você pode gerar múltiplos cadernos. O plano Família oferece cadernos ilimitados.' },
    ]

    return (
        <section className="py-24 bg-rabix-gray" id="faq">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-rabix-purple/10 rounded-full mb-4">
                        <Shield className="w-4 h-4 text-rabix-purple" />
                        <span className="text-sm font-semibold text-rabix-purple">FAQ</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Perguntas <span className="gradient-text">Frequentes</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="glass-card overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-rabix-purple/5 transition-colors"
                            >
                                <span className="font-semibold text-rabix-dark pr-4">{faq.q}</span>
                                {openIdx === idx ? (
                                    <ChevronUp className="w-5 h-5 text-rabix-purple flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-rabix-dark/30 flex-shrink-0" />
                                )}
                            </button>
                            {openIdx === idx && (
                                <div className="px-6 pb-6 text-rabix-dark/60 leading-relaxed animate-slide-down">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================================
// LEAD CAPTURE SECTION
// ============================================================
function LeadCaptureSection() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return
        setLoading(true)
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            setSubmitted(true)
        } catch {
            // silently handle
        }
        setLoading(false)
    }

    return (
        <section className="py-24 bg-gradient-to-br from-rabix-purple via-rabix-purple-dark to-rabix-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-pattern opacity-10" />
            <div className="absolute top-10 right-10 w-40 h-40 bg-rabix-orange/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-rabix-purple-light/20 rounded-full blur-3xl" />

            <div className="max-w-3xl mx-auto px-6 text-center relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-rabix-orange" />
                    <span className="text-sm font-semibold text-white/80">Oferta Especial</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Receba <span className="text-rabix-orange">3 páginas grátis</span>
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                    Cadastre seu email e receba 3 páginas de colorir exclusivas totalmente grátis!
                </p>

                {submitted ? (
                    <div className="glass-card p-8 bg-white/10 animate-scale-in">
                        <Check className="w-12 h-12 text-rabix-orange mx-auto mb-4" />
                        <p className="text-white font-semibold text-lg">Obrigado! Verifique seu email 🎉</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rabix-dark/30" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Seu melhor email"
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-rabix-dark font-medium placeholder:text-rabix-dark/30 focus:outline-none focus:ring-2 focus:ring-rabix-orange shadow-lg"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-gradient-to-r from-rabix-orange to-rabix-orange-dark text-white font-bold rounded-xl hover:shadow-xl hover:shadow-rabix-orange/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 btn-glow whitespace-nowrap"
                        >
                            {loading ? 'Enviando...' : 'Receber grátis'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    )
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
    return (
        <footer className="bg-rabix-dark text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-rabix-purple to-rabix-orange rounded-xl flex items-center justify-center">
                                <Palette className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold">
                                <span className="text-rabix-purple-light">Ra</span>
                                <span className="text-rabix-orange">bix</span>
                            </span>
                        </div>
                        <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-4">
                            Fotos que viram criatividade. Transforme suas memórias em cadernos de colorir únicos com inteligência artificial.
                        </p>
                        <div className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-rabix-purple" />
                            <div className="w-2 h-2 rounded-full bg-rabix-orange" />
                            <div className="w-2 h-2 rounded-full bg-rabix-purple-light" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-white/80">Produto</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#como-funciona" className="text-white/40 hover:text-rabix-orange transition-colors">Como Funciona</a></li>
                            <li><a href="#planos" className="text-white/40 hover:text-rabix-orange transition-colors">Planos</a></li>
                            <li><a href="#exemplos" className="text-white/40 hover:text-rabix-orange transition-colors">Exemplos</a></li>
                            <li><a href="#faq" className="text-white/40 hover:text-rabix-orange transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-white/80">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-white/40 hover:text-rabix-orange transition-colors">Termos de Uso</a></li>
                            <li><a href="#" className="text-white/40 hover:text-rabix-orange transition-colors">Privacidade</a></li>
                            <li><a href="#" className="text-white/40 hover:text-rabix-orange transition-colors">Contato</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pencil-line mb-6" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-sm">
                        © 2024 Rabix. Todos os direitos reservados.
                    </p>
                    <p className="text-white/20 text-xs">
                        Feito com <Heart className="w-3 h-3 inline text-rabix-orange" /> e muito café ☕
                    </p>
                </div>
            </div>
        </footer>
    )
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function HomePage() {
    return (
        <main>
            <Navbar />
            <HeroSection />
            <BeforeAfterSection />
            <HowItWorksSection />
            <ExamplesSection />
            <PricingSection />
            <TestimonialsSection />
            <FAQSection />
            <LeadCaptureSection />
            <Footer />
        </main>
    )
}
