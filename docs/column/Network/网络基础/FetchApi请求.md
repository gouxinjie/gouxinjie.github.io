# 深入理解 Fetch API：现代前端网络请求指南

`Fetch API` 是浏览器提供的 现代化网络请求接口，用于替代传统的 `XMLHttpRequest（XHR）`。它基于 `Promise` 设计，语法更简洁，功能更强大，并且是 Web 标准的一部分（WHATWG Living Standard）。

## 一、Fetch API 基础

### 1.1 基本请求

最简单的 GET 请求示例：

```javascript
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### 1.2 请求方法对比

| 特性      | Fetch API              | XMLHttpRequest   |
| --------- | ---------------------- | ---------------- |
| 语法      | 基于 Promise           | 事件回调         |
| 默认行为  | 不会拒绝 HTTP 错误状态 | 需要手动处理错误 |
| 请求取消  | 使用 AbortController   | 原生支持         |
| 流式处理  | 支持                   | 有限支持         |
| CORS 处理 | 更简单                 | 较复杂           |

## 二、请求配置详解

### 2.1 常用配置选项

```javascript
fetch(url, {
  method: "POST", // 请求方法
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-token"
  },
  body: JSON.stringify(data), // 请求体
  mode: "cors", // 跨域模式
  credentials: "include", // 包含凭据
  cache: "no-cache", // 缓存控制
  redirect: "follow" // 重定向处理
});
```

### 2.2 配置选项说明

- **method**: GET, POST, PUT, DELETE 等 HTTP 方法
- **headers**: 请求头对象
- **body**: 请求体数据（Blob, BufferSource, FormData 等）
- **mode**: cors, no-cors, same-origin
- **credentials**: omit, same-origin, include
- **cache**: default, no-store, reload 等
- **redirect**: follow, error, manual

## 三、响应处理

### 3.1 响应对象属性

```javascript
fetch(url).then((response) => {
  console.log(response.ok); // 布尔值，表示请求是否成功(200-299)
  console.log(response.status); // HTTP状态码
  console.log(response.statusText); // 状态文本
  console.log(response.headers); // 响应头
  console.log(response.url); // 最终请求URL

  return response.json(); // 解析为JSON
});
```

### 3.2 响应体解析方法

- `response.json()` - 解析为 JSON 对象
- `response.text()` - 解析为文本
- `response.blob()` - 解析为 Blob 对象
- `response.arrayBuffer()` - 解析为 ArrayBuffer
- `response.formData()` - 解析为 FormData 对象

## 四、高级用法

### 4.1 请求取消

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch(url, { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("请求被取消");
    }
  });

// 取消请求
controller.abort();
```

### 4.2 超时处理

```javascript
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return Promise.race([fetch(url, options), new Promise((_, reject) => setTimeout(() => reject(new Error("请求超时")), timeout))]);
}
```

### 4.3 文件上传

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("username", "user123");

fetch("/upload", {
  method: "POST",
  body: formData
});
```

## 五、错误处理最佳实践

### 5.1 完整错误处理模式

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("请求失败:", error);
    // 可在此处添加错误上报逻辑
    throw error; // 重新抛出以便外部处理
  }
}
```

### 5.2 常见错误类型

1. **网络错误**：无法连接到服务器
2. **HTTP 错误**：4xx/5xx 状态码
3. **解析错误**：响应数据不符合预期格式
4. **中止错误**：请求被显式取消

## 六、封装通用请求函数

### 6.1 开始封装

下面是日常工作中使用的封装函数，包含了：  
1、添加`Authorization`头  
2、`token` 过期自动刷新  
3、流式数据输出支持（`text/event-stream`）  
4、`signal` 支持请求取消

```typescript
export async function authorizedFetch(url: string, options?: RequestInit) {
  const session = await getSession();
  // 若本地 session（或 token）为空，直接尝试重新登录
  if (!session) {
    console.log("无 session，尝试通过钉钉拉起授权");
    await requestAuthCodeAndReSignIn();
    // 再次获取最新的 session
    const newSession = await getSession();
    if (!newSession) {
      throw new Error("无法完成登录，session 依旧为空");
    }
  }

  try {
    // 带上当前的 accessToken
    const accessToken = session?.user?.accessToken;

    // 创建新的 headers 对象
    const headers = new Headers(options?.headers);

    // 只有当 Content-Type 未被设置且不是 FormData 时，才设置默认的 application/json
    if (!headers.has("Content-Type") && !(options?.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    // 添加 Authorization 头
    headers.set("Authorization", `Bearer ${accessToken}`);

    // 发起请求
    let resp = await fetch(url, {
      ...options,
      headers,
      signal: options?.signal // 添加 signal 参数
    });

    // 如果返回 401，说明 token 已过期，需要重新获取
    if (resp.status === 401) {
      console.log("Token 可能已过期，重新获取 AuthCode 并 signIn");
      await requestAuthCodeAndReSignIn();
      // 重新拿到新的 token
      const sessionAfterReSignIn = await getSession();
      if (!sessionAfterReSignIn) {
        throw new Error("无法完成登录，session 依旧为空");
      }
      // 再次发起请求
      const newAccessToken = sessionAfterReSignIn.user.accessToken;

      resp = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${newAccessToken}`,
          "Content-Type": "application/json"
        },
        signal: options?.signal // 添加 signal 参数
      });
    }

    // 返回最终结果
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Request failed: ${resp.status} - ${errorText}`);
    }
    // 根据 Content-Type 决定返回格式
    const contentType = resp.headers.get("Content-Type");

    // 如果是流式数据（如 text/event-stream 或其他流式类型）
    if (
      contentType?.includes("text/event-stream") ||
      contentType?.includes("application/octet-stream") ||
      // 其他你认为表示流式的 Content-Type
      false
    ) {
      return resp; // 返回原始 Response 对象供流式处理
    }

    // 否则尝试解析为 JSON（或其他适当格式）
    if (contentType?.includes("application/json")) {
      return await resp.json();
    }

    // 默认返回文本
    return await resp.json();
  } catch (error) {
    console.error("Error:", error);
    return JSON.stringify(error);
  }
}
```

### 6.2 使用

```typescript
import { authorizedFetch } from "./fetcher";

/**
 * POST 请求示例
 */
export function delConversationLogs(data: { chat_id: string; msg_tags: string[] }) {
  return authorizedFetch(`${baseUrl}/api/v1/ds/conversation/log/del`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}
// 组件中使用
const response = await delConversationLogs({ chat_id: "123", msg_tags: ["123", "456"] });

/**
 * GET 请求示例
 */
export function getSourceFile(data: { dataset_id?: string; document_id?: string; file_name?: string }) {
  return authorizedFetch(`${baseUrl}/api/v1/file/get?dataset_id=${data.dataset_id}&document_id=${data.document_id}&file_name=${data.file_name}`, {
    method: "GET"
  });
}
// 组件中使用
const response = await getSourceFile({ dataset_id: "123", document_id: "456", file_name: "example.txt" });
```
