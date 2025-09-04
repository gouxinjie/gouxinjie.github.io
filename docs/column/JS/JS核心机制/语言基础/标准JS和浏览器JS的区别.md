# JavaScript 的双面性：标准 JS 与浏览器 JS 的核心区别

`JavaScript` 作为现代 Web 开发的基石，实际上存在于两个略有不同的环境中：`标准 JavaScript（遵循 ECMAScript 规范）和浏览器 JavaScript（包含 Web API 扩展）`。

## 一、基本概念区分

### 标准 JavaScript (ECMAScript)

- **定义**：由 `ECMA International 通过 ECMA-262` 标准化的脚本语言规范
- **特点**：
  - 语言核心功能（语法、类型、内置对象等）
  - 与运行环境无关
  - 每年发布新版本（ES6/ES2015, ES7/ES2016 等）

### 浏览器 JavaScript

- **定义**：标准 JS + 浏览器提供的 Web API
- **特点**：
  - 包含 DOM/BOM 操作等浏览器特定功能
  - 依赖浏览器实现
  - 包含非标准但广泛支持的 API

## 二、核心差异对比

| 特性         | 标准 JavaScript                 | 浏览器 JavaScript                             |
| ------------ | ------------------------------- | --------------------------------------------- |
| **运行环境** | 任何 JS 引擎（Node.js/Deno 等） | 仅限浏览器环境                                |
| **全局对象** | `globalThis`                    | `window`                                      |
| **I/O 操作** | 无内置 I/O（依赖环境 API）      | 提供 `fetch`, `XMLHttpRequest`                |
| **DOM 操作** | 不支持                          | 完整 DOM API (`document.getElementById` 等)   |
| **定时器**   | 无                              | `setTimeout`, `setInterval`                   |
| **存储机制** | 无                              | `localStorage`, `sessionStorage`, `IndexedDB` |
| **地理位置** | 无                              | `navigator.geolocation`                       |
| **图形处理** | 无                              | Canvas API, WebGL                             |
| **事件系统** | 无                              | `addEventListener`, 自定义事件                |

## 三、典型代码示例对比

### 标准 JS 示例（可在任何环境运行）

```javascript
// 数组操作
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);

// 类定义
class Person {
  constructor(name) {
    this.name = name;
  }
}

// 异步处理
async function fetchData() {
  const data = await someAsyncOperation();
  return data;
}
```

### 浏览器 JS 示例（依赖 Web API）

```javascript
// DOM 操作
document.getElementById("myButton").addEventListener("click", () => {
  document.body.style.backgroundColor = "lightblue";
});

// 使用 localStorage
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");

// 使用 Fetch API
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## 四、常见的浏览器专属特性

1. **DOM 操作**：

   - `document.querySelector`
   - `element.innerHTML`
   - `Node.appendChild`

2. **浏览器对象模型 (BOM)**：

   - `window.location`
   - `window.history`
   - `navigator.userAgent`

3. **事件系统**：

   - `MouseEvent`
   - `KeyboardEvent`
   - 事件冒泡/捕获机制

4. **视觉相关 API**：
   - `IntersectionObserver`
   - `requestAnimationFrame`
   - Web Animations API

## 五、兼容性处理技巧

1. **环境检测**：

   ```javascript
   if (typeof window !== "undefined") {
     // 浏览器环境代码
   } else {
     // Node.js 或其他环境
   }
   ```

2. **特性检测**：

   ```javascript
   if ("localStorage" in window) {
     // 使用 localStorage
   }
   ```

3. **Polyfill 使用**：
   ```javascript
   // 为旧浏览器提供现代 API 支持
   import "core-js/stable";
   import "regenerator-runtime/runtime";
   ```

## 六、现代开发的最佳实践

1. **使用 ESM 模块**：

   ```html
   <script type="module">
     import { myFunction } from "./module.js";
   </script>
   ```

2. **渐进增强**：

   ```javascript
   // 先检查再使用
   if ("serviceWorker" in navigator) {
     navigator.serviceWorker.register("/sw.js");
   }
   ```

3. **关注标准化进程**：
   - 优先使用已进入标准的 API
   - 谨慎使用浏览器前缀 API（如 `-webkit-`）

## 七、学习资源推荐

1. **标准 JavaScript**：

   - [ECMAScript 最新规范](https://tc39.es/ecma262/)
   - [MDN JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

2. **浏览器 API**：

   - [Web API 参考](https://developer.mozilla.org/zh-CN/docs/Web/API)
   - [WHATWG 规范](https://spec.whatwg.org/)

3. **兼容性检查**：
   - [Can I use](https://caniuse.com)
   - [Node.js API 文档](https://nodejs.org/api/)
