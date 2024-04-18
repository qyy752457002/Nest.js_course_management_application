import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// 创建一个认证凭据的数据传输对象类
export class AuthCredentialsDto {

  // 用于验证用户名是否为字符串类型，长度在4到20之间
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  // 用于验证密码是否为字符串类型，长度在8到32之间，并且符合指定的正则表达式
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  // 正则表达式用于验证密码强度，至少包含一个数字或特殊字符，一个大写字母，一个小写字母
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak', // 若不符合正则表达式要求，则返回自定义消息提示
  })
  password: string;
}

