# useReducer：复杂状态管理 Hook

[[toc]]

> 当你的组件状态逻辑变得复杂、多个状态相互依赖时，  
> 使用多个 `useState` 会让代码难以维护。
>
> 这时候，`useReducer` 就是更优雅的解决方案。  
> 它让你用一种 **类似 Redux 的思维** 管理组件状态。

## 一、什么是 useReducer？

`useReducer` 是 React 提供的一个 Hook，用于以 **“状态 + 动作（state + action）”** 的方式管理状态。

> 简单来说，它是 `useState` 的替代方案，当状态逻辑复杂时，更容易组织和调试。

### 📘 基本语法：

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

| 参数           | 类型                          | 说明                |
| -------------- | ----------------------------- | ------------------- |
| `reducer`      | `(state, action) => newState` | 状态更新逻辑函数    |
| `initialState` | any                           | 初始状态            |
| 返回值         | `[state, dispatch]`           | 当前状态 + 派发函数 |

## 二、简单例子：计数器

```jsx
import React, { useReducer } from "react";

// 1️⃣ 定义 reducer 函数
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 2️⃣ 初始化 state
const initialState = { count: 0 };

// 3️⃣ 在组件中使用
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h2>计数：{state.count}</h2>
      <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>
    </div>
  );
}

export default Counter;
```

✅ 优点：

- 状态更新逻辑集中、可预测；
- 每个操作都有“类型（action.type）”；
- 容易扩展与调试。

## 三、useReducer 与 useState 的区别

| 对比项     | useState             | useReducer                            |
| ---------- | -------------------- | ------------------------------------- |
| 使用场景   | 状态简单             | 状态复杂、逻辑多分支                  |
| 状态更新   | 直接赋值             | 通过 `dispatch(action)`               |
| 可维护性   | 难以追踪多个状态变化 | 状态集中管理                          |
| 类似 Redux | ❌ 否                | ✅ 是                                 |
| 性能优化   | 简单                 | 支持 `lazy initialization` 等高级用法 |

👉 简单总结：

> `useState` 适合“一个按钮改一个状态”； `useReducer` 适合“多个状态随一个动作变化”。

## 四、reducer 的核心思想：纯函数

`reducer` 是一个**纯函数（Pure Function）**：

> 给定相同的输入，一定返回相同的输出，且**没有副作用**。

```js
function reducer(state, action) {
  // ❌ 不允许修改 state 本身
  // ✅ 必须返回一个新的 state
  return { ...state, count: state.count + 1 };
}
```

⚠️ 不要在 reducer 里做：

- 异步操作（如 fetch）
- DOM 操作
- 改变外部变量

这些属于“副作用”，应该在 `useEffect` 或中间层执行。

## 五、复杂状态示例：表单管理

```jsx
import React, { useReducer } from "react";

const initialState = { name: "", email: "", age: "" };

function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_FIELD",
      field: e.target.name,
      value: e.target.value
    });
  };

  return (
    <form>
      <input name="name" value={state.name} onChange={handleChange} placeholder="姓名" />
      <input name="email" value={state.email} onChange={handleChange} placeholder="邮箱" />
      <input name="age" value={state.age} onChange={handleChange} placeholder="年龄" />
      <button type="button" onClick={() => dispatch({ type: "RESET" })}>
        重置
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </form>
  );
}

export default Form;
```

✅ 优点：

- 所有表单逻辑集中在 reducer 中；
- 可轻松扩展更多字段；
- 结构清晰，便于维护。

## 六、惰性初始化（Lazy Initialization）

有时初始 state 的计算很耗时（例如从 localStorage 获取）。我们可以使用 useReducer 的第三个参数来**延迟初始化**。

```jsx
function init(initialCount) {
  return { count: initialCount * 2 };
}

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, 5, init); // 惰性初始化

  return (
    <div>
      <h2>Count: {state.count}</h2>
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>
    </div>
  );
}
```

💡 这样 `init` 只会在首次渲染执行一次，性能更好，避免了重复计算。

## 七、配合 Context 做全局状态管理

`useReducer` 还能配合 `useContext` 实现 **轻量级全局状态管理**（类似 Redux）。

```jsx
import React, { createContext, useReducer, useContext } from "react";

const StoreContext = createContext();

const initialState = { theme: "light" };

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME":
      return { theme: state.theme === "light" ? "dark" : "light" };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
```

然后在任意组件中使用：

```jsx
function ThemeSwitcher() {
  const { state, dispatch } = useStore();

  return <button onClick={() => dispatch({ type: "TOGGLE_THEME" })}>当前主题：{state.theme}</button>;
}
```

✅ 好处：

- 无需引入 Redux；
- 状态集中管理；
- 组件解耦、逻辑清晰。

## 八、最佳实践总结

| 建议                                 | 说明                   |
| ------------------------------------ | ---------------------- |
| ✅ 状态复杂时优先考虑 useReducer     | 结构清晰，可维护性高   |
| ✅ reducer 必须是纯函数              | 保证可预测性           |
| ✅ Action type 使用常量              | 避免拼写错误           |
| ✅ 结合 Context 实现全局状态         | 小型项目的轻量级 Redux |
| ❌ 不要在 reducer 中发请求或做副作用 | 会破坏纯函数特性       |
