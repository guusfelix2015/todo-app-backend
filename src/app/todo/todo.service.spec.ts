import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/createTodo.dto';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'eca8a5a1-65bd-41c7-bc01-b86a71da9e41',
    deletedAt: new Date(),
    isDone: 0,
    task: 'Task 1',
  }),
  new TodoEntity({
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'eca8a5a1-65bd-41c7-bc01-b86a71da9e42',
    deletedAt: new Date(),
    isDone: 1,
    task: 'Task 2',
  }),
];

describe('TestService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<TodoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(todoEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockReturnValue(todoEntityList[0]),
            save: jest.fn().mockResolvedValue(todoEntityList[0]),
            merge: jest.fn().mockResolvedValue(todoEntityList[0]),
            softDelete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<TodoEntity>>(
      getRepositoryToken(TodoEntity),
    );
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
    expect(todoRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a todo list entity successfully', async () => {
      // Act
      const result = await todoService.findAll();

      // Assert
      expect(result).toEqual(todoEntityList);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());

      //Act
      expect(todoService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('should return a todo entity item successfully', async () => {
      // Act
      const result = await todoService.findOneOrFail('1');
      // Assert
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(todoService.findOneOrFail('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new todo entity item successfuly', async () => {
      //Arrange
      const data: CreateTodoDto = {
        task: 'Task 1',
        isDone: 0,
      };
      // Act
      const result = await todoService.create(data);
      // Assert
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      const data: CreateTodoDto = {
        task: 'Task 1',
        isDone: 0,
      };
      // Arrange == mock
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.create(data)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo entity item successfuly', async () => {
      const data: CreateTodoDto = {
        task: 'Task 1',
        isDone: 0,
      };
      const result = await todoService.update('1', data);
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.merge).toHaveBeenCalledTimes(1);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      const data: CreateTodoDto = {
        task: 'Task 1',
        isDone: 0,
      };
      // Arrange == mock
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.update('1', data)).rejects.toThrowError();
    });

    it('should throw an exception', () => {
      const data: CreateTodoDto = {
        task: 'Task 1',
        isDone: 0,
      };
      // Arrange == mock
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.update('1', data)).rejects.toThrowError();
    });
  });
  describe('delete', () => {
    it('should delete a todo entity item successfuly', async () => {
      const result = await todoService.deleteById('1');
      expect(result).toEqual(undefined);
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange == mock
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.deleteById('1')).rejects.toThrowError();
    });
  });
});
