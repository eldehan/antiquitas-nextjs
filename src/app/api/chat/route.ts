import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { generateResponse } from '@/lib/openai'
import { Persona, ChatMessage } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { personaId, message } = await req.json()

    if (!personaId || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const persona = await db.collection<Persona>('personas').findOne({ _id: new ObjectId(personaId) })

    if (!persona) {
      return NextResponse.json({ message: 'Persona not found' }, { status: 404 })
    }

    const { response, contextualExplanations } = await generateResponse(persona.name, persona.context, message)

    const userMessage: ChatMessage = {
      _id: new ObjectId(),
      personaId: new ObjectId(personaId),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    const aiMessage: ChatMessage = {
      _id: new ObjectId(),
      personaId: new ObjectId(personaId),
      role: 'ai',
      content: response,
      contextualExplanations,
      timestamp: new Date()
    }

    await db.collection<ChatMessage>('chatMessages').insertMany([userMessage, aiMessage])

    return NextResponse.json({ response, contextualExplanations }, { status: 200 })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}