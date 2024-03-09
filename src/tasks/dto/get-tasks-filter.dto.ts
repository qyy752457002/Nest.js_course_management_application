import { IsEnum, IsOptional, IsString } from 'class-validator'; // 这一行导入了 class-validator 库中的一些装饰器，用于验证 DTO 中的属性
import { TaskStatus } from '../task-status.enum'; // 这一行导入了一个自定义的枚举类型 TaskStatus，它定义了任务的不同状态

// 这是一个 TypeScript 类，表示用于过滤任务的数据传输对象
export class GetTasksFilterDto {
  // 这个装饰器用于标记属性为可选的。在 DTO 中，status 和 search 属性都是可选的
  @IsOptional()
  // 这个装饰器用于验证 status 属性的值是否属于 TaskStatus 枚举中的一个。确保传递的值是有效的任务状态
  @IsEnum(TaskStatus)
  // 这是一个属性，表示任务的状态。它的类型是 TaskStatus 枚举类型，并且使用了 @IsOptional() 装饰器来标记为可选的
  status?: TaskStatus;

  @IsOptional()
  // 这个装饰器用于验证 search 属性的值是否是字符串类型。确保传递的搜索值是一个字符串
  @IsString()
  // 这是另一个属性，表示用于搜索任务的字符串。它的类型是字符串，并且同样使用了 @IsOptional() 装饰器来标记为可选的
  search?: string;
}
