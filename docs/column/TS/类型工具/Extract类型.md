# TypeScript 中的 `Extract` 类型详解

`Extract` 是 `TypeScript` 内置的一个实用工具类型`（Utility Type）`，它用于**从一个联合类型中提取可赋值给另一个类型的类型**，创建一个新的联合类型。

这与 `Exclude` 类型的功能正好相反，`Exclude` 是排除某些类型，而 `Extract` 是提取某些类型。

## 基本语法

```typescript
Extract<Type, Union>;
```

- `Type`：源类型，你想从中提取类型的联合类型
- `Union`：你想提取的类型或类型联合

## 基本示例

### 1. 简单使用

```typescript
type T = "a" | "b" | "c" | "d";

type Result = Extract<T, "a" | "c">;
// 等同于：'a' | 'c'

type Mixed = string | number | boolean | object;

type Primitive = Extract<Mixed, string | number | boolean>;
// 等同于：string | number | boolean
```

### 2. 提取兼容的类型

```typescript
type Shape = { kind: "circle"; radius: number } | { kind: "square"; size: number } | { kind: "rectangle"; width: number; height: number };

type RoundShape = Extract<Shape, { kind: "circle" }>;
// 等同于：{ kind: "circle"; radius: number }
```

## 实际应用场景

### 1. 提取特定事件类型

```typescript
type EventTypes = "click" | "scroll" | "keydown" | "mouseenter" | "focus";

type KeyboardEvents = Extract<EventTypes, "keydown" | "focus">;
// 等同于：'keydown' | 'focus'

function handleKeyboardEvent(event: KeyboardEvents) {
  // 专门处理键盘相关事件
}
```

### 2. 提取组件特定属性

```typescript
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
}

type ClickableProps = Extract<keyof ButtonProps, "onClick" | "disabled">;
// 等同于：'onClick' | 'disabled'
```

### 3. 提取满足条件的类型

```typescript
type ApiResponse = { status: "success"; data: any } | { status: "error"; message: string } | { status: "loading" };

type SuccessfulResponse = Extract<ApiResponse, { status: "success" }>;
// 等同于：{ status: 'success'; data: any }
```

## 高级用法

### 1. 实现 `NonNullable` 类型

`Extract` 可以用来实现 `NonNullable` 类型：

```typescript
type MyNonNullable<T> = Extract<T, {}>;
// 等同于官方 NonNullable，排除 null 和 undefined
```

### 2. 提取函数类型

```typescript
type MixedMembers = string | number | (() => void) | Date;

type OnlyFunctions = Extract<MixedMembers, Function>;
// 等同于：() => void
```

### 3. 基于条件提取属性

```typescript
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface UserActions {
  id: number;
  name: string;
  update: () => void;
  delete: (id: number) => boolean;
}

type UserMethods = Extract<keyof UserActions, FunctionPropertyNames<UserActions>>;
// 等同于：'update' | 'delete'
```

## 实现原理

`Extract` 的实现原理（TypeScript 内置）：

```typescript
type Extract<T, U> = T extends U ? T : never;
```

这是一个**条件类型**，它遍历 `T` 中的每个类型：

- 如果该类型可以赋值给 `U`，则保留该类型
- 否则返回 `never`（从联合类型中移除）

## 与 `Exclude` 的关系

`Extract` 和 `Exclude` 是互补的操作：

```typescript
type EventTypes = "click" | "scroll" | "keydown";

type MouseEvents = Extract<EventTypes, "click">; // 'click'
type NonMouseEvents = Exclude<EventTypes, "click">; // 'scroll' | 'keydown'
```

## 注意事项

1. **类型兼容性**：`Extract` 基于类型兼容性判断，而不仅仅是名称匹配

2. **分布式条件类型**：`Extract` 是分布式条件类型，会应用于联合类型中的每个成员

3. **与 `never` 的关系**：不匹配的类型会转换为 `never` 并被排除

4. **性能考虑**：对非常大的联合类型使用可能会影响编译器性能

## 总结

`Extract` 类型主要解决了以下问题：

1. **联合类型提取**：从联合类型中提取特定的类型
2. **类型过滤**：基于条件筛选出符合条件的类型
3. **属性键提取**：与 `keyof` 结合提取对象特定属性
4. **类型安全操作**：创建更精确的类型约束
