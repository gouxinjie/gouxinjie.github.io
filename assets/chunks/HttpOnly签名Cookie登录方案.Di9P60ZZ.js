const n=`# 从 JWT 到 HttpOnly 签名 Cookie：一个个人档案系统的登录方案实践

很多项目一谈到登录态，第一反应就是 JWT。JWT 当然是成熟方案，但并不是所有 Web 项目都必须上 JWT。对于一个前后端同源、服务端接口和页面在同一个应用里的项目，\`HttpOnly Cookie + 服务端签名 token + CSRF 防护\` 往往更直接，也更贴合浏览器的工作方式。

本文结合一个真实的个人资料管理项目，说明为什么这个项目没有使用 JWT，而是选择了 HttpOnly 签名 Cookie；同时把浏览器为什么会自动携带 Cookie、后端如何读取 Cookie、这套方案的安全边界讲清楚。

## 一、项目背景

这个项目叫“个人档案 Archive”，定位是一个本地优先的私人资料管理系统。

它主要用来集中保存：

- 账号密码。
- 文档资料。
- 简历文件。
- 图片资料。
- 身份证、学历证明、入职材料等证件文件。
- 前端、后端、数据库、AI 相关学习资料。

项目技术栈：

| 类型 | 技术 |
| --- | --- |
| 前端框架 | Nuxt 4、Vue 3 |
| 开发语言 | TypeScript |
| UI 和样式 | Element Plus、SCSS |
| 服务端 | Nuxt Server API |
| 数据库 | SQLite |
| 数据库访问 | better-sqlite3 |
| 密码哈希 | bcryptjs |
| 请求封装 | ofetch |

这个项目有几个重要特点：

1. 它是一个单体 Nuxt 应用，页面和接口同源。
2. 默认使用 SQLite，本地启动即可运行，不依赖额外数据库服务。
3. 上传文件保存在本地目录，数据库只保存文件索引和业务信息。
4. 登录用户主要用于区分个人账号和演示账号，业务数据按用户隔离。
5. 当前没有移动端 App、开放 API、多后端服务和第三方登录需求。

这些背景决定了登录方案不需要一开始就复杂化。相比 JWT，HttpOnly 签名 Cookie 更贴合当前项目。

## 二、最终选择的登录方案

当前登录方案可以概括为：

\`\`\`text
SQLite 用户表 + bcrypt 密码哈希 + HMAC 签名 Cookie 会话 + CSRF 防护 + profileId 数据隔离
\`\`\`

对应流程：

1. 用户输入账号和密码。
2. 服务端查询 SQLite \`users\` 表。
3. 使用 bcrypt 校验明文密码和数据库中的密码哈希。
4. 校验通过后生成一个带签名的会话 token。
5. 服务端通过 \`Set-Cookie\` 写入 \`archive_session\`。
6. 浏览器保存这个 Cookie。
7. 后续同源 API 请求时，浏览器自动携带 Cookie。
8. 服务端从请求头读取 Cookie，校验签名和过期时间。
9. 校验通过后得到当前用户的 \`profileId\`。
10. 后续业务数据都按 \`profileId\` 查询和写入。

整体流程图：

\`\`\`mermaid
flowchart TD
  A["用户输入账号和密码"] --> B["POST /api/auth/login"]
  B --> C["服务端校验 CSRF Token"]
  C --> D["查询 SQLite users 表"]
  D --> E["bcrypt 校验密码"]
  E --> F{"账号密码是否正确"}
  F -- "否" --> G["返回登录失败"]
  F -- "是" --> H["生成会话 payload"]
  H --> I["使用 HMAC SHA256 签名"]
  I --> J["Set-Cookie: archive_session"]
  J --> K["浏览器保存 HttpOnly Cookie"]
  K --> L["后续接口请求自动携带 Cookie"]
  L --> M["服务端校验签名和过期时间"]
  M --> N["解析 profileId"]
  N --> O["按 profileId 读写业务数据"]
\`\`\`

## 三、用户表和密码存储

用户账号存储在 SQLite 的 \`users\` 表中。

\`\`\`sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

这里有几个关键点：

- \`username\` 是登录账号，必须唯一。
- \`password_hash\` 保存的是 bcrypt 哈希，不保存明文密码。
- \`status\` 用于控制用户是否可登录。
- \`id\` 同时作为当前系统里的 \`profileId\`，用于数据隔离。

默认情况下，系统会初始化两个账号：

| 账号 | 用途 | 默认密码 |
| --- | --- | --- |
| \`demo\` | 演示账号 | \`123456\` |
| \`xinjie\` | 个人账号 | 可通过环境变量配置 |

生产环境必须通过环境变量覆盖默认密码，避免演示密码进入真实部署环境。

## 四、签名 Cookie 长什么样

当前项目没有使用 JWT 标准格式，而是使用了自定义的两段式签名 token：

\`\`\`text
base64url(payload).base64url(signature)
\`\`\`

其中：

- \`payload\` 是用户会话信息和过期时间。
- \`signature\` 是服务端使用密钥对 \`payload\` 做 HMAC SHA256 后得到的签名。

会话信息大致包含：

\`\`\`ts
interface ArchiveSession {
  userId: string;
  username: string;
  displayName: string;
  profileId: string;
  profileName: string;
}
\`\`\`

签名密钥来自环境变量：

\`\`\`text
NUXT_SESSION_SECRET
\`\`\`

生产环境要求这个密钥必须存在，并且长度至少 32 个字符。这样可以保证客户端即使拿到了 payload，也无法伪造有效签名。

## 五、为什么没有直接使用 JWT

严格来说，当前方案不是没有 token，而是没有使用 JWT 标准 token。

JWT 的标准格式是：

\`\`\`text
header.payload.signature
\`\`\`

当前项目的签名 Cookie 格式是：

\`\`\`text
payload.signature
\`\`\`

它们的核心能力很接近：

| 能力 | 当前签名 Cookie | JWT |
| --- | --- | --- |
| 携带用户身份 | 支持 | 支持 |
| 携带过期时间 | 支持 | 支持 |
| 签名防篡改 | 支持 | 支持 |
| 服务端无状态校验 | 支持 | 支持 |

但它们的适用场景不完全一样。

当前项目没有使用 JWT，主要因为：

1. 项目是 Nuxt 单体应用，前端页面和后端接口同源。
2. 没有多个后端服务需要共享登录态。
3. 没有移动端 App 和第三方开放 API。
4. 登录态只服务于当前 Web 应用。
5. 使用 HttpOnly Cookie 可以让前端脚本读不到登录令牌，减少 XSS 后 token 被读取的风险。

如果未来项目变成下面这些形态，再考虑 JWT 会更合理：

- 前后端完全分离并跨域部署。
- 提供开放 API 给第三方调用。
- 增加移动端 App。
- 多个后端服务需要统一识别用户身份。
- 接入 OAuth、OIDC、SSO 等统一身份认证体系。

## 六、HttpOnly Cookie 到底解决了什么

登录成功后，服务端会写入 Cookie：

\`\`\`ts
setCookie(event, 'archive_session', token, {
  httpOnly: true,
  maxAge: 60 * 60 * 8,
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
});
\`\`\`

这些配置分别有明确作用：

| 配置 | 作用 |
| --- | --- |
| \`httpOnly: true\` | 前端 JavaScript 不能通过 \`document.cookie\` 读取 |
| \`maxAge\` | 控制 Cookie 有效期 |
| \`path: '/'\` | 当前站点下所有路径请求都可以匹配 |
| \`sameSite: 'strict'\` | 限制跨站请求携带 Cookie |
| \`secure\` | 生产环境只允许 HTTPS 携带 Cookie |

这里最容易误解的是 \`httpOnly\`。

\`httpOnly\` 不是说浏览器不会发送 Cookie，也不是说后端读不到 Cookie。它的意思是：

\`\`\`text
前端脚本不能读取 Cookie，但浏览器请求接口时仍然可以自动携带 Cookie。
\`\`\`

这正是 Web 登录里很常见的安全设计。

## 七、后端怎么拿到浏览器里的 Cookie

Cookie 确实保存在浏览器里，但后端不是主动访问浏览器。

真正发生的是：浏览器请求接口时，会把符合条件的 Cookie 放进 HTTP 请求头里。

请求大概长这样：

\`\`\`http
POST /api/passwords HTTP/1.1
Host: 127.0.0.1:3000
Cookie: archive_session=xxxx.yyyy; archive_csrf=zzzz
x-csrf-token: zzzz
\`\`\`

后端从当前请求中解析 Cookie：

\`\`\`ts
const session = verifySessionToken(getCookie(event, 'archive_session'));
\`\`\`

这行代码可以拆成四步理解：

1. \`getCookie(event, 'archive_session')\` 从请求头里取出 Cookie。
2. \`verifySessionToken\` 校验签名是否正确。
3. 校验 token 是否过期。
4. 校验通过后返回当前用户会话。

所以后端拿到 Cookie 的原因不是它能访问浏览器，而是浏览器按照 Cookie 标准把 Cookie 放进了请求头。

## 八、浏览器为什么会自动携带 Cookie

这是浏览器的内置标准行为。

只要服务端通过 \`Set-Cookie\` 响应头写入 Cookie，浏览器后续请求匹配的地址时，就会自动把 Cookie 放进 \`Cookie\` 请求头。

自动携带 Cookie 必须满足这些条件：

1. 请求域名匹配 Cookie 所属域名。
2. 请求路径匹配 Cookie 的 \`path\`。
3. Cookie 没有过期。
4. \`sameSite\` 规则允许当前请求携带。
5. 如果 Cookie 设置了 \`secure\`，请求必须是 HTTPS。

本地开发中，如果页面地址是：

\`\`\`text
http://127.0.0.1:3000
\`\`\`

接口地址是：

\`\`\`text
http://127.0.0.1:3000/api/passwords
\`\`\`

它们同协议、同域名、同端口，并且接口路径匹配 \`path: '/'\`，所以浏览器会自动携带 \`archive_session\`。

但如果 Cookie 是在 \`127.0.0.1\` 下写入的，接口却请求：

\`\`\`text
http://localhost:3000/api/passwords
\`\`\`

浏览器不会自动携带这个 Cookie。因为对浏览器来说，\`127.0.0.1\` 和 \`localhost\` 不是同一个主机。

## 九、为什么还需要 CSRF 防护

Cookie 的特点是浏览器会自动携带。这个特点让登录体验变简单，但也带来一个问题：如果没有限制，恶意网站可能诱导浏览器向当前站点发起请求。

所以当前项目对非 GET 请求增加了 CSRF 防护。

项目里有两个值：

\`\`\`text
archive_csrf Cookie
x-csrf-token Header
\`\`\`

前端请求时：

1. 先确保浏览器有 \`archive_csrf\` Cookie。
2. 从可读取的 CSRF Cookie 中取出 token。
3. 把 token 放到 \`x-csrf-token\` 请求头。

服务端校验时：

\`\`\`text
archive_csrf Cookie 的值 === x-csrf-token Header 的值
\`\`\`

流程图：

\`\`\`mermaid
flowchart TD
  A["非 GET 请求进入服务端"] --> B["读取 archive_csrf Cookie"]
  A --> C["读取 x-csrf-token Header"]
  B --> D{"两者是否存在且相等"}
  C --> D
  D -- "否" --> E["拒绝请求"]
  D -- "是" --> F["继续执行业务逻辑"]
\`\`\`

这就是常见的“双提交 Cookie”CSRF 防护思路。

## 十、业务接口为什么不信任前端 userId

很多早期项目会在请求体里传：

\`\`\`json
{
  "userId": "demo"
}
\`\`\`

但这种方式不能作为真正的鉴权依据。因为请求体是客户端发来的，用户可以篡改。

当前项目的关键原则是：

\`\`\`text
业务接口不信任前端传入的用户身份，只信任服务端从签名 Cookie 中解析出来的 session。
\`\`\`

例如新增文档时，服务端应该这样取当前用户：

\`\`\`ts
const session = assertAuthenticated(event);
const profileId = session.profileId;
\`\`\`

然后使用 \`profileId\` 写入数据：

\`\`\`ts
createFileAsset({
  userId: session.profileId,
  module: 'documents',
  title: payload.title
});
\`\`\`

这样即使前端传了另一个 \`userId\`，服务端也不会把它作为权限依据。

## 十一、这套方案的优点

对当前项目来说，这套方案有几个明显优点。

第一，简单。

它不需要单独维护 session 表，也不需要引入完整 OAuth/OIDC 体系。

第二，适合 Web。

浏览器天然支持 Cookie，同源请求自动携带，不需要前端手动管理登录 token。

第三，降低 token 暴露风险。

登录 Cookie 设置为 \`HttpOnly\` 后，前端脚本无法读取 \`archive_session\`。即使页面里出现 XSS 漏洞，攻击者也更难直接把登录 token 读出来。

第四，服务端仍然掌握信任边界。

客户端不能伪造 HMAC 签名。服务端每次都校验签名、过期时间，并从 token 中解析用户身份。

第五，和 CSRF 防护可以组合。

因为 Cookie 会自动携带，所以非 GET 请求增加 CSRF Header 校验，可以降低跨站请求风险。

## 十二、它不是完美方案

这套方案也有边界，不能把它理解成万能安全方案。

当前最大的问题是：它是无状态 token。

无状态 token 的特点是服务端不保存每个登录会话，所以服务端只要校验签名和过期时间就会认为 token 有效。这会带来几个限制：

1. 退出登录只是清除当前浏览器 Cookie，不能吊销已经泄露的 token。
2. 修改密码后，旧 token 在过期前仍可能有效。
3. 用户被禁用后，已经签发的旧 token 仍可能通过签名校验。
4. 如果想做“踢下线”或“所有设备退出”，需要额外机制。

这些限制不是当前项目独有，JWT 也有类似问题。

## 十三、后续如何增强

如果后续要增强安全性，可以在用户表增加一个版本字段：

\`\`\`text
session_version
\`\`\`

登录时把这个版本写入 token：

\`\`\`ts
interface ArchiveSession {
  userId: string;
  username: string;
  displayName: string;
  profileId: string;
  profileName: string;
  sessionVersion: number;
}
\`\`\`

接口鉴权时：

1. 先校验 token 签名和过期时间。
2. 查询用户表中的当前 \`session_version\`。
3. 对比 token 里的 \`sessionVersion\`。
4. 如果不一致，说明 token 已失效。

这样就可以支持：

- 修改密码后让旧 token 立即失效。
- 禁用用户后立即阻止旧 token。
- 手动递增版本号实现踢下线。
- 实现“退出所有设备”。

如果项目继续发展到多端、多服务、第三方开放接口，再考虑迁移到 JWT 或 OIDC 会更自然。

## 十四、总结

登录方案没有绝对标准答案，关键是匹配项目形态。

对于“个人档案 Archive”这样的 Nuxt 单体 Web 应用，页面和接口同源，数据保存在 SQLite，本身没有多服务和第三方开放接口需求。此时选择 \`HttpOnly 签名 Cookie + CSRF 防护\` 是一个合理、直接、低复杂度的方案。

这套方案的核心不是“比 JWT 更高级”，而是更适合当前场景：

- 使用 Cookie 承接浏览器原生登录态能力。
- 使用 HttpOnly 降低前端脚本读取 token 的风险。
- 使用 HMAC 签名保证会话内容不能被篡改。
- 使用 CSRF Token 弥补 Cookie 自动携带带来的跨站请求风险。
- 使用服务端解析出的 \`profileId\` 做业务数据隔离。

如果一句话总结：

\`\`\`text
用户登录后，服务端生成一个带签名的 HttpOnly Cookie；浏览器后续请求自动携带它；服务端校验签名和过期时间后解析出 profileId，再按 profileId 读写用户数据。
\`\`\`

这就是当前项目的登录技术方案。
`;export{n as default};
