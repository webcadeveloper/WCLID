'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface GeneratedNumber {
  number: string;
  timestamp: string;
}

export function NumberGenerator() {
  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratedNumber[]>([])
  const [currentPrefix] = useState<number>(244206)
  const [usedNumbers, setUsedNumbers] = useState<Set<string>>(new Set())
  const [currentNumber, setCurrentNumber] = useState<string>("000000000")
  const [specificNumber, setSpecificNumber] = useState<string>("")
  const [searchResult, setSearchResult] = useState<string | null>(null)

  const generateNextNumber = () => {
    const newNumber = String(currentPrefix * 1000 + generatedNumbers.length).padStart(9, '0')
    if (!usedNumbers.has(newNumber)) {
      const numberWithTimestamp = {
        number: newNumber,
        timestamp: new Date().toLocaleTimeString()
      }
      setGeneratedNumbers(prev => [numberWithTimestamp, ...prev])
      setUsedNumbers(prev => new Set(prev).add(newNumber))
      setCurrentNumber(newNumber)
    }
  }

  const generateRandomNumber = () => {
    let newNumber: string
    do {
      newNumber = String(Math.floor(Math.random() * 900000000) + 100000000)
    } while (usedNumbers.has(newNumber))

    const numberWithTimestamp = {
      number: newNumber,
      timestamp: new Date().toLocaleTimeString()
    }
    setGeneratedNumbers(prev => [numberWithTimestamp, ...prev])
    setUsedNumbers(prev => new Set(prev).add(newNumber))
    setCurrentNumber(newNumber)
  }

  const resetGenerator = () => {
    setGeneratedNumbers([])
    setUsedNumbers(new Set())
    setCurrentNumber("000000000")
    setSpecificNumber("")
    setSearchResult(null)
  }

  const searchNumber = () => {
    if (specificNumber) {
      const found = generatedNumbers.some(num => num.number === specificNumber)
      setSearchResult(found ? 
        `Número ${specificNumber} encontrado en el historial` : 
        `Número ${specificNumber} no encontrado`)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generador de Números</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Display current number */}
        <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground mb-2">Número Actual:</span>
          <span className="text-4xl font-mono font-bold">
            {currentNumber.replace(/(\d{3})/g, '$1 ').trim()}
          </span>
        </div>

        {/* Control buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={generateNextNumber}
            className="w-full"
          >
            Generar Siguiente Número
          </Button>
          <Button 
            onClick={generateRandomNumber}
            variant="secondary"
            className="w-full"
          >
            Generar Número Aleatorio
          </Button>
          <Button 
            onClick={resetGenerator}
            variant="outline"
            className="w-full"
          >
            Reiniciar
          </Button>
        </div>

        {/* Search section */}
        <div className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Buscar número específico"
              value={specificNumber}
              onChange={(e) => setSpecificNumber(e.target.value)}
            />
            <Button 
              onClick={searchNumber}
              variant="secondary"
            >
              Buscar
            </Button>
          </div>
          {searchResult && (
            <div className={`p-4 rounded-lg ${
              searchResult.includes("encontrado en el historial") 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {searchResult}
            </div>
          )}
        </div>

        {/* History section */}
        {generatedNumbers.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Historial de Números</h3>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {generatedNumbers.map((gen, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg"
                >
                  <span className="font-mono">{gen.number}</span>
                  <span className="text-sm text-muted-foreground">{gen.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}