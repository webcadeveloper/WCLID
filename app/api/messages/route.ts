import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { senderId, receiverId, message } = body

    if (!senderId || !receiverId || !message) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        message,
      },
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error enviando el mensaje:', error)
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }
}
