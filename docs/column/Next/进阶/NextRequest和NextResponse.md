# NextRequest 和 NextResponse ：自定义 API 逻辑和中间件处理的核心部分

[[toc]]

在 Next.js 中，`NextRequest` 和 `NextResponse` 是与服务器端请求和响应处理相关的对象，主要用于 API 路由、`middleware` 和自定义请求处理。它们分别继承自标准的 Web API 的 `Request` 和 `Response` 对象，但添加了 Next.js 特有的一些功能。

它们是 Next.js 中实现自定义 API 逻辑和中间件处理的核心部分。

### 1. **NextRequest**

`NextRequest` 是对标准 JavaScript `Request` 对象的扩展，它为 Next.js 提供了增强的请求功能。在 Next.js 中，你通常会在 **middleware** 或 **API 路由** 中使用 `NextRequest` 对象来访问和操作请求数据。

#### 1.1 **`NextRequest` 继承自 `Request`**

与浏览器原生的 `Request` 对象一样，`NextRequest` 允许你访问请求的各种属性和方法，如请求的 URL、方法、标头、查询参数等，但 Next.js 为其添加了一些额外的功能，方便处理 Next.js 中的特定情况。

#### 1.2 **`NextRequest` 的常用属性和方法**

- **`nextUrl`**：获取请求的 URL 对象，这是 Next.js 提供的增强版 URL 对象。它包含了请求的各个部分（协议、域名、路径、查询参数等）。你可以使用它来解析和操作 URL。

  ```js
  // 获取请求的路径名
  const path = req.nextUrl.pathname;
  ```

- **`cookies`**：用于获取请求中的 cookie。它返回一个 `NextCookies` 对象，你可以使用这个对象读取和设置 cookies。

  ```js
  const cookies = req.cookies;
  const userToken = cookies.get("user-token");
  ```

- **`headers`**：获取请求的头信息，和原生 `Request` 对象一样。

  ```js
  const userAgent = req.headers.get("user-agent");
  ```

- **`method`**：请求的 HTTP 方法（GET, POST 等）。

  ```js
  const method = req.method;
  ```

- **`body`**：请求的主体内容。通常在 POST 或 PUT 请求中使用。

  ```js
  const body = await req.json(); // 获取请求的 JSON 内容
  ```

- **`query`**：获取查询参数（例如 `?id=123`）。与原生 URLSearchParams 相似。

  ```js
  const id = req.nextUrl.searchParams.get("id");
  ```

#### 1.3 **示例：使用 `NextRequest` 在 Middleware 中获取请求信息**

```js
// app/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const userAgent = req.headers.get("user-agent");

  console.log(`Request URL: ${pathname}`);
  console.log(`Query Params: ${searchParams}`);
  console.log(`User-Agent: ${userAgent}`);

  // 返回响应
  return NextResponse.next();
}
```

在上面的例子中，`NextRequest` 对象通过 `req.nextUrl` 提供了对请求 URL 和查询参数的访问，并通过 `req.headers` 获取了请求头。

### 2. **NextResponse**

`NextResponse` 是对标准 Web API `Response` 对象的扩展，提供了一些 Next.js 特有的功能，允许你定制和控制响应内容，发送重定向、设置 HTTP 状态码等。

#### 2.1 **`NextResponse` 的常用功能**

- **`NextResponse.next()`**：表示继续执行请求流程，通常用于中间件或请求钩子中，允许请求继续传递到下一个中间件或最终的页面处理。

  ```js
  return NextResponse.next(); // 继续处理请求
  ```

- **`NextResponse.redirect(url)`**：创建一个重定向响应，可以是永久重定向（301）或临时重定向（302）。

  ```js
  return NextResponse.redirect("https://example.com");
  ```

  - **`status`**：你可以传递 HTTP 状态码来设置重定向类型，`301` 是永久重定向，`302` 是临时重定向。

  ```js
  return NextResponse.redirect("https://example.com", 301); // 永久重定向
  ```

- **`NextResponse.rewrite(url)`**：与重定向不同，`rewrite` 只是改变请求的目标 URL，而不改变浏览器的地址栏 URL。这在需要将请求转发到另一个页面但不改变浏览器显示时很有用。

  ```js
  return NextResponse.rewrite("/new-url");
  ```

- **`NextResponse.json(data)`**：返回一个 JSON 格式的响应。这在 API 路由中非常常见，用于返回结构化的数据。

  ```js
  return NextResponse.json({ message: "Hello, world!" });
  ```

- **`NextResponse.text(data)`**：返回一个文本格式的响应。

  ```js
  return NextResponse.text("Hello, world!");
  ```

- **`NextResponse.headers`**：可以用来设置响应头。

  ```js
  const res = NextResponse.next();
  res.headers.set("X-Custom-Header", "value");
  return res;
  ```

- **`NextResponse.cookie(name, value, options)`**：设置 cookie。你可以设置 cookie 的名称、值以及一些选项（例如 `maxAge`, `httpOnly` 等）。

  ```js
  const res = NextResponse.next();
  res.cookie("user-token", "12345", { maxAge: 60 * 60 * 24 });
  return res;
  ```

#### 2.2 **示例：使用 `NextResponse` 在 Middleware 中发送响应**

```js
// app/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // 如果请求是某个特定路径，重定向到另一个页面
  if (pathname === "/old-page") {
    return NextResponse.redirect("/new-page");
  }

  // 否则，继续请求
  return NextResponse.next();
}
```

在上面的示例中，当请求的路径是 `/old-page` 时，Next.js 会返回一个重定向响应，将用户引导到 `/new-page`。

### 3. **`NextRequest` 和 `NextResponse` 在 API 路由中的应用**

`NextRequest` 和 `NextResponse` 也可以用于 Next.js 的 API 路由中，使得你能够控制请求和响应的细节。例如：

```js
// app/api/hello/route.js
import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  const name = req.nextUrl.searchParams.get("name") || "Guest";
  return NextResponse.json({ message: `Hello, ${name}!` });
}
```

在这个 API 路由中，我们使用 `NextRequest` 获取查询参数 `name`，并使用 `NextResponse.json()` 返回一个 JSON 格式的响应。

### 4. **总结**

- **`NextRequest`** 是对标准 `Request` 对象的扩展，提供了更多 Next.js 特有的功能，如访问 `nextUrl`、`cookies`、`query` 等。
- **`NextResponse`** 是对标准 `Response` 对象的扩展，允许你定制响应，如返回 JSON、重定向、设置 cookies 等。

这两个对象是 Next.js 中处理请求和响应的基础，特别是在 **API 路由** 和 **middleware** 中，它们提供了比原生 Web API 更强大且灵活的功能。
