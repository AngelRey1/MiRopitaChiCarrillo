# Usar Node.js 18 como base
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear directorio para archivos estáticos
RUN mkdir -p public

# Exponer puerto
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"] 