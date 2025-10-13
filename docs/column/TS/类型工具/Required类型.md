# TypeScript 中的 `Required` 类型详解

[[toc]]

`Required` 是 `TypeScript` 内置的实用工具类型`（Utility Type）`，它可以将一个类型中的所有**可选属性变为必填属性**。这与 `Partial` 类型的功能正好相反，用于确保对象必须包含所有属性。

## 一、基本语法

```typescript
Required<Type>;
```

`Required` 接收一个类型 `Type`，并返回一个新类型，这个新类型会将 `Type` 中的所有可选属性（带有 `?` 修饰符的）转换为必填属性。

## 二、基本示例

### 1. 简单使用

```typescript
interface User {
  id?: number;
  name?: string;
  age?: number;
}

type RequiredUser = Required<User>;
/* 等同于：
type RequiredUser = {
  id: number;
  name: string;
  age: number;
}
*/

const user: RequiredUser = {
  id: 1,
  name: "Alice",
  age: 25
  // 缺少任何一个属性都会报错
};
```

### 2. 与 `Partial` 对比

```typescript
interface Person {
  name: string;
  age?: number;
}

type PartialPerson = Partial<Person>; // 所有属性变为可选
type RequiredPerson = Required<Person>; // 所有属性变为必填
```

## 三、实际应用场景

### 1. 确保配置完整

```typescript
interface AppConfig {
  apiUrl?: string;
  timeout?: number;
  env?: "dev" | "prod";
}

function initializeApp(config: Required<AppConfig>) {
  // 确保所有配置都已提供
  console.log(`Connecting to ${config.apiUrl}`);
}

initializeApp({
  apiUrl: "https://api.example.com",
  timeout: 5000,
  env: "prod"
});
```

### 2. 数据库实体要求

```typescript
interface Product {
  id?: string; // 创建时可选，保存后必有
  name: string;
  price?: number;
}

function saveToDatabase(product: Required<Product>) {
  // 确保id和price都已存在
  db.save(product);
}
```

### 3. 表单提交验证

```typescript
interface RegistrationForm {
  username?: string;
  email?: string;
  password?: string;
  agreeTerms?: boolean;
}

function submitForm(data: Required<RegistrationForm>) {
  // 所有字段都已填写
  api.register(data);
}
```

## 四、高级用法

### 1. 深层 `Required`

```typescript
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

interface Settings {
  user?: {
    name?: string;
    email?: string;
  };
  features?: {
    darkMode?: boolean;
    notifications?: boolean;
  };
}

type StrictSettings = DeepRequired<Settings>;
/* 等同于：
type StrictSettings = {
  user: {
    name: string;
    email: string;
  };
  features: {
    darkMode: boolean;
    notifications: boolean;
  };
}
*/
```

### 2. 与 `Pick` 和 `Omit` 结合

```typescript
interface Product {
  id?: string;
  name: string;
  price?: number;
  description?: string;
}

// 只要求id和price必填
type ProductWithPrice = Required<Pick<Product, "id" | "price">> & Omit<Product, "id" | "price">;

// 要求除description外都必填
type ProductRequired = Required<Omit<Product, "description">> & Pick<Product, "description">;
```

### 3. 条件必填

```typescript
type ConditionallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

interface Form {
  username?: string;
  email?: string;
  isAdmin?: boolean;
}

// 当isAdmin为true时，要求username和email必填
type AdminForm = ConditionallyRequired<Form, "username" | "email"> & { isAdmin: true };
```

## 五、与 `Partial` 的对比

| 特性     | `Required`           | `Partial`           |
| -------- | -------------------- | ------------------- |
| 功能     | 所有属性变为必填     | 所有属性变为可选    |
| 修饰符   | 使用 `-?` 移除可选性 | 使用 `?` 添加可选性 |
| 使用场景 | 确保完整数据         | 处理部分更新        |
| 实现关系 | 相反操作             | 相反操作            |
