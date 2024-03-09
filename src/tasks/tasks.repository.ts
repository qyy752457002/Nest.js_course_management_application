import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

// @EntityRepository(Task) 导出了一个名为 TasksRepository 的类
@EntityRepository(Task)
// TasksRepository 类：这是一个 TypeScript 类，扩展自 TypeORM 提供的 Repository<Task> 类，用于处理任务实体的数据库操作。
export class TasksRepository extends Repository<Task> {
  /*
    private logger = new Logger('TasksRepository', true);：创建了一个私有成员变量 logger，用于记录日志。
                                                           Logger 是一个自定义的日志记录器，它将记录有关任务存储库的日志信息。
  */
  private logger = new Logger('TasksRepository', true);

  // 这是一个异步方法，接受两个参数 filterDto 和 user，用于获取任务列表。
  // filterDto 是一个对象，包含用于过滤任务的状态和搜索条件。
  // user 是一个表示用户的对象
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    // 在方法中，首先从 filterDto 中提取 status 和 search
    const { status, search } = filterDto;

    // 接着创建一个查询构建器 query，并指定了查询的主体是 task 表
    const query = this.createQueryBuilder('task');
    // 使用 query.where({ user }) 条件限制只查询属于特定用户的任务
    query.where({ user });

    // 如果 status 存在，使用 query.andWhere() 添加查询条件，以过滤特定状态的任务
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    // 如果 search 存在，使用 query.andWhere() 添加查询条件，以在任务标题和描述中进行部分匹配搜索
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // 在 try-catch 块中执行查询操作，并返回获取的任务列表。
    // 如果查询失败，将记录错误信息并抛出 InternalServerErrorException 异常
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  // createTask 方法：这是一个异步方法，接受两个参数 createTaskDto 和 user，用于创建新任务。
                    // createTaskDto 是一个对象，包含要创建任务的标题和描述。

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // 从 createTaskDto 中提取 title 和 description
    const { title, description } = createTaskDto;

    // 使用 this.create() 方法创建一个新的任务对象，设置任务的标题、描述、状态和用户。
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    // 使用 this.save() 方法将任务保存到数据库中，并返回创建的任务对象。
    await this.save(task);
    return task;
  }
}
