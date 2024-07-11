import { Injectable, BadRequestException } from '@nestjs/common';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';
import { Task } from '@prisma/client';

@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: SaveTaskDto): Promise<Task> {
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('Task name is required');
    }

    try {
      if (dto.id) {
        // Mise à jour de la tâche existante
        return await this.taskRepository.update(dto.id, { name: dto.name });
      } else {
        // Création d'une nouvelle tâche
        return await this.taskRepository.create({ name: dto.name });
      }
    } catch (error) {
      throw new BadRequestException(`Failed to save task: ${error.message}`);
    }
  }
}
