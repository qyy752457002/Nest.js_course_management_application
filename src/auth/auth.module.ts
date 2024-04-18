import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

// AuthModule负责整合认证相关的组件
@Module({
  imports: [

    // 导入配置模块，用于获取JWT密钥等配置信息
    ConfigModule,

    // 导入Passport模块，用于实现认证策略
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 导入JWT模块，用于生成和验证JWT令牌
    JwtModule.registerAsync({
      imports: [ConfigModule], // 引入配置模块
      inject: [ConfigService], // 注入ConfigService依赖
      // 异步工厂函数，返回JWT模块的配置对象
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // 获取JWT密钥
        signOptions: {
          expiresIn: 3600, // 设置JWT过期时间为3600秒
        },
      }),
    }),
   
    // 导入TypeORM模块，用于操作数据库
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  
  // 声明AuthModule的提供者
  providers: [AuthService, JwtStrategy],

  // 声明AuthModule的控制器
  controllers: [AuthController],

  // 将JwtStrategy和PassportModule导出，使其他模块可以访问
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
