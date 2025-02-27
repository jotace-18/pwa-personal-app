# Imagen oficial de node 18
FROM node:18

# Ajustamos variable de entorno para ambiente de desarrollo
ENV NODE_ENV=development

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalamos dependencias sin borrar devDependencies
RUN npm install

# Instalamos nodemon globalmente
RUN npm install -g nodemon

# Copiamos el resto del código
COPY . .

# Exponemos el puerto 4000
EXPOSE 4000

# Comando por defecto: nodemon con watch
CMD ["nodemon", "--legacy-watch", "src/server.js"]
