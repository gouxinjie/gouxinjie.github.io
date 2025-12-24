# Next.js 路由系统对比：Pages Router vs App Router

[[toc]]

`Next.js 是 React `的全栈框架，自带路由系统。随着 **Next.js 13 / 15** 的发展，官方推出了 **App Router**，与传统 **Pages Router** 共存。

## 一、Pages Router

### 1️. 基本概念

- **目录**：`pages/`
- **路由映射**：文件名对应 URL 路径

  ```text
  pages/
    index.js      → /
    about.js      → /about
    blog/[id].js  → /blog/:id
  ```

- **特点**：

  - 每个文件都是页面
  - 支持 `getStaticProps`, `getServerSideProps`, `getStaticPaths`
  - `_app.js` 和 `_document.js` 管理全局布局和 HTML
  - 数据获取通过 page-level 函数完成

### 2. 典型代码示例

```js
// pages/index.js
export default function Home({ posts }) {
  return (
    <div>
      <h1>Welcome to My Blog</h1>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}

// 数据获取
export async function getStaticProps() {
  const posts = await fetchPosts();
  return { props: { posts } };
}
```

### 3. 优点

- 简单直观，适合传统项目
- 社区和示例多，学习成本低
- 支持 SSR、SSG 和 ISR

### 4. 缺点

- **布局复用复杂**：每页必须通过 `_app.js` 或 HOC 实现
- **嵌套路由不方便**：没有原生 nested routing
- **不支持 React Server Components（RSC）**：不能像 App Router 那样在服务器直接渲染组件

## 二、App Router （新项目推荐使用）

### 1. 基本概念

- **目录**：`app/`
- **路由映射**：文件夹对应 URL

  ```text
  app/
    page.js         → /
    about/page.js   → /about
    blog/[id]/page.js → /blog/:id
  ```

- **特点**：

  - 原生支持 **嵌套路由**（nested routing）
  - 原生支持 **Server Components** 和 **Client Components**
  - 使用 `layout.js` 实现全局和局部布局
  - 使用 `metadata` 配置全局 title、meta、Open Graph
  - 支持 `loading.js`、`error.js`、`template.js` 等页面状态

### 2. 典型代码示例

#### Layout + Page + Metadata

```js
// app/layout.js
export const metadata = {
  title: "My Blog",
  description: "Welcome to my blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/page.js
export default function HomePage() {
  return <h1>Welcome to My Blog (App Router)</h1>;
}
```

#### 嵌套路由示例

```text
app/
  blog/
    layout.js      // blog 页面布局
    [id]/
      page.js      // /blog/:id
```

### 3. 优点

- **嵌套路由和嵌套布局**原生支持
- **Server Components** + **Client Components** 优化性能
- 页面级 metadata 管理更简单
- 支持局部加载状态 (`loading.js`) 和错误边界 (`error.js`)
- 更现代化的全局布局和字体管理

### 4. 缺点

- 学习成本较高，需要理解 RSC
- 社区和第三方库支持不如 Pages Router 广泛
- 与旧项目迁移可能需要重构目录结构

## 三、主要区别对比

| 特性                          | Pages Router                        | App Router                        |
| ----------------------------- | ----------------------------------- | --------------------------------- |
| 路由目录                      | pages/                              | app/                              |
| 文件到 URL 映射               | 文件名 → 路径                       | 文件夹 + page.js → 路径           |
| 布局复用                      | `_app.js` 或 HOC                    | layout.js + 嵌套布局              |
| 数据获取                      | getStaticProps / getServerSideProps | Server Components + fetch / async |
| React Server Components       | ❌                                  | ✅                                |
| 页面状态管理（loading/error） | ❌                                  | ✅ loading.js / error.js          |
| Metadata / SEO                | Head 组件手动管理                   | metadata 自动生成                 |
| 学习曲线                      | 低                                  | 高                                |

## 四、选型建议

::: tip

现在新项目只推荐使用 App Router。

:::
