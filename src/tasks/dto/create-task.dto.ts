import { IsNotEmpty } from 'class-validator';

// 创建任务数据传输对象
export class CreateTaskDto {

  // 标题字段，不能为空
  @IsNotEmpty()
  title: string;

  // 描述字段，不能为空
  @IsNotEmpty()
  description: string;
}
