const n=`# 常见鉴权方案

[[toc]]

## 一、🔑 常见鉴权方案

在 \`Next.js (App Router) \`里，常见的鉴权方式有三类：

### 1. 基于 Cookie / Session（推荐用于网站登录）

- 用户登录时，验证用户名/密码 → 生成 Session，写到数据库（或 Redis）。
- 通过 \`Set-Cookie\` 返回给浏览器。
- 后续请求时，浏览器会自动带上 Cookie，API 路由里解析 Cookie 并校验。

👉 工具：

- [\`next-auth\`](https://next-auth.js.org/)（最常见，支持 OAuth、邮箱登录、JWT 等）
- 自己实现（用 \`cookies()\` API + MySQL 存 Session）

### 2. 基于 JWT（适合前后端分离 / 移动端 / API 服务）

- 登录时生成 **JWT Token**（包含用户 ID 等信息，签名保证不被篡改）。
- 客户端保存到 \`localStorage\` 或 \`httpOnly Cookie\`。
- 每次请求时在 \`Authorization\` 头里带上：

  \`\`\`
  Authorization: Bearer <token>
  \`\`\`

- API 路由里校验 Token 是否有效。

👉 工具：

- \`jsonwebtoken\` 库
- 可以配合 \`middleware.js\` 在全局做保护

### 3. API Key（适合服务端 API 调用，比如 AI 模型接口）

- 给每个用户分配一个 API Key（存 MySQL）。
- 客户端请求时带上：

  \`\`\`
  Authorization: Bearer <API_KEY>
  \`\`\`

- 后端校验 Key 是否存在 & 权限是否足够。

## 二、基于JWT认证的案例

下面是一个在 \`Next.js\`项目中基于 \`JWT\` 保护 \`/api/users\` 接口的案例。

### 1. 安装依赖

\`\`\`bash
pnpm install jsonwebtoken bcryptjs
\`\`\`

### 2. 添加登录接口 \`app/api/auth/login/route.js\`

\`\`\`js
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET || "mysecret"; // 应放到 .env 文件

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "用户不存在" }), { status: 401 });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: "密码错误" }), { status: 401 });
    }

    // 生成 JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
\`\`\`

调用之后，返回的 \`token\` 是一个字符串，类似 \`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzI2NjY3NjQyLCJleHAiOjE3MjY2NzE2NDN9.1234567890abcdef1234567890abcdef\`。

**如图所示：**

![auth-1.png](../images/auth-1.png)

### 3. 保护 \`/api/users\`

在 \`app/api/users/route.js\` 里加 **Token 校验**：

\`\`\`js
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecret";

// 校验函数
async function authenticate(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, SECRET); // 返回用户信息
  } catch (err) {
    return null;
  }
}

export async function GET(req) {
  const user = await authenticate(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "未授权" }), { status: 401 });
  }

  const [rows] = await pool.query("SELECT * FROM users");
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
\`\`\`

现在，访问 \`/api/users\` 必须带上正确的 JWT：

\`\`\`
Authorization: Bearer <token>
\`\`\`
`;export{n as default};
