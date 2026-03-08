'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    Upload, X, Image, Check, AlertCircle, Loader2,
    Camera, Wand2, ArrowRight, FileImage
} from 'lucide-react'

export default function UploadPage() {
    const router = useRouter()
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [processed, setProcessed] = useState([])
    const [error, setError] = useState('')
    const [dragActive, setDragActive] = useState(false)
    const STYLES = [
        { id: 'cartoon', name: 'Cartoon / Bob', icon: '🎨' },
        { id: 'manga', name: 'Mangá / Anime', icon: '⛩️' },
        { id: 'realista', name: 'Realista', icon: '📸' },
        { id: 'herois', name: 'Heróis Comics', icon: '🦸' },
        { id: 'fantasia', name: 'Fantasia', icon: '✨' },
        { id: 'sketch', name: 'Sketch Livre', icon: '✏️' },
    ]

    const [selectedStyle, setSelectedStyle] = useState('cartoon')
    const [step, setStep] = useState(1) // 1: upload, 2: processing, 3: done

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            f => f.type.startsWith('image/')
        )
        setFiles(prev => [...prev, ...droppedFiles].slice(0, 20))
    }, [])

    const handleFileInput = (e) => {
        const selected = Array.from(e.target.files).filter(
            f => f.type.startsWith('image/')
        )
        setFiles(prev => [...prev, ...selected].slice(0, 20))
    }

    const removeFile = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx))
    }

    const handleUpload = async () => {
        if (files.length === 0) return
        setUploading(true)
        setError('')
        setStep(2)

        try {
            const token = localStorage.getItem('rabix-token')
            const uploadedPhotos = []

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData()
                formData.append('file', files[i])

                const res = await fetch('/api/photos/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                })

                if (res.ok) {
                    const data = await res.json()
                    uploadedPhotos.push(data.photo)
                }
            }

            // Now process all photos
            setProcessing(true)
            const processedDrawings = []

            for (const photo of uploadedPhotos) {
                try {
                    const res = await fetch('/api/photos/process', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ photoId: photo.id, style: selectedStyle }),
                    })

                    if (res.ok) {
                        const data = await res.json()
                        processedDrawings.push(data.drawing)
                    }
                } catch (err) {
                    console.error('Processing error for photo:', photo.id, err)
                }
            }

            setProcessed(processedDrawings)
            setStep(3)
        } catch (err) {
            setError('Erro ao enviar fotos. Tente novamente.')
            setStep(1)
        }

        setUploading(false)
        setProcessing(false)
    }

    const handleGenerateBook = async () => {
        try {
            const token = localStorage.getItem('rabix-token')
            const res = await fetch('/api/books/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: `Meu Caderno - ${new Date().toLocaleDateString('pt-BR')}`,
                    drawingIds: processed.map(d => d.id),
                }),
            })

            if (res.ok) {
                router.push('/dashboard/cadernos')
            }
        } catch (err) {
            setError('Erro ao gerar caderno')
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Progress steps */}
            <div className="flex items-center justify-center gap-4">
                {[
                    { num: 1, label: 'Selecionar' },
                    { num: 2, label: 'Processar' },
                    { num: 3, label: 'Concluído' },
                ].map((s, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s.num
                                ? 'bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white'
                                : 'bg-rabix-gray text-rabix-dark/30'
                                }`}>
                                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                            </div>
                            <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-rabix-purple' : 'text-rabix-dark/30'
                                }`}>
                                {s.label}
                            </span>
                        </div>
                        {idx < 2 && (
                            <div className={`w-12 h-0.5 rounded ${step > s.num ? 'bg-rabix-purple' : 'bg-rabix-gray'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: Upload */}
            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    {/* Drop zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`glass-card p-12 border-2 border-dashed transition-all duration-300 text-center cursor-pointer ${dragActive
                            ? 'border-rabix-purple bg-rabix-purple/5 scale-[1.02]'
                            : 'border-rabix-purple/20 hover:border-rabix-purple/40 hover:bg-rabix-purple/5'
                            }`}
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                        />
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all ${dragActive ? 'bg-rabix-purple/20' : 'bg-rabix-purple/10'
                            }`}>
                            <Upload className={`w-10 h-10 ${dragActive ? 'text-rabix-purple' : 'text-rabix-purple/50'}`} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {dragActive ? 'Solte as fotos aqui!' : 'Arraste suas fotos aqui'}
                        </h3>
                        <p className="text-rabix-dark/40 mb-4">
                            ou clique para selecionar arquivos
                        </p>
                        <p className="text-xs text-rabix-dark/30">
                            JPG, PNG, WEBP • Máx. 10MB por foto • Até 20 fotos
                        </p>
                    </div>

                    {/* Selected files */}
                    {files.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold">
                                    {files.length} foto{files.length !== 1 ? 's' : ''} selecionada{files.length !== 1 ? 's' : ''}
                                </h4>
                                <button
                                    onClick={() => setFiles([])}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                                >
                                    Limpar tudo
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {files.map((file, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="aspect-square rounded-xl overflow-hidden bg-rabix-gray border border-rabix-purple/10">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(idx) }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <p className="mt-1 text-xs text-rabix-dark/40 truncate">{file.name}</p>
                                    </div>
                                ))}
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {/* Style Selection */}
                            <div className="pt-4 border-t border-rabix-purple/10">
                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-rabix-purple" />
                                    Escolha o Estilo do Desenho
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {STYLES.map(style => (
                                        <button
                                            key={style.id}
                                            onClick={() => setSelectedStyle(style.id)}
                                            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 text-sm font-semibold transition-all ${selectedStyle === style.id
                                                    ? 'border-rabix-purple bg-rabix-purple/10 text-rabix-purple scale-105 shadow-md'
                                                    : 'border-rabix-gray bg-white text-rabix-dark/60 hover:border-rabix-purple/30 hover:bg-rabix-purple/5'
                                                }`}
                                        >
                                            <span className="text-2xl">{style.icon}</span>
                                            {style.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="w-full py-4 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rabix-purple/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 btn-glow flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        Transformar em Desenhos ({files.length} fotos)
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Processing */}
            {step === 2 && (
                <div className="glass-card p-12 text-center animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rabix-purple to-rabix-orange rounded-2xl flex items-center justify-center animate-pulse-slow">
                        <Wand2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Processando suas fotos...</h3>
                    <p className="text-rabix-dark/50 mb-6">
                        Nossa IA está transformando suas fotos em desenhos para colorir. Isso pode levar alguns segundos.
                    </p>
                    <div className="max-w-xs mx-auto">
                        <div className="progress-bar">
                            <div className="progress-bar-fill animate-pulse" style={{ width: processing ? '80%' : '40%' }} />
                        </div>
                        <p className="text-xs text-rabix-dark/30 mt-2">
                            {processing ? 'Gerando desenhos...' : 'Enviando fotos...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Step 3: Complete */}
            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-card p-8 text-center bg-gradient-to-r from-rabix-purple/5 to-rabix-orange/5">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Fotos processadas! 🎉</h3>
                        <p className="text-rabix-dark/50">
                            {processed.length} desenho{processed.length !== 1 ? 's' : ''} gerado{processed.length !== 1 ? 's' : ''} com sucesso
                        </p>
                    </div>

                    {/* Preview */}
                    {processed.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {processed.map((drawing, idx) => (
                                <div key={idx} className="glass-card p-2">
                                    <div className="aspect-square rounded-lg overflow-hidden bg-white border border-rabix-purple/10">
                                        <img
                                            src={drawing.drawingUrl}
                                            alt={`Desenho ${idx + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-center text-rabix-dark/40">Desenho {idx + 1}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleGenerateBook}
                            className="flex-1 py-4 bg-gradient-to-r from-rabix-purple to-rabix-purple-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rabix-purple/25 transition-all btn-glow flex items-center justify-center gap-2"
                        >
                            <FileImage className="w-5 h-5" />
                            Gerar Caderno PDF
                        </button>
                        <button
                            onClick={() => { setStep(1); setFiles([]); setProcessed([]) }}
                            className="flex-1 py-4 border-2 border-rabix-purple/20 text-rabix-purple font-bold rounded-xl hover:bg-rabix-purple/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Enviar Mais Fotos
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
