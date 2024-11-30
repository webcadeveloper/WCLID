'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"

type Case = {
  id: string;
  number: string;
  status: string;
  firstName: string;
  lastName: string;
  aNumber: string;
  courtAddress: string;
  courtPhone: string;
  operatorId: string;
}

type CaseManagementProps = {
  currentOperatorId: string;
}

export function CaseManagement({ currentOperatorId }: CaseManagementProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [newCase, setNewCase] = useState<Omit<Case, 'id' | 'operatorId'>>({
    number: '',
    status: 'Pendiente',
    firstName: '',
    lastName: '',
    aNumber: '',
    courtAddress: '',
    courtPhone: '',
  });
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);

  useEffect(() => {
    // En una implementación real, aquí cargarías los casos desde el backend
    setCases([
      {
        id: '1',
        number: 'CASO-001',
        status: 'Pendiente',
        firstName: 'Juan',
        lastName: 'Pérez',
        aNumber: 'A12345678',
        courtAddress: 'Calle 123, Ciudad',
        courtPhone: '123-456-7890',
        operatorId: currentOperatorId
      },
      {
        id: '2',
        number: 'CASO-002',
        status: 'En Progreso',
        firstName: 'María',
        lastName: 'González',
        aNumber: 'A87654321',
        courtAddress: 'Avenida 456, Ciudad',
        courtPhone: '098-765-4321',
        operatorId: currentOperatorId
      }
    ]);
  }, [currentOperatorId]);

  const addOrUpdateCase = () => {
    if (editingCaseId) {
      // Actualizar caso existente
      setCases(prevCases => prevCases.map(c => 
        c.id === editingCaseId ? { ...c, ...newCase } : c
      ));
      setEditingCaseId(null);
    } else {
      // Verificar si el número de caso ya existe
      if (cases.some(c => c.number === newCase.number)) {
        alert("Este número de caso ya existe.");
        return;
      }
      // Agregar nuevo caso
      const caseWithId = {
        ...newCase,
        id: Date.now().toString(),
        operatorId: currentOperatorId
      };
      setCases(prevCases => [...prevCases, caseWithId]);
    }

    // Limpiar el formulario
    setNewCase({
      number: '',
      status: 'Pendiente',
      firstName: '',
      lastName: '',
      aNumber: '',
      courtAddress: '',
      courtPhone: '',
    });
  };

  const handleEdit = (caseToEdit: Case) => {
    setEditingCaseId(caseToEdit.id);
    setNewCase({
      number: caseToEdit.number,
      status: caseToEdit.status,
      firstName: caseToEdit.firstName,
      lastName: caseToEdit.lastName,
      aNumber: caseToEdit.aNumber,
      courtAddress: caseToEdit.courtAddress,
      courtPhone: caseToEdit.courtPhone,
    });
  };

  const handleDelete = (caseId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este caso?')) {
      setCases(prevCases => prevCases.filter(c => c.id !== caseId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Casos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Número de caso"
              value={newCase.number}
              onChange={(e) => setNewCase({ ...newCase, number: e.target.value })}
            />
            <Select
              value={newCase.status}
              onChange={(e) => setNewCase({ ...newCase, status: e.target.value })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Nombre"
              value={newCase.firstName}
              onChange={(e) => setNewCase({ ...newCase, firstName: e.target.value })}
            />
            <Input
              placeholder="Apellido"
              value={newCase.lastName}
              onChange={(e) => setNewCase({ ...newCase, lastName: e.target.value })}
            />
          </div>

          <Input
            placeholder="Número A"
            value={newCase.aNumber}
            onChange={(e) => setNewCase({ ...newCase, aNumber: e.target.value })}
          />

          <Input
            placeholder="Dirección de la corte"
            value={newCase.courtAddress}
            onChange={(e) => setNewCase({ ...newCase, courtAddress: e.target.value })}
          />

          <Input
            placeholder="Teléfono de la corte"
            value={newCase.courtPhone}
            onChange={(e) => setNewCase({ ...newCase, courtPhone: e.target.value })}
          />

          <Button onClick={addOrUpdateCase}>
            {editingCaseId ? 'Actualizar Caso' : 'Agregar Caso'}
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {cases.map((case_) => (
            <div key={case_.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">{case_.number}</h3>
                <p className="text-sm">{case_.firstName} {case_.lastName}</p>
                <p className="text-sm text-gray-500">Estado: {case_.status}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(case_)} variant="outline">
                  Editar
                </Button>
                <Button onClick={() => handleDelete(case_.id)} variant="destructive">
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}