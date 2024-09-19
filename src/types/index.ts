import { ObjectId } from 'mongodb'

export interface User {
  _id: ObjectId
  username: string
  email: string
  password: string
}

export interface Persona {
  _id: ObjectId
  name: string
  description: string
  avatarUrl: string
  context: string
}

export interface ChatMessage {
  _id: ObjectId
  personaId: ObjectId
  role: 'user' | 'ai'
  content: string
  contextualExplanations?: { [key: string]: string }
  timestamp: Date
}