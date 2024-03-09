import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

/*

  这段代码是一个 Nest.js 模块装饰器，用于定义一个名为 `TasksModule` 的模块。

  让我解释每个部分的作用：

  1. `@Module({})` 装饰器：指定了这是一个 Nest.js 模块。
                          装饰器接收一个对象作为参数，其中包含了模块的配置信息。

  2. `imports` 属性：指定了当前模块所依赖的其他模块。在这里，使用了 `TypeOrmModule.forFeature([TasksRepository])` 来导入 `TasksRepository`，
                    这样 `TasksRepository` 就可以在当前模块中被注入和使用。另外，还导入了 `AuthModule`，说明当前模块依赖于认证模块。

  3. `controllers` 属性：指定了当前模块中所包含的控制器。这里指定了 `TasksController` 控制器，用于处理与任务相关的 HTTP 请求。

  4. `providers` 属性：指定了当前模块中所包含的提供者。这里指定了 `TasksService` 服务类，用于处理与任务相关的业务逻辑。

  通过将相关的控制器、服务、以及依赖的其他模块组合在一起，`TasksModule` 模块提供了一种组织应用程序代码的方式，使得代码结构更加清晰和模块化。

*/

@Module({
  imports: [TypeOrmModule.forFeature([TasksRepository]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
