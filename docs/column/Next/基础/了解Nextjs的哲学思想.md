# Next.js 的哲学思想

[[toc]]

![Next.js 哲学思想](../images/philosophy-1.png)

[Next.js 官网](https://nextjs.org/docs)

`Next.js` 的哲学思想可以概括为一句话：**“约定优于配置，开发者体验优先，性能与扩展性并重。”**

它不是“又一个前端框架”，而是一种对现代 Web 开发痛点的系统性回应。如下：

### 1. 约定优于配置（Convention over Configuration）

Next.js 通过文件系统路由、自动代码分割、内置 SSR/SSG 等方式，**将复杂的基础设施决策从开发者手中接管过来**，让开发者专注于业务逻辑而非配置细节。

> 例如：
>
> - `pages/index.js` 自动映射到 `/`
> - `app/blog/[slug]/page.js` 自动成为动态路由
> - 无需手动配置 Webpack、Babel、Router、SSR 等

### 2. 开发者体验即生产力

Next.js 把“开发快感”写进了架构设计：

- **零配置启动**：`npx create-next-app` 即可运行
- **热模块替换（HMR）**：毫秒级反馈
- **TypeScript、ESLint、Tailwind 一键集成**
- **App Router**：统一前后端逻辑，React Server Components 让数据获取更接近组件

### 3. 性能是默认行为，不是优化目标

Next.js 不问你“要不要优化”，而是默认帮你优化：

- 自动代码分割、图片优化、字体预加载
- 静态生成（SSG）、服务端渲染（SSR）、增量静态再生（ISR）按需使用
- 构建时 vs 运行时智能划分，减少客户端负担

### 4. 全栈一体化，打破前后端壁垒

Next.js 不再只是“前端框架”，而是**全栈 React 框架**：

- `app/api/` 目录下写 `route.ts` 即可创建后端接口
- React Server Components 让组件在服务端运行，减少 hydration 成本
- 统一语言（TypeScript）、统一框架、统一部署（Vercel）

### 5. 渐进式架构，适应从个人博客到企业级系统

Next.js 的结构设计支持**从静态站点到复杂全栈应用的渐进式演进**：

- 初期：静态页面 + SSG
- 中期：动态路由 + ISR
- 后期：Server Components + Route Handlers + Middleware