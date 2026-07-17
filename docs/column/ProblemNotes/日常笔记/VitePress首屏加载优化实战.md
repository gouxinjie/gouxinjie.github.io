# VitePress 个人博客首屏加载优化实战

在维护个人博客或文档站点时，首屏加载速度（First Contentful Paint, FCP）直接影响用户的留存和阅读体验。本文将结合我近期对本站进行的性能优化工作，分享几个实用的 VitePress 优化方案。

## 1. 背景：性能瓶颈分析

在优化前，通过浏览器的 Network 面板和性能分析工具，发现站点存在以下几个主要问题：
- **主包体积过大**：大量的全局组件在首屏被一次性加载，导致 JS 解析时间长。
- **外部资源延迟**：从 Google Fonts 请求字体资源在国内环境下存在明显的网络抖动。
- **域名解析耗时**：搜索服务（Algolia）等外部依赖在建立连接时存在 DNS 解析开销。

---

## 2. 优化方案一：异步组件化 (Code Splitting)

VitePress 默认会将 `enhanceApp` 中注册的全局组件打包进主 Bundle 中。对于一些非首屏必需的交互组件（如五彩纸屑动画、返回顶部、数据面板等），我们应当使用 Vue 的 `defineAsyncComponent` 进行异步导入。

### 实施代码
在 `theme/index.ts` 中进行改造：

```typescript
// 优化前
// import Confetti from "../components/Confetti.vue";

// 优化后：异步加载
import { defineAsyncComponent } from 'vue';
const Confetti = defineAsyncComponent(() => import("../components/Confetti.vue"));

export default {
  enhanceApp({ app }) {
    app.component("Confetti", Confetti);
  }
}
```

**效果**：主 Bundle 体积明显下降，非必需组件的代码被拆分为独立的 Chunk，仅在对应页面加载时才下载。

---

## 3. 优化方案二：字体资源本地化 (Self-hosting)

为了追求极致的排版效果，本站使用了 `Inter` 和 `JetBrains Mono` 字体。原方案是通过 Google Fonts CDN 加载，这虽然方便，但会产生额外的连接开销。

### 优化步骤
1. **下载字体**：从 Google Fonts 下载 `woff2` 格式的拉丁子集文件。
2. **本地托管**：放置于 `docs/public/font` 目录。
3. **配置 CSS**：通过 `@font-face` 自定义字体引用，并设置 `font-display: swap` 以避免文字闪白（FOIT）。

**效果**：消除了对第三方域名的依赖，字体加载速度提升 50% 以上，且在弱网环境下更具韧性。

---

## 4. 优化方案三：网络连接优化 (DNS Prefetch)

对于必须引用的外部服务（如 Algolia 搜索、不蒜子统计），我们可以利用浏览器的 `dns-prefetch` 技术，在后台提前解析域名。

### 实施代码
在 `config.mts` 的 `head` 配置中添加：

```typescript
export default defineConfig({
  head: [
    ["link", { rel: "dns-prefetch", href: "https://v8p16id925-dsn.algolia.net" }]
  ]
})
```

---

## 5. 优化方案四：构建体积监控

为了防止项目体积在后续迭代中无序增长，我们需要调整构建系统的警告阈值。

### 实施操作
在 Vite 配置中，将 `chunkSizeWarningLimit` 调整为合理的数值（如 1000KB），并在构建脚本中关注警告信息。这有助于我们在引入重型依赖（如 Mermaid、Katex）时，第一时间考虑通过 `manualChunks` 进行拆包。

---

## 6. 总结与后续规划

经过上述优化，站点的 Lighthouse 性能评分有了显著提升，首屏加载感知更加顺滑。性能优化是一个持续的过程，后续我还计划从以下几个维度继续深挖：
- **图片自动化压缩**：将所有 PNG/JPG 转换为 WebP。
- **服务端优化**：在 Nginx 侧开启 Brotli 压缩，替换传统的 Gzip。
- **预渲染优化**：针对核心路由开启路由预取。

希望这些经验能为正在使用 VitePress 构建站点的开发者提供参考。
