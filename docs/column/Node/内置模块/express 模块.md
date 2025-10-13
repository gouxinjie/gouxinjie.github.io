# Express.js 模块：构建高效的 Node.js Web 应用

[[toc]]

**Express.js** 是 Node.js 平台上一个非常流行的 Web 应用框架。它为构建 Web 应用程序和 RESTful API 提供了简洁、灵活的工具，帮助开发者快速搭建服务器，处理路由、请求、响应等常见的 Web 操作。

### 1. 安装 Express.js

首先需要安装 Express.js。在项目目录下打开终端，并使用 `npm` 安装：

```bash
npm init -y  # 初始化一个 Node.js 项目（如果没有 package.json 文件的话）
npm install express  # 安装 Express.js
```

### 2. 基本使用

#### 2.1 创建 Express 应用

在你的项目中创建一个 JavaScript 文件（如 `app.js`），并初始化一个 Express 应用：

```javascript
// 引入 Express 模块
const express = require("express");

// 创建一个 Express 应用
const app = express();

// 设置端口号
const PORT = 3000;

// 处理根路由的请求
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
```

- `express()` 创建一个 Express 应用实例。
- `app.get()` 用于定义一个处理 HTTP GET 请求的路由。

#### 2.2 启动服务器

通过运行 `node app.js` 启动服务器：

```bash
node app.js
```

你可以在浏览器中访问 `http://localhost:3000`，看到响应的 `Hello, Express!` 字符串。

### 3. 路由

路由是 Express 中非常重要的概念，用来处理不同的 HTTP 请求。你可以为各种 HTTP 方法（GET、POST、PUT、DELETE 等）定义路由。

#### 3.1 处理 GET 请求

```javascript
app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});
```

#### 3.2 处理 POST 请求

Express 允许通过 `app.post()` 来处理 POST 请求。使用 `express.urlencoded()` 或 `express.json()` 中间件来解析请求体。

```javascript
app.post("/submit", express.urlencoded({ extended: true }), (req, res) => {
  console.log(req.body);
  res.send("POST 请求已处理");
});
```

#### 3.3 处理 PUT 请求

```javascript
app.put("/update/:id", (req, res) => {
  const { id } = req.params; // 获取路由参数
  res.send(`更新 ID 为 ${id} 的资源`);
});
```

#### 3.4 处理 DELETE 请求

```javascript
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params; // 获取路由参数
  res.send(`删除 ID 为 ${id} 的资源`);
});
```

#### 3.5 路由参数

你可以在路由中定义动态路径参数，路径参数可以通过 `req.params` 访问。

```javascript
app.get("/user/:id", (req, res) => {
  const { id } = req.params; // 获取 URL 路径中的 id 参数
  res.send(`用户 ID: ${id}`);
});
```

#### 3.6 路由处理链

你可以将多个路由处理函数链式地应用到某个路由上。Express 会按顺序执行这些处理函数。

```javascript
app.get(
  "/user",
  (req, res, next) => {
    console.log("第一层中间件");
    next();
  },
  (req, res) => {
    console.log("第二层中间件");
    res.send("User Route");
  }
);
```

### 4. 中间件

**中间件**是 Express 中的一个重要概念，通常用于处理请求的预处理、验证、日志记录等任务。中间件函数会按照定义的顺序被调用，可以在请求到达路由处理函数之前或之后执行。

#### 4.1 使用内置中间件

- **`express.json()`**：用于解析请求体中的 JSON 数据。
- **`express.urlencoded()`**：用于解析 URL 编码的数据（如表单提交的数据）。

```javascript
app.use(express.json()); // 解析 JSON 数据
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的数据
```

#### 4.2 自定义中间件

你可以定义自定义中间件来执行一些特定操作（如日志记录）。

```javascript
// 创建一个日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // 调用下一个中间件或路由处理器
});
```

#### 4.3 错误处理中间件

错误处理中间件通常会有四个参数：`err, req, res, next`。

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
```

### 5. 静态文件

Express 提供了 `express.static()` 中间件来提供静态文件（如图片、CSS 文件、JavaScript 文件等）的访问。

```javascript
// 提供公共目录下的静态文件
app.use(express.static("public"));
```

假设 `public` 目录下有一个 `index.html` 文件，访问 `http://localhost:3000/index.html` 就能直接获取该文件。

### 6. 模板引擎

Express 支持使用模板引擎来渲染 HTML 页面。常见的模板引擎有 EJS、Pug、Handlebars 等。

#### 6.1 使用 EJS 模板引擎

首先安装 EJS：

```bash
npm install ejs
```

然后配置 Express 使用 EJS 作为模板引擎：

```javascript
app.set("view engine", "ejs");
```

接着，创建一个 `views` 文件夹，并在其中添加 EJS 文件（例如 `index.ejs`）：

```html
<!-- views/index.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title><%= title %></title>
  </head>
  <body>
    <h1>Welcome, <%= name %>!</h1>
  </body>
</html>
```

在路由中渲染 EJS 模板：

```javascript
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page", name: "John Doe" });
});
```

### 7. Express 路由模块化

随着应用的增大，可以将路由分离成不同的模块进行管理。使用 `express.Router()` 可以实现这一点。

#### 7.1 创建路由模块

```javascript
// userRouter.js
const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
  res.send("User profile");
});

router.get("/settings", (req, res) => {
  res.send("User settings");
});

module.exports = router;
```

#### 7.2 在主应用中使用路由模块

```javascript
const express = require("express");
const app = express();
const userRouter = require("./userRouter");

app.use("/user", userRouter); // 所有以 /user 开头的路由都会交给 userRouter 处理

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

### 8. 常用方法总结

| 方法           | 说明                                         |
| -------------- | -------------------------------------------- |
| `app.get()`    | 处理 HTTP GET 请求                           |
| `app.post()`   | 处理 HTTP POST 请求                          |
| `app.put()`    | 处理 HTTP PUT 请求                           |
| `app.delete()` | 处理 HTTP DELETE 请求                        |
| `app.use()`    | 使用中间件，通常用于配置全局的功能或静态文件 |
| `app.listen()` | 启动服务器并监听指定端口                     |
| `res.send()`   | 发送响应数据                                 |
| `res.json()`   | 发送 JSON 格式的响应                         |
| `res.render()` | 渲染模板引擎                                 |
