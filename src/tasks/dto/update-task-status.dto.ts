import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

// UpdateTaskStatusDto类用于表示更新任务状态的数据传输对象
export class UpdateTaskStatusDto {

  // 使用IsEnum装饰器确保status属性的值是TaskStatus枚举中的一个
  @IsEnum(TaskStatus)
  // status属性表示任务的状态，可以是TaskStatus枚举中的任何一个值
  status: TaskStatus;
}
