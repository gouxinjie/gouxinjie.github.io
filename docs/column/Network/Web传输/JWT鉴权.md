# 理解 JWT token



## **1. 什么是 JWT？**

`JWT（JSON Web Token）`是一种开放标准（RFC 7519），用于在各方之间安全传输 `JSON` 格式的信息。它由三部分组成，以点（`.`）分隔：

```
Header.Payload.Signature
```

[点击进入官网](https://jwt.io/introduction)

![jwt](../images/jwt.png)

## **2. JWT 的详细结构**

### **2.1 Header（头部）**

`Header` 通常包含两部分信息：

- **令牌类型（typ）**：固定为`JWT`
- **签名算法（alg）**：如`HS256`（HMAC SHA-256）或`RS256`（RSA SHA-256）

**示例**：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- **Base64Url 编码后**：
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  ```

### **2.2 Payload（负载）**

`Payload` 包含声明（Claims），即用户数据和其他元信息。声明分为三类：

1. **注册声明（Registered Claims）**（可选但建议使用）：

   - `iss`（Issuer）：签发者
   - `sub`（Subject）：主题（用户 ID）
   - `aud`（Audience）：接收方
   - `exp`（Expiration Time）：过期时间（Unix 时间戳）
   - `nbf`（Not Before）：生效时间
   - `iat`（Issued At）：签发时间

2. **公共声明（Public Claims）**：

   - 自定义但需避免冲突（建议使用命名空间，如`example.com/role`）

3. **私有声明（Private Claims）**：
   - 自定义数据（如`userId`、`role`）

**示例**：

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022,
  "exp": 1516242622
}
```

- **Base64Url 编码后**：
  ```
  eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ
  ```

### **2.3 Signature（签名）**

签名用于验证 `Token` 的完整性和来源。计算方式为：

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secretKey
)
```

- **密钥（`secretKey`）**：仅服务端知晓（如 HS256）或私钥（如 RS256）

**示例**：

```
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### **2.4 完整 JWT 示例**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## **3. JWT vs 传统 Cookie-Session**

### **3.1 传统 Cookie-Session 机制**

（1）客户端向服务器发送用户名、密码等认证信息。

（2）服务器通过验证后，服务器端生成一个 sessionId 返回给客户端，并将 sessionId 保存起来

（3）客户端自动把返回的 sessionId 存储在 cookie 中。

（4）后续客户端没发一次请求，都会在请求头携带 cookie，将 sessioId 传给服务端。

（5）服务器检查 sessionId 是否存在，如果存在执行相关业务。

![传统 Cookie-Session 机制](../images/JWT-1.png){width=80%}

**特点**：

（1）服务端需要存储 `Session（内存/Redis）`；每个用户信息都存储在服务端，随着用户量的增加，服务器的开销会增大。  
（2）`session `存储在服务端中，在分布式系统中，这种方式将会失效，为了保证各个服务器中的 `session `存储的信息一致，需要引入额外的中间件，比如：`redis` 等。
（3）对于非浏览器客户端不适用，原因在于 `session` 依赖 `cookie`，移动端可能没有 `cookie`。  
（4）不安全，`session `基于` cookie` ，如果 `cookie` 信息被截获，很容易进行 CSRF（跨域请求伪造攻击）  

### **3.2 JWT 工作流程**

(1) 客户端向服务器发送用户名和密码或其他认证凭据。

(2) 服务器验证凭据，如果有效，则创建一个 `JWT` 并将其返回给客户端。

(3) 客户端将 `JWT` 存储在本地存储`（如 localStorage 或 sessionStorage）或 cookie` 中。

(4) 客户端在每次请求时将 `JWT` 放在 `HTTP` 请求头中的 `Authorization` 字段中（通常格式为 Bearer `<token>`）。

(5) 服务器从请求头中提取 `JWT` 并验证其签名。如果签名有效，服务器会解码 `JWT` 并检查其有效性和其他声明。如果一切正常，服务器处理请求并返回响应。

![JWT 工作流程](../images/JWT-2.png){width=80%}

**特点**：

- **无状态**：服务端不存储 Token
- **自包含**：用户信息直接编码在 Token 中
- **跨域友好**：可通过 HTTP Header 传输

## **4. JWT 的优缺点**

### **4.1 优势**

- **无状态 & 可扩展性**：适合分布式系统和微服务架构
- **跨域/跨平台支持**：适合移动端 APP、第三方 API 集成
- **安全性增强**：签名防篡改（但需注意加密算法选择）
- **性能优化**：减少数据库/Session 存储查询

### **4.2 局限性**

- **Token 无法主动失效**：一旦签发，在过期前始终有效
- **存储安全风险**：前端存储（LocalStorage）易受 XSS 攻击
- **数据膨胀**：频繁携带完整 Payload
- **需要密钥管理**：签名密钥泄露会导致系统安全崩溃

## **5. 如何选择？**

### **5.1 使用 JWT 的场景**

- 前后端分离架构（如 React/Vue + REST API）
- 跨域/跨服务认证（微服务、第三方集成）
- 移动端 APP 认证

**示例代码（前端存储 JWT）**：

```javascript
// 登录后存储Token
const res = await login(username, password);
localStorage.setItem("jwt", res.token);

// 请求时携带
fetch("/api/protected", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`
  }
});
```

### **5.2 使用 Cookie-Session 的场景**

- 传统服务端渲染应用（如 PHP/Laravel）
- 需要严格会话控制的系统（如银行网站）
- 对 XSS 防护要求极高的场景

**安全 Cookie 设置（Express 示例）**：

```javascript
res.cookie("sessionId", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000
});
```

## **6. 总结**

| 特性          | JWT                 | Cookie-Session     |
| ------------- | ------------------- | ------------------ |
| **状态管理**  | 无状态              | 有状态             |
| **存储位置**  | LocalStorage/Header | Cookie             |
| **跨域支持**  | 友好                | 需 CORS 配置       |
| **主动失效**  | 困难                | 容易               |
| **XSS 风险**  | 较高                | 可防护（HttpOnly） |
| **CSRF 风险** | 无                  | 需防护             |
| **适用场景**  | API/移动端          | 传统 Web 应用      |
