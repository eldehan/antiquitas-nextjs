import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Persona } from '@/types'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params

    if (!id) {
      return NextResponse.json({ message: 'Invalid persona ID' }, { status: 400 })
    }

    const persona = await db.collection<Persona>('personas').findOne({ _id: new ObjectId(id) })

    if (!persona) {
      return NextResponse.json({ message: 'Persona not found' }, { status: 404 })
    }

    return NextResponse.json(persona, { status: 200 })
  } catch (error) {
    console.error('Error fetching persona:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}