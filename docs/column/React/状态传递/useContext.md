# React 中的 useContext 解析：共享状态与全局数据的利器

> 在 React 中，数据通常是通过 props 自上而下传递的（父 → 子）。  
> 当组件层级变深时，“逐层传递 props”会变得繁琐且难维护。
>
> `useContext` 是 React 提供的 Hook，用于让 **任意组件轻松访问共享数据**，无需逐层传递。

## 一、什么是 useContext？

### 📘 基本定义：

```tsx
const value = useContext(Context);
```

| 参数      | 类型               | 说明                            |
| --------- | ------------------ | ------------------------------- |
| `Context` | React Context 对象 | 由 `React.createContext()` 创建 |
| 返回值    | Context 的当前值   | 来自最近的 `<Context.Provider>` |

> 当 Context 的值发生变化时，所有使用 `useContext` 的组件会**自动重新渲染**。

## 二、基础示例：主题切换

### 1️⃣ 创建 Context

```jsx
import React, { createContext, useState } from "react";

export const ThemeContext = createContext("light"); // 默认值
```

### 2️⃣ 提供 Context 值

```jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
```

### 3️⃣ 消费 Context 值

```jsx
import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === "light" ? "#eee" : "#333",
        color: theme === "light" ? "#000" : "#fff"
      }}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      切换主题
    </button>
  );
}
```

✅ 这样，无论 `ThemedButton` 在组件树的哪一层，都能直接访问共享状态 `theme` 和 `setTheme`，无需父组件传递 props。

## 三、useContext 与传统 props 传递对比

| 对比点         | props 传递       | useContext               |
| -------------- | ---------------- | ------------------------ |
| 数据传递方式   | 逐层传递         | 任意组件直接访问         |
| 适合场景       | 简单组件树       | 深层组件共享状态         |
| 灵活性         | 受限             | 高，跨层级访问           |
| 可维护性       | 差，层级深时复杂 | 高，减少 prop drilling   |
| 是否触发重渲染 | 仅父组件状态变更 | Context 值变化时重新渲染 |

## 四、useContext 与 Context.Provider

- Context **必须配合 Provider** 才能提供数据；
- Provider 可以嵌套，最近的 Provider 的值优先；

```jsx
<ThemeContext.Provider value="light">
  <ThemeContext.Provider value="dark">
    <Child /> {/* 这里 useContext 访问到的是 "dark" */}
  </ThemeContext.Provider>
</ThemeContext.Provider>
```

## 五、useContext 的注意事项

1️⃣ **只读取 context 值，不修改 context 本身**

- 修改值应该在 Provider 内部通过 `setState` 或其他状态管理函数。

2️⃣ **Context 值变化会导致组件重新渲染**

- 如果传入对象字面量，如 `{ theme, setTheme }`，建议用 `useMemo` 优化：

```jsx
const value = useMemo(() => ({ theme, setTheme }), [theme]);
```

3️⃣ **不要在 render 中创建 Context**

- 应在组件外部或 Provider 组件中创建。

## 六、实战场景

### 1️⃣ 全局主题

```jsx
const ThemeContext = createContext();
```

- 存储 theme、切换函数
- 任意组件通过 `useContext` 访问和修改

### 2️⃣ 用户登录信息

```jsx
const UserContext = createContext();
```

- 存储用户信息、token
- 页面各处直接读取

### 3️⃣ 多语言 i18n

```jsx
const LocaleContext = createContext("zh");
```

- 存储当前语言、切换函数
- 文本组件直接读取 locale

## 七、useContext 与 Redux / Zustand 的对比

| 特性         | useContext           | Redux / Zustand |
| ------------ | -------------------- | --------------- |
| 使用成本     | ✅ 内置 Hook         | ❌ 需额外库     |
| 性能优化     | ⚠️ 容易全组件渲染    | ✅ 可细粒度订阅 |
| 数据共享范围 | 全局 / Provider 范围 | 全局可跨模块    |
| 适合项目     | 小中型项目           | 大型复杂项目    |

💡 建议：

- 小型项目或少量共享状态 → `useContext` 足够
- 复杂状态管理、多模块共享 → 考虑 Redux / Zustand
