import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';

// 控制器用于处理与任务相关的 HTTP 请求
// 这个装饰器指定了控制器的路由前缀为 '/tasks'，意味着这个控制器下的所有路由都以 '/tasks' 开头。
@Controller('tasks')
// 使用AuthGuard身份验证守卫保护此控制器中的所有路由，要求用户进行身份验证
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController'); // 创建日志记录器

  constructor(private tasksService: TasksService) {} // 构造函数，注入任务服务
  
  // 获取所有任务的路由处理函数
  @Get()
  getTasks(
    // 从查询参数中获取过滤条件
    @Query() filterDto: GetTasksFilterDto,
    // 获取当前用户信息
    @GetUser() user: User,
  ): Promise<Task[]> {
    // 记录日志：记录用户正在检索所有任务的操作和过滤条件
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );

    // 调用任务服务中的方法获取所有任务
    return this.tasksService.getTasks(filterDto, user);
  }

  // 获取特定任务的路由处理函数
  @Get('/:id')
  getTaskById(
    // 从路由参数中获取任务ID
    @Param('id') id: string,
    // 获取当前用户信息
    @GetUser() user: User,
  ): Promise<Task> {
    // 调用任务服务中的方法获取特定ID的任务
    return this.tasksService.getTaskById(id, user);
  }

  // 创建任务的路由处理函数
  @Post()
  createTask(
    // 从请求体中获取要创建的任务数据
    @Body() createTaskDto: CreateTaskDto,
    // 获取当前用户信息
    @GetUser() user: User,
  ): Promise<Task> {
    // 记录日志：记录用户创建新任务的操作和任务数据
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    // 调用任务服务中的方法创建新任务
    return this.tasksService.createTask(createTaskDto, user);
  }

  // 删除任务的路由处理函数
  @Delete('/:id')
  deleteTask(
    // 从路由参数中获取要删除的任务ID
    @Param('id') id: string,
    // 获取当前用户信息
    @GetUser() user: User,
  ): Promise<void> {
    // 调用任务服务中的方法删除指定ID的任务
    return this.tasksService.deleteTask(id, user);
  }

  // 更新任务状态的路由处理函数
  @Patch('/:id/status')
  updateTaskStatus(
    // 从路由参数中获取要更新状态的任务ID
    @Param('id') id: string,
    // 从请求体中获取更新后的任务状态
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    // 获取当前用户信息
    @GetUser() user: User,
  ): Promise<Task> {
    // 从更新后的任务状态对象中获取状态属性
    const { status } = updateTaskStatusDto;
    // 调用任务服务中的方法更新任务状态
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
