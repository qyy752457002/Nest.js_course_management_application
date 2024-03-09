import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 这段代码是一个 NestJS 模块的定义，主要用于身份验证（Authentication）

// @Module({ ... })：这是一个 NestJS 模块的装饰器，用于定义一个模块
@Module({
  imports: [
    // ConfigModule：配置模块，用于管理应用程序的配置信息
    ConfigModule,
    // PassportModule.register({ defaultStrategy: 'jwt' })：Passport 模块的注册，指定了默认的身份验证策略为 JWT 策略
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({ ... })：异步注册 JWT 模块，这里使用 useFactory 方式根据配置创建 JWT 模块所需的选项
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    // TypeOrmModule.forFeature([UsersRepository])：TypeORM 模块的注册，导入了 UsersRepository 实体以便在该模块中使用数据库操作
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  
  /*
    providers: [...]：这里列出了当前模块所提供的服务（providers）列表：

    - AuthService：身份验证服务，用于处理用户的身份验证逻辑。
    - JwtStrategy：JWT 策略，用于实现 JWT 的验证逻辑。
  */
  providers: [AuthService, JwtStrategy],

  /*
    controllers: [...]：这里列出了当前模块所包含的控制器（controllers）列表：

    - AuthController：身份验证控制器，包含处理身份验证相关请求的路由处理器。
  */
  controllers: [AuthController],

  /*
    exports: [...]：这里列出了当前模块要导出的提供者（providers）列表，使得其他模块可以使用这些提供者：

    - JwtStrategy：导出了 JWT 策略，以便其他模块可以使用它来保护路由或进行身份验证。

    - PassportModule：导出了 Passport 模块，以便其他模块可以使用 Passport 提供的身份验证功能。
  */
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
