import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

/*
  这段代码是一个基本的身份验证服务的实现，通常用于用户注册和登录。让我解释一下：

1. `@Injectable()` 装饰器：这是 Nest.js 中的一个装饰器，用于标记这个类是一个可注入的服务。

2. `AuthService` 类：这是一个认证服务类，负责处理用户注册和登录逻辑。

3. 构造函数：接受两个参数：

   - `private usersRepository: UsersRepository`：一个用于操作用户数据的仓库（repository）。`UsersRepository` 可能是一个自定义的仓库，用于与用户相关的数据库操作。
   
   - `private jwtService: JwtService`：用于生成和验证 JSON Web Tokens（JWT）的服务。它提供了一种在客户端和服务器之间安全地传输信息的方式。

4. `signUp` 方法：用于注册新用户。它接受一个包含用户名和密码的 `authCredentialsDto` 对象作为参数，并使用 `usersRepository` 来创建新用户。

5. `signIn` 方法：用于用户登录。它接受一个包含用户名和密码的 `authCredentialsDto` 对象作为参数，并通过 `usersRepository` 查找用户。
                  如果找到了用户并且密码匹配，则生成一个 JWT 并返回包含 JWT 的对象，否则抛出未经授权的异常。

   - 首先，它从 `authCredentialsDto` 中提取用户名和密码。
   
   - 然后，它使用用户名在数据库中查找用户记录。
   
   - 如果找到用户并且密码与数据库中存储的哈希密码匹配，它将生成一个 JWT。JWT 的 payload 部分包含用户名。
   
   - 最后，它返回一个包含 JWT 的对象，作为成功登录的响应。

  需要注意的是，这段代码中的 `bcrypt.compare` 被用于比较用户提供的密码和数据库中存储的哈希密码。
  这是因为通常情况下，用户密码在数据库中不应以明文形式存储，而应以哈希形式存储，以增加安全性。

*/

// `@Injectable()` 装饰器：这是 Nest.js 中的一个装饰器，用于标记这个类是一个可注入的服务
@Injectable()
// AuthService 类：这是一个认证服务类，负责处理用户注册和登录逻辑
export class AuthService {

  /*
    构造函数：接受两个参数：

    private usersRepository: UsersRepository：一个用于操作用户数据的仓库（repository）。
                             UsersRepository 可能是一个自定义的仓库，用于与用户相关的数据库操作。

    private jwtService: JwtService：用于生成和验证 JSON Web Tokens（JWT）的服务。
                                    它提供了一种在客户端和服务器之间安全地传输信息的方式。
  */
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  
  // signUp 方法：用于注册新用户。它接受一个包含用户名和密码的 authCredentialsDto 对象作为参数，并使用 usersRepository 来创建新用户
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  // signIn 方法：用于用户登录。它接受一个包含用户名和密码的 authCredentialsDto 对象作为参数，并通过 usersRepository 查找用户。
  // 如果找到了用户并且密码匹配，则生成一个 JWT 并返回包含 JWT 的对象，否则抛出未经授权的异常。
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {

    // 首先，它从 authCredentialsDto 中提取用户名和密码。
    const { username, password } = authCredentialsDto;
    // 然后，它使用用户名在数据库中查找用户记录
    const user = await this.usersRepository.findOne({ username });

    // 如果找到用户并且密码与数据库中存储的哈希密码匹配，它将生成一个 JWT。JWT 的 payload 部分包含用户名
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);

      // 最后，它返回一个包含 JWT 的对象，作为成功登录的响应
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
