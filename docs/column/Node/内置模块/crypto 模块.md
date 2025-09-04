# crypto 模块

`crypto` 是 Node.js 内置的加密模块，提供各种**加密、解密、哈希和签名**功能。

`crypto`模块的目的是为了提供通用的`加密和哈希算法`。用纯 `JavaScript` 代码实现这些功能不是不可能，但速度会非常慢。

`nodejs 用 C/C++ `实现这些算法后，通过 `crypto` 这个模块暴露为 `JavaScript` 接口，这样用起来方便，运行速度也快。

## **1. 基本使用**

```javascript
const crypto = require("crypto");
```

## **2. 常用功能**

### **2.1 哈希计算**

```javascript
// 创建哈希对象
const hash = crypto.createHash("sha256");

// 输入数据
hash.update("要加密的数据");

// 获取16进制哈希值
const result = hash.digest("hex");
console.log(result); // 输出64字符的sha256哈希
```

**支持的算法**：`md5`, `sha1`, `sha256`, `sha512`等

### **2.2 HMAC 签名**

```javascript
const hmac = crypto.createHmac("sha256", "密钥");
hmac.update("数据");
console.log(hmac.digest("hex"));
```

### **2.3 加密/解密（AES 为例）**

```javascript
// 加密
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
let encrypted = cipher.update("明文", "utf8", "hex");
encrypted += cipher.final("hex");

// 解密
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");
```

**参数说明**：

- `key`: 密钥（32 字节）
- `iv`: 初始化向量（16 字节）

### **2.4 生成随机数**

```javascript
// 生成16字节随机字符串
const randomBytes = crypto.randomBytes(16).toString("hex");
```

## **3. 实用示例**

### **3.1 密码加密存储**

```javascript
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512");
  return `${salt}:${hash.toString("hex")}`;
}
```

### **3.2 简单加密通信**

```javascript
// 生成密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048
});

// 公钥加密
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from("秘密消息"));

// 私钥解密
const decrypted = crypto.privateDecrypt(privateKey, encrypted);
```

## **4. 注意事项**

1. **不要使用已弃用的算法**（如 md5、sha1）
2. **密钥管理**：不要硬编码在代码中
3. **性能考虑**：大量数据加密建议使用流式处理

## **5. 常用方法**

| 方法                    | 用途       |
| ----------------------- | ---------- |
| `createHash()`          | 创建哈希   |
| `createHmac()`          | 创建 HMAC  |
| `createCipheriv()`      | 创建加密器 |
| `createDecipheriv()`    | 创建解密器 |
| `randomBytes()`         | 生成随机数 |
| `generateKeyPairSync()` | 生成密钥对 |
