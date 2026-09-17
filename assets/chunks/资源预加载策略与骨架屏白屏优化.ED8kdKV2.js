const n=`# 资源预加载策略与骨架屏白屏优化：把首屏打磨到极致

[[toc]]

## 一、为什么首屏优化值得专门研究

> 一句话：**首屏加载体验决定了用户对产品的第一印象**。用户对页面打开速度的容忍度极限大概是 **3 秒**，超过 3 秒会有 53% 的用户直接离开（Google 研究数据）。

首屏优化是个**系统性工程**，常见手段可以归为 3 大方向：

| 方向 | 解决什么 | 代表技术 |
|------|---------|----------|
| **资源预加载** | 让浏览器提前开始拉资源 | preload / prefetch / preconnect |
| **骨架屏** | 用占位元素掩盖白屏 | 骨架屏 / Skeleton / 加载占位 |
| **白屏优化** | 让"内容"尽快到达用户 | SSR / SSG / 流式渲染 / 优化 LCP |

三者**不分先后**，实际项目通常组合使用。下面逐个拆解。

---

## 二、浏览器加载链路：从 URL 到渲染

理解首屏优化，必须先看清浏览器**拿到 HTML 后做了什么**：

\`\`\`mermaid
flowchart LR
    A[用户输入 URL] --> B[DNS 解析]
    B --> C[TCP 连接]
    C --> D[TLS 握手]
    D --> E[HTTP 请求<br/>等 TTFB]
    E --> F[HTML 下载]
    F --> G{解析 HTML}
    G -->|遇到 link rel=stylesheet| H[同步 CSS<br/>阻塞渲染]
    G -->|遇到 script 标签| I[同步 JS<br/>阻塞解析]
    G -->|遇到 img / iframe| J[异步加载]
    H --> K[Render Tree]
    I --> K
    J --> K
    K --> L[Layout + Paint]
    L --> M[Composite]
    M --> N[FCP<br/>首屏内容渲染]
    N --> O[LCP<br/>最大内容渲染]
\`\`\`

### 2.1 关键性能指标

| 指标 | 全称 | 含义 | 优化目标 |
|------|------|------|---------|
| **TTFB** | Time To First Byte | 从请求到收到第一个字节 | < 800ms |
| **FCP** | First Contentful Paint | 第一个内容像素出现 | < 1.8s |
| **LCP** | Largest Contentful Paint | 最大内容元素渲染完成 | < 2.5s |
| **TTI** | Time To Interactive | 页面可交互 | < 3.8s |
| **TBT** | Total Blocking Time | 主线程被阻塞时长 | < 200ms |

**LCP 是 Core Web Vitals 三大指标之首**（另外两个是 FID/INP 和 CLS），直接影响 SEO 排名。

### 2.2 阻塞渲染的 3 类资源

| 资源类型 | 是否阻塞渲染 | 怎么优化 |
|---------|------------|---------|
| **CSS（在 head 中）** | ✅ 阻塞渲染 | 精简、压缩、内联关键 CSS |
| **JS（在 head 中）** | ✅ 阻塞解析和渲染 | defer / async / 放 body 末尾 |
| **字体、图片** | ❌ 异步加载 | 预加载、懒加载、CDN |

---

## 三、\`preload\` / \`prefetch\` / \`preconnect\` 三大策略

:::tip 一句话区别
- **\`preload\`**：**"立刻就要"**，高优先级提前加载当前页面要用到的资源
- **\`prefetch\`**：**"以后可能会用"**，低优先级空闲时加载将来可能用到的资源
- **\`preconnect\`**：**"提前打招呼"**，提前与第三方域建立网络握手
:::

### 3.1 preload — 当前页关键资源

**用法**：

\`\`\`html
<head>
  <!-- 提前加载字体，避免 FOIT（Flash of Invisible Text） -->
  <link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin>

  <!-- 提前加载关键 CSS -->
  <link rel="preload" href="/css/critical.css" as="style">

  <!-- 提前加载首屏 Hero 图片 -->
  <link rel="preload" href="/images/hero.webp" as="image">

  <!-- 提前加载关键 JS（异步执行） -->
  <link rel="preload" href="/js/main.js" as="script">
</head>
\`\`\`

**关键参数 \`as\`**（资源类型）：

| \`as\` 值 | 用途 |
|---------|------|
| \`font\` | 字体文件（必须带 \`crossorigin\`） |
| \`style\` | CSS 文件 |
| \`script\` | JS 文件 |
| \`image\` | 图片 |
| \`fetch\` / \`audio\` / \`video\` | 媒体 |

:::warning 注意事项
- preload **只加载不执行**（CSS 还是要等 \`<link rel="stylesheet">\` 触发）
- preload 必须在 \`<head>\` 里、\`<body>\` 之前
- preload **过度使用反而拖慢首屏**（抢占主资源带宽）——只对**真正关键**的资源用
- **必须带 \`crossorigin\`**（即使是同源），否则字体加载会双重发起
:::

**Webpack 自动注入 preload**：

\`\`\`js
// webpack.config.js
module.exports = {
  plugins: [
    // 自动为所有 initial chunk 生成 preload 标签
    new HtmlWebpackPlugin({
      preload: true, // 开启 preload
    }),
    // 旧版写法：用 preload-webpack-plugin
  ],
};
\`\`\`

**Vite 自带 preload**：

Vite 在 build 时会**自动为入口 chunk 生成 preload 标签**，无需手动配置。

### 3.2 prefetch — 未来可能用到的资源

**用法**：

\`\`\`html
<!-- 用户进入首页后，提前下载商品详情页的 JS chunk -->
<link rel="prefetch" href="/js/product-detail.js" as="script">

<!-- 提前下载下一页可能用到的图片 -->
<link rel="preload" href="/images/banner-2.webp" as="image" />
\`\`\`

**和 preload 的对比**：

| 维度 | preload | prefetch |
|------|---------|----------|
| **优先级** | High（高） | Low（低/最低） |
| **执行时机** | 立即加载 | 浏览器空闲时（一般在当前页加载完后） |
| **使用场景** | 当前页面关键资源 | 下一页/下一个路由可能用到的资源 |
| **资源浪费风险** | 中（用户不一定走用到的路径） | 高（用户不一定走那条路径） |

:::tip 路由级 prefetch 实战
**SPA 路由 prefetch**：当用户 hover 到一个链接时，prefetch 该路由的 JS chunk。这样点击时就能立即响应。

\`\`\`typescript
// 路由 hover 时预加载
const LinkWithPrefetch = ({ to, children }) => {
  const prefetch = () => {
    // 调用路由系统的 preload 方法（以 react-router 为例）
    import(/* webpackChunkName: "page-about" */ '@/pages/About');
  };
  return (
    <Link to={to} onMouseEnter={prefetch} onFocus={prefetch}>
      {children}
    </Link>
  );
};
\`\`\`
:::

### 3.3 preconnect — 提前建立网络连接

**问题**：访问 \`example.com\` 时，发现页面里需要加载 \`cdn.example.com\` 的资源，浏览器才去**建立 TCP 连接 + TLS 握手**——光这一步就可能耗 100-300ms。

**解法**：**提前告诉它要去某个域，提前把 TCP/TLS 建好**。

\`\`\`html
<!-- 提前与 CDN 建立连接 -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin>

<!-- 进一步：只建立 DNS + TCP，不做 TLS（更快） -->
<link rel="dns-prefetch" href="https://cdn.example.com">

<!-- 预取 DNS + TCP + TLS（最重） -->
<link rel="preconnect" href="https://cdn.example.com">
\`\`\`

**三者的握手深度**：

| 指令 | DNS | TCP | TLS | 总耗时（典型） |
|------|-----|-----|-----|-------------|
| \`dns-prefetch\` | ✅ | ❌ | ❌ | 20-100ms |
| \`preconnect\`（默认） | ✅ | ✅ | ✅ | 100-400ms |
| \`preconnect\`（带 \`crossorigin\`） | ✅ | ✅ | ✅ | + 100ms |

:::tip 实战建议
**对所有第三方域加 preconnect**，比如：
- CDN 域名
- Google Fonts / Google Analytics
- 第三方 API（如支付、统计）

**用 Chrome DevTools 的 Network 面板验证**：在 \`Connection\` 列看是不是 \`h2\`、\`reused\`、或者 \`0ms\` 起步。
:::

### 3.4 三大策略选型速查

| 场景 | 推荐 | 示例 |
|------|------|------|
| 首屏关键字体 / Hero 图 | \`preload\` | \`<link rel="preload" as="font">\` |
| 下一页可能用到的 chunk | \`prefetch\` | 路由 hover 时动态 prefetch |
| 第三方 CDN 域名 | \`preconnect\` | \`<link rel="preconnect" href="https://cdn">\` |
| 表单提交到的 API 域名 | \`preconnect\` | 用户进入页面就预连 |
| 当前页非关键 JS | \`prefetch\` 或不要 | — |

---

## 四、资源加载优先级

浏览器对资源有自己的优先级判断，了解这个能帮你**理解上面 3 个 pre-* 指令的本质**：

| 资源 | 默认优先级 | 备注 |
|------|----------|------|
| **HTML** | Highest | 阻塞一切 |
| **CSS（head 中）** | Highest | 阻塞渲染 |
| **同步 JS（head 中）** | High | 阻塞解析 |
| **字体** | High | 阻塞文本渲染 |
| **首屏图片** | High | 影响 LCP |
| **\`<script defer>\`** | High | 异步但不延迟 |
| **\`<script async>\`** | Medium | 异步立即执行 |
| **prefetch** | Lowest | 浏览器空闲才走 |

**DevTools 验证优先级**：

Network 面板 → 右键表头 → 勾选 \`Priority\` 列 → 看每个资源的优先级。

---

## 五、骨架屏原理与实现

### 5.1 什么是骨架屏

**骨架屏（Skeleton Screen）** 是一种**占位 UI**：在内容加载完成前，预先渲染出页面的"骨架结构"（灰色块状占位元素），避免用户看到空白。

\`\`\`mermaid
sequenceDiagram
    participant U as 用户
    participant P as 页面
    U->>P: 进入页面
    P->>P: 立即显示骨架屏(<100ms)
    Note over U,P: 用户感知：页面有响应、正在加载
    P->>P: 真实数据到达
    P->>U: 骨架屏渐隐 + 内容渐显
\`\`\`

### 5.2 为什么需要骨架屏

| 阶段 | 没有骨架屏 | 有骨架屏 |
|------|----------|---------|
| 0 ~ 500ms | 白屏 | 骨架结构 |
| 500ms ~ 2s | 白屏 | 骨架结构 + 加载动画 |
| 2s 后 | 内容突然出现 | 骨架 → 内容平滑过渡 |

**用户感知**：
- ❌ 没有骨架屏：用户以为页面坏了，刷新离开
- ✅ 有骨架屏：用户知道页面在加载，等待

### 5.3 三种实现方案

#### 方案 A：手写骨架屏（适合简单页）

直接在组件库直接 \`<div class="skeleton">\` 占位：

\`\`\`vue
<template>
  <div v-if="loading" class="skeleton">
    <div class="skeleton-header"></div>
    <div class="skeleton-avatar"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
  </div>
  <div v-else class="real-content">
    <!-- 真实内容 -->
  </div>
</template>

<style>
.skeleton-header {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
\`\`\`

#### 方案 B：用组件库（推荐）

直接用 Element Plus / Ant Design 的 Skeleton 组件：

\`\`\`vue
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <el-skeleton-item variant="image" style="width: 100%; height: 200px;" />
      <div style="padding: 14px;">
        <el-skeleton-item variant="h3" style="width: 50%;" />
        <el-skeleton-item variant="text" />
      </div>
    </template>
    <template #default>
      <!-- 真实内容 -->
      <img src="real.jpg" />
      <h3>真实标题</h3>
    </template>
  </el-skeleton>
</template>
\`\`\`

#### 方案 C：自动化生成（适合项目级）

用插件**自动从真实页面生成骨架屏**：

| 工具 | 用法 | 适用场景 |
|------|------|---------|
| **Vue** | \`vue-skeleton-webpack-plugin\` | Vue 项目自动化 |
| **React** | \`react-placeholder\` / \`react-loading-skeleton\` | React 项目 |
| **通用** | 把页面截图 → 提取轮廓 → 生成 SVG | 静态站点 |

### 5.4 骨架屏注意事项

:::danger 4 个禁止项
1. ❌ **不要把骨架屏做成 loading 转圈菊花**——菊花会让用户感觉"卡住"；骨架屏让用户感觉"在组装"
2. ❌ **不要骨架屏尺寸和真实布局差异过大**——内容加载时会"跳一下"（CLS 性能下降）
3. ❌ **不要超过 3 秒还没出真实内容**——再好的骨架屏也会让用户失去耐心
4. ❌ **不要用 \`<img>\` 来画骨架**——影响 SEO（爬虫看不见），首屏 LCP 也会被拖慢
:::

---

## 六、白屏优化：让内容尽快到达用户

### 6.1 CSR / SSR / SSG / ISR / Streaming 一图理解

\`\`\`mermaid
flowchart LR
    A[CSR<br/>客户端渲染] -->|JS 在浏览器跑| B[HTML 骨架 + JS]
    C[SSR<br/>服务端渲染] -->|JS 在服务端跑| D[完整 HTML]
    E[SSG<br/>静态生成] -->|构建时生成| F[预渲染 HTML]
    G[ISR<br/>增量静态再生] -->|访问时生成<br/>缓存复用| H[HTML + 缓存]
    I[Streaming SSR<br/>流式 SSR] -->|边生成边推送| J[分块 HTML]
\`\`\`

### 6.2 五种渲染方式对比

| 方式 | 首屏到达 | SEO | 服务端压力 | 适用场景 |
|------|---------|-----|----------|---------|
| **CSR** | 慢（等 JS 下载执行） | ❌ 差 | 无 | 后台、Dashboard、SPA 工具 |
| **SSR** | 快（HTML 已就绪） | ✅ 好 | 高 | 内容站、电商 |
| **SSG** | 最快（CDN 直接推） | ✅ 好 | 无 | 博客、文档、营销页 |
| **ISR** | 快 + 准实时 | ✅ 好 | 中 | 大型内容站（Next.js） |
| **Streaming SSR** | 极快（首字节即内容） | ✅ 好 | 高 | Next.js App Router、个性化页 |

### 6.3 SSR 实战（以 Next.js App Router 为例）

\`\`\`typescript
// app/page.tsx —— 默认就是 SSR
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    // 重要：让 Next.js 知道这是动态数据，不静态化
    cache: 'no-store',
  });
  return <List data={await data.json()} />;
}
\`\`\`

\`\`\`typescript
// app/page.tsx —— 静态生成（SSG）
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <List data={await data.json()} />;
}

// 强制动态：API 实时返回
export const dynamic = 'force-dynamic';
\`\`\`

### 6.4 Streaming SSR + Suspense

**核心理念**：不用等所有数据都准备好再返回 HTML，**分块流式返回**。

\`\`\`typescript
// Next.js App Router 自动支持 Streaming
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      {/* Header 不需要等数据，立即渲染 */}
      <Header />

      {/* 主要内容区：等待数据时显示骨架 */}
      <Suspense fallback={<Skeleton />}>
        <SlowContent /> {/* 数据慢的部分 */}
      </Suspense>

      {/* 页脚也不需要等 */}
      <Footer />
    </>
  );
}
\`\`\`

**效果**：用户在 **TTFB 后立即看到 Header 和 Footer**，主体慢慢流式填充。比传统 SSR 快 **30-50%**。

### 6.5 客户端优化（CSR 项目无法慢速）

如果项目改不了 SSR，至少做这些：

\`\`\`typescript
// 1. JS 拆包 + 懒加载
const AdminPanel = lazy(() => import('./AdminPanel'));

// 2. 关键 CSS 内联
<style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

// 3. 字体加载优化
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap; /* 关键：避免 FOIT */
}

// 4. 图片懒加载
<img loading="lazy" src="..." />

// 5. 防 hydration 闪烁（SSR/CSR 混合项目）
// 客户端 hydration 前先用 server 渲染的内容，避免闪烁
\`\`\`

---

## 七、首屏性能优化完整清单

| 优化项 | 收益 | 难度 | 优先级 |
|--------|------|------|--------|
| **字体 preload + font-display: swap** | ⭐⭐⭐ | ⭐ | 🔴 必做 |
| **关键 CSS 内联** | ⭐⭐⭐ | ⭐⭐ | 🔴 必做 |
| **第三方域 preconnect** | ⭐⭐ | ⭐ | 🔴 必做 |
| **骨架屏** | ⭐⭐⭐（用户感知） | ⭐⭐ | 🔴 必做 |
| **图片懒加载** | ⭐⭐⭐ | ⭐ | 🔴 必做 |
| **路由 hover 时 prefetch** | ⭐⭐⭐ | ⭐⭐ | 🟡 推荐 |
| **SSR / SSG** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 🟡 适合改造时 |
| **Streaming SSR + RSC** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🟡 适合改造时 |
| **字体子集化（subset）** | ⭐⭐ | ⭐⭐ | 🟢 可选 |
| **Service Worker 缓存关键资源** | ⭐⭐⭐ | ⭐⭐⭐ | 🟢 可选 |

---

## 八、调试工具

| 工具 | 用途 | 网址 |
|------|------|------|
| **Lighthouse** | 综合性能评分 | Chrome DevTools 内置 |
| **WebPageTest** | 多地点测试 | webpagetest.org |
| **Chrome DevTools Performance** | 帧级别分析 | DevTools 内置 |
| **Vercel Analytics** | 真实用户指标（RUM） | vercel.com/analytics |
| **web.dev / Measure** | 测速 | web.dev/measure |
| **Chrome DevTools Network** | 看 preload 是否真生效 | DevTools 内置 |

**Lighthouse 看 4 个数**：

1. **Performance 分数**（目标 > 90）
2. **LCP**（目标 < 2.5s）
3. **TBT**（目标 < 200ms）
4. **CLS**（目标 < 0.1）

---

## 九、总结

**预加载策略**：preload（立刻）、prefetch（以后）、preconnect（提前握手）——3 个简单标签，但每个都要用对场景。

**骨架屏**：不只是 loading 转圈，而是给用户"正在组装"的感知，但**必须控制时长**、**必须尺寸一致**避免 CLS。

**白屏优化**：终极方案是 SSR / SSG / Streaming，但 CSR 项目**也能用骨架屏 + 拆包 + 懒加载**做到接近 SSR 的体验。

掌握了上面 3 个方向，你就有完整的"首屏优化武器库"。剩下的只是**量化测量 + 针对性优化**。`;export{n as default};
