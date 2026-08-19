const n=`# 钉钉 H5 微应用页面缓存问题实战

[[toc]]

## 一、问题背景

在钉钉 H5 微应用开发中，几乎每个团队都会遇到这样一个痛点：

> "我明明发版了，为什么用户打开还是旧页面？"

这个问题的根源在于**缓存**。钉钉内置的 webview 与普通浏览器一样，会遵循 HTTP 缓存协议来缓存静态资源。如果处理不当，发版后用户仍会命中旧缓存，导致线上出现"代码改了但没生效"的假象。

本文结合我们在「复星员工公益」钉钉 H5 微应用中的真实实践，梳理钉钉 H5 页面缓存的成因、常规解法，以及最终落地的 **version.json 发版检测**方案。


## 二、钉钉 H5 为什么会缓存

### 2.1 缓存的本质

浏览器（包括钉钉 webview）会对静态资源（JS、CSS、图片）进行缓存，目的是减少网络请求、加快二次加载。缓存的生效由 **HTTP 响应头**决定，常见的缓存策略：

| 响应头 | 含义 |
|--------|------|
| \`Cache-Control: max-age=3600\` | 资源 1 小时内复用缓存 |
| \`Cache-Control: no-cache\` | 每次请求都要问服务器，但可用 ETag/Last-Modified 校验 |
| \`Cache-Control: no-store\` | 完全不缓存 |
| \`ETag\` / \`Last-Modified\` | 配合 no-cache 做"条件请求"验证 |

### 2.2 钉钉 webview 的特殊性

钉钉的 webview 相比普通浏览器有几个特点：

1. **长驻不销毁**：钉钉会在应用内缓存多个 webview 实例，用户从会话/工作台反复进出时，可能复用已加载的 webview，页面状态和缓存被保留。
2. **缓存策略更激进**：钉钉对 H5 静态资源通常开启强缓存（\`max-age\`），部分网络环境下甚至会命中 CDN 缓存。
3. **无刷新入口**：普通浏览器有"刷新按钮"，而钉钉 webview 大多没有，用户难以手动强制刷新。

这就导致了一个尴尬的现状：**发版后，用户打开钉钉里的 H5，很可能还是旧版本。**


## 三、常规解决手段

### 3.1 方案一：HTML 层禁止缓存

在 \`index.html\` 的 \`<head>\` 中添加禁用缓存的 meta 标签：

\`\`\`html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
\`\`\`

**作用**：让 HTML 入口文件本身不被缓存，用户每次进入都会拉取最新的 \`index.html\`。

**局限**：meta 标签只对 HTML 页面本身生效，**对 JS/CSS 等静态资源无效**。真正决定资源缓存的是服务端返回的响应头。

### 3.2 方案二：静态资源加 Hash（构建层面）

现代构建工具（Vite / Webpack）默认会给产物文件名加 **内容 Hash**：

\`\`\`
assets/index-BWMXU89E.js
assets/vant-vendor-CAvqmTz_.js
\`\`\`

**原理**：文件内容变了，Hash 就变，文件名也就变了。新的 HTML 会引用新文件名的资源，浏览器无法复用旧缓存，从而强制拉新。

\`\`\`js
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'pinia'],
        'vant-vendor': ['vant'],
      },
    },
  },
},
\`\`\`

**作用**：资源内容变化时自动换文件名，是"发版后能拿到新代码"的关键基础。

### 3.3 方案三：服务端配置 no-cache

在 Nginx 中对静态资源禁用缓存（或对 HTML 禁用）：

\`\`\`nginx
# 对 HTML 禁用缓存，确保每次拉最新
location ~* \\.html$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}

# 对带 Hash 的资源做长缓存，命中率最大化
location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
\`\`\`

**核心策略**：**HTML 不缓存 + 带 Hash 的资源长缓存**。这样既能保证发版后 HTML 指向新资源，又能让不变化的资源高效复用缓存。

### 3.4 方案四：改"应用首页地址"加版本号参数（最有效）

这是钉钉官方场景里最简单粗暴的做法，**不需要改代码，只改开发者后台配置**：

**操作步骤**：

1. 登录**钉钉开发者后台**。
2. 在"应用开发" > "企业内部开发"中找到你的 H5 微应用，点击进入详情页。
3. 在"应用信息"或"开发管理"区域，找到**应用首页地址**（可能也称作"PC端首页地址"）。
4. 修改入口 URL，直接追加版本号参数，例如：

   \`\`\`text
   https://your-domain.com/index.html?version=v2.0.1
   \`\`\`

5. **关键一步**：修改完成后，需要进入"版本管理与发布"，**新建一个版本并重新发布**，这个新地址才会对用户生效。

**原理**：入口 URL 加了 \`?version=v2.0.1\` 后，与旧地址 \`https://your-domain.com/index.html\` 是**两个不同的 URL**。钉钉 webview 会把它当作一个"全新页面"来加载，不再命中旧 webview 的缓存，从而强制拉取最新资源。

**优点**：

- 零代码改动，只需后台配置 + 发布
- 立竿见影，能立刻绕开 webview 缓存
- 版本号可读性好（\`v2.0.1\`），便于运维核对

**局限（务必注意）**：

- **纯人工操作**：每次发版都要去后台改地址、重新发布，无法自动化，容易遗漏
- **仅覆盖入口**：只对从"应用首页地址"进入的用户生效；通过工作通知链接、分享链接、收藏的旧链接进入的用户，仍可能打开旧地址
- **版本号需手动维护**：依赖人记着每次递增，忘记改就失效
- **不解决"使用中"的升级**：已停留在旧页面的用户不会自动感知新版本，仍需配合其他手段

> 这个方案适合作为**发版时的临时强刷手段**（配合 CI/CD 或人工发版流程），而**不是长期、自动化的缓存治理方案**。要想用户使用中也能自动感知发版，还是需要下一节的 version.json 检测。


## 四、version.json 发版检测方案（实战）

上面的手段解决了"资源能拿到最新"的问题，但还有一个体验层面的诉求：**用户正在使用旧页面时，发版后如何及时感知并刷新？**

于是我们引入了 **version.json 发版检测**方案：

### 4.1 方案目标

- 每次打包自动生成 \`version.json\`（内含唯一版本号）
- 用户进入页面时，比对远端版本与本地记录的版本
- 检测到发版（版本不一致）时，弹窗提示用户刷新页面

### 4.2 第一步：构建时自动生成 version.json

编写一个 Vite 插件，在构建完成后向 \`dist/\` 写入 \`version.json\`，版本号用构建时间戳保证唯一：

\`\`\`ts
// vite-plugin-version.ts
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

export const versionPlugin = (): Plugin => {
  return {
    name: 'vite-plugin-version-json',
    apply: 'build',
    writeBundle(this, options) {
      const outDir = (options.dir || 'dist') as string
      const version = \`\${Date.now()}\`                    // 唯一版本号
      const buildTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      writeFileSync(
        resolve(outDir, 'version.json'),
        JSON.stringify({ version, buildTime }),
        'utf-8',
      )
    },
  }
}
\`\`\`

在 \`vite.config.ts\` 中注册：

\`\`\`ts
import { versionPlugin } from './vite-plugin-version.js'

export default defineConfig({
  plugins: [/* 其他插件 */, versionPlugin()],
})
\`\`\`

构建后产物：

\`\`\`json
{ "version": "1787106373632", "buildTime": "2026/8/19 10:26:13" }
\`\`\`

### 4.3 第二步：前端发版检测

编写检测工具，拉取远端 \`version.json\` 并与本地 \`localStorage\` 记录比对：

\`\`\`ts
// src/utils/version.ts
const VERSION_KEY = 'app_version'   // 版本号存储 key
const CHECK_TIMEOUT = 3000          // 检测超时，避免阻塞启动

export const hasNewVersion = async (): Promise<boolean> => {
  try {
    const baseUrl = import.meta.env.BASE_URL || '/'
    // 拼时间戳规避缓存，确保拿到最新 version.json
    const res = await fetch(\`\${baseUrl}version.json?_=\${Date.now()}\`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    const data = (await res.json()) as { version: string }
    const last = localStorage.getItem(VERSION_KEY)
    // 首次进入：记录基准版本，不提示
    if (last === null) {
      localStorage.setItem(VERSION_KEY, data.version)
      return false
    }
    // 版本不一致 → 发版了
    return last !== data.version
  } catch (error) {
    // 检测失败静默降级，不影响正常使用
    console.error('发版检测失败:', error)
    return false
  }
}
\`\`\`

在应用入口调用，检测到新版本时弹窗提示刷新：

\`\`\`ts
// src/main.ts
const checkVersionAndPromptRefresh = async (): Promise<void> => {
  const needRefresh = await hasNewVersion()
  if (!needRefresh) return
  await showConfirmDialog({
    title: '发现新版本',
    message: '页面已更新，点击确认刷新以体验最新版本',
    confirmButtonText: '刷新',
    showCancelButton: false,
  })
  window.location.reload()
}

// 启动时并行检测，不阻塞认证流程
void checkVersionAndPromptRefresh()
\`\`\`


## 五、踩过的坑与注意事项

### 5.1 坑一：首次进入不弹窗

发版检测逻辑**只对"已经记录过基准版本"的访问生效**。如果用户是第一次打开新版（本地无 \`app_version\`），会走"首次进入"分支——只记录版本、不提示刷新。

> 这是有意为之：避免**全新用户**一进应用就被弹"发现新版本"的糟糕体验。

**现象**：某环境首次部署检测逻辑后，用户第一次进入不会弹窗，这是正常现象；下次再发版时才会比对出差异并弹窗。

### 5.2 坑二：localStorage 按域名隔离

\`localStorage\` 是**按域名隔离**的，\`esg-web.fosun.com\`（生产）和 \`esg-web.uat.fosun.com\`（UAT）的存储互不干扰。

因此可能出现：**UAT 能弹窗、PRD 不弹窗**。原因往往是用户在 UAT 早已记录过旧版本，而 PRD 是首次运行检测逻辑（无基准记录）。

> 排查时，先确认对应环境的 \`version.json\` 是否可访问、版本号是否最新，再检查该环境 localStorage 是否有基准记录。

### 5.3 坑三：version.json 必须真实部署

\`version.json\` 生成在 \`dist/\` 根目录（不在 \`assets/\` 下），部署时**容易被遗漏**。若服务器返回 404，前端 fetch 失败会静默降级，不弹窗。

**排查方法**：浏览器直接访问 \`https://你的域名/version.json\`，看能否返回合法 JSON。

### 5.4 坑四：弹窗前不要提前写入版本号

如果把"记录新版本号"放在"检测到不一致"时就执行，用户**若未点刷新**（忽略弹窗、返回、关页面），本地已被标记为新版本，下次进入**不再提示**，但用户实际仍在旧版本运行。

> 正确做法：**只在用户确认刷新后**才更新本地版本号。

\`\`\`ts
// 确认刷新后，再记录当前已确认的最新版本
await recordCurrentVersion()
window.location.reload()
\`\`\`

### 5.5 坑五：检测不要阻塞启动

发版检测涉及网络请求（还带超时），若用 \`await\` 串行阻塞在认证流程前，网络慢时会拖慢整个应用首屏。

> 正确做法：检测与认证流程**并行**，检测到新版本时弹窗覆盖在页面上即可。

---
## 六、总结

钉钉 H5 微应用的缓存治理，核心是一套组合拳：

| 层次 | 手段 | 解决什么 |
|------|------|----------|
| HTML 层 | meta 禁用缓存 + 服务端 no-cache | 入口每次拉最新 |
| 资源层 | 构建产物加 Hash + 长缓存 | 内容变了强制拉新，没变高效复用 |
| 后台层 | 改"应用首页地址"加版本号参数 | 发版时人工强制换入口 URL，绕过 webview 缓存 |
| 应用层 | version.json 发版检测 | 用户使用中感知发版，提示刷新 |

**原则**：**HTML 不缓存 + 带 Hash 资源长缓存** 是基础；**后台改首页地址** 是发版时的临时强刷手段；**version.json 发版检测** 是体验增强，让用户"使用旧页面时也能及时升级"。

**方案选择建议**：
- 想**零代码、快速强刷**，临时用"改应用首页地址加版本号"（但要记得每次发版后台更新 + 重新发布）
- 想**长期自动化、用户使用中也能升级**，用 version.json 发版检测
- 两者不冲突，可以**组合使用**：后台换地址保证入口刷新，version.json 保证存量用户感知升级

代码与缓存从来都是"发版"这件事的一体两面——发版不止是推送新代码，更是**让用户可靠地拿到新代码**。理解了钉钉 webview 的缓存特性，并在构建、部署、应用三层同时发力，才能彻底告别"发版了但用户看不到"的魔咒。

---

*本文基于「复星员工公益」钉钉 H5 微应用（Vue 3 + Vite 6）实战经验整理。*
`;export{n as default};
