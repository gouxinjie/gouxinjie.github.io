const n=`# 获取本地时区和公网IP

[[toc]]

在日常的前端开发或业务需求中，我们经常会遇到"根据用户所在时区展示本地时间"、"限制特定 IP 访问"或"进行风控设备指纹采集"等场景。

你可能会好奇：**作为一个仅在客户端沙箱中运行的浏览器，JavaScript 到底能拿到我们电脑的哪些底层网络与环境数据？当开启科学上网（VPN）时，前端又能探测到什么？**

本文将结合一段经过实战检验、兼顾国内外网络环境的 HTML/JS 脚本，深度剖析浏览器获取客户端环境信息的底层逻辑与网络机制。

## 一、核心原理剖析

### 1. 时间与时区：原生 API 的"直通车"

JavaScript 提供了原生的 \`Intl\` 国际化 API 以及 \`Date\` 对象，可以极低成本地直接读取宿主操作系统（用户电脑）的系统时间和时区设置。

- **本地时间**：\`new Date().toLocaleString()\` 读取系统当前时钟。
- **IANA 时区标识**：\`Intl.DateTimeFormat().resolvedOptions().timeZone\`（如 \`Asia/Shanghai\` 或 \`America/New_York\`）。
- **UTC 偏移量**：\`new Date().getTimezoneOffset()\` 可以精准拿到当前时区相对 UTC 的分钟差值。

### 2. 公网 IP vs 内网 IP：浏览器拿不到什么？

很多开发者容易混淆 \`ipconfig\` 输出的 IP 和 JavaScript 查到的 IP：

- **内网 IP（如 \`10.x.x.x\` / \`192.168.x.x\`）**：这是你电脑在局域网/Wi-Fi 下的私有地址。受现代浏览器安全策略（如 WebRTC 隐私遮蔽）限制，前端已经**无法轻易直接静态获取**真实的局域网网卡 IP。
- **出口公网 IP（Egress IP）**：这是数据包经过路由器 NAT（网络地址转换）或 VPN 代理节点后，向外网展示的"身份卡"。前端无法通过纯原生语法获取，但可以通过**向外网发送 HTTP 请求，由服务器解析 Header 并返回**。

## 二、兼顾国内外网络环境的完整源码

![](../images/ip.png)

在实际开发中，如果直接请求国外的 IP 接口（如 \`ipify\`），关闭 VPN 后可能因为 GFW 阻断导致请求超时；而如果使用部分传统的国内 JSONP 接口（如搜狐 \`pv.sohu.com\`），又会因为浏览器的 CORS（跨域）限制或防盗链策略导致直接返回本地回环地址 \`127.0.0.1\`。

为了解决这一痛点，以下代码采用了 **\`Promise.any()\` 多 API 竞速机制**：同时请求支持 CORS 的国内主流 CDN 侧 IP 接口与海外 API，哪个先响应就采用哪个，自动适配开启/关闭 VPN 的不同场景。

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>客户端环境与 IP 检测</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f4f6f8; padding: 40px 20px; }
    .card { max-width: 500px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    h2 { margin-top: 0; color: #1a1a1a; font-size: 20px; border-bottom: 2px solid #eee; padding-bottom: 12px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px; }
    .label { color: #666; font-weight: 500; }
    .value { font-family: monospace; font-weight: 600; color: #0f172a; word-break: break-all; }
    .loading { color: #94a3b8; font-style: italic; }
  </style>
</head>
<body>

<div class="card">
  <h2>客户端环境检测结果</h2>
  <div class="row">
    <span class="label">当前本地时间:</span>
    <span class="value" id="localTime">-</span>
  </div>
  <div class="row">
    <span class="label">IANA 时区标识:</span>
    <span class="value" id="timeZone">-</span>
  </div>
  <div class="row">
    <span class="label">UTC 时间偏移:</span>
    <span class="value" id="tzOffset">-</span>
  </div>
  <div class="row">
    <span class="label">出口公网 IP:</span>
    <span class="value loading" id="publicIp">正在检测 IP...</span>
  </div>
</div>

<script>
  // 1. 获取本地时间与时区
  const now = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMinutes = now.getTimezoneOffset();
  const offsetHours = -offsetMinutes / 60;

  document.getElementById('localTime').textContent = now.toLocaleString();
  document.getElementById('timeZone').textContent = timeZone;
  document.getElementById('tzOffset').textContent = \`UTC\${offsetHours >= 0 ? '+' : ''}\${offsetHours} (\${offsetMinutes} min)\`;

  // 2. 兼顾国内外网络的高可用 IP 竞速提取
  const fetchIpProviders = [
    // 方案 1: Bilibili 官方 CDN 接口（国内直连极速，无 CORS 限制）
    async () => {
      const res = await fetch('https://api.bilibili.com/x/web-interface/zone', { cache: 'no-cache' });
      const data = await res.json();
      return data.data.addr;
    },
    // 方案 2: 网易开放接口（国内直连稳定）
    async () => {
      const res = await fetch('https://paimon.163.com/api/v1/ip', { cache: 'no-cache' });
      const data = await res.json();
      return data.data.ip;
    },
    // 方案 3: IP.SB（海外或开启 VPN 节点时极稳）
    async () => {
      const res = await fetch('https://api.ip.sb/jsonip', { cache: 'no-cache' });
      const data = await res.json();
      return data.ip;
    }
  ];

  async function getClientIp() {
    try {
      // Promise.any 挑选最快返回且成功的接口，自动忽略因网络阻断报错的 API
      const ip = await Promise.any(fetchIpProviders.map(fn => fn()));
      const ipElem = document.getElementById('publicIp');
      ipElem.textContent = ip;
      ipElem.classList.remove('loading');
    } catch (err) {
      const ipElem = document.getElementById('publicIp');
      ipElem.textContent = '获取失败 (网络阻断)';
      ipElem.style.color = '#ef4444';
    }
  }

  getClientIp();
<\/script>

</body>
</html>
\`\`\`

## 三、踩坑总结与思考

在测试上述代码的过程中，我们可以观察到几个非常有趣的网络现象：

### 1. VPN 开关的真实影响

- **开启代理**：脚本获取到的 IP 会变成代理节点的机房 IP（例如荷兰、日本等海外 IP）。
- **关闭代理**：脚本获取到的则是运营商（如中国电信/移动/联通）分配给本地宽带的真实出口公网 IP。

### 2. \`127.0.0.1\` 坑点

部分传统第三方 IP 接口（如某些 JSONP 接口）为了防盗链或控制成本，拒绝了直接在本地 \`file://\` 协议或未授权域名下的请求，会直接返回回环地址。**生产环境中推荐优先使用开放 CORS 的主流平台 CDN 接口或自己搭建微服务接口**。

### 3. 安全与隐私提示

时区与时间依赖用户本地系统配置，用户可以通过修改系统时间或安装浏览器插件伪装；而公网 IP 则可以通过代理网络随意切换。在做关键业务校验（如防刷、反作弊）时，前端数据仅能作为参考，核心逻辑仍需在服务端完成校验。
`;export{n as default};
