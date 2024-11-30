'use client'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  id: string;
  name: string;
  role: 'operator' | 'supervisor';
  avatar?: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  senderName: string;
}

interface ChatProps {
  currentUser: User;
}

export function Chat({ currentUser }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{
      id: '1',
      text: '¡Bienvenido al sistema!',
      timestamp: new Date().toLocaleTimeString(),
      senderId: 'system',
      senderName: 'Sistema'
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      senderId: currentUser.id,
      senderName: currentUser.name
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat de Soporte</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.senderId === currentUser.id
                    ? 'bg-primary text-primary-foreground'
                    : message.senderId === 'system'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-secondary'
                }`}
              >
                <div className="text-sm font-medium">{message.senderName}</div>
                <p>{message.text}</p>
                <span className="text-xs opacity-70">{message.timestamp}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 pt-4 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escriba su mensaje..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            Enviar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
