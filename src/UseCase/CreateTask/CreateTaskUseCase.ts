import { Injectable, BadRequestException } from '@nestjs/common';
import { UseCase } from '../../index';
import CreateTaskDto from './CreateTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';
import { Task } from '@prisma/client';

@Injectable()
export default class CreateTaskUseCase implements UseCase<Promise<Task>, [dto: CreateTaskDto]> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: CreateTaskDto): Promise<Task> {
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('Task name is required');
    }

    try {
      return await this.taskRepository.create({ name: dto.name });
    } catch (error) {
      throw new BadRequestException(`Failed to create task: ${error.message}`);
    }
  }
}
