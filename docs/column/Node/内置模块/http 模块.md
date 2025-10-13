# Node.js 中的 http 模块：构建 Web 服务的核心

[[toc]]

`http` 模块是 Node.js 中的核心模块之一，用于创建 HTTP 服务器和客户端。它提供了一种方法来处理 HTTP 请求和响应，使得我们可以通过 Node.js 构建 Web 应用程序、API 服务等。

### 1. 引入 `http` 模块

要使用 `http` 模块，首先需要在代码中引入它：

```javascript
const http = require("http");
```

### 2. 创建 HTTP 服务器

#### 2.1 `http.createServer()`

`createServer()` 方法用于创建一个新的 HTTP 服务器，该服务器可以监听客户端发来的请求并响应。`createServer()` 方法接受一个回调函数，该回调函数会在每个请求到达时执行。回调函数有两个参数：`req`（请求对象）和 `res`（响应对象）。

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.statusCode = 200; // 设置 HTTP 状态码
  res.setHeader("Content-Type", "text/plain"); // 设置响应头
  res.end("Hello, World!"); // 发送响应内容
});

server.listen(3000, "localhost", () => {
  console.log("服务器正在运行在 http://localhost:3000");
});
```

- `req`：请求对象，包含请求的详细信息，例如请求方法、请求头、请求路径等。
- `res`：响应对象，允许我们设置响应头、状态码和响应体。

#### 2.2 请求对象 `req`

`req` 对象提供了关于 HTTP 请求的信息，包括：

- `req.url`：请求的 URL。
- `req.method`：请求的方法，如 `GET`, `POST`, `PUT`, `DELETE` 等。
- `req.headers`：请求头。
- `req.query`：查询字符串参数（需要通过 `url` 模块手动解析）。
- `req.body`：请求体（对于 `POST` 和 `PUT` 请求，通常需要通过中间件解析，如 `body-parser`）。

#### 2.3 响应对象 `res`

`res` 对象用于设置 HTTP 响应的状态码、头信息和主体内容。常用的方法有：

- `res.statusCode`：设置响应的 HTTP 状态码（例如 `200`, `404`）。
- `res.setHeader(name, value)`：设置响应头部字段。
- `res.write()`：向响应中写入数据。
- `res.end()`：结束响应并将数据发送到客户端。

### 3. 请求和响应的基本操作

#### 3.1 发送响应数据

我们可以通过 `res.write()` 方法分块地发送数据，然后通过 `res.end()` 来结束响应。

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.write("Hello");
  res.write(" World!");
  res.end();
});

server.listen(3000, "localhost", () => {
  console.log("服务器正在运行在 http://localhost:3000");
});
```

#### 3.2 设置状态码和响应头

可以通过 `res.statusCode` 设置响应的状态码，通过 `res.setHeader()` 设置响应头。

```javascript
const server = http.createServer((req, res) => {
  res.statusCode = 404; // 设置状态码
  res.setHeader("Content-Type", "text/plain"); // 设置响应头
  res.end("Not Found"); // 结束响应并发送内容
});
```

#### 3.3 处理 URL 路径

可以通过 `req.url` 来获取请求的 URL，并根据不同的路径进行不同的响应。

```javascript
const server = http.createServer((req, res) => {
  if (req.url === "/about") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>About Page</h1>");
  } else if (req.url === "/contact") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Contact Page</h1>");
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Page not found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

### 4. 创建 HTTP 客户端

#### 4.1 `http.get()`

`http.get()` 方法是一个简便的方式来发起 GET 请求。它返回一个 `http.ClientRequest` 对象，允许我们发送请求和接收响应。

```javascript
const http = require("http");

http
  .get("http://localhost:3000", (res) => {
    let data = "";

    // 监听数据流
    res.on("data", (chunk) => {
      data += chunk;
    });

    // 响应结束
    res.on("end", () => {
      console.log("响应内容:", data);
    });
  })
  .on("error", (err) => {
    console.log("请求错误:", err);
  });
```

#### 4.2 `http.request()`

`http.request()` 方法更灵活，适用于除了 GET 之外的其他 HTTP 请求方法（如 `POST`, `PUT`, `DELETE` 等）。它允许你配置更多的请求选项。

```javascript
const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/about",
  method: "GET"
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("响应内容:", data);
  });
});

req.on("error", (err) => {
  console.log("请求错误:", err);
});

// 发起请求
req.end();
```

### 5. 处理 POST 请求

对于需要接收请求体的 POST 请求，可以通过监听 `data` 事件来处理请求体数据。

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("收到的数据: " + data);
    });
  } else {
    res.statusCode = 405; // 方法不允许
    res.setHeader("Content-Type", "text/plain");
    res.end("Method Not Allowed");
  }
});

server.listen(3000, () => {
  console.log("服务器正在运行在 http://localhost:3000");
});
```

客户端发送 POST 请求：

```javascript
const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/",
  method: "POST",
  headers: {
    "Content-Type": "text/plain"
  }
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("响应内容:", data);
  });
});

// 向请求体中发送数据
req.write("Hello, server!");
req.end();
```
