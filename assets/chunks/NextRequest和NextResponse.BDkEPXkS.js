const e=`# NextRequest 和 NextResponse 讲解

[[toc]]


在 App Router 架构下，只要你涉及到 **中间件（Middleware）** 或 **自定义 API 路由（Route Handlers）**，\`NextRequest\` 和 \`NextResponse\` 就是避不开的核心对象。

它们本质上是对 Web 标准 \`Request\` 和 \`Response\` 对象的增强扩展（扩展了对 Cookie、URL 解析、重定向、Header 操作等快捷方法）。

![](../images/NextRequest.png)


## 一、 最常见的 4 个日常开发场景

### 1. 中间件（Middleware）：鉴权、重定向与 Cookie 处理

这是它们最常出现的场景（通常在根目录的 \`middleware.ts\` 中）。

\`\`\`typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 读取 Cookie 或 Header（NextRequest 增强方法）
  const token = request.cookies.get('token')?.value;
  const authHeader = request.headers.get('authorization');

  // 2. 未登录拦截重定向（NextResponse 增强方法）
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    // request.nextUrl 会自动保留 base URL 和 query 参数
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. 正常放行，并向下游（Server Components/API）注入自定义 Header
  const response = NextResponse.next();
  response.headers.set('x-user-id', '12345');
  return response;
}

\`\`\`


### 2. 写 API 接口（Route Handlers）：编写后台数据服务

当你在 \`app/api/user/route.ts\` 中写后端接口时，需要用它们来接收请求参数和返回 JSON。

\`\`\`typescript
// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 方便地获取 URL 查询参数 (?name=zhangsan)
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');

  // 返回标准的 JSON 响应与状态码
  return NextResponse.json(
    { message: \`Hello, \${name || 'Guest'}\` },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  // 解析 JSON 请求体
  const body = await request.json();

  // 设置 Cookie 返回给客户端
  const response = NextResponse.json({ success: true });
  response.cookies.set('session', 'abc-123', { httpOnly: true });

  return response;
}

\`\`\`


### 3. 跨域 CORS 配置与预检请求（OPTIONS）

需要为前端 API 开放跨域资源共享时，也会直接操作 \`NextResponse\`：

\`\`\`typescript
// app/api/public-data/route.ts
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

\`\`\`


### 4. 路由重写（Rewrite）与 A/B 测试

在中间件里实现无缝无感路由重写，或者做简单的流量分发（A/B 测试）：

\`\`\`typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const bucket = request.cookies.get('ab-bucket')?.value;

  // 如果命中了 B 组，把请求默默重定向到 /beta 页面，但浏览器 URL 不会变
  if (bucket === 'B' && request.nextUrl.pathname === '/landing') {
    return NextResponse.rewrite(new URL('/landing-beta', request.url));
  }
}

\`\`\`


## 二、 比原生 Request/Response 多了哪些便利功能？

| 功能 | 原生 Web API (\`Request\` / \`Response\`) | Next 增强 (\`NextRequest\` / \`NextResponse\`) |
| --- | --- | --- |
| **解析 URL 参数** | 需要自己 \`new URL(req.url).searchParams\` | **\`req.nextUrl.searchParams\`** 直接使用 |
| **操作 Cookie** | 需要手动正则解析 \`req.headers.get('cookie')\` | **\`req.cookies.get('name')\`** / **\`res.cookies.set()\`** |
| **返回 JSON** | \`new Response(JSON.stringify(data))\` | **\`NextResponse.json(data)\`** |
| **重定向/重写** | 手动拼装 \`302\` 状态码和 \`Location\` Header | **\`NextResponse.redirect()\`** / **\`NextResponse.rewrite()\`** |


## 三、 什么时候**用不到**它们？

在 Next.js 的 **React Server Components (RSC)** 或 **Server Actions** 中，你通常**不需要**手动处理 \`NextRequest\` 和 \`NextResponse\`：

* 在 Server Components 中获取 Cookie/Header，可以直接使用 Next.js 提供的快捷函数：
\`\`\`typescript
import { cookies, headers } from 'next/headers';

\`\`\`


* 在 Server Actions 中返回数据，直接 \`return { success: true }\` 即可，Next.js 会自动序列化，不需要包裹 \`NextResponse.json()\`。
`;export{e as default};
