# Node.js 中的 process ：进程控制与环境管理

[[toc]]

`process` 是 Node.js 中一个非常核心的全局对象，它提供了与当前进程相关的信息和控制。`process` 对象可以用来管理命令行输入输出、操作系统环境变量、执行时的资源限制等。

### 1. 进程对象 `process`

`process` 是一个全局对象，在 Node.js 中不需要通过 `require` 引入。它包含了许多有用的方法和属性，来帮助我们管理 Node.js 应用的运行时环境。

### 2. 常用属性

#### 2.1 `process.argv`

`process.argv` 是一个数组，包含了命令行中调用 Node.js 脚本时传入的参数。第一个元素是 Node.js 可执行文件的路径，第二个元素是脚本文件的路径，后面的元素是传给脚本的其他参数。

```javascript
console.log(process.argv);
```

输出示例：

```
[
  '/usr/local/bin/node',
  '/path/to/your/script.js',
  'arg1',
  'arg2'
]
```

可以通过 `process.argv` 来解析命令行参数。例如：

```javascript
const args = process.argv.slice(2); // 跳过前两个元素（Node.js 和脚本路径）
console.log(args); // ['arg1', 'arg2']
```

#### 2.2 `process.env`

`process.env` 是一个包含用户环境变量的对象。例如，它可以访问操作系统中的环境变量如 `PATH`, `HOME`, `USER` 等。

```javascript
console.log(process.env); // 打印所有环境变量
console.log(process.env.PATH); // 获取 PATH 环境变量
```

可以使用它来设置应用的环境配置：

```javascript
process.env.NODE_ENV = "production";
console.log(process.env.NODE_ENV); // 输出 'production'
```

#### 2.3 `process.exit()`

`process.exit()` 用于退出当前的 Node.js 进程，并且可以传入一个退出码。默认的退出码是 `0`，表示程序成功退出。如果传入非零值，表示程序异常退出。

```javascript
console.log("程序执行结束");
process.exit(0); // 正常退出
```

- 如果退出码是 `0`，表示程序成功执行。
- 如果退出码是非 `0`，表示程序出现了错误。

#### 2.4 `process.stdin`, `process.stdout`, `process.stderr`

这三个属性分别代表标准输入流、标准输出流和标准错误流。

- **`process.stdin`**：读取用户输入（通常是命令行输入）。
- **`process.stdout`**：输出到终端（通常是程序的输出）。
- **`process.stderr`**：输出错误信息到终端。

例如，使用 `process.stdin` 来读取用户输入：

```javascript
process.stdin.on("data", (data) => {
  console.log("用户输入:", data.toString());
});
```

你还可以使用 `process.stdout` 输出信息：

```javascript
process.stdout.write("Hello, world!\n");
```

#### 2.5 `process.pid`

`process.pid` 返回当前 Node.js 进程的进程 ID（PID）。它是一个数字，用来标识当前正在运行的进程。

```javascript
console.log(process.pid); // 输出当前进程的 PID
```

#### 2.6 `process.title`

`process.title` 返回或设置 Node.js 进程的标题。进程标题通常用于命令行工具的标识。

```javascript
console.log(process.title); // 默认值是 'node'
process.title = "MyApp";
console.log(process.title); // 'MyApp'
```

#### 2.7 `process.platform`

`process.platform` 返回 Node.js 进程运行的平台。它可以返回如下的值：

- `'darwin'`：macOS
- `'linux'`：Linux
- `'win32'`：Windows

```javascript
console.log(process.platform); // 'win32', 'darwin', 'linux' 等
```

#### 2.8 `process.version`

`process.version` 返回当前 Node.js 的版本信息。它是一个字符串，如 `v14.16.1`。

```javascript
console.log(process.version); // 例如 'v14.16.1'
```

#### 2.9 `process.memoryUsage()`

`process.memoryUsage()` 返回一个对象，表示当前进程的内存使用情况。返回的对象包含以下字段：

- `rss`：常驻内存集（Resident Set Size），是进程占用的物理内存量（包括代码、数据和堆栈）。
- `heapTotal`：V8 引擎的堆总大小。
- `heapUsed`：V8 引擎已经使用的堆内存量。
- `external`：V8 引擎外部的内存（如 C++ 对象）。

```javascript
console.log(process.memoryUsage());
```

输出示例：

```javascript
{
  rss: 163000576,
  heapTotal: 92876800,
  heapUsed: 52823296,
  external: 1160584
}
```

#### 2.10 `process.argv0`

`process.argv0` 返回 Node.js 执行时传入的脚本名称，通常是与 `process.argv[1]` 相同，但可以用来区分启动脚本时是否使用了 Node.js 的 `--eval` 或 `--require` 等选项。

```javascript
console.log(process.argv0);
```

### 3. 常用事件

#### 3.1 `process.on('exit', callback)`

`'exit'` 事件会在 Node.js 进程退出时触发，通常用来执行清理任务。`callback` 在进程退出时执行，但不能异步执行（不能使用 `setTimeout` 等异步方法）。

```javascript
process.on("exit", (code) => {
  console.log(`进程退出，退出码: ${code}`);
});
```

#### 3.2 `process.on('uncaughtException', callback)`

当发生未捕获的异常时，会触发 `'uncaughtException'` 事件。这可以用来处理未捕获的异常，但建议用它来做日志记录，而不是直接处理所有异常。

```javascript
process.on("uncaughtException", (err) => {
  console.error("捕获到异常:", err);
  process.exit(1); // 退出进程
});
```

### 4. 示例：命令行参数和环境变量

```javascript
// 获取命令行参数
const args = process.argv.slice(2);
console.log("命令行参数:", args);

// 获取环境变量
const nodeEnv = process.env.NODE_ENV || "development";
console.log("当前环境:", nodeEnv);

// 输出进程ID
console.log("当前进程ID:", process.pid);
```
