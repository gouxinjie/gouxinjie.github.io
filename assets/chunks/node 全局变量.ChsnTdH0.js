const n=`# Node.js 中的全局变量讲解

[[toc]]

在浏览器中，全局对象是 \`window\`；在 Node.js 中，对应的是 **\`global\`**。
但 Node.js 的全局变量体系和浏览器有很大区别，尤其是在**模块作用域**方面。

### 1. 核心概念：\`global\` 与 \`globalThis\`

| 名称 | 说明 | 推荐程度 |
|------|------|----------|
| \`global\` | Node.js 特有的全局对象 | 旧写法，不推荐新代码使用 |
| \`globalThis\` | ES2020 标准，跨环境统一访问全局对象 | **推荐使用** |

\`\`\`js
// 两者在 Node.js 中指向同一个对象
console.log(global === globalThis); // true
\`\`\`

### 2. 最重要的区别：模块作用域

在浏览器中：
\`\`\`js
var a = 1;          // 自动变成 window.a
\`\`\`

在 Node.js 中：
\`\`\`js
var a = 1;          // 只是当前模块的局部变量，不会变成 global.a
console.log(global.a); // undefined
\`\`\`

**原因**：Node.js 每个文件都被包装成一个模块函数，类似这样：

\`\`\`js
(function (exports, require, module, __filename, __dirname) {
  // 你的代码写在这里
  var a = 1;  // 只在这个函数作用域内
});
\`\`\`

所以想让变量真正变成全局，必须**显式挂载**：

\`\`\`js
global.myVar = '我是全局变量';
// 或者
globalThis.myVar = '我是全局变量';
\`\`\`

其他文件中就可以直接访问：
\`\`\`js
console.log(global.myVar); // 我是全局变量
\`\`\`

### 3. 真正的全局对象 / 变量

以下这些是真正全局可用的（不需要 require）：

| 名称 | 说明 |
|------|------|
| \`global\` / \`globalThis\` | 全局对象本身 |
| \`console\` | 控制台输出 |
| \`process\` | 当前进程信息（非常常用） |
| \`Buffer\` | 处理二进制数据 |
| \`setTimeout\` / \`setInterval\` | 定时器 |
| \`setImmediate\` / \`clearImmediate\` | Node.js 特有的立即执行定时器 |
| \`queueMicrotask\` | 微任务队列 |
| \`URL\` / \`URLSearchParams\` | URL 处理 |
| \`TextEncoder\` / \`TextDecoder\` | 文本编码 |
| \`performance\` | 性能相关 |
| \`fetch\`（较新版本） | 网络请求 |

### 4. 看起来像全局，其实不是的变量

这些变量**只在当前模块内可用**，并不是真正的全局：

| 变量 | 说明 |
|------|------|
| \`__dirname\` | 当前文件所在目录的绝对路径 |
| \`__filename\` | 当前文件的绝对路径 |
| \`module\` | 当前模块对象 |
| \`exports\` | \`module.exports\` 的快捷方式 |
| \`require\` | 引入其他模块的函数 |

\`\`\`js
console.log(__dirname);   // 当前目录路径
console.log(__filename);  // 当前文件完整路径
\`\`\`

### 5. 最常用的全局对象：\`process\`

\`process\` 是 Node.js 中最重要的全局对象之一：

\`\`\`js
// 环境变量
console.log(process.env.NODE_ENV);
console.log(process.env.PATH);

// 命令行参数
console.log(process.argv);

// 当前工作目录
console.log(process.cwd());

// 退出程序
process.exit(0);

// 监听退出事件
process.on('exit', (code) => {
  console.log('进程即将退出，退出码：', code);
});
\`\`\`

### 6. 如何正确使用全局变量（建议）

**不推荐**随便挂全局变量：
\`\`\`js
// 不推荐
global.config = { port: 3000 };
\`\`\`

**推荐做法**：

1. **使用模块导出**（最推荐）
\`\`\`js
// config.js
module.exports = {
  port: 3000,
  dbUrl: 'mongodb://localhost/test'
};

// 其他文件
const config = require('./config');
\`\`\`

2. **使用环境变量**（适合配置、密钥）
\`\`\`js
// 通过 .env 或系统环境变量设置
console.log(process.env.DB_PASSWORD);
\`\`\`

3. **必须用全局时，统一挂到一个命名空间下**
\`\`\`js
globalThis.App = {
  config: { ... },
  utils: { ... }
};
\`\`\`

### 7. 总结

| 对比项 | 浏览器 | Node.js |
|--------|--------|---------|
| 全局对象 | \`window\` | \`global\` / \`globalThis\` |
| \`var\` 声明 | 自动变成全局 | **不会**变成全局 |
| 模块作用域 | 无原生模块 | 每个文件都是独立模块 |
| 推荐访问方式 | \`window\` / \`globalThis\` | **\`globalThis\`** |

**核心记忆点**：
- Node.js 中默认没有“随便写就变成全局”的行为
- 真正全局的东西要用 \`global\` / \`globalThis\` 显式挂载
- 绝大多数情况下，优先用模块导出 + \`require\` / \`import\`，而不是依赖全局变量
`;export{n as default};
