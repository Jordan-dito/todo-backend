# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Compila el proyecto TypeScript a JavaScript
RUN npm run build

# Expone el puerto en el que la aplicación escuchará
EXPOSE 3000

# Define el comando por defecto para ejecutar la aplicación
CMD [ "npm", "run", "start:prod" ]