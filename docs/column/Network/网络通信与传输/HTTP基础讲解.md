# HTTP 基础讲解

[[toc]]

`HTTP（HyperText Transfer Protocol`）是现代互联网通信的基础协议。无论是浏览网页、调用 API 还是微服务交互，都离不开 `HTTP` 协议。本文将全面解析 `HTTP` 协议的各个关键组成部分，包括请求方法、报文结构、头部字段、状态码以及安全策略，帮助开发者深入理解并优化 Web 通信。

## 一、HTTP 基础概念

### 1.1 什么是 HTTP？

`HTTP` 是一种**无状态**的**请求-响应**协议，基于 `TCP/IP` 实现，用于客户端（浏览器、App 等）和服务器之间的通信。

- **无状态**：每个请求相互独立，服务器默认不记录之前的交互（依赖 Cookie/Session 维持状态）
- **明文传输**（HTTPS 会对内容加密）
- 默认端口：`80`（HTTP）、`443`（HTTPS）

## 二、HTTP 请求方法详解

`HTTP` 定义了一组请求方法`（HTTP Methods）`来表明对资源的操作意图：

| 方法      | 说明               | 是否幂等 | 安全 | 请求体 |
| --------- | ------------------ | -------- | ---- | ------ |
| `GET`     | 获取资源           | ✅       | ✅   | ❌     |
| `POST`    | 提交数据           | ❌       | ❌   | ✅     |
| `PUT`     | 替换资源           | ✅       | ❌   | ✅     |
| `DELETE`  | 删除资源           | ✅       | ❌   | ❌     |
| `PATCH`   | 部分更新资源       | ❌       | ❌   | ✅     |
| `HEAD`    | 获取响应头         | ✅       | ✅   | ❌     |
| `OPTIONS` | 获取支持的通信选项 | ✅       | ✅   | ❌     |

**关键概念：**

- **幂等性**：多次执行相同操作结果一致（如 GET 不会改变资源状态）
- **安全性**：不会修改资源的操作（如 GET、HEAD）

## 三、HTTP 报文结构

### 3.1 请求报文

```http
POST /api/data HTTP/1.1
Host: example.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer xxxxxx

{"name": "John"}
```

- **请求行**：`方法 + URL + HTTP版本`
- **请求头**：包含元数据（如认证、内容类型等）
- **空行**：分隔头部和主体
- **请求体**：实际传输的数据

### **3.2 响应报文**

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{"status": "success"}
```

- **状态行**：`HTTP版本 + 状态码 + 状态文本`
- **响应头**：服务器返回的元数据
- **空行**：分隔头部和主体
- **响应体**：返回的实际内容

## 四、HTTP 头部字段详解

`HTTP` 头部字段是 `HTTP` 协议的核心组成部分，它们控制着客户端与服务器之间的通信方式。本文将全面整理 `HTTP` 协议中所有重要的头部字段，包括请求头、响应头、安全头以及内容协商相关字段。

### 4.1 内容协商头部

#### 4.1.1 Accept 相关字段

| 头部字段          | 说明                           | 示例值                        | 重要参数       |
| ----------------- | ------------------------------ | ----------------------------- | -------------- |
| `Accept`          | 声明客户端可接受的响应内容类型 | `text/html, application/json` | `q`权重值(0-1) |
| `Accept-Charset`  | 可接受的字符编码               | `utf-8, iso-8859-1`           |                |
| `Accept-Encoding` | 可接受的内容编码(压缩方式)     | `gzip, deflate, br`           |                |
| `Accept-Language` | 可接受的语言                   | `zh-CN, en-US;q=0.9`          |                |
| `Accept-Patch`    | 服务器支持的 PATCH 格式        | `application/json-patch+json` |                |

**示例：**

```http
Accept: text/html, application/xhtml+xml, application/xml;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN, zh;q=0.9, en;q=0.8
```

#### 4.1.2 Content-Type 相关字段

| 头部字段           | 说明               | 常见 MIME 类型                  |
| ------------------ | ------------------ | ------------------------------- |
| `Content-Type`     | 实体主体的媒体类型 | `text/html`, `application/json` |
| `Content-Encoding` | 内容编码方式       | `gzip`, `deflate`               |
| `Content-Language` | 内容语言           | `zh-CN`, `en-US`                |
| `Content-Location` | 返回资源的替代位置 | `/alternative.html`             |

**常见 Content-Type 值：**

- `text/plain`：纯文本
- `text/html`：HTML 文档
- `application/json`：JSON 数据
- `application/xml`：XML 数据
- `multipart/form-data`：文件上传
- `application/x-www-form-urlencoded`：表单数据

### 4.2 请求控制头部

#### 4.2.1 请求来源与目标

| 头部字段     | 说明                     | 示例                       |
| ------------ | ------------------------ | -------------------------- |
| `Host`       | 请求的目标主机           | `example.com`              |
| `Origin`     | 请求来源(协议+域名+端口) | `https://example.com`      |
| `Referer`    | 请求来源页面 URL         | `https://example.com/page` |
| `User-Agent` | 客户端标识               | `Mozilla/5.0`              |

#### 4.2.2 缓存控制

| 头部字段            | 说明           | 示例                            |
| ------------------- | -------------- | ------------------------------- |
| `Cache-Control`     | 缓存指令       | `no-cache`, `max-age=3600`      |
| `If-Modified-Since` | 条件请求(时间) | `Wed, 21 Oct 2023 07:28:00 GMT` |
| `If-None-Match`     | 条件请求(ETag) | `"123456"`                      |

#### 4.2.3 连接管理

| 头部字段     | 说明     | 示例                  |
| ------------ | -------- | --------------------- |
| `Connection` | 连接控制 | `keep-alive`, `close` |
| `Upgrade`    | 协议升级 | `websocket`           |

### 4.3 响应控制头部

#### 4.3.1 重定向与位置

| 头部字段   | 说明            | 示例               |
| ---------- | --------------- | ------------------ |
| `Location` | 重定向目标 URL  | `/new-location`    |
| `Refresh`  | 自动刷新/重定向 | `5; url=/new-page` |

#### 4.3.2 响应缓存

| 头部字段        | 说明         | 示例                            |
| --------------- | ------------ | ------------------------------- |
| `ETag`          | 资源版本标识 | `"123456"`                      |
| `Last-Modified` | 最后修改时间 | `Wed, 21 Oct 2023 07:28:00 GMT` |
| `Expires`       | 过期时间     | `Thu, 01 Dec 2023 16:00:00 GMT` |

#### 4.3.3 CORS 相关

| 头部字段                       | 说明       | 示例                          |
| ------------------------------ | ---------- | ----------------------------- |
| `Access-Control-Allow-Origin`  | 允许的源   | `*`, `https://example.com`    |
| `Access-Control-Allow-Methods` | 允许的方法 | `GET, POST, PUT`              |
| `Access-Control-Allow-Headers` | 允许的头部 | `Content-Type, Authorization` |

### 4.4 安全相关头部

#### 4.4.1 基础安全头

| 头部字段                    | 说明           | 推荐值                                |
| --------------------------- | -------------- | ------------------------------------- |
| `Strict-Transport-Security` | 强制 HTTPS     | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options`    | 禁用 MIME 嗅探 | `nosniff`                             |
| `X-Frame-Options`           | 防点击劫持     | `DENY`, `SAMEORIGIN`                  |

#### 4.4.2 内容安全策略(CSP)

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' cdn.example.com;
  img-src *;
  style-src 'self' 'unsafe-inline'
```

#### 4.4.3 其他安全头

| 头部字段           | 说明              | 示例                         |
| ------------------ | ----------------- | ---------------------------- |
| `X-XSS-Protection` | XSS 保护          | `1; mode=block`              |
| `Referrer-Policy`  | 控制 Referer 信息 | `no-referrer-when-downgrade` |
| `Feature-Policy`   | 控制浏览器功能    | `geolocation 'none'`         |

### 4.5 特殊用途头部

#### 4.5.1 下载控制

| 头部字段              | 说明         | 示例                              |
| --------------------- | ------------ | --------------------------------- |
| `Content-Disposition` | 内容处置方式 | `attachment; filename="file.txt"` |

#### 4.5.2 分块传输

| 头部字段            | 说明     | 示例      |
| ------------------- | -------- | --------- |
| `Transfer-Encoding` | 传输编码 | `chunked` |

#### 4.5.3 WebSocket

```http
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
```

### 4.6 最佳实践

#### 4.6.1 API 设计推荐头

```http
Accept: application/json
Content-Type: application/json
Cache-Control: no-cache
Authorization: Bearer xxxxxx
```

#### 4.6.2 安全头配置示例

```http
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

#### 4.6.3 性能优化头

```http
Cache-Control: public, max-age=3600
Content-Encoding: gzip
ETag: "123456"
```

## 五、HTTP 状态码详解

HTTP 状态码分为 5 大类，用于表示请求的处理结果。

### 5.1. 1xx（信息响应）

| 状态码 | 含义                | 说明                               |
| ------ | ------------------- | ---------------------------------- |
| `100`  | Continue            | 客户端应继续发送请求               |
| `101`  | Switching Protocols | 服务器同意切换协议（如 WebSocket） |

### 5.2. 2xx（成功响应）

| 状态码 | 含义       | 说明                         |
| ------ | ---------- | ---------------------------- |
| `200`  | OK         | 请求成功                     |
| `201`  | Created    | 资源创建成功                 |
| `204`  | No Content | 无返回内容（如 DELETE 请求） |

### 5.3. 3xx（重定向）

| 状态码 | 含义              | 说明                   |
| ------ | ----------------- | ---------------------- |
| `301`  | Moved Permanently | 永久重定向             |
| `302`  | Found             | 临时重定向             |
| `304`  | Not Modified      | 资源未修改（缓存生效） |

### 5.4. 4xx（客户端错误）

| 状态码 | 含义         | 说明         |
| ------ | ------------ | ------------ |
| `400`  | Bad Request  | 请求格式错误 |
| `401`  | Unauthorized | 未认证       |
| `403`  | Forbidden    | 无权限       |
| `404`  | Not Found    | 资源不存在   |

### 5.5. 5xx（服务器错误）

| 状态码 | 含义                  | 说明           |
| ------ | --------------------- | -------------- |
| `500`  | Internal Server Error | 服务器内部错误 |
| `502`  | Bad Gateway           | 网关错误       |
| `503`  | Service Unavailable   | 服务不可用     |

## 六、预检请求

浏览器会在以下情况发起**预检请求（Preflight Request）**，即自动先发送一个 `OPTIONS` 请求，确认服务器允许实际请求后再发送正式请求：

### 6.1 触发预检的 3 种条件

1. **非简单请求方法**
   - 使用 `PUT`、`DELETE`、`CONNECT` 等方法（`GET`、`POST`、`HEAD` 不会触发*简单请求*）
2. **自定义请求头**

   - 包含非安全头部（如 `Authorization`、`X-Custom-Header` 等）

3. **特殊 Content-Type**
   - `Content-Type` 不是以下三种之一：
     - `text/plain`
     - `multipart/form-data`
     - `application/x-www-form-urlencoded`
   - 例如：`application/json` 会触发预检

### 6.2 示例场景

```javascript
// 会触发预检的请求
fetch("https://api.example.com", {
  method: "PUT", // 非简单方法
  headers: {
    "Content-Type": "application/json", // 非简单Content-Type
    "X-Token": "123" // 自定义头部
  }
});
```

### 6.3 不会触发预检的简单请求

```javascript
// 简单请求（不触发预检）
fetch("https://api.example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded" // 简单Content-Type
  }
});
```
