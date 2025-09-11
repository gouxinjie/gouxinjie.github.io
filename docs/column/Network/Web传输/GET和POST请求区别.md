# GET 与 POST 两大请求的区别与应用

## 一、核心区别对比

| 特性           | GET                               | POST                         |
| -------------- | --------------------------------- | ---------------------------- |
| **安全性**     | 参数在 URL 中可见，不安全         | 参数在请求体中，相对安全     |
| **数据长度**   | 受 URL 长度限制（通常 2048 字符） | 无限制（理论上）             |
| **缓存**       | 可被缓存                          | 不可被缓存                   |
| **浏览器历史** | 参数保留在浏览器历史中            | 参数不会保存在浏览器历史中   |
| **幂等性**     | 是（多次请求结果相同）            | 否（可能改变服务器状态）     |
| **后退/刷新**  | 无害                              | 数据会被重新提交             |
| **编码类型**   | application/x-www-form-urlencoded | 支持多种编码类型             |
| **书签**       | 可收藏为书签                      | 不可收藏为书签               |
| **使用场景**   | 获取数据（查询、搜索）            | 提交数据（登录、注册、支付） |

::: tip 幂等性介绍

幂等性是一个数学和计算机科学概念，指的是一个操作执行一次与执行多次所产生的效果完全相同。

案例：现在想象一个设置音量为 20 的按钮：

- 按一次：音量变为 20
- 再按多次：音量仍然是 20 ；这是幂等操作，因为无论执行多少次，结果都一样。

:::

## 二、详细解析

### 1. 安全性比较

**GET 请求**将参数直接附加在 URL 后面，形式为：

```
https://example.com/search?keyword=test&category=books
```

这意味着参数在地址栏可见，可能被浏览器历史记录、服务器日志记录，因此不适合传输敏感信息如密码、个人信息等。

**POST 请求**将参数放在请求体中，不会显示在 URL 上：

```http
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

username=john&password=secret123
```

这种方式相对更安全，但请注意，在没有使用 HTTPS 的情况下，POST 数据仍然可能被拦截。

### 2. 数据长度限制

**GET 请求**受到 URL 长度限制，不同浏览器和服务器有不同的限制：

- IE 浏览器：最多 2083 个字符
- Chrome/Firefox：至少 8000 个字符以上
- 服务器配置：通常限制在 8192 字节以内

**POST 请求**理论上没有长度限制，但实际上受服务器配置和内存限制。适合传输大量数据，如文件上传、长文本等。

### 3. 缓存与历史记录

**GET 请求**可以被浏览器缓存，参数会保留在浏览器历史记录中。这意味着：

- 优点：可以收藏为书签，便于分享链接
- 缺点：可能泄露敏感查询参数

**POST 请求**不会被缓存，参数也不会保存在浏览器历史中，提供更好的隐私保护。

### 4. 幂等性与副作用

**GET 请求**应该是幂等的，即多次执行相同的 GET 请求应该返回相同的结果，且不会对服务器状态产生改变。适合用于数据检索操作。

**POST 请求**通常是非幂等的，每次请求可能会对服务器状态产生改变（如创建新资源）。因此，浏览器在刷新时会提示是否重新提交表单数据。

### 5. 编码类型

**GET 请求**只支持`application/x-www-form-urlencoded`编码格式，参数以键值对形式出现。

**POST 请求**支持多种编码类型：

- `application/x-www-form-urlencoded`：默认表单编码
- `multipart/form-data`：适用于文件上传
- `application/json`：传输 JSON 数据
- `text/plain`：纯文本格式

## 三、使用场景

### 适合使用 GET 请求的场景

1. **搜索查询** - 用户输入搜索关键词
2. **分页导航** - 页面切换和筛选
3. **数据筛选** - 按条件过滤数据
4. **获取资源** - 请求静态资源或 API 数据
5. **可分享链接** - 包含所有必要参数的 URL

### 适合使用 POST 请求的场景

1. **用户登录/注册** - 提交用户名和密码
2. **表单提交** - 创建或更新资源
3. **文件上传** - 传输大量数据
4. **敏感操作** - 如支付、删除账户
5. **修改服务器状态** - 任何改变数据的操作

## 四、代码示例

### GET 请求示例

```javascript
// 使用Fetch API发送GET请求
fetch("https://api.example.com/products?category=books&limit=10")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// 使用Axios发送GET请求
axios
  .get("https://api.example.com/users", {
    params: {
      ID: 12345,
      sort: "name"
    }
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error("Error:", error));
```

### POST 请求示例

```javascript
// 使用Fetch API发送POST请求
fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com"
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// 使用Axios发送POST请求
axios
  .post("https://api.example.com/login", {
    username: "john",
    password: "secret123"
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error("Error:", error));
```

## 五、常见误区

1. **POST 比 GET 更安全**：这只是相对而言，在没有 HTTPS 的情况下，两者都不安全
2. **GET 只能获取数据**：技术上可以通过 GET 修改数据，但这违背了 HTTP 规范
3. **POST 没有长度限制**：虽然理论上没有，但实际上受服务器配置限制
