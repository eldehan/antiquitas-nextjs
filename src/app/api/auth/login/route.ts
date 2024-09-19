import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { email, password } = await req.json()

    const user = await db.collection<User>('users').findOne({ email })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    )

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}