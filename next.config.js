/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost'],
    },
    experimental: {
        serverComponentsExternalPackages: ['sharp', 'pdfkit'],
    },
}

module.exports = nextConfig
