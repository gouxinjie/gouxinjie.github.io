const n=`# React19 被曝出 RCE 高危漏洞

::: warning 注意

![cve](../images/cve.png)

:::

## 一、事件速览

2025 年 12 月 3 日，React 与 Next.js 官方同步发布安全公告：  
**React Server Components（RSC）实现中存在未经身份验证的远程代码执行漏洞**，编号 **CVE-5-55182**（React 上游）与 **CVE-2025-66478**（Next.js 下游），CVSS 评分直接拉满 **10.0 / 10.0**。

- **利用条件**：任意可访问目标 HTTP 端点的攻击者，**无需登录、无需交互**
- **影响面**：所有开启 RSC 功能且使用受影响版本的站点**默认即受攻击**
- **后果**：任意代码执行、数据泄露、服务接管、横向渗透

## 二、技术拆解：一条 HTTP 请求如何拿到 Shell？

### 1. 根本原因 —— Flight 反序列化缺失校验

RSC 采用自定义「Flight」协议在客户端与服务端之间序列化组件树与 Server Action。  
服务端在重构调用链时，**未对 \`moduleId#exportName\` 做 \`hasOwnProperty\` 校验**，导致攻击者可通过原型链污染访问到 Node.js 内置模块（\`child_process\`、\`vm\` 等）。

\`\`\`js
// 简化漏洞代码
function resolveServerReference(modId, expName) {
  const mod = requireModule(modId);
  // ❌ 缺失 hasOwnProperty 检查
  return mod[expName]; // 可命中 Object.prototype.constructor
}
\`\`\`

### 2. 攻击流程（PoC 已公开）

1. 构造恶意 RSC 载荷，将 \`$ACTION_REF_123\` 表单项指向 \`child_process#execSync\`
2. 发送 POST \`/formaction\`（或其他 Server Action 端点）
3. 服务端解析时沿着原型链拿到 \`execSync\`，拼接攻击者命令并执行
4. 返回结果中可直接带出控制台输出，完成 **RCE → 反弹 Shell / 写后门**

> 已有开源扫描器批量探测互联网资产，**暴露在外网的 Next.js App Router 站点被大规模植入挖矿、后门**。

## 三、受影响版本与生态

| 组件 / 框架                | 受影响版本                                                                        | 安全版本                     |
| -------------------------- | --------------------------------------------------------------------------------- | ---------------------------- |
| react-server-dom-webpack   | 19.0.0 ‑ 19.2.0                                                                   | ≥ 19.0.1 / 19.1.2 / 19.2.1   |
| react-server-dom-parcel    | 同上                                                                              | 同上                         |
| react-server-dom-turbopack | 同上                                                                              | 同上                         |
| Next.js App Router         | 14.3.0-canary.77 ~ 15.0.4<br>15.1.0 ~ 15.1.8<br>15.2.0 ~ 15.2.5 …（详见官方公告） | ≥ 15.0.5 / 15.1.9 / 15.2.6 … |
| 衍生框架                   | LobeChat、Dify、Waku、Redwood、@vitejs/plugin-rsc …                               | 请等待上游更新               |

> 仅使用 **Pages Router** 或 **纯客户端渲染** 的应用**不在影响范围**。

## 四、修复与缓解

### 官方修复

\`react\` 官网解决方案：https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components

1. **立即升级**至安全版本
   \`\`\`bash
   # npm
   npm i react-server-dom-webpack@19.2.1 next@15.2.6
   # pnpm
   pnpm up react-server-dom-webpack@19.2.1 next@15.2.6
   \`\`\`
2. 重新构建并走完整 CI/CD，**确认 lock 文件**已刷新。

### 🆘 临时缓解（无法立即升级时）

- **WAF / API 网关**规则：拦截请求体包含 \`$ACTION_REF\`、\`__proto__\`、\`constructor\` 等关键字
- **反向代理层**关闭对 \`/_next/*\` 或 \`/formaction\` 的公网访问
- **容器沙箱**：给 Node 进程加 \`seccomp\` / \`AppArmor\`，禁止 \`exec\` 族系统调用
- **运行时钩子**：在 \`require()\` 层面对 \`child_process\`、\`vm\` 等模块做白名单拦截

## 五、自查脚本

\`\`\`bash
# 1. 检查是否引用受影响包
npm ls react-server-dom-webpack react-server-dom-parcel react-server-dom-turbopack
# 2. 检查 Next.js 版本
npm list next
# 3. 确认是否存在 Server Action 端点（搜索文件）
grep -r "use server" .
\`\`\`

若版本在受影响范围且存在 Server Action，**即为高危**，请立即执行升级。

## 参考与延伸阅读

知乎: https://zhuanlan.zhihu.com/p/1980296882984067851  
阿里云: https://www.aliyun.com/notice/117771  
segmentfault 知否: https://segmentfault.com/a/1190000047451749  
CSDN 博客: https://blog.csdn.net/lightningyang/article/details/155613936  
博客园: https://www.cnblogs.com/yupi/p/19320774  
CN-SEC 中文网: https://cn-sec.com/archives/4757079.html
`;export{n as default};
