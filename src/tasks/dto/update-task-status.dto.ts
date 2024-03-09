import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto {
  // 这个装饰器用于验证 status 属性的值是否属于 TaskStatus 枚举中的一个。确保传递的值是有效的任务状态
  @IsEnum(TaskStatus)
  // 这是一个属性，表示要更新的任务状态。它的类型是 TaskStatus 枚举类型，这意味着它只能取枚举中定义的值
  status: TaskStatus;
}

/*
  总之，这个类定义了一个数据传输对象，用于更新任务的状态。
  它包含一个属性 status，用于指定任务的新状态，并使用 @IsEnum(TaskStatus) 装饰器确保传递的状态值是有效的。
*/