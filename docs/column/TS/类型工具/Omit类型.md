# TypeScript 中的 `Omit` 类型详解

[[toc]]

`Omit` 是 `TypeScript` 内置的一个实用工具类型`（Utility Type）`，它允许你从一个现有类型中**排除某些属性**，创建一个新的类型。这与 `Pick` 类型形成互补，`Pick` 是选择需要的属性，而 `Omit` 是排除不需要的属性。

## 一、基本语法

```typescript
Omit<Type, Keys>;
```

- `Type`：源类型，你想从中排除属性的类型
- `Keys`：你想排除的属性名的字符串联合类型（使用 `|` 分隔）或 `keyof Type`

## 二、基本示例

### 1. 简单使用

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  password: string;
}

// 排除password属性
type SafeUser = Omit<User, "password">;
/* 等同于：
type SafeUser = {
  id: number;
  name: string;
  age: number;
  email: string;
}
*/

// 排除多个属性
type PublicUser = Omit<User, "password" | "email">;
/* 等同于：
type PublicUser = {
  id: number;
  name: string;
  age: number;
}
*/
```

### 2. 与 `keyof` 结合使用

```typescript
type SensitiveKeys = "password" | "token";
type UserWithoutSensitiveData = Omit<User, SensitiveKeys>;
```

## 实际应用场景

### 1. 排除敏感字段

```typescript
// 从用户对象中排除敏感信息
function getUserPublicInfo(user: User): Omit<User, "password" | "email"> {
  const { password, email, ...publicData } = user;
  return publicData;
}
```

### 2. 组件属性继承与排除

```typescript
interface ButtonProps {
  size: "sm" | "md" | "lg";
  variant: "primary" | "secondary";
  disabled: boolean;
  onClick: () => void;
  className?: string;
}

// 创建链接按钮，不需要onClick
type LinkButtonProps = Omit<ButtonProps, "onClick"> & {
  href: string;
};
```

### 3. 覆盖已有属性

```typescript
interface BaseProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

// 创建不需要style属性的组件props
type SimpleComponentProps = Omit<BaseProps, "style"> & {
  color: string;
};
```

## 三、高级用法

### 1. 与 `Pick` 的等价转换

`Omit` 可以用 `Pick` 和 `Exclude` 来实现：

```typescript
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### 2. 递归排除嵌套属性

```typescript
type DeepOmit<T, K extends string> = T extends object
  ? {
      [P in Exclude<keyof T, K>]: DeepOmit<T[P], K>;
    }
  : T;

interface ComplexUser {
  id: number;
  info: {
    name: string;
    password: string;
    contacts: {
      email: string;
      phone: string;
    };
  };
}

type SafeComplexUser = DeepOmit<ComplexUser, "password">;
/* 等同于：
type SafeComplexUser = {
  id: number;
  info: {
    name: string;
    contacts: {
      email: string;
      phone: string;
    };
  };
}
*/
```

### 3. 基于条件排除属性

```typescript
// 排除所有函数类型的属性
type OmitFunctions<T> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends Function ? K : never;
  }[keyof T]
>;

interface MixedInterface {
  id: number;
  name: string;
  update: () => void;
  delete: (id: number) => boolean;
}

type DataOnly = OmitFunctions<MixedInterface>;
/* 等同于：
type DataOnly = {
  id: number;
  name: string;
}
*/
```

## 四、与 `Pick` 的对比

| 特性     | `Omit`                                      | `Pick`                            |
| -------- | ------------------------------------------- | --------------------------------- |
| 目的     | 排除指定属性                                | 选择指定属性                      |
| 使用场景 | 当要排除的属性较少时更简洁                  | 当要选择的属性较少时更简洁        |
| 实现关系 | `Omit<T, K> = Pick<T, Exclude<keyof T, K>>` | `Pick<T, K> = { [P in K]: T[P] }` |
| 可读性   | "排除这些属性"的意图更明确                  | "选择这些属性"的意图更明确        |
