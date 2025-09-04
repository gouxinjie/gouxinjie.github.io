# 深入理解 React 的 useContext Hook

## 什么是 useContext？

`useContext` 是 React 提供的一个内置 Hook，它允许你在函数组件中轻松访问` React 的 Context`。  
`Context` 提供了一种在组件树中共享数据的方式，而不必显式地通过每一层组件传递 `props。`

```jsx
const value = useContext(MyContext);
```

## 为什么需要 useContext？

在 React 应用中，数据通常通过 `props` 自上而下传递。但对于某些全局数据（如主题、用户认证信息等），逐层传递会变得繁琐。  
`Context` 提供了一种在组件间共享此类值的方式，而 `useContext` 则是在函数组件中消费这些 Context 值的简洁方法。

## 基本用法

### 1. 创建 Context

首先，我们需要创建一个 Context 对象：

```jsx
const MyContext = React.createContext(defaultValue);
```

### 2. 提供 Context 值

使用 `Context.Provider` 包裹需要访问该 Context 的组件：

```jsx
<MyContext.Provider value={/* 某个值 */}>
  {/* 子组件 */}
</MyContext.Provider>
```

### 3. 消费 Context 值

在函数组件中，使用 `useContext` 来获取 Context 值：

```jsx
function MyComponent() {
  const contextValue = useContext(MyContext);
  // 使用 contextValue...
}
```

## 完整示例

下面是一个主题切换的完整示例：

```jsx
import React, { useContext, useState } from "react";

// 1. 创建 Context
const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // 2. 提供 Context 值
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  // 3. 消费 Context 值
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff"
      }}
    >
      Toggle Theme (Current: {theme})
    </button>
  );
}

export default App;
```

::: tip useContext 的优势

1、**简化 Context 消费**：相比传统的 `Context.Consumer` 方式，`useContext` 使代码更加简洁。  
2、**避免嵌套地狱**：不再需要多层嵌套的 Consumer 组件。  
3、**与函数组件完美结合**：作为 Hook，它与 React 的函数组件范式高度契合。

:::

## 使用注意事项

1、**性能优化**：当 Context 值变化时，所有使用该 Context 的组件都会重新渲染。可以通过记忆化（memoization）来优化。<br/> 2、**默认值**：只有在组件树中没有匹配的 Provider 时，`useContext` 才会返回创建 Context 时传递的默认值。<br/> 3、**多个 Context**：一个组件可以使用多个 `useContext` 来消费不同的 Context：<br/>

```jsx
const user = useContext(UserContext);
const theme = useContext(ThemeContext);
const locale = useContext(LocaleContext);
```

4、**与 useReducer 结合**：`useContext` 常与 `useReducer` 结合使用，实现小型的状态管理：

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
<MyContext.Provider value={{ state, dispatch }}>{/* 子组件 */}</MyContext.Provider>;
```