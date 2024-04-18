import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

// JwtStrategy是一个可注入的Passport策略，用于验证JWT令牌
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  /*
    TypeScript 继承的相关概念 

      对于 TypeScript 中的类继承，如果子类（派生类）的构造函数中包含参数，
      那么在子类的构造函数中必须调用父类（基类）的构造函数，并且要传递相应的参数。

      这是因为在 TypeScript 中，子类的构造函数必须调用父类的构造函数以确保父类的初始化工作被执行。

      JwtStrategy 是一个子类，它继承自 PassportStrategy(Strategy)，
      而 PassportStrategy 又是 Strategy 的子类。

      因此，在 JwtStrategy 的构造函数中，调用 super() 方法时必须传递 PassportStrategy(Strategy) 类的构造函数所需的参数。
  */
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    // 调用父类的构造函数，传递JWT配置参数
    // { secretOrKey, jwtFromRequest } 为一个对象，是 PassportStrategy(Strategy) 类的构造函数所需的参数
    super({
      secretOrKey: configService.get('JWT_SECRET'), // 密钥
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求中提取JWT令牌
    });
  }

  // 验证JWT有效载荷，返回用户信息
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    // 在用户仓库中查找用户
    const user: User = await this.usersRepository.findOne({ username });

    // 如果未找到用户，则抛出未经授权的异常
    if (!user) {
      throw new UnauthorizedException();
    }

    // 返回找到的用户信息
    return user;
  }
}
