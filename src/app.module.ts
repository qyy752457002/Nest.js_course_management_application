import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    // 导入配置模块并配置环境变量文件路径和验证模式
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),

    // 导入任务模块
    TasksModule,

    // 使用 TypeORM 连接数据库并进行配置
    TypeOrmModule.forRootAsync({
      // 引入 ConfigModule 以便注入 ConfigService
      imports: [ConfigModule],
      // 注入 ConfigService 以便获取配置信息
      inject: [ConfigService],
      // 使用工厂函数异步创建 TypeORM 配置
      useFactory: async (configService: ConfigService) => {
        // 检查是否为生产环境
        const isProduction = configService.get('STAGE') === 'prod';
        
        // 返回 TypeORM 配置对象
        return {
          ssl: isProduction, // 如果是生产环境，则启用 SSL
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres', // 使用 PostgreSQL 数据库
          autoLoadEntities: true, // 自动加载实体
          synchronize: true, // 同步数据库模式
          host: configService.get('DB_HOST'), // 获取数据库主机
          port: configService.get('DB_PORT'), // 获取数据库端口
          username: configService.get('DB_USERNAME'), // 获取数据库用户名
          password: configService.get('DB_PASSWORD'), // 获取数据库密码
          database: configService.get('DB_DATABASE'), // 获取数据库名称
        };
      },
    }),

    // 导入身份验证模块
    AuthModule,
  ],
})
export class AppModule {} 


