# Vue 依赖注入(provide/inject)：组件跨层级通信的优雅方案

[[toc]]

`provide` 和 `inject` 是 Vue 3 提供的新特性，主要用于在 **组件树** 中 **祖先组件与后代组件之间共享数据**。它们是一种 **依赖注入**（Dependency Injection，简称 DI）机制，用于避免通过逐层传递 props 或使用 `vuex` 等全局状态管理工具来共享数据。

::: tip

这对 **深层嵌套组件** 或 **跨层级组件** 的数据传递非常有用，能够简化组件间的通信。

:::

## 1. `provide` 和 `inject` 的基本概念

- **`provide`**：在祖先组件中定义并提供数据或方法。
- **`inject`**：在后代组件中注入祖先组件提供的数据或方法。

这种方式解决了 **prop drilling**（逐层传递 props）的问题，使得跨层级组件的数据共享变得更容易。

## 2. `provide` 和 `inject` 的工作原理

### 2.1. `provide`

`provide` 让你在祖先组件中提供一个值，后代组件可以使用 `inject` 来获取这个值。通过 `provide` 提供的数据可以是 **任何类型的值**，包括对象、数组、方法等。

### 2.2. `inject`

`inject` 用于在后代组件中接收祖先组件通过 `provide` 提供的数据。`inject` 只能用于 **后代组件**，而且不能直接修改从 `provide` 获取的数据。

## 3. `provide` 和 `inject` 的基本用法

### 3.1. 在祖先组件中使用 `provide`

```vue
<template>
  <div>
    <h2>祖先组件</h2>
    <p>{{ message }}</p>
    <child></child>
    <!-- 子组件 -->
  </div>
</template>

<script>
import { provide } from "vue";
import Child from "./Child.vue";

export default {
  components: { Child },
  setup() {
    const message = "Hello from the parent!";
    provide("message", message); // 提供数据给后代组件

    return { message };
  }
};
</script>
```

### 3.2. 在后代组件中使用 `inject`

```vue
<template>
  <div>
    <h3>子组件</h3>
    <p>{{ injectedMessage }}</p>
    <!-- 获取祖先组件的数据 -->
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const injectedMessage = inject("message"); // 注入祖先组件提供的数据

    return { injectedMessage };
  }
};
</script>
```

### 解释：

- **祖先组件**：使用 `provide('message', message)` 来提供数据 `message`。
- **子组件**：使用 `inject('message')` 来获取祖先组件提供的 `message`。

这样，`provide` 和 `inject` 让你不需要逐层传递 `props`，也不需要使用 Vuex 这种全局状态管理工具，在组件树之间共享数据变得更加便捷。

## 4. `provide` 和 `inject` 进阶用法

### 4.1. 提供和注入对象

`provide` 和 `inject` 可以传递一个对象，这对于共享复杂的数据或方法特别有用。

#### 示例：提供和注入一个对象

```vue
<template>
  <div>
    <h2>祖先组件</h2>
    <p>{{ message }}</p>
    <child></child>
  </div>
</template>

<script>
import { provide } from "vue";
import Child from "./Child.vue";

export default {
  components: { Child },
  setup() {
    const state = reactive({
      message: "Hello from the parent!",
      counter: 0
    });

    provide("state", state); // 提供一个对象

    return { state };
  }
};
</script>
```

子组件：

```vue
<template>
  <div>
    <h3>子组件</h3>
    <p>{{ injectedState.message }}</p>
    <p>Counter: {{ injectedState.counter }}</p>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const injectedState = inject("state"); // 注入对象

    return { injectedState };
  }
};
</script>
```

### 4.2. `inject` 的默认值

当使用 `inject` 时，如果祖先组件没有提供相应的值，你可以设置一个 **默认值**，这样后代组件就不会报错。

#### 示例：设置默认值

```vue
<template>
  <div>
    <h3>子组件</h3>
    <p>{{ injectedMessage }}</p>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const injectedMessage = inject("message", "Default message"); // 如果没有提供 `message`，使用默认值

    return { injectedMessage };
  }
};
</script>
```

如果祖先组件没有提供 `message`，则子组件会使用默认值 `'Default message'`。

### 4.3. 动态更新 `provide` 的值

`provide` 提供的值是 **响应式** 的，如果提供的值是响应式对象（如 `ref`、`reactive`），那么在后代组件中注入的值也会自动更新。

#### 示例：动态更新 `provide` 的值

```vue
<template>
  <div>
    <h2>祖先组件</h2>
    <p>{{ state.counter }}</p>
    <button @click="incrementCounter">Increment</button>
    <child></child>
  </div>
</template>

<script>
import { provide, reactive } from "vue";
import Child from "./Child.vue";

export default {
  components: { Child },
  setup() {
    const state = reactive({ counter: 0 });

    provide("state", state); // 提供响应式对象

    const incrementCounter = () => {
      state.counter++; // 更新 state 中的数据
    };

    return { state, incrementCounter };
  }
};
</script>
```

子组件：

```vue
<template>
  <div>
    <h3>子组件</h3>
    <p>Counter in child: {{ injectedState.counter }}</p>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const injectedState = inject("state"); // 注入响应式对象

    return { injectedState };
  }
};
</script>
```

在这个例子中，`state` 是一个响应式对象，`counter` 的变化会自动在祖先组件和子组件之间同步更新。

### 4.4. 在组件间共享方法

除了共享数据，`provide` 和 `inject` 还可以用来共享方法或事件处理函数。

#### 示例：共享方法

```vue
<template>
  <div>
    <h2>祖先组件</h2>
    <button @click="incrementCounter">Increment Counter</button>
    <child></child>
  </div>
</template>

<script>
import { provide, reactive } from "vue";
import Child from "./Child.vue";

export default {
  components: { Child },
  setup() {
    const state = reactive({ counter: 0 });

    const incrementCounter = () => {
      state.counter++;
    };

    provide("incrementCounter", incrementCounter); // 提供方法

    return { incrementCounter };
  }
};
</script>
```

子组件：

```vue
<template>
  <div>
    <h3>子组件</h3>
    <button @click="incrementCounter">Increment Counter</button>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const incrementCounter = inject("incrementCounter"); // 注入方法

    return { incrementCounter };
  }
};
</script>
```

在这个例子中，祖先组件提供了一个 `incrementCounter` 方法，子组件注入并使用它来更新 `counter`。

## 5. 总结

`provide` 和 `inject` 是 Vue 中用于 **跨层级组件通信** 的强大工具，它们简化了在深层嵌套组件中传递数据的过程。通过 `provide`，你可以在祖先组件中提供数据或方法，后代组件通过 `inject` 注入并使用它们。

- `provide` 用于在祖先组件中提供数据或方法。
- `inject` 用于在后代组件中注入祖先组件提供的数据或方法。
- `provide` 和 `inject` 是响应式的，可以在组件树中共享响应式对象和方法。
- 如果祖先组件没有提供对应的数据，`inject` 可以使用默认值。

不过需要注意的是，`provide` 和 `inject` 并不适合用于全局状态管理，通常用于跨层级传递数据。如果你需要全局状态管理，仍然推荐使用 Vuex。
