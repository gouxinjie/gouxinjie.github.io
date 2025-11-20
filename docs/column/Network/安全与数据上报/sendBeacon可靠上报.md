# 使用 `navigator.sendBeacon()` 实现可靠的数据上报

## 一、什么是 `navigator.sendBeacon()`？

`navigator.sendBeacon()` 是一个现代浏览器提供的 Web API，它能够**异步**且**可靠地**发送少量数据到服务器，特别适合在页面卸载（如关闭或跳转）时发送数据，而不会阻塞页面生命周期。

用 `sendBeacon() `方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能，这意味着：

::: tip 这意味着

1、数据发送是可靠的。  
2、数据异步传输。  
3、不影响下一导航的载入。  
4、数据是通过` HTTP POST` 请求发送的。

:::

`navigator.sendBeacon() `方法接收两个参数：

- **url**：服务器端接收数据的 URL 地址。
- **data**：要发送的数据，类型可以是` ArrayBuffer、ArrayBufferView、Blob、DOMString、FormData 或 URLSearchParams`。

## 二、基本用法

```javascript
// 简单示例
navigator.sendBeacon("/api/log", "data=example");

// 发送JSON数据
const analyticsData = {
  event: "page_view",
  page: location.href,
  timestamp: Date.now()
};
navigator.sendBeacon("/api/analytics", JSON.stringify(analyticsData));

// 使用FormData发送
const formData = new FormData();
formData.append("event", "click");
formData.append("target", "button#submit");
navigator.sendBeacon("/api/track", formData);
```

::: warning 注意事项

1、该方法返回布尔值，表示是否成功加入发送队列（不是发送成功）。  
2、无法获取服务器响应，适合不需要响应的场景。  
3、浏览器可能会限制发送频率以保护隐私。  
4、在移动设备上，当浏览器进入后台时可能会暂停发送。

:::

## 三、五大典型使用场景

### 1. 页面关闭前的数据上报

```javascript
window.addEventListener("unload", function () {
  const data = {
    event: "page_close",
    time_spent: calculateTimeSpent(),
    scroll_depth: getScrollDepth()
  };
  navigator.sendBeacon("/analytics/close", JSON.stringify(data));
});
```

### 2. 用户行为追踪

```javascript
document.querySelector(".buy-button").addEventListener("click", function () {
  const clickData = {
    action: "add_to_cart",
    product_id: "12345",
    position: "recommendation"
  };
  navigator.sendBeacon("/track/click", JSON.stringify(clickData));
});
```

### 3. 错误日志收集

```javascript
window.onerror = function (message, source, lineno, colno, error) {
  const errorData = {
    msg: message,
    src: source,
    line: lineno,
    col: colno,
    stack: error?.stack,
    ua: navigator.userAgent
  };
  navigator.sendBeacon("/log/error", JSON.stringify(errorData));
  return false; // 防止默认错误提示
};
```

### 4. 性能指标上报

```javascript
// 在页面加载完成后发送性能数据
window.addEventListener("load", function () {
  const perfData = {
    dns: performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
    tcp: performance.timing.connectEnd - performance.timing.connectStart,
    ttfb: performance.timing.responseStart - performance.timing.requestStart,
    dom_ready: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
    load_time: performance.timing.loadEventEnd - performance.timing.navigationStart
  };
  navigator.sendBeacon("/report/performance", JSON.stringify(perfData));
});
```

### 5. A/B 测试数据收集

```javascript
// 记录用户看到的实验版本
document.addEventListener("DOMContentLoaded", function () {
  const variant = localStorage.getItem("ab_test_variant") || "control";
  const expData = {
    experiment_id: "new_ui_2023",
    variant: variant,
    page: location.pathname
  };
  navigator.sendBeacon("/abtest/impression", JSON.stringify(expData));
});
```

## 四、与传统方法的对比

| 特性             | sendBeacon | XMLHttpRequest | fetch |
| ---------------- | ---------- | -------------- | ----- |
| 页面卸载时可用   | ✅         | ❌             | ❌    |
| 是否阻塞页面卸载 | ❌         | ✅             | ✅    |
| 能否处理响应     | ❌         | ✅             | ✅    |
| 自动设置 CORS 头 | ✅         | ❌             | ✅    |
| 数据大小限制     | 有         | 无             | 无    |

## 五、最佳实践

1. **数据大小控制**：不同浏览器对数据大小有限制（通常 64KB 左右），避免发送过大数据
2. **错误处理**：虽然不能直接处理错误，但可以结合本地存储实现重试机制
3. **内容类型设置**：如果需要特定 Content-Type，可以使用 Blob：

```javascript
const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
navigator.sendBeacon(url, blob);
```

4. **兼容性处理**：对于不支持的老旧浏览器，提供降级方案：

```javascript
function sendData(url, data) {
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    return navigator.sendBeacon(url, blob);
  } else {
    // 降级使用同步XHR
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // 同步请求
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
    return true;
  }
}
```

## 六、类型详解

上面我们知道`navigator.sendBeacon()` 方法支持多种数据类型：

`ArrayBuffer、ArrayBufferView、Blob、DOMString、FormData 或 URLSearchParams`

作为其第二个参数，下面详细介绍：

### 6.1. DOMString（普通字符串）

**特性**：

- 最基础的数据类型
- 适合发送简单文本数据
- 默认 Content-Type 为`text/plain`

**示例**：

```javascript
// 发送简单字符串
navigator.sendBeacon("/log", "user_logout");

// 发送查询字符串格式
navigator.sendBeacon("/track", "event=click&id=123");

// 发送JSON字符串
const data = { action: "search", keyword: "手机" };
navigator.sendBeacon("/api", JSON.stringify(data));
```

### 6.2. FormData

**特性**：

- 专门用于模拟表单数据
- 自动处理编码和 Content-Type（`multipart/form-data`）
- 适合文件上传或表单提交

**示例**：

```javascript
const formData = new FormData();
formData.append("username", "张三");
formData.append("avatar", fileInput.files[0]); // 文件对象

// 添加整个表单
const form = document.querySelector("form");
const formData = new FormData(form);

navigator.sendBeacon("/submit", formData);
```

### 6.3. URLSearchParams

**特性**：

- 专门处理 URL 查询字符串
- 自动处理编码（Content-Type 为`application/x-www-form-urlencoded`）
- 适合 GET 参数格式的数据

**示例**：

```javascript
const params = new URLSearchParams();
params.append("city", "北京");
params.append("temp", "28℃");

// 作为请求体发送
navigator.sendBeacon("/weather", params);

// 也可以拼接到URL
navigator.sendBeacon(`/weather?${params.toString()}`);
```

### 6.4. ArrayBuffer & ArrayBufferView

**特性**：

- 用于发送二进制数据
- ArrayBuffer 是固定长度的原始二进制缓冲区
- ArrayBufferView 是 ArrayBuffer 的视图（如 TypedArray）
- 适合发送图像、音频等二进制数据

**示例**：

```javascript
// 发送ArrayBuffer
const buffer = new ArrayBuffer(8);
const view = new Int32Array(buffer);
view[0] = 123;
view[1] = 456;
navigator.sendBeacon("/binary", buffer);

// 从Canvas获取二进制数据
canvas.toBlob((blob) => {
  const reader = new FileReader();
  reader.onload = () => {
    navigator.sendBeacon("/upload", reader.result);
  };
  reader.readAsArrayBuffer(blob);
});
```

### 6.5. Blob

**特性**：

- Binary Large Object（二进制大对象）
- 可以指定 MIME 类型
- 适合发送文件或类型明确的二进制数据

**示例**：

```javascript
// 发送JSON数据并设置Content-Type
const data = { time: new Date().toISOString() };
const blob = new Blob([JSON.stringify(data)], {
  type: "application/json"
});
navigator.sendBeacon("/log", blob);

// 发送文本文件
const textBlob = new Blob(["Hello, 世界!"], {
  type: "text/plain;charset=utf-8"
});
navigator.sendBeacon("/save", textBlob);
```

### 6.6. 各类型对比表

| 类型            | 最佳场景         | Content-Type                      | 大小限制 | 编码处理   |
| --------------- | ---------------- | --------------------------------- | -------- | ---------- |
| DOMString       | 简单文本/JSON    | text/plain                        | 约 64KB  | 需手动编码 |
| FormData        | 表单/文件上传    | multipart/form-data               | 较高     | 自动处理   |
| URLSearchParams | 查询参数         | application/x-www-form-urlencoded | 约 64KB  | 自动编码   |
| ArrayBuffer     | 原始二进制数据   | 需手动设置                        | 较高     | 无需编码   |
| Blob            | 类型化二进制数据 | 可指定                            | 较高     | 无需编码   |

### 6.7. 实际应用建议

1. **JSON 数据**推荐使用：

   ```javascript
   const blob = new Blob([JSON.stringify(data)], {
     type: "application/json"
   });
   navigator.sendBeacon(url, blob);
   ```

2. **表单数据**优先使用 FormData：

   ```javascript
   const formData = new FormData();
   formData.append("key", "value");
   navigator.sendBeacon(url, formData);
   ```

3. **二进制文件**使用 Blob：

   ```javascript
   fileInput.addEventListener("change", (e) => {
     navigator.sendBeacon("/upload", e.target.files[0]);
   });
   ```

4. **中文数据**处理：

   ```javascript
   // 错误方式（可能乱码）
   navigator.sendBeacon("/api", "name=张三");

   // 正确方式（使用URLSearchParams自动编码）
   const params = new URLSearchParams();
   params.append("name", "张三");
   navigator.sendBeacon("/api", params);
   ```
