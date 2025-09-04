# Vue shallowRef ：浅层响应式优化方案

## 一、核心概念与基本用法

`shallowRef` 是 Vue 3 提供的一种响应式 API，用于创建一个**仅对 `.value` 访问进行响应式追踪**的 ref 对象。与常规 `ref` 不同，它不会对其内部值进行深度响应式转换。

### 基础示例

```javascript
import { shallowRef } from "vue";

const state = shallowRef({ count: 0 });

// 响应式变化（触发更新）
state.value = { count: 1 };

// 非响应式变化（不会触发更新）
state.value.count = 2;
```

## 二、与 ref 的关键差异

| 特性             | ref                  | shallowRef                    |
| ---------------- | -------------------- | ----------------------------- |
| **响应式深度**   | 深度响应             | 仅浅层响应                    |
| **性能开销**     | 较高（递归转换）     | 较低                          |
| **适用场景**     | 需要深度响应的小对象 | 大型对象/不需要深度响应的场景 |
| **模板自动解包** | 支持                 | 支持                          |

## 三、典型使用场景

### 1. 大型对象性能优化

```javascript
const largeObj = shallowRef({
  /* 包含数千个属性的庞大对象 */
});

// 只有替换整个对象才会触发更新
function updateData() {
  largeObj.value = { ...largeObj.value, key: newValue };
}
```

### 2. 第三方库实例管理

```javascript
const mapInstance = shallowRef(null);

onMounted(() => {
  // Leaflet 地图实例不需要深度响应
  mapInstance.value = L.map("map");
});
```

### 3. 与 watch 配合使用

```javascript
const state = shallowRef({ items: [] });

// 只有 state.value 被替换时才会触发
watch(
  state,
  (newVal) => {
    console.log("整个state被替换:", newVal);
  },
  { deep: false }
);
```

## 四、进阶用法与技巧

### 1. 强制触发更新

```javascript
const state = shallowRef({ count: 0 });

// 修改内部值后手动触发
function increment() {
  state.value.count++;
  triggerRef(state); // 手动触发更新
}
```

### 2. 与 reactive 结合

```javascript
const shallow = shallowRef({ count: 0 });
const reactiveObj = reactive({ shallow });

// 通过 reactive 访问会自动解包
console.log(reactiveObj.shallow); // 直接获取 { count: 0 }
```

### 3. 类型定义 (TypeScript)

```typescript
import type { ShallowRef } from "vue";

const state: ShallowRef<{ count: number }> = shallowRef({ count: 0 });
```