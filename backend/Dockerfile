# Imagen oficial de node 18
FROM node:18

# Ajustamos variable de entorno para ambiente de producción
ENV NODE_ENV=production

# Creamos directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los package.json para instalar dependencias
COPY package*.json ./

# Instalamos devDependencies (sin --production)
RUN npm install

# Instalamos nodemon globalmente
RUN npm install -g nodemon

# Copiamos el resto de los archivos
COPY . .

# Exponemos el puerto 4000
EXPOSE 4000

# Comando por defecto: nodemon 
CMD ["nodemon", "src/server.js"]