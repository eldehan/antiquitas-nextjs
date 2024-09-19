import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { ChatMessage } from '@/types'

export async function GET(req: NextRequest, { params }: { params: { personaId: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { personaId } = params

    if (!personaId) {
      return NextResponse.json({ message: 'Invalid persona ID' }, { status: 400 })
    }

    const messages = await db.collection<ChatMessage>('chatMessages')
      .find({ personaId: new ObjectId(personaId) })
      .sort({ timestamp: 1 })
      .toArray()

    return NextResponse.json(messages, { status: 200 })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}