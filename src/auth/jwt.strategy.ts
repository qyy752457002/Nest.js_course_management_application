import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

// 这段代码是一个使用 NestJS 框架和 Passport 库实现的 JWT 策略

// @Injectable() 装饰器：标记了这个类是一个可注入的服务，它可以被 NestJS 的依赖注入系统管理
@Injectable()
// JwtStrategy 类：这是一个用于处理 JSON Web Token (JWT) 的策略类，它扩展了 Passport 中的 Strategy 类
export class JwtStrategy extends PassportStrategy(Strategy) {

  /*
    构造函数：JwtStrategy 类的构造函数接收两个参数：

    usersRepository: UsersRepository：通过 @InjectRepository(UsersRepository) 注入了一个 UsersRepository 实例，用于处理用户相关的数据库操作。

    configService: ConfigService：注入了一个 ConfigService 实例，用于获取应用程序的配置信息，比如 JWT 密钥等。
  */
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {

    /*
      super()：调用父类（PassportStrategy）的构造函数，传入一个包含 JWT 相关配置的对象：

              secretOrKey: configService.get('JWT_SECRET')：从配置服务中获取 JWT 密钥，用于验证和解码 JWT。

              jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()：指定从请求的授权头部中提取 JWT。
    */

    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /*
    validate() 方法：这是一个必须实现的方法，用于验证 JWT 的有效性并返回解码后的用户信息。
    
    它接收一个 payload 参数，该参数包含了从 JWT 中解码出来的数据。

    payload: JwtPayload：JWT 中存储的数据，通常包含用户的标识信息，这里假设包含了 username。

    在 validate() 方法中，首先从 payload 中提取 username。

    然后，使用 usersRepository 实例来查询数据库，根据提取的 username 查找相应的用户信息。

    如果找不到用户，抛出 UnauthorizedException 异常，表示用户未经授权。

    如果找到用户，将用户信息返回，表示验证成功。

  */
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
