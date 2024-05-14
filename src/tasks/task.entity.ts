import { Exclude } from 'class-transformer'; // 引入 Exclude 装饰器，用于排除属性的转换，用于序列化（serialization）或反序列化（deserialization）对象时的控制
import { User } from '../auth/user.entity'; // 引入用户实体
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'; // 引入 TypeORM 中的装饰器和实体
import { TaskStatus } from './task-status.enum'; // 引入任务状态枚举

@Entity() // 将此类标记为 TypeORM 实体
export class Task {
  @PrimaryGeneratedColumn('uuid') // 指定主键为 UUID 类型，并且自动生成
  id: string; // 任务的唯一标识符

  @Column() // 将属性映射到数据库表的列
  title: string; // 任务标题

  @Column() // 将属性映射到数据库表的列
  description: string; // 任务描述

  @Column() // 将属性映射到数据库表的列
  status: TaskStatus; // 任务状态，使用 TaskStatus 枚举类型

  /*
    @ManyToOne: 表示这是一个多对一关系，即多个任务对应一个用户：

      (_type) => User: 这是关联实体的类型，指定了多对一关系中的"一"端是什么类型。
      在这里，它指定了关联的实体类型是 User。
      (user) => user.tasks: 这是一个函数，指定了关系的反向关联。

      它告诉 ORM 如何在 User 实体中找到与当前实体相关的任务。
      具体来说，它表示 User 实体中有一个名为 tasks 的属性，该属性表示与当前任务相关联的用户。

      { eager: false }: 这是一个选项，指定了加载策略。
      在这里，eager: false 表示关联的用户不会在加载当前实体时被自动加载，而是按需加载。
  */

  /*
    Exclude 装饰器来自于 class-transformer 库，它的作用是用于控制对象的转换行为。
    
    在这个特定的代码片段中，Exclude 装饰器被用来排除在将 Task 实例转换为普通对象时，不包含 user 属性。

    在 TypeORM 中，通常我们将实体对象映射到数据库表中，并在需要时进行对象之间的关联查询。

    但是，有时我们需要将实体对象转换为普通对象，比如在将对象传递给 API 响应时。

    在这种情况下，我们可能不希望包含某些属性，比如敏感信息或者不必要的信息。

    这时候就可以使用 Exclude 装饰器。

    在这个例子中，Exclude({ toPlainOnly: true }) 意味着只有在将 Task 对象转换为普通对象时才会排除 user 属性。

    当你从 Nest.js 的 REST API 返回响应给客户端时，user 属性不会包含在响应的数据中。

    这样做的目的可能是为了在 API 响应中隐藏用户信息，
    只返回任务的基本信息而不包含用户信息，以增强安全性或者减少数据传输量。
  */

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false }) // 多对一关系装饰器，关联到 User 实体，指定反向关联属性为 user.tasks，并设置按需加载
  @Exclude({ toPlainOnly: true }) // 使用 Exclude 装饰器排除该属性在转换成普通对象时
  user: User; // 任务的拥有者，关联到 User 实体
}

