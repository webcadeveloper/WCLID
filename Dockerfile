FROM node:18-bullseye

# Instalar OpenSSL 1.1.x
RUN apt-get update && apt-get install -y openssl=1.1.1n-0+deb11u4

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar el proyecto al contenedor
COPY . .

# Instalar dependencias y generar Prisma Client
RUN npm install
RUN npx prisma generate

# Exponer el puerto para Next.js
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "run", "dev"]
