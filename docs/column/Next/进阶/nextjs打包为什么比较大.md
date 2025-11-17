# 为什么 Next.js 打包比 Vue/React 大？

[[toc]]

`Next.js `打包体积“看起来”比 Vue/React 更大，这是非常常见的现象，但这并不是因为 Next.js 本身臃肿，而是由于 **SSR / 路由机制 / 打包模式 / 产物结构** 等带来的客观差异。

## **原因 1：Next.js 默认包含 SSR / RSC / Edge Runtime 等功能**

Vue（Vite）、Create React App、React + Vite 本质上都是 **纯前端 SPA**。

但 Next.js 是 **全栈框架**，打包产物包含更多内容：

| 内容                         | Vue/React SPA | Next.js |
| ---------------------------- | ------------- | ------- |
| 客户端 JS                    | ✔️            | ✔️      |
| SSR 渲染代码                 | ❌            | ✔️      |
| 服务端路由代码               | ❌            | ✔️      |
| API Routes / Server Actions  | ❌            | ✔️      |
| Edge Runtime / Node runtime  | ❌            | ✔️      |
| 两套 bundle（客户端+服务端） | ❌            | ✔️      |

➡️ **你看到的 `.next` 目录体积大，是因为它包含了客户端 + 服务端 两份产物**。

Vue/React 只生成客户端 bundle，所以自然更小。

## **原因 2：Next.js 每个路由都有 Server & Client bundling**

例如 `/dashboard` 这个页面：

Next.js 会生成：

- `/dashboard` —— SSR 渲染代码（Server 端）
- `/dashboard.client.js` —— 客户端 hydration 脚本
- shared chunks
- 以及 RSC 文件（如你用到 App Router）

而 Vue/React SPA 只有：

- `/assets/dashboard.xxx.js`（纯客户端）

➡️ **多了一倍甚至数倍的文件数量**。

## **原因 3：Next.js 默认使用 React，体积比 Vue 大**

React 本身体积（大约 42kb gzip）比 Vue（大约 20kb gzip）更大。

分别看 SPA 打包：

- Vue：生产包非常小
- React：会大一些
- Next.js：因为 React + SSR + Routing + Runtime → 自然再大一些

## **原因 4：Next.js 的构建产物包含大量元数据和中间产物**

`.next` 目录里包含：

- **server**
- **server/chunks**
- **server/app**（App Router）
- **server/pages**（如果使用）
- **client**
- **client/chunks**
- **middleware**
- **img optimizer files**
- **webpack cache**
- **server build manifest**

**如下：**

![next-dist](../images/next-dist.png)

Vue 和 Vite + React 的 `dist/` 目录基本只包含：

- js
- css
- assets

➡️ Next.js 多产物、多层级，体积看起来巨大。

## **原因 5：你看到的体积并不是浏览器实际加载的大小**

你看的是 `.next` 文件夹大小，例如：

```
.next
  ├─ server/ 200MB
  ├─ static/ 10MB
  ├─ cache/ 700MB
```

但浏览器实际只会下载：

```
.next/static/chunks/*.js
```

这些一般是几十 KB 到几百 KB **gzip 后通常不超过 200KB**。

**真实访问量远小于打包产物体积，看起来大但不会全部被客户端下载。**

## 那为什么 Vue / React 看起来小很多？

理由简单：

| 框架       | 构建内容                                              |
| ---------- | ----------------------------------------------------- |
| Vue / Vite | 纯客户端（只有生产可用的文件）                        |
| React SPA  | 纯客户端（只有生产可用的文件）                        |
| Next.js    | 客户端 + 服务端 + SSR + RSC +路由 +运行时环境 +元数据 |

Next 就像：

> 你让它做饭 → 它把厨房也一起打包了。

Vue/React：

> 只把做好的一盘菜给你。

## 如何判断真实的页面体积？

运行：

```
next build && next analyze
```

或使用插件：

```
next-bundle-analyzer
```

然后你会看到：

- 浏览器实际下载的 js **并不大**
- 很多 server-side 代码不会被客户端下载
- 图片优化、中间产物、缓存都占了体积，但不影响最终体积

## 如何减少 Next.js 客户端包体积？

下面是实际有效且常见的方法：

## 1. **减少 client component，改为 server component**

App Router 最大优点就是：

```
默认是服务器组件，只有你写 "use client" 才会成为客户端组件。
```

**越少 use client → 客户端包越小**。

## 2. 使用 `dynamic()` 分包加载

```
const Chart = dynamic(() => import("./Chart"), { ssr: false });
```

## 3. 去掉运行时 polyfills

```
next.config.js:
experimental: {
  optimizePackageImports: ['lodash', 'date-fns']
}
```

## 4. 打开 SWC 压缩

Next.js 默认开启，但可以确保启用：

```
swcMinify: true,
```

## 5. 依赖优化

比如避免：

- lodash（改用 lodash-es 按需）
- moment（体积巨大，改成 dayjs）
- antd 全量引入（按需引入）
