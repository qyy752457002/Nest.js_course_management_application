import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

// 这里定义了一个名为 UsersRepository 的类，它扩展了 TypeORM 中的 Repository<User> 类，该类允许执行与数据库实体相关的各种操作。
@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  // createUser 是一个异步方法，它接受一个名为 authCredentialsDto 的参数，类型为 AuthCredentialsDto。它的目的是创建新用户。
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {

    // 这里从传入的 authCredentialsDto 中解构出 username 和 password。
    const { username, password } = authCredentialsDto;

    // 使用 bcrypt 库生成密码的哈希值。
    // 首先，调用 bcrypt.genSalt() 方法生成一个盐（salt），然后使用盐对密码进行哈希处理，得到哈希密码（hashedPassword）。
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建一个新的用户实例，该实例包含用户名和经过哈希处理的密码。
    const user = this.create({ username, password: hashedPassword });

    /*
      尝试将用户保存到数据库中。

      如果保存过程中出现错误，这里通过捕获异常来处理。

      如果错误的代码是 '23505'，
      这表示唯一约束冲突（比如尝试插入重复的用户名), 
      则抛出一个 ConflictException 异常，指示用户名已经存在。
      如果是其他类型的错误，则抛出一个 InternalServerErrorException 异常，表示服务器内部发生了错误。

      这就是这段代码的主要功能和逻辑。

      它负责从传入的认证凭据信息中创建用户，
      对密码进行哈希处理，
      并将用户保存到数据库中，
      同时处理可能发生的错误情况。
    */

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

// 这就是这段代码的主要功能和逻辑。它负责从传入的认证凭据信息中创建用户，对密码进行哈希处理，并将用户保存到数据库中，同时处理可能发生的错误情况。