import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// 创建一个自定义装饰器，用于从请求中提取用户信息
export const GetUser = createParamDecorator(

  // 第一个参数为装饰器所接受的任意数据，这里没有使用，使用了下划线表示忽略
  (_data, ctx: ExecutionContext): User => {

    // 从执行上下文中获取HTTP请求对象
    const req = ctx.switchToHttp().getRequest();

    // 返回请求对象中的用户信息
    return req.user;
  },
);
