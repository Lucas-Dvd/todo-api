import { Injectable, BadRequestException } from '@nestjs/common';
import { UseCase } from '../../index';
import UpdateTaskDto from './UpdateTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';
import { Task } from '@prisma/client';

@Injectable()
export default class UpdateTaskUseCase implements UseCase<Promise<Task>, [dto: UpdateTaskDto]> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: UpdateTaskDto): Promise<Task> {
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('Task name is required');
    }

    try {
      return await this.taskRepository.update(dto.id, { name: dto.name });
    } catch (error) {
      throw new BadRequestException(`Failed to update task: ${error.message}`);
    }
  }
}
