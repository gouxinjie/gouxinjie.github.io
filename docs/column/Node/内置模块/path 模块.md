# Node.js 中的 path 模块:处理文件和目录路径

[[toc]]

`path` 是 Node.js 内置的核心模块，用于**处理文件和目录路径**。它提供了一系列工具方法来规范化、拼接、解析路径，确保跨平台兼容性（Windows、macOS、Linux）。

## 1. 为什么需要 path 模块？

- **跨平台兼容性**：Windows 使用 `\`，Unix（macOS/Linux）使用 `/`，`path` 模块自动适配当前系统。
- **路径拼接**：避免手动拼接路径时遗漏分隔符（如 `dir + '/' + file` 容易出错）。
- **规范化路径**：处理 `./`、`../` 等相对路径，解析出绝对路径。

## 2. 基本用法

### 导入模块

```javascript
const path = require("path"); // CommonJS
// 或 ES Modules
import path from "path";
```

## 3. 核心方法解析

### （1）路径拼接：`path.join([...paths])`

将多个路径片段拼接成一个**规范化**的路径：

```javascript
path.join("/foo", "bar", "baz/file.js");
// *nix: '/foo/bar/baz/file.js'
// Windows: '\foo\bar\baz\file.js'
```

**特点**：

- 自动处理不同操作系统的分隔符。
- 解析 `.`（当前目录）和 `..`（上级目录）。

**示例**：

```javascript
const fullPath = path.join(__dirname, "src", "app.js");
// 输出（假设 __dirname 是 /project）:
// *nix: /project/src/app.js
// Windows: \project\src\app.js
```

### （2）路径解析：`path.resolve([...paths])`

将路径解析为**绝对路径**（从右向左计算，直到生成绝对路径）：

```javascript
path.resolve("src", "app.js");
// 假设当前工作目录是 /project，输出:
// /project/src/app.js

path.resolve("/foo", "/bar", "baz.js");
// 输出（以最后一个绝对路径 /bar 为基准）:
// /bar/baz.js
```

**vs `path.join()`**：

- `join` 只是拼接，`resolve` 会返回绝对路径。
- `resolve` 更适用于需要确定最终路径的场景（如配置文件路径）。

### （3）规范化路径：`path.normalize(path)`

处理路径中的冗余部分（如 `//`、`../`）：

```javascript
path.normalize("/foo/bar//baz/../qux.js");
// 输出: /foo/bar/qux.js
```

### （4）获取路径信息

| 方法                       | 作用                   | 示例（路径：`/project/src/app.js`） |
| -------------------------- | ---------------------- | ----------------------------------- |
| `path.basename(path)`      | 获取文件名（含扩展名） | `app.js`                            |
| `path.basename(path, ext)` | 去掉扩展名             | `app`（传 `.js` 时）                |
| `path.dirname(path)`       | 获取目录名             | `/project/src`                      |
| `path.extname(path)`       | 获取扩展名（含 `.`）   | `.js`                               |

**示例**：

```javascript
const filePath = "/project/src/app.js";
console.log(path.basename(filePath)); // 'app.js'
console.log(path.dirname(filePath)); // '/project/src'
console.log(path.extname(filePath)); // '.js'
```

### （5）路径分隔符

| 属性             | 说明                             |
| ---------------- | -------------------------------- |
| `path.sep`       | 系统路径分隔符（`\` 或 `/`）     |
| `path.delimiter` | 系统环境变量分隔符（`;` 或 `:`） |

**示例**：

```javascript
console.log(path.sep); // *nix: '/', Windows: '\'
console.log("PATH环境变量分隔符:", path.delimiter); // *nix: ':', Windows: ';'
```

### （6）跨平台路径转换

| 方法                          | 作用                                     |
| ----------------------------- | ---------------------------------------- |
| `path.toNamespacedPath(path)` | 转 Windows 长路径格式（如 `\\?\C:\foo`） |
| `path.parse(path)`            | 解析路径为对象                           |
| `path.format(pathObject)`     | 从对象生成路径                           |

**`path.parse()` 示例**：

```javascript
const parsed = path.parse("/project/src/app.js");
console.log(parsed);
/* 输出:
{
  root: '/',
  dir: '/project/src',
  base: 'app.js',
  ext: '.js',
  name: 'app'
}
*/
```

**`path.format()` 示例**：

```javascript
path.format({
  dir: "/project/src",
  name: "app",
  ext: ".js"
}); // 输出: '/project/src/app.js'
```

## 4. 实际应用场景

### 场景 1：安全拼接用户输入的路径

```javascript
const userInput = "../malicious.js";
const safePath = path.join(__dirname, "data", userInput);
// 输出规范化的绝对路径，避免目录穿越攻击
```

### 场景 2：动态加载文件

```javascript
const configPath = path.resolve(process.cwd(), "config.json");
const config = require(configPath);
```

### 场景 3：处理不同操作系统的路径

```javascript
const filePath = path.join("assets", "images", "logo.png");
// Windows: assets\images\logo.png
// *nix: assets/images/logo.png
```

## 5. 注意事项

1. **不要手动拼接路径**：  
   错误示例：`const badPath = dir + '/' + file;`（跨平台兼容性问题）。
2. **`__dirname` vs `process.cwd()`**：
   - `__dirname`：当前模块的目录路径。
   - `process.cwd()`：Node.js 进程的工作目录（可能变化）。
3. **Windows 路径的特殊性**：
   - 反斜杠 `\` 在字符串中需转义（如 `C:\\foo`）。
   - `path` 模块会自动处理。

## 6. 总结

| **方法**           | **用途**       | **示例**                             |
| ------------------ | -------------- | ------------------------------------ |
| `path.join()`      | 安全拼接路径   | `path.join('a', 'b.js')`             |
| `path.resolve()`   | 解析绝对路径   | `path.resolve('src', 'app.js')`      |
| `path.normalize()` | 规范化冗余路径 | `path.normalize('/foo//bar/../baz')` |
| `path.basename()`  | 获取文件名     | `path.basename('/a/b.js')` → `b.js`  |
| `path.parse()`     | 解析路径对象   | `path.parse('/a/b.js')`              |
