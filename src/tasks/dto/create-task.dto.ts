// 这里从 class-validator 库中导入了 IsNotEmpty 装饰器，用于验证对象属性的值不为空
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {

  /*
    这两个装饰器分别应用于 title 和 description 属性。
    它们确保这两个属性的值在创建任务时不为空
  */
  @IsNotEmpty()
  // 这是一个属性，表示任务的标题。
  // 它的类型为字符串
  title: string;

  @IsNotEmpty()
  // 这是另一个属性，表示任务的描述。
  // 同样，它的类型也是字符串
  description: string;
}
