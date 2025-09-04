# TypeScript 中的 `NonNullable` 类型详解

`NonNullable` 是 `TypeScript` 内置的一个实用工具类型`（Utility Type`），它用于**从类型中排除 `null` 和 `undefined`**，创建一个不能为 `null 或 undefined `的新类型。

这个类型在确保值必须存在的场景中非常有用。

## 基本语法

```typescript
NonNullable<Type>;
```

- `Type`：源类型，你想从中排除 `null` 和 `undefined` 的类型

## 基本示例

### 1. 简单使用

```typescript
type T = string | number | null | undefined;

type NonNullT = NonNullable<T>;
// 等同于：string | number

type MaybeString = string | undefined;

type DefiniteString = NonNullable<MaybeString>;
// 等同于：string
```

### 2. 与联合类型一起使用

```typescript
type Status = "success" | "error" | null;

type DefiniteStatus = NonNullable<Status>;
// 等同于：'success' | 'error'
```

## 实际应用场景

### 1. 确保函数参数非空

```typescript
function greet(name: string | null | undefined) {
  const definiteName: NonNullable<typeof name> = name ?? "Guest";
  console.log(`Hello, ${definiteName}!`);
}
```

### 2. API 响应处理

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

function processResponse<T>(response: ApiResponse<T>): NonNullable<T> {
  if (response.data === null) {
    throw new Error(response.error || "Unknown error");
  }
  return response.data; // 这里类型自动推断为 NonNullable<T>
}
```

### 3. React 组件 Props

```typescript
interface UserProfileProps {
  username: string | undefined;
  avatar?: string;
}

function UserProfile({ username, avatar }: UserProfileProps) {
  const safeUsername: NonNullable<typeof username> = username ?? "Anonymous";
  // 处理确保存在的用户名
}
```
