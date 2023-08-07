import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpdateTodoDto } from './dto/updateTodo.dto';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;
  const TodoEntityList: TodoEntity[] = [
    new TodoEntity({
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 'eca8a5a1-65bd-41c7-bc01-b86a71da9e40',
      deletedAt: new Date(),
      isDone: 1,
      task: 'Task 1',
    }),
    new TodoEntity({
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 'eca8a5a1-65bd-41c7-bc01-b86a71da9e41',
      deletedAt: new Date(),
      isDone: 1,
      task: 'Task 2',
    }),
  ];

  const newTodoEntity: TodoEntity = new TodoEntity({
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'eca8a5a1-65bd-41c7-bc01-b86a71da9e41',
    deletedAt: new Date(),
    isDone: 1,
    task: 'Task 2',
  });

  const updateTodoEntity: TodoEntity = new TodoEntity({
    task: 'Task 1',
    isDone: 0,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(TodoEntityList),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            findOneOrFail: jest.fn().mockResolvedValue(TodoEntityList[0]),
            update: jest.fn().mockResolvedValue(updateTodoEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return todo list entity successfully', async () => {
      // Act
      const result = await todoController.index();
      // Assert
      expect(result).toEqual(TodoEntityList);
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      //Arrange
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.index()).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new todo item successfully', async () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      // Act
      const result = await todoController.create(body);

      // Assert
      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      // Aqui esta sendo chamado com um parametro especifico
      expect(todoService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };
      // Arrange
      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.create(body)).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should get todo item successfully', async () => {
      // Act
      const result = await todoController.show('1');

      // Assert
      expect(result).toEqual(TodoEntityList[0]);
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith('1');
    });

    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(todoController.show('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo item successfully', async () => {
      //Arrange
      const body: UpdateTodoDto = {
        task: 'Task 1',
        isDone: 0,
      };
      //Act
      const result = await todoController.update('1', body);

      // Assert
      expect(result).toEqual(updateTodoEntity);
      expect(todoService.update).toHaveBeenCalledTimes(1);
      expect(todoService.update).toHaveBeenCalledWith('1', body);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: UpdateTodoDto = {
        task: 'Task 1',
        isDone: 0,
      };
      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should delete a todo item successfully', async () => {
      // Act
      const result = await todoController.destroy('1');

      // Assert
      expect(result).toEqual(undefined);
      expect(todoService.deleteById).toHaveBeenCalledTimes(1);
      expect(todoService.deleteById).toHaveBeenCalledWith('1');
    });
  });
});
