const n=`# 浏览器/微信拉起钉钉微应用免登实战

> 用户从微信点开链接，怎么才能"一键拉起钉钉"并完成企业身份免登？微信里为什么点 \`dingtalk://\` 没反应？从 scheme 唤起原理，到单一域名入口的三态分流落地，一次讲透。


## 一、背景与诉求

「复星员工公益」是一个运行在钉钉内的 H5 微应用，核心认证链路是**钉钉免登**：

1. 在钉钉内打开微应用，调用 JSAPI \`runtime.permission.requestAuthCode\` 获取临时授权码；
2. 拿授权码调后端 \`/getDdUserInfo?authcode=xxx\` 换取用户信息与 JWT Token；
3. Token 落地到 \`localStorage\`，后续接口凭 Token 鉴权。

这套链路在「钉钉内打开」时丝滑无感，但团队遇到了一个新的分发场景：**运营把活动链接分享到微信，员工在微信里点开，期望也能用企业（钉钉）身份快捷登录。**

于是需求收敛成一句话：

> 能不能在微信里"拉起钉钉"完成快捷授权登录？

进而又演进成更硬的要求：**只用一个域名入口**（如 \`esg-web.uat.example.com\`），无论用户在钉钉、微信还是普通浏览器打开，都能自动走到正确路径，不要出现第二个链接。

本文记录我们围绕这个诉求的方案设计、技术原理与落地细节。

**最终实现情况：**

微信中点击「复星员工公益」链接，引导用户在浏览器打开：
![](../../images/dingtalk-1.png)

然后在浏览器中调起钉钉：
![](../../images/dingtalk-2.png)


## 二、为什么微信里拉不起钉钉

这是整件事的第一个认知门槛：**唤起 App 是系统原生能力，但微信在自己容器里把这扇门关上了。**

### 2.1 唤起 App 的本质：URL Scheme

普通浏览器唤起 App，靠的是**自定义 URL Scheme**：

- **iOS**：WebView 遇到 \`dingtalk://xxx\`，系统走 \`UIApplication.openURL:\`，查找谁注册了 \`dingtalk\` 这个 scheme，找到钉钉就拉起；
- **Android**：同理走隐式 Intent，按 \`<intent-filter>\` 中声明了 \`dingtalk\` 的 App 去匹配拉起。

这一步是操作系统层面的原生能力，所以 Safari、Chrome、系统浏览器都能正常唤起钉钉。

### 2.2 微信的拦截

微信内置浏览器不是原生 Safari/Chrome，而是微信**自研/定制的 WebView**，并在导航层做了拦截：

- iOS 端是定制 \`WKWebView\`，微信在 \`WKNavigationDelegate\` 的 \`decidePolicyForNavigationAction\` 回调里，**对非 \`http/https\` 的 scheme 直接 \`cancel\`**，不转发给系统 \`openURL\`；
- Android 端是腾讯 X5 内核，同样在导航层把 \`dingtalk://\` 这类 scheme 拦下，不触发系统 Intent 分发。

同时微信还封堵了常见绕行手段：

| 手段 | 结果 |
|------|------|
| \`location.href = 'dingtalk://...'\` | 被拦截 |
| \`<a href="dingtalk://...">\` 点击 | 被拦截 |
| \`window.open('dingtalk://...')\` | 被拦截 |
| iframe 里塞 scheme | 被拦截 |

### 2.3 根因与结论

根因是**生态闭环**：微信是超级流量入口，若放开任意 scheme 唤起，等于允许任何 H5 把用户导流出微信。所以微信用「白名单 + 开放标签」两种受控方式放行，而钉钉不可能接入微信的开放标签体系。

**结论：**

- 微信内：连钉钉 App 都唤不起，更别说直接拉起「寄生于钉钉 App 内」的微应用；
- 普通浏览器：可以一步唤起钉钉并直达指定微应用；
- 因此，跨端方案必须绕开微信 WebView，落到「引导在浏览器打开」或「浏览器直接唤起」两条路径上。


## 三、钉钉唤起协议解析

钉钉开放了以 \`dingtalk://\` 为前缀的**统一跳转协议**，常用两种：

### 3.1 打开指定微应用（需 CorpId + AgentId）

\`\`\`
dingtalk://dingtalkclient/action/openapp?corpid=<企业ID>&container_type=work_platform&app_id=0_<应用ID>&redirect_type=jump&redirect_url=<URL编码后的页面地址>
\`\`\`

其中 \`app_id\` 的格式为 \`0_\` + AgentId，\`redirect_url\` 是钉钉启动后要打开的 H5 地址，必须 URL 编码。

### 3.2 打开普通链接（降级方案）

\`\`\`
dingtalk://dingtalkclient/page/link?url=<URL编码后的链接>
\`\`\`

当没有 CorpId/AgentId（或不确定微应用标识）时，用这个更通用的协议，钉钉启动后在内部打开该链接。

> 协议格式随钉钉版本可能有差异，**以钉钉开放平台后台/官方文档实际下发的 scheme 为准**，前端只需把它抽象成可配置的函数，避免写死。


## 四、方案设计：单一域名入口 + 三态分流

### 4.1 整体流程

核心思路：**把"唤起钉钉"的能力整合进应用根入口 \`/\`（Entry 页），全场景只保留一个域名。** 按运行环境三态分流：

| 环境 | 判断依据 | 行为 |
|------|----------|------|
| 钉钉内 | UA 含 \`DingTalk\` | 走原有 JSAPI 免登 → 正常进入应用 |
| 微信内 | UA 含 \`MicroMessenger\` | 展示「请用浏览器打开」引导遮罩 |
| 普通浏览器 | 以上都不是 | 自动/手动唤起钉钉微应用，未安装则下载兜底 |

闭环的关键点：**唤起钉钉时，\`redirect_url\` 指向当前域名根路径**。用户点「打开钉钉」→ 钉钉启动 → 钉钉内重新打开 \`https://esg-web.uat.example.com/\` → 此时已是钉钉环境 → 自动走免登进入应用。整个链路自洽，用户无感知。

### 4.2 启动时的分流时机

原应用的认证在 \`main.ts\` 的 \`bootstrap\` 里统一执行。若不做分流，浏览器环境（无 authcode）会走到 \`/getDdUserInfo\` 失败并误入「登录失败页」。

因此在认证前先做环境判断：**非钉钉环境跳过认证，直接停留在 \`/\`，交给 Entry 页渲染引导。**


## 五、核心实现

### 5.1 环境检测与 scheme 构建

在 \`src/utils/dingtalk.ts\` 中新增两个工具函数：

\`\`\`ts
/** 是否在微信内置浏览器中运行 */
export const isWeChatEnv = (): boolean => /MicroMessenger/i.test(navigator.userAgent)

/**
 * 构建唤起钉钉客户端并打开微应用的 URL Scheme
 * @param targetUrl - 钉钉打开后跳转的目标 H5 地址，默认当前域名根路径
 */
export const buildDingTalkLaunchScheme = (targetUrl?: string): string => {
  const corpId = import.meta.env.VITE_DINGTALK_CORP_ID || ''
  const agentId = import.meta.env.VITE_DINGTALK_AGENT_ID || ''
  const url = targetUrl || \`\${window.location.origin}/\`

  if (corpId && agentId) {
    return \`dingtalk://dingtalkclient/action/openapp?corpid=\${corpId}&container_type=work_platform&app_id=0_\${agentId}&redirect_type=jump&redirect_url=\${encodeURIComponent(url)}\`
  }
  return \`dingtalk://dingtalkclient/page/link?url=\${encodeURIComponent(url)}\`
}
\`\`\`

**关键点**：CorpId/AgentId 来自环境变量，\`redirect_url\` 动态取 \`window.location.origin\`，这样 **UAT/PRD 各自构建后自动适配各自域名，无需写死**。

### 5.2 入口页三态分流

\`src/pages/Entry/index.vue\` 改造为三态组件，模板按环境条件渲染：

\`\`\`vue
<template>
  <!-- 钉钉内：认证加载态 -->
  <div v-if="env.isDingTalk" class="entry">
    <van-loading type="spinner" color="#FF6A00" size="40px" />
    <span class="entry__text">加载中...</span>
  </div>

  <!-- 微信内：引导在浏览器中打开 -->
  <div v-else-if="isWeChat" class="entry-wechat">
    <!-- 全屏遮罩：提示点右上角「···」→「在浏览器打开」 -->
  </div>

  <!-- 普通浏览器：唤起钉钉微应用 -->
  <div v-else class="entry-launch">
    <!-- 钉钉官方飞鸟图标 + 打开钉钉按钮 + 下载兜底 -->
  </div>
</template>
\`\`\`

### 5.3 启动时环境分流

\`src/main.ts\` 的 \`bootstrap\` 中，认证前按环境分流：

\`\`\`ts
const dingTalkEnv = detectDingTalkEnv()
if (dingTalkEnv.isDingTalk) {
  await appStore.initAppAuth(forceReAuth)   // 钉钉：走免登
} else {
  appStore.markAuthReady()                  // 非钉钉：跳过认证，停在 / 由 Entry 接管
}

await router.isReady()

if (dingTalkEnv.isDingTalk) {
  // 钉钉环境才根据认证结果跳 /home 或 /login-failure
  // ...
}
\`\`\`

同时 \`src/stores/app.ts\` 新增 \`markAuthReady()\`，让非钉钉环境下 \`authReady\` 置为 \`true\`：

\`\`\`ts
const markAuthReady = () => {
  authReady.value = true
}
\`\`\`

> 这一步不能省：\`App.vue\` 用 \`v-if="!authReady"\` 展示全局 loading，若非钉钉环境不标记就绪，Entry 引导页永远渲染不出来。

### 5.4 唤起与超时兜底

Entry 页的唤起逻辑分两层：

\`\`\`ts
/** 静默唤起（iframe，Android 有效；iOS 需用户手势而无效但无害） */
const silentLaunch = (scheme: string): void => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = scheme
  document.body.appendChild(iframe)
  window.setTimeout(() => iframe.remove(), 2000)
}

/** 点击唤起（用户手势触发，iOS/Android 均可靠） */
const handleLaunch = (): void => {
  const scheme = buildDingTalkLaunchScheme()
  if (!scheme) return

  // 重复点击时先清掉上一次的兜底定时器，避免误弹下载按钮
  if (downloadTimer) {
    clearTimeout(downloadTimer)
    downloadTimer = null
  }

  statusText.value = '正在打开钉钉...'
  window.location.href = scheme

  // 超时兜底：3 秒后页面仍可见 → 判定未安装钉钉，展示下载按钮
  downloadTimer = window.setTimeout(() => {
    if (!document.hidden) {
      showDownload.value = true
      statusText.value = '未检测到钉钉客户端，请先下载安装'
    }
  }, LAUNCH_TIMEOUT)
}
\`\`\`

并监听 \`visibilitychange\`：页面进入后台（\`document.hidden\`）即代表钉钉被成功唤起，清除兜底定时器。

**为什么「自动 + 手动」双保险**：iOS Safari 对 scheme 跳转要求用户手势，纯自动唤起会被系统拦截。所以加载后先 \`silentLaunch\` 静默尝试（Android 生效），同时保留大按钮让用户点击（iOS 走这条路）。


## 六、多环境适配

UAT 与 PRD 是两套独立的钉钉应用，**CorpId/AgentId 各不相同**：

| 环境 | 前端域名 | CorpId | AgentId |
|------|----------|--------|---------|
| UAT | \`esg-web.uat.example.com\` | \`ding-uat-corp-id\` | \`uat-agent-id\` |
| PRD | \`esg-web.example.com\` | \`ding-prd-corp-id\` | \`prd-agent-id\` |

**Vue 入口（主流程）天然适配**：CorpId/AgentId 走 \`import.meta.env\`（\`build:uat\` 注入 UAT 值、\`build:prd\` 注入 PRD 值），\`redirect_url\` 走 \`window.location.origin\`，两套环境零额外配置。

**静态 HTML 入口（\`public/open-dingtalk.html\`）无法读环境变量**：\`public/\` 目录文件是原样拷贝，不经过 Vite 的环境变量替换，\`import.meta.env\` 在纯 HTML 里无效。因此只能按域名做映射：

\`\`\`js
const ENV_CONFIG = {
  'esg-web.uat.example.com': { corpId: 'ding-uat-corp-id', agentId: 'uat-agent-id' },
  'esg-web.example.com':      { corpId: 'ding-prd-corp-id', agentId: 'prd-agent-id' },
}
const ACTIVE_CONFIG = ENV_CONFIG[window.location.hostname] || ENV_CONFIG['esg-web.uat.example.com']
\`\`\`


## 七、踩坑与注意事项

### 7.1 坑一：跳过认证会卡在全局 loading

非钉钉环境若只跳过 \`initAppAuth\` 而不标记 \`authReady\`，\`App.vue\` 的全局 loading 会一直显示，Entry 引导页根本渲染不出来。**必须配套 \`markAuthReady()\`。**

### 7.2 坑二：iOS 自动唤起失效

iOS Safari 拦截「非用户手势触发」的 scheme 跳转，纯 \`iframe\`/\`location.href\` 自动唤起会失效甚至弹错误框。**必须有按钮供用户点击触发。**

### 7.3 坑三：未安装钉钉时的判定

浏览器无法直接获知 App 是否已安装，只能靠**超时 + 页面可见性**近似判断：唤起成功则页面进入后台（\`document.hidden === true\`）；超时后页面仍可见，大概率是未安装，此时展示下载按钮。

### 7.4 坑四：静态文件读不到环境变量

\`public/\` 目录文件不参与 Vite 编译，\`import.meta.env\` 无效。**多环境配置要么走源码（环境变量），要么在静态文件里按域名硬编码映射**，二者不能混用。

### 7.5 坑五：图标还原

最初手绘的飞鸟 path 严重不像钉钉 logo。后来换成 Remix Icon 官方 \`dingding-fill\` 图标（\`viewBox 24x24\`，蓝色圆 + 白色飞鸟镂空），并去掉多余的背景渐变，改用 \`filter: drop-shadow\` 让阴影跟随圆形轮廓，才达到还原效果。

### 7.6 坑六：非钉钉环境直达子页面

当前方案只处理「从根入口 \`/\` 进入」的分流。若用户浏览器直接打开 \`/home\` 等子页面，仍会因 \`requiresAuth && 未登录\` 被守卫重定向到登录失败页，而非唤起引导。若需覆盖此场景，可在路由守卫中补充「非钉钉环境统一重定向到 \`/\`」的逻辑。


## 八、总结

「微信里拉起钉钉」本质是一道**平台边界**题：唤起 App 是系统能力，微信人为关掉了这扇门，所以方案必须围绕「绕开微信 WebView」展开。

落地要点：

| 层次 | 手段 |
|------|------|
| 原理认知 | 微信拦截非 http/https scheme；普通浏览器可唤起；微应用寄生于钉钉 App 内 |
| 协议层 | \`openapp\`（打开微应用）优先，\`page/link\`（打开链接）降级 |
| 分流层 | 入口页三态：钉钉免登 / 微信引导浏览器打开 / 浏览器唤起 |
| 启动层 | 非钉钉环境跳过认证 + \`markAuthReady\`，避免误入登录失败页 |
| 体验层 | 自动唤起 + 按钮兜底 + 超时下载兜底 |
| 配置层 | 环境变量适配多环境，静态文件按域名映射兜底 |

一句话概括这套方案：**单一域名入口 + 三态分流 + 钉钉 scheme 唤起闭环**——无论用户从哪个容器进来，最终都被引导到钉钉内完成企业身份免登，全程不需要第二个链接。

---

*作者：gouxinjie · 适用技术栈：Vue 3 + Vite 6 + TypeScript + 钉钉 JSAPI*
`;export{n as default};
