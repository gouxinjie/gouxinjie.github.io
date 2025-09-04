# Vue watchEffect ：响应式副作用管理

## 一、核心概念与基本用法

`watchEffect` 是 Vue 3 组合式 API 提供的一个强大的响应式副作用管理工具，它会**立即执行传入的函数**，并**自动追踪其依赖**的响应式数据，当依赖变化时重新执行。

### 基础示例

```javascript
import { ref, watchEffect } from "vue";

const count = ref(0);

// 自动追踪count的变化
watchEffect(() => {
  console.log("count值:", count.value);
});

// 触发重新执行
count.value++;
```

## 二、关键特性解析

| 特性             | 说明                                               |
| ---------------- | -------------------------------------------------- |
| **立即执行**     | 初始化时立即运行一次                               |
| **自动依赖收集** | 自动检测函数内使用的响应式依赖                     |
| **非惰性**       | 不同于 watch，不需要指定明确的依赖源               |
| **清理机制**     | 可以返回一个清理函数，在重新运行前或停止监听时调用 |

## 三、典型应用场景

### 1. DOM 操作副作用

```javascript
const elementRef = ref(null);

watchEffect(() => {
  if (elementRef.value) {
    // 基于响应式状态操作DOM
    elementRef.value.style.color = count.value % 2 === 0 ? "red" : "blue";
  }
});
```

### 2. 异步操作管理

```javascript
const userId = ref(1);

watchEffect(async (onCleanup) => {
  const cancelToken = new AbortController();
  onCleanup(() => cancelToken.abort()); // 清理前一个请求

  const data = await fetchUser(userId.value, cancelToken.signal);
  userData.value = data;
});
```

### 3. 控制台调试

```javascript
// 开发环境下自动打印状态变化
watchEffect(() => {
  if (import.meta.env.DEV) {
    console.log("当前状态:", {
      count: count.value,
      user: user.value
    });
  }
});
```

## 四、高级用法与技巧

### 1. 清理副作用

```javascript
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    // 执行操作
  }, 1000);

  onCleanup(() => clearTimeout(timer));
});
```

### 2. 控制执行时机

```javascript
import { flushSync } from "vue";

watchEffect(
  () => {
    // 副作用代码
  },
  {
    flush: "post" // 'pre' | 'post' | 'sync'
  }
);
```

### 3. 调试选项

```javascript
watchEffect(
  () => {
    /* ... */
  },
  {
    onTrack(e) {
      debugger;
    }, // 依赖被追踪时
    onTrigger(e) {
      debugger;
    } // 依赖变化触发回调时
  }
);
```

## 五、与 watch 的对比

| 特性         | watchEffect          | watch                    |
| ------------ | -------------------- | ------------------------ |
| **依赖收集** | 自动                 | 显式指定                 |
| **初始执行** | 立即执行             | 可配置(immediate 选项)   |
| **使用场景** | 不关心具体依赖的变化 | 需要知道具体哪个依赖变化 |
| **性能**     | 更轻量               | 稍重(需要维护依赖列表)   |

## 六、最佳实践

1. **避免过度使用**：只在确实需要副作用时使用
2. **合理清理**：及时清理定时器、事件监听等
3. **性能敏感操作**：考虑使用 `flush: 'post'`
4. **模块化**：将复杂副作用提取到自定义 hook 中

```javascript
// 提取为自定义hook
function useWindowSize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  watchEffect((onCleanup) => {
    const handler = () => {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    };
    window.addEventListener("resize", handler);
    onCleanup(() => window.removeEventListener("resize", handler));
  });

  return { width, height };
}
```