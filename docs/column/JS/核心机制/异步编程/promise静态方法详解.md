# Promise 静态方法详解与实战场景

[[toc]]

![](../../images/promise.jpg)

在 JavaScript 异步编程中，`Promise` 提供了一组强大的**静态方法**，用于统一处理单个或多个 Promise 的结果。掌握这些方法，能让并发控制、容错处理和结果聚合变得更加清晰高效。

本文将重点讲解核心静态方法的用法与典型使用场景（同步与异步的基础概念此处不做展开）。



## 一、核心并发控制方法一览

| 方法 | 成功条件 | 失败条件 | 返回值 | 核心特点 |
|------|----------|----------|--------|----------|
| `Promise.all` | 全部成功 | 任意一个失败（立即失败） | 成功结果数组（按原顺序） | 全有或全无 |
| `Promise.allSettled` | 全部结束 | 永不失败 | 结果对象数组 | 收集所有结果 |
| `Promise.race` | 第一个结束 | 第一个结束若失败则失败 | 第一个结束的结果 | 竞速 |
| `Promise.any` | 第一个成功 | 全部失败（AggregateError） | 第一个成功的结果 | 择优录取 |


## 二、详细讲解与使用场景

### 1. Promise.all —— 全员通过制

**行为**：所有 Promise 都成功时，返回结果数组；任意一个失败，立即整体失败。

**典型场景**：
- 多个接口必须全部成功才能继续（用户信息 + 权限 + 配置）
- 需要保证数据一致性的并行请求
- 批量并行预加载首屏资源（首屏所需图片、字体、配置必须全部就绪再渲染，避免缺图缺样式）
- 批量并行落库 / 提交，任一失败则整体回滚（事务类操作）
- 并行请求多个接口后，按原顺序一次性填充表格 / 详情页

**示例**：
```js
async function loadPageData() {
  try {
    const [user, posts, settings] = await Promise.all([
      fetchUser(),
      fetchPosts(),
      fetchSettings()
    ]);
    render(user, posts, settings);
  } catch (err) {
    // 任意一个失败都会进入这里
    showError(err);
  }
}
```

**进阶示例（表单批量提交，任一失败整体回滚）**：
```js
async function submitOrder() {
  const saveItems = [
    saveOrderHeader(),
    saveOrderLines(),
    saveLogistics()
  ];
  try {
    await Promise.all(saveItems);
    await showSuccess('订单保存成功');
  } catch (err) {
    await rollbackOrder(); // 回滚所有已写入的数据
    showError('保存失败，已回滚');
  }
}
```


### 2. Promise.allSettled —— 全部结算制

**行为**：等待所有 Promise 结束（无论成功或失败），返回包含每个结果状态的数组。永远不会 reject。

**典型场景**：
- 批量操作需要知道每个任务的最终状态（上传文件、批量处理）
- 仪表盘多个独立模块，部分失败不影响其他展示
- 需要做成功/失败统计，并对失败项单独重试
- 批量发送通知/短信/邮件：部分失败不影响整体进度，只记录失败名单
- 导入 Excel / CSV 批量写入：逐条记录成功与失败原因，生成导入报告

**示例**：
```js
async function batchUpload(files) {
  const results = await Promise.allSettled(
    files.map(file => upload(file))
  );

  const successCount = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected');

  console.log(`成功 ${successCount} 个，失败 ${failed.length} 个`);
  // 可针对 failed 做重试或提示
}
```

**进阶示例（仪表盘多模块独立加载 + 失败统计）**：
```js
async function loadDashboard() {
  const [statistics, charts, alerts] = await Promise.allSettled([
    fetchStatistics(),
    fetchCharts(),
    fetchAlerts()
  ]);

  // 每个模块单独渲染，失败模块只显示占位 + 重试按钮，不影响其他模块
  renderStat(statistics);
  renderCharts(charts);
  renderAlerts(alerts);

  // 统计失败模块，统一上报日志
  const failedCount = [statistics, charts, alerts].filter(
    r => r.status === 'rejected'
  ).length;
  if (failedCount > 0) reportMetric(`dashboard_partial_fail:${failedCount}`);
}
```

返回结构示例：
```js
[
  { status: 'fulfilled', value: '上传成功' },
  { status: 'rejected', reason: Error }
]
```


### 3. Promise.race —— 竞速制

**行为**：谁先结束（成功或失败）就采用谁的结果。

**典型场景**：
- 请求超时控制（最常用）
- 多个数据源竞速取最快响应
- 简单的取消逻辑
- 接口可用性探测：并发探测多个后端节点，取最快返回心跳的那个作为健康节点
- 音视频加载兜底：播放器在给定时间内拿不到首帧就切换到低清晰度源

**示例（超时控制）**：
```js
function withTimeout(promise, ms = 3000) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), ms);
  });
  // 用 .catch 吸收原 promise 在超时后的迟到拒绝，避免 unhandled rejection
  return Promise.race([promise, timeout]);
}

// 使用
try {
  const data = await withTimeout(fetchData());
  console.log(data);
} catch (err) {
  console.error(err.message); // 可能是超时，也可能是原请求失败
}
```

**进阶示例（多节点健康探测，取最快可用）**：
```js
async function pickFastestNode(nodes) {
  // 并发探测各节点，返回"谁最快返回"的结果
  const probes = nodes.map(node =>
    ping(node).then(() => node) // 正常返回节点标识
  );
  // 这里用 race 取最快成功的节点（也可结合 any 做容错）
  const fastest = await Promise.race(probes);
  console.log(`最快的节点：${fastest}`);
  return fastest;
}
```


### 4. Promise.any —— 择优录取制

**行为**：返回第一个成功的结果；只有全部失败时才 reject，并返回 `AggregateError`。

**典型场景**：
- 多个备用 CDN / 接口，取最快成功的那个
- 主备容错策略
- 只关心"有没有成功"，不关心谁失败
- 主数据库 + 只读副本：主库不可用时自动切到可用的只读副本读取
- 多支付渠道 / 多登录方式探测：任一渠道可用即可继续流程
- 国际化资源加载：多个语言包 CDN 地址任一个成功即可

**示例**：
```js
async function fetchFromAnySource(path) {
  const sources = [
    `https://cdn1.example.com/${path}`,
    `https://cdn2.example.com/${path}`,
    `https://cdn3.example.com/${path}`
  ];

  try {
    const data = await Promise.any(
      sources.map(url =>
        fetch(url).then(res => {
          if (!res.ok) throw new Error('请求失败');
          return res.json();
        })
      )
    );
    return data;
  } catch (err) {
    // 所有源都失败
    console.error('全部备用源不可用', err.errors);
    throw err;
  }
}
```

**进阶示例（多副本数据库读取容错）**：
```js
async function readFromAnyReplica(userId) {
  const replicas = [
    readPrimary(userId),   // 主库
    readReplica1(userId),  // 从库1
    readReplica2(userId)   // 从库2
  ];

  try {
    // 任一副本读成功即可返回，只关心"有没有数据"
    const user = await Promise.any(replicas);
    return user;
  } catch (err) {
    // 所有副本都不可用
    throw new Error('所有数据源均不可用，请稍后重试');
  }
}
```

> 提示：`Promise.any` 与 `AggregateError` 均为 ES2021 新增，老旧环境（如 IE）不支持，使用前请确认运行环境或做 polyfill。


## 三、其他常用静态方法

### Promise.resolve / Promise.reject

快速创建已成功或已失败的 Promise，常用于统一返回类型或提前结束。

```js
// 已成功
Promise.resolve(42).then(v => console.log(v)); // 42

// 已失败
Promise.reject(new Error('失败')).catch(err => console.error(err));
```

### Promise.withResolvers()（较新）

同时获取 `promise`、`resolve`、`reject`，适合需要在外部控制 Promise 的场景。

```js
const { promise, resolve, reject } = Promise.withResolvers();

// 稍后决定成功或失败
setTimeout(() => resolve('完成'), 1000);

promise.then(console.log);
```

### Promise.try()（较新）

把同步或异步函数统一包装成 Promise，方便统一错误处理。

```js
Promise.try(() => {
  // 这里可以是同步抛错，也可以是返回 Promise
  return someFunction();
}).then(/* ... */).catch(/* ... */);
```

> 注意：`Promise.withResolvers()` 与 `Promise.try()` 属于较新的特性（`Promise.try` 为 ES2025 提案），在老旧浏览器或低版本 Node.js 中可能不可用，生产环境使用前建议确认运行环境或做 polyfill。


## 四、如何选择合适的方法？

| 你的需求 | 推荐方法 |
|----------|----------|
| 必须全部成功 | `Promise.all` |
| 想知道每个任务的最终结果（成功+失败） | `Promise.allSettled` |
| 只关心最快结束的结果（成功或失败都行） | `Promise.race` |
| 只关心第一个成功的结果 | `Promise.any` |
| 给请求加超时 | `Promise.race` + 超时 Promise |
| 多备用源容错 | `Promise.any` |


## 五、总结

- `Promise.all`：严格模式，全有或全无。
- `Promise.allSettled`：宽松模式，收集全部结果。
- `Promise.race`：竞速，谁先结束用谁。
- `Promise.any`：择优，谁先成功用谁。

这四个方法覆盖了绝大多数多 Promise 并发场景。结合 `async/await` 使用，代码可读性会显著提升。实际开发中根据业务对"成功/失败"的容忍度选择合适的方法即可。
