import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    // Decodificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.json({ message: 'Acceso autorizado', user: decoded });
  } catch (error) {
    console.error('Error en ruta protegida:', error);
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
  }
}
