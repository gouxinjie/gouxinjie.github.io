# 个人技术站点 mylab — 部署运维文档

> **mylab**
> 版本 v1.0 | 2026-07-22
> 运行环境：阿里云 ECS | 部署方式：Docker (standalone) + Nginx + GitHub Actions


## 一、项目背景

### 1.1 项目简介

mylab 是作者的个人技术站点，集 **技术文档、Markdown 文章、国际化与项目作品集** 于一体。站点基于 Next.js 14 App Router，使用 `next-intl` 实现中/英多语言路由；文档内容以 Markdown 编写并运行时渲染（支持代码高亮与 mermaid 流程图）；同时包含作者做过项目的展示页。

站点为需要常驻 Node 运行时的动态应用（国际化中间件在 Node 端执行），**无法纯静态导出**，因此采用 Docker 容器化部署。

### 1.2 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端框架 | Next.js 14 (App Router) + React 18 + TypeScript |
| 样式 | SCSS (sass) |
| 国际化 | next-intl |
| 内容渲染 | react-markdown + rehype-highlight + rehype-slug + remark-gfm + mermaid + github-slugger + lowlight |
| 构建/包管理 | pnpm 9.15.4（corepack 锁定） |
| 部署 | Docker（standalone 镜像）+ Nginx 反代 + GitHub Actions CI/CD |

### 1.3 项目信息

| 条目 | 内容 |
|------|------|
| 源码仓库 | https://github.com/gouxinjie/mylab |
| 镜像仓库 | ghcr.io/gouxinjie/mylab:latest |
| 线上访问 | http://gouxinjie.com |
| ECS 部署路径 | /var/www/mylab |
| 容器数 | 2（app + nginx） |


## 二、部署架构

### 2.1 网络拓扑

整体采用「**宿主 Nginx 反向代理 + Docker Compose 双容器**」方式部署。ECS 的 80 端口由宿主自带的 Nginx 统一监听（该 Nginx 还托管其他站点），本项目不再抢占 80，而是把 Docker Nginx 容器映射到宿主 `3500`，由宿主 Nginx 按 `server_name` 把 `gouxinjie.com` 转发到 `127.0.0.1:3500`。

**请求流向（分层视图）：**

```
┌─────────────────────────────────────────────────────────────────────┐
│  外网用户                                                            │
│  http://gouxinjie.com                                              │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│  阿里云 ECS 宿主机                                                   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  宿主 Nginx (:80) — 统一入口（已占用，托管多站点）               │ │
│  │                                                                │ │
│  │  server_name gouxinjie.com                                    │ │
│  │        └── proxy_pass ─────────►  http://127.0.0.1:3500       │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Docker Compose ── 默认 bridge 网络                             │ │
│  │                                                                │ │
│  │  ┌─────────────────────┐    ┌─────────────────────────────┐   │ │
│  │  │ nginx (1.27-alpine) │    │ app (next standalone)        │   │ │
│  │  │ 容器:80 ──映射──► :3500  │ 监听 :3500 (仅内网)            │   │ │
│  │  │                     │    │                              │   │ │
│  │  │ upstream app:3500   │    │ server.js (NODE_ENV=prod)    │   │ │
│  │  │   proxy_pass ───────┼───►│ 运行时读取 content/ messages/ │   │ │
│  │  └─────────────────────┘    └─────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**请求链路总结：**

```text
浏览器 ──► ECS:80 (宿主 Nginx)
              │
              └─ gouxinjie.com ──► 127.0.0.1:3500 (nginx 容器, 容器内部 :80)
                                        │
                                        └─ /  ──► app:3500 (Docker DNS, Next.js standalone)
                                                      │
                                                      └─ 渲染页面 / 读取 content/ messages/
```

### 2.2 端口规划

| 端口 | 归属 | 说明 |
|------|------|------|
| 80 | 宿主 Nginx | 对外唯一入口，按域名分流多项目（宿主已占用） |
| 3500 | Docker nginx 容器 | 宿主映射端口，供宿主 Nginx 反代（避让宿主 80 冲突） |
| 3500 | app (Next.js) | 容器内 standalone server 端口，仅 nginx 容器经 compose 网络访问 |

> `app` 容器通过 `expose: ["3500"]` 仅对内暴露，不映射宿主端口；`nginx` 容器 `3500:80` 把宿主 3500 转到容器内的 80。

**⚠️ 关键易混点：本架构中 `3500` 出现了两次，但并非同一个端口直连**

| 出现位置 | 含义 | 使用者 |
|---------|------|--------|
| `app` 的 `expose: "3500"` | Next.js standalone server 在**容器内部**监听的端口 | app 容器内的 Node 进程（仅 Docker 内网可见） |
| `nginx` 的 `ports: "3500:80"` | **宿主机 3500 → nginx 容器内部 80** 的端口映射 | 宿主 Nginx 反代使用的对外入口 |

两者只是恰好同名、纯属顺手；也可设为不同数字（如宿主用 3500、app 用 3000），不影响功能。**两个 3500 之间并不直接相连，中间还隔着 nginx 容器。**

**与两层 Nginx 的交互链路：**

```text
浏览器
  │  http://gouxinjie.com
  ▼
【宿主 Nginx】 :80            ← 统一入口，按域名分流多站点
  │  server_name gouxinjie.com
  │  proxy_pass http://127.0.0.1:3500
  ▼
宿主机端口 :3500
  │  (Docker 端口映射 3500:80)
  ▼
【容器 Nginx】 容器内 :80     ← 反代 + gzip 压缩
  │  nginx.conf: upstream next_app { server app:3500; }
  │  proxy_pass http://next_app
  ▼
app 容器 :3500                ← Next.js standalone server
  │  渲染页面 / 读取 content/、messages/
```

- **宿主 Nginx ↔ 宿主 3500**：宿主 Nginx 在 `:80` 收到 `gouxinjie.com` 请求后，`proxy_pass http://127.0.0.1:3500` 转给本机 3500；Docker 借 `3500:80` 映射把它送进 nginx 容器的 80。
- **容器 Nginx ↔ app 容器 3500**：nginx 容器内 `listen 80`，依据 `nginx.conf` 的 `upstream next_app { server app:3500; }` 反代到 `app:3500`（`app` 为 compose 服务名，由 Docker 内置 DNS 解析），并顺带完成 gzip 与请求头透传。

> 一句话：宿主 3500 是「门牌号」，让宿主 Nginx 找到容器 Nginx；app 的 3500 是「房间号」，让容器 Nginx 找到应用进程；`nginx` 容器的 `3500:80` 映射把门牌号和房间号接起来。

### 2.3 容器与网络

两个容器通过 docker-compose 加入默认 bridge 网络，容器间使用服务名（如 `app`）互访，借助 Docker 内置 DNS 解析。`nginx` 容器内 `nginx.conf` 定义 `upstream next_app { server app:3500; }`，将请求反代到应用容器。`nginx` 通过 `depends_on: app` 保证应用先启动。

应用层为**无状态**部署：构建产物（含 `content/`、`messages/`）随镜像打包，运行时无需外部数据库，容器销毁重建不丢业务数据。

### 2.4 CI/CD 流水线

项目使用 GitHub Actions 自动化部署，工作流文件位于 `.github/workflows/deploy.yml`。触发条件为 push `master` 分支，完整流程：

| # | 阶段 | 操作 |
|---|------|------|
| 1 | 检出 | GitHub Actions Runner 上 `checkout` 完整代码（含 `pnpm-lock.yaml`） |
| 2 | 登录 | 登录 `ghcr.io`（使用内置 `GITHUB_TOKEN`，无需额外密钥） |
| 3 | 构建推送 | `docker/build-push-action` 在 Runner 上 `docker build` 并推送 `ghcr.io/gouxinjie/mylab:latest`（启用 gha 缓存加速） |
| 4 | 传运行时文件 | SCP 把 `nginx.conf` + `docker-compose.yml` 上传到 ECS `/var/www/mylab`（`rm: true` 先清空） |
| 5 | 拉起容器 | ECS 端 SSH 执行：`docker compose pull` → `docker compose down \|\| true` → `docker compose up -d` → `docker image prune -f` |

**安全性 / 资源要点：**
- ECS 无需安装 Node.js 或编译工具链 —— 重构建在 GitHub Runner（内存充足）完成，ECS 仅 `docker compose pull` 运行，规避小内存机器（1.8G）`next build` 的 OOM / swap 卡死。
- 本项目暂未接入第三方密钥；后续如需密钥，应通过 GitHub Secrets 注入，不进入源码仓库。
- ECS 无需访问 GitHub（镜像来自 `ghcr.io`），无需配置 Deploy Key。

### 2.5 镜像仓库（ghcr.io）

#### 2.5.1 ghcr.io 是什么

`ghcr.io` 是 **GitHub Container Registry（GitHub 容器镜像仓库）** 的域名，由 GitHub 官方提供，用于存储和分发 Docker 镜像。它和 GitHub 代码仓库同属一套账户与权限体系，镜像地址格式为：

```text
ghcr.io/<GitHub用户名或组织名>/<镜像名>:<标签>
```

本项目镜像完整地址为 `ghcr.io/gouxinjie/mylab:latest`（见 1.3 节）。

#### 2.5.2 为什么用 ghcr.io

相比自建 Registry 或推到 Docker Hub，这里选 ghcr.io 的原因：

| 优势 | 说明 |
|------|------|
| 与代码同源 | 镜像与 `github.com/gouxinjie/mylab` 在同一 GitHub 账户下，无需额外注册/管理独立的镜像服务 |
| 免密钥登录 | CI 内使用 GitHub 自带的 `GITHUB_TOKEN` 即可 `docker login ghcr.io`，无需在 Secrets 里额外配置用户名/密码 |
| 权限打通 | 仓库是 private 时镜像默认也私有；协作者/部署机通过 GitHub 权限即可拉取，无需分发 Docker Hub 凭证 |
| 延迟低、稳定 | ECS 拉取 GitHub 提供的镜像源速度快且稳定，避免 Docker Hub 匿名拉取限流（rate limit） |
| CI 天然集成 | `docker/build-push-action` 原生支持推送到 ghcr.io，配合 gha 缓存可复用构建层加速 |

#### 2.5.3 本项目中的用法

- **推送（写）**：仅发生在 GitHub Actions Runner 上。工作流登录 `ghcr.io` 后，把构建好的镜像打标签 `ghcr.io/gouxinjie/mylab:latest` 并 `push`（见 2.4 节第 3 步）。
- **拉取（读）**：仅发生在 ECS 上。CI 的 SSH 步骤执行 `docker compose pull`，Compose 文件里 `app` 服务 `image: ghcr.io/gouxinjie/mylab:latest` 即指向该地址，`docker compose up -d` 时自动拉取最新镜像。

> ECS 侧拉取 ghcr.io 镜像**不需要 GitHub 账号凭证**：公开镜像任何机器都能 `pull`；即便镜像为私有，也只需在 ECS 上做一次 `docker login ghcr.io`（用带 `read:packages` 权限的 Personal Access Token），之后 `pull` 即可免登录。本项目当前镜像为公开，故 ECS 无需登录即可拉取。

#### 2.5.4 镜像标签与回滚

当前固定使用 `latest` 标签（每次 CI 构建覆盖）。因此：

- ghcr.io 上**只保留最新**一份 `latest` 镜像，不自动留存历史版本；
- 回滚靠重新构建旧代码（见 5.4 节），而非切换 ghcr.io 上的旧标签；
- 如需保留历史版本，可在 `build-push` 步骤追加语义化标签（如 `ghcr.io/gouxinjie/mylab:v1.0.3` + `latest`），再在 `docker-compose.yml` 中显式指定版本号回滚。

## 三、部署遇到的问题与解决

本章记录从首次部署到稳定运行过程中遇到的 5 个关键问题及排查修复过程，按时间顺序整理。

### 3.1 问题一：构建失败 —— `github-slugger` 缺少类型声明

#### 3.1.1 现象

`docker build` 中 `RUN pnpm build`（即 `next build`）失败，`exit code 1`，报错指向 `import BananaSlug from "github-slugger"`，提示 `Could not find a declaration file for module 'github-slugger'`。

#### 3.1.2 排查

`github-slugger@1.5.0` 既无内置 `.d.ts`，社区也没有 `@types/github-slugger` 包。而 `tsconfig.json` 开启 `strict` 且 `next build` 会做全量类型检查，于是报缺类型声明。

不能直接 `pnpm add -D @types/github-slugger`：Docker 构建使用 `--frozen-lockfile`，新增依赖会修改 `pnpm-lock.yaml`，反而导致 lockfile 校验失败。

#### 3.1.3 解决方案

在仓库新增本地环境声明 `types/github-slugger.d.ts`，声明默认导出类 `GithubSlugger`，提供 `slug()` 与 `reset()` 方法。不引入新依赖、不改动 lockfile：

```ts
// types/github-slugger.d.ts
declare module 'github-slugger' {
  export default class GithubSlugger {
    slug(value: string, maintainCase?: boolean): string;
    reset(): void;
  }
}
```

提交：`7550c2a`。

### 3.2 问题二：构建失败 —— `react-markdown` 的 `_node` 属性类型错误

#### 3.2.1 现象

修复上一条后重新构建，又报：

```
./components/commons/Markdown/index.tsx:78:7
Type error: Property '_node' does not exist on type ...
```

同时有 ESLint 警告（`ImageZoom`/`Lightbox` 的 `src` 未使用、`@next/next/no-img-element`，均为 Warning，不阻断构建）。

#### 3.2.2 排查

`react-markdown` v10 在向自定义组件 props 注入 AST 节点时，属性名是 `node`（不是 `_node`）。原代码写成 `a({ _node, href, children, ...rest })` 与原类型不匹配，触发类型错误。

#### 3.2.3 解决方案

改为 `node: _node` 重命名解构 —— 以 `node` 匹配 react-markdown 真实属性名满足类型检查，同时用 `_node` 别名前缀满足 ESLint `no-unused-vars`（未使用变量须以 `_` 开头）规则：

```tsx
a({ node: _node, href, children, ...rest }) {
  // ...
}
```

提交：`8bc3a23`。

### 3.3 问题三：部署失败 —— 80 端口 `address already in use`（误判）

#### 3.3.1 现象

CI 通过 `appleboy/ssh-action` 在 ECS 上执行 `docker compose up -d` 时，`mylab-nginx-1` 启动失败：

```
Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use
Process exited with status 1
```

#### 3.3.2 错误尝试

最初以为冲突来自本项目旧容器，于是在 `deploy.yml` 的 SSH 脚本 `up -d` 前加了 `docker compose down || true`，意图先停旧容器释放 80。提交：`6c84b4a`。

但 `docker compose down` 只能停掉 compose 管理的容器，**释放不了宿主机本身**占用 80 的服务，因此该处理对真实根因无效（保留无害）。

### 3.4 问题四：部署失败 —— 宿主机裸 Nginx 占用 80（真实根因）

#### 3.4.1 根因分析

经用户反馈澄清：80 端口是被 **ECS 宿主机自带的 `nginx`** 占用（该 Nginx 托管其他站点），并非本项目容器。这与多项目共享 ECS 的场景一致 —— 不能靠 `docker compose down` 去释放宿主服务，否则会影响其他站点。

#### 3.4.2 解决方案

将 Docker Nginx 容器的宿主机映射从 `80:80` 改为 `8080:80`，由宿主 Nginx 把 80 转发到 `127.0.0.1:8080`。提交：`24aa204`。

随后用户要求不使用 8080、改用 `3500`，于是将 `docker-compose.yml` 的 nginx 服务 `ports` 改为 `"3500:80"`，并同步把宿主转发目标改为 `127.0.0.1:3500`。提交：`62d88ef`。

最终 `docker-compose.yml` 关键片段：

```yaml
services:
  app:
    image: ghcr.io/gouxinjie/mylab:latest
    restart: unless-stopped
    expose:
      - "3500"            # 仅对内暴露，不映射宿主端口
  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports:
      - "3500:80"         # 容器内 80 → 宿主 3500（避让宿主 80）
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app
```

### 3.5 问题五：宿主机 Nginx 转发配置未随 SCP 传输

#### 3.5.1 现象

尝试在仓库维护宿主机 Nginx 转发配置 `deploy/host-nginx/serve_mylab.conf`，并在 ECS 上 `cp /var/www/mylab/deploy/host-nginx/serve_mylab.conf /etc/nginx/conf.d/`，报错：

```
cp: cannot stat '/var/www/mylab/deploy/host-nginx/serve_mylab.conf': No such file or directory
```

#### 3.5.2 根因分析

CI 的 SCP 步骤 `source` 仅指定 `nginx.conf,docker-compose.yml`，**不传输 `deploy/` 目录**（见 2.4 节第 4 步）。因此 `deploy/` 下的配置永远不会出现在 ECS 上，手动 `cp` 必然失败。

#### 3.5.3 解决方案

删除仓库中的 `serve_mylab.conf`（提交：`da297dd`），改为在 **ECS 上手动创建** 宿主机 Nginx 配置 `/etc/nginx/conf.d/serve_mylab.conf`（内容见 4.5 节）。原因：

- `docker compose pull` / `docker compose up -d` 由 CI 每次 push 后**自动执行**，无需手动登录 ECS 操作容器。
- 宿主机 Nginx **不在 compose 管理范围内**，CI 碰不到它，因此转发配置必须手动维护（SSH 登录 `nginx -s reload`）。

### 3.6 排障小结

| 阶段 | 问题 | 解决 | 提交 |
|------|------|------|------|
| 构建 | `github-slugger` 缺类型声明 | 本地 `.d.ts` 声明 | `7550c2a` |
| 构建 | `react-markdown` 的 `_node` 类型错误 | 改用 `node: _node` 重命名解构 | `8bc3a23` |
| 部署（误判） | 80 端口被旧容器占用 | `docker compose down`（无效，保留无害） | `6c84b4a` |
| 部署（根因） | 宿主机裸 nginx 占用 80 | 容器改映射 `8080:80` → `3500:80` + 宿主转发 | `24aa204` / `62d88ef` |
| 部署 | `deploy/` 未随 SCP 传输，ECS 缺转发配置 | 删除仓库配置，改为 ECS 手动创建 | `da297dd` |


## 四、关键配置文件说明

### 4.1 Dockerfile（standalone 多阶段镜像）

**位置**：项目根路径

阶段一 `builder`：启用 corepack 锁定 pnpm 9.15.4 → `pnpm install --frozen-lockfile` → `pnpm build`（产出 `.next/standalone`）。阶段二 `runner`：复制 standalone 产物、`public`、`content/`、`messages/`，以非 root 用户 `nextjs` 运行 `node server.js`，`PORT=3500`。

关键点：`content/` 与 `messages/` 需显式 `COPY`（standalone 不会自动追踪运行时经 `fs` 读取的目录），否则文档页/国际化会缺失。

### 4.2 docker-compose.yml（Docker 编排核心）

定义 `app`（应用镜像，来自 ghcr.io）与 `nginx`（反代）两个服务。`app` 仅 `expose` 对内；`nginx` 映射 `3500:80` 并挂载 `nginx.conf`。生产启动由 CI 自动执行 `docker compose pull && up -d`。

### 4.3 nginx.conf（容器内 Nginx 反代配置）

**挂载位置**：容器内 `/etc/nginx/conf.d/default.conf`（只读）

关键规则：
- `upstream next_app { server app:3500; }`（Docker 服务发现）
- `listen 80; server_name gouxinjie.com www.gouxinjie.com;`
- Gzip 压缩已开启（comp_level 6）
- `location /` 反代到 `http://next_app`，透传 `Host` / `X-Real-IP` / `X-Forwarded-*` 头，并支持 WebSocket（`Upgrade` / `Connection` 头）
- 该文件由 CI 的 SCP 步骤传输，属于受管文件

### 4.4 .github/workflows/deploy.yml（CI/CD 工作流）

push `master` 触发：Runner 端 checkout → 登录 ghcr.io → build-push 镜像 → SCP 传 `nginx.conf`+`docker-compose.yml` → ECS 端 `docker compose pull && up -d`。所用 Secrets：`ECS_HOST`、`ECS_USERNAME`、`ECS_SSH_KEY`（可选 `ECS_HOST_KEY` 做严格主机指纹校验）。

### 4.5 宿主 Nginx 配置（手动维护）

**位置**：ECS 的 `/etc/nginx/conf.d/serve_mylab.conf`（**不在项目源码中管理**）

负责将 `gouxinjie.com` 流量转发到 `127.0.0.1:3500`。该配置需首次部署时手动创建，后续变更需 SSH 登录执行 `nginx -s reload`：

```nginx
server {
    listen 80;
    server_name gouxinjie.com www.gouxinjie.com;

    access_log /var/log/nginx/gouxinjie.access.log;
    error_log  /var/log/nginx/gouxinjie.error.log;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3500;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }
}
```

> 注意：若宿主 Nginx 主配置中存在 `default_server` 且 `root` 指向其他站点，未配置 `server_name gouxinjie.com` 时请求会被 `default_server` 捕获而显示错误站点。新增本配置后 Nginx 按域名最长匹配优先路由。

### 4.6 types/github-slugger.d.ts（类型补丁）

为无类型声明的 `github-slugger` 提供本地模块声明（见 3.1 节），保证 `next build` 严格类型检查通过。


## 五、运维指南

### 5.1 日常命令

| 操作 | 命令 |
|------|------|
| 代码更新（触发自动部署） | `git push origin master` |
| 查看容器状态 | `cd /var/www/mylab && docker compose ps` |
| 查看应用日志 | `docker compose logs app --tail 50` |
| 查看 Nginx 日志 | `docker compose logs nginx --tail 50` |
| 重启服务 | `docker compose restart` |
| 清理旧镜像（释放磁盘） | `docker image prune -f` |
| 宿主 Nginx 重载配置 | `sudo nginx -t && sudo nginx -s reload` |

> 容器层的 `pull`/`up -d` 由 CI 自动完成；日常无需手动执行 `docker compose up -d`，除非紧急在 ECS 本地调试。

### 5.2 健康检查验证

部署完成后，通过以下方式验证服务正常：

1. 检查容器状态，nginx 应映射 `0.0.0.0:3500->80/tcp` 且状态 `Up`：

   ```bash
   docker compose ps
   ```

2. 应用 standalone server 可访问（容器内 3500）：

   ```bash
   curl -I http://127.0.0.1:3500/
   # => HTTP/1.1 200 OK
   ```

3. 经 Docker Nginx 容器（宿主 3500）：

   ```bash
   curl -I http://127.0.0.1:3500/
   # => HTTP/1.1 200 OK
   ```

4. 经宿主 Nginx 域名链路：

   ```bash
   curl -I http://gouxinjie.com/
   # => HTTP/1.1 200 OK
   ```

### 5.3 无状态部署说明

本应用为无状态部署：业务内容（`content/`、`messages/`）随镜像打包，运行时无需外部数据库，容器销毁重建不丢数据。因此**无需数据库备份**。若需保留运行时上传的静态资源，应在 `docker-compose.yml` 中挂载 Volume（当前版本未涉及）。

### 5.4 紧急回滚

如果新版本部署后出现问题，可手动切换到上一个版本：

1. 在 GitHub Actions 找到最近一次成功的 workflow run；
2. revert 问题代码后重新 `git push master`，或触发该 workflow 的 re-run；
3. GitHub Actions 自动执行 build + deploy，覆盖当前容器。

注意：Docker 镜像为每次构建产生的 `latest` 标签，ECS 上不保留历史镜像，因此回滚实际上是通过重新构建旧版本实现的。


## 六、附录

### 6.1 首次部署 Checklist

以下清单适用于在新 ECS 上从零部署：

**GitHub Actions Secrets 配置：**

| Secret 名称 | 描述 | 示例值 |
|---|---|---|
| `ECS_HOST` | ECS 服务器公网 IP 或域名，部署目标地址 | `47.xx.xx.xx` |
| `ECS_USERNAME` | ECS 服务器 SSH 登录用户名 | `root` |
| `ECS_SSH_KEY` | ECS 服务器 SSH 私钥全文，用于 GitHub Actions 免密登录 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `ECS_HOST_KEY` | 可选，主机指纹，用于严格校验（首次连接报 host key 失败时配置） | `ssh-keyscan <ECS公网IP>` 输出 |

配置路径：GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

**其余步骤：**

- 安装 Docker Engine 和 Docker Compose v2
- 创建 `/var/www/mylab` 目录
- 配置以上 GitHub Actions Secrets
- 在 ECS 宿主添加 `/etc/nginx/conf.d/serve_mylab.conf`（见 4.5 节）并执行 `nginx -s reload`
- DNS 将 `gouxinjie.com` / `www.gouxinjie.com` 解析到 ECS IP
- 阿里云安全组放行入方向 `22`、`80`
- 触发一次 push 或 GitHub Actions 手动构建
- 确认 `docker compose ps` 两个容器状态均为 Up（nginx 映射 `3500->80`）
- 浏览器访问 `http://gouxinjie.com` 确认页面正常

### 6.2 本地开发说明

- 本地开发：`pnpm install && pnpm dev`（监听 3500）。
- 构建校验：`pnpm build` 会做严格类型检查（含 `types/*.d.ts`），提交前务必本地通过，避免 CI 构建失败。
- 包管理器锁定为 `pnpm@9.15.4`（`package.json` 的 `packageManager` 字段），本地开启 corepack 可自动对齐版本，否则 `--frozen-lockfile` 会因 lockfile 版本不符失败。

### 6.3 项目仓库结构

```
mylab/
├── .github/workflows/deploy.yml   # CI/CD 工作流
├── Dockerfile                     # standalone 多阶段镜像
├── docker-compose.yml             # 双容器编排（app + nginx）
├── nginx.conf                     # 容器内 Nginx 反代配置
├── next.config.js                 # output: 'standalone'
├── package.json                   # packageManager: pnpm@9.15.4
├── types/
│   └── github-slugger.d.ts        # 类型补丁
├── app/ components/ styles/       # 前端源码
├── content/                       # Markdown 文档源（运行时读取）
├── messages/                      # next-intl 国际化消息
└── README.md
```

### 6.4 参考链接

- Next.js standalone 部署：https://nextjs.org/docs/app/building-your-application/deploying#docker-image
- Docker Compose 文档：https://docs.docker.com/compose/
- Nginx 反向代理指南：https://nginx.org/en/docs/http/ngx_http_proxy_module.html
- GitHub Actions 文档：https://docs.github.com/actions

> — 文档结束 —
