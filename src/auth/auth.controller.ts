import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

// 这段代码是一个基于NestJS框架的身份认证模块

// 这里定义了一个控制器 AuthController，使用 @Controller('auth') 装饰器指定了该控制器的基础路径为 /auth。
@Controller('auth')
export class AuthController {
  // 在构造函数中注入了一个 AuthService 的实例，用于处理身份认证逻辑。
  constructor(private authService: AuthService) {}

  /*
    这是一个 POST 请求的处理器，处理路径为 /auth/signup 的请求。
    它接受一个 authCredentialsDto 对象作为参数，该对象包含用户的身份认证凭据，例如用户名和密码。
    然后调用 AuthService 的 signUp 方法来完成用户注册的逻辑。
  */
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  /*
    这是另一个 POST 请求的处理器，处理路径为 /auth/signin 的请求。
    它也接受一个 authCredentialsDto 对象作为参数，该对象包含用户的身份认证凭据。
    然后调用 AuthService 的 signIn 方法来完成用户登录的逻辑，并返回一个包含访问令牌的 Promise 对象。
  */
  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
