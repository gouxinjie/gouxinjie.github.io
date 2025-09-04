# **Node.js 中的 process ：进程控制与环境管理**

`process 是 Node.js` 的全局对象，提供了与**当前 Node.js 进程**交互的接口。它可以访问命令行参数、环境变量、标准输入输出流，还能监听进程事件（如退出、异常）。

## **1. process 基础**

### **无需引入，直接使用**

```javascript
console.log(process.version); // 直接访问，无需 require
```

## **2. 核心功能分类**

### **（1）进程信息**

| 属性/方法               | 说明                          | 示例                             |
| ----------------------- | ----------------------------- | -------------------------------- |
| `process.pid`           | 当前进程的 PID                | `12345`                          |
| `process.ppid`          | 父进程的 PID（Node.js 10+）   | `67890`                          |
| `process.arch`          | CPU 架构（如 `x64`、`arm64`） | `'x64'`                          |
| `process.platform`      | 操作系统平台                  | `'linux'` / `'win32'`            |
| `process.uptime()`      | 进程运行时间（秒）            | `102.35`                         |
| `process.memoryUsage()` | 内存使用情况（字节）          | `{ rss: 25MB, heapTotal: 10MB }` |

**示例**：

```javascript
console.log(`Node.js 版本: ${process.version}`);
console.log(`内存占用: ${JSON.stringify(process.memoryUsage())}`);
```

### **（2）命令行参数与环境变量**

| 属性/方法            | 说明                           |
| -------------------- | ------------------------------ |
| `process.argv`       | 命令行参数数组                 |
| `process.argv0`      | 原始 `argv[0]`（Node.js 路径） |
| `process.execPath`   | Node.js 可执行文件路径         |
| `process.env`        | 环境变量对象                   |
| `process.cwd()`      | 当前工作目录                   |
| `process.chdir(dir)` | 切换工作目录                   |

**示例**：读取命令行参数

```javascript
// 运行命令: node app.js --name=foo
console.log(process.argv);
// 输出: ['/path/to/node', '/path/to/app.js', '--name=foo']
```

**示例**：使用环境变量

```javascript
const apiKey = process.env.API_KEY; // 从环境变量读取
if (!apiKey) {
  console.error("请设置 API_KEY 环境变量");
  process.exit(1); // 非零退出码表示错误
}
```

### **（3）标准输入输出流**

| 属性             | 说明                 |
| ---------------- | -------------------- |
| `process.stdin`  | 标准输入流（可读流） |
| `process.stdout` | 标准输出流（可写流） |
| `process.stderr` | 标准错误流（可写流） |

**示例**：交互式输入

```javascript
process.stdin.setEncoding("utf-8");
process.stdout.write("请输入你的名字: ");
process.stdin.on("data", (input) => {
  console.log(`你好, ${input.trim()}!`);
  process.exit();
});
```

### **（4）进程控制**

| 方法                   | 说明                       |
| ---------------------- | -------------------------- |
| `process.exit([code])` | 退出进程（默认 code=0）    |
| `process.kill(pid)`    | 向指定 PID 发送信号        |
| `process.nextTick(cb)` | 将回调放入当前事件循环末尾 |

**示例**：优雅退出

```javascript
process.on("SIGTERM", () => {
  console.log("收到终止信号，清理资源...");
  setTimeout(() => process.exit(0), 1000);
});
```

### **（5）事件监听**

| 事件名                | 触发条件                       |
| --------------------- | ------------------------------ |
| `'exit'`              | 进程退出前（无法异步操作）     |
| `'uncaughtException'` | 未捕获的异常                   |
| `'SIGINT'`            | 用户按下 Ctrl+C                |
| `'SIGTERM'`           | 收到终止信号（如 `kill` 命令） |

**示例**：捕获未处理的异常

```javascript
process.on("uncaughtException", (err) => {
  console.error("未捕获的异常:", err);
  process.exit(1); // 必须退出，否则进程可能处于不稳定状态
});

throw new Error("测试异常");
```

## **3. 实际应用场景**

### **场景 1：配置动态加载**

```javascript
// 根据环境变量加载不同配置
const config = process.env.NODE_ENV === "production" ? require("./config.prod") : require("./config.dev");
```

### **场景 2：命令行工具开发**

```javascript
// 解析命令行参数
const [, , arg1, arg2] = process.argv;
console.log(`参数1: ${arg1}, 参数2: ${arg2}`);
```

### **场景 3：守护进程**

```javascript
// 子进程崩溃后自动重启
const spawn = require("child_process").spawn;
let child = spawn("node", ["app.js"]);

child.on("exit", (code) => {
  if (code !== 0) {
    console.log("子进程退出，重新启动...");
    child = spawn("node", ["app.js"]);
  }
});
```

## **4. 注意事项**

1. **`process.env` 是敏感信息**

   - 不要将 `process.env` 直接记录到日志。
   - 使用 `dotenv` 库管理 `.env` 文件：
     ```bash
     npm install dotenv
     ```
     ```javascript
     require("dotenv").config();
     console.log(process.env.DB_PASSWORD);
     ```

2. **避免阻塞事件循环**  
   `process.nextTick()` 的优先级高于 `setImmediate()`，滥用可能导致 I/O 饥饿。

3. **`uncaughtException` 是最后手段**  
   即使捕获了异常，也应尽快退出进程，避免内存泄漏。

## **5. 总结**

| **功能**   | **常用 API**                   | **典型场景**       |
| ---------- | ------------------------------ | ------------------ |
| 进程信息   | `pid`, `memoryUsage()`         | 监控、日志记录     |
| 环境变量   | `process.env`                  | 配置管理           |
| 命令行参数 | `process.argv`                 | CLI 工具开发       |
| 进程控制   | `exit()`, `kill()`             | 优雅退出、守护进程 |
| 事件监听   | `uncaughtException`, `SIGTERM` | 错误处理、信号响应 |
