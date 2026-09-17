const n=`# Web Worker 与主线程优化：把重活挪出主线程

[[toc]]

## 一、为什么需要 Web Worker

JavaScript 是**单线程**的语言：浏览器只有一个主线程，要负责 JS 执行、样式计算、布局、绘制、合成、事件处理、用户交互……任何一段长任务都会把这条主线程堵住，最直观的表现就是**页面卡顿**。

> 一个朴素的口诀：**主线程一旦被 JS 长任务占用，渲染就排不上队，帧就掉，FPS 就降，用户就觉得卡。**

在 Chrome DevTools 的 Performance 面板里，主线程上任何 **> 50ms** 的任务都会被标记为 **Long Task**，它会直接阻塞渲染、拖慢下一次合成，是页面卡顿的主要来源。

常见会制造 Long Task 的场景：

| 场景 | 典型耗时 | 为什么卡 |
|------|---------|----------|
| 大数据排序/过滤（几万条以上） | 数百 ms ~ 数 s | 在主线程同步执行 |
| 复杂加密/哈希（PBKDF2、AES、SM3 等） | 数十 ~ 数百 ms | CPU 密集 |
| 大 JSON 解析（MB 级） | 数十 ~ 数百 ms | 同步解析 |
| Canvas 图像处理（滤镜、灰度、压缩） | 与图像大小成正比 | 主线程同步运算 |
| 编译/转换（复杂正则、模板引擎） | 数十 ~ 数百 ms | 同步执行 |

这些任务都有一个共同特点：**纯计算、不依赖 DOM**。这就是 Web Worker 最擅长的事。

## 二、Web Worker 是什么

\`Web Worker\` 是浏览器为 JavaScript 提供的一个**多线程能力**：它允许你在后台线程里跑 JS，主线程与 Worker 通过 \`postMessage\` 通信。Worker 线程：

- ✅ 可以执行计算密集的 JS
- ✅ 可以发请求（\`fetch\`）、定时器（\`setTimeout\`/\`setInterval\`）、使用 \`WebAssembly\`
- ❌ **不能直接访问 DOM**（没有 \`window\`、\`document\`）
- ❌ 不能使用 \`localStorage\`（同源但不是同上下文）

W3C 定义了三种 Worker，定位略有差异：

| 类型 | 作用域 | 主要用途 |
|------|--------|---------|
| Dedicated Worker | 单页面（创建它的那个） | 通用后台计算 |
| Shared Worker | 同源所有页面共享 | 多 tab 共享连接（如聊天、长连接代理） |
| Service Worker | 同源所有页面 + 可离线 | 离线缓存、推送、请求代理（PWAs） |

> 本文重点讲最常用的 **Dedicated Worker**。Service Worker 用在离线缓存与请求代理场景，建议另开一篇。

## 三、基础用法

### 1. 创建 Worker

\`worker.js\`：

\`\`\`js
// 监听主线程消息
self.onmessage = (e) => {
  const { type, data } = e.data;
  if (type === 'sum') {
    // 计算 1..N 的和（模拟重活）
    let s = 0;
    for (let i = 1; i <= data; i++) s += i;
    self.postMessage({ type: 'sumResult', data: s });
  }
};
\`\`\`

主线程：

\`\`\`js
const worker = new Worker('./worker.js');

worker.onmessage = (e) => {
  const { type, data } = e.data;
  if (type === 'sumResult') {
    console.log('计算结果：', data);
    worker.terminate(); // 算完关掉，释放资源
  }
};

worker.postMessage({ type: 'sum', data: 100_000_000 });
\`\`\`

### 2. 双向通信：主线程 ↔ Worker

\`postMessage\` 是**异步的**，可以传**结构化数据**（默认走「结构化克隆」，类似深拷贝，但比 \`JSON.stringify\` 快，支持 \`Map\`/\`Set\`/\`ArrayBuffer\`/\`Blob\` 等）。

\`\`\`js
// 主线程
worker.postMessage({
  type: 'parseCSV',
  payload: { text: csvText, delim: ',' },
});

// Worker
self.onmessage = (e) => {
  const { type, payload } = e.data;
  if (type === 'parseCSV') {
    const rows = payload.text.split('\\n').map((l) => l.split(payload.delim));
    self.postMessage({ type: 'parseCSVResult', data: rows });
  }
};
\`\`\`

### 3. 错误处理

\`\`\`js
// 主线程
worker.onerror = (e) => {
  console.error('Worker 出错了：', e.message);
};

worker.onmessageerror = (e) => {
  console.error('Worker 消息无法反序列化：', e);
};
\`\`\`

Worker 内部也可以 \`self.onerror\` / \`try...catch\` 上报错误。

### 4. 关闭与生命周期

\`\`\`js
worker.terminate(); // 主线程主动关闭（立即释放）
// self.close()    // Worker 内部关闭自己
\`\`\`

> 注意：\`terminate()\` 之后该 Worker 就废了，要重做只能 \`new Worker(...)\` 重建。需要复用就用一个**常驻 Worker 池**。

## 四、进阶用法

### 1. \`importScripts\`：在 Worker 里加载库

\`\`\`js
// worker.js
self.importScripts('https://cdn.jsdelivr.net/npm/lodash/lodash.min.js');
// 现在可以用 _
const arr = self._.range(1, 1000000);
self.postMessage(arr.length);
\`\`\`

注意 \`importScripts\` 是**同步阻塞**的，会让 Worker 自身卡住（但不会卡主线程）。

### 2. OffscreenCanvas：在 Worker 里画 Canvas

主线程把 \`<canvas>\` 的绘制能力「转移」到 Worker，图像处理不占用主线程：

\`\`\`js
// 主线程
const canvas = document.getElementById('cv');
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);

// Worker
self.onmessage = (e) => {
  const ctx = e.data.canvas.getContext('2d');
  // 在 Worker 里做图像滤镜、动画等
};
\`\`\`

适合做**图像批量处理、实时滤镜**这类重活。

### 3. WebAssembly：把 C/Rust 性能搬到 Worker

\`\`\`js
self.importScripts('wasm_exec.js'); // Go 写的 wasm runtime
const go = new Go();
WebAssembly.instantiateStreaming(fetch('main.wasm'), go.importObject).then((res) => {
  go.run(res.instance);
});
\`\`\`

Wasm + Worker 是性能「双 buff」：Wasm 本身接近原生速度，Worker 把运算挪出主线程。压缩、加密、解析都能用。

### 4. 用 Comlink 简化通信

直接 \`postMessage\` 写多了很烦，**Comlink**（GoogleChromeLabs 出品）能把 Worker 包装成类 Promise 风格的远程函数调用：

\`\`\`js
// worker.ts
import { expose } from 'comlink';
const api = {
  async hash(text) {
    // 复杂哈希...
    return result;
  },
};
expose(api);

// 主线程
import { wrap } from 'comlink';
const worker = new Worker('./worker.js');
const remote = wrap(worker);
const result = await remote.hash('hello');
\`\`\`

上手成本几乎为零，强烈推荐。

## 五、实战场景与代码

### 场景 1：大数据排序/过滤

\`\`\`js
// filter.worker.js
self.onmessage = (e) => {
  const { list, keyword } = e.data;
  const result = list.filter((it) => it.name.includes(keyword));
  self.postMessage(result);
};

// 主线程
const worker = new Worker('./filter.worker.js');
worker.onmessage = (e) => renderList(e.data);
worker.postMessage({ list: bigList, keyword: '前端' });
\`\`\`

### 场景 2：复杂加密/哈希

Web Crypto 已经在 Worker 里可用，且**底层走原生实现**，比 JS 写的快几个数量级：

\`\`\`js
self.onmessage = async (e) => {
  const { text } = e.data;
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  self.postMessage(hash);
};
\`\`\`

### 场景 3：解析大 JSON / CSV

\`\`\`js
self.onmessage = (e) => {
  try {
    const data = JSON.parse(e.data); // Worker 里同步解析不卡主线程
    const summary = summarize(data); // 任何聚合逻辑
    self.postMessage({ ok: true, summary });
  } catch (err) {
    self.postMessage({ ok: false, err: err.message });
  }
};
\`\`\`

### 场景 4：复杂数学运算（矩阵、几何、机器学习）

把矩阵乘法放在 Worker，几万 × 几万都不会卡 UI。

## 六、注意事项与坑

### 1. 不能访问 DOM

> 想拿到 DOM，必须让主线程做，Worker 只负责计算。

### 2. 同源限制

\`new Worker(url)\` 中的 url 必须**同源**。想跨域用，要么把脚本放在同源下，要么走 \`Blob\`：

\`\`\`js
const blob = new Blob([workerCode], { type: 'application/javascript' });
const url = URL.createObjectURL(blob);
const worker = new Worker(url);
\`\`\`

### 3. 通信开销

\`postMessage\` 走「结构化克隆」，对大数据（比如 1MB 的数组）会有**百微秒级**开销。如果要传**巨型二进制**，用 **Transferable Objects**（\`ArrayBuffer\`、\`ImageBitmap\`、\`OffscreenCanvas\` 等），转移所有权，**零拷贝**：

\`\`\`js
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage({ buf: buffer }, [buffer]); // 主线程之后不能再访问 buffer
\`\`\`

### 4. 内存与启动开销

每个 Worker 都会启动一个**独立的 JS 运行时**，内存占用几十 MB，启动也需要几毫秒。所以：

- **不要为了「几行简单循环」开 Worker**——开销大于收益。
- 适合**真正重**的任务（> 几十 ms）。
- 想复用就用**Worker 池**，避免反复创建销毁。

### 5. 调试

DevTools 里可以单独 debug Worker：

> Sources 面板 → 左上角线程列表（顶端下拉）→ 选 Worker。

### 6. 不要把能异步化的东西硬塞 Worker

如果是「请求完再渲染」这种**网络请求 + DOM** 的事，根本不需要 Worker——网络请求本身就在主线程外（浏览器网络线程）。Worker 解决的是「主线程里的 JS 跑太久」。

## 七、验证优化效果

优化完了别凭感觉，用数据验证：

1. **Performance 面板**录制一次操作：
   - 优化前：主线程有明显的 **红色 Long Task**（> 50ms）。
   - 优化后：Worker 线程承担了重活，**主线程 Long Task 消失**，FPS 平稳。
2. **PerformanceObserver 自动监控 longtask**：

\`\`\`js
const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('Long Task:', entry.duration, 'ms');
  }
});
obs.observe({ entryTypes: ['longtask'] });
\`\`\`

3. **Lighthouse / RUM**：用真实用户指标（如 INP）持续观察是否下降。

> 结论性验证：看 Performance 面板的「主线程」一栏，是否还有大块红色 Long Task。如果挪到 Worker 后红色消失、帧率恢复平稳，优化就到位了。

## 八、总结

- **主线程是稀缺资源**：JS 执行、布局、绘制、事件都挤在一起，长任务会直接卡 UI。
- **Web Worker** 是浏览器提供的多线程方案，**纯计算、不碰 DOM** 的重活都适合丢给它。
- 通信走 \`postMessage\` + \`onmessage\`，**大数据用 Transferable 零拷贝**。
- 配合 **Comlink / OffscreenCanvas / WebAssembly** 能进一步降低开发成本、提升性能。
- **不要滥用**：启动开销几十 MB 内存 + 几毫秒时间，只在**真正重**的任务上才划算。
- 验证用 **Performance 面板 / longtask / INP**，别只看「感觉」。

一句话：**能异步的事用异步（fetch），能下 Worker 的事下 Worker，能用 Wasm 加速就用 Wasm——把主线程留给用户交互和渲染。**`;export{n as default};
