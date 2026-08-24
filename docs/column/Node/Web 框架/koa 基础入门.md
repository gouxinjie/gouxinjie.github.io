
# Koa 基础入门

Koa 是由 Express 原班人马打造的新一代 Node.js Web 框架，定位是**更轻量、更现代、更优雅**。它充分拥抱 `async/await`，通过洋葱模型让中间件的控制流更加清晰。

官网：[https://koajs.com](https://koajs.com)


## 一、Koa 是什么？

Koa 的设计理念和 Express 有明显区别：

| 对比项           | Express                          | Koa                              |
|------------------|----------------------------------|----------------------------------|
| 定位             | 应用框架（功能较全）             | 中间件框架（极简核心）           |
| 异步支持         | 回调为主，需手动处理             | 原生支持 async/await             |
| 请求/响应对象    | req + res                        | 统一的 **ctx**（Context）        |
| 内置中间件       | 有（json、static 等）            | **几乎没有**，全部靠第三方       |
| 中间件执行模型   | 线性（较弱洋葱特性）             | 经典**洋葱模型**                 |
| 错误处理         | 需要额外中间件                   | try/catch 更自然                 |

一句话总结：

> Koa = 更现代的中间件内核 + Context + 洋葱模型


## 二、快速开始

### 1. 安装

```bash
mkdir koa-demo
cd koa-demo
npm init -y
npm install koa
```

常用配套中间件（几乎必装）：

```bash
npm install @koa/router koa-bodyparser koa-static
# 可选
npm install koa-logger @koa/cors
```

### 2. 最简单的服务器

```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello Koa!';
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

访问 `http://localhost:3000` 即可看到输出。


## 三、核心概念

### 1. Context（ctx）—— 请求上下文

Koa 把 Node 原生的 `req` 和 `res` 封装成一个 **ctx** 对象，使用起来更统一：

```js
app.use(async (ctx) => {
  // 请求相关
  console.log(ctx.method);        // GET
  console.log(ctx.url);           // /api/user?id=1
  console.log(ctx.query);         // { id: '1' }
  console.log(ctx.params);        // 路由参数（需配合 router）
  console.log(ctx.request.body);  // POST 请求体（需 bodyparser）

  // 响应相关
  ctx.status = 200;
  ctx.body = { message: 'success' };   // 最常用
  ctx.set('X-Custom', 'value');        // 设置响应头
});
```

常用属性速查：

| 属性                  | 说明                     |
|-----------------------|--------------------------|
| `ctx.method`          | 请求方法                 |
| `ctx.url` / `ctx.path`| 请求路径                 |
| `ctx.query`           | 查询参数                 |
| `ctx.request.body`    | 请求体                   |
| `ctx.params`          | 路由参数                 |
| `ctx.body`            | 响应体（赋值即返回）     |
| `ctx.status`          | 状态码                   |
| `ctx.throw()`         | 抛出 HTTP 错误           |

### 2. 中间件与洋葱模型（重点）

Koa 中间件的签名是：

```js
async (ctx, next) => { ... }
```

**洋葱模型**示意：

```
请求进入
   ↓
中间件1 前半部分
   ↓
中间件2 前半部分
   ↓
中间件3（最里层）
   ↑
中间件2 后半部分
   ↑
中间件1 后半部分
响应返回
```

经典示例：

```js
app.use(async (ctx, next) => {
  console.log('1. 开始');
  await next();
  console.log('1. 结束');
});

app.use(async (ctx, next) => {
  console.log('2. 开始');
  await next();
  console.log('2. 结束');
});

app.use(async (ctx) => {
  console.log('3. 处理业务');
  ctx.body = 'Hello';
});
```

输出顺序：

```
1. 开始
2. 开始
3. 处理业务
2. 结束
1. 结束
```

这就是洋葱模型的魅力：可以很方便地在「请求前」和「响应后」做统一处理（比如计时、日志、错误捕获）。

### 3. 路由（使用 @koa/router）

Koa 本身**不提供路由**，需要安装：

```bash
npm install @koa/router
```

```js
const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

// 基本路由
router.get('/', (ctx) => {
  ctx.body = '首页';
});

router.get('/users/:id', (ctx) => {
  ctx.body = `用户ID: ${ctx.params.id}`;
});

router.post('/login', (ctx) => {
  const { username, password } = ctx.request.body;
  ctx.body = { username, password };
});

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());  // 自动处理 OPTIONS 等

app.listen(3000);
```

### 4. 常用中间件

```js
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const logger = require('koa-logger');
const cors = require('@koa/cors');

app.use(logger());                    // 日志
app.use(cors());                      // 跨域
app.use(bodyParser());                // 解析 JSON / 表单
app.use(serve(__dirname + '/public'));// 静态资源
```

解析 POST JSON 后，数据在 `ctx.request.body` 中。

## 四、完整示例

```js
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

const app = new Koa();
const router = new Router();

// 全局中间件
app.use(logger());
app.use(bodyParser());

// 自定义计时中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// 路由
router.get('/', (ctx) => {
  ctx.body = '<h1>欢迎使用 Koa</h1>';
});

router.get('/api/user', (ctx) => {
  ctx.body = {
    code: 200,
    data: { name: '张三', age: 20 }
  };
});

router.post('/api/login', (ctx) => {
  const { username, password } = ctx.request.body || {};

  if (username === 'admin' && password === '123456') {
    ctx.body = { code: 200, message: '登录成功' };
  } else {
    ctx.status = 401;
    ctx.body = { code: 401, message: '账号或密码错误' };
  }
});

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());

// 404 处理
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = { code: 404, message: '接口不存在' };
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

## 五、错误处理

Koa 推荐使用 `try/catch` + `ctx.throw`：

```js
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      code: ctx.status,
      message: err.message || '服务器内部错误'
    };
    // 触发 app 的 error 事件，方便统一日志
    ctx.app.emit('error', err, ctx);
  }
});

// 业务中抛错
router.get('/user/:id', async (ctx) => {
  const user = await findUser(ctx.params.id);
  if (!user) {
    ctx.throw(404, '用户不存在');
  }
  ctx.body = user;
});
```

## 六、Koa vs Express 怎么选？

| 场景                         | 更推荐     |
|------------------------------|------------|
| 快速上手、生态成熟、招人容易 | Express    |
| 想写更现代、可控性更强的代码 | **Koa**    |
| 中大型项目、对中间件顺序敏感 | **Koa**    |
| 简单 CRUD、传统项目          | Express    |
| 学习中间件原理、洋葱模型     | **Koa**    |

两者语法差异不小，但思想相通。学会其中一个，再学另一个会很快。
