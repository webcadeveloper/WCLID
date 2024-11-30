'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import './operator-dashboard.css'

interface CurrentUser {
  id: number // Asegúrate de que este sea un número
  name: string
  role: 'OPERATOR'
  avatar: string
}

interface CaseData {
  id: number
  caseNumber: string
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELED'
  firstName: string
  lastName: string
  aNumber: string
  courtAddress: string
  courtPhone: string
  createdAt: string
}

interface Message {
  sender: string
  content: string
  timestamp: string
}

const initialCaseForm = {
  caseNumber: '',
  firstName: '',
  lastName: '',
  aNumber: '',
  courtAddress: '',
  courtPhone: '',
  status: 'PENDING', // Valor predeterminado
}

export default function OperatorDashboard() {
  const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([])
  const [caseForm, setCaseForm] = useState(initialCaseForm)
  const [cases, setCases] = useState<CaseData[]>([])
  const [editingCase, setEditingCase] = useState<CaseData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: 1, // Usa el ID del operador desde la base de datos
    name: 'Operador',
    role: 'OPERATOR',
    avatar: '/avatars/operator.png',
  })

  useEffect(() => {
    fetchCases()
    setMessages([
      { sender: 'Supervisor', content: 'Hola, ¿cómo van los casos?', timestamp: new Date().toLocaleString() },
    ])
  }, [])

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/cases')
      if (!response.ok) throw new Error('Error fetching cases')
      const data: CaseData[] = await response.json()
      setCases(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar los casos')
    }
  }

  const handleGenerateNumber = () => {
    const baseNumber = 244000000
    const randomOffset = Math.floor(Math.random() * 100000)
    const newNumber = (baseNumber + randomOffset).toString()
    setGeneratedNumbers(prev => [...prev, newNumber])
    toast.success(`Número generado: ${newNumber}`)
  }

  const handleCreateCase = async () => {
    const { caseNumber, firstName, lastName, aNumber, courtAddress, courtPhone, status } = caseForm
    if (!caseNumber || !firstName || !lastName || !aNumber || !courtAddress || !courtPhone) {
      toast.error('Por favor, completa todos los campos del formulario.')
      return
    }

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...caseForm, status, operatorId: currentUser.id }), // Enviamos el operatorId numérico
      })

      if (!response.ok) throw new Error('Error creando el caso')

      toast.success('Caso creado exitosamente')
      setCaseForm(initialCaseForm)
      fetchCases()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Hubo un error al crear el caso.')
    }
  }

  const handleUpdateCase = async () => {
    if (!editingCase) return
    try {
      const response = await fetch(`/api/cases/${editingCase.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCase),
      })

      if (!response.ok) throw new Error('Error actualizando el caso')

      toast.success('Caso actualizado exitosamente')
      setEditingCase(null)
      fetchCases()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Hubo un error al actualizar el caso')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setCaseForm(prev => ({ ...prev, [id]: value }))
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingCase) return
    const { id, value } = e.target
    setEditingCase(prev => prev ? { ...prev, [id]: value } : null)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      sender: currentUser.name,
      content: newMessage,
      timestamp: new Date().toLocaleString(),
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <img src="/assets/logo.webp" alt="Logo" className="logo" />
        <h1 className="dashboard-title">Dashboard del Operador</h1>
      </header>

      {/* Generador de Números */}
      <section className="number-generator">
        <h2>Generador de Números A-Number</h2>
        <ul className="generated-number-list">
          {generatedNumbers.map((num, idx) => (
            <li key={idx}>{num}</li>
          ))}
        </ul>
        <button onClick={handleGenerateNumber} className="custom-button">
          Generar Número
        </button>
      </section>

      {/* Iframe para ACIS */}
      <section className="acis-container">
        <h2>ACIS System</h2>
        <iframe
          src="https://acis.eoir.justice.gov/en/"
          className="acis-frame"
          title="ACIS System"
        />
      </section>

      {/* Crear Nuevo Caso */}
      <section className="form-container">
        <h2>Crear Nuevo Caso</h2>
        <div className="form-grid">
          {Object.entries(caseForm).map(([key, value]) => (
            <div key={key} className="form-field">
              <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1')}</label>
              {key === 'status' ? (
                <select id={key} value={value} onChange={handleInputChange}>
                  <option value="PENDING">Pendiente</option>
                  <option value="IN_PROGRESS">En Progreso</option>
                  <option value="RESOLVED">Resuelto</option>
                  <option value="CANCELED">Cancelado</option>
                </select>
              ) : (
                <input
                  id={key}
                  type="text"
                  value={value}
                  onChange={handleInputChange}
                />
              )}
            </div>
          ))}
        </div>
        <button onClick={handleCreateCase} className="custom-button">
          Crear Caso
        </button>
      </section>

      {/* Casos Creados */}
      <section className="cases-section">
        <h2>Casos Creados</h2>
        <ul className="case-list">
          {cases.map(c => (
            <li key={c.id} className="case-item">
              <span>{c.caseNumber}</span>
              <button onClick={() => setEditingCase(c)} className="custom-button">
                Editar
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Editar Caso */}
      {editingCase && (
        <section className="form-container">
          <h2>Editar Caso</h2>
          <div className="form-grid">
            {Object.entries(editingCase).map(([key, value]) => (
              <div key={key} className="form-field">
                <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1')}</label>
                {key === 'status' ? (
                  <select id={key} value={value} onChange={handleEditChange}>
                    <option value="PENDING">Pendiente</option>
                    <option value="IN_PROGRESS">En Progreso</option>
                    <option value="RESOLVED">Resuelto</option>
                    <option value="CANCELED">Cancelado</option>
                  </select>
                ) : (
                  <input
                    id={key}
                    type="text"
                    value={value || ''}
                    onChange={handleEditChange}
                  />
                )}
              </div>
            ))}
          </div>
          <button onClick={handleUpdateCase} className="custom-button">
            Guardar Cambios
          </button>
        </section>
      )}

      {/* Chat */}
      <section className="chat-section">
        <h2>Chat</h2>
        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender === currentUser.name ? 'sent' : 'received'}`}>
                <p className="chat-content">{msg.content}</p>
                <span className="chat-timestamp">{msg.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage} className="chat-send-button">
              Enviar
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
