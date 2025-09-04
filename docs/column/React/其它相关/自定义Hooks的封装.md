# 自定义 Hooks 的封装

## 1. 窗口尺寸监听 Hook

```tsx
import { useState, useEffect } from "react";
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  console.log(1);
  useEffect(() => {
    const handleResize = () => {
      console.log(2);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 空数组表示只在挂载和卸载时运行
  console.log(3);

  return windowSize;
}

export default useWindowSize;
```

**组件中使用：**

```tsx
import useWindowSize from "./useWindowSize";
function ResponsiveComponent() {
  const { width } = useWindowSize();
  return <div>{width < 768 ? <p>Mobile view</p> : <p>Desktop view</p>}</div>;
}
```

## 2. 本地存储 Hook

```tsx
import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
export default useLocalStorage;
```

**组件中使用：**

```tsx
// 使用示例
function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div>
      <button onClick={toggleTheme}>Switch to {theme === "light" ? "Dark" : "Light"} Theme</button>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```
