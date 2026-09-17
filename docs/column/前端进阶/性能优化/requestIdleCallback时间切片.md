# requestIdleCallback 与时间切片：把长任务切到浏览器空闲时跑

[[toc]]

## 一、为什么需要时间切片

> 一句话：**浏览器主线程永远不够用。** 任何耗时的 JS 任务都会拖慢渲染、交互，而 React 这种框架本身又有一大堆调度工作——怎么协调「用户响应」和「业务任务」？

浏览器一帧（~16.7ms @60FPS）的预算大致是这样分的：

```text
输入事件 → 微任务 → 事件回调 → requestAnimationFrame → 布局 → 绘制 → 合成
                                                        ↑       ↑
                                                  这两步最贵    ↑
```

只要某一帧内 JS 跑了 **> 16ms**，渲染就会被推迟，用户就感到「卡了一下」。如果跑了几百 ms，页面就明显「卡死」一会儿。

> 核心矛盾：业务想跑更多代码，用户要更顺滑的体验。怎么把长任务切成「不会卡帧」的小块，跑在浏览器不忙的时候？

这就是「**时间切片（Time Slicing）**」要解决的问题。

## 二、requestIdleCallback 是什么

`window.requestIdleCallback(callback, options)` 是浏览器给开发者的一扇**「后台门」**：让你注册一个回调，浏览器会在**主线程空闲**（也就是一帧里的渲染、合成等重活干完，剩下一点点时间）的时候调用它。

> 口诀：`requestIdleCallback` = 「**我不急，浏览器有空再叫我**」。

它和 `setTimeout` 的关键区别：

| 特性 | `setTimeout(fn, 0)` | `requestIdleCallback(fn)` |
|------|---------------------|----------------------------|
| 何时执行 | 至少 N 毫秒后 | 浏览器「真空闲」时 |
| 是否阻塞渲染 | 会（也是宏任务） | 不会（会避开关键渲染） |
| 是否给剩余时间 | 不给 | 给 `IdleDeadline.timeRemaining()` |
| 兼容性 | 全部 | 主要现代浏览器都支持，Safari 旧版本没有 |

## 三、基础 API

### 1. 注册与回调

```js
const handle = window.requestIdleCallback((deadline) => {
  // deadline 有两个属性：
  //   - timeRemaining(): 当前帧还剩多少 ms 给闲任务
  //   - didTimeout: 是否因为超时才执行（配合 timeout 选项）
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.shift();
    task();
  }
});
```

> 约定俗成：**一个回调最多跑到 `timeRemaining()` 为 0**。剩下的任务留到下一个 idle 周期继续。

### 2. options.timeout

如果你不想无限等，可以给一个**最长等待时间**：

```js
window.requestIdleCallback(work, { timeout: 1000 });
// 1000ms 内还没空也要执行（用 deadline.didTimeout 判断是不是超时跑的）
```

适合「不紧急但也得跑」的预取、预解析。

### 3. 取消

```js
window.cancelIdleCallback(handle);
```

### 4. 完整示例：分批执行任务队列

```js
const queue = Array.from({ length: 10000 }, (_, i) => () => {
  // 模拟一段工作
  document.createElement('div');
});

// 分批：每帧最多跑 5ms 的活
function runChunk(deadline) {
  while (deadline.timeRemaining() > 5 && queue.length > 0) {
    const task = queue.shift();
    task();
  }
  if (queue.length) {
    window.requestIdleCallback(runChunk);
  }
}

window.requestIdleCallback(runChunk);
```

跑完一万次任务**不会卡 UI**，因为每一帧只做一点。

## 四、React 是怎么用这思路的

React 16+ 的 **Fiber 架构**就是「时间切片」最经典的落地。它内部的 `Scheduler` 包封装了一套「分片调度器」，**完全自己实现**了一套类似 `requestIdleCallback` 的机制。

> 为啥不直接用 `requestIdleCallback`？两个原因：
> 1. **兼容性差**（Safari 旧版本没），自己实现可控。
> 2. 优先级需求更细：React 要区分 Immediate / User-blocking / Normal / Low / Idle 五档，自带的 `requestIdleCallback` 不够用。

所以 React 用 **`MessageChannel` + 5ms 时间片**模拟了等价能力，并把「时间切片」做成可配置的（`Concurrent Mode`、`<Suspense>`、`useTransition` 等都依赖它）。

> 启示：**思想比 API 更重要。** 「切任务」这件事，React 给了教科书式的答案。

## 五、自实现一个简易时间切片调度器

不想引框架，可以自己实现一个「每帧最多跑 5ms」：

```js
function timeSlice(tasks, timeBudget = 5) {
  let i = 0;

  function frame() {
    const start = performance.now();

    while (i < tasks.length && performance.now() - start < timeBudget) {
      tasks[i]();
      i++;
    }

    if (i < tasks.length) {
      requestAnimationFrame(frame); // 下一帧继续
    }
  }

  requestAnimationFrame(frame);
}

timeSlice(bigTaskList); // 把大列表分到多帧执行
```

> 这里用 `requestAnimationFrame` 而不是 `requestIdleCallback`，是因为我们想**精准卡在每帧开头**，而 `rIC` 是「帧尾空闲」——不同场景不同选择。

## 六、requestIdleCallback vs requestAnimationFrame

| 维度 | `requestAnimationFrame` | `requestIdleCallback` |
|------|--------------------------|-------------------------|
| 触发时机 | **下一帧渲染前** | **帧空闲时**（不一定每帧都有） |
| 时机保证 | 每帧都跑 | 没空就不跑 |
| 适合 | 动画、过渡、必须看的更新 | 预取、埋点上报、非关键计算 |
| 时间预算 | 一帧 ~16ms | `timeRemaining()` 不固定，可能 0 |

> 经验之谈：
> - 想要「每帧都跑」→ 用 `rAF`。
> - 想要「不卡就行」→ 用 `rIC`，或者 `MessageChannel` 模拟。
> - **两者配合**：`rAF` 跑必现逻辑，`rIC` 跑后台逻辑（典型分层）。

## 七、Polyfill：MessageChannel 模拟

Safari 旧版没有 `requestIdleCallback`，可以用 `MessageChannel` 模拟：

```js
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (cb) {
    const channel = new MessageChannel();
    const start = performance.now();
    channel.port1.onmessage = () => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (performance.now() - start)),
      });
    };
    channel.port2.postMessage(null);
    return channel.port1; // 简化：实际要返回 handle
  };
}
```

更朴素的兜底版本用 `setTimeout`：

```js
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (cb) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };
  window.cancelIdleCallback = function (id) { clearTimeout(id); };
}
```

> 注意：Polyfill 只是兜底，**真要高性能还得依赖浏览器原生支持**。

## 八、实战案例

### 案例 1：长列表「分片渲染」

```js
function renderInChunks(list, renderOne) {
  let i = 0;
  function frame() {
    const deadline = Date.now() + 5;
    while (i < list.length && Date.now() < deadline) {
      renderOne(list[i++]);
    }
    if (i < list.length) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

renderInChunks(hugeList, (item) => container.appendChild(makeRow(item)));
```

10 万条数据也能流畅滚动——因为每帧只渲染几十条。

### 案例 2：数据预取

```js
function prefetch(list) {
  let i = 0;
  function step(deadline) {
    while (i < list.length && deadline.timeRemaining() > 0) {
      fetch(list[i]).then(/* 缓存 */);
      i++;
    }
    if (i < list.length) requestIdleCallback(step);
  }
  requestIdleCallback(step);
}
```

> 用 `rIC` 而不是 `rAF`：预取不影响渲染，最好别跟动画抢带宽。

### 案例 3：埋点批量上报

```js
let pending = [];
function flush() {
  if (!pending.length) return;
  navigator.sendBeacon('/log', JSON.stringify(pending));
  pending = [];
}

setInterval(() => {
  requestIdleCallback((deadline) => {
    while (deadline.timeRemaining() > 0 && pending.length) {
      // 取出待上报数据
      pending.splice(0, 100);
    }
    flush();
  });
}, 5000);
```

### 案例 4：路由切换时预加载下一页组件

```js
router.afterEach((to) => {
  requestIdleCallback(() => {
    import(/* webpackChunkName */ `views/${to.nextName}.vue`);
  });
});
```

用户感知不到预加载，点击「下一页」时已经准备好了。

## 九、注意事项与坑

### 1. 不要放关键任务

`rIC` 不保证执行时间，可能一直不空。**所有用户感知到的关键流程不要放 `rIC` 里**（按钮点击回调、表单提交等）。

### 2. 注意 timeout

> 超时跑的回调（`didTimeout === true`）要慎重对待——说明浏览器很忙，你的「低优先级」工作可能在拖用户体验。

### 3. 回调里别再排新的长任务

一个 `rIC` 回调自己又跑了几百 ms，主线程照样卡。**保持回调简短**。

### 4. 不要假设 `timeRemaining()` 一定 > 0

新版本浏览器在高负载时可能返回 0。**逻辑里要有兜底**，否则可能死循环。

### 5. 调试

DevTools 里能看到「请求帧」的回调时机，但因为它跟主线程共享时间线，**看 Performance 面板的 Scripting 一栏**比追 `rIC` 调用更直观。

## 十、总结

- **主线程稀缺**：16ms 一帧预算，JS 多跑一点就掉帧。
- **时间切片** = 把长任务切成 ≤ 5ms 的小块，让渲染能塞进每一帧。
- **`requestIdleCallback`** 给了浏览器空闲时的入口，适合「不紧急但也得跑」的工作（预取、上报、预解析）。
- **`requestAnimationFrame`** 适合「每帧都跑」（动画、过渡）。
- React Fiber 内部用 `MessageChannel` + 5ms 切片自己实现了等价调度。
- 真要兼容老 Safari，得用 `MessageChannel` / `setTimeout` 做 Polyfill。
- **关键原则：** 关键路径放 `rAF` / 同步；非关键路径放 `rIC` / 切片。

一句话：**让浏览器告诉你它什么时候有空，再把那些「不紧急」的工作一点一点塞进去——这才是和浏览器协作的正确姿势。**