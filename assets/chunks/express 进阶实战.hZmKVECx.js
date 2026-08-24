const n=`
# Express 进阶实战

上一篇我们掌握了 Express 的基础用法（路由、中间件、请求响应）。
本篇进入进阶内容，重点解决真实项目中最常见的问题：

- 路由如何优雅拆分
- 错误如何统一处理
- 异步代码如何正确捕获错误
- 如何做参数校验
- 如何实现 JWT 登录鉴权
- 推荐的项目结构


## 一、路由模块化（强烈推荐）

随着接口变多，把所有路由写在 \`app.js\` 里会难以维护。推荐使用 \`express.Router()\` 拆分。

### 1. 目录结构示例

\`\`\`bash
src/
├── app.js
├── server.js
├── routes/
│   ├── index.js
│   ├── user.js
│   └── auth.js
├── controllers/
│   ├── userController.js
│   └── authController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validate.js
└── utils/
    └── jwt.js
\`\`\`

### 2. 路由拆分示例

**routes/user.js**
\`\`\`js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// 公开接口
router.get('/', userController.getUsers);

// 需要登录的接口
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
\`\`\`

**routes/index.js**
\`\`\`js
const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const authRouter = require('./auth');

router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;
\`\`\`

**app.js**
\`\`\`js
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', routes);   // 统一加前缀 /api

module.exports = app;
\`\`\`


## 二、统一错误处理（非常重要）

### 1. 自定义错误类

\`\`\`js
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // 标记为可预期的业务错误
  }
}

module.exports = AppError;
\`\`\`

### 2. 异步错误捕获（关键）

Express 默认**不会**自动捕获 \`async/await\` 抛出的错误，需要手动处理。

推荐封装一个高阶函数：

\`\`\`js
// utils/catchAsync.js
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
\`\`\`

使用方式：

\`\`\`js
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('用户不存在', 404));
  }

  res.json({ code: 200, data: user });
});
\`\`\`

### 3. 全局错误处理中间件

\`\`\`js
// middleware/errorHandler.js
const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  console.error(err);

  // 已知的业务错误
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message
    });
  }

  // 未知错误
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  });
};
\`\`\`

在 \`app.js\` 最后挂载：

\`\`\`js
const errorHandler = require('./middleware/errorHandler');

// 404
app.use((req, res, next) => {
  next(new AppError(\`接口不存在: \${req.originalUrl}\`, 404));
});

// 全局错误处理（必须放在最后）
app.use(errorHandler);
\`\`\`


## 三、参数校验（推荐使用 Zod 或 Joi）

以 **Zod** 为例（轻量、TypeScript 友好）：

\`\`\`bash
npm install zod
\`\`\`

**middleware/validate.js**
\`\`\`js
const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body); // 校验并清洗数据
      next();
    } catch (err) {
      next(err); // 交给全局错误处理
    }
  };
};

module.exports = validate;
\`\`\`

**使用示例**
\`\`\`js
const { z } = require('zod');
const validate = require('../middleware/validate');

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

router.post('/login', validate(loginSchema), authController.login);
\`\`\`


## 四、JWT 登录鉴权实战

### 1. 安装依赖

\`\`\`bash
npm install jsonwebtoken bcryptjs
npm install -D dotenv
\`\`\`

### 2. 工具函数

**utils/jwt.js**
\`\`\`js
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

exports.signToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};
\`\`\`

### 3. 鉴权中间件

**middleware/auth.js**
\`\`\`js
const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('请先登录', 401));
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  // 这里可以查数据库确认用户是否还存在
  req.user = decoded; // 把用户信息挂到 req 上
  next();
});
\`\`\`

### 4. 登录接口示例

\`\`\`js
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1. 查找用户（示例用假数据）
  const user = { id: 1, username: 'admin', password: 'hashed_password' };

  // 2. 验证密码
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('用户名或密码错误', 401));
  }

  // 3. 签发 token
  const token = signToken({ id: user.id, username: user.username });

  res.json({
    code: 200,
    message: '登录成功',
    token
  });
});
\`\`\`

前端请求时携带：

\`\`\`http
Authorization: Bearer <token>
\`\`\`


## 五、常用实用中间件

### 1. CORS 跨域

\`\`\`bash
npm install cors
\`\`\`

\`\`\`js
const cors = require('cors');
app.use(cors());
// 或更精细控制
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
\`\`\`

### 2. 请求日志

\`\`\`bash
npm install morgan
\`\`\`

\`\`\`js
const morgan = require('morgan');
app.use(morgan('dev'));
\`\`\`

### 3. 安全相关（生产推荐）

\`\`\`bash
npm install helmet express-rate-limit
\`\`\`

\`\`\`js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100                  // 限制100次请求
});
app.use('/api', limiter);
\`\`\`


## 六、环境变量管理

\`\`\`bash
npm install dotenv
\`\`\`

项目根目录创建 \`.env\`：

\`\`\`env
PORT=3000
JWT_SECRET=your_super_secret_key
NODE_ENV=development
\`\`\`

在入口文件最顶部加载：

\`\`\`js
require('dotenv').config();
\`\`\`

使用：

\`\`\`js
const PORT = process.env.PORT || 3000;
\`\`\`

**注意**：\`.env\` 不要提交到 Git，应加入 \`.gitignore\`。


## 七、推荐项目启动方式

**server.js**
\`\`\`js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
\`\`\`

**app.js** 只负责配置中间件和路由，不启动服务，方便测试。
`;export{n as default};
