# fs 模块

文件系统操作是后端开发的核心能力之一。`Node.js` 通过内置的 `fs` 模块提供了全面的文件系统操作接口，支持同步、异步回调以及 `Promise` 三种编程风格。

## **1. 基本使用**

### **导入模块**

```javascript
const fs = require("fs"); // 回调风格
const fsPromises = require("fs/promises"); // Promise风格
```

## **2. 常用方法及参数**

### **2.1 文件读写**

#### **读取文件**

```javascript
fs.readFile(path, [options], callback);
```

- `path`: 文件路径
- `options` (可选):
  - `encoding`: 编码格式（如 'utf8'）
  - `flag`: 打开方式（默认 'r'）
- `callback`: `(err, data) => {}`

**示例**:

```javascript
fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

#### **写入文件**

```javascript
fs.writeFile(path, data, [options], callback);
```

- `data`: 写入内容（String/Buffer）
- `options` (可选):
  - `encoding`: 默认 'utf8'
  - `flag`: 默认 'w'（覆盖写入）
  - `mode`: 文件权限（默认 0o666）

**示例**:

```javascript
fs.writeFile("output.txt", "Hello", (err) => {
  if (err) throw err;
});
```

### **2.2 文件操作**

#### **追加内容**

```javascript
fs.appendFile(path, data, [options], callback);
```

参数同 `writeFile`

#### **重命名/移动**

```javascript
fs.rename(oldPath, newPath, callback);
```

#### **删除文件**

```javascript
fs.unlink(path, callback);
```

### **2.3 目录操作**

#### **创建目录**

```javascript
fs.mkdir(path, [options], callback);
```

- `options`:
  - `recursive`: 是否递归创建（默认 false）

#### **读取目录**

```javascript
fs.readdir(path, [options], callback);
```

- `options`:
  - `encoding`: 默认 'utf8'
  - `withFileTypes`: 是否返回 fs.Dirent 对象（默认 false）

#### **删除目录**

```javascript
fs.rmdir(path, [options], callback);
```

- `options`:
  - `recursive`: 是否递归删除（Node.js 14+）

## **3. Promise 示例**

```javascript
async function fileOps() {
  try {
    // 读取
    const data = await fsPromises.readFile("file.txt");

    // 写入
    await fsPromises.writeFile("new.txt", data);

    // 追加
    await fsPromises.appendFile("new.txt", "\nEOF");
  } catch (err) {
    console.error(err);
  }
}
```

## **4. 同步方法（后缀带 Sync）**

```javascript
try {
  const data = fs.readFileSync("file.txt");
  fs.writeFileSync("copy.txt", data);
} catch (err) {
  console.error(err);
}
```

## **5. 常用 flags**

| flag | 说明                       |
| ---- | -------------------------- |
| `r`  | 读取（默认）               |
| `w`  | 写入（覆盖）               |
| `a`  | 追加                       |
| `wx` | 排它写入（文件存在则失败） |
