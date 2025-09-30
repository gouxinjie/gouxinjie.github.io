# markRaw：标记为非响应式对象

[[toc]]

在 **Vue 3** 中，`markRaw` 也是一个来自 `@vue/reactivity` 包的函数，它与 `reactive` 和 `ref` 类似，但它的作用是 **标记某个对象为非响应式**，即使这个对象被传递给 Vue 的响应式系统，Vue 也不会将其转化为响应式对象。

### 1. `markRaw` 的作用

`markRaw` 用于标记一个对象，使其不会被 Vue 的响应式系统代理。这意味着它不会被 `Proxy` 包装，也不会响应数据变化，因此 Vue 不会在该对象上追踪依赖和触发更新。`markRaw` 对某个对象进行标记后，Vue 在处理该对象时会跳过它，不会做任何响应式的代理。

### 2. `markRaw` 的用法

```javascript
import { markRaw } from "vue";

const obj = { name: "Vue", version: 3 };

// 将对象标记为非响应式
const rawObj = markRaw(obj);

console.log(rawObj); // { name: 'Vue', version: 3 }
```

在上面的例子中，`obj` 是一个普通的 JavaScript 对象，通过 `markRaw` 将它标记为非响应式对象。即使将其传递到 Vue 的响应式系统中，它也不会变成响应式对象。

### 3. `markRaw` 的应用场景

#### 1. **性能优化**

当你有一些 **不需要响应式** 的数据，或者这些数据不参与组件更新时，你可以使用 `markRaw` 来避免 Vue 追踪这些数据的变化，从而 **提高性能**。这对于一些大型对象或外部库中的数据非常有用，尤其是当你确定这些数据不会改变时。

#### 2. **与第三方库结合**

有时你可能在使用外部库或组件时，它们并不需要响应式的功能。为了避免 Vue 对这些对象进行不必要的响应式代理，可以通过 `markRaw` 来标记它们，防止 Vue 进行额外的处理。例如，某些图表库、地图插件等，通常不需要与 Vue 的响应式系统交互。

#### 3. **避免深度响应式包装**

Vue 的响应式系统通常会递归地将对象的所有嵌套属性都转化为响应式对象。如果你希望某个对象或其嵌套的部分 **保持原样**（不做响应式包装），可以使用 `markRaw` 来标记。

#### 4. **减少不必要的性能开销**

响应式系统需要开销，尤其是在对象很大或数据频繁变化时。如果你知道某些数据不需要响应式支持，可以通过 `markRaw` 来减少 Vue 对这些对象的追踪。

### 4. 注意事项

- `markRaw` 不会递归地将对象的嵌套属性转为非响应式，如果对象嵌套了响应式对象，那么它们仍然会被 Vue 处理为响应式。
- `markRaw` 只能用于对象，而不能用于基础类型（如字符串、数字、布尔值等）。
- 标记为非响应式后，`markRaw` 标记的对象 **不会被 Vue 的响应式系统追踪**，因此它不会触发视图更新。

### 5. 示例：在 Vue 组件中使用 `markRaw`

```javascript
import { defineComponent, markRaw, reactive } from "vue";

export default defineComponent({
  setup() {
    // 创建一个响应式对象
    const state = reactive({
      user: { name: "Vue", version: 3 },
      settings: markRaw({ theme: "dark", language: "en" }) // 使用 markRaw
    });

    // `settings` 不会是响应式对象
    console.log(state.settings); // { theme: 'dark', language: 'en' }

    return {
      state
    };
  }
});
```

在这个例子中，`settings` 被标记为非响应式对象，Vue 不会对它进行响应式处理。即使 `state` 是响应式的，`settings` 仍然是普通对象。
