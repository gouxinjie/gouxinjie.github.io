# TypeScript 中的 `Pick` 类型详解

[[toc]]

`Pick` 是 `TypeScript` 内置的实用工具类型`（Utility Type）`之一，它允许你从一个复杂的类型中**挑选出部分属性**，创建一个新的类型。这个工具类型在处理大型接口或类型时特别有用，可以精确控制需要使用的属性。

## 一、基本语法

```typescript
Pick<Type, Keys>;
```

- `Type`：源类型，你想从中选择属性的类型
- `Keys`：你想选择的属性名的联合类型（使用 `keyof Type` 获取）

## 二、基本示例

### 1. 简单使用

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  createdAt: Date;
}

// 只选择id和name属性
type UserPreview = Pick<User, "id" | "name">;
/* 等同于：
type UserPreview = {
  id: number;
  name: string;
}
*/

const preview: UserPreview = {
  id: 1,
  name: "Alice"
  // 不能包含age、email等其他属性
};
```

### 2. 与 `keyof` 结合使用

```typescript
type UserIdentity = Pick<User, keyof { id: any; name: any }>;
// 等同于 Pick<User, 'id' | 'name'>
```

## 三、实际应用场景

### 1. 创建轻量级 DTO (Data Transfer Object)

```typescript
// 完整用户模型
interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// 登录只需要username和password
type LoginDTO = Pick<User, "username" | "password">;

// 用户列表只需要显示部分信息
type UserListItem = Pick<User, "id" | "username" | "email">;
```

### 2. 组件 Props 类型

```typescript
interface ButtonProps {
  size: "sm" | "md" | "lg";
  variant: "primary" | "secondary" | "outline";
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

// 只暴露部分属性给包装组件
type IconButtonProps = Pick<ButtonProps, "size" | "variant" | "disabled" | "onClick"> & {
  icon: React.ReactNode;
};
```

### 3. 函数参数选择

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
}

function updateProductPrice(params: Pick<Product, "id" | "price">) {
  // 只需要id和price来更新价格
}
```

## 四、高级用法

### 1. 与 `Partial` 结合使用

```typescript
// 允许部分更新用户基本信息
type UpdateUserProfile = Partial<Pick<User, "name" | "email" | "age">>;

const update: UpdateUserProfile = {
  name: "Alice" // 可以只更新一个属性
};
```

### 2. 基于条件选择属性

```typescript
// 选择所有字符串类型的属性
type StringProperties<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends string ? K : never;
  }[keyof T]
>;

type UserStringFields = StringProperties<User>;
/* 等同于：
type UserStringFields = {
  name: string;
  email: string;
}
*/
```

### 3. 排除敏感信息

```typescript
// 从用户对象中排除密码字段
type PublicUser = Omit<User, "password">;
// 或者用Pick实现
type PublicUser = Pick<User, Exclude<keyof User, "password">>;
```

## 五、与 `Omit` 的关系

`Pick` 和 `Omit` 是相反的操作：

```typescript
interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  published: boolean;
}

// 选择title和author
type BookInfo = Pick<Book, "title" | "author">;

// 排除title和author（效果相同）
type BookInfoAlt = Omit<Book, "id" | "pages" | "published">;
```
