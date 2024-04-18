import { IsEnum, IsOptional, IsString } from 'class-validator'; 
import { TaskStatus } from '../task-status.enum'; 

// 获取任务过滤器数据传输对象
export class GetTasksFilterDto {

  // 表示此属性是可选的，即它可以不提供。在使用此 DTO 进行验证时，如果 status 属性不存在，验证器不会报错。
  @IsOptional()
  // 表示对 status 属性进行枚举类型的验证，确保它的值属于 TaskStatus 枚举中的一个。
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  // 表示此属性是可选的，即它可以不提供。在使用此 DTO 进行验证时，如果 search 属性不存在，验证器不会报错。
  @IsOptional()
  // 表示对 search 属性进行字符串类型的验证，确保它是一个字符串。
  @IsString()
  search?: string;
}

