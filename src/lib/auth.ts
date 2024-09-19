import jwt from 'jsonwebtoken'

interface DecodedToken {
  id: string;
  email: string;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}