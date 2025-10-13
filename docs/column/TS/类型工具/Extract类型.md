# TypeScript 中的 `Extract` 类型详解

[[toc]]

`Extract` 是 `TypeScript` 内置的一个实用工具类型`（Utility Type）`，它用于**从一个联合类型中提取可赋值给另一个类型的类型**，创建一个新的联合类型。

这与 `Exclude` 类型的功能正好相反，`Exclude` 是排除某些类型，而 `Extract` 是提取某些类型。

## 一、基本语法

```typescript
Extract<Type, Union>;
```

- `Type`：源类型，你想从中提取类型的联合类型
- `Union`：你想提取的类型或类型联合

## 二、基本示例

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

## 三、实际应用场景

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

## 四、高级用法

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

## 五、与 `Exclude` 的关系

`Extract` 和 `Exclude` 是互补的操作：

```typescript
type EventTypes = "click" | "scroll" | "keydown";

type MouseEvents = Extract<EventTypes, "click">; // 'click'
type NonMouseEvents = Exclude<EventTypes, "click">; // 'scroll' | 'keydown'
```
