import './globals.css'

export const metadata = {
    title: 'Rabix - Transforme suas fotos em um caderno para colorir',
    description: 'Com a Rabix AI, suas fotos viram desenhos incríveis prontos para colorir em segundos. Crie seu caderno de colorir personalizado agora!',
    keywords: 'caderno para colorir, fotos para colorir, IA, inteligência artificial, coloring book, desenhos para colorir',
    openGraph: {
        title: 'Rabix - Fotos que viram criatividade',
        description: 'Transforme suas fotos em um caderno para colorir com inteligência artificial.',
        type: 'website',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="font-poppins antialiased">
                {children}
            </body>
        </html>
    )
}
