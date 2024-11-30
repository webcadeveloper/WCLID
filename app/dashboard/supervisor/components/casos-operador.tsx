'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Caso = {
  id: number;
  numero: string;
  estado: 'pendiente' | 'aprobado';
  descripcion: string;
}

export function CasosOperador({ operadorId }: { operadorId: number }) {
  const [casos, setCasos] = useState<Caso[]>([
    { id: 1, numero: 'CASO-001', estado: 'pendiente', descripcion: 'Descripción del caso 1' },
    { id: 2, numero: 'CASO-002', estado: 'aprobado', descripcion: 'Descripción del caso 2' },
    { id: 3, numero: 'CASO-003', estado: 'pendiente', descripcion: 'Descripción del caso 3' },
  ])

  const aprobarCaso = (casoId: number) => {
    setCasos(casos.map(caso => 
      caso.id === casoId ? { ...caso, estado: 'aprobado' } : caso
    ))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ver Casos</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Casos del Operador {operadorId}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de Caso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {casos.map((caso) => (
              <TableRow key={caso.id}>
                <TableCell>{caso.numero}</TableCell>
                <TableCell>{caso.estado}</TableCell>
                <TableCell>{caso.descripcion}</TableCell>
                <TableCell>
                  {caso.estado === 'pendiente' && (
                    <Button onClick={() => aprobarCaso(caso.id)}>Aprobar</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

