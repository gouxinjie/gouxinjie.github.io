# toRefs：将响应式对象转换为普通对象，每个属性都是 ref

[[toc]]

## 1. 介绍

在 Vue 3 中，`toRefs` 是一个非常有用的 API，它可以将一个响应式对象中的属性转换为 **单独的响应式引用**。这使得我们可以将一个响应式对象的属性解构出来，并且依然保持响应式特性。

通常情况下，当我们使用 `reactive` 来创建响应式对象时，我们会遇到 **解构** 的问题——如果直接解构对象的属性，那么解构出来的属性就不再是响应式的了。`toRefs` 解决了这个问题，它可以让你在解构时保持属性的响应性。

**语法**

```javascript
import { toRefs } from "vue";

const state = reactive({
  count: 0,
  name: "Vue"
});

const { count, name } = toRefs(state); // 使用 toRefs 保持响应式
```

## 2. 为什么 toRefs 可以解决解构响应式对象的问题

### 1. Vue 3 响应式系统的工作原理

Vue 3 使用了 **`Proxy`** 来处理响应式数据。这个 Proxy 对象会拦截对数据的所有访问和修改操作，并自动追踪依赖。当你修改响应式对象的属性时，Vue 会知道这个属性的变化并自动更新视图。

例如，以下是一个简单的响应式对象：

```javascript
const state = reactive({
  count: 0,
  name: "Vue"
});
```

`state` 是一个 **响应式对象**，对其属性的任何修改都会自动触发视图更新。

### 2. 解构响应式对象时丧失响应性

当你直接解构响应式对象时，解构出来的变量 **不再是响应式的**，而是普通的 JavaScript 变量。这是因为解构操作会导致对象的 **属性** 直接脱离原始的 `Proxy` 对象，从而不再受到 Vue 的响应式系统的控制。

例如：

```javascript
const { count, name } = state; // 直接解构
```

在这段代码中，`count` 和 `name` 不再是响应式的，它们只是普通的变量。这意味着它们不再能自动更新视图。如果你修改了 `count`，视图不会更新。

```javascript
count = 1; // 直接修改，不会触发视图更新
```

### 3. `toRefs` 的作用

`toRefs` 实现的关键是将每个对象属性转化为 `ref`，而 `ref` 本身是一个 **响应式容器**，它能保持 `.value` 的响应性特性。通过 `ref` 对象访问数据时，会自动追踪依赖并触发视图更新。

#### 示例：使用 `toRefs` 保持解构后的响应性

```javascript
import { reactive, toRefs } from "vue";

const state = reactive({
  count: 0,
  name: "Vue"
});

const { count, name } = toRefs(state);

count.value++; // 修改 count 会触发视图更新
```

在这个例子中，`toRefs(state)` 返回了一个包含 `ref` 的对象。每个属性都变成了独立的 `ref`，因此它们仍然是响应式的，修改它们会自动触发视图更新。

### 4. 为什么 `toRefs` 可以保持响应性

- **`reactive`** 使对象的所有属性都变成了 **深度响应式**，每个属性都受 Vue 的响应式系统的管理。
- **`toRefs`** 的作用是 **将对象的每个属性都转换为单独的 `ref`**。由于 `ref` 本身是响应式的，它会自动收集依赖并触发更新。
- **`ref` 的特性**：`ref` 会保持对 `.value` 的响应式处理，因此当解构对象的属性时，Vue 会继续追踪这些属性的变化，并确保视图更新。
