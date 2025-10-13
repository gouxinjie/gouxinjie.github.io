# TypeScript 中的 `Exclude` 类型详解

[[toc]]

`Exclude` 是 `TypeScript` 内置的一个实用工具类型`（Utility Type）`，它用于**从一个联合类型中排除某些类型**，创建一个新的联合类型。这个类型在过滤类型和创建更精确的类型约束时非常有用。

## 一、基本语法

```typescript
Exclude<UnionType, ExcludedMembers>;
```

- `UnionType`：源联合类型，你想从中排除某些类型的联合类型
- `ExcludedMembers`：你想排除的类型或类型联合

## 二、基本示例

### 1. 简单使用

```typescript
type T = "a" | "b" | "c" | "d";

type Result = Exclude<T, "a">;
// 等同于：'b' | 'c' | 'd'

type Numbers = string | number | boolean;

type JustNumbers = Exclude<Numbers, boolean>;
// 等同于：string | number
```

### 2. 排除多个类型

```typescript
type AllTypes = string | number | boolean | object | null | undefined;

type NonNullablePrimitives = Exclude<AllTypes, object | null | undefined>;
// 等同于：string | number | boolean
```

## 三、实际应用场景

### 1. 创建非空类型

```typescript
type Maybe<T> = T | null | undefined;

function ensureValue<T>(value: Maybe<T>): Exclude<Maybe<T>, null | undefined> {
  if (value == null) {
    throw new Error("Value cannot be null or undefined");
  }
  return value; // 这里返回的类型自动排除了null和undefined
}
```

### 2. 过滤事件类型

```typescript
type EventTypes = "click" | "scroll" | "keydown" | "mouseenter" | "focus";

type MouseEvents = Exclude<EventTypes, "scroll" | "keydown" | "focus">;
// 等同于：'click' | 'mouseenter'
```

### 3. 组件属性过滤

```typescript
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
}

type StyleProps = Exclude<keyof ButtonProps, "onClick" | "disabled">;
// 等同于：'variant' | 'size'
```

## 四、高级用法

### 1. 实现 `Omit` 类型

`Exclude` 是 `Omit` 类型的基础：

```typescript
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### 2. 排除函数类型

```typescript
type MixedTypes = string | number | (() => void) | Date;

type NonFunction = Exclude<MixedTypes, Function>;
// 等同于：string | number | Date
```

### 3. 条件类型中的排除

```typescript
type FilterProperties<T, U> = {
  [K in keyof T as Exclude<K, U>]: T[K];
};

interface User {
  id: number;
  name: string;
  password: string;
  email: string;
}

type PublicUser = FilterProperties<User, "password">;
/* 等同于：
type PublicUser = {
  id: number;
  name: string;
  email: string;
}
*/
```

## 五、与 `Extract` 的关系

`Exclude` 和 `Extract` 是相反的操作：

```typescript
type EventTypes = "click" | "scroll" | "keydown";

type MouseEvents = Exclude<EventTypes, "scroll" | "keydown">; // 'click'
type KeyboardEvents = Extract<EventTypes, "scroll" | "keydown">; // 'scroll' | 'keydown'
```
