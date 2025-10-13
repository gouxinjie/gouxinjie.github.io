# Node.js 中的 os 模块：系统信息与操作指南

[[toc]]

`os` 模块是 Node.js 中的一个内置模块，它提供了与操作系统相关的多个工具和信息。这些工具可以帮助开发者在 Node.js 程序中获取有关操作系统的各种信息，例如系统的架构、内存使用情况、CPU 信息等。

### 1. 引入 `os` 模块

要使用 `os` 模块，首先需要在代码中引入它：

```javascript
const os = require("os");
```

### 2. 常用方法

#### 2.1 `os.platform()`

返回操作系统平台。比如，`'darwin'` 表示 macOS，`'linux'` 表示 Linux，`'win32'` 表示 Windows 等。

```javascript
console.log(os.platform()); // 'win32', 'darwin', 'linux' 等
```

#### 2.2 `os.arch()`

返回操作系统的 CPU 架构，通常为 `'x64'` 或 `'arm'`。

```javascript
console.log(os.arch()); // 'x64', 'arm', 'ia32' 等
```

#### 2.3 `os.cpus()`

返回一个包含每个 CPU 核心信息的数组。每个 CPU 的信息包括模型、速度等。

```javascript
console.log(os.cpus());
```

输出示例：

```javascript
[
  {
    model: "Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz",
    speed: 1800,
    times: {
      user: 390,
      nice: 0,
      sys: 340,
      idle: 8600,
      irq: 0
    }
  }
];
```

#### 2.4 `os.freemem()`

返回系统剩余内存的字节数。

```javascript
console.log(os.freemem()); // 以字节为单位
```

#### 2.5 `os.totalmem()`

返回系统的总内存大小，单位是字节。

```javascript
console.log(os.totalmem()); // 以字节为单位
```

#### 2.6 `os.hostname()`

返回操作系统的主机名。

```javascript
console.log(os.hostname()); // 例如 'my-computer'
```

#### 2.7 `os.release()`

返回操作系统的版本号。

```javascript
console.log(os.release()); // 例如 '10.0.19041'
```

#### 2.8 `os.uptime()`

返回操作系统的运行时间（单位：秒）。

```javascript
console.log(os.uptime()); // 例如 1000 秒
```

#### 2.9 `os.networkInterfaces()`

返回网络接口信息，包括每个网络接口的地址、家庭类型（IPv4 或 IPv6）、MAC 地址等。

```javascript
console.log(os.networkInterfaces());
```

输出示例：

```javascript
{
  eth0: [
    {
      address: "192.168.0.100",
      netmask: "255.255.255.0",
      family: "IPv4",
      mac: "00:1a:2b:3c:4d:5e",
      internal: false,
      cidr: "192.168.0.100/24"
    }
  ];
}
```

#### 2.10 `os.tmpdir()`

返回操作系统临时目录的路径。

```javascript
console.log(os.tmpdir()); // 例如 '/tmp'
```

#### 2.11 `os.endianness()`

返回操作系统的字节序（即内存中的数据如何存储）。通常是 `'LE'`（小端）或 `'BE'`（大端）。

```javascript
console.log(os.endianness()); // 'LE' 或 'BE'
```

### 3. 示例：获取系统信息

```javascript
const os = require("os");

console.log("操作系统平台:", os.platform());
console.log("CPU 架构:", os.arch());
console.log("主机名:", os.hostname());
console.log("操作系统版本:", os.release());
console.log("系统运行时间:", os.uptime(), "秒");
console.log("总内存:", os.totalmem(), "字节");
console.log("剩余内存:", os.freemem(), "字节");
console.log("CPU 信息:", os.cpus());
console.log("网络接口信息:", os.networkInterfaces());
console.log("临时目录路径:", os.tmpdir());
```
