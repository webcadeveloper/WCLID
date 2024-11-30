'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import { Chat } from '@/components/chat';
import './styles.css';

interface OperatorMetrics {
  operatorId: number;
  operator: { firstName: string; lastName: string } | null;
  casesCompleted: number;
  successRate: number;
  averageResolutionTime: number | null;
  date: string;
}

interface Case {
  id: number;
  caseNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  operator: { firstName: string; lastName: string } | null;
}

interface NewOperator {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function SupervisorDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [metrics, setMetrics] = useState<OperatorMetrics[]>([]);
  const [newOperator, setNewOperator] = useState<NewOperator>({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Fetch data on load
  useEffect(() => {
    fetchCases();
    fetchMetrics();
  }, []);

  // Fetch cases
  const fetchCases = async () => {
    try {
      const response = await fetch('/api/cases');
      if (!response.ok) throw new Error('Error al obtener casos');

      const data: Case[] = await response.json();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Error cargando los casos.');
    }
  };

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      if (!response.ok) throw new Error('Error al obtener métricas');

      const data: OperatorMetrics[] = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('Error cargando las métricas.');
    }
  };

  // Approve a case
  const approveCase = async (caseId: number) => {
    try {
      const response = await fetch(`/api/cases/${caseId}/approve`, { method: 'PUT' });
      if (!response.ok) throw new Error('Error al aprobar el caso');

      toast.success('Caso aprobado');
      fetchCases();
    } catch (error) {
      console.error('Error approving case:', error);
      toast.error('Error aprobando el caso.');
    }
  };

  // Reject a case
  const rejectCase = async (caseId: number) => {
    try {
      const response = await fetch(`/api/cases/${caseId}/reject`, { method: 'PUT' });
      if (!response.ok) throw new Error('Error al rechazar el caso');

      toast.success('Caso rechazado');
      fetchCases();
    } catch (error) {
      console.error('Error rejecting case:', error);
      toast.error('Error rechazando el caso.');
    }
  };

  // Generate report in CSV
  const generateReport = async () => {
    try {
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('Error al generar reporte');

      const data = await response.json();
      const csvContent = data
        .map((c: Case) => `${c.caseNumber},${c.firstName},${c.lastName},${c.status}`)
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `reporte-casos-${new Date().toISOString()}.csv`);

      toast.success('Reporte generado.');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error generando el reporte.');
    }
  };

  // Register new operator
  const registerOperator = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOperator),
      });

      if (!response.ok) throw new Error('Error al registrar el operador.');

      toast.success('Operador registrado exitosamente.');
      setNewOperator({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
      fetchMetrics();
    } catch (error) {
      console.error('Error registering operator:', error);
      toast.error('Error al registrar el operador.');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src="/assets/logo.webp" alt="Logo" className="logo" />
        <h1 className="dashboard-title">Dashboard del Supervisor</h1>
      </header>

      {/* Operator Metrics */}
      <section className="metrics-section">
        <h2>Métricas por Operador</h2>
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <Card key={metric.operatorId}>
              <CardHeader>
                <CardTitle>
                  {metric.operator?.firstName} {metric.operator?.lastName || 'No asignado'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Casos Completados: {metric.casesCompleted}</p>
                <p>Tasa de Éxito: {metric.successRate}%</p>
                {metric.averageResolutionTime && (
                  <p>Tiempo Promedio de Resolución: {metric.averageResolutionTime} hrs</p>
                )}
                <p>Fecha: {new Date(metric.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Case Management */}
      <section className="cases-section">
        <h2>Gestión de Casos</h2>
        {cases.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{`Caso: ${c.caseNumber}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Operador:{' '}
                {c.operator ? `${c.operator.firstName} ${c.operator.lastName}` : 'No asignado'}
              </p>
              <p>Estado: {c.status}</p>
              <div className="button-group">
                <Button onClick={() => approveCase(c.id)}>Aprobar</Button>
                <Button onClick={() => rejectCase(c.id)}>Rechazar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Report Generation */}
      <section className="report-section">
        <h2>Generar Reporte</h2>
        <Button onClick={generateReport}>Generar Reporte CSV</Button>
      </section>

      {/* Operator Registration */}
      <section className="operator-registration">
        <h2>Registrar Nuevo Operador</h2>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={newOperator.username}
            onChange={(e) =>
              setNewOperator({ ...newOperator, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={newOperator.password}
            onChange={(e) =>
              setNewOperator({ ...newOperator, password: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Nombre"
            value={newOperator.firstName}
            onChange={(e) =>
              setNewOperator({ ...newOperator, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Apellido"
            value={newOperator.lastName}
            onChange={(e) =>
              setNewOperator({ ...newOperator, lastName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={newOperator.email}
            onChange={(e) =>
              setNewOperator({ ...newOperator, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={newOperator.phone}
            onChange={(e) =>
              setNewOperator({ ...newOperator, phone: e.target.value })
            }
          />
        </div>
        <Button onClick={registerOperator}>Registrar Operador</Button>
      </section>

      {/* Chat */}
      <section className="chat-section">
  <Chat currentUser={{ id: 'supervisor-1', name: 'Supervisor', role: 'supervisor' }} />
</section>
    </div>
  );
}
