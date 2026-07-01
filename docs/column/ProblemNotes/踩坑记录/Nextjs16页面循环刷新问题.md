# 夸克浏览器 + Next.js 16：一场 HMR WebSocket 引发的页面刷新循环排查实录

## 背景

最近在用 **Next.js 16** 开发一个移动端 H5 项目，技术栈为 Next.js App Router + React 19 + TypeScript + Prisma + SQLite。目标用户主要在手机浏览器上使用，因此我们需要在主流国产浏览器中验证兼容性。

就在用**夸克浏览器**（Quark Browser）打开开发服务器时，遇到了一个诡异的问题——`/login` 页面**无限刷新**，页面内容一闪而过就开始重新加载，完全无法正常使用。但 Chrome、Edge、Safari 下一切正常。

本文记录从排查到定位根因的完整过程。


## 第一轮排查：怀疑重定向循环

现象是页面不断刷新，第一反应是**路由重定向循环**。项目里有几个可能产生重定向的地方：

- `middleware.ts`——检查 Cookie 进行根路由跳转
- `page.tsx`——根页面服务端 `redirect("/calendar")`
- `AuthGuard` 客户端组件——无 token 时 `replace("/login")`

如果这三者之间形成竞态，确实可能造成循环。

### 尝试 1：简化 middleware

将 middleware 从鉴权重定向简化为纯透传，把根路由跳转移交给 `page.tsx` 的服务端 `redirect`。

**结果：** 仍然刷新。

### 尝试 2：移除 middleware 文件

完全删除 `middleware.ts`，让中间件层不再拦截任何请求。

**结果：** 仍然刷新。


## 第二轮排查：怀疑客户端组件

既然中间件没问题，可能是 `LoginPageClient` 客户端组件内部有什么逻辑触发了不停重载。

### 尝试 3：替换为极简页面

把 `/login` 页面替换为一个没有任何交互逻辑的纯展示页面：

```tsx
export default function LoginPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Login Test Page</h1>
      <p>纯静态内容，无任何 JS 交互</p>
    </div>
  );
}
```

**结果：** 仍然刷新。

这说明问题不在业务组件，而在更底层。


## 第三轮排查：隔离 Next.js 框架层

到目前为止，排除了：

- ❌ 中间件重定向循环
- ❌ 客户端组件逻辑问题
- ❌ 服务端数据请求问题

接下来要验证是否是 Next.js 框架本身在夸克浏览器中出了问题。

### 尝试 4：纯静态 HTML 文件

在 `public/test-login.html` 放了一个**纯静态 HTML**，不含任何 JS：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>Static Test</title></head>
<body>
  <h1>纯静态测试页</h1>
  <p>此页面无任何 JS、无 meta refresh</p>
</body>
</html>
```

**结果：** ✅ 正常，不刷新。

### 尝试 5：API Route 直出 HTML

创建一个 Route Handler，直接用 `NextResponse` 返回 HTML 字符串，**绕过 React 渲染管线和所有客户端 JS**：

```ts
export async function GET() {
  const html = `<!DOCTYPE html><html>...</html>`;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
```

**结果：** ✅ 正常，不刷新。

### 尝试 6：Next.js 页面（开发模式）

恢复 `/login` 为极简页面，由 Next.js App Router 正常渲染。

**结果：** ❌ 仍然刷新。


## 对比矩阵

| 方案 | 渲染方式 | 客户端 JS | 结果 |
|------|---------|----------|------|
| 纯静态 HTML | 文件直出 | 无 | ✅ 正常 |
| API Route HTML | 字符串直出 | 无 | ✅ 正常 |
| Next.js 页面（生产模式） | SSR + Hydration | 最小化 | ✅ 正常 |
| Next.js 页面（开发模式） | SSR + HMR | WebSocket + DevTools | ❌ 刷新循环 |

关键差异浮出水面：**开发模式注入了 HMR WebSocket 客户端和 React DevTools 脚本，而生产模式没有**。


## 根因定位

打开 Next.js 开发模式下 `/login` 返回的 HTML，可以看到大量开发专用脚本：

```html
<script src="/_next/static/chunks/webpack.js"></script>
<script src="/_next/static/chunks/main-app.js"></script>
<script>self.__next_r="btBelJ0JD4ghz2cDTz0Pb"</script>
<!-- HMR Runtime + Segment Explorer + Dev Overlay ... -->
```

其中 `self.__next_r` 是 **HMR（Hot Module Replacement）运行时标识**，它会建立 WebSocket 连接到开发服务器，监听文件变更以触发模块热更新。

**夸克浏览器对 WebSocket 长连接的支持存在问题**：连接建立后很快断开 → HMR 客户端检测到断连 → 自动重连 → 重连成功后触发页面全量刷新 → 刷新后重新建立 WebSocket → 再次断开...形成**无限刷新循环**。

这也解释了为什么：

- 纯静态 HTML / API Route 不刷新——根本没有 WebSocket
- 生产模式不刷新——生产构建不包含 HMR 脚本
- Chrome/Edge 不刷新——这些浏览器的 WebSocket 实现稳定


## 解决方案

### 短期：开发与测试分离

```
# 开发时用 Chrome/Edge（HMR 正常工作）
npm run dev

# 夸克浏览器验证时，用生产模式
npx next build && npx next start
```

### 长期思路

如果想在夸克浏览器上也能使用开发模式，有几个方向可以探索：

1. **向夸克浏览器团队反馈 WebSocket 兼容性问题**
2. **Next.js 配置层面**——目前 Next.js 16 没有官方选项禁用 HMR WebSocket，可以在 `next.config.ts` 的 webpack 配置中尝试移除 `HotModuleReplacementPlugin`，但这会丧失热更新能力
3. **使用代理层**——在本地起一个代理服务器，过滤掉注入到页面中的 HMR 脚本，但这属于 hack 方案，不推荐生产使用


## 总结

这次排查花了将近一个小时，经历了「怀疑重定向 → 怀疑组件 → 怀疑框架 → 隔离测试 → 对比差异 → 定位根因」的完整链路。

几个关键教训：

1. **控制变量法**是最有效的调试策略——从纯静态到框架页面逐步递进，精准定位问题层级
2. **国产浏览器的兼容性**不容忽视——夸克浏览器对 Cookie、WebSocket 等 Web API 的实现与主流浏览器存在差异
3. **开发模式 ≠ 生产模式**——二者的 JavaScript 运行时差异远比想象中大，HMR、DevTools、Fast Refresh 都是额外的复杂度来源
4. **看到"页面刷新"不要只想到重定向**——WebSocket 断连重连同样可以导致刷新行为

希望这篇记录能帮到遇到类似问题的同学。如果你也遇到某个浏览器下 Next.js 页面无限刷新，不妨先用静态 HTML 和 API Route 做隔离测试，再看看是不是开发模式的锅。
