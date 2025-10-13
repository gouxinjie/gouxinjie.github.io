# fs 模块

[[toc]]

`fs` 模块是 Node.js 中用于与文件系统进行交互的核心模块。通过 `fs` 模块，可以在 Node.js 程序中进行文件的读取、写入、删除、重命名等操作。

### 1. 引入 `fs` 模块

```javascript
const fs = require("fs");
```

### 2. 常用方法

#### 2.1 文件读取方法

##### 2.1.1 `fs.readFile()`

异步读取文件内容。

```javascript
fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) {
    console.log("文件读取失败:", err);
  } else {
    console.log("文件内容:", data);
  }
});
```

- **参数**:

  - `path`：要读取的文件路径。
  - `encoding`：文件编码（可选），如 `'utf8'`。如果不提供，返回的是原始的 Buffer 数据。
  - `callback`：回调函数，两个参数：`err`（错误信息）和 `data`（文件内容）。

##### 2.1.2 `fs.readFileSync()`

同步读取文件内容，阻塞代码执行，直到文件读取完成。

```javascript
try {
  const data = fs.readFileSync("example.txt", "utf8");
  console.log("文件内容:", data);
} catch (err) {
  console.log("文件读取失败:", err);
}
```

- **参数**: 与 `readFile()` 方法类似。
- **返回值**: 返回文件的内容，默认是 Buffer 类型。

#### 2.2 文件写入方法

##### 2.2.1 `fs.writeFile()`

异步写入数据到文件。如果文件不存在，Node.js 会自动创建文件。

```javascript
fs.writeFile("example.txt", "Hello, World!", "utf8", (err) => {
  if (err) {
    console.log("写入失败:", err);
  } else {
    console.log("写入成功");
  }
});
```

- **参数**:

  - `path`：文件路径。
  - `data`：写入的数据（字符串或 Buffer）。
  - `encoding`：文件编码（可选，默认是 `'utf8'`）。
  - `callback`：回调函数，当写入操作完成后调用。

##### 2.2.2 `fs.writeFileSync()`

同步写入数据，阻塞代码执行，直到写入完成。

```javascript
try {
  fs.writeFileSync("example.txt", "Hello, World!", "utf8");
  console.log("写入成功");
} catch (err) {
  console.log("写入失败:", err);
}
```

- **参数**: 与 `writeFile()` 方法类似。
- **返回值**: 无返回值。

#### 2.3 文件追加方法

##### 2.3.1 `fs.appendFile()`

异步追加数据到文件末尾。如果文件不存在，Node.js 会自动创建文件。

```javascript
fs.appendFile("example.txt", " This is an appended text.", "utf8", (err) => {
  if (err) {
    console.log("追加失败:", err);
  } else {
    console.log("追加成功");
  }
});
```

##### 2.3.2 `fs.appendFileSync()`

同步追加数据到文件末尾。

```javascript
try {
  fs.appendFileSync("example.txt", " This is an appended text.", "utf8");
  console.log("追加成功");
} catch (err) {
  console.log("追加失败:", err);
}
```

#### 2.4 文件删除方法

##### 2.4.1 `fs.unlink()`

异步删除文件。

```javascript
fs.unlink("example.txt", (err) => {
  if (err) {
    console.log("删除失败:", err);
  } else {
    console.log("文件已删除");
  }
});
```

##### 2.4.2 `fs.unlinkSync()`

同步删除文件。

```javascript
try {
  fs.unlinkSync("example.txt");
  console.log("文件已删除");
} catch (err) {
  console.log("删除失败:", err);
}
```

#### 2.5 文件重命名方法

##### 2.5.1 `fs.rename()`

异步重命名文件或移动文件。

```javascript
fs.rename("old_name.txt", "new_name.txt", (err) => {
  if (err) {
    console.log("重命名失败:", err);
  } else {
    console.log("文件已重命名");
  }
});
```

##### 2.5.2 `fs.renameSync()`

同步重命名文件或移动文件。

```javascript
try {
  fs.renameSync("old_name.txt", "new_name.txt");
  console.log("文件已重命名");
} catch (err) {
  console.log("重命名失败:", err);
}
```

#### 2.6 检查文件或目录是否存在

##### 2.6.1 `fs.existsSync()`

同步检查文件或目录是否存在。

```javascript
if (fs.existsSync("example.txt")) {
  console.log("文件存在");
} else {
  console.log("文件不存在");
}
```

##### 2.6.2 `fs.access()`

异步检查文件或目录的访问权限。

```javascript
fs.access("example.txt", fs.constants.F_OK, (err) => {
  if (err) {
    console.log("文件不存在");
  } else {
    console.log("文件存在");
  }
});
```

#### 2.7 获取文件状态信息

##### 2.7.1 `fs.stat()`

异步获取文件或目录的状态信息。

```javascript
fs.stat("example.txt", (err, stats) => {
  if (err) {
    console.log("获取文件状态失败:", err);
  } else {
    console.log("文件状态:", stats);
  }
});
```

##### 2.7.2 `fs.statSync()`

同步获取文件或目录的状态信息。

```javascript
try {
  const stats = fs.statSync("example.txt");
  console.log("文件状态:", stats);
} catch (err) {
  console.log("获取文件状态失败:", err);
}
```

### 3. 文件状态对象 `stats`

`fs.stat()` 和 `fs.statSync()` 返回的状态对象包含文件的详细信息：

- `stats.isFile()`：如果是文件，返回 `true`。
- `stats.isDirectory()`：如果是目录，返回 `true`。
- `stats.size`：文件大小（字节）。
- `stats.mtime`：文件的修改时间。

```javascript
fs.stat("example.txt", (err, stats) => {
  if (err) {
    console.log("获取文件状态失败:", err);
  } else {
    console.log("是否是文件:", stats.isFile());
    console.log("文件大小:", stats.size);
  }
});
```

### 4. 示例：创建一个文件并写入内容

```javascript
const fs = require("fs");

// 写入文件
fs.writeFile("example.txt", "Hello, this is an example!", "utf8", (err) => {
  if (err) {
    console.log("写入失败:", err);
    return;
  }
  console.log("文件写入成功");

  // 读取文件
  fs.readFile("example.txt", "utf8", (err, data) => {
    if (err) {
      console.log("读取失败:", err);
    } else {
      console.log("文件内容:", data);
    }
  });
});
```
