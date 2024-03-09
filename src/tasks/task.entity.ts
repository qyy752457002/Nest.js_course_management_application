import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

// TypeORM库，它是一个用于在Node.js和TypeScript中操作关系型数据库的ORM（对象关系映射）工具
@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  /*
    @ManyToOne((_type) => User, (user) => user.tasks, { eager: false }): 这是一个装饰器，用于指定实体之间的多对一关系。具体来说：

      @ManyToOne: 表示这是一个多对一关系，即多个任务对应一个用户。

      (_type) => User: 这是关联实体的类型，指定了多对一关系中的"一"端是什么类型。
      在这里，它指定了关联的实体类型是 User。
      (user) => user.tasks: 这是一个函数，指定了关系的反向关联。

      它告诉 ORM 如何在 User 实体中找到与当前实体相关的任务。
      具体来说，它表示 User 实体中有一个名为 tasks 的属性，该属性表示与当前任务相关联的用户。

      { eager: false }: 这是一个选项，指定了加载策略。
      在这里，eager: false 表示关联的用户不会在加载当前实体时被自动加载，而是按需加载。
  */

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
