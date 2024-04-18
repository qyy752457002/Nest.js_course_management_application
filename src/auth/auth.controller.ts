import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

// 控制器用于处理与认证相关的HTTP请求
@Controller('auth')
export class AuthController {

  // 在构造函数中注入AuthService依赖
  constructor(private authService: AuthService) {}

  // 处理用户注册的HTTP POST请求，接收AuthCredentialsDto作为请求体
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    // 调用AuthService的signUp方法，传递认证凭据DTO
    return this.authService.signUp(authCredentialsDto);
  }

  // 处理用户登录的HTTP POST请求，接收AuthCredentialsDto作为请求体
  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    // 调用AuthService的signIn方法，传递认证凭据DTO，并返回包含访问令牌的Promise
    return this.authService.signIn(authCredentialsDto);
  }
}

