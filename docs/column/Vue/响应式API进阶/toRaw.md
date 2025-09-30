# toRaw：获取原始对象

[[toc]]

在 **Vue 3** 中，`toRaw` 是一个非常有用的函数，它来自于 **`@vue/reactivity`** 包，主要用于获取 **响应式对象**（如由 `reactive` 创建的对象）的 **原始对象**。

### 1. `toRaw` 的作用

Vue 3 中的响应式系统基于 **Proxy**，当你通过 `reactive` 函数将一个对象转化为响应式对象时，Vue 会使用 `Proxy` 来拦截对该对象的访问和修改。然而，这种响应式对象与原始对象（即创建时传入的对象）之间并没有直接的引用关系。`toRaw` 的作用就是 **获取这个原始对象**，绕过 Vue 的响应式代理。

### 2. `toRaw` 的用法

```javascript
import { reactive, toRaw } from "vue";

const original = { name: "Vue", version: 3 };
const reactiveObj = reactive(original);

console.log(reactiveObj.name); // 输出 'Vue'

// 使用 toRaw 获取原始对象
const raw = toRaw(reactiveObj);
console.log(raw); // 输出 { name: 'Vue', version: 3 }
console.log(raw === original); // 输出 true，说明 `raw` 是原始对象
```

在上面的例子中：

1. 我们通过 `reactive` 创建了一个响应式对象 `reactiveObj`，它与原始对象 `original` 共享数据。
2. 使用 `toRaw(reactiveObj)` 获取了这个对象的原始数据，`raw` 就是原始对象 `original`，通过比较可以确认它们是同一个对象。

### 3. `toRaw` 的应用场景

1. **避免响应式包装**：有时候你可能需要访问对象的原始数据，而不是通过响应式代理进行访问。这时，`toRaw` 可以帮助你绕过 Vue 的代理，访问到原始对象。

2. **调试**：在调试过程中，你可能希望查看组件的原始数据，而不被 Vue 的响应式代理包装影响。使用 `toRaw` 可以让你方便地查看对象的原始状态。

3. **与外部库集成**：一些外部库可能不理解 Vue 的响应式代理，直接操作响应式对象可能会导致问题。使用 `toRaw` 可以将响应式对象转回原始对象，避免与外部库的兼容性问题。

### 4. `toRaw` 的限制

- `toRaw` 只对 **响应式对象** 生效，普通的对象调用 `toRaw` 没有任何效果。
- 它并不会解除原始对象的代理，如果你在后续修改了响应式对象，Vue 仍然会追踪这些变更。

### 5. 示例：与外部库的兼容性

假设我们有一个第三方库，它不理解 Vue 的 Proxy，不能正确处理响应式对象。使用 `toRaw` 可以解决这个问题。

```javascript
import { reactive, toRaw } from "vue";

// 创建一个响应式对象
const reactiveObj = reactive({ name: "Vue" });

// 假设 thirdPartyLib 不理解 Proxy，需要原始对象
const thirdPartyLib = {
  updateName: (obj) => {
    const raw = toRaw(obj); // 使用 toRaw 获取原始对象
    console.log(raw.name); // 使用原始对象
  }
};

thirdPartyLib.updateName(reactiveObj);
```

在这个例子中，`thirdPartyLib` 期望一个普通的对象而不是响应式对象，因此我们通过 `toRaw` 获取原始对象。
