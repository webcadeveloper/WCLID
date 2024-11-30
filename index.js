const next = require('next');
const http = require('http');
const { PrismaClient } = require('@prisma/client'); // Importa Prisma Client

// Configuración de puertos
const PORT = process.env.PORT || 7000; // Usa el puerto dinámico en despliegue
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Inicializa Prisma Client
const prisma = new PrismaClient();

// Función para inicializar Next.js
const startNextApp = () => {
    return app.prepare().then(() => {
        const server = http.createServer((req, res) => {
            handle(req, res); // Maneja las solicitudes de Next.js
        });

        return new Promise((resolve, reject) => {
            server.listen(PORT, (err) => {
                if (err) {
                    console.error('❌ Error al iniciar Next.js:', err);
                    reject(err);
                    return;
                }
                console.log(`✅ Next.js iniciado correctamente en http://localhost:${PORT}`);
                resolve();
            });

            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    console.error(`❌ El puerto ${PORT} ya está en uso.`);
                }
                reject(error);
            });
        });
    });
};

// Función principal para iniciar servicios
async function startAll() {
    try {
        console.log('🔄 Verificando conexión a la base de datos...');
        await prisma.$connect(); // Conecta a la base de datos
        console.log('✅ Conexión a la base de datos exitosa.');

        console.log('🚀 Iniciando Next.js...');
        await startNextApp();
        console.log('✅ Next.js iniciado correctamente.');
    } catch (error) {
        console.error('❌ Error al iniciar servicios:', error.message || error);
        process.exit(1);
    }
}

// Manejo de errores globales
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Rechazo no manejado:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('⚠️ Excepción no manejada:', error);
    process.exit(1);
});

// Cierra la conexión de Prisma cuando el proceso finaliza
process.on('SIGINT', async () => {
    console.log('🚦 Apagando servidor...');
    await prisma.$disconnect();
    console.log('✅ Conexión de Prisma cerrada.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🚦 Finalizando proceso...');
    await prisma.$disconnect();
    console.log('✅ Conexión de Prisma cerrada.');
    process.exit(0);
});

// Iniciar todos los servicios
startAll();
