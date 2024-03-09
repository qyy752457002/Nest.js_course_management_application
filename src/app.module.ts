import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

// 这是 NestJS 中用来定义模块的装饰器。
// 模块是应用程序的基本组织单元，它将一组相关的组件、控制器、服务和其他模块组合在一起
@Module({
  // imports: [...]: 在模块中导入其他模块。
  // 在这个例子中，它导入了三个模块：ConfigModule、TasksModule 和 AuthModule。
  imports: [
    /*
      这是一个由 NestJS 提供的配置模块。.forRoot() 方法用于配置全局模块。
      在这里，它加载了一个环境特定的配置文件（.env.stage.${process.env.STAGE}）和配置验证模式（configValidationSchema）。
    */
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    // 一个自定义的模块，它被导入到主模块中
    TasksModule,
    /*
      这是用于配置 TypeORM 数据库连接的模块。
      它通过 forRootAsync 方法进行配置，因为它依赖于异步操作。
      在这里，它使用了异步工厂函数来动态地配置数据库连接
    */
    TypeOrmModule.forRootAsync({
      // 导入了 ConfigModule，因为我们将使用 ConfigService 来获取配置参数
      imports: [ConfigModule],
      // 将 ConfigService 注入到工厂函数中，以便在工厂函数中使用
      inject: [ConfigService],
      // 定义了一个异步工厂函数，它接受 ConfigService 作为参数，并返回 TypeORM 的配置对象
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        
        /*
          ssl 和 extra.ssl: 这些选项用于配置数据库连接的 SSL 选项。
          
          如果环境是生产环境，SSL 将被启用，并且额外的 SSL 配置会被设置为 { rejectUnauthorized: false }，以忽略不受信任的 SSL 证书。

          type, autoLoadEntities, synchronize, host, port, username, password, database: 这些都是 TypeORM 的连接配置参数，它们从 ConfigService 中获取相应的值。

        */
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        };
      },
    }),

    //  另一个自定义的模块，它被导入到主模块中
    AuthModule,
  ],
})

export class AppModule {}

// 这样，AppModule 就是 NestJS 应用程序的主模块，它负责组织和配置应用程序中的不同功能模块和服务
