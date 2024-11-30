// lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';

// Asegúrate de que la función getUserFromRequest esté definida o importada
const getUserFromRequest = (request: NextRequest) => {
  // Implementa la lógica para obtener el usuario de la solicitud, como acceder a un token o sesión
  return {
    id: '1',
    role: 'OPERATOR',
    name: 'John Doe',
  };
};

export const isAuthenticated = (handler: Function) => {
  return (request: NextRequest) => {
    const user = getUserFromRequest(request); // Lógica para obtener el usuario de la solicitud
    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }
    return handler(request, user); // Llama al siguiente handler si está autenticado
  };
};

export const hasRole = (roles: string[]) => (handler: Function) => {
  return (request: NextRequest, user: any) => {
    if (!roles.includes(user.role)) {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }
    return handler(request, user); // Llama al handler si el usuario tiene el rol adecuado
  };
};
