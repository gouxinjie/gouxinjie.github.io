# Vue shallowReadonly ：浅层只读响应式数据

## 一、核心概念与基本用法

`shallowReadonly` 是 Vue 3 提供的响应式 API，用于创建一个**浅层只读**的响应式对象，具有以下特性：

- 🔒 **表层只读**：直接属性不能被修改
- 🌀 **浅层响应**：嵌套对象保持原样（非响应式且可修改）
- ⚡ **性能优化**：避免不必要的深度响应式转换

### 基础示例

```javascript
import { shallowReadonly } from "vue";

const state = shallowReadonly({
  count: 0,
  user: {
    name: "John"
  }
});

// 允许（但不会响应式更新）
state.user.name = "Alice";

// 不允许（控制台警告）
state.count = 1;
```

## 二、与 readonly 的关键差异

| 特性           | readonly           | shallowReadonly        |
| -------------- | ------------------ | ---------------------- |
| **响应式深度** | 深度只读           | 仅浅层只读             |
| **嵌套对象**   | 递归转换为只读     | 保持原始状态           |
| **性能开销**   | 较高               | 较低                   |
| **使用场景**   | 需要完全保护的对象 | 只需保护顶层属性的对象 |

## 三、典型应用场景

### 1. 组件 props 的扩展处理

```javascript
const extendedProps = shallowReadonly({
  ...props,
  localConfig: {
    /* 可修改的本地配置 */
  }
});
```

### 2. 大型对象性能优化

```javascript
const largeConfig = shallowReadonly({
  // 顶层属性受保护
  version: "1.0",
  // 深层结构不转换（节省性能）
  metadata: {
    /* 可能很大的数据结构 */
  }
});
```

### 3. 与第三方库集成

```javascript
const libInstance = shallowReadonly({
  instance: thirdPartyLib, // 内部方法需要保持可调用
  config: {
    /* 可修改的配置 */
  }
});
```

## 四、进阶用法与技巧

### 1. 类型定义 (TypeScript)

```typescript
import type { ShallowReadonly } from "vue";

interface State {
  count: number;
  user: {
    name: string;
  };
}

const state: ShallowReadonly<State> = shallowReadonly({
  count: 0,
  user: { name: "John" }
});
```

### 2. 配合 shallowRef 使用

```javascript
const state = shallowRef({
  count: 0,
  nested: { value: 1 }
});

const readonlyState = shallowReadonly(state.value);

// 修改源会反映到readonly版本
state.value.count++;
```

### 3. 开发环境警告增强

```javascript
const state = shallowReadonly(
  {
    value: 42
  },
  {
    onWarn: (msg, instance) => {
      console.error("非法修改:", msg);
      // 可以集成到错误监控系统
    }
  }
);
```