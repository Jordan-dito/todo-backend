import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Obtener todas las tareas
  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  // Filtrar tareas por estado
  async filterByStatus(isCompleted: boolean): Promise<Task[]> {
    return this.taskRepository.find({ where: { isCompleted } });
  }

  // Obtener una tarea por ID con manejo de errores
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  // Crear una nueva tarea
  async create(task: Partial<Task>): Promise<Task> {
    const newTask = this.taskRepository.create(task);
    return this.taskRepository.save(newTask);
  }

  // Actualizar una tarea existente
  async update(id: number, task: Partial<Task>): Promise<Task> {
    await this.findOne(id); // Usa findOne que ya maneja errores
    await this.taskRepository.update(id, task);
    return this.findOne(id);
  }

  // Eliminar una tarea existente
  async delete(id: number): Promise<void> {
    const task = await this.findOne(id); // Usa findOne que ya maneja errores
    await this.taskRepository.delete(task.id);
  }
}
