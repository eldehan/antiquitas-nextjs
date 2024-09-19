import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { User } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { username, email, password } = await req.json()

    const existingUser = await db.collection<User>('users').findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser: Omit<User, '_id'> = {
      username,
      email,
      password: hashedPassword,
    }

    const result = await db.collection<User>('users').insertOne(newUser as User)

    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}