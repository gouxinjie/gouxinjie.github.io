
# Node.js 内置模块：os 与 fs

[[toc]]

`os` 和 `fs` 是 Node.js 中最常用的两个内置模块：

- **os**：获取操作系统和系统资源信息
- **fs**：进行文件与目录的读写操作

两者都偏“系统能力”，经常一起使用，所以放在一篇文章里讲解。

## 一、os 模块

### 1. 引入方式

```js
const os = require('os');
// 或
import os from 'node:os';
```

### 2. 常用 API

| 方法 / 属性              | 说明                              | 示例返回值（参考）        |
|--------------------------|-----------------------------------|---------------------------|
| `os.platform()`          | 操作系统平台                      | `'win32'` / `'darwin'` / `'linux'` |
| `os.type()`              | 操作系统名称                      | `'Windows_NT'` / `'Linux'` |
| `os.arch()`              | CPU 架构                          | `'x64'` / `'arm64'`       |
| `os.release()`           | 系统版本号                        | `'10.0.22631'`            |
| `os.hostname()`          | 主机名                            | `'My-Computer'`           |
| `os.homedir()`           | 当前用户主目录                    | `'C:\\Users\\xxx'`        |
| `os.tmpdir()`            | 系统临时目录                      |                           |
| `os.totalmem()`          | 总内存（字节）                    |                           |
| `os.freemem()`           | 空闲内存（字节）                  |                           |
| `os.cpus()`              | CPU 信息数组                      |                           |
| `os.networkInterfaces()` | 网络接口信息                      |                           |
| `os.uptime()`            | 系统运行时间（秒）                |                           |
| `os.userInfo()`          | 当前用户信息                      |                           |
| `os.EOL`                 | 系统换行符                        | `'\r\n'` 或 `'\n'`        |

### 3. 实用示例

```js
const os = require('os');

// 内存转 GB
const totalGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
const freeGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

console.log('平台:', os.platform());
console.log('架构:', os.arch());
console.log('主机名:', os.hostname());
console.log('家目录:', os.homedir());
console.log(`总内存: ${totalGB} GB`);
console.log(`可用内存: ${freeGB} GB`);
console.log('CPU 核心数:', os.cpus().length);
console.log('系统运行时间:', Math.floor(os.uptime() / 3600), '小时');
```

### 4. 常见使用场景

- 根据系统平台写不同逻辑（Windows / macOS / Linux）
- 获取用户主目录、临时目录
- 监控内存和 CPU 情况
- 日志中记录运行环境信息


## 二、fs 模块

`fs` 是 Node.js 操作文件系统的核心模块，支持三种风格：

1. **回调风格**（传统）
2. **同步风格**（`fs.xxxSync`，会阻塞）
3. **Promise 风格**（推荐，现代写法）

本文重点讲 **Promise 写法**。

### 1. 引入方式（推荐）

```js
const fs = require('fs/promises');
// 或
import fs from 'node:fs/promises';

// 需要常量时
const { constants } = require('fs');
```

### 2. 文件读写

#### 读取文件

```js
const fs = require('fs/promises');

async function read() {
  try {
    // 读取为字符串
    const content = await fs.readFile('./test.txt', 'utf-8');
    console.log(content);

    // 读取为 Buffer
    const buffer = await fs.readFile('./test.txt');
    console.log(buffer);
  } catch (err) {
    console.error('读取失败:', err.message);
  }
}

read();
```

#### 写入文件

```js
// 覆盖写入
await fs.writeFile('./test.txt', 'Hello Node.js', 'utf-8');

// 追加写入
await fs.appendFile('./test.txt', '\n追加的内容', 'utf-8');
```

#### 复制 / 删除 / 重命名

```js
await fs.copyFile('./a.txt', './b.txt');     // 复制
await fs.rename('./old.txt', './new.txt');   // 重命名 / 移动
await fs.unlink('./test.txt');               // 删除文件
```

### 3. 目录操作

```js
// 创建目录（recursive: true 可创建多级）
await fs.mkdir('./logs/2024', { recursive: true });

// 读取目录
const files = await fs.readdir('./');
console.log(files);   // ['app.js', 'package.json', ...]

// 删除空目录
await fs.rmdir('./emptyDir');

// 删除目录及其内容（推荐）
await fs.rm('./temp', { recursive: true, force: true });
```

### 4. 路径判断与信息

```js
const fs = require('fs/promises');
const { constants } = require('fs');

// 判断文件/目录是否存在（推荐用 access）
async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

// 获取文件详细信息
const stat = await fs.stat('./package.json');
console.log(stat.isFile());        // 是否是文件
console.log(stat.isDirectory());   // 是否是目录
console.log(stat.size);            // 文件大小（字节）
console.log(stat.mtime);           // 修改时间
```

### 5. 常用 API 速查

| 方法                        | 说明                     |
|-----------------------------|--------------------------|
| `fs.readFile(path, encoding)` | 读取文件               |
| `fs.writeFile(path, data)`    | 写入文件（覆盖）       |
| `fs.appendFile(path, data)`   | 追加内容               |
| `fs.unlink(path)`             | 删除文件               |
| `fs.mkdir(path, options)`     | 创建目录               |
| `fs.readdir(path)`            | 读取目录内容           |
| `fs.rm(path, options)`        | 删除文件或目录         |
| `fs.rename(old, new)`         | 重命名 / 移动          |
| `fs.copyFile(src, dest)`      | 复制文件               |
| `fs.stat(path)`               | 获取文件/目录信息      |
| `fs.access(path)`             | 检查权限 / 是否存在    |


## 三、综合示例：把系统信息写入文件

```js
const os = require('os');
const fs = require('fs/promises');
const path = require('path');

async function saveSystemInfo() {
  const info = {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
    freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
    cpuCores: os.cpus().length,
    uptime: Math.floor(os.uptime() / 3600) + ' 小时',
    time: new Date().toLocaleString()
  };

  const content = JSON.stringify(info, null, 2);
  const filePath = path.join(__dirname, 'system-info.json');

  await fs.writeFile(filePath, content, 'utf-8');
  console.log('系统信息已保存到:', filePath);

  // 再读出来验证
  const data = await fs.readFile(filePath, 'utf-8');
  console.log('读取结果:\n', data);
}

saveSystemInfo().catch(console.error);
```


## 四、注意事项与最佳实践

### os 模块
- `totalmem()` / `freemem()` 返回的是**字节**，展示时记得换算
- `os.networkInterfaces()` 在不同系统返回结构略有差异，使用时注意兼容

### fs 模块
1. **优先使用 Promise 版本**（`fs/promises`），避免回调地狱
2. **尽量少用同步方法**（`readFileSync` 等），它们会阻塞事件循环
3. 操作文件前最好用 `fs.access` 或 `try/catch` 处理错误
4. 路径拼接推荐使用 `path.join()`，不要手动拼字符串
5. 大文件不要用 `readFile` 一次性读入内存，应使用流（`fs.createReadStream`）

### 安全提醒
- 不要直接把用户传入的路径拿去读写，注意路径穿越问题
- 生产环境对文件操作要做好权限和错误处理

