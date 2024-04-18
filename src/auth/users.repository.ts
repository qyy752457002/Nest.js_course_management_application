import {
  ConflictException, // 引入冲突异常类
  InternalServerErrorException, // 引入内部服务器错误异常类
} from '@nestjs/common'; // 从nestjs/common模块中引入异常类
import { EntityRepository, Repository } from 'typeorm'; // 从typeorm模块中引入实体仓库和仓库类
import { AuthCredentialsDto } from './dto/auth-credentials.dto'; // 引入身份验证凭据数据传输对象
import { User } from './user.entity'; // 引入用户实体类
import * as bcrypt from 'bcrypt'; // 引入bcrypt模块用于密码哈希

// 指定的实体（User）与自定义的存储库相关联，使我们能够通过存储库对象方便地执行数据库操作
@EntityRepository(User)
export class UsersRepository extends Repository<User> { // 用户仓库类继承自typeorm的仓库类，并指定实体类型为User

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> { // 创建用户的异步方法，接收身份验证凭据数据传输对象，返回空值

    const { username, password } = authCredentialsDto; // 从身份验证凭据DTO中提取用户名和密码

    const salt = await bcrypt.genSalt(); // 使用bcrypt生成盐
    const hashedPassword = await bcrypt.hash(password, salt); // 使用bcrypt对密码进行哈希处理

    const user = this.create({ username, password: hashedPassword }); // 创建用户实体对象，将哈希后的密码存储

    try {
      await this.save(user); // 尝试保存用户实体到数据库
    } catch (error) {
      if (error.code === '23505') {
        // 如果捕获到唯一约束错误
        throw new ConflictException('Username already exists'); // 抛出冲突异常，提示用户名已存在
      } else {
        throw new InternalServerErrorException(); // 否则抛出内部服务器错误异常
      }
    }
  }
}

