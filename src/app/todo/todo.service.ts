import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll() {
    return await this.todoRepository.find();
  }

  async findOneOrFail(id: string) {
    try {
      return this.todoRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data) {
    return await this.todoRepository.save(this.todoRepository.create(data));
  }

  async update(id: string, data) {
    const todo = await this.findOneOrFail(id);

    this.todoRepository.merge(todo, data);

    return await this.todoRepository.save(data);
  }

  async deleteById(id: string) {
    const todo = await this.findOneOrFail(id);

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.todoRepository.softDelete(id);
  }
}
