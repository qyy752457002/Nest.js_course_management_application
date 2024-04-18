import { Task } from '../tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity() // 将该类标记为一个 TypeORM 实体
export class User {

  @PrimaryGeneratedColumn('uuid') // 声明 id 作为主键，并生成 UUID
  id: string; // 用户的唯一标识符

  @Column({ unique: true }) // 将 username 列设置为唯一的
  username: string; 

  @Column() // 将 username 列设置为唯一的
  password: string;

  /*
    @OneToMany() 装饰器定义了一个一对多的关系，表示一个用户可以拥有多个任务：
    在这里，User 实体与 Task 实体之间建立了一对多的关系。
  */

  /*
    - (_type) => Task 是指明关系的另一端是 Task 类型。
    - (task) => task.user 指明了在 Task 实体中用于表示与 User 实体之间关系的属性，即 Task 实体中的 user 属性
    - { eager: true } 表示在加载用户实体时，相关的任务也会被自动加载，这种加载方式被称为 "eager loading"，可以避免懒加载的性能问题
  */
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[]; // 声明了一个名为 tasks 的属性，它是一个 Task 类型的数组，用于存储与用户相关联的任务
}
