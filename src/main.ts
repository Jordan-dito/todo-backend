import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import * as compression from 'compression';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as promBundle from 'express-prom-bundle'; // Middleware para métricas con Prometheus

config(); // Cargar variables de entorno

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware para métricas con Prometheus
  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
  });
  app.use(metricsMiddleware);

  // Habilitar validaciones avanzadas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos no definidos en los DTOs
      forbidNonWhitelisted: true, // Lanza error si se envían datos no permitidos
      transform: true, // Convierte tipos (ejemplo: query params a números)
    }),
  );

  // Habilitar compresión para mejorar rendimiento
  app.use(compression());

  // Registrar las solicitudes HTTP en la consola
  app.use(morgan('dev'));

  // Habilitar CORS (Permite peticiones de otros dominios)
  app.enableCors();

  // Prefijo global para los endpoints de la API
  app.setGlobalPrefix('api/v1');

  // Agregar cookie-parser para leer cookies
  app.use(cookieParser() as any);

  // Configuración de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('API para gestión de tareas')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurity('cookieAuth', {
      type: 'apiKey',
      in: 'cookie',
      name: 'jwt', // Swagger usará la cookie JWT automáticamente
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document); // Cambié la ruta de Swagger a `/api/docs`

  // Iniciar el servidor
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(` Server running on: http://localhost:${PORT}/api/v1`);
  console.log(` Swagger Docs available at: http://localhost:${PORT}/api/docs`);
  console.log(
    ` Prometheus metrics available at: http://localhost:${PORT}/metrics`,
  );
}

bootstrap().catch((error) => {
  console.error(' Error durante bootstrap:', error);
});
