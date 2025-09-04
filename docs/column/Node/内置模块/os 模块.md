# **Node.js 中的 os 模块：系统信息与操作指南**

`os 是 Node.js `内置的核心模块，用于**获取操作系统信息和执行底层系统操作**。它提供了访问 CPU、内存、网络接口、系统路径等能力，是系统监控、性能分析和跨平台兼容性处理的重要工具。

## **1. 为什么需要 os 模块？**

- **获取系统信息**：如 CPU 架构、内存使用量、运行时间等。
- **跨平台兼容性**：处理不同操作系统（Windows/macOS/Linux）的路径、行尾符等差异。
- **系统级操作**：如临时目录管理、网络接口查询。

## **2. 基本用法**

```javascript
const os = require("os"); // CommonJS
// 或 ES Modules
import os from "os";
```

## **3. 核心方法解析**

### **（1）操作系统信息**

| 方法/属性       | 返回信息                    | 示例（Linux/macOS）                        |
| --------------- | --------------------------- | ------------------------------------------ |
| `os.platform()` | 操作系统平台                | `'linux'` / `'darwin'` (macOS) / `'win32'` |
| `os.arch()`     | CPU 架构                    | `'x64'` / `'arm64'`                        |
| `os.type()`     | 操作系统类型                | `'Linux'` / `'Windows_NT'`                 |
| `os.release()`  | 内核版本                    | `'5.15.0-78-generic'`                      |
| `os.version()`  | 操作系统版本（Node.js 16+） | `'Ubuntu 22.04.2 LTS'`                     |
| `os.hostname()` | 主机名                      | `'my-server'`                              |

**示例**：

```javascript
console.log(`系统: ${os.platform()} ${os.arch()}`);
console.log(`内核版本: ${os.release()}`);
```

### **（2）CPU 信息**

| 方法/属性       | 说明                              |
| --------------- | --------------------------------- |
| `os.cpus()`     | 返回 CPU 核心的数组（型号、速度） |
| `os.loadavg()`  | 系统平均负载（1/5/15 分钟）       |
| `os.freemem()`  | 空闲内存（字节）                  |
| `os.totalmem()` | 总内存（字节）                    |

**示例**：

```javascript
const cpus = os.cpus();
console.log(`CPU 核心数: ${cpus.length}`);
console.log(`空闲内存: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
```

### **（3）内存与运行时间**

| 方法/属性       | 说明                 |
| --------------- | -------------------- |
| `os.freemem()`  | 当前空闲内存（字节） |
| `os.totalmem()` | 系统总内存（字节）   |
| `os.uptime()`   | 系统运行时间（秒）   |

**示例**：

```javascript
console.log(`内存使用率: ${(1 - os.freemem() / os.totalmem()).toFixed(2)}%`);
console.log(`系统已运行: ${(os.uptime() / 3600).toFixed(2)} 小时`);
```

### **（4）用户与路径**

| 方法/属性       | 说明                          |
| --------------- | ----------------------------- |
| `os.homedir()`  | 当前用户的主目录路径          |
| `os.tmpdir()`   | 系统临时目录路径              |
| `os.userInfo()` | 当前用户信息（username, uid） |

**示例**：

```javascript
console.log(`临时目录: ${os.tmpdir()}`);
console.log(`当前用户: ${os.userInfo().username}`);
```

### **（5）网络接口**

| 方法/属性                | 说明                       |
| ------------------------ | -------------------------- |
| `os.networkInterfaces()` | 返回所有网络接口的详细信息 |

**示例**：获取本机 IPv4 地址

```javascript
const interfaces = os.networkInterfaces();
for (const name in interfaces) {
  for (const iface of interfaces[name]) {
    if (iface.family === "IPv4" && !iface.internal) {
      console.log(`IP: ${iface.address}`); // 如 192.168.1.100
    }
  }
}
```

### **（6）行尾符与常量**

| 属性/方法      | 说明                               |
| -------------- | ---------------------------------- |
| `os.EOL`       | 当前系统的行尾符（`\n` 或 `\r\n`） |
| `os.constants` | 系统常量（如错误码、信号量）       |

**示例**：跨平台处理文本行尾

```javascript
const lineBreak = os.EOL; // Windows: \r\n, *nix: \n
fs.writeFileSync("file.txt", `Line 1${lineBreak}Line 2`);
```

## **4. 实际应用场景**

### **场景 1：监控系统资源**

```javascript
// 实时打印内存和 CPU 使用率
setInterval(() => {
  console.clear();
  console.log(`内存: ${(1 - os.freemem() / os.totalmem()).toFixed(2)}%`);
  console.log(`CPU 负载: ${os.loadavg().join(", ")}`);
}, 1000);
```

### **场景 2：跨平台路径处理**

```javascript
const tempFile = path.join(os.tmpdir(), "temp-data.json");
fs.writeFileSync(tempFile, JSON.stringify(data));
```

### **场景 3：限制进程资源（结合 `cluster` 模块）**

```javascript
if (os.cpus().length > 4) {
  console.log("多核优化：启动子进程");
  cluster.fork();
}
```

## **5. 注意事项**

1. **性能开销**：  
   `os.cpus()` 和 `os.networkInterfaces()` 可能触发系统调用，避免高频使用。
2. **安全性**：  
   `os.userInfo()` 可能暴露敏感信息（如 `uid`），需谨慎记录日志。
3. **跨平台差异**：
   - Windows 的 `os.platform()` 返回 `win32`（即使 64 位系统）。
   - macOS 的 `os.type()` 返回 `Darwin`。

## **6. 总结**

| **方法/属性**            | **典型用途**                  |
| ------------------------ | ----------------------------- |
| `os.platform()`          | 检测操作系统类型              |
| `os.cpus()`              | 多核优化（如 `cluster` 模块） |
| `os.freemem()`           | 监控内存泄漏                  |
| `os.tmpdir()`            | 生成临时文件路径              |
| `os.networkInterfaces()` | 获取本机 IP 地址              |
| `os.EOL`                 | 跨平台文本换行处理            |
