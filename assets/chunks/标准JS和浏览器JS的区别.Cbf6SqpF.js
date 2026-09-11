const n=`# JavaScript 的双面性：标准 JS 与浏览器 JS 的核心区别

JavaScript 作为现代 Web 开发的基石，实际上运行在两种相关但并不完全相同的环境中：

- **标准 JavaScript**（严格遵循 ECMAScript 规范）
- **浏览器 JavaScript**（标准 JS + 浏览器提供的 Web API）

理解二者的区别，是写出可移植、可维护代码的关键。


## 一、基本概念区分

### 1. 标准 JavaScript（ECMAScript）

- **定义**：由 ECMA International 通过 **ECMA-262** 规范标准化的脚本语言。
- **核心特点**：
  - 只包含语言本身的语法、类型系统、内置对象（Array、Object、Promise、Map、Set 等）和运行机制。
  - **与运行环境无关**，理论上可以在任何实现了 ECMAScript 的引擎中运行。
  - 每年更新一个版本（ES2015、ES2016 … 至今）。

常见运行环境：Node.js、Deno、Bun、浏览器引擎（V8、JavaScriptCore、SpiderMonkey）等。

### 2. 浏览器 JavaScript

- **定义**：标准 JavaScript + 浏览器宿主环境提供的 **Web API**。
- **核心特点**：
  - 额外提供了 DOM、BOM、网络、存储、多媒体、设备能力等浏览器专属能力。
  - 这些 API 由浏览器实现，不属于 ECMAScript 语言本身。
  - 不同浏览器对 Web API 的支持程度可能存在差异。


## 二、核心差异对比

| 特性             | 标准 JavaScript（ECMAScript）          | 浏览器 JavaScript（+ Web API）                          |
|------------------|----------------------------------------|---------------------------------------------------------|
| **运行环境**     | 任何 JS 引擎（Node.js / Deno / Bun 等） | 仅浏览器环境                                            |
| **全局对象**     | \`globalThis\`（标准）                   | \`window\`（同时也是 \`globalThis\`）                       |
| **模块系统**     | ES Modules（\`import\`/\`export\`）        | 同样支持 ES Modules（需 \`type="module"\`）               |
| **I/O / 网络**   | 无内置（依赖宿主提供）                 | \`fetch\`、\`XMLHttpRequest\`、WebSocket 等                 |
| **DOM 操作**     | 不支持                                 | 完整 DOM API（\`document\`、\`querySelector\` 等）          |
| **定时器**       | 无                                     | \`setTimeout\`、\`setInterval\`、\`requestAnimationFrame\`    |
| **存储**         | 无                                     | \`localStorage\`、\`sessionStorage\`、\`IndexedDB\`、Cookie   |
| **设备能力**     | 无                                     | 地理位置、摄像头、麦克风、蓝牙、USB 等                  |
| **图形 / 多媒体**| 无                                     | Canvas、WebGL、Web Audio、Video/Audio API               |
| **事件系统**     | 无                                     | \`addEventListener\`、事件冒泡/捕获、自定义事件           |
| **其他**         | Promise、async/await、Proxy、Reflect 等 | Service Worker、Web Worker、IntersectionObserver 等     |

> 注意：近年来很多原本属于浏览器的 API（如 \`fetch\`、\`URL\`、\`TextEncoder\` 等）已经被移植到 Node.js 等环境，但它们**本质上仍属于宿主 API**，而非 ECMAScript 语言核心。


## 三、典型代码示例对比

### 标准 JavaScript 示例（可在任何支持 ES 的环境运行）

\`\`\`javascript
// 数组方法
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);

// 类
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHello() {
    return \`Hello, \${this.name}\`;
  }
}

// 异步（语言层面的 Promise / async-await）
async function processData(data) {
  const result = await Promise.resolve(data * 2);
  return result;
}

// 模块（ESM）
export function add(a, b) {
  return a + b;
}
\`\`\`

### 浏览器 JavaScript 示例（依赖 Web API）

\`\`\`javascript
// DOM 操作
const button = document.querySelector("#myButton");
button.addEventListener("click", () => {
  document.body.style.backgroundColor = "lightblue";
});

// 本地存储
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");

// 网络请求
async function loadData() {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();
  console.log(data);
}

// 页面可见性 / 动画
requestAnimationFrame(function animate() {
  // 执行动画逻辑
  requestAnimationFrame(animate);
});
\`\`\`


## 四、常见浏览器专属能力分类

1. **文档对象模型（DOM）**
   - \`document.querySelector\` / \`querySelectorAll\`
   - \`element.innerHTML\`、\`textContent\`
   - \`Node.appendChild\`、\`removeChild\` 等

2. **浏览器对象模型（BOM）**
   - \`window.location\`、\`window.history\`
   - \`navigator.userAgent\`、\`navigator.language\`
   - \`screen\`、\`window.innerWidth\` 等

3. **事件系统**
   - 鼠标、键盘、触摸、指针事件
   - 事件冒泡与捕获
   - \`CustomEvent\`

4. **视觉与性能相关**
   - \`IntersectionObserver\`
   - \`ResizeObserver\`
   - \`requestAnimationFrame\`
   - Web Animations API

5. **现代 Web 能力**
   - Service Worker、Cache API
   - Web Worker、SharedWorker
   - WebAssembly
   - Payment Request、Web Share 等


## 五、兼容性与环境判断技巧

### 1. 环境检测

\`\`\`javascript
// 判断是否在浏览器环境
if (typeof window !== "undefined" && typeof document !== "undefined") {
  // 浏览器专属代码
} else {
  // Node.js / 其他环境
}
\`\`\`

### 2. 特性检测（推荐）

\`\`\`javascript
// 比直接判断浏览器类型更可靠
if ("localStorage" in window) {
  // 可以安全使用 localStorage
}

if ("fetch" in window) {
  // 使用 fetch
} else {
  // 降级到 XMLHttpRequest 或 polyfill
}
\`\`\`

### 3. Polyfill 与转译

\`\`\`javascript
// 使用 core-js 等为旧环境补齐现代语法和部分 API
import "core-js/stable";
import "regenerator-runtime/runtime";
\`\`\`

现代构建工具（Vite、Webpack、esbuild 等）通常会结合 Babel 或 SWC 处理语法降级，再配合 polyfill 解决 API 缺失问题。


## 六、现代开发最佳实践

1. **优先使用已标准化的特性**
   尽量选择已经进入 ECMAScript 或成为正式 Web 标准的 API，减少对实验性或带前缀 API 的依赖。

2. **渐进增强（Progressive Enhancement）**
   \`\`\`javascript
   if ("serviceWorker" in navigator) {
     navigator.serviceWorker.register("/sw.js");
   }
   \`\`\`

3. **明确区分“语言能力”和“宿主能力”**
   - 纯逻辑、数据处理、算法 → 尽量只依赖标准 JS，方便在多端复用。
   - UI 交互、网络、存储、设备能力 → 明确标注为浏览器环境代码。

4. **使用 TypeScript 提升可维护性**
   通过类型定义清晰区分 DOM 相关类型与纯逻辑类型。

5. **关注标准演进**
   - ECMAScript：TC39 提案进程
   - Web API：WHATWG、W3C 规范


## 七、学习资源推荐

**标准 JavaScript**
- [ECMAScript 最新规范](https://tc39.es/ecma262/)
- [MDN JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [JavaScript Info](https://zh.javascript.info/)

**浏览器 / Web API**
- [MDN Web API 参考](https://developer.mozilla.org/zh-CN/docs/Web/API)
- [WHATWG 规范集合](https://spec.whatwg.org/)
- [Can I use](https://caniuse.com/)（兼容性查询）

**其他运行时**
- [Node.js 官方文档](https://nodejs.org/api/)
- [Deno 文档](https://deno.land/manual)


## 总结

| 维度         | 标准 JavaScript              | 浏览器 JavaScript                     |
|--------------|------------------------------|---------------------------------------|
| 本质         | 语言规范（ECMAScript）       | 语言 + 浏览器宿主 API                 |
| 可移植性     | 高（跨环境）                 | 低（绑定浏览器）                      |
| 主要用途     | 逻辑、算法、数据处理         | 页面交互、DOM、网络、设备能力         |
| 学习重点     | 语法、原型、异步、模块等     | DOM/BOM、事件、Web API、性能优化等    |

真正优秀的前端开发者，既要精通 **标准 JavaScript** 的语言精髓，也要熟练掌握 **浏览器 Web API** 的实际应用，并清楚知道两者的边界。只有这样，才能写出既强大又具备良好可移植性的代码。
`;export{n as default};
