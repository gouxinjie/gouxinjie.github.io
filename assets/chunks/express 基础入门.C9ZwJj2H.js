const n=`
# Express 基础入门

Express 是 Node.js 生态中最经典、使用最广泛的 Web 框架。它简单、灵活、轻量，非常适合用来快速搭建 API 服务和传统网站。

官网：[https://expressjs.com](https://expressjs.com)

## 一、什么是 Express？

Express 是一个**精简且灵活**的 Node.js Web 应用框架，提供了以下核心能力：

- 路由（Routing）
- 中间件（Middleware）
- 请求与响应处理
- 静态资源托管
- 模板引擎支持（可选）

一句话概括：

> Express = 对 Node.js 原生 \`http\` 模块的高度封装 + 中间件机制

## 二、快速开始

### 1. 安装

\`\`\`bash
mkdir express-demo
cd express-demo
npm init -y
npm install express
\`\`\`

开发时推荐安装热重载工具：

\`\`\`bash
npm install -D nodemon
\`\`\`

在 \`package.json\` 中添加脚本：

\`\`\`json
"scripts": {
  "dev": "nodemon app.js",
  "start": "node app.js"
}
\`\`\`

### 2. 最简单的服务器

创建 \`app.js\`：

\`\`\`js
const express = require('express');
const app = express();
const PORT = 3000;

// 定义一个路由
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// 启动服务
app.listen(PORT, () => {
  console.log(\`Server is running at http://localhost:\${PORT}\`);
});
\`\`\`

运行：

\`\`\`bash
npm run dev
\`\`\`

浏览器访问 \`http://localhost:3000\`，即可看到输出。

## 三、核心概念

### 1. 应用（Application）

\`\`\`js
const app = express();
\`\`\`

\`app\` 就是整个 Express 应用的实例，所有路由、中间件都挂载在它上面。

### 2. 路由（Routing）

路由决定了「什么请求 → 执行什么逻辑」。

#### 基本写法

\`\`\`js
app.get('/users', (req, res) => {
  res.send('获取用户列表');
});

app.post('/users', (req, res) => {
  res.send('创建用户');
});

app.put('/users/:id', (req, res) => {
  res.send(\`更新用户 \${req.params.id}\`);
});

app.delete('/users/:id', (req, res) => {
  res.send(\`删除用户 \${req.params.id}\`);
});
\`\`\`

#### 常用 HTTP 方法

| 方法     | 用途           | 示例                  |
|----------|----------------|-----------------------|
| GET      | 获取资源       | \`app.get()\`           |
| POST     | 创建资源       | \`app.post()\`          |
| PUT      | 完整更新资源   | \`app.put()\`           |
| PATCH    | 部分更新资源   | \`app.patch()\`         |
| DELETE   | 删除资源       | \`app.delete()\`        |
| ALL      | 匹配所有方法   | \`app.all()\`           |

#### 路径参数与查询参数

\`\`\`js
// 路径参数：/users/123
app.get('/users/:id', (req, res) => {
  console.log(req.params.id);   // 123
  res.json({ id: req.params.id });
});

// 查询参数：/search?keyword=express&page=1
app.get('/search', (req, res) => {
  console.log(req.query.keyword); // express
  console.log(req.query.page);    // 1
  res.json(req.query);
});
\`\`\`

### 3. 中间件（Middleware）—— Express 的灵魂

中间件是一个函数，可以访问请求对象（\`req\`）、响应对象（\`res\`），以及下一个中间件（\`next\`）。

基本形式：

\`\`\`js
function middleware(req, res, next) {
  // 做一些事情
  next(); // 把控制权交给下一个中间件
}
\`\`\`

#### 应用级中间件

\`\`\`js
// 所有请求都会经过
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});

// 只对 /api 开头的路径生效
app.use('/api', (req, res, next) => {
  console.log('API 请求');
  next();
});
\`\`\`

#### 内置中间件（非常常用）

\`\`\`js
// 解析 JSON 请求体
app.use(express.json());

// 解析 URL-encoded 表单数据
app.use(express.urlencoded({ extended: true }));

// 托管静态文件（public 目录）
app.use(express.static('public'));
\`\`\`

使用后，就可以这样获取 POST 数据：

\`\`\`js
app.post('/login', (req, res) => {
  console.log(req.body); // { username: 'xxx', password: 'xxx' }
  res.json({ message: '登录成功' });
});
\`\`\`

#### 路由级中间件 + Router

推荐把路由拆分到单独文件：

\`\`\`js
// routes/user.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('用户列表');
});

router.get('/:id', (req, res) => {
  res.send(\`用户ID: \${req.params.id}\`);
});

module.exports = router;
\`\`\`

\`\`\`js
// app.js
const userRouter = require('./routes/user');
app.use('/users', userRouter);
\`\`\`

访问：
- \`GET /users\` → 用户列表
- \`GET /users/123\` → 用户ID: 123

### 4. 响应常用方法

\`\`\`js
res.send('一段文字');           // 发送字符串/Buffer/对象
res.json({ name: '张三' });     // 发送 JSON
res.status(201).json({ ok: true });
res.redirect('/login');         // 重定向
res.download('./file.pdf');     // 下载文件
res.sendFile(path.join(__dirname, 'index.html'));
\`\`\`

---

## 四、完整小示例

\`\`\`js
const express = require('express');
const app = express();
const PORT = 3000;

// 内置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 日志中间件
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// 路由
app.get('/', (req, res) => {
  res.send('<h1>欢迎使用 Express</h1>');
});

app.get('/api/user', (req, res) => {
  res.json({
    code: 200,
    data: { name: '张三', age: 20 }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123456') {
    res.json({ code: 200, message: '登录成功' });
  } else {
    res.status(401).json({ code: 401, message: '账号或密码错误' });
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' });
});

// 错误处理中间件（必须 4 个参数）
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
});
\`\`\`

## 五、常见目录结构建议

\`\`\`bash
project/
├── app.js              # 入口文件（或 server.js）
├── package.json
├── public/             # 静态资源
├── routes/             # 路由文件
│   ├── user.js
│   └── product.js
├── controllers/        # 业务逻辑（可选）
├── middleware/         # 自定义中间件（可选）
└── utils/              # 工具函数
\`\`\`
`;export{n as default};
