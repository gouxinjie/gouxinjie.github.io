# TypeScript 模板字面量类型与 `keyof` 的魔法组合：`keyof T & `on${string}` 深度解析

在 `TypeScript` 4.1 引入的**模板字面量类型**（Template Literal Types）彻底改变了类型操作的可能性。结合 `keyof` 操作符，我们可以创建出极其强大的类型筛选和匹配工具。

## 一、基础语法解析

### 1. 核心语法结构

```typescript
type FilteredKeys = keyof T & `on${string}`;
```

### 2. 组成部分详解

- **`keyof T`**：获取类型 T 的所有**键名组成的联合类型**
- **`` `on${string}` ``**：模板字面量类型，匹配以 "on" 开头的字符串
- **`&`**：类型交叉运算，相当于取两者的**交集**

### 3. 实际效果

这种语法会**筛选出所有以 "on" 开头的属性名**，相当于：

```typescript
type EventHandlers = Pick<T, keyof T & `on${string}`>;
```

## 二、语法分解教学

### 1. `keyof` 操作符基础

```typescript
interface Person {
  name: string;
  age: number;
}

type PersonKeys = keyof Person; // PersonKeys 等价于: "name" | "age"

const person: PersonKeys = "name";
console.log("person:", person); // person: name
```

### 2. 模板字面量类型

```typescript
type EventName = `on${string}`;
// 匹配: "onClick", "onChange", "onInput" 等

type CSSClass = `col-${number}`;
// 匹配: "col-1", "col-2" 等
```

### 3. 交叉类型过滤

```typescript
type Props = {
  onClick: () => void;
  onMouseover: () => void;
  news1Types: string;
  class1Name: string;
  class2Name: string;
};

type p1 = keyof Props & `on${string}`; // 只剩下 "onClick" | "onMouseover" 其他的类型已经过滤掉了

type p2 = keyof Props & `class${string}`; // 只剩下 "class2Name" 其他的类型已经过滤掉了

type p3 = keyof Props & `news${string}`; // 只剩下 "news1Types" 其他的类型已经过滤掉了
```

## 三、底层实现原理

### 1. 类型运算顺序

1. 先计算 `keyof Props` → `"onClick" | "onMouseover" | "title" | "className"`
2. 计算 `` `on${string}` `` → 所有以 "on" 开头的字符串类型
3. 取两者交集 → 只保留同时满足两个条件的类型

### 2. 编译器处理流程

TypeScript 编译器会：

1. 展开联合类型
2. 对每个成员进行模式匹配
3. 保留匹配成功的成员

## 四、高级应用场景

### 1. 提取事件处理器类型

```typescript
type ExtractEventHandlers<T> = {
  [K in keyof T & `on${string}`]: T[K];
};

// 使用示例
type MyComponentProps = {
  onClick: (e: Event) => void;
  onChange: (value: string) => void;
  className: string;
};

type Handlers = ExtractEventHandlers<MyComponentProps>;
/* 结果:
{
  onClick: (e: Event) => void;
  onChange: (value: string) => void;
}
*/
```

### 2. 动态派发事件

```typescript
function triggerHandler<T, K extends keyof T & `on${string}`>(obj: T, key: K, ...args: Parameters<T[K]>) {
  const handler = obj[key];
  if (typeof handler === "function") {
    handler(...args);
  }
}
```

### 3. 组件 Props 自动分类

```typescript
type ComponentProps = {
  onClick: () => void;
  onLoad: () => void;
  variant: "primary" | "secondary";
  size: number;
};

type EventProps = keyof ComponentProps & `on${string}`;
type ConfigProps = Exclude<keyof ComponentProps, EventProps>;
```

## 五、实用技巧集合

### 1. 多重模式匹配

```typescript
type ApiRoutes = `get${string}` | `post${string}` | `delete${string}`;

type FilterApiRoutes<T> = keyof T & ApiRoutes;
```

### 2. 带前缀的枚举约束

```typescript
type IconName = `icon-${"home" | "settings" | "user"}`;
// 允许: "icon-home", "icon-settings", "icon-user"
```

### 3. CSS 类名验证

```typescript
type ValidClass =
  | `text-${'left' | 'center' | 'right'}`
  | `bg-${'red' | 'blue' | 'green'}`;

function addClass(cls: ValidClass) { ... }

addClass('text-center'); // ✅
addClass('bg-purple');   // ❌ 错误
```
