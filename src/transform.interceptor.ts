import {
  NestInterceptor, // Nest 拦截器接口
  ExecutionContext, // 执行上下文
  Injectable, // 可注入的装饰器
  CallHandler, // 调用处理程序
} from '@nestjs/common'; 
import { classToPlain } from 'class-transformer'; // 导入 class-transformer 中的 classToPlain 函数
import { map } from 'rxjs/operators'; // 导入 rxjs 中的 map 操作符
@Injectable() // 声明该类可注入
export class TransformInterceptor implements NestInterceptor { // 实现 NestInterceptor 接口的 TransformInterceptor 类
  intercept(context: ExecutionContext, next: CallHandler<any>) { // 实现拦截方法

    return next.handle().pipe( // 返回处理后的可观察流
      map((data) => classToPlain(data)) // 映射数据并转换为普通对象
    );
  }
}

