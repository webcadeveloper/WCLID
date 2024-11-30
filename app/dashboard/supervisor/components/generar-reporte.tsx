'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export function GenerarReporte() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerarReporte = async () => {
    setIsGenerating(true)
    try {
      // Aquí iría la lógica para generar el reporte CSV
      // Por ejemplo:
      // const response = await fetch('/api/generar-reporte-csv')
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'reporte_casos.csv'
      // document.body.appendChild(a)
      // a.click()
      // window.URL.revokeObjectURL(url)

      // Simulamos un delay para la demostración
      await new Promise(resolve => setTimeout(resolve, 2000))

      alert('Reporte generado con éxito')
    } catch (error) {
      console.error('Error al generar el reporte:', error)
      alert('Error al generar el reporte')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleGenerarReporte} disabled={isGenerating}>
      {isGenerating ? 'Generando...' : 'Generar Reporte CSV'}
    </Button>
  )
}

