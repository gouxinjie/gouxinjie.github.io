const n=`# 构建工具中的 \`[hash]\` 与 \`[contenthash]\` : 以 Webpack 和 Vite 为例

[[toc]]

## 前言

在现代前端项目中，构建工具（如 **Webpack**、**Vite**、**Rollup**）都会为打包输出的文件生成带有哈希值的文件名，例如：

\`\`\`bash
bundle.4a8f2d.js
style.73a0de.css
\`\`\`

这些 **hash 值不仅是随机字符串**，而是前端性能优化的重要组成部分。

它们的核心作用是：

> ✅ **实现浏览器缓存的精准控制**（Cache Busting） ✅ **提高缓存命中率，减少重复加载**

但当我们在配置中看到 \`[hash]\`、\`[contenthash]\`、\`[chunkhash]\` 时，很多人会迷惑：这些到底有什么区别？ Vite 里也有类似的 hash 吗？

如下所示：

## 一、为什么需要 hash？

当浏览器加载静态资源（JS、CSS、图片）时，通常会缓存它们。这在性能上是好事，但也会带来一个经典问题：

> ❌ 文件更新了，但浏览器还在用旧缓存。

为了解决这个问题，我们给文件名添加哈希后缀：

\`\`\`bash
main.83a6d2.js
\`\`\`

当文件内容发生变化时，构建工具会生成新的 hash 值：

\`\`\`bash
main.93b7e4.js
\`\`\`

于是浏览器就会重新请求新文件，保证拿到最新版本。这就是所谓的 **缓存破坏（Cache Busting）机制**。

## 二、在 Webpack 中的三种哈希类型

Webpack 提供了三种占位符，它们代表不同粒度的哈希策略：

| 占位符          | 含义              | 更新范围                               |
| --------------- | ----------------- | -------------------------------------- |
| \`[hash]\`        | 整个构建的哈希    | 任意文件变动都会引起所有文件 hash 变化 |
| \`[chunkhash]\`   | 基于 chunk 的哈希 | 仅当前入口及依赖变动时更新             |
| \`[contenthash]\` | 基于内容的哈希    | 仅当文件内容变化时更新（最精细）       |

### 1️. \`[hash]\`：全局构建级别

\`\`\`js
output: {
  filename: "bundle.[hash].js";
}
\`\`\`

任意文件（JS、CSS、图片）变动，都会让所有输出文件的 hash 全部更新。

**适用场景：** 开发环境（每次构建都重新加载无所谓） **不适合生产：** 缓存命中率太低。

### 2️. \`[chunkhash]\`：按入口粒度更新

\`\`\`js
output: {
  filename: "bundle.[chunkhash].js";
}
\`\`\`

当某个入口文件（chunk）内容变化时，只更新该 chunk 的文件。但它仍可能受到其他依赖的影响（尤其是公共模块）。

> 💡 在使用 \`MiniCssExtractPlugin\` 抽离 CSS 时，CSS 改动会影响 JS 的 chunkhash，因此后期不常用。

### 3️. \`[contenthash]\`：内容级哈希（推荐）

\`\`\`js
output: {
  filename: "bundle.[contenthash].js";
}
\`\`\`

它根据文件**自身内容**生成哈希值。只要文件内容不变，文件名就保持稳定。

这也是现代前端构建中最常用、最推荐的方案。

## 三、在 Vite 中的哈希策略

Vite 没有 \`[hash]\`、\`[contenthash]\` 这样的占位符语法，但它的行为与 Webpack 的 \`[contenthash]\` 等价。

### 默认规则

Vite 的生产构建（\`vite build\`）输出目录通常是：

\`\`\`
dist/
 ├─ assets/
 │   ├─ index-BkR8kM3.js
 │   ├─ index-BkR8kM3.css
 │   └─ logo-CyT9y0D.png
\`\`\`

这些 \`BkR8kM3\`、\`CyT9y0D\` 就是 **基于文件内容计算的 hash 值**。当文件内容未变化时，hash 不会改变。

### 自定义命名规则

在 \`vite.config.js\` 中可以使用占位符控制输出格式：

\`\`\`js
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
};
\`\`\`

这里的 \`[hash]\` 实际等价于 **Webpack 的 \`[contenthash]\`**，它同样是根据内容变化生成的稳定哈希。

> 💡 在 Vite 中并没有全局 \`[hash]\` 或 \`[chunkhash]\`，所有 \`[hash]\` 都是基于内容的（即 content-based hash）。

## 四、两者的核心区别总结

| 对比项          | Webpack       | Vite                                |
| --------------- | ------------- | ----------------------------------- |
| 默认行为        | 不带 hash     | 自动生成基于内容的 hash             |
| \`[hash]\`        | 全局构建 hash | 文件内容 hash（等价于 contenthash） |
| \`[contenthash]\` | 内容级别 hash | 默认行为                            |
| 配置复杂度      | 高            | 简单（几乎开箱即用）                |
| 缓存控制精度    | 可配置        | 默认精细                            |

## 五、使用场景推荐

| 场景           | 推荐做法                                                       | 说明               |
| -------------- | -------------------------------------------------------------- | ------------------ |
| **开发环境**   | 使用 \`[hash]\`（Webpack）或关闭 hash（Vite 默认 dev 不带 hash） | 方便热更新         |
| **生产环境**   | 使用 \`[contenthash]\`（Webpack）或默认行为（Vite）              | 文件内容变化才更新 |
| **图片、字体** | 使用 \`[contenthash]\` 或 Vite 默认 \`[hash]\`                     | 提升缓存命中率     |
| **CSS 文件**   | 使用 \`MiniCssExtractPlugin\` + \`[contenthash]\`（Webpack）       | 独立缓存控制       |

## 六、实战示例

### ✅ Webpack 生产配置

\`\`\`js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  output: {
    filename: "js/[name].[contenthash].js",
    clean: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css"
    })
  ]
};
\`\`\`

### ✅ Vite 生产配置

\`\`\`js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
};
\`\`\`

两者最终行为一致： 👉 只要文件内容不变，hash 不会变化，浏览器缓存就能命中。

## 七、最佳实践总结

| 目标       | Webpack 配置                                              | Vite 配置                                         |
| ---------- | --------------------------------------------------------- | ------------------------------------------------- |
| 开发调试   | \`[hash]\`                                                  | 默认行为（不带 hash）                             |
| 生产构建   | \`[contenthash]\`                                           | 默认 \`[hash]\`（内容 hash）                        |
| 图片、字体 | \`assetModuleFilename: 'assets/[name].[contenthash][ext]'\` | \`assetFileNames: 'assets/[name]-[hash][extname]'\` |
| CSS 抽离   | \`MiniCssExtractPlugin + [contenthash]\`                    | 默认生成                                          |
`;export{n as default};
