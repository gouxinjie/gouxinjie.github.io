# TypeScript 中的 `Record` 类型详解

`Record` 是 `TypeScript` 内置的一个实用工具类型`（Utility Type）`，用于创建对象类型的键值映射。它提供了一种简洁的方式来定义具有特定键类型和值类型的对象结构。

## 基本语法

```typescript
Record<Keys, Type>;
```

- `Keys`：表示对象键的类型，通常是字符串、数字或符号的联合类型
- `Type`：表示对象值的类型

## 基本示例

### 1. 简单键值映射

```typescript
type StringToNumber = Record<string, number>;

const scores: StringToNumber = {
  math: 90,
  english: 85
  // 可以添加任意string键，值必须是number
};
```

### 2. 使用联合类型作为键

```typescript
type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
type Schedule = Record<Weekday, string>;

const workSchedule: Schedule = {
  Mon: "9:00-18:00",
  Tue: "9:00-18:00",
  Wed: "9:00-18:00",
  Thu: "9:00-18:00",
  Fri: "9:00-17:00"
  // 不能缺少任何一个Weekday键
  // Sat: '休息'  // 错误，因为'Sat'不在Weekday中
};
```

## `Record` 与索引签名的比较

`Record` 和索引签名都可以用来定义对象类型，但它们有一些关键区别：

| 特性       | `Record` 类型        | 索引签名                            |
| ---------- | -------------------- | ----------------------------------- |
| 语法       | `Record<Keys, Type>` | `{ [key: KeyType]: ValueType }`     |
| 键类型限制 | 可以是任何类型       | 只能是 `string`, `number`, `symbol` |
| 显式属性   | 不能混合使用         | 可以与显式属性混合使用              |
| 灵活性     | 更适合明确的键集合   | 更适合完全动态的键                  |
| 可读性     | 更简洁直观           | 相对冗长                            |

### 等价示例

```typescript
// 使用Record
type RecordStyle = Record<string, number>;

// 使用索引签名
interface IndexSignatureStyle {
  [key: string]: number;
}
```

## 实际应用场景

### 1. 配置对象

```typescript
type FeatureFlags = Record<"darkMode" | "newDashboard" | "experimental", boolean>;

const flags: FeatureFlags = {
  darkMode: true,
  newDashboard: false,
  experimental: true
};
```

### 2. API 响应数据

```typescript
type UserRoles = Record<string, "admin" | "editor" | "viewer">;

const roles: UserRoles = {
  user1: "admin",
  user2: "editor",
  user3: "viewer"
};
```

### 3. 枚举映射

```typescript
enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending"
}

type StatusDescriptions = Record<Status, string>;

const descriptions: StatusDescriptions = {
  [Status.Active]: "The item is active",
  [Status.Inactive]: "The item is inactive",
  [Status.Pending]: "The item is pending review"
};
```

### 4. 组件 Props

```typescript
type IconSizes = "sm" | "md" | "lg";
type IconProps = Record<IconSizes, string>;

const iconClasses: IconProps = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8"
};
```

## 高级用法

### 1. 嵌套 Record

```typescript
type NestedRecord = Record<string, Record<string, number>>;

const matrix: NestedRecord = {
  row1: { col1: 1, col2: 2 },
  row2: { col1: 3, col2: 4 }
};
```

### 2. 与联合类型结合

```typescript
type Entity = "user" | "post" | "comment";
type EntityOperations = Record<Entity, { create: boolean; delete: boolean }>;

const permissions: EntityOperations = {
  user: { create: true, delete: false },
  post: { create: true, delete: true },
  comment: { create: true, delete: true }
};
```

### 3. 动态生成类型

```typescript
const colors = ["red", "green", "blue"] as const;
type Color = (typeof colors)[number]; // 'red' | 'green' | 'blue'
type ColorPalette = Record<Color, string>;

const palette: ColorPalette = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff"
};
```

## 注意事项

1. **键的完整性**：当使用联合类型作为键时，必须提供所有键的值

   ```typescript
   type Keys = "a" | "b";
   type MyRecord = Record<Keys, number>;

   const obj: MyRecord = { a: 1 }; // 错误，缺少'b'
   ```

2. **可选属性**：如果需要可选属性，可以结合 `Partial` 使用

   ```typescript
   type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;
   ```

3. **与 `Map` 的区别**：`Record` 创建的是普通对象类型，不是 `Map` 数据结构

4. **性能考虑**：对于非常大的键集合，联合类型可能会影响编译器性能
