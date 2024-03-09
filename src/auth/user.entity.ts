import { Task } from '../tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

/*
  这段代码是使用TypeORM库来定义一个用户（User）实体的 TypeScript 类。
  TypeORM 是一个流行的对象关系映射（ORM）库，用于在 Node.js 等 JavaScript/TypeScript 应用程序中管理数据库。
*/

// @Entity() 是一个装饰器，用于将 TypeScript 类标记为 TypeORM 实体。这表示该类将映射到数据库中的一个表
@Entity()
// export class User 定义了一个名为 User 的类，用于表示用户实体
export class User {
  // @PrimaryGeneratedColumn('uuid') 是另一个装饰器，用于定义主键列，它生成唯一的 UUID 值作为主键
  @PrimaryGeneratedColumn('uuid')
  // id: string; 声明了一个名为 id 的属性，它是一个字符串，用于存储用户的唯一标识符。
  id: string;

  // @Column({ unique: true }) 装饰器用于定义数据库表中的列，并指定该列的属性。
  // 在这里，username 列被定义为一个字符串，并且在数据库中是唯一的，意味着两个用户不能拥有相同的用户名。
  @Column({ unique: true })
  // username: string; 声明了一个名为 username 的属性，用于存储用户的用户名。
  username: string;

  // 这里使用 @Column() 装饰器定义了一个名为 password 的列，用于存储用户的密码
  @Column()
  // password: string; 声明了一个名为 password 的属性，它是一个字符串，用于存储用户的密码
  password: string;


  // @OneToMany() 装饰器定义了一个一对多的关系，表示一个用户可以拥有多个任务。在这里，User 实体与 Task 实体之间建立了一对多的关系。

  /*
    - (_type) => Task 是指明关系的另一端是 Task 类型。
    - (task) => task.user 指明了在 Task 实体中用于表示与 User 实体之间关系的属性，即 Task 实体中的 user 属性
    - { eager: true } 表示在加载用户实体时，相关的任务也会被自动加载，这种加载方式被称为 "eager loading"，可以避免懒加载的性能问题
    - tasks: Task[]; 声明了一个名为 tasks 的属性，它是一个 Task 类型的数组，用于存储与用户相关联的任务
  */
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
