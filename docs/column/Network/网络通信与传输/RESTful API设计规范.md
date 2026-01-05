# RESTful API设计规范

[[toc]]

`RESTful API` 是现代 `Web` 开发的基石，良好的 `API` 设计能显著提升系统的可用性、可维护性和扩展性。

## 1. 什么是 RESTful API？

`REST（Representational State Transfer）`是一种架构风格，`RESTful API` 是其具体实现，具有以下核心特征：

- **无状态（Stateless）**：服务端不保存客户端会话状态
- **资源导向（Resource-Based）**：所有数据抽象为资源
- **统一接口（Uniform Interface）**：使用标准 HTTP 方法操作资源
- **超媒体驱动（HATEOAS）**：响应中包含相关操作链接

## 2. RESTful API 设计原则

### 2.1 资源命名规范

| 原则         | 好例子                | 坏例子                 |
| ------------ | --------------------- | ---------------------- |
| 使用名词复数 | `/articles`           | `/getAllArticles`      |
| 层次化关系   | `/authors/5/articles` | `/authorArticles?id=5` |
| 小写+连字符  | `/user-profiles`      | `/userProfiles`        |

### 2.2 HTTP 方法语义

简单的说 RESTful 架构就是：“每一个 URI 代表一种资源，客户端通过四个 HTTP 动词，对服务器端资源进行操作，实现资源的表现层状态转移”。

| 请求方法（HTTP 动词） | URI                        | 解释                                           |
| --------------------- | -------------------------- | ---------------------------------------------- |
| **GET**               | `/students/`               | 获取所有学生                                   |
| **POST**              | `/students/`               | 新建一个学生                                   |
| **GET**               | `/students/ID/`            | 获取指定 ID 的学生信息                         |
| **PUT**               | `/students/ID/`            | 更新指定 ID 的学生信息（提供该学生的全部信息） |
| **PATCH**             | `/students/ID/`            | 更新指定 ID 的学生信息（提供该学生的部分信息） |
| **DELETE**            | `/students/ID/`            | 删除指定 ID 的学生信息                         |
| **GET**               | `/students/ID/friends/`    | 列出指定 ID 的学生的所有朋友                   |
| **DELETE**            | `/students/ID/friends/ID/` | 删除指定 ID 的学生的指定 ID 的朋友             |

### 2.3 状态码使用规范

| 状态码                | 含义       | 适用场景         |
| --------------------- | ---------- | ---------------- |
| 200 OK                | 成功       | 一般成功请求     |
| 201 Created           | 创建成功   | POST 创建资源后  |
| 204 No Content        | 无返回内容 | DELETE 成功      |
| 400 Bad Request       | 客户端错误 | 参数验证失败     |
| 401 Unauthorized      | 未认证     | 未提供有效凭证   |
| 403 Forbidden         | 无权限     | 认证但无权操作   |
| 404 Not Found         | 资源不存在 | 访问不存在的 URL |
| 429 Too Many Requests | 限流       | 请求频率过高     |

## 3. 最佳实践示例

### 3.1 典型 CRUD 端点设计

```text
GET    /articles          # 获取文章列表
POST   /articles          # 创建新文章
GET    /articles/{id}     # 获取特定文章
PUT    /articles/{id}     # 全量更新文章
PATCH  /articles/{id}     # 部分更新文章
DELETE /articles/{id}     # 删除文章
```

### 3.2 过滤、排序和分页

```text
GET /articles?state=published&sort=-created_at&page=2&limit=10
```

响应示例：

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 2,
    "limit": 10,
    "total_pages": 10
  }
}
```

### 3.3 版本控制方案

**URL 路径版本控制**（推荐）：

```text
https://api.example.com/v1/articles
```

**Header 版本控制**：

```http
GET /articles HTTP/1.1
Accept: application/vnd.example.v1+json
```

## 4. 高级设计模式

### 4.1 HATEOAS 实现

响应中包含可操作链接：

```json
{
  "id": 123,
  "title": "RESTful API设计",
  "links": [
    {
      "rel": "self",
      "method": "GET",
      "href": "/articles/123"
    },
    {
      "rel": "delete",
      "method": "DELETE",
      "href": "/articles/123"
    }
  ]
}
```

### 4.2 批量操作设计

```http
PATCH /articles
Content-Type: application/json

[
  { "id": 1, "op": "replace", "path": "/title", "value": "新标题" },
  { "id": 2, "op": "remove", "path": "/tags" }
]
```

### 4.3 异步操作处理

创建异步任务：

```http
POST /import-jobs
Content-Type: application/json

{ "file_url": "https://example.com/data.csv" }
```

响应：

```http
202 Accepted
Location: /jobs/123
```

查询任务状态：

```http
GET /jobs/123
```

## 5. 安全防护措施

### 5.1 认证与授权

```http
# JWT认证示例
GET /profile HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

### 5.2 输入验证

```json
{
  "error": {
    "code": "invalid_parameter",
    "message": "title长度需在5-100字符之间",
    "field": "title"
  }
}
```

### 5.3 速率限制

响应头：

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1625097600
```

## 6. 文档化工具推荐

- **OpenAPI/Swagger**：标准化 API 描述
- **Postman**：交互式 API 测试与文档
- **Redoc**：美观的 API 文档生成

## 7. 常见反模式

1. **动词滥用**：`/getArticles`、`/deleteUser`
2. **过度嵌套**：`/users/5/articles/3/comments/1/replies`
3. **忽略状态码**：所有响应都返回 200
4. **混合大小写**：`/UserProfile`
5. **忽略版本控制**：导致后期兼容性问题

## 总结

设计良好的 RESTful API 应该：  
✅ 遵循资源导向原则  
✅ 正确使用 HTTP 语义  
✅ 提供清晰的错误信息  
✅ 包含完善的文档  
✅ 考虑长期的可扩展性
