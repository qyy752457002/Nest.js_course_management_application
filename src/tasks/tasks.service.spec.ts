import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

/*
  这段代码是一个单元测试的示例，针对一个任务管理系统中的 `TasksService` 类进行测试。

  总的来说，这段代码使用 Jest 框架进行单元测试，针对任务管理系统中的 `TasksService` 类的方法进行了测试。
  它确保了方法在给定输入时能够正确地返回预期的输出，并且能够处理可能出现的异常情况。
*/

// `mockTasksRepository` 函数定义了一个模拟的任务仓库对象，它包含两个 jest mock 函数：`getTasks` 和 `findOne`。
const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

// `mockUser` 是一个模拟的用户对象，具有用户名、ID、密码和任务数组等属性。
const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

// `describe('TasksService', () => {...})` 定义了一个测试套件，用于对 `TasksService` 类进行测试。
describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  /*
    `beforeEach` 函数在每个测试用例运行之前运行，它初始化了测试环境，包括创建了一个测试模块并编译它。
    在这个模块中，`TasksService` 作为提供者被提供，而 `TasksRepository` 则被替换为上面定义的模拟仓库。
  */
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  // `describe('getTasks', () => {...})` 定义了一个测试子套件，用于测试 `getTasks` 方法。
  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  // 定义了另一个测试子套件，用于测试 `getTaskById` 方法。
  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);

      // 第一个测试用例测试了当 `getTaskById` 方法被调用时，期望能够获取到正确的任务对象。
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      // 第二个测试用例测试了当 `getTaskById` 方法被调用但未找到任务时，是否能够正确地抛出 `NotFoundException` 异常。
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  
});
