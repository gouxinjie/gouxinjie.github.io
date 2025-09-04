# Vue toRaw ：访问原始非代理对象

## 一、核心概念与基本用法

`toRaw` 是 Vue 3 提供的一个实用 API，用于**获取响应式对象的原始非代理对象**。这个 API 在特定场景下非常有用，特别是当你需要：

- 🚫 临时避开响应式系统
- 🔍 比较对象是否相同
- 🏗️ 集成第三方库

### 基础语法

```javascript
import { reactive, toRaw } from "vue";

const proxy = reactive({ count: 0 });
const raw = toRaw(proxy);

console.log(raw === { count: 0 }); // true
```

## 二、关键特性解析

| 特性             | 说明                             |
| ---------------- | -------------------------------- |
| **返回值**       | 返回响应式代理对应的原始对象     |
| **不影响响应性** | 调用后原代理对象仍保持响应式     |
| **深度转换**     | 只转换最外层，嵌套对象需递归处理 |
| **无副作用**     | 不会修改原响应式对象             |

## 三、典型应用场景

### 1. 性能敏感操作

```javascript
const list = reactive(bigArray);

// 大数据操作时使用原始数据
function processData() {
  const rawList = toRaw(list);
  // 执行高性能计算
}
```

### 2. 第三方库集成

```javascript
const chartData = reactive({
  /*...*/
});

// 某些库需要原始数据
thirdPartyLib.init(toRaw(chartData));
```

### 3. 对象比较

```javascript
const obj = reactive({ a: 1 });
const sameObj = { a: 1 };

console.log(obj === sameObj); // false
console.log(toRaw(obj) === sameObj); // true
```

## 四、与相似 API 对比

| API        | 作用                   | 是否影响响应性 | 返回类型         |
| ---------- | ---------------------- | -------------- | ---------------- |
| `toRaw`    | 获取原始非代理对象     | 否             | 原始对象         |
| `markRaw`  | 标记对象永不转为响应式 | 是             | 原对象（带标记） |
| `reactive` | 创建响应式代理         | 是             | 代理对象         |
| `readonly` | 创建只读代理           | 是             | 代理对象         |

## 五、进阶使用技巧

### 1. 递归获取原始对象

```javascript
function deepToRaw(obj) {
  if (!obj || typeof obj !== "object") return obj;

  const raw = toRaw(obj);
  if (raw !== obj) return deepToRaw(raw);

  if (Array.isArray(obj)) {
    return obj.map(deepToRaw);
  }

  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepToRaw(v)]));
}
```

### 2. 与 Ref 一起使用

```javascript
const count = ref(0);
console.log(toRaw(count)); // { value: 0 } (RefImpl实例)
```

### 3. 类型安全(TypeScript)

```typescript
import type { UnwrapNestedRefs } from "vue";

function safeToRaw<T>(obj: T): UnwrapNestedRefs<T> {
  return toRaw(obj) as UnwrapNestedRefs<T>;
}
```

## 六、常见问题解答

### Q1: toRaw 会破坏响应性吗？

不会，它只是返回原始对象的引用，不影响原代理的响应性。

### Q2: 什么时候不该用 toRaw？

- 需要维持响应性的常规操作
- 模板渲染逻辑中
- 需要 Vue 追踪变化的地方

### Q3: toRaw 对 ref 有效吗？

是的，但返回的是 RefImpl 实例，要获取实际值需要访问`.value`属性。
