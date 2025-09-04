# **理解 Node.js 中的 http 模块：构建 Web 服务的核心**

## **1. 引言：为什么需要 http 模块？**

`Node.js 的 http `模块是构建 `Web` 服务器和客户端的核心模块。无论是开发` RESTful API`、实时应用还是代理服务器，都离不开它。与 `Express、Koa` 等框架相比，`http` 模块更底层，能让你真正理解 `Web` 服务的工作原理。

## **2. 快速创建一个 HTTP 服务器**

只需几行代码，就能用 `http` 模块启动一个服务器：

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
```

访问 `http://localhost:3000`，你会看到 `Hello, World!`。

### **关键点解析**

- `http.createServer()`：创建 HTTP 服务器，接收一个回调函数处理请求。
- `req`（请求对象）：包含客户端发来的信息（URL、Headers、Body 等）。
- `res`（响应对象）：用于向客户端返回数据。
- `server.listen()`：启动服务器监听指定端口。

## **3. 深入 HTTP 请求与响应**

### **3.1 解析请求（Request）**

`req` 对象包含客户端请求的所有信息：

```javascript
const server = http.createServer((req, res) => {
  console.log(`Method: ${req.method}`); // GET, POST, PUT, DELETE
  console.log(`URL: ${req.url}`); // /path?query=123
  console.log("Headers:", req.headers); // { 'user-agent': 'curl/7.68.0' }

  // 获取请求体（POST/PUT）
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    console.log("Body:", body);
    res.end("Received!");
  });
});
```

### **3.2 构造响应（Response）**

`res` 对象控制服务器返回的数据：

```javascript
res.writeHead(200, {
  "Content-Type": "application/json",
  "Cache-Control": "max-age=3600"
});

res.end(JSON.stringify({ message: "Success" }));
```

- `res.writeHead(statusCode, headers)`：设置 HTTP 状态码和响应头。
- `res.write(data)`：发送数据（可多次调用）。
- `res.end()`：结束响应（可附带最后的数据）。

## **4. 进阶：处理路由和静态文件**

虽然 `http` 模块不提供内置路由，但我们可以手动实现：

```javascript
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Home Page");
  } else if (req.url === "/about") {
    res.end("About Page");
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});
```

### **静态文件服务器示例**

```javascript
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "public", req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("File not found");
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});
```

## **5. 创建一个 HTTP 客户端**

`http` 模块不仅能创建服务器，还能发送 HTTP 请求：

```javascript
const options = {
  hostname: "example.com",
  port: 80,
  path: "/api/data",
  method: "GET"
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("Response:", data);
  });
});

req.on("error", (err) => {
  console.error("Request error:", err);
});

req.end(); // 发送请求
```

## **6. 性能优化与最佳实践**

### **6.1 使用 `keep-alive` 提高性能**

```javascript
const server = http.createServer((req, res) => {
  res.writeHead(200, { Connection: "keep-alive" });
  res.end("Hello, Keep-Alive!");
});
```

`keep-alive` 允许复用 TCP 连接，减少重复握手开销。

### **6.2 避免阻塞事件循环**

```javascript
// ❌ 错误：同步操作阻塞事件循环
const data = fs.readFileSync("large-file.json");

// ✅ 正确：使用异步操作
fs.readFile("large-file.json", (err, data) => {
  res.end(data);
});
```

### **6.3 使用 `http.globalAgent` 管理连接**

Node.js 默认使用全局 `Agent` 管理 HTTP 连接，可优化高并发场景：

```javascript
http.globalAgent.maxSockets = 100; // 提高并发连接数
```

## **7. 总结**

| **功能**       | **http 模块方法**               | **适用场景**           |
| -------------- | ------------------------------- | ---------------------- |
| 创建服务器     | `http.createServer()`           | Web 服务、API 开发     |
| 发送 HTTP 请求 | `http.request()` / `http.get()` | 爬虫、代理服务器       |
| 路由管理       | 手动解析 `req.url`              | 简单 REST API          |
| 静态文件服务   | 结合 `fs` 模块                  | 文件下载、前端资源托管 |
| 性能优化       | `keep-alive`、连接池管理        | 高并发场景             |
