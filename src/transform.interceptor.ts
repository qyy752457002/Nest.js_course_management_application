import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common'; // 这里是从 Nest.js 框架中导入所需的模块和装饰器，其中包括 NestInterceptor、ExecutionContext、Injectable 和 CallHandler。

// 这里从 class-transformer 库中导入了 classToPlain 函数，它用于将类实例转换为普通 JavaScript 对象。
import { classToPlain } from 'class-transformer';
// 这里从 rxjs/operators 中导入了 map 操作符，它用于对 Observable 流中的每个数据项进行映射转换。
import { map } from 'rxjs/operators';

// 这是 Nest.js 中用于声明可注入的类的装饰器。在这个类中，我们声明了一个名为 TransformInterceptor 的可注入类
@Injectable()
// 这是定义一个名为 TransformInterceptor 的类，并且它实现了 NestInterceptor 接口。
// NestInterceptor 接口规定了拦截器类必须要实现的方法
export class TransformInterceptor implements NestInterceptor {

  /*
    这是 NestInterceptor 接口中定义的 intercept 方法的实现。该方法接收两个参数：

    context: ExecutionContext 对象，它封装了当前请求的上下文信息。
    next: CallHandler<any> 对象，它表示下一个处理程序，可以调用 handle() 方法来执行下一个处理程序。
  */
  intercept(context: ExecutionContext, next: CallHandler<any>) {

    /*
      在拦截器中，这里调用了 next.handle() 来执行下一个处理程序，
      然后使用 pipe 方法添加了一个操作符 map。
      
      map 操作符会对 Observable 流中的每个数据项进行映射转换，
      这里将数据项通过 classToPlain 函数转换为普通的 JavaScript 对象
    */
    return next.handle().pipe(map((data) => classToPlain(data)));
  }

  // 总的来说，这个拦截器的作用是在请求处理过程中将响应数据中的类实例转换为普通的 JavaScript 对象，然后再将处理结果返回给客户端。
}
