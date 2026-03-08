import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rabix-dev-secret'

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null
    }
}

export function getTokenFromHeaders(request) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return null
    return authHeader.substring(7)
}

export async function getUserFromRequest(request) {
    let token = getTokenFromHeaders(request)
    if (!token) {
        token = getCookieToken(request)
    }
    if (!token) return null
    const decoded = verifyToken(token)
    return decoded
}

export function getCookieToken(request) {
    const cookie = request.headers.get('cookie')
    if (!cookie) return null
    const match = cookie.match(/rabix-token=([^;]+)/)
    return match ? match[1] : null
}
