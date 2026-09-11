# 自定义 Document 讲解

[[toc]]

在`Next.js 15 的 App Router` 中，传统的 **自定义 Document（`_document.js`）** 已经不再是开发者必须掌握的内容。

官方提供了更现代的方式：通过 **layout.js + metadata + next/font/google + next/script** 来实现绝大多数全局 HTML、head、字体和脚本管理功能。

## 一、什么是自定义 Document？

在 **Pages Router**（`pages/_document.js`）中，自定义 Document 的主要作用是：

1. 控制整个 HTML 文档结构（`<html>`、`<body>`）。
2. 添加全局 `<meta>`、favicon、link、第三方脚本。
3. 设置字体、全局 class。
4. 注意：**只能在服务端执行**，不能使用 React hook。

示例（Pages Router）：

```js
// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

> 在 Pages Router 中，如果你需要自定义 `<html>` 或 `<head>`，必须使用 `_document.js`。

## 二、为什么 App Router 下几乎不需要自定义 Document？

`Next.js 15 App Router` 引入了 **layout.js + metadata** 的概念：

- **layout.js**

  - 替代 `_document.js` 管理 `<html>` 和 `<body>`。
  - 可包裹全局 Provider、全局 class、全局样式。

- **metadata**

  - 自动生成 `<head>` 标签（title、description、OG、viewport 等）。
  - 页面或子 layout 可以覆盖全局 metadata，实现灵活 SEO。

- **next/font/google**

  - 替代手动引入 `<link>` 的 Google Fonts。
  - 支持 CSS 变量、优化字体加载。

- **next/script**

  - 替代手动 `<script>` 注入第三方 SDK。
  - 支持异步、懒加载、浏览器交互触发。

> 换句话说，App Router 提供了完整的 **现代化全局管理方案**，以前 `_document.js` 承担的功能现在都可以通过 layout.js + metadata + next/font/google + next/script 实现。

## 三、如何在 App Router 下实现自定义 Document 功能

### 1️⃣ 全局布局（layout.js）

```js
// app/layout.js
import { getServerSession } from "next-auth";
import Link from "next/link";
import Script from "next/script"; //  [!code highlight]

// 定义相关元数据  [!code highlight:16]
export const metadata = {
  title: "Next.js Demo App",
  description: "全局描述信息",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  openGraph: {
    title: "Next.js Demo App",
    description: "演示 Open Graph 信息",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Demo App",
    images: ["/og-image.png"]
  }
};

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* 第三方脚本 相关 */}
        <Script src="https://example.com/sdk.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
```

**如图所示：**

![document-1.png](../images/document-1.png)

### 2️⃣ 自定义字体使用（next/font/google）

`next/font`模块，内置了字体优化功能，其目的是防止 CLS 布局偏移。font 模块主要分为两部分，一部分是内置的 Google Fonts 字体，另一部分是本地字体。

在使用 google 字体的时候，Google 字体和 css 文件会在构建的时候下载到本地，可以与静态资源一起托管到服务器，所以不会向 Google 发送请求.

字体网站：[Google Fonts](https://fonts.google.com/)

**1. 基本使用**

layout.jsx:

```js
import { BBH_Sans_Hegarty } from "next/font/google"; //引入字体库
const bbhSansHegarty = BBH_Sans_Hegarty({
  weight: "400", //字体粗细
  display: "swap" //字体显示方式
});
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={bbhSansHegarty.className}>
        {" "}
        {/** bbhSansHegarty会返回一个类名，用于加载字体 */}
        {children}
        sdsadasdjsalkdjasl 你好
      </body>
    </html>
  );
}
```

**2. 可变字体**

可变字体是一种可以适应不同字重和样式的字体，它可以在不同的设备上自动调整字体大小和样式，以适应不同的屏幕大小和分辨率。

```jsx
import { Roboto } from "next/font/google";
const roboto = Roboto({
  weight: ["400", "700"], //字体粗细 (不是所有字体都支持可变字体)
  style: ["normal", "italic"], //字体样式
  subsets: ["latin"],
  display: "swap"
});
```

**3. 字体属性**

| 属性               | Google | 本地 | 类型             | 必填 | 说明                    |
| ------------------ | ------ | ---- | ---------------- | ---- | ----------------------- |
| src                | X       | ✔    | String / Array   | 是   | 字体文件路径            |
| weight             | ✔      | ✔    | String / Array   | 可选 | 字体粗细，如 `'400'`    |
| style              | ✔     | ✔    | String / Array   | 可选 | 字体样式，如 `'normal'` |
| subsets            | ✔      | X    | Array            | 可选 | 字符子集                |
| axes               | ✔      | X     | Array            | 可选 | 可变字体轴              |
| display            | ✔      | ✔    | String           | 可选 | 显示策略                |
| preload            | ✔      | ✔    | Boolean          | 可选 | 是否预加载              |
| fallback           | ✔      | ✔    | Array            | 可选 | 备用字体                |
| adjustFontFallback | ✔      | ✔    | Boolean / String | 可选 | 调整备用字体            |
| variable           | ✔      | ✔    | String           | 可选 | CSS 变量                |
| declarations       | X      | ✔    | Array            | 可选 | 自定义声明              |
