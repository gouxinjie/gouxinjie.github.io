# TypeScript 中 type 与 interface 的使用和区别

`TypeScript` 中的 `type` 和 `interface` 是定义类型的两种主要方式，它们有许多相似之处，但也存在关键差异。

## 一、基本概念对比

### 1. 基本语法

**interface 示例**：

```typescript
interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  privileges: string[];
}
```

**type 示例**：

```typescript
type User = {
  id: number;
  name: string;
};

type Admin = User & {
  privileges: string[];
};
```

### 2. 核心相同点

✅ 都能描述对象形状  
✅ 都支持扩展（interface 用 extends，type 用交叉类型）  
✅ 都支持实现（implements）  
✅ 现代 TypeScript 中性能差异可以忽略

## 二、关键差异详解

### 1. 扩展方式不同

**interface** 使用继承：

```typescript
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}
```

**type** 使用交叉类型：

```typescript
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};
```

### 2. 声明合并（Interface 独有）

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 最终 User 包含 name 和 age 属性
const user: User = {
  name: "Alice",
  age: 30
};
```

_type 不允许重复声明，会报错_

### 3. 类型表达能力

**type 能表达更复杂的类型**：

- 联合类型：

  ```typescript
  type ID = number | string;
  ```

- 元组类型：

  ```typescript
  type Point = [number, number];
  ```

- 映射类型：

  ```typescript
  type Readonly<T> = {
    readonly [P in keyof T]: T[P];
  };
  ```

- 条件类型：
  ```typescript
  type IsString<T> = T extends string ? true : false;
  ```

### 4. 类实现（implement）

两者都可以被类实现，但语法不同：

```typescript
// 使用 interface
interface ClockInterface {
  currentTime: Date;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
}

// 使用 type
type ClockType = {
  currentTime: Date;
};

class DigitalClock implements ClockType {
  currentTime: Date = new Date();
}
```

## 三、使用场景推荐

### 优先使用 interface 的情况

1. **定义对象形状**（尤其是公共 API）

   ```typescript
   // 更好的做法
   interface Config {
     apiUrl: string;
     timeout: number;
   }
   ```

2. **需要声明合并时**

   ```typescript
   // 扩展第三方库类型
   declare module "vue" {
     interface ComponentCustomProperties {
       $filters: Filters;
     }
   }
   ```

3. **面向对象编程**（类实现接口）

   ```typescript
   interface Serializable {
     serialize(): string;
   }

   class Document implements Serializable {
     serialize() {
       return "...";
     }
   }
   ```

### 优先使用 type 的情况

1. **需要联合类型时**

   ```typescript
   type Result = Success | Failure;
   ```

2. **需要元组类型时**

   ```typescript
   type Coordinates = [number, number];
   ```

3. **需要复杂类型运算时**

   ```typescript
   type Partial<T> = {
     [P in keyof T]?: T[P];
   };
   ```

4. **需要类型别名简化时**
   ```typescript
   type StringOrNumber = string | number;
   ```

## 四、性能与编译差异

| 方面     | interface        | type             |
| -------- | ---------------- | ---------------- |
| 声明合并 | 支持             | 不支持           |
| 错误信息 | 更友好           | 相对复杂         |
| 编译速度 | 稍快（简单场景） | 复杂类型可能稍慢 |
| 类型检查 | 早期绑定         | 延迟解析         |

## 五、最佳实践建议

1. **项目一致性**：团队统一选择一种风格（或制定明确规则）
2. **公共 API**：优先使用 interface（更好的错误提示和扩展性）
3. **复杂类型**：使用 type 表达高级类型关系
4. **React Props & State**：

   ```typescript
   // 推荐用法
   type Props = {
     visible: boolean;
   };

   type State = {
     count: number;
   };

   class Component extends React.Component<Props, State> {}
   ```
## 六、经典案例对比

### 1. 扩展第三方库类型

**interface 方式（推荐）**：

```typescript
declare namespace Express {
  interface Request {
    user?: User;
  }
}
```

**type 方式（不可行）**：

```typescript
// 无法这样扩展第三方类型
type Express.Request = {
  user?: User;
};
```

### 2. 组件 Props 类型

**type 方式（推荐）**：

```typescript
type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
} & (
  | {
      type: "alert";
      message: string;
    }
  | {
      type: "confirm";
      question: string;
    }
);
```
