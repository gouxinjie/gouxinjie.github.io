# Token 无感刷新方案：双 Token 如何做到「用户无感知」

[[toc]]

## 一、为什么需要 Token 刷新

登录态怎么维持？最朴素的做法：登录成功后服务端签发一个 token，前端每次请求带上。问题来了——**这个 token 有效期怎么设？**

| 方案 | 体验 | 安全 | 评价 |
|------|------|------|------|
| 超长 token（如 7 天） | ✅ 用户长时间不用重新登录 | ❌ 泄露后影响窗口大，被盗用风险高 | 简单但不安全 |
| 超短 token（如 5 分钟） | ❌ 每 5 分钟要重新登录，体验极差 | ✅ 泄露后影响窗口小 | 安全但难用 |
| 折中：1~2 小时 | 一般 | 一般 | 凑合，但每隔 1~2 小时跳登录框依然难受 |

> 核心矛盾：想体验好（长 token），又想要安全（短 token），单 token 解决不了。

## 二、什么是双 Token

答案是 **双 Token（Dual Token）**：

```text
┌────────────────────────┐    ┌────────────────────────────┐
│     Access Token        │    │       Refresh Token         │
├────────────────────────┤    ├────────────────────────────┤
│ 有效期：短（如 10~30 min）│    │ 有效期：长（如 7~30 天）    │
│ 用途：访问业务接口       │    │ 用途：换取新的 Access        │
│ 存储：内存 / sessionStorage│    │ 存储：HttpOnly Cookie（推荐）│
└────────────────────────┘    └────────────────────────────┘
```

两者分工清晰：

- **Access Token**：每次业务请求都带，**频繁使用**，权限边界。
- **Refresh Token**：**只在 Access 过期时**才用一次，去换新 Access，权限很大（能换 access），所以必须严管。

> 口诀：Access Token 是**门票**（常用），Refresh Token 是**钥匙**（用一次少一次风险）。

## 三、双 Token 完整流程

### 1. 登录

```text
1. 用户名密码登录
2. 服务端验证 → 返回:
   - access_token (10 分钟有效)
   - refresh_token (7 天有效，建议 Set-Cookie HttpOnly)
3. 前端把 access_token 存起来（内存或 sessionStorage）
```

### 2. 正常业务请求

```text
前端请求 → Authorization: Bearer access_token → 服务端校验 → 返回数据
```

### 3. Access 过期

```text
前端请求 → 服务端发现 access_token 过期 → 返回 401
前端拦截器：检测到 401 → 调用 /refresh 接口（带 refresh_token）
         → 服务端校验 refresh_token：
              - 有效 → 返回新 access_token（可选：新 refresh_token）
              - 无效 → 返回 401（前端跳登录）
         → 前端用新 access_token 重发原请求 → 用户无感知
```

### 4. Refresh 也过期

```text
refresh_token 也失效 → 跳登录页 → 用户重新登录
```

> 关键：Access 过期重试是**用户无感知的**；Refresh 过期才会**跳出登录框**。日常体验就是「一直登录着」。

## 四、关键问题

### 1. 并发请求的 Token 刷新（核心难点）

实战中有个**经典问题**：

> Access 快过期时，前端同时发了 5 个业务请求，结果 5 个请求都拿到 401。
> 如果这 5 个请求**各自**去调 `/refresh`，会有 5 次刷新 ——
> - **轻则**：服务端压力爆炸。
> - **重则**：refresh_token 被**轮换（rotation）** 机制作废，其它请求的旧 refresh_token 失效，全员跳登录。

> 解决思路：同一时刻只允许**一个**刷新请求在跑，其它 401 请求**排队等新 token**，再重发。

```text
       业务请求 A ──┐
                    ├──► 401 ──► 加入 waitQueue ──► 等新 token ──► 重发
       业务请求 B ──┤
                    ├──► 401 ──► 加入 waitQueue ──► 等新 token ──► 重发
       业务请求 C ──┘
                          ▲
                          │ 只触发一次 /refresh
                          ▼
                    拿到新 token ──► 通知 waitQueue
                          │
                          ▼
                    队列里的请求用新 token 重发
```

具体实现见下面「代码实现」。

### 2. Refresh Token 轮换（Rotation）

为了**降低 Refresh Token 泄露后的可滥用窗口**，很多方案引入「**轮换**」：**每次用 Refresh 换 Access 时，同时下发一个新的 Refresh Token，旧的立即作废**。

- 优点：即便 Refresh 被盗，盗用者换出新 token 后，原持有者再用旧 Refresh 会失败（不一致即说明泄露）。
- 代价：并发控制**必须做对**，否则就是上面说的「全员跳登录」。

### 3. Refresh Token 撤销 / 黑名单

如果用户主动「退出登录」、「修改密码」、「检测到异常」，需要**主动撤销** Refresh Token。

```text
登出  → 服务端把 refresh_token 加入黑名单（或从白名单删除）
改密  → 同上
异常  → 同上 + 强制下线所有设备
```

### 4. Refresh 接口要快、要稳

`/refresh` 是**登录态的生命线**，如果它慢、不稳定，整个 App 的体验就崩。

- 设独立的短超时（5s 内）。
- 不要让 `/refresh` 走与业务接口相同的限流。
- 服务端要做缓存（避免每次都查 DB）。

## 五、前端实现细节（基于 Axios）

下面给一套**可直接拷贝**的 Axios 拦截器方案，覆盖**并发控制 + 自动重发**两个核心点。

### 基础版

```js
import axios from 'axios';

let accessToken = '';
let refreshToken = '';

export const http = axios.create({ baseURL: '/api' });

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    try {
      // 调刷新接口（这里假设 refresh_token 在 HttpOnly Cookie 里）
      const { data } = await axios.post('/api/refresh', null, {
        withCredentials: true,
      });
      accessToken = data.access_token;

      // 用新 token 重发原请求
      config._retry = true;
      config.headers.Authorization = `Bearer ${accessToken}`;
      return http.request(config);
    } catch (e) {
      // refresh 失败，跳登录
      window.location.href = '/login';
      return Promise.reject(e);
    }
  },
);
```

### 进阶版：并发控制（核心）

```js
import axios from 'axios';

let accessToken = '';
let isRefreshing = false;        // 是否正在刷新
let waitQueue = [];              // 等新 token 的回调队列

export const http = axios.create({ baseURL: '/api' });

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    // 把请求挂到队列里，等新 token
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitQueue.push((newToken) => {
          config._retry = true;
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(http.request(config));
        });
      });
    }

    // 第一个 401 真正去刷新
    isRefreshing = true;
    config._retry = true;

    try {
      const { data } = await axios.post('/api/refresh', null, {
        withCredentials: true,
      });
      accessToken = data.access_token;

      // 通知队列里所有等待的请求
      waitQueue.forEach((cb) => cb(accessToken));
      waitQueue = [];

      // 当前请求也用新 token 重发
      config.headers.Authorization = `Bearer ${accessToken}`;
      return http.request(config);
    } catch (e) {
      waitQueue.forEach((cb) => cb(null));
      waitQueue = [];
      window.location.href = '/login';
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);
```

> 口诀：一个 `isRefreshing` 锁 + 一个 `waitQueue` 队列，就把「并发刷新」问题压平了。

## 六、Refresh Token 的存储

Refresh Token **权限很大**（能换 Access），存哪里很重要。

| 存储方式 | 安全 | 易用 | 评价 |
|---------|------|------|------|
| **HttpOnly Cookie** | ✅ 防 XSS | ❌ CSRF 风险 | **推荐**（配合 SameSite=Lax/Strict + CSRF Token）|
| localStorage | ❌ 任何 XSS 都能读 | ✅ 跨标签页易用 | 不推荐 |
| sessionStorage | ❌ 一样能被 XSS 读 | 关标签页就丢 | 不推荐 |
| **内存** | ✅ 不落盘 | ❌ 刷新页面就丢 | 适合 Access，**不适合** Refresh |

> 生产推荐：Refresh Token 走 **HttpOnly + Secure + SameSite=Lax** 的 Cookie，前端 JS 读不到。
> 配合 **CSRF Token / Double Submit Cookie** 防 CSRF，**取一个安全甜点**。

## 七、实战建议

### 1. 不要把 Access Token 长期存 localStorage

- ❌ 一旦 XSS，整个 token 泄露。
- ✅ 建议存**内存**（刷新页面就丢），首次加载自动用 Refresh 换 Access，体验几乎无感。

### 2. 服务端要支持**滑动过期**

```text
用户活跃 → Refresh 续期（如每次刷新顺便续 7 天）
用户不活跃 → Refresh 自然过期
```

比「固定 7 天到期」友好得多。

### 3. 多标签页登录态同步

每个标签页都有独立的内存 Access Token。监听 `storage` 事件 / `BroadcastChannel`：

```js
window.addEventListener('storage', (e) => {
  if (e.key === 'logout') window.location.href = '/login';
});
```

### 4. 接口超时合理设置

- 业务接口：10~30s。
- **`/refresh` 接口：5s 以内**，超时就跳登录。

### 5. 调试排障

打开 DevTools，看：

- 401 出现频率（太高 → access 有效期太短）。
- 是否有重复 `/refresh` 调用（多个 → 并发锁没做对）。
- 刷新成功后的请求是否带新 token（没带 → 重发逻辑写错）。

## 八、常见坑

| 坑 | 现象 | 解决 |
|----|------|------|
| **并发 401 触发多次刷新** | `/refresh` 被打爆 | 加 `isRefreshing` 锁 + `waitQueue` |
| **Refresh 用 localStorage 存** | XSS 一打就泄露 | 改 HttpOnly Cookie |
| **前端轮询 / 长连接挂死** | Token 过期但定时器没续 | 把鉴权放在 axios 拦截器统一管 |
| **登出没清 Refresh** | 别人还能换 Access | 登出要调 `/logout`，服务端把 Refresh 加黑名单 |
| **同一用户多设备互踢** | 业务上「禁止多端登录」 | 服务端维护 Refresh 与设备的映射，新登录失效旧 Refresh |

## 九、总结

- **双 Token = Access（短，门票）+ Refresh（长，钥匙）**，体验与安全的折中。
- **核心难点**是「并发 401 的刷新控制」：`isRefreshing` 锁 + `waitQueue` 队列两件套压平。
- **Refresh Token 存 HttpOnly Cookie**（配 SameSite + CSRF 防护），不要存 localStorage。
- **服务端要配合**：Refresh 轮换、撤销、滑动过期、黑名单，一样都不能少。
- **前端配合**：拦截器统一处理 401、并发锁、多标签页同步、超时与登出跳转。

一句话：**双 Token 的本质，是把「长会话」拆成「短门票 + 偶尔续费」，用 Refresh 续期换体验，用短 Access 兜安全——再把并发控制做好，整个方案才完整。**