import { ValidationPipe } from '@nestjs/common'; // 用于验证输入数据的管道，来自 @nestjs/common
import { NestFactory } from '@nestjs/core'; //  Nest.js 的工厂类，用于创建 Nest 应用实例
import { AppModule } from './app.module'; // 应用程序的主模块，定义了应用程序的结构和依赖关系
import { TransformInterceptor } from './transform.interceptor'; // 自定义的拦截器，用于转换响应数据
import { Logger } from '@nestjs/common'; // 用于日志记录的 Nest.js 内置模块
import { ConfigService } from '@nestjs/config'; // 导入 ConfigService 从 '@nestjs/config' 模块

async function bootstrap() {
  // 创建了一个新的 Logger 实例，用于记录应用程序的日志
  const logger = new Logger();
  // 使用 NestFactory.create() 创建了一个应用程序实例，该实例使用了 AppModule
  const app = await NestFactory.create(AppModule);
  // 启用了跨域资源共享 (CORS) 支持，允许从其他域名访问该 Nest.js 应用程序
  app.enableCors();
  // 将全局验证管道应用于应用程序，以确保对输入数据进行验证
  app.useGlobalPipes(new ValidationPipe());
  // 将全局拦截器应用于应用程序，以在响应数据中进行转换
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // 获取 ConfigService 实例
  const configService = app.get(ConfigService);

  /*
    运行不同的启动脚本时，ConfigModule 会根据 process.env.STAGE 的值加载相应的 .env 文件。

    取决于运行开发环境还是生产环境的脚本，读取正确的环境变量。

      ex.

      npm run start:dev 会加载 .env.stage.dev 文件。
      npm run start:prod 会加载 .env.stage.prod 文件。
  */

  // 读取环境变量 (默认3000），并将其注入到应用程序中
  const port = configService.get<number>('PORT') || 3000; // 获取端口号，默认为 3000
  await app.listen(port); // 监听应用端口
  logger.log(`Application listening on port ${port}`);
}

// 启动应用程序
bootstrap();
