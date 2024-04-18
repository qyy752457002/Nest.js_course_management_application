// 定义JWT有效载荷接口，用于指定JWT令牌中包含的信息
export interface JwtPayload {
  // 用户名字段，表示JWT令牌所属的用户
  username: string;
}

