# Immer 库使用

## 一、什么是 Immer？

`Immer` 是一个小巧但功能强大的` JavaScript 库（仅 3KB）`，它通过写时拷贝`（Copy-on-Write）`机制，让开发者可以用可变（mutable）的方式操作不可变（immutable）数据，大幅简化了` Redux、React` 等场景下的状态更新逻辑。

::: tip Immer 的核心工作原理基于三个概念

1，当前状态（currentState）：原始不可变数据  
2，草稿状态（draftState）：可自由修改的代理对象  
3，下一个状态（nextState）：基于草稿变更生成的新不可变对象

:::

```tsx
import produce from "immer";
const nextState = produce(currentState, (draftState) => {
  // 在这里可以"直接修改"draftState
  draftState.push({ todo: "Learn Immer" });
  draftState[1].done = true;
});
```

## 二、为什么需要 Immer？

在 React 中使用 Immer 主要解决以下核心问题：

1. **简化不可变更新**：React 要求状态不可变，但原生 JavaScript 的不可变操作非常繁琐
2. **避免浅拷贝陷阱**：手动使用 `...` 展开运算符容易遗漏嵌套属性
3. **提升代码可读性**：用可变语法写不可变逻辑，更符合直觉
4. **减少错误**：避免意外直接修改原状态
5. **性能优化**：结构共享（只复制变化的部分

## 三、使用案例

### 3.1 深度嵌套对象

```ts
// 原始状态
const state = {
  user: {
    id: 1,
    profile: {
      name: "Alice",
      address: {
        city: "New York",
        coordinates: {
          lat: 40.7128,
          lng: -74.006
        }
      }
    }
  }
};

// 传统方式（容易出错）
const newState = {
  ...state,
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      address: {
        ...state.user.profile.address,
        city: "San Francisco"
      }
    }
  }
};

// 使用Immer
const newState = produce(state, (draft) => {
  draft.user.profile.address.city = "San Francisco"; // Highlighted 直接修改！
});
```

### 3.2 数组操作

```ts
const state = {
  todos: [
    { id: 1, text: "Learn React", done: false },
    { id: 2, text: "Learn Immer", done: false }
  ]
};

// 传统方式
const newState = {
  ...state,
  todos: state.todos.map((todo) => (todo.id === 2 ? { ...todo, done: true } : todo))
};

// 使用Immer
const newState = produce(state, (draft) => {
  const todo = draft.todos.find((t) => t.id === 2);
  if (todo) todo.done = true; // 直接查找修改
});
```

### 3.3 同时修改多个嵌套字段

```ts
const state = {
  cart: {
    items: [
      { id: 1, name: "Laptop", quantity: 1 },
      { id: 2, name: "Mouse", quantity: 2 }
    ],
    discount: 0
  }
};

// 使用Immer一次性完成复杂修改
const newState = produce(state, (draft) => {
  // 修改数组元素
  draft.cart.items[0].quantity += 1;
  // 添加新项目
  draft.cart.items.push({ id: 3, name: "Keyboard", quantity: 1 });
  // 修改其他字段
  draft.cart.discount = 0.1;
  // 条件修改
  if (draft.cart.items.length > 2) {
    draft.cart.freeShipping = true;
  }
});
```

### 3.4 删除/重命名属性

```ts
const state = {
  settings: {
    theme: "dark",
    fontSize: 16,
    oldSetting: "deprecated"
  }
};

// 使用Immer
const newState = produce(state, (draft) => {
  // 删除属性
  delete draft.settings.oldSetting;

  // 重命名属性
  draft.settings.uiFontSize = draft.settings.fontSize;
  delete draft.settings.fontSize;
});
```
