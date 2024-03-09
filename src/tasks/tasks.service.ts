import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

/*

  这段代码是一个 Nest.js 应用中的服务类 `TasksService`，用于处理任务（tasks）相关的业务逻辑。
  让我逐步解释这段代码的功能和结构：

    1. `@Injectable()` 装饰器：表明这是一个可注入的服务类，可以在 Nest.js 应用中作为依赖注入的对象。

    2. `TasksService` 类：这是一个 TypeScript 类，用于处理任务相关的操作。

    3. 构造函数：接收一个 `TasksRepository` 类型的参数，通过依赖注入的方式注入 `TasksRepository` 的实例，用于与数据库进行交互。

    4. `getTasks()` 方法：接收一个 `GetTasksFilterDto` 类型的过滤器和一个 `User` 对象作为参数，返回一个 `Promise`，用于获取满足过滤条件的任务列表。

    5. `getTaskById()` 方法：接收一个任务的 ID 字符串和一个 `User` 对象作为参数，返回一个 `Promise`，用于根据任务 ID 查找任务。
                            如果未找到匹配的任务，则抛出 `NotFoundException`。

    6. `createTask()` 方法：接收一个 `CreateTaskDto` 类型的参数和一个 `User` 对象作为参数，返回一个 `Promise`，用于创建新的任务。

    7. `deleteTask()` 方法：接收一个任务的 ID 字符串和一个 `User` 对象作为参数，返回一个 `Promise<void>`，用于删除指定 ID 的任务。
                           如果未找到匹配的任务，则抛出 `NotFoundException`。

    8. `updateTaskStatus()` 方法：接收一个任务的 ID 字符串、任务状态和一个 `User` 对象作为参数，返回一个 `Promise`，用于更新指定 ID 的任务的状态。
                                  内部调用了 `getTaskById()` 方法来确保要更新的任务存在，并更新任务的状态后保存到数据库中。

    总的来说，这段代码实现了一个任务管理服务，
    包括获取任务列表、根据 ID 获取单个任务、创建任务、删除任务以及更新任务状态等功能，
    并且使用了依赖注入和异步编程的特性。

*/

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
