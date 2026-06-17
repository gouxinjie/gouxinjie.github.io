const n=`# 前端 Fetch 与 Ajax 讲解

[[toc]]

在前端开发中，“发送请求”是最基础也是最常用的能力。早期我们用 **Ajax（XMLHttpRequest）** 来请求后端接口，而现代开发中，越来越多的人开始使用 **Fetch API**。

## 一、Ajax 是什么？（XMLHttpRequest）

**Ajax 的本质，是使用 XMLHttpRequest（XHR） 进行异步网络请求。**

它最早由微软发布，用于实现“网页无需刷新即可更新内容”。

特点：

- 需要 new 一个对象：\`new XMLHttpRequest()\`
- 通过回调函数处理成功/失败
- API 比较繁琐
- 代码结构容易层层嵌套

最经典代码：

\`\`\`js
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/user");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log("响应数据：", xhr.responseText);
  }
};
xhr.send();
\`\`\`

你可以看到：

- 回调 \`onreadystatechange\`
- 状态判断
- response 读取方式不统一（文本、JSON 要自己解析）
- 请求不够优雅

## 二、Fetch 是什么？（现代浏览器内置）

Fetch 是一个 **Promise 风格**的网络请求 API，用于替代传统 Ajax。

特点：

- 支持 Promise
- 更简洁
- 内置 JSON 解析
- 支持 async/await
- 更符合现代前端工程化（Vue、React、Next.js）

示例：

\`\`\`js
fetch("/api/user")
  .then((res) => res.json())
  .then((data) => console.log("响应数据：", data))
  .catch((err) => console.error("错误：", err));
\`\`\`

或者 async/await 写法：

\`\`\`js
async function getUser() {
  const res = await fetch("/api/user");
  const data = await res.json();
  console.log(data);
}
\`\`\`

相比 Ajax，可读性提升非常大。

## 三、Ajax 与 Fetch 的核心区别

### 1. 写法对比：简洁性完全不同

**Ajax**

\`\`\`js
xhr.onreadystatechange = function() { ... }
\`\`\`

**Fetch**

\`\`\`js
fetch(url).then(...)
\`\`\`

### 2. 基于 Promise 的现代设计

Fetch 天生支持：

\`\`\`js
async/await
.then()
.catch()
\`\`\`

XHR 不支持 Promise，必须手写封装。

### 3. 错误处理机制不同

**Fetch 的 HTTP 错误不会进入 catch** 例如 400、500 仍然会进入 then。

\`\`\`js
fetch("/api")
  .then((res) => {
    if (!res.ok) throw new Error("请求失败");
  })
  .catch((err) => console.error("真正错误：", err));
\`\`\`

XHR 则会：

- 4xx/5xx 两种情况都在 \`xhr.status\` 里表现出来
- 但依旧不会自动 throw，需要你手动判断

### 4. Fetch 默认不携带 Cookie

XHR 默认携带 Cookie Fetch 默认 **不会** 带上 Cookie。

如果你要带 Cookie：

\`\`\`js
fetch(url, {
  credentials: "include"
});
\`\`\`

### 5. 数据读取方式不同

**Fetch 自带 JSON 解析：**

\`\`\`js
res.json();
\`\`\`

XHR 中你需要：

\`\`\`js
JSON.parse(xhr.responseText);
\`\`\`

### 6. 文件上传支持差异

XHR 原生支持 \`upload.onprogress\` Fetch 虽然能上传，但监听进度必须使用更复杂的 Stream 写法。

### 7. 取消请求支持

- XHR：原生支持 \`xhr.abort()\`
- Fetch：早期不支持，现在有 **AbortController**

\`\`\`js
const controller = new AbortController();

fetch(url, { signal: controller.signal });

// 取消
controller.abort();
\`\`\`

## 四、实战示例：同样的接口用 Fetch 与 Ajax 请求

### Ajax 版本：

\`\`\`js
const xhr = new XMLHttpRequest();
xhr.open("POST", "/api/login");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log("成功：", JSON.parse(xhr.responseText));
    } else {
      console.log("失败：", xhr.status);
    }
  }
};
xhr.send(JSON.stringify({ username: "xj", password: "123" }));
\`\`\`

### Fetch 版本：

\`\`\`js
fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "xj", password: "123" })
})
  .then((res) => res.json())
  .then((data) => console.log("成功：", data))
  .catch((err) => console.error("错误：", err));
\`\`\`

可读性直接吊打 XHR。

## 五、Fetch 请求实战项目封装

### 5.1 开始封装

下面是日常工作中使用的封装函数，包含了：  
1、添加\`Authorization\`头  
2、\`token\` 过期自动刷新  
3、流式数据输出支持（\`text/event-stream\`）  
4、\`signal\` 支持请求取消

\`\`\`typescript
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
    headers.set("Authorization", \`Bearer \${accessToken}\`);

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
          Authorization: \`Bearer \${newAccessToken}\`,
          "Content-Type": "application/json"
        },
        signal: options?.signal // 添加 signal 参数
      });
    }

    // 返回最终结果
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(\`Request failed: \${resp.status} - \${errorText}\`);
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
\`\`\`

### 5.2 使用

\`\`\`typescript
import { authorizedFetch } from "./fetcher";

/**
 * POST 请求示例
 */
export function delConversationLogs(data: { chat_id: string; msg_tags: string[] }) {
  return authorizedFetch(\`\${baseUrl}/api/v1/ds/conversation/log/del\`, {
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
  return authorizedFetch(\`\${baseUrl}/api/v1/file/get?dataset_id=\${data.dataset_id}&document_id=\${data.document_id}&file_name=\${data.file_name}\`, {
    method: "GET"
  });
}
// 组件中使用
const response = await getSourceFile({ dataset_id: "123", document_id: "456", file_name: "example.txt" });
\`\`\`

## 六、总结

**如果你正在写现代 Web 项目（Vue、React、Next.js）→ 用 Fetch**

✔ 原生 ✔ 更优雅 ✔ 支持 async/await ✔ 可以封装成 request 工具 ✔ 支持流式响应（ChatGPT、SSE）

**如果你需要：**

- 上传大文件且必须监听上传进度
- 兼容非常老的 IE 浏览器

👉 那就只能用 **XHR / Ajax**

| 能力                   | Fetch                 | Ajax (XHR)         |
| ---------------------- | --------------------- | ------------------ |
| 语法                   | 简洁、现代            | 复杂、回调多       |
| Promise                | ✔ 支持                | ❌ 不支持          |
| async/await            | ✔                     | ❌（必须自己封装） |
| 是否默认带 Cookie      | ❌ 不带               | ✔                  |
| 上传进度               | 一般                  | ✔ 很强             |
| 错误处理               | HTTP 错误需要手动判断 | 基于 status        |
| 流式处理（如 ChatGPT） | ✔ 很强                | ❌ 不支持          |
| 是否推荐               | 强烈推荐              | 老项目使用         |
`;export{n as default};
