# Next.js的standalone构建原理和作用

[toc]

在 Next.js 中，**`standalone`**（独立输出模式）是 Next.js 提供的一种**构建架构级优化机制**，专门用于解决 Web 应用在云原生/容器化（Docker/Kubernetes）部署时**体积巨大、依赖冗余、启动笨重**的问题。

可以通过在 `next.config.js` 中设置开启：

```javascript
module.exports = {
  output: 'standalone',
}

```


## 一、 为什么需要 `standalone`？（解决的痛点）

在传统的 Next.js 部署方案中，构建并运行一个应用通常需要以下流程：

1. 在服务器/镜像中运行 `next build`；
2. **保留完整的 `node_modules`** 文件夹（包含庞大的开发依赖，如 TypeScript、Babel、PostCSS、Webpack/Turbopack 内部工具等）；
3. 运行 `npm run start`（实质上是启动了 `next` CLI 工具）。

### 传统模式三大痛点：

* **镜像体积巨大**：Docker 镜像往往达到 **500MB ~ 1GB+**。
* **安全性隐患**：生产环境中残留了大量非必要的开发依赖包（DevDependencies）。
* **资源浪费**：构建镜像和容器拉取（Pull Image）极其耗时，拖慢 CI/CD 部署效率。


## 二、 `standalone` 的核心原理

开启 `output: 'standalone'` 后， Next.js 在执行 `next build` 阶段会彻底改变打包产物的组织方式。它的底层原理可以拆解为以下三个核心步骤：

```
[ 源码 + 配置文件 ]
        │
        ▼ (next build)
┌──────────────────────────────────────────────────────────┐
| 1. 依赖树静态追踪分析 (基于 @vercel/nft 模块)             |
| 2. 摇树与剥离 (Tree-shaking & Stripping DevDeps)         |
| 3. 提取最小运行时 & 生成极简 server.js                   |
└──────────────────────────────────────────────────────────┘
        │
        ▼ 产出
[.next/standalone/] ──> 只含最小运行代码 + 依赖小子集 + server.js

```

### 1. 依赖追踪引擎（Node File Trace）

Next.js 内部引入了 Verce 开源的 **`@vercel/nft`（Node File Trace）** 依赖分析引擎。

在构建时，`@vercel/nft` 会从应用的所有路由入口（Pages/App Router）开始，静态分析代码中的 `require` 和 `import` 语句，**生成一棵精准的生产环境依赖树（Dependency Graph）**。

### 2. 剥离无用依赖（Node Modules Pruning）

分析完成后， Next.js 会把“真正被调用到的文件”从原本庞大的 `node_modules` 中挑选出来，**按原有的目录结构复制**到 `.next/standalone/node_modules/` 中。

* 只有被生产环境代码调用的 `.js` 或 `.json` 文件会被保留；
* 所有仅在构建期用到的工具包（如 `typescript`、`tailwindcss`、`eslint` 等）全部被过滤剥离。

### 3. 去除 CLI，替换为原生微型 Server

传统模式依赖 `next start`（需要加载整个 Next.js 命令行 CLI 体系）。

而 `standalone` 模式会在 `.next/standalone/` 根目录下自动生成一个极简的 **`server.js`**。这个 `server.js` 是一个高度封装的、基于 Node.js 原生 HTTP 模块的服务入口，它直接加载编译后的 Webpack/Turbopack 模块，**不再需要安装 Next.js CLI** 即可独立运行：

```bash
# 启动命令变为了最纯正的 node 指令
node .next/standalone/server.js

```


## 三、 作用与核心优势

| 维度 | 默认模式 (`next start`) | standalone 模式 (`node server.js`) |
| --- | --- | --- |
| **运行时依赖** | 必须携带完整的 `node_modules` | **无需根目录 `node_modules**`，仅靠提取出的最小化依赖 |
| **Docker 镜像体积** | **500MB – 1.2GB** | **削减至 80MB – 200MB**（基于 Alpine/Slim 基础镜像） |
| **部署性能** | 镜像拉取慢，部署耗时长 | 镜像极轻，毫秒级拉取与部署，非常适合 K8s 弹性扩容 |
| **安全隔离** | 包含开发依赖，攻击面大 | 极简运行时，大幅减少已知 CVE 漏洞依赖包 |


## 四、 最佳实践：Docker 多阶段构建（Multi-Stage Build）

`standalone` 最主流、最能发挥其价值的场景就是**配合 Docker 进行单容器或 Kubernetes 部署**。

在 Dockerfile 中利用多阶段构建，可以实现“构建时环境”与“运行时环境”的彻底分离：

```dockerfile
# 1. 依赖安装阶段
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. 项目构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 注意：next.config.js 中需配置 output: 'standalone'
RUN npm run build

# 3. 极简生产运行阶段（镜像体积优化到极致）
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# 仅从 builder 阶段复制 standalone 产物与静态文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# 直接使用 node 运行生成的 server.js
CMD ["node", "server.js"]

```


## 五、 注意事项与使用避坑指南

1. **静态资源不会自动打入 standalone**：
出于性能考虑（Next.js 推荐将静态文件托管在 CDN），`.next/standalone` 默认**不包含** `public/` 静态文件以及 `.next/static/` 编译静态资源。如果在单机或 Docker 中直接运行，**必须像上面 Dockerfile 一样手动复制**这两个目录到对应的同级位置。
2. **动态 `require()` 的依赖丢失问题**：
如果代码中存在高度动态拼接路径的引用（如 `require('./locales/' + lang)`），依赖分析引擎 `@vercel/nft` 可能无法静态识别，导致构建产物缺失该依赖。
* **解决方法**：可以在 `next.config.js` 中配置 `experimental.outputFileTracingIncludes` 强制引入特定路径。
