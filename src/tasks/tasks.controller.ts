import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';

// @Controller('tasks'): 这个装饰器指定了控制器的路由前缀为 '/tasks'，意味着这个控制器下的所有路由都以 '/tasks' 开头。
@Controller('tasks')
// @UseGuards(AuthGuard()): 这个装饰器应用了身份验证守卫 AuthGuard()，用于保护这个控制器的所有路由，要求用户在访问这些路由时进行身份验证。
@UseGuards(AuthGuard())
export class TasksController {

  /*
    private: 这是一个访问修饰符，表示 logger 成员是私有的，只能在当前类内部访问，外部无法直接访问它。

    logger: 这是一个类的成员变量，它在类中被声明并且被赋值。

    = new Logger('TasksController'): 这部分代码是一个赋值语句，它创建了一个新的 Logger 实例，并将其赋值给 logger 成员变量。
                                     Logger 可能是一个自定义的日志记录器类，被用来记录特定的类或模块的日志信息。
                                     在这里，它的构造函数被调用，参数 'TasksController' 可能是用来标识当前的日志记录器实例。

    总体而言，这行代码声明了一个私有成员变量 logger，并将其初始化为一个新的 Logger 实例，这个实例可能用于记录当前类或模块的日志信息。

  */
  private logger = new Logger('TasksController');

  /*

    这行代码做了以下几件事情：

    1. `constructor`: 这是 TypeScript 类的构造函数。构造函数在类实例化时被调用，用于初始化类的实例。

    2. `private tasksService: TasksService`: 这是构造函数的参数声明。在这里，`tasksService` 是一个类的成员变量，它被声明为私有的。
                                            `TasksService` 可能是一个服务类，用于处理任务相关的业务逻辑。

    3. `private`: 这是一个访问修饰符，表示 `tasksService` 成员是私有的，只能在当前类内部访问，外部无法直接访问它。

    4. `TasksService`: 这是参数 `tasksService` 的类型。它指定了 `tasksService` 参数的类型为 `TasksService` 类型。

    所以，这行代码定义了一个构造函数，它接受一个 `TasksService` 类型的参数，
    并将其赋值给当前类的私有成员变量 `tasksService`。

    这种方式通常用于依赖注入，
    其中当前类依赖于 `TasksService` 类的实例，
    在类的实例化时通过构造函数将依赖的服务注入到当前类中。

  */
  constructor(private tasksService: TasksService) {}

  /*
      这段代码是一个 NestJS 控制器中的一个方法。以下是对代码的解释：

    1. `@Get()`：这是一个装饰器，表示这个方法是处理 HTTP GET 请求的路由处理器。

    2. `getTasks()` 方法：这是一个用于获取任务列表的方法。

    3. 参数：

      - `@Query() filterDto: GetTasksFilterDto`：通过 `@Query()` 装饰器将 HTTP 请求中的查询参数映射到 `filterDto` 对象中。
                                                `GetTasksFilterDto` 是一个数据传输对象（DTO），用于包含查询参数的结构化数据。
      
      - `@GetUser() user: User`：通过 `@GetUser()` 装饰器来获取当前用户的信息。
                                  这个装饰器可能是通过中间件或者自定义装饰器实现的，用于从请求中提取用户信息。
      
    4. 方法体：在方法体内部执行以下操作：

      - 使用 `logger.verbose()` 方法记录一条日志，描述用户正在检索所有任务的操作。
        日志中包含了用户的用户名和查询参数。
      
      - 调用 `tasksService.getTasks(filterDto, user)` 方法，将查询参数和用户信息传递给服务层处理。
          然后返回服务层返回的结果，这里期望返回一个任务列表（`Task[]`）的 Promise 对象。

    总体来说，这段代码描述了一个用于处理 HTTP GET 请求的控制器方法，
    它从查询参数中获取过滤条件，
    同时也获取了当前用户的信息，并记录了一条日志。

    然后，它将过滤条件和用户信息传递给服务层处理，并返回结果。

  */

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );

    return this.tasksService.getTasks(filterDto, user);
  }

  /*
    这段代码是一个基于某种框架（可能是Node.js中的Express、NestJS等）的路由处理器中的一个方法。让我们来解释一下：

    1. `@Get('/:id')`: 这是一个装饰器（Decorator），通常用于标记一个方法为一个特定的 HTTP 请求方法的处理器。

                       在这种情况下，`@Get` 表示这个方法处理 HTTP GET 请求。`('/:id')` 是路由路径的一部分，
                       表示这个方法可以处理的 URL 路径，其中 `:id` 是一个动态参数，可以在路径中提取出来作为参数使用。

    2. `getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task>`: 这是方法的签名。

        `getTaskById` 是方法的名称。
        
        `@Param('id') id: string` 表示 `id` 是通过路由参数传递的，装饰器 `@Param('id')` 用于从路由中提取参数值。
        `@GetUser()` 似乎是一个自定义的装饰器，用于从请求中获取用户信息，`user: User` 则是一个用户对象。
         方法返回一个 `Promise`，在这个 `Promise` 中包含了一个 `Task` 对象。

    3. `return this.tasksService.getTaskById(id, user);`: 这行代码调用了一个名为 `getTaskById` 的方法，它接受两个参数：`id` 和 `user`。

                                                          这些参数将被传递给 `tasksService` 的 `getTaskById` 方法，
                                                          该方法根据提供的 `id` 和 `user` 返回一个 `Task` 对象。

        综上所述，这段代码表示一个处理 HTTP GET 请求的方法，
        用于获取特定 ID 的任务，并且要求用户信息，
        最后通过服务层（`tasksService`）处理并返回任务信息。
  */

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  /*
    这段代码看起来是一个基于某种框架（可能是Node.js中的Express.js或者Nest.js）的后端控制器方法，用于处理创建任务的HTTP POST请求。

    让我们逐行解释代码：

    1. `@Post()`：这是一个装饰器，可能来自于Nest.js框架，用于指示这个方法要处理HTTP POST请求。
                  这意味着这个方法将在收到POST请求时被调用。

    2. `createTask()`：这是方法的名称，用于创建任务。

    3. `@Body() createTaskDto: CreateTaskDto`：`@Body()` 装饰器用于从HTTP请求的主体中提取数据。
                                                `createTaskDto` 参数可能是一个用于创建任务的数据传输对象（DTO）。
                                                DTO 是一个包含了创建任务所需数据的对象。

    4. `@GetUser() user: User`：`@GetUser()` 装饰器可能是自定义的，用于从请求中获取当前用户的信息。
                                `user` 参数被假定为一个 `User` 对象，表示当前用户。

    5. `Promise<Task>`：这个方法返回一个 `Promise`，在异步操作完成后会返回一个 `Task` 对象。

    6. `this.logger.verbose()`：这是一个记录日志的方法调用，用于记录创建任务的详细信息，包括用户名称和任务数据。

    7. `return this.tasksService.createTask(createTaskDto, user);`：这行代码调用了一个名为 `createTask()` 的服务（可能是一个 `TasksService` 类的方法），
                                                                    并将 `createTaskDto` 和 `user` 作为参数传递给它。
                                                                    然后返回 `createTask()` 方法的返回值，这应该是一个 `Promise<Task>`。

    总体而言，这段代码是一个处理创建任务的后端控制器方法，它从HTTP请求中获取任务数据和当前用户信息，记录日志，并调用服务来创建新的任务。

  */

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  /*

    这段代码是一个用于处理删除任务的后端控制器方法，可能是在 Nest.js 或者类似的框架下使用的。让我们逐行解释代码：

    1. `@Delete('/:id')`：这是一个装饰器，用于指示这个方法要处理 HTTP DELETE 请求，
                          并且定义了路由路径为 `/:id`。`:id` 是一个动态参数，用于接收要删除的任务的唯一标识符。

    2. `deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void>`：这是方法的签名。

      `@Param('id') id: string` 表示从路由参数中获取名为 `id` 的参数，并将其作为字符串传递给方法。
      `@GetUser() user: User` 表示通过某种方式获取当前用户的信息，并将其传递给方法。
      这可能是通过一个自定义的装饰器 `@GetUser()` 来实现的。
      该方法返回一个 `Promise<void>`，表示没有返回值，即删除任务后不返回任何数据。

    3. `return this.tasksService.deleteTask(id, user);`：

      这行代码调用了一个名为 `deleteTask()` 的服务方法，并传递了任务的 `id` 和当前用户信息作为参数。
      然后返回了 `deleteTask()` 方法的返回值，这应该是一个 `Promise<void>`。

    总体来说，这段代码是一个用于处理删除任务的后端控制器方法。
    它从路由参数中获取任务的唯一标识符和当前用户信息，然后调用服务来执行任务的删除操作。

  */

  @Delete('/:id')
  deleteTask(@Param('id') id: string, 
            @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  /*

    这段代码是一个基于 Nest.js 的控制器方法或路由处理程序，用于更新任务的状态。

    让我们逐行解释这段代码：

    1. `@Patch('/:id/status')`: 这是一个HTTP请求处理装饰器，指定了处理HTTP PATCH请求的路由路径，其中`:id`是一个占位符，表示动态的任务ID。
                                该路由处理程序将处理形如 `PATCH /task/:id/status` 的请求。

    2. `updateTaskStatus(`: 这是路由处理程序的方法名称或函数名，它接受三个参数：

        - `@Param('id') id: string`: 这是一个通过路由参数传递的任务ID，它将被解析为一个字符串，并且可以在函数体内使用。
        
        - `@Body() updateTaskStatusDto: UpdateTaskStatusDto`: 这是通过请求体传递的数据对象，
                                                              通常是一个DTO（Data Transfer Object）类型，
                                                              包含了需要更新的任务状态信息，例如新的状态值等。
        
        - `@GetUser() user: User`: 这可能是一个自定义的装饰器，
                                   用于从请求中提取用户信息。`User` 可能是一个用户对象，
                                   其中包含了关于用户的信息，如用户名、ID等。

    3. `): Promise<Task> {`: 这表示函数将返回一个 `Promise`，该 `Promise` 的解析值将是一个 `Task` 类型的对象，表明更新任务状态后的任务对象。

    4. 函数体内部执行了以下操作：

        - 从 `updateTaskStatusDto` 中解构出 `status` 字段，表示要更新的任务状态。
        
        - 调用 `this.tasksService.updateTaskStatus(id, status, user)` 方法，
          将任务ID、状态以及用户信息传递给任务服务（`tasksService`）的 `updateTaskStatus` 方法，
          该方法用于实际更新任务状态。

    总之，这段代码描述了一个处理更新任务状态请求的路由处理程序，
    它从路由参数、请求体和用户信息中获取必要的数据，
    然后通过任务服务更新任务的状态，并返回更新后的任务对象。
  */

  @Patch('/:id/status')
  updateTaskStatus(
    // 来自路由参数
    @Param('id') id: string,
    // 通过请求体传递的数据对象
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    // 从请求中提取用户信息
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
