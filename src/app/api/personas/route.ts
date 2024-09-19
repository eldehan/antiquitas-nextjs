import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Persona } from '@/types'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const personas = await db.collection<Persona>('personas').find({}).toArray()
    return NextResponse.json(personas, { status: 200 })
  } catch (error) {
    console.error('Error fetching personas:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}