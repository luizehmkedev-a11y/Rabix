import PDFDocument from 'pdfkit'

/**
 * Rabix PDF Generator
 * Generates a coloring book PDF from processed drawings
 */

export async function generateColoringBookPDF(options) {
    const {
        title = 'Meu Caderno de Colorir',
        drawings = [],     // Array of { buffer: Buffer, name: string }
        userName = 'Rabix',
    } = options

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                autoFirstPage: false,
                margin: 0,
                info: {
                    Title: title,
                    Author: 'Rabix - Fotos que viram criatividade',
                    Subject: 'Caderno de Colorir',
                    Creator: 'Rabix AI',
                },
            })

            const buffers = []
            doc.on('data', chunk => buffers.push(chunk))
            doc.on('end', () => resolve(Buffer.concat(buffers)))
            doc.on('error', reject)

            const pageWidth = 595.28  // A4 width in points
            const pageHeight = 841.89 // A4 height in points
            const margin = 40

            // ===========================
            // COVER PAGE
            // ===========================
            doc.addPage()

            const THEMES = {
                'heroes': { bg: '#E53E3E', accent: '#3182CE', overlay: '#F6E05E' },
                'forest': { bg: '#38A169', accent: '#276749', overlay: '#9AE6B4' },
                'princess': { bg: '#ED64A6', accent: '#B83280', overlay: '#FBB6CE' },
                'space': { bg: '#3182CE', accent: '#2C5282', overlay: '#E2E8F0' },
            }
            const theme = THEMES[options.coverTheme] || THEMES['heroes']

            // Background
            doc.rect(0, 0, pageWidth, pageHeight).fill(theme.bg)

            // Decorative circles
            doc.circle(100, 150, 80).fill(theme.accent)
            doc.circle(pageWidth - 80, pageHeight - 200, 60).fill(theme.accent)
            doc.circle(pageWidth - 150, 100, 40).fill(theme.overlay)

            // Title
            doc.font('Helvetica-Bold')
                .fontSize(42)
                .fillColor('#FFFFFF')
                .text(title, margin + 20, pageHeight / 2 - 120, {
                    width: pageWidth - (margin * 2) - 40,
                    align: 'center',
                })

            // Child Name
            if (options.childName) {
                doc.font('Helvetica-Bold')
                    .fontSize(32)
                    .fillColor(theme.overlay)
                    .text(options.childName.toUpperCase(), margin, pageHeight / 2 - 20, {
                        width: pageWidth - margin * 2,
                        align: 'center',
                    })
            }

            // Divider
            const dividerY = pageHeight / 2 + 20
            doc.moveTo(pageWidth / 2 - 50, dividerY)
                .lineTo(pageWidth / 2 + 50, dividerY)
                .strokeColor('#FF7A1A')
                .lineWidth(3)
                .stroke()

            // Created by
            doc.font('Helvetica')
                .fontSize(14)
                .fillColor('rgba(255,255,255,0.6)')
                .text(`Criado por ${userName}`, margin, pageHeight / 2 + 50, {
                    width: pageWidth - margin * 2,
                    align: 'center',
                })

            // Branding footer
            doc.font('Helvetica-Bold')
                .fontSize(12)
                .fillColor('#FF7A1A')
                .text('Rabix', margin, pageHeight - 80, {
                    width: pageWidth - margin * 2,
                    align: 'center',
                })

            doc.font('Helvetica')
                .fontSize(9)
                .fillColor('rgba(255,255,255,0.4)')
                .text('Fotos que viram criatividade', margin, pageHeight - 60, {
                    width: pageWidth - margin * 2,
                    align: 'center',
                })

            // ===========================
            // DRAWING PAGES
            // ===========================
            for (let i = 0; i < drawings.length; i++) {
                doc.addPage()

                // White background
                doc.rect(0, 0, pageWidth, pageHeight).fill('#FFFFFF')

                // Decorative border
                const borderMargin = 25
                doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2)
                    .strokeColor('#E5E5E5')
                    .lineWidth(1)
                    .dash(5, { space: 5 })
                    .stroke()
                    .undash()

                // Drawing image
                const imgMargin = 50
                const imgWidth = pageWidth - imgMargin * 2
                const imgHeight = pageHeight - imgMargin * 2 - 60 // Leave room for page number

                try {
                    doc.image(drawings[i].buffer, imgMargin, imgMargin, {
                        fit: [imgWidth, imgHeight],
                        align: 'center',
                        valign: 'center',
                    })
                } catch (imgErr) {
                    // If image can't be placed, add a placeholder
                    doc.font('Helvetica')
                        .fontSize(14)
                        .fillColor('#CCCCCC')
                        .text('Desenho ' + (i + 1), margin, pageHeight / 2, {
                            width: pageWidth - margin * 2,
                            align: 'center',
                        })
                }

                // Page number
                doc.font('Helvetica')
                    .fontSize(10)
                    .fillColor('#CCCCCC')
                    .text(`${i + 1} / ${drawings.length}`, margin, pageHeight - 45, {
                        width: pageWidth - margin * 2,
                        align: 'center',
                    })

                // Small Rabix branding
                doc.font('Helvetica')
                    .fontSize(7)
                    .fillColor('#E5E5E5')
                    .text('rabix.com.br', margin, pageHeight - 30, {
                        width: pageWidth - margin * 2,
                        align: 'center',
                    })
            }

            // ===========================
            // BACK COVER
            // ===========================
            doc.addPage()

            doc.rect(0, 0, pageWidth, pageHeight).fill('#1F1F1F')

            doc.font('Helvetica-Bold')
                .fontSize(28)
                .fillColor('#6A3DF0')
                .text('Rabix', margin, pageHeight / 2 - 40, {
                    width: pageWidth - margin * 2,
                    align: 'center',
                })

            doc.font('Helvetica')
                .fontSize(14)
                .fillColor('#FF7A1A')
                .text('Fotos que viram criatividade', margin, pageHeight / 2, {
                    width: pageWidth - margin * 2,
                    align: 'center',
                })

            doc.font('Helvetica')
                .fontSize(10)
                .fillColor('rgba(255,255,255,0.3)')
                .text('www.rabix.com.br', margin, pageHeight / 2 + 40, {
                    width: pageWidth - margin * 2,
                    align: 'center',
                })

            doc.end()
        } catch (error) {
            reject(error)
        }
    })
}
