import { ValidationPipe } from '@nestjs/common'; // 用于验证输入数据的管道，来自 @nestjs/common
import { NestFactory } from '@nestjs/core'; //  Nest.js 的工厂类，用于创建 Nest 应用实例
import { AppModule } from './app.module'; // 应用程序的主模块，定义了应用程序的结构和依赖关系
import { TransformInterceptor } from './transform.interceptor'; // 自定义的拦截器，用于转换响应数据
import { Logger } from '@nestjs/common'; // 用于日志记录的 Nest.js 内置模块

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
  // 通过 process.env.PORT 获取应用程序的端口号
  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
