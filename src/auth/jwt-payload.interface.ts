// 这段代码是一个 TypeScript 接口的定义，定义了一个名为 JwtPayload 的接口

/*

  export: 这个关键字表示该接口可以被其他模块导入和使用。通过将接口导出，其他模块可以引用该接口并使用它定义的数据结构。

  interface JwtPayload: 这一行定义了一个名为 JwtPayload 的接口。
                        接口是 TypeScript 中用来描述对象的形状的一种方式。
                        在这个接口中，我们描述了一个 JWT 载荷（Payload），即 JWT 中存储的数据结构。

  { username: string; }: 在接口内部，我们定义了一个属性 username，它的类型是 string。
                         这意味着在 JWT 载荷中，必须包含一个 username 属性，并且其值的类型必须是字符串类型。

  总结：这段代码定义了一个 TypeScript 接口 JwtPayload，
  该接口描述了 JWT 载荷的结构，
  其中包含一个 username 属性，
  用于存储用户的用户名信息。

*/

export interface JwtPayload {
  username: string;
}
