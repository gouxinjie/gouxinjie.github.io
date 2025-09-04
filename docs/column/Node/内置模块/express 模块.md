# **Express.js 模块：构建高效的 Node.js Web 应用**

`Express.js 是 Node.js `生态中最流行的 Web 框架，它基于` Node.js 的 http `模块构建，提供了更简单、更强大的 API 来开发 Web 应用和 API。

## **1. Express 核心特性**

- **路由系统**：轻松定义 HTTP 端点
- **中间件支持**：模块化处理请求
- **模板引擎集成**：服务端渲染（如 EJS、Pug）
- **错误处理**：统一错误管理
- **高性能**：轻量级，接近原生 `http` 模块的速度

## **2. 安装与基础使用**

### **2.1 安装**

```bash
npm install express
```

### **2.2 最小示例**

```javascript
const express = require("express");
const app = express();
const PORT = 3000;

// 定义路由
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## **3. 核心概念详解**

### **3.1 路由（Routing）**

定义不同 HTTP 方法和路径的处理逻辑：

```javascript
// GET 请求
app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "Alice" }]);
});

// POST 请求
app.post("/api/users", (req, res) => {
  res.status(201).send("User created");
});

// 动态路由参数
app.get("/users/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

// 查询参数
app.get("/search", (req, res) => {
  res.send(`Search query: ${req.query.q}`);
});
```

### **3.2 中间件（Middleware）**

中间件是按顺序执行的函数，可以访问 `req` 和 `res` 对象：

```javascript
// 应用级中间件（对所有路由生效）
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next(); // 传递给下一个中间件
});

// 路由级中间件
app.use("/admin", (req, res, next) => {
  if (req.headers["x-auth"]) {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
});

// 第三方中间件（如解析 JSON）
app.use(express.json());
```

#### **常用内置中间件**

| 中间件                 | 作用             |
| ---------------------- | ---------------- |
| `express.json()`       | 解析 JSON 请求体 |
| `express.urlencoded()` | 解析表单数据     |
| `express.static()`     | 托管静态文件     |

### **3.3 请求和响应对象**

#### **增强的 Request 对象**

```javascript
app.get("/example", (req, res) => {
  console.log(req.method); // HTTP 方法
  console.log(req.path); // URL 路径
  console.log(req.query); // 查询参数
  console.log(req.params); // 路由参数
  console.log(req.body); // 请求体（需中间件解析）
});
```

#### **增强的 Response 对象**

```javascript
res.status(404).send("Not Found"); // 设置状态码 + 发送文本
res.json({ success: true }); // 发送 JSON
res.download("file.pdf"); // 文件下载
res.redirect("/new-path"); // 重定向
```

### **3.4 错误处理**

#### **基本错误处理**

```javascript
app.get("/error", (req, res, next) => {
  try {
    throw new Error("Something broke!");
  } catch (err) {
    next(err); // 传递给错误处理中间件
  }
});

// 错误处理中间件（必须放在最后）
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});
```

#### **异步错误处理**

```javascript
app.get("/async-error", async (req, res, next) => {
  try {
    await someAsyncOperation();
  } catch (err) {
    next(err);
  }
});
```

## **4. 高级功能**

### **4.1 路由模块化**

**userRoutes.js**

```javascript
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User list");
});

module.exports = router;
```

**主文件**

```javascript
const userRoutes = require("./userRoutes");
app.use("/users", userRoutes); // 路由前缀
```

### **4.2 模板引擎（以 EJS 为例）**

```javascript
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index", { title: "Express App" });
});
```

### **4.3 文件上传（使用 multer）**

```javascript
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});
```

## **5. 最佳实践**

1. **项目结构**

   ```
   /project
     ├── app.js          # 主入口
     ├── routes/         # 路由模块
     ├── controllers/    # 业务逻辑
     ├── models/         # 数据模型
     ├── middleware/     # 自定义中间件
     └── public/         # 静态文件
   ```

2. **环境变量管理**

   ```bash
   npm install dotenv
   ```

   ```javascript
   require("dotenv").config();
   const PORT = process.env.PORT || 3000;
   ```

3. **安全中间件**

   ```javascript
   const helmet = require("helmet");
   app.use(helmet());
   ```

4. **性能优化**
   ```javascript
   app.enable("trust proxy"); // 代理支持
   app.disable("x-powered-by"); // 隐藏 Express 头
   ```

## **6. Express vs 原生 http 模块**

| **功能**     | **Express**             | **原生 http 模块**   |
| ------------ | ----------------------- | -------------------- |
| **路由**     | 内置 `app.get/post/...` | 需手动解析 `req.url` |
| **中间件**   | 支持管道式处理          | 无                   |
| **请求解析** | 自动解析 JSON/表单      | 需手动处理           |
| **开发速度** | 快速                    | 代码量大             |
| **性能**     | 略低（因抽象层）        | 最高                 |
