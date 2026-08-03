const n=`

# 前端发版后用户不刷新？两套极简方案搞定无感更新提醒

在现代单页应用（SPA）开发中，一个常见且棘手的问题是：**代码更新部署上线后，用户仍保留在旧页面中操作**。这不仅会导致新功能无法体验，还容易引发新旧接口不兼容、静态资源加载报错（\`ChunkLoadError\`）甚至提交脏数据。

今天就来聊聊目前行业中最主流、最轻量的解决方案：**基于 \`index.html\` 的 Script Hash 轮询检测**，并奉上原生封装与自动化插件两套落地实践。

![](../images/update.png)

## 一、 为什么 HTML Hash 轮询是首选方案？

在考虑更新提醒时，不少开发者会想到 **WebSocket** 或 **Service Worker**，但在“版本更新检测”这一特定场景下，它们的性价比并不高：

* **WebSocket：** 适合高频、低延迟的双向实时通信（如 IM 聊天、协同文档、股市行情）。但对于几天或几周才发版一次的系统，维持成千上万个长连接会导致极高的服务器内存与运维成本。
* **Service Worker：** 离线能力强大，但缓存控制与更新生命周期极为繁琐，稍有不慎就会引发“强缓存清除不掉”的线上灾难。

相比之下，**基于 \`index.html\` 的 Script Hash 轮询方案** 优势极其明显：

1. **零后端改造成本：** 纯前端 + Nginx 现有静态托管即可。
2. **绝对准确：** 现代打包工具（Vite / Webpack）每次构建都会生成带唯一 Hash 的静态文件名注入 \`index.html\`。
3. **极低开销：** 仅拉取极小体积的 HTML 字符串，配合策略触发，对服务器压力几乎为零。

\`\`\`
[ 1. 页面加载记录初始 Hash ] ──► [ 2. 定时/切页请求最新 index.html ]
                                         │
[ 4. 变化即触发更新提醒 ] ◄─── [ 3. 提取 Script Hash 比对 ]

\`\`\`


## 二、 方案 1：原生 JavaScript 极简封装（带健壮性增强）

如果不想引入额外依赖，可以用几十行纯 JS 代码封装一个更新检测器。

为了避免“频繁弹窗扰民”和“并发请求过度”，我们在基础轮询上补全了 **防抖锁**、**连续两次确认防 CDN 抖动** 与 **Session 级打扰拦截** 细节：

\`\`\`javascript
// auto-updater.js
export class AutoUpdater {
  constructor(options = {}) {
    this.checkInterval = options.checkInterval || 5 * 60 * 1000; // 默认 5 分钟
    this.onUpdate = options.onUpdate || (() => {});
    this.oldScripts = null;
    this.timer = null;
    this.isChecking = false;    // 请求并发锁
    this.diffCount = 0;         // 连续不一致计数器（防 CDN 节点未同步抖动）
  }

  // 1. 获取并提取 index.html 中所有 <script> 的 src 路径
  async getScripts() {
    try {
      const html = await (await fetch(\`/?t=\${Date.now()}\`)).text();
      const reg = /<script[^>]+src=["']([^"']+)["']/g;
      return Array.from(html.matchAll(reg), m => m[1]);
    } catch {
      return [];
    }
  }

  // 2. 执行 Hash 比对与防抖逻辑
  async check() {
    // 防打扰：若用户在此 Session 中点过“稍后提醒”，本次会话不再弹窗
    if (sessionStorage.getItem('dismiss_update_notice') === 'true') return;
    if (this.isChecking) return;

    this.isChecking = true;
    const newScripts = await this.getScripts();
    this.isChecking = false;

    if (!newScripts.length) return;

    if (!this.oldScripts) {
      this.oldScripts = newScripts;
      return;
    }

    // 比对 Script Hash 列表
    if (JSON.stringify(this.oldScripts) !== JSON.stringify(newScripts)) {
      this.diffCount++;
      // 连续 2 次检测到变化才确认更新，避免 CDN 边缘节点发布同步延迟造成的误报
      if (this.diffCount >= 2) {
        this.onUpdate();
        this.stop();
      }
    } else {
      this.diffCount = 0; // 恢复正常
    }
  }

  // 3. 开启多维度监听
  start() {
    this.check();
    // 策略 A：定时轮询
    this.timer = setInterval(() => this.check(), this.checkInterval);

    // 策略 B：页面重新获得焦点/切回标签页时立即检测（性价比最高时机）
    this.handleVisibility = () => {
      if (document.visibilityState === 'visible') this.check();
    };
    document.addEventListener('visibilitychange', this.handleVisibility);
  }

  stop() {
    clearInterval(this.timer);
    document.removeEventListener('visibilitychange', this.handleVisibility);
  }
}

\`\`\`

### 项目入口调用（Vue 3 / React）

\`\`\`javascript
// main.js
import { AutoUpdater } from './auto-updater';

const updater = new AutoUpdater({
  onUpdate: () => {
    // 可替换为 Element Plus / Ant Design 的 Modal 组件
    if (confirm('系统检测到新版本，是否立即刷新页面以获得最新功能？')) {
      window.location.reload();
    } else {
      // 用户选择稍后，记录 sessionStorage，避免后续轮询继续弹窗扰民
      sessionStorage.setItem('dismiss_update_notice', 'true');
    }
  }
});

updater.start();

// 隐藏防御策略：捕获旧 Chunk 缺失报错，自动强制刷新兜底
window.addEventListener('error', (event) => {
  if (event?.message?.includes('Loading chunk') || event?.message?.includes('Failed to fetch dynamically imported module')) {
    window.location.reload();
  }
}, true);

\`\`\`


### 1. \`version.json\` 里面存的是什么？

它里面通常只放几行最简单的 JSON 文本，包含**版本号**、**构建时间戳**或 **Git Commit ID**。

例如，打包时生成的 \`public/version.json\` 内容如下：

\`\`\`json
{
  "version": "1.2.0",
  "buildTime": 1718000000000,
  "commitId": "a1b2c3d4"
}

\`\`\`

---

### 2. 它明明是文件，为什么能像“接口”一样被请求到？

在 Web 开发中，**“接口”和“静态文件”在 HTTP 协议的底层本质上是一样的**——它们都是浏览器向服务器发起的 HTTP GET 请求，服务器接收到请求后返回一段文本内容。

#### 它是怎么被访问到的？

当你把项目打包（如执行 \`npm run build\`）后，\`version.json\` 会被放在打包产物的根目录（即 \`dist/\` 目录下）。

当你的网站部署到服务器（比如 Nginx）后：

* 访问网站页面：浏览器请求 \`[https://yourdomain.com/](https://yourdomain.com/)\`，Nginx 返回 \`dist/index.html\`
* 访问静态文件：浏览器请求 \`[https://yourdomain.com/version.json](https://yourdomain.com/version.json)\`，Nginx 会在 \`dist/\` 目录下找到这个文件，直接把文件里的 JSON 字符串返回给前端。

因此，你在前端 JS 代码里直接写：

\`\`\`javascript
// 就像请求普通 API 接口一样 fetch 静态文件
fetch('/version.json?t=' + Date.now())
  .then(res => res.json())
  .then(data => {
    console.log('服务器上的最新版本：', data.version);
  });

\`\`\`

浏览器就会收到标准状态码 \`200 OK\`，并拿到 JSON 数据！

---

### 3. 这个文件是怎么自动生成的？

你不需要每次发布都手动去修改这个文件，通常由**打包工具自动生成**：

#### 方式 A：在 Vite 项目中通过简单配置生成（\`vite.config.js\`）

利用 Vite 的自定义插件钩子，在打包时写一个文件到 \`dist\` 目录：

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

// 自定义一个极简生成 version.json 的插件
function createVersionJsonPlugin() {
  return {
    name: 'create-version-json',
    closeBundle() {
      const versionData = {
        version: process.env.npm_package_version || '1.0.0',
        buildTime: Date.now()
      };
      // 打包完成后，自动在 dist 目录生成 version.json
      fs.writeFileSync(
        path.resolve(__dirname, 'dist/version.json'),
        JSON.stringify(versionData, null, 2)
      );
    }
  };
}

export default defineConfig({
  plugins: [createVersionJsonPlugin()]
});

\`\`\`

#### 方式 B：如果你使用插件 \`plugin-web-update-notification\`

这个插件在打包时，也会**自动**在你的根目录下生成一个隐藏的 \`json\` 格式的版本标记文件，并在后台用 \`fetch\` 去请求它，原理完全一样！


## 三、 方案 2：开箱即用 plugin-web-update-notification 插件

如果你使用 **Vite** 或 **Webpack** 脚手架，推荐使用社区成熟插件 \`@plugin-web-update-notification/vite\`。它在构建打包时会自动生成 \`version.json\`，并在后台静默比对，零业务代码侵入。

### 1. 安装依赖

\`\`\`bash
npm install @plugin-web-update-notification/vite -D

\`\`\`

### 2. Vite 配置 (\`vite.config.js\`)

\`\`\`javascript
import { defineConfig } from 'vite';
import { webUpdateNotice } from '@plugin-web-update-notification/vite';

export default defineConfig({
  plugins: [
    webUpdateNotice({
      checkInterval: 5 * 60 * 1000, // 轮询间隔 (ms)，默认 10 分钟
      checkOnWindowFocus: true,     // 窗口恢复焦点时主动检测
      checkImmediately: true,       // 页面加载完成后立即检测

      // 配置 UI Toast 弹窗文案
      notificationProps: {
        title: '📢 系统更新提醒',
        description: '检测到新版本上线，请刷新页面以使用最新功能。',
        buttonText: '立即刷新',
        dismissButtonText: '稍后提醒',
      },
    }),
  ],
});

\`\`\`


## 四、 关键运维配置：必须禁用 \`index.html\` 缓存

**特别注意：** 无论选择哪种检测方案，服务器或 CDN 侧必须对 \`index.html\` 设置**协商缓存或禁用强缓存**！如果浏览器直接强缓存了 \`index.html\`，前端轮询拿到的始终是本地旧文件，检测逻辑将彻底失效。

\`\`\`nginx
# nginx.conf
server {
    listen 80;
    server_name example.com;

    location / {
        try_files $uri $uri/ /index.html;

        # 核心配置：对 html 文件禁用强缓存
        if ($request_filename ~* .*\\.(html)$) {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires 0;
        }
    }

    # 带打包 Hash 的静态资源（js/css）可放心开启长效强缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
\`\`\`

## 五、 方案选型与技术总结

| 维度 | 方案 1：原生 JS Hash 轮询 | 方案 2：\`plugin-web-update-notification\` |
| --- | --- | --- |
| **代码侵入性** | 极低（仅需引入一个 30 行工具类） | 零代码侵入（纯构建插件配置） |
| **UI 自定义** | 完全自由（轻松对接项目中现有 UI 组件库） | 内置 Toast 弹窗（也支持自定义 UI） |
| **构建脚手架限制** | 通用（Vite, Webpack, Rollup 均可） | 主要适配 Vite / Webpack / Umi 等 |
| **工程兜底能力** | 需手写 \`ChunkLoadError\` 监听与体验锁 | 插件内置完整生命周期与提示拦截 |
| **推荐指数** | ⭐⭐⭐⭐（适合有自定义 UI 需求的团队） | ⭐⭐⭐⭐⭐（适合追求开箱即用的工程） |



## 六、 WebSocket 最适合的 5 大场景（当前场景不适合）

WebSocket 的最大优势是**建立一次 TCP 连接后，服务器可以主动向客户端推送数据**，且数据包头极小、延迟极低。

### 1. 实时互动与社交（IM 聊天 / 直播）

* **场景：** 微信 Web 版、飞书/钉钉网页版、直播间弹幕、在线客服。
* **原因：** 消息需要毫秒级送达，且客户端和服务端都在高频发送数据。

### 2. 多人协作与实时看板（在线文档 / 画板）

* **场景：** 腾讯文档、Figma、Kanban 任务看板、协同代码编辑器。
* **原因：** 需要实时同步多个用户的光标位置、输入内容或拖拽状态，保证“所见即所得”。

### 3. 金融与高频数据变化（股票 / 加密货币）

* **场景：** 炒股软件、加密货币交易所（如 Binan/Coinbase）的 K 线图与深度图。
* **原因：** 价格每秒都在剧烈变动，HTTP 轮询会导致大量的 Header 开销和网络拥堵，而 WebSocket 传输效率极高。

### 4. 实时游戏（网页端联机游戏）

* **场景：** Web 端的各种联机对战游戏、棋牌游戏。
* **原因：** 对延迟（RTT）有极高要求，必须持续维持双向低延迟数据流。

### 5. 物联网（IoT）与设备状态监控

* **场景：** 智慧园区、工业大屏、设备实时温度/运行状态监控。
* **原因：** 传感器数据需要实时上报并在大屏上动态渲染。

## 总结：

对于绝大部分企业 Web 系统，采用 **“HTML Hash 轮询 + visibilitychange 页面唤醒 + ChunkLoadError 兜底 + Nginx 禁缓存”** 是目前开发成本最低、用户体验最好、线上最稳健的无感更新提醒实践。
`;export{n as default};
