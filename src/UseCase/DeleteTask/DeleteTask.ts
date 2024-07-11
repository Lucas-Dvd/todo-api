import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { UseCase } from '../../index';
import TaskRepository from '../../Repositories/TaskRepository';

@Injectable()
export default class DeleteTask implements UseCase<Promise<boolean>, [id: number]> {
  private readonly logger = new Logger(DeleteTask.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(id: number): Promise<boolean> {
    this.logger.log(`Attempting to delete task with ID: ${id}`);

    try {
      const task = await this.taskRepository.findOne(id);
      if (!task) {
        this.logger.error(`Task with ID: ${id} not found`);
        throw new BadRequestException(`Task with ID: ${id} not found`);
      }

      await this.taskRepository.delete(id);
      this.logger.log(`Task with ID: ${id} deleted successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete task with ID: ${id}`, error.stack);
      throw new BadRequestException(`Failed to delete task: ${error.message}`);
    }
  }
}
