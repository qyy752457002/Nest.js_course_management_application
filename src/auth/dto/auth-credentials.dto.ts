import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// 这段源代码是使用 TypeScript 编写的一个类 AuthCredentialsDto，它似乎是用于认证用户的数据传输对象（DTO）

// AuthCredentialsDto 类: 这个类是一个数据传输对象，用于在应用程序的不同部分传递认证凭据
export class AuthCredentialsDto {
  // @IsString(): 这是一个装饰器，通常用于验证输入的类型是否为字符串。
  @IsString()
  // @MinLength(4) 和 @MaxLength(20): 这些是用来验证字符串长度的装饰器，指定了 username 字段的最小和最大长度为 4 和 20。
  @MinLength(4)
  @MaxLength(20)
  // username: string;: 这是一个成员变量声明，用于存储用户名。
  username: string;

  // @IsString(), @MinLength(8), @MaxLength(32): 类似于上面的装饰器，用于验证 password 字段的类型和长度。最小长度为 8，最大长度为 32。
  @IsString()
  @MinLength(8)
  @MaxLength(32)

  /*
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password is too weak' }): 这是一个用于验证密码复杂度的装饰器。

    它使用正则表达式来确保密码至少包含一个大写字母、一个小写字母、一个数字或特殊字符，
    并且长度在 8 到 32 之间。如果密码不符合要求，将返回指定的错误消息 "password is too weak"
  */
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}

// 总之，AuthCredentialsDto 类定义了一个数据传输对象，用于在应用程序中传递认证凭据，包括用户名和密码，并对它们的格式和长度进行了验证。
