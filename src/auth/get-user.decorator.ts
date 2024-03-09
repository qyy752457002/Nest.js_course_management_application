import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// 这段代码是使用 TypeScript 和 NestJS 框架编写的，它定义了一个自定义参数装饰器（custom parameter decorator）GetUser

// export const GetUser: 这一行定义了一个名为 GetUser 的常量，它将被导出以供其他模块使用。
// createParamDecorator: 这是 NestJS 框架提供的一个函数，用于创建自定义参数装饰器。参数装饰器允许你在控制器的路由处理函数中访问请求对象的特定部分，例如用户对象
export const GetUser = createParamDecorator(

  /*
    (_data, ctx: ExecutionContext) => { ... }: 这是一个箭头函数，它是参数装饰器的具体实现。
    它接受两个参数，第一个参数 _data 是装饰器可以接受的额外数据，通常在这里可以传递一些配置或标志。
    第二个参数 ctx 是执行上下文（ExecutionContext），它提供了关于当前请求的一些上下文信息

  */

  (_data, ctx: ExecutionContext): User => {

    /*
      const req = ctx.switchToHttp().getRequest();: 这一行从执行上下文中获取了 HTTP 请求对象。
                                                    switchToHttp() 方法将执行上下文切换到 HTTP 上下文，然后 getRequest() 方法获取当前的 HTTP 请求对象
    */
    const req = ctx.switchToHttp().getRequest();

    /*
      return req.user;: 最后，装饰器返回了 req.user，其中 user 可能是从请求对象中提取的用户信息，这取决于应用程序的具体实现。
      通常，req.user 是在用户身份验证过程中设置的，用于标识当前请求的用户
    */
    return req.user;
  },
);
