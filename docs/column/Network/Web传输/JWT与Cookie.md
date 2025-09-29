# JWT 与 Cookie 存储的区别与安全性分析

[[toc]]

日常项目中，前端和后端通常需要存储和传递一些身份信息，如用户的登录状态。常见的方式包括 **JWT (JSON Web Token)** 和 **Cookie**。这两者在实现用户身份验证时，都有各自的优点与局限，

## 一、JWT 和 Cookie 存储的区别

### 1. 存储位置

- **JWT**：

  - 通常存储在 **`localStorage`** 或 **`sessionStorage`** 中。

    - **localStorage**：适合长期存储，除非手动删除，浏览器会保存数据。
    - **sessionStorage**：适合会话级存储，当浏览器关闭时数据会自动清除。

  - 由于存储在 **JavaScript 中**，JWT 是 **显式存储**，需要开发者手动传递。

- **Cookie**：

  - 存储在浏览器的 **Cookie 存储区**，这是浏览器原生提供的一种存储机制。
  - Cookie 会随着每次 HTTP 请求自动发送到服务器，除非设置了 `HttpOnly` 标志。
  - 通过设置 `Secure`、`SameSite` 等属性，可以进一步控制 Cookie 的传输方式和生命周期。

### 2. 存储大小限制

- **JWT**：

  - 每个 JWT 大小一般为 1 KB 左右（但实际大小取决于 payload 的内容）。
  - 存储在 `localStorage` 或 `sessionStorage` 中，一般支持约 **5MB** 的存储限制。

- **Cookie**：

  - 每个 Cookie 大小约为 **4 KB**。
  - 每个域名下的 Cookie 数量通常最多限制为 **20 个**。

**Cookie 如图所示：**

![JWT 与 Cookie 存储对比](../images/JWT-5.png)

### 3. 自动发送

- **JWT**：

  - JWT 需要手动通过 HTTP 头部（`Authorization: Bearer <token>`）发送。
  - 浏览器 **不会自动发送 JWT**，因此它不会在跨站请求中暴露。

- **Cookie**：

  - 浏览器会自动随每个请求发送相同域下的 Cookie，除非设置了 `HttpOnly` 或 `SameSite` 标志。

**如下：** 可以看到请求表头中包含了 `cookie` ![JWT 请求示例](../images/JWT-3.png)

**后端服务也能够获取到：**

![JWT 后端获取示例](../images/JWT-4.png)

## 二、JWT 与 Cookie 的安全性对比

### 1. 存储安全性

#### **JWT**：

- **XSS 攻击**：由于 JWT 存储在 `localStorage` 或 `sessionStorage` 中，它们 **不受同源策略保护**，且可以通过 JavaScript 访问。这使得 JWT 容易受到 **XSS（跨站脚本攻击）** 的威胁。攻击者如果能够注入恶意脚本，就可以窃取存储在 `localStorage` 或 `sessionStorage` 中的 JWT。

- **解决方案**：

  - 对应用进行 **严格的 XSS 防护**，使用 CSP（内容安全策略）和适当的输入输出校验。
  - 在存储 JWT 时，尽量减少敏感数据的暴露。

#### **Cookie**：

- **XSS 攻击**：Cookie 可以通过设置 `HttpOnly` 属性来防止 JavaScript 访问，从而降低 XSS 攻击的风险。如果设置了 `HttpOnly`，即使恶意脚本注入成功，它也无法获取存储在 Cookie 中的身份信息。

- **解决方案**：

  - 使用 `HttpOnly` 来保护 Cookie 中的敏感信息。
  - 在 Cookie 上设置 `Secure` 属性，确保它只通过 HTTPS 协议传输。

### 2. 传输安全性

#### **JWT**：

- **MITM（中间人攻击）**：JWT 本身没有加密功能，如果通过 **HTTP** 协议传输，会存在被中间人攻击的风险。攻击者可以截获并窃取 JWT。因此，必须始终通过 **HTTPS** 来传输 JWT，确保数据在传输过程中被加密。

- **加密**：如果 JWT 的内容包含敏感信息，可以使用 **JWE（JSON Web Encryption）** 来加密它，但通常使用 JWT 主要是签名，而不是加密。

#### **Cookie**：

- **MITM（中间人攻击）**：如果 Cookie 没有设置 `Secure` 标志，攻击者可以在不安全的 HTTP 连接下拦截 Cookie。设置 `Secure` 可以确保 Cookie 只在 HTTPS 协议下发送，从而降低被截获的风险。

- **CSRF（跨站请求伪造）**：由于 Cookie 会自动随每个请求发送，如果没有采取防护措施，容易受到 **CSRF 攻击**。可以通过设置 `SameSite` 属性来防止 Cookie 被跨站请求发送。

## 三、JWT 和 Cookie 的安全性对比总结

| **特性**     | **JWT**                                     | **Cookie**                                        |
| ------------ | ------------------------------------------- | ------------------------------------------------- |
| **存储位置** | `localStorage` 或 `sessionStorage`          | 浏览器的 Cookie 存储区                            |
| **自动发送** | 需要手动通过 HTTP 头发送（`Authorization`） | 自动随每个请求发送                                |
| **存储安全** | 容易受到 XSS 攻击                           | 可以通过 `HttpOnly` 防止 XSS 攻击                 |
| **传输安全** | 需要通过 HTTPS 加密，JWT 本身不加密         | 需要设置 `Secure` 和 `SameSite` 防止 MITM 和 CSRF |
| **防护机制** | 无内建防护机制，需手动配置                  | `HttpOnly`、`Secure`、`SameSite` 属性提供内建防护 |
| **使用场景** | 前后端分离，跨域认证，无状态认证            | 多页 Web 应用，持久会话                           |

## 四、使用场景

### 1. 使用 JWT 的场景

- **前后端分离**：JWT 非常适合前后端分离的应用场景，前端通过 API 与后端进行交互，后端使用 JWT 进行认证和授权。
- **无状态认证**：JWT 是无状态的，后端无需存储会话信息。每个请求都带有完整的身份信息，后端可以直接验证 JWT 的签名。
- **跨域认证**：由于 JWT 可以通过 HTTP 头传递，它非常适合跨域认证的场景。

### 2. 使用 Cookie 的场景

- **传统的 Web 应用**：Cookie 适合在传统的多页 Web 应用中使用，特别是在没有前后端分离的场景下。
- **持久会话**：Cookie 适用于需要保持用户在多个请求中的会话信息，特别是在浏览器关闭后，Cookie 可以根据设置的过期时间保持。

::: tip

**JWT** 适合无状态认证和前后端分离的应用，尤其在跨域认证时表现出色。但它的存储安全性相对较弱，容易受到 XSS 攻击。  
**Cookie** 适合传统的 Web 应用，支持 `HttpOnly` 和 `SameSite` 属性，可以更好地保护敏感信息，防止 XSS 和 CSRF 攻击。

:::

## 五、JWT 详细介绍

### 1. 什么是 JWT？

`JWT（JSON Web Token）`是一种开放标准（RFC 7519），用于在各方之间安全传输 `JSON` 格式的信息。它由三部分组成，以点（`.`）分隔：

```
Header.Payload.Signature
```

[点击进入官网](https://jwt.io/introduction)

![jwt](../images/jwt.png)

### 2. JWT 的详细结构

#### 2.1 Header（头部）

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

#### 2.2 Payload（负载）

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

#### 2.3 Signature（签名）

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

#### 2.4 完整 JWT 示例

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 3. JWT 的优缺点

**优势**

- **无状态 & 可扩展性**：适合分布式系统和微服务架构
- **跨域/跨平台支持**：适合移动端 APP、第三方 API 集成
- **安全性增强**：签名防篡改（但需注意加密算法选择）
- **性能优化**：减少数据库/Session 存储查询

**局限性**

- **Token 无法主动失效**：一旦签发，在过期前始终有效
- **存储安全风险**：前端存储（LocalStorage）易受 XSS 攻击
- **数据膨胀**：频繁携带完整 Payload
- **需要密钥管理**：签名密钥泄露会导致系统安全崩溃
