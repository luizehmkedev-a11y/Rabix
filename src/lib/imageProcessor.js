import sharp from 'sharp'

/**
 * Rabix Image Processing Pipeline
 * Converts a photo into a coloring book line drawing
 * 
 * Pipeline:
 * 1. Load and resize image
 * 2. Convert to grayscale
 * 3. Apply edge detection (Sobel-like)
 * 4. Threshold to clean binary
 * 5. Invert to black lines on white
 * 6. Clean and output
 */

export async function processImageToLineArt(inputBuffer, style = 'cartoon') {
    try {
        // Step 1: Load, resize, and normalize
        const metadata = await sharp(inputBuffer).metadata()
        const maxDim = 2000
        let width = metadata.width
        let height = metadata.height

        if (width > maxDim || height > maxDim) {
            if (width > height) {
                height = Math.round((maxDim / width) * height)
                width = maxDim
            } else {
                width = Math.round((maxDim / height) * width)
                height = maxDim
            }
        }

        // Step 2: Convert to grayscale
        const grayscale = await sharp(inputBuffer)
            .resize(width, height, { fit: 'inside' })
            .grayscale()
            .normalize()
            .toBuffer()

        // Style Configurations for Difference of Gaussians (DoG) edge detection
        const styleConfig = {
            cartoon: { blur1: 1.5, blur2: 4.0, threshold: 30, edgeMul: 6.0, median: 4, sharpen: 0.5 },
            realista: { blur1: 0.8, blur2: 2.5, threshold: 15, edgeMul: 4.0, median: 2, sharpen: 0.8 },
            manga: { blur1: 1.0, blur2: 3.0, threshold: 20, edgeMul: 5.0, median: 3, sharpen: 0.6 },
            herois: { blur1: 1.2, blur2: 3.5, threshold: 25, edgeMul: 5.5, median: 3, sharpen: 0.7 },
            fantasia: { blur1: 1.5, blur2: 5.0, threshold: 35, edgeMul: 4.0, median: 5, sharpen: 0.4 },
            sketch: { blur1: 0.5, blur2: 1.5, threshold: 12, edgeMul: 3.0, median: 1, sharpen: 0.3 }, // Noisy
        }

        const config = styleConfig[style] || styleConfig['cartoon']

        // Step 3: Create edge detection using difference of blurs (DoG approach)
        const blur1 = await sharp(grayscale)
            .blur(config.blur1)
            .toBuffer()

        const blur2 = await sharp(grayscale)
            .blur(config.blur2)
            .toBuffer()

        // Step 4: Get raw pixel data for both blurs
        const raw1 = await sharp(blur1).raw().toBuffer({ resolveWithObject: true })
        const raw2 = await sharp(blur2).raw().toBuffer({ resolveWithObject: true })

        const pixels1 = raw1.data
        const pixels2 = raw2.data
        const outPixels = Buffer.alloc(pixels1.length)

        // Compute difference of Gaussians for edge detection
        for (let i = 0; i < pixels1.length; i++) {
            const diff = Math.abs(pixels1[i] - pixels2[i])
            const edge = Math.min(255, diff * config.edgeMul)
            outPixels[i] = edge
        }

        // Step 5: Apply thresholding and invert for coloring book style
        for (let i = 0; i < outPixels.length; i++) {
            if (outPixels[i] > config.threshold) {
                outPixels[i] = 0    // Black line
            } else {
                outPixels[i] = 255  // White background
            }
        }

        // Step 6: Generate final clean output
        const result = await sharp(outPixels, {
            raw: {
                width: raw1.info.width,
                height: raw1.info.height,
                channels: 1,
            }
        })
            .png()
            .toBuffer()

        // Step 7: Apply slight median filtering to clean up noise based on style
        let finalProcessor = sharp(result)
        if (config.median > 0) {
            finalProcessor = finalProcessor.median(config.median)
        }

        const cleaned = await finalProcessor
            .sharpen({ sigma: config.sharpen })
            .png()
            .toBuffer()

        return cleaned
    } catch (error) {
        console.error('Image processing error:', error)
        throw new Error('Falha ao processar imagem: ' + error.message)
    }
}

/**
 * Generate a simpler version using just edge enhancement
 * Good fallback if DoG approach isn't ideal
 */
export async function processImageSimple(inputBuffer) {
    try {
        const result = await sharp(inputBuffer)
            .resize(1500, 1500, { fit: 'inside' })
            .grayscale()
            .normalize()
            .sharpen({ sigma: 2, m1: 10, m2: 3 })
            .threshold(128)
            .negate()
            .threshold(30)
            .negate()
            .median(3)
            .png()
            .toBuffer()

        return result
    } catch (error) {
        console.error('Simple processing error:', error)
        throw new Error('Falha ao processar imagem: ' + error.message)
    }
}
