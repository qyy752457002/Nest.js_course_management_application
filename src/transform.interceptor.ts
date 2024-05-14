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

/*
  在这段代码中，`class-transformer` 库中的 `classToPlain` 函数用于将类实例转换为普通 JavaScript 对象。
  具体来说，它将类的实例中的属性转换为普通对象中的键值对，并且递归地转换嵌套的对象。
  这在处理数据时非常有用，特别是在需要将类实例转换为 JSON 格式或者进行对象的深拷贝时。

  在 Nest.js 中，通常我们会使用类来定义 DTO（数据传输对象）、实体等，这些类中包含了我们需要的业务数据。
  而在网络通信中，我们常常需要将这些类的实例转换为普通对象以进行传输，
  或者在数据库操作中需要将实体对象转换为纯粹的 JavaScript 对象以进行持久化。

  `TransformInterceptor` 拦截器的作用是在数据返回给客户端之前对其进行转换，
  这里使用 `classToPlain` 函数用于将类实例转换为普通 JavaScript 对象，
  以确保返回的数据不含有类实例的特殊属性，
  而只有我们需要的业务数据，这有助于保护数据的隐私性并减少不必要的信息泄露。
*/
