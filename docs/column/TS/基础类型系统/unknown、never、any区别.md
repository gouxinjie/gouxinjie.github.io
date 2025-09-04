# TypeScript 中 unknown、never 与 any 的解析与区别

`TypeScript` 的类型系统中，`unknown`、`never` 和 `any` 是三个特殊的类型，它们在类型安全性上有着根本的不同。

## 一、核心区别总览

| 特性           | `any`                       | `unknown`                | `never`                           |
| -------------- | --------------------------- | ------------------------ | --------------------------------- |
| **类型安全性** | 最低（完全禁用类型检查）    | 最高（最安全的顶层类型） | 表示不可能存在的类型              |
| **可赋值性**   | 可赋给任何类型/接受任何类型 | 只能赋给 `any`/`unknown` | 不能赋给任何类型（除`never`本身） |
| **用途**       | 兼容旧代码/逃避类型检查     | 安全地处理不确定的类型   | 表示永不返回/不可能的情况         |

## 二、详细解析

### 1. `any` 类型 - 类型系统的逃生舱

**特点**：

- 完全绕过类型检查
- 可以赋值给任何类型
- 可以从任何类型接收值
- 允许访问任意属性/方法

```typescript
let anything: any = "hello";
anything = 42; // OK
anything = true; // OK
anything.methodThatDoesntExist(); // 编译通过，运行时可能出错
```

**使用场景**：

- 迁移 `JavaScript` 代码到 `TypeScript` 的过渡期
- 确实无法确定类型的外部数据
- 需要快速原型开发时（但应尽快替换为具体类型）

**问题**：

```typescript
function add(a: any, b: any): any {
  return a + b;
}

add(1, 2); // 3
add(1, "2"); // "12" (可能非预期)
add({}, null); // "[object Object]null" (完全无类型保护)
```

### 2. `unknown` 类型 - 类型安全的 any

**特点**：

- 仍然表示任何值，但更安全
- 不能直接操作，必须先进行类型检查或断言
- 是所有类型的超类型（类似 any）
- 只能赋值给 `any` 或 `unknown`

```typescript
let uncertain: unknown = "hello";

// 以下操作都会报错：
uncertain.toUpperCase();
uncertain();
new uncertain();

// 必须先进行类型检查
if (typeof uncertain === "string") {
  uncertain.toUpperCase(); // OK
}
```

**使用场景**：

- 处理动态内容（如 `JSON` 解析结果）
- 函数参数的类型安全处理
- 替代 `any` 的安全选择

**正确用法**：

```typescript
function safeParse(json: string): unknown {
  return JSON.parse(json);
}

const result = safeParse('{"name":"Alice"}');
if (result && typeof result === "object" && "name" in result) {
  console.log(result.name); // 安全访问
}
```

### 3. `never` 类型 - 表示不可能

**特点**：

- 表示永远不会发生的值
- 是所有类型的子类型
- 不能有任何值赋给 never 类型
- 常用作函数的返回类型

```typescript
// 1. 抛出错误的函数
function error(message: string): never {
  throw new Error(message);
}

// 2. 无限循环
function infiniteLoop(): never {
  while (true) {}
}

// 3. 类型收窄后的不可能分支
type Shape = Circle | Square;
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape; // 确保所有情况都被处理
      return _exhaustiveCheck;
  }
}
```

**使用场景**：

- 表示永远不会返回的函数
- 类型收窄的完整性检查
- 表示空集合（如空数组的类型 `const emptyArray: never[] = []`）

## 三、对比示例

### 1. 赋值兼容性

```typescript
let a: any;
let u: unknown;
let n: never;

a = u; // OK
a = n; // OK

u = a; // OK
u = n; // OK

n = a; // Error
n = u; // Error
n = (() => {
  throw new Error();
})(); // OK (因为返回never)
```

### 2. 函数参数处理

```typescript
function acceptAny(x: any) {
  x.method(); // 不报错（危险！）
}

function acceptUnknown(x: unknown) {
  x.method(); // 错误：必须先检查类型
  if (typeof x === "object" && x !== null && "method" in x) {
    (x as { method: () => void }).method(); // 安全访问
  }
}

function acceptNever(x: never) {
  // 实际上无法调用此函数，因为没有值能符合never类型
}
```

## 四、类型层次结构

```
      unknown
       ↑
      any
       ↑
所有其他类型
       ↑
     never
```

- `unknown` 是类型安全的顶层类型
- `any` 既是顶层也是底层类型（破坏类型系统）
- `never` 是最底层类型

## 五、最佳实践指南

1. **避免使用 any**：

   - 使用 `@ts-ignore` 比 `any` 更好，因为它显式标记了例外
   - 逐步替换现有 `any` 为具体类型或 `unknown`

2. **优先使用 unknown** 处理动态数据：

   ```typescript
   function parseUser(input: unknown): User {
     if (isUser(input)) {
       // 使用类型守卫
       return input;
     }
     throw new Error("Invalid user data");
   }
   ```

3. **善用 never 进行穷尽检查**：

   ```typescript
   type Shape = Circle | Square | Triangle;

   function getArea(shape: Shape) {
     switch (shape.kind) {
       case "circle": /* ... */
       case "square": /* ... */
       default:
         // 如果添加了Triangle但忘记处理，这里会报错
         const _exhaustiveCheck: never = shape;
         throw new Error(`Unhandled shape: ${_exhaustiveCheck}`);
     }
   }
   ```

4. **类型收窄模式**：
   ```typescript
   function isStringArray(value: unknown): value is string[] {
     return Array.isArray(value) && value.every((item) => typeof item === "string");
   }
   ```

## 六、常见问题解答

**Q1: 什么时候应该用 any？** A1: 只有在以下情况考虑使用：

- 正在将 `JavaScript` 迁移到 `TypeScript`
- 与没有类型定义的第三方库交互
- 作为临时解决方案（应添加 TODO 注释）

**Q2: unknown 和 any 的性能有区别吗？** A2: 没有运行时性能差异，都是编译时类型。但 `unknown` 能带来更好的类型安全性。

**Q3: never 类型有什么实用价值？** A3: 主要价值在于：

- 确保 `switch-case/default` 的完整性
- 表示不可能出现的代码路径
- 定义不可能产生的空集合类型

**Q4: 如何将 unknown 转换为具体类型？** A4: 有几种安全方式：

1. 类型断言（当确定类型时）：
   ```typescript
   const value = someUnknown as string;
   ```
2. 类型守卫：
   ```typescript
   if (typeof value === "string") { ... }
   ```
3. 用户定义的类型守卫：
   ```typescript
   function isMyType(obj: unknown): obj is MyType { ... }
   ```

## 总结

- **`any`**：放弃类型检查，应尽量避免
- **`unknown`**：安全的"任何类型"，使用前必须验证
- **`never`**：表示不可能存在的值，用于高级类型控制
