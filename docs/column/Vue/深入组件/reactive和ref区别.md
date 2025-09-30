# Vue3 响应式数据：`ref` 与 `reactive` 的深度解析

[[toc]]

`在 Vue3 的 Composition API 中`，响应式系统得到了彻底的重构，这不仅提升了性能，还增强了代码的可读性和灵活性。在新的响应式 API 中，`ref` 和 `reactive` 是最常用的两种创建响应式数据的方式。下面将深入探讨这两个 API 的差异及其底层实现。

## 1. 基础概念

### `reactive`

`reactive` 用于创建 **对象类型** 的响应式数据。它会将对象的所有属性变成响应式，确保当数据变化时，视图自动更新。

**示例：**

```javascript
import { reactive } from "vue";

const state = reactive({
  count: 0,
  user: {
    name: "张三",
    age: 25
  }
});

state.count++; // 响应式更新
```

`state.count` 是响应式的，修改它的值会自动触发视图更新。

### `ref`

`ref` 可以用于 **任何类型** 的响应式数据，包括 **基本数据类型**（`string`、`number`、`boolean` 等）和 **对象**。它通过 `.value` 属性来存储和访问数据。

**示例：**

```javascript
import { ref } from "vue";

const count = ref(0);
const user = ref({
  name: "李四",
  age: 30
});

count.value++; // 通过 .value 访问
user.value.name = "王五";
```

在这里，`count` 是一个基本数据类型，`user` 是一个对象。我们通过 `.value` 来访问和修改它们的值。

## 2. 核心区别

### 1. **数据类型支持**

- **`reactive`**：

  - 适用于 **对象类型**（`Object`、`Array`、`Map`、`Set` 等）。
  - 不支持 **基本类型**（`string`、`number`、`boolean` 等）。

- **`ref`**：

  - 适用于 **所有数据类型**，包括 **基本类型** 和 **对象类型**。
  - 当包裹对象时，`ref` 只会让对象的引用变成响应式，而不会递归地将对象的属性转化为响应式。

### 2. **访问方式**

- **`reactive`**：直接访问数据的属性。

  ```javascript
  state.count; // 直接访问
  ```

- **`ref`**：需要通过 `.value` 来访问。

  ```javascript
  count.value; // 通过 .value 访问
  ```

  在 Vue 模板中，`ref` 会自动解包，无需使用 `.value`：

  ```vue
  <template>
    <div>{{ count }}</div>
    <!-- 自动解包，无需 .value -->
  </template>
  ```

### 3. **重新赋值**

- **`reactive`**：不能直接重新赋值给响应式对象，否则会失去响应性。

  ```javascript
  let state = reactive({ count: 0 });
  state = { count: 1 }; // ❌ 失去响应性
  ```

- **`ref`**：可以安全地重新赋值，并且会保持响应性。

  ```javascript
  const count = ref(0);
  count.value = 1; // ✅ 保持响应性
  ```

## 3. 底层实现原理

Vue3 的响应式系统基于 **Proxy API**，这是 Vue3 相对于 Vue2 的重要优化。通过 `Proxy`，Vue3 可以拦截对数据的读取、修改等操作，进行依赖追踪和视图更新。

### `reactive` 的实现

`reactive` 会通过 `Proxy` 对传入的对象进行深度代理。它会为对象的每个属性创建代理，使得对象的每一个嵌套属性都变得响应式。

**示例代码：**

```javascript
function reactive(target) {
  return new Proxy(target, {
    get(obj, key) {
      track(obj, key); // 依赖收集
      return obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      trigger(obj, key); // 触发视图更新
      return true;
    }
  });
}
```

在 `get` 和 `set` 方法中，`track` 和 `trigger` 分别用于收集依赖和触发视图更新。

### `ref` 的实现

`ref` 的实现与 `reactive` 类似，但它专门用于包装 **基本类型** 或 **对象类型**。当包装的是对象时，`ref` 内部会使用 `reactive` 来确保对象的响应性。

**示例代码：**

```javascript
function ref(value) {
  if (isObject(value)) {
    value = reactive(value); // 对对象使用 reactive 包裹
  }

  return {
    get value() {
      track(this, "value"); // 依赖收集
      return value;
    },
    set value(newVal) {
      value = newVal;
      trigger(this, "value"); // 触发视图更新
    }
  };
}
```

`ref` 会使用 **`Proxy`** 拦截 `.value` 的读取和修改操作，并在其中收集依赖和触发视图更新。

## 4. reactive 的局限性 ​

**(1) 有限的值类型**：

它只能用于对象类型 (对象、数组和如 Map、Set 这样的集合类型)。它不能持有如` string`、 `number` 或 `boolean` 这样的原始类型。

**(2) 不能替换整个对象(直接用=号来赋值)**：

由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失：

对于这个问题，解决方案有三个:见 [reactive 定义响应式数据进行列表赋值时，视图没有更新的解决方案](/column/Vue/响应式API进阶/reactive视图未更新.html)

```js
let state = reactive({ count: 0 });
// 上面的 ({ count: 0 }) 引用将不再被追踪
// (响应性连接已丢失！)
state = reactive({ count: 1 });
```

**(3) 对解构操作不友好**：

当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接：

```js
const state = reactive({ count: 0 });

// 当解构时，count 已经与 state.count 断开连接
let { count } = state;
// 不会影响原始的 state
count++;

// 该函数接收到的是一个普通的数字
// 并且无法追踪 state.count 的变化
// 我们必须传入整个对象以保持响应性
callSomeFunction(state.count);
```

由于这些限制，[vue 官网](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive) 建议使用 ref() 作为声明响应式状态的主要 API。


**解决解构响应式对象的问题见:**[toRefs](/column/Vue/响应式API进阶/toRefs.html)