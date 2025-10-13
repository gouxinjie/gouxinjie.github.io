# crypto 模块

[[toc]]

`crypto` 模块是 Node.js 中提供的一组加密功能，允许我们在应用程序中进行各种加密操作。它主要用于生成加密哈希值、对称和非对称加密、生成密钥、签名验证等任务。`crypto` 模块是非常重要的，特别是在处理敏感数据（如密码、API 密钥等）时。

### 1. 引入 `crypto` 模块

在使用 `crypto` 模块之前，需要先引入它：

```javascript
const crypto = require("crypto");
```

### 2. 常用功能

#### 2.1 哈希（Hashing）

哈希函数将输入数据（例如文本或文件）转换为固定长度的哈希值，常用于数据完整性检查、密码存储等场景。`crypto` 模块提供了多种哈希算法，如 SHA-256、SHA-512、MD5 等。

##### 2.1.1 创建哈希对象

```javascript
const hash = crypto.createHash("sha256");
hash.update("Hello, world!");
const result = hash.digest("hex"); // 获取哈希值，hex 表示以十六进制形式返回
console.log(result);
```

- `createHash(algorithm)`：创建一个哈希对象，`algorithm` 是哈希算法的名称，例如 `'sha256'`、`'sha512'`、`'md5'` 等。
- `update(data)`：向哈希对象添加数据，`data` 是输入数据。
- `digest(encoding)`：计算并返回最终的哈希值。`encoding` 可以是 `'hex'`（十六进制）、`'base64'` 或 `'binary'`。

##### 2.1.2 示例：计算字符串的 MD5 哈希

```javascript
const md5Hash = crypto.createHash("md5");
md5Hash.update("Hello, world!");
const md5Result = md5Hash.digest("hex");
console.log(md5Result); // 输出 MD5 哈希值
```

#### 2.2 加密与解密

`crypto` 模块提供了对称加密（如 AES）和非对称加密（如 RSA）功能。

##### 2.2.1 对称加密

对称加密使用相同的密钥进行加密和解密。常见的对称加密算法有 AES、DES 等。Node.js 使用 `crypto.createCipheriv()` 和 `crypto.createDecipheriv()` 来实现对称加密和解密。

###### 加密

```javascript
const algorithm = "aes-256-cbc"; // 加密算法
const password = "Password1234"; // 密钥（可以是任意的字符串）
const iv = crypto.randomBytes(16); // 初始化向量

const cipher = crypto.createCipheriv(algorithm, Buffer.from(password), iv);
let encrypted = cipher.update("Hello, world!", "utf8", "hex");
encrypted += cipher.final("hex");

console.log("Encrypted:", encrypted);
```

###### 解密

```javascript
const decipher = crypto.createDecipheriv(algorithm, Buffer.from(password), iv);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");

console.log("Decrypted:", decrypted);
```

- `createCipheriv()`：用于创建加密器对象，`algorithm` 是加密算法（如 `'aes-256-cbc'`），`key` 是密钥，`iv` 是初始化向量。
- `createDecipheriv()`：用于创建解密器对象，参数同 `createCipheriv()`。

#### 2.3 非对称加密

非对称加密使用公钥加密、私钥解密，反之亦然。常见的非对称加密算法有 RSA、ECDSA 等。

##### 2.3.1 生成密钥对

你可以使用 `crypto.generateKeyPair()` 方法生成公钥和私钥：

```javascript
crypto.generateKeyPair(
  "rsa",
  {
    modulusLength: 2048, // 密钥的长度
    publicKeyEncoding: {
      type: "spki", // 公钥编码格式
      format: "pem" // 输出格式（pem）
    },
    privateKeyEncoding: {
      type: "pkcs8", // 私钥编码格式
      format: "pem" // 输出格式（pem）
    }
  },
  (err, publicKey, privateKey) => {
    if (err) throw err;
    console.log("Public Key:", publicKey);
    console.log("Private Key:", privateKey);
  }
);
```

- `generateKeyPair(type, options, callback)`：生成密钥对，`type` 是加密算法类型（如 `'rsa'`、`'ecdsa'`），`options` 是密钥生成参数。

##### 2.3.2 加密和解密数据

使用公钥加密数据，用私钥解密数据。

###### 加密

```javascript
const publicKey = "-----BEGIN PUBLIC KEY-----\n..."; // 公钥（示例）
const data = "Hello, world!";

const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
console.log("Encrypted:", encryptedData.toString("base64"));
```

###### 解密

```javascript
const privateKey = "-----BEGIN PRIVATE KEY-----\n..."; // 私钥（示例）

const decryptedData = crypto.privateDecrypt(privateKey, encryptedData);
console.log("Decrypted:", decryptedData.toString());
```

- `publicEncrypt(publicKey, data)`：使用公钥对数据进行加密。
- `privateDecrypt(privateKey, data)`：使用私钥对数据进行解密。

#### 2.4 HMAC（Hash-based Message Authentication Code）

HMAC 是一种基于哈希的消息认证码，它可以保证数据的完整性和身份验证。通常与哈希算法（如 SHA）一起使用。

```javascript
const secret = "supersecretkey";
const hmac = crypto.createHmac("sha256", secret);
hmac.update("Hello, world!");
const result = hmac.digest("hex");
console.log("HMAC:", result);
```

- `createHmac(algorithm, key)`：创建一个 HMAC 对象，`algorithm` 是哈希算法（如 `'sha256'`），`key` 是密钥。
- `update(data)`：向 HMAC 对象添加数据。
- `digest(encoding)`：计算并返回最终的 HMAC 值。

#### 2.5 随机数生成

`crypto` 模块提供了生成加密安全的随机数的功能。这对于生成随机密码、令牌等非常有用。

```javascript
const randomBytes = crypto.randomBytes(16); // 生成16字节的随机数据
console.log(randomBytes.toString("hex")); // 输出为十六进制字符串
```

- `randomBytes(size)`：生成一个指定大小的加密安全的随机字节数组。

### 3. 示例：创建加密和解密系统

一个常见的使用场景是加密和解密用户密码。我们可以使用 `crypto` 模块中的哈希函数来对密码进行加密存储，同时在用户登录时对输入的密码进行验证。

#### 3.1 密码加密和验证

##### 加密密码

```javascript
const password = "userpassword123";
const salt = crypto.randomBytes(16).toString("hex"); // 生成盐值
const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");

console.log("Encrypted Password:", hash);
console.log("Salt:", salt);
```

##### 验证密码

```javascript
const inputPassword = "userpassword123"; // 用户输入的密码
const inputHash = crypto.createHmac("sha256", salt).update(inputPassword).digest("hex");

if (inputHash === hash) {
  console.log("Password is correct!");
} else {
  console.log("Password is incorrect!");
}
```

### 4. 总结

- `crypto` 模块提供了多种加密功能，包括哈希计算、对称加密、非对称加密、HMAC、随机数生成等。
- 哈希功能可以用于数据完整性验证和密码存储等场景。
- 对称加密和非对称加密可用于保护敏感数据的传输。
- HMAC 可以帮助保证数据的完整性和身份验证。
- `crypto` 模块还支持生成随机数和密钥对等操作。
