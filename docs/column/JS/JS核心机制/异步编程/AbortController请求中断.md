# JavaScript 的 AbortController：请求中止

[[toc]]

## 一、介绍

`AbortController` 是 `JavaScript` 提供的一个强大工具，它允许开发者中止一个或多个 `Web` 请求。这个 API 最初是为了 `fetch` 请求设计的，但现在已经被许多其他浏览器 API 和第三方库所采用。

::: tip `AbortController` 的主要用途包括

- 取消不再需要的 `fetch` 请求；
- 清理长时间运行的操作；
- 实现请求超时；
- 处理组件卸载时的资源清理；

:::

## 二、基本使用

### 2.1 创建 AbortController

```javascript
const controller = new AbortController();
const signal = controller.signal;
```

### 2.2 与 fetch 结合使用

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch("https://api.example.com/data", { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("请求被中止");
    } else {
      console.error("请求错误:", err);
    }
  });

// 在需要时中止请求
controller.abort();
```

## 三、常用场景

### 3.1 用户触发的取消

```javascript
const controller = new AbortController();
const fetchButton = document.getElementById("fetch-button");
const cancelButton = document.getElementById("cancel-button");

fetchButton.addEventListener("click", () => {
  fetch("https://api.example.com/data", { signal: controller.signal }).then(/* ... */).catch(/* ... */);
});

cancelButton.addEventListener("click", () => {
  controller.abort();
});
```

### 3.2 请求超时

```javascript
function fetchWithTimeout(url, options, timeout = 5000) {
  const controller = new AbortController();
  const signal = controller.signal;

  // 设置超时
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal }).finally(() => clearTimeout(timeoutId));
}

fetchWithTimeout("https://api.example.com/data", {}, 3000)
  .then(/* ... */)
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("请求超时");
    }
  });
```

### 3.3 React 组件卸载时取消请求

```jsx
import { useEffect, useState } from "react";

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://api.example.com/data", { signal: controller.signal })
      .then((response) => response.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("获取数据失败:", err);
        }
      });

    return () => controller.abort();
  }, []);

  return <div>{data ? JSON.stringify(data) : "加载中..."}</div>;
}
```

### 3.4 并行请求的统一取消

```javascript
const controller = new AbortController();
const signal = controller.signal;

const requests = [fetch("/api/data1", { signal }), fetch("/api/data2", { signal }), fetch("/api/data3", { signal })];

Promise.all(requests)
  .then(/* 处理所有响应 */)
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("所有请求已被取消");
    }
  });

// 取消所有请求
controller.abort();
```

## 四、高级细节

### 4.1 信号状态

`signal.aborted` 属性可以检查信号是否已被中止：

```javascript
const controller = new AbortController();
console.log(controller.signal.aborted); // false

controller.abort();
console.log(controller.signal.aborted); // true
```

### 4.2 事件监听

可以监听 abort 事件：

```javascript
const controller = new AbortController();

controller.signal.addEventListener("abort", () => {
  console.log("请求被中止");
});

controller.abort();
```

### 4.3 重用与限制

一个 AbortController 只能中止一次，之后就不能再使用了：

```javascript
const controller = new AbortController();
controller.abort();
controller.abort(); // 第二次调用不会有任何效果
```

如果需要多次中止操作，需要创建新的 AbortController 实例。

### 4.4 与其他 API 集成

除了 fetch，AbortController 还可以用于其他 API：

```javascript
// Web APIs
const videoStream = await navigator.mediaDevices.getUserMedia({
  video: true,
  signal: controller.signal
});

// Axios
const source = axios.CancelToken.source();
axios.get("/api/data", {
  cancelToken: source.token
});
source.cancel();
```

### 4.5 自定义中止逻辑

你可以基于 AbortSignal 实现自己的可中止操作：

```javascript
function doTask(signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve("任务完成"), 5000);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("任务被中止", "AbortError"));
    });

    if (signal.aborted) {
      clearTimeout(timer);
      reject(new DOMException("任务被中止", "AbortError"));
    }
  });
}

const controller = new AbortController();
doTask(controller.signal)
  .then(console.log)
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("任务被中止");
    }
  });

// 中止任务
controller.abort();
```
