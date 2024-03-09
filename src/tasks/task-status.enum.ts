/*
  这段代码定义了一个 TypeScript 枚举 `TaskStatus`，它描述了任务可能的不同状态。

  - `enum TaskStatus { }`: 这是 TypeScript 中定义枚举的语法，它创建了一个名为 `TaskStatus` 的枚举类型。

  - `OPEN = 'OPEN', IN_PROGRESS = 'IN_PROGRESS', DONE = 'DONE'`: 这些是枚举的成员。
    每个成员都有一个关联的值，这里的值是字符串。
    枚举成员的名称是大写的，通常表示这些是常量值。
    在这个枚举中，定义了三个状态：`OPEN`、`IN_PROGRESS` 和 `DONE`，它们分别表示任务的不同阶段或状态。

  枚举在编程中通常用于表示一组相关的常量值，例如状态、类型、选项等。在这个例子中，`TaskStatus` 枚举用于指定任务可能的不同状态，
  以便在应用程序中对任务进行状态管理和识别。
*/

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
