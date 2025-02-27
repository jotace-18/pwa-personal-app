# Imagen base
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json primero
COPY package.json package-lock.json ./

# Instalamos dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de desarrollo
EXPOSE 5173

# Evitar conflictos de cache de Vite en hot-reload
RUN rm -rf node_modules/.cache

# Comando de inicio
CMD ["npm", "run", "dev"]
