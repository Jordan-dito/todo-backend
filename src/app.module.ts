import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module'; // Importa tu módulo de tareas
import { AppController } from './app.controller'; // Controlador general
import { AppService } from './app.service'; // Servicio general

// Agregar logs para depurar variables de entorno
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    // Configuración para variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Ruta explícita al archivo .env
    }),

    // Configuración de TypeORM para conectar con MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost', // Usa "localhost" si DB_HOST está indefinido
      port: parseInt(process.env.DB_PORT || '3306', 10), // Convierte a número con un valor predeterminado
      username: process.env.DB_USER || 'root', // Usa "root" si DB_USER está indefinido
      password: process.env.DB_PASSWORD || 'root', // Usa "root" si DB_PASSWORD está indefinido
      database: process.env.DB_NAME || 'todo_app', // Usa "todo_app" si DB_NAME está indefinido
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo
    }),

    // Importa el módulo de tareas
    TasksModule,
  ],
  controllers: [AppController], // Controladores generales
  providers: [AppService], // Servicios generales
})
export class AppModule {}
