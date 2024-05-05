import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  // 模拟 getTasks 方法的 Jest mock 函数
  getTasks: jest.fn(),
  // 模拟 findOne 方法的 Jest mock 函数
  findOne: jest.fn(),
});

const mockUser = {
  // 模拟用户对象
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  // 在测试开始前，创建 TasksService 和 TasksRepository 的实例
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // 在每个测试用例运行前，创建测试模块
    const module = await Test.createTestingModule({
      // 提供 TasksService 和使用 mockTasksRepository 工厂函数提供的 TasksRepository
      providers: [
        TasksService,

        // 工厂函数mockTasksRepository被用来创建模拟的TasksRepository实例，其中包含了两个模拟方法：getTasks和findOne
        // 这样，在测试过程中，你可以轻松地模拟这些方法的行为，而不会实际访问数据库
        // useFactory提供了一种灵活的方式来创建服务或者依赖项的实例，使得你可以根据需要执行自定义的逻辑，比如在测试中使用模拟对象
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    // 获取 TasksService 和 TasksRepository 的实例
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    // 测试 getTasks 方法
    it('calls TasksRepository.getTasks and returns the result', async () => {
      // 模拟 getTasks 方法返回的值 为 'someValue'
      tasksRepository.getTasks.mockResolvedValue('someValue');
      // 调用 getTasks 方法，并断言返回的值与预期值相等
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    // 测试 getTaskById 方法，当找到任务时
    it('calls TasksRepository.findOne and returns the result', async () => {
      // 模拟的任务对象
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      // 模拟 findOne 方法返回的值为 mockTask
      tasksRepository.findOne.mockResolvedValue(mockTask);

      // 调用 getTaskById 方法，并断言返回的值与预期值相等
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    // 测试 getTaskById 方法，当未找到任务时
    it('calls TasksRepository.findOne and handles an error', async () => {
      // 模拟 findOne 方法返回的值为 null，表示未找到任务
      tasksRepository.findOne.mockResolvedValue(null);
      // 断言调用 getTaskById 方法会抛出 NotFoundException 异常
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

