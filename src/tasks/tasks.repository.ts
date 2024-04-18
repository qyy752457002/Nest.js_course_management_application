import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

// 指定的实体（Task）与自定义的存储库相关联，使我们能够通过存储库对象方便地执行数据库操作
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> { // 任务仓库类继承自typeorm的仓库类，并指定实体类型为Task
 
  // 创建日志记录器，用于记录错误信息
  private logger = new Logger('TasksRepository', true);

  // 获取任务列表的异步方法，接受过滤器和用户，返回任务数组
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    
    // 解构获取过滤器中的状态和搜索字段
    const { status, search } = filterDto;

    // 创建查询构建器，并指定主表为 'task'
    const query = this.createQueryBuilder('task');

    // 添加筛选条件，限制用户
    query.where({ user });

    // 如果状态存在，则添加状态筛选条件
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    // 如果搜索关键词存在，则添加搜索条件
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      // 执行查询并返回结果
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      // 记录错误信息，并抛出内部服务器错误异常
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  // 创建任务的异步方法，接受创建任务的数据和用户，返回创建的任务
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {

    // 解构获取创建任务数据中的标题和描述
    const { title, description } = createTaskDto;

    // 创建任务实体，设置标题、描述、状态为 OPEN，并关联用户
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    // 保存任务实体到数据库并返回
    await this.save(task);
    return task;
  }
}

