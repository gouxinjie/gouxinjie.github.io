# requests 与 httpx 讲解

在 Python 中发送 HTTP 请求，最常用的两个库是 **`requests`**（经典同步库）和 **`httpx`**（现代支持同步 + 异步的库）。两者 API 高度相似，但设计理念和功能有所不同。

### 一、快速对比

| 特性                | requests              | httpx                          |
|---------------------|-----------------------|--------------------------------|
| 同步请求            | ✅ 原生支持           | ✅ 支持                        |
| 异步请求            | ❌ 不支持             | ✅ 原生支持                    |
| HTTP/2              | ❌                    | ✅ 支持                        |
| API 风格            | 简单易用              | 高度兼容 requests，更现代      |
| 连接池 / 超时       | 支持                  | 支持（更灵活）                 |
| 官方维护状态        | 成熟稳定              | 活跃开发                       |
| 推荐场景            | 简单脚本、同步项目    | 新项目、需要异步、HTTP/2       |

**建议**：
- 新项目优先考虑 **httpx**
- 维护老项目或只需要简单同步请求，继续用 **requests** 即可


### 二、安装

```bash
pip install requests
pip install httpx
# 如果需要 HTTP/2 支持（httpx）
pip install httpx[http2]
```

### 三、requests 基本用法

```python
import requests

# GET 请求
response = requests.get("https://httpbin.org/get", params={"key": "value"})
print(response.status_code)        # 200
print(response.text)               # 文本内容
print(response.json())             # 解析 JSON

# POST 请求
response = requests.post(
    "https://httpbin.org/post",
    json={"name": "Alice", "age": 25},          # 自动设置 Content-Type: application/json
    headers={"User-Agent": "MyApp/1.0"}
)

# 其他常用方法
requests.put(url, data=...)
requests.delete(url)
requests.patch(url)
requests.head(url)
```

#### 常用参数

```python
response = requests.get(
    url,
    params={"page": 1},                 # 查询参数
    headers={"Authorization": "Bearer xxx"},
    timeout=10,                         # 超时（秒）
    allow_redirects=True,               # 是否允许重定向
    verify=True,                        # SSL 证书验证
)
```

#### 会话（Session）—— 保持连接和 Cookie

```python
session = requests.Session()
session.headers.update({"User-Agent": "MyApp/1.0"})

session.get("https://example.com/login")
response = session.get("https://example.com/profile")  # 自动携带 Cookie
```

### 四、httpx 基本用法（同步）

httpx 的同步 API 几乎可以无缝替换 requests：

```python
import httpx

# GET
response = httpx.get("https://httpbin.org/get", params={"key": "value"})
print(response.status_code)
print(response.text)
print(response.json())

# POST
response = httpx.post(
    "https://httpbin.org/post",
    json={"name": "Alice"},
    headers={"User-Agent": "MyApp/1.0"}
)
```

#### 使用 Client（推荐，类似 Session）

```python
with httpx.Client(timeout=10.0, headers={"User-Agent": "MyApp/1.0"}) as client:
    response = client.get("https://httpbin.org/get")
    print(response.json())
```

`Client` 会自动管理连接池，性能更好，也支持上下文管理器。


### 五、httpx 异步用法（重要优势）

```python
import httpx
import asyncio

async def main():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://httpbin.org/get")
        print(response.status_code)
        print(response.json())

        # 并发请求
        tasks = [
            client.get("https://httpbin.org/get"),
            client.get("https://httpbin.org/ip"),
            client.get("https://httpbin.org/user-agent"),
        ]
        responses = await asyncio.gather(*tasks)
        for r in responses:
            print(r.status_code)

asyncio.run(main())
```

异步适合：
- 高并发爬虫
- 同时请求多个 API
- FastAPI / 异步 Web 服务中调用外部接口

### 六、常见实战功能

#### 1. 超时设置

```python
# requests
requests.get(url, timeout=5)                  # 总超时
requests.get(url, timeout=(3, 10))            # 连接超时, 读取超时

# httpx
httpx.get(url, timeout=5.0)
httpx.get(url, timeout=httpx.Timeout(5.0, connect=3.0))
```

#### 2. 认证

```python
# Basic Auth
requests.get(url, auth=("user", "pass"))
httpx.get(url, auth=("user", "pass"))

# Bearer Token
headers = {"Authorization": "Bearer your_token"}
```

#### 3. 文件上传

```python
# requests / httpx 写法几乎相同
files = {"file": open("test.txt", "rb")}
response = requests.post(url, files=files)
```

#### 4. 代理

```python
proxies = {
    "http://": "http://127.0.0.1:7890",
    "https://": "http://127.0.0.1:7890",
}
requests.get(url, proxies=proxies)
httpx.get(url, proxies=proxies)
```

#### 5. 处理响应

```python
response = httpx.get(url)

response.status_code
response.headers
response.text               # 字符串
response.content            # 字节
response.json()             # 字典
response.raise_for_status() # 状态码不是 2xx 时抛异常
```

### 七、错误处理

```python
import httpx

try:
    with httpx.Client(timeout=10) as client:
        response = client.get("https://httpbin.org/status/404")
        response.raise_for_status()          # 抛出 HTTPStatusError
except httpx.HTTPStatusError as e:
    print(f"HTTP 错误: {e.response.status_code}")
except httpx.RequestError as e:
    print(f"请求失败: {e}")
except httpx.TimeoutException:
    print("请求超时")
```

`requests` 的异常体系类似（`requests.HTTPError`、`requests.Timeout` 等）。


### 八、最佳实践建议

1. **生产环境优先用 `Client` / `Session`**，而不是每次调用顶层的 `get()`/`post()`
2. **必须设置超时**，避免请求无限挂起
3. 使用 `response.raise_for_status()` 快速发现 HTTP 错误
4. 需要并发时，直接上 **httpx + asyncio**
5. 请求头统一管理（User-Agent、Authorization 等）
6. 敏感信息（Token、密码）不要硬编码，用环境变量或配置管理
7. 大型项目可封装一个统一的 HTTP 客户端类

简单封装示例（httpx）：

```python
import httpx
from typing import Any

class HttpClient:
    def __init__(self, base_url: str, token: str | None = None):
        headers = {"User-Agent": "MyApp/1.0"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        self.client = httpx.Client(base_url=base_url, headers=headers, timeout=15.0)

    def get(self, path: str, **kwargs) -> Any:
        response = self.client.get(path, **kwargs)
        response.raise_for_status()
        return response.json()

    def close(self):
        self.client.close()
```
