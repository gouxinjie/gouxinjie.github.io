# Next.js Script 组件详解

[[toc]]

在 Next.js 中，**`next/script`** 是一个经常被忽略、但在性能和工程质量上非常关键的组件。它专门用于**安全、可控、性能友好地加载第三方脚本**（如统计、监控、广告、SDK 等）。

## 一、为什么不能直接用 `<script>`？

在传统 `HTML` 中，我们习惯这样写：

```html
<script src="https://example.com/sdk.js"></script>
```

但在 **Next.js（尤其是 App Router / SSR 场景）** 中，这种写法存在明显问题：

### 1️⃣ 阻塞页面渲染

- 默认 script 会阻塞 HTML 解析
- 影响 **首屏性能（FCP / LCP）**

### 2️⃣ 执行时机不可控

- SSR / Hydration 阶段容易出现
  - `window is not defined`
  - 客户端、服务端不一致

### 3️⃣ 无法被 Next.js 优化

- 无法参与 Script 调度
- 无法延迟 / 优先级控制

👉 **Next.js Script 的存在，本质就是为了解决这些问题。**

## 二、什么是 `next/script`？

```ts
import Script from "next/script";
```

`Script` 是 Next.js 提供的一个**高级 Script 管理组件**，具备：

- ✅ 不阻塞渲染
- ✅ 精准控制加载与执行时机
- ✅ SSR / CSR 安全
- ✅ 自动去重
- ✅ 性能优化（preload / defer）

## 三、基本引入 vs 全局引入（非常容易混淆）

在使用 `next/script` 时，**很多人其实不是不会用 strategy，而是没想清楚：脚本应该“在哪引入”**。

我们先把这个问题讲清楚，再进入 strategy。

### 3.1 什么是「基本引入」（页面级 / 组件级）？

👉 **只在某一个页面或组件中使用 Script**。

**示例：仅在详情页引入**

```tsx
// app/detail/page.tsx
import Script from "next/script";

export default function DetailPage() {
  return (
    <>
      <Script src="https://example.com/detail-sdk.js" strategy="afterInteractive" />
      <div>Detail Page</div>
    </>
  );
}
```

**特点**

- ✅ **只在该页面加载**
- ✅ 页面卸载后不再使用（逻辑上）
- ❌ 切换页面可能重新执行

**适合场景**

- 只在某个页面用到的 SDK
- 页面级功能（编辑器、地图、播放器）
- 不希望污染全局的脚本

### 3.2 什么是「全局引入」（应用级）？

👉 **在应用根节点引入，一次加载，全站可用**。

**App Router（推荐方式）**

```tsx
// app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script src="https://example.com/global-sdk.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

**特点**

- ✅ **全站只加载一次（自动去重）**
- ✅ 所有页面都能使用 `window.xxx`
- ❌ 会增加全站的 JS 成本

**适合场景**

- 埋点 / 监控（GA、神策、Sentry）
- 登录态相关 SDK
- 全局基础能力

## 四、Script 的加载策略

> **90% 的脚本：用 `afterInteractive`** > **不影响首屏的：用 `lazyOnload`** > **极少数基础脚本：才用 `beforeInteractive`**

### 4.1 `afterInteractive`（默认 & 首选）

```tsx
<Script src="https://example.com/sdk.js" />
```

- 页面可交互后加载
- 不阻塞渲染
- 行为最可控

✅ **埋点 / 监控 / 业务 SDK 首选**

### 4.2 `lazyOnload`（性能最优）

```tsx
<Script src="https://example.com/chat.js" strategy="lazyOnload" />
```

- 页面完全加载后再执行
- 对首屏几乎 0 影响

✅ **广告 / 客服 / 非关键功能**

### 4.3 `beforeInteractive`（慎用）

```tsx
<Script src="https://example.com/polyfill.js" strategy="beforeInteractive" />
```

- React 执行前加载
- 可能影响首屏性能

⚠️ **只有当脚本“必须最早存在”时才用**

### 4.4 `worker`（实验特性）

```tsx
<Script src="https://example.com/heavy.js" strategy="worker" />
```

暂时不建议使用。

## 四、内联 Script 的写法

### 方式一：`dangerouslySetInnerHTML`

```tsx
<Script
  id="ga-init"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    `
  }}
/>
```

⚠️ 必须提供 **唯一 id**，否则 `Next.js` 会报错

### 方式二：children（推荐）

```tsx
<Script id="init" strategy="afterInteractive">
  {`console.log('script loaded')`}
</Script>
```
