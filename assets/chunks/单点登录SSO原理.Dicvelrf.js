const n=`# 单点登录 SSO 原理：一次登录，多系统通行

[[toc]]

## 一、什么是单点登录

**单点登录（Single Sign-On, SSO）**：用户**只登录一次**，就能在**多个相互信任的系统**之间无缝切换身份，不用每个系统都重新输入账号密码。

\`\`\`text
传统：登录 A → 登录 B → 登录 C  （各登录一次）
SSO：登录一次 → A、B、C 全部自动是登录态
\`\`\`

典型场景：

| 场景 | 系统群 |
|------|--------|
| 大公司内部 | OA、邮箱、文档、知识库、监控 |
| 互联网大厂 | 主站、订单、支付、后台、CMS |
| ToB SaaS | 主控台、子产品、子租户控制台 |

> 一句话：当你的产品从「一个系统」长成「一群系统」，SSO 就成了必选项。

## 二、SSO 的核心模型

无论哪种实现，都离不开三个角色：

\`\`\`text
┌──────────┐        ┌──────────────┐        ┌──────────┐
│  子系统A │        │  统一认证中心 │        │ 子系统B  │
│  (SP)    │◄─────►│   (IdP/CAS)  │◄──────►│  (SP)    │
└──────────┘        └──────────────┘        └──────────┘
     ▲                                              ▲
     └──── 用户 ──── 只需在认证中心登录一次 ─────────┘
\`\`\`

- **SP（Service Provider）**：业务子系统（OA、邮箱、订单…）。
- **IdP（Identity Provider）/ CAS Server**：统一认证中心，负责「告诉各个 SP 你是谁」。
- **用户**：只要和 IdP 交互一次，所有 SP 都认。

**最关键的问题**：IdP 怎么把登录态**安全地告诉**各个 SP？Cookie 默认是**按域隔离**的——\`a.com\` 的 cookie 在 \`b.com\` 看不到。

这就是 SSO 的核心矛盾：**Cookie 跨域难题**。

下面三个主流方案，本质都是**围绕怎么绕开这个限制**。

## 三、三大主流方案

### 方案 1：同父域 Cookie 共享（最简单）

如果你的子系统都在**同一个父域**下（比如 \`a.example.com\`、\`b.example.com\`、\`c.example.com\`），可以把 Cookie 的 \`domain\` 设为 \`.example.com\`，**所有子域共享**。

\`\`\`text
登录：
用户访问 a.example.com → 跳到 auth.example.com 登录
登录成功 → auth.example.com 设置 cookie（domain=.example.com）
用户访问 b.example.com → 自动带上 cookie → 已登录
\`\`\`

- ✅ 最简单，浏览器原生支持。
- ❌ 必须**统一父域**，否则不行。
- ❌ 耦合严重，所有系统必须在同一域下。

> 适用：同公司同一根域的内部系统群。绝大多数大厂内部系统用这种。

### 方案 2：CAS（Central Authentication Service）

**CAS 是耶鲁大学提出的 SSO 协议**，是教科书式的方案。即使你不直接用 CAS，理解它的流程能帮你理解几乎所有 SSO 实现。

#### 三个关键票根

| 概念 | 全称 | 是什么 | 在哪 |
|------|------|--------|------|
| **TGC** | Ticket Granting Cookie | 浏览器和认证中心之间的「会话」标识 | 浏览器 Cookie（认证中心域） |
| **TGT** | Ticket Granting Ticket | 认证中心持有的「会话主凭证」 | 认证中心服务端 |
| **ST** | Service Ticket | 认证中心给某个子系统的「入场券」，一次性 | URL / 表单 |

#### 流程时序图

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant A as 子系统 A (a.com)
    participant C as 认证中心 (auth.com)
    participant B as 子系统 B (b.com)

    Note over U,A: 用户第一次访问 a.com
    U->>A: GET a.com/home
    A->>U: 302 auth.com/login?service=a.com
    U->>C: GET auth.com/login?service=a.com
    Note over U,C: 浏览器带 TGC? (第一次: 没有)
    C->>U: 返回登录页
    U->>C: POST 用户名密码 + service=a.com
    C->>C: 创建 TGT、生成 ST-1
    C->>U: 302 a.com?ticket=ST-1<br/>同时 Set-Cookie TGC (auth.com)
    U->>A: GET a.com?ticket=ST-1
    A->>C: GET /validate?ticket=ST-1
    C->>A: 返回 用户身份(张三)
    A->>U: 200 已登录 + 建立 A 的 session

    Note over U,B: 之后访问 b.com(已登录 auth.com)
    U->>B: GET b.com/home
    B->>U: 302 auth.com/login?service=b.com
    U->>C: GET auth.com/login?service=b.com<br/>(带 TGC)
    C->>C: TGC => TGT => 用户已登录 => 生成 ST-2
    C->>U: 302 b.com?ticket=ST-2
    U->>B: GET b.com?ticket=ST-2
    B->>C: GET /validate?ticket=ST-2
    C->>B: 返回 用户身份
    B->>U: 200 已登录
\`\`\`

#### 流程拆解（5 步走）

1. **访问子系统 A**：浏览器请求 \`a.com/home\`，A 没找到 session → **302 跳到认证中心**，带上 \`service=a.com\`。
2. **认证中心检查 TGC**：
   - **没有 TGC**（第一次来）→ 弹出登录页。
   - **有 TGC**（已登录过）→ 直接生成 ST，重定向回 \`a.com?ticket=ST\`。
3. **登录页**：用户提交账号密码 → 认证中心验证 → **创建 TGT，签发 ST-1**，Set-Cookie TGC。
4. **重定向回 A**：\`302 → a.com?ticket=ST-1\`，A 拿 ST-1 去认证中心 **validate**（**后端对后端**），拿到用户身份 → 建立 A 的 session。
5. **访问子系统 B**：重复 1→2 时发现浏览器已经有 TGC，**直接签发 ST-2 给 B**，跳过登录页。

> 核心：ST 是**一次性**的（防止重放），TGC 是**会话级**的（浏览器和认证中心的「我还活着」凭据）。

### 方案 3：OAuth2.0 / OIDC（现代主流）

> OAuth2.0 是授权框架，OIDC（OpenID Connect）是 OAuth2.0 之上的身份层。现代 SSO（包括微信登录、GitHub 登录、企业 SSO）几乎都用这一套。

OAuth 2.0 在本仓库 Network 专栏已有详细讲解，SSO 视角下它的角色是：

| 角色 | 含义 | SSO 中对应 |
|------|------|-----------|
| Resource Owner | 用户 | 用户 |
| Client | 想拿用户身份的应用 | 子系统 SP |
| Authorization Server | 颁发 token 的服务 | 认证中心 IdP |
| Resource Server | 持有用户数据的资源 | 子系统后端 |

OIDC 在 OAuth2.0 的 access_token 之上多了一个 **\`id_token\`**（JWT，含用户身份），子系统拿到 id_token 就能直接知道「用户是谁」，无需再调用户接口。

> 现代实现几乎都走 OIDC：Keycloak、Authing、Auth0、阿里云 IDaaS、腾讯云 CIAM。

## 四、单点登出（难点）

SSO **登出** 比登录还难——任何一个子系统登出，**所有**子系统的会话都要清。

\`\`\`text
用户登出子系统 A
  ├─  A 清自己 session
  ├─  A 通知认证中心：销毁 TGT
  └─  认证中心通知所有 SP：销毁 session
       ├─  方案 A：广播（轮询 / WebSocket）
       ├─  方案 B：每个 SP 提供 logout 接口
       └─  方案 C：短 session + token 自动失效（OIDC 推荐）
\`\`\`

**简化做法（最常见）**：

- **认证中心登出** → 销毁 TGT → 所有 SP **下次访问时**发现 token 无效 → 自动跳登录页。
- 各 SP 的「陈旧 session」会有**几分钟到几小时**的失效延迟，多数场景可接受。

## 五、前端怎么接入 SSO

不同方案的前端流程差异较大，但核心都是「拦截 → 跳登录 → 拿身份 → 续会话」。

### 通用模板（CAS/OIDC 都适用）

\`\`\`js
// 1. 拦截器：发现未登录 → 跳认证中心
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const redirect = encodeURIComponent(window.location.href);
      window.location.href = \`/sso/login?redirect=\${redirect}\`;
    }
    return Promise.reject(err);
  },
);

// 2. 登录回调页 /sso/callback?code=xxx&ticket=xxx
const params = new URLSearchParams(location.search);
const code = params.get('code');

fetch('/api/auth/exchange', {
  method: 'POST',
  body: JSON.stringify({ code }),
})
  .then((r) => r.json())
  .then(({ access_token }) => {
    localStorage.setItem('access_token', access_token);
    location.href = params.get('redirect') || '/';
  });
\`\`\`

### 跨域的 iframe / postMessage

如果用 CAS 风格但又不希望**整个窗口跳来跳去**，可以用**隐藏 iframe + postMessage**：

\`\`\`js
// 业务页
const iframe = document.createElement('iframe');
iframe.style.display = 'none';
iframe.src = 'https://auth.com/embed/check';
document.body.appendChild(iframe);

window.addEventListener('message', (e) => {
  if (e.origin !== 'https://auth.com') return;
  if (e.data.type === 'sso:logged') {
    // 拿到用户身份，建自己的 session
    loginAs(e.data.user);
  }
});
\`\`\`

> 注意 \`e.origin\` 校验，**别相信任何跨域消息**。

## 六、安全考虑

| 风险 | 防御 |
|------|------|
| **Ticket / Code 重放** | ST / code 一次性，校验后立即销毁；OIDC 用 \`state\` / \`nonce\` 防重放 |
| **CSRF 攻击** | 登录加 CSRF Token，cookie 设 \`SameSite=Lax/Strict\` |
| **XSS 盗 token** | 业务 token 不入 localStorage；用 HttpOnly cookie；CSP 限制 inline script |
| **认证中心被攻破** | 全盘皆失 → 强 HTTPS + WAF + 异常监控 + refresh 撤销机制 |
| **跳转 URL 被劫持** | 严格校验 \`redirect\` 白名单，禁跳外网 |

## 七、实战建议

### 1. 优先用现成方案

| 需求 | 推荐 |
|------|------|
| 公司内部统一登录 | **Keycloak**（开源、可控） |
| ToB SaaS / 快速接入 | **Authing / 阿里云 IDaaS / 腾讯云 CIAM** |
| 海外 / 多租户 | **Auth0 / Okta** |
| 已有 OAuth 体系 | **基于 OIDC 直接接** |

### 2. 不要自造 SSO

> 自研 SSO 看着简单，**坑非常多**：session 同步、单点登出、跨域 Cookie、token 撤销… 任何一个坑都能让你写半个月。
> 现代方案几乎都基于 **OIDC + JWT**，直接接成熟服务性价比最高。

### 3. SSO 之外，给关键业务留**独立鉴权**

SSO 是「我是谁」，**业务权限**（「我能做什么」）要在每个 SP 内部独立管控——RBAC、数据权限、字段权限都不能依赖 IdP。

### 4. 监控

- 认证中心成功率、QPS、延迟。
- 异常登录（IP 突换、UA 突变、异地）。
- Token 颁发 / 撤销数。

## 八、总结

- **SSO** = 一次登录、多系统通行，是产品矩阵化的「必修课」。
- **核心矛盾**是 **Cookie 跨域**，三个方案各有取舍：同父域共享 / CAS / OIDC。
- **CAS** 的 TGC/TGT/ST 三件套是 SSO 思想的经典实现。
- **OIDC** 是现代主流，几乎所有新项目都该选它。
- **登出比登录难**，业界多靠「陈旧 session 自动过期」简化处理。
- **安全无小事**：ticket 一次性 + HTTPS + CSRF 防护 + token 撤销 + 异常监控。

一句话：**SSO 的本质，是把「身份」抽离到独立的认证中心，再通过一次性票据在子系统间安全传递——OIDC 时代，直接接成熟服务比自己造轮子划算太多。**`;export{n as default};
