import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

// AuthService负责处理认证相关的逻辑
@Injectable()
export class AuthService {

  constructor(
    // 注入用户仓库依赖，用于操作用户数据
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    // 注入JWT服务依赖，用于生成和验证JWT令牌
    private jwtService: JwtService,
  ) {}

  // 用户注册逻辑，接收认证凭据DTO，并将其传递给用户仓库进行创建
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  // 用户登录逻辑，接收认证凭据DTO，并验证用户身份
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    // 从认证凭据DTO中提取用户名和密码
    const { username, password } = authCredentialsDto;

    // 在用户仓库中查找用户名对应的用户
    const user = await this.usersRepository.findOne({ username });

    // 如果用户存在且密码匹配，则生成访问令牌
    if (user && (await bcrypt.compare(password, user.password))) {

      /*
        payload的数据类型被指定为JwtPayload，
        这意味着payload变量中的数据将符合JwtPayload接口所定义的形状。

        在TypeScript中，这种语法被称为“类型断言”，
        它告诉编译器将payload视为JwtPayload类型，从而进行类型检查和代码提示。
      */

      // 构造JWT载荷对象，仅包含用户名
      const payload: JwtPayload = { username };
      // 使用JWT服务签发令牌
      const accessToken: string = await this.jwtService.sign(payload);

      // 返回包含访问令牌的对象
      return { accessToken };
    } else {
      // 若用户不存在或密码不匹配，则抛出未经授权的异常
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
