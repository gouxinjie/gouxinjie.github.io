# Vue KeepAlive：优化组件状态缓存

[[toc]]

`KeepAlive` 是 Vue 提供的一个内置组件，主要用于 **缓存** 组件的状态。当组件被切换时，`KeepAlive` 可以保持组件的状态，而不是销毁并重新创建它们，适用于页面切换时 **需要保留状态** 的场景，如表单、输入框等内容。从而提升应用性能并改善用户体验。

在 SPA（单页应用）中，通常有许多页面或视图，用户在不同页面之间切换时，默认情况下组件会被销毁并重新创建。这样做虽然能保证每次进入页面时都渲染最新的内容，但如果某些页面的状态非常复杂，或者页面中有大量的数据加载与计算，那么每次切换都重新创建组件可能会导致性能问题。

## 1. `KeepAlive` 的基本用法

### 示例：基础用法

```vue
<template>
  <div>
    <button @click="currentPage = 'page1'">Page 1</button>
    <button @click="currentPage = 'page2'">Page 2</button>

    <keep-alive>
      <component :is="currentPage" />
    </keep-alive>
  </div>
</template>

<script>
import Page1 from "./Page1.vue";
import Page2 from "./Page2.vue";

export default {
  components: { Page1, Page2 },
  data() {
    return {
      currentPage: "page1"
    };
  }
};
</script>
```

### 解释：

- `KeepAlive` 包裹住 `component`，从而缓存 `Page1` 和 `Page2` 组件的状态。
- 当用户切换页面时，`Page1` 和 `Page2` 不会被销毁，而是会被缓存，保留其状态。

## 2. `KeepAlive` 的工作原理

Vue 通过 `KeepAlive` 组件为 **动态组件** 提供缓存支持。当组件被包裹在 `KeepAlive` 中时，它会缓存已经渲染的组件实例。下次访问该组件时，Vue 会 **复用已缓存的组件**，而不是重新创建新的实例。

### 工作流程：

1. 组件渲染时，`KeepAlive` 会通过 **缓存机制** 维护每个动态组件的实例。
2. 当组件离开视图时，`KeepAlive` 会将该组件的实例保存到内存中。
3. 组件再次进入视图时，`KeepAlive` 会 **复用缓存的实例**，并恢复它的状态。

## 3. `KeepAlive` 的属性

`KeepAlive` 组件提供了一些 **属性**，以控制缓存的行为。

### 3.1. `include` 和 `exclude`

- **`include`**：指定缓存哪些组件。可以使用字符串、正则表达式或数组来指定。
- **`exclude`**：指定不缓存哪些组件，功能与 `include` 类似。

这两个属性可以让你 **灵活控制哪些组件应该被缓存，哪些组件应该被排除**。

### 示例：`include` 和 `exclude`

```vue
<template>
  <div>
    <button @click="currentPage = 'page1'">Page 1</button>
    <button @click="currentPage = 'page2'">Page 2</button>
    <button @click="currentPage = 'page3'">Page 3</button>

    <keep-alive :include="['page1']">
      <component :is="currentPage" />
    </keep-alive>
  </div>
</template>

<script>
import Page1 from "./Page1.vue";
import Page2 from "./Page2.vue";
import Page3 from "./Page3.vue";

export default {
  components: { Page1, Page2, Page3 },
  data() {
    return {
      currentPage: "page1"
    };
  }
};
</script>
```

### 解释：

- `include="['page1']"` 只缓存 `Page1` 组件。当切换到 `Page2` 或 `Page3` 时，它们不会被缓存。

### 3.2. `max` 属性

**`max`** 属性指定了 **缓存的最大数量**，当缓存数量超过这个数时，最旧的组件将被销毁。适用于有大量动态组件的情况，防止缓存过多组件占用内存。

### 示例：`max`

```vue
<template>
  <div>
    <button @click="currentPage = 'page1'">Page 1</button>
    <button @click="currentPage = 'page2'">Page 2</button>

    <keep-alive :max="2">
      <component :is="currentPage" />
    </keep-alive>
  </div>
</template>
```

### 解释：

- `max="2"` 限制最多缓存 2 个组件，当缓存数达到上限时，最早的缓存组件会被销毁。

## 4. `KeepAlive` 的生命周期钩子

在 `KeepAlive` 中，组件在 **激活**（进入视图）和 **停用**（离开视图）时，都会触发生命周期钩子。Vue 提供了两个生命周期钩子来帮助开发者处理缓存组件的状态：

- **`activated`**：当组件被激活并添加到 DOM 时调用。
- **`deactivated`**：当组件被停用并从 DOM 中移除时调用。

这些钩子通常用于 **重置组件的状态** 或 **清理资源**。

### 示例：使用 `activated` 和 `deactivated`

```vue
<template>
  <keep-alive>
    <component :is="currentPage" />
  </keep-alive>
</template>

<script>
import { ref } from "vue";
import Page1 from "./Page1.vue";
import Page2 from "./Page2.vue";

export default {
  components: { Page1, Page2 },
  data() {
    return {
      currentPage: ref("page1")
    };
  },
  methods: {
    activated() {
      console.log(`${this.currentPage} activated`);
    },
    deactivated() {
      console.log(`${this.currentPage} deactivated`);
    }
  }
};
</script>
```

### 解释：

- `activated` 和 `deactivated` 会在组件进入和离开视图时分别触发，你可以在这两个钩子中做一些状态重置或清理操作。

## 5. `KeepAlive` 的应用场景

`KeepAlive` 主要用于 **需要频繁切换的组件**，例如：

- **页面切换**：在多页面应用中，切换页面时不希望丢失某些页面的状态。
- **表单**：在表单页面中，表单的输入状态可能需要保留。
- **选项卡式布局**：在选项卡布局中，切换选项卡时不希望重新加载每个选项卡的内容。

### 示例：常见应用

假设有一个应用，包含多个页面，用户切换页面时，应用通过 `KeepAlive` 来保持页面状态，而不是重新加载页面。

```vue
<template>
  <div>
    <keep-alive :include="['page1', 'page2']">
      <component :is="currentPage" />
    </keep-alive>
  </div>
</template>

<script>
import { ref } from "vue";
import Page1 from "./Page1.vue";
import Page2 from "./Page2.vue";
import Page3 from "./Page3.vue";

export default {
  components: { Page1, Page2, Page3 },
  data() {
    return {
      currentPage: ref("page1")
    };
  }
};
</script>
```

在这个例子中，只有 `Page1` 和 `Page2` 被缓存，`Page3` 每次切换时都会重新加载。
