# HTML5 新特性

自 `HTML5` 发布以来，前端开发进入了一个全新的时代。它不仅简化了开发流程，还增强了语义表达、丰富了多媒体支持、提升了用户体验，并为移动 `Web` 奠定了坚实基础。

## ✨1. 更丰富的语义化标签

`HTML5` 推出了很多新的语义化结构标签，让网页结构更清晰，有助于 SEO 和屏幕阅读器识别。

### ✅ 新增的结构标签

| 标签        | 含义   | 说明                     |
| ----------- | ------ | ------------------------ |
| `<header>`  | 页眉   | 通常包含 logo、导航等    |
| `<footer>`  | 页脚   | 放置版权、备案等信息     |
| `<nav>`     | 导航   | 表示页面导航链接区域     |
| `<main>`    | 主体   | 页面主要内容（每页一个） |
| `<article>` | 文章   | 独立完整的内容块         |
| `<section>` | 区块   | 页面内容的逻辑区域       |
| `<aside>`   | 侧边栏 | 辅助信息或广告           |

### 📌 示例

```html
<body>
  <header>
    <h1>我的博客</h1>
    <nav>
      <a href="/">首页</a>
      <a href="/about">关于</a>
    </nav>
  </header>
  <main>
    <article>
      <h2>HTML5 新特性</h2>
      <p>了解 HTML5 的结构标签...</p>
    </article>
  </main>
  <footer>© 2025 我的博客</footer>
</body>
```

## 🎬2. 原生多媒体支持（音频 & 视频）

HTML5 让我们可以直接在网页中嵌入音频和视频，无需第三方插件（如 Flash）。

### 🎵 `<audio>` 音频标签

```html
<audio controls>
  <source src="music.mp3" type="audio/mpeg" />
  您的浏览器不支持 audio 标签。
</audio>
```

### 📹 `<video>` 视频标签

```html
<video controls width="600">
  <source src="movie.mp4" type="video/mp4" />
  您的浏览器不支持 video 标签。
</video>
```

## 📝3. 表单控件增强

HTML5 对 `<input>` 元素增加了多种新类型和验证属性，简化了用户输入验证逻辑。

### ✅ 新增 `<input>` 类型

| 类型     | 功能       |
| -------- | ---------- |
| `email`  | 邮箱输入   |
| `url`    | 网站地址   |
| `tel`    | 电话号码   |
| `number` | 数字输入   |
| `range`  | 滑动条     |
| `date`   | 日期选择器 |
| `color`  | 颜色选择器 |
| `search` | 搜索输入框 |

### 🔒 新属性支持

- `required`：是否必填
- `placeholder`：提示文字
- `pattern`：正则表达式验证
- `min`、`max`：数值范围限制

### 📌 示例

```html
<form>
  <label>邮箱：</label>
  <input type="email" required placeholder="请输入邮箱" />
  <br />
  <label>出生日期：</label>
  <input type="date" min="1900-01-01" max="2025-12-31" />
  <br />
  <button type="submit">提交</button>
</form>
```

## 📦4. 本地存储：localStorage 与 sessionStorage

HTML5 提供了两种本地存储方式，可以代替传统的 Cookie 存储机制。

| 类型             | 生命周期               | 特点           |
| ---------------- | ---------------------- | -------------- |
| `localStorage`   | 永久保存，除非手动清除 | 跨页面、跨刷新 |
| `sessionStorage` | 当前会话有效           | 页面关闭即清除 |

### 📌 示例

```js
// 存储数据
localStorage.setItem("username", "张三");

// 获取数据
let name = localStorage.getItem("username");

// 删除数据
localStorage.removeItem("username");
```

无需与服务器交互即可保存状态，非常适合单页应用（SPA）。

---

## 📍5. 地理定位 API（Geolocation）

可获取用户的地理位置信息（需用户授权）。

### 📌 示例

```js
navigator.geolocation.getCurrentPosition(function (position) {
  alert("您的位置：纬度 " + position.coords.latitude + "，经度 " + position.coords.longitude);
});
```

适用于地图、打卡、附近店铺等应用场景。

## 🧱6. Canvas 绘图

HTML5 提供了 `<canvas>` 标签用于绘制 2D 图形、游戏界面、图表等。

### 📌 示例

```html
<canvas id="myCanvas" width="200" height="100" style="border:1px solid #ccc;"></canvas>

<script>
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, 100, 50);
</script>
```

`Canvas` 是数据可视化、图像处理、前端小游戏等的核心。

## 💡7. 拖放 API（Drag & Drop）

支持 HTML 元素在页面中进行原生拖拽操作。

### 📌 示例（简化）

```html
<div id="dragme" draggable="true">拖我</div>

<script>
  const el = document.getElementById("dragme");
  el.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", "这是拖拽的数据");
  });
</script>
```

## 🛜8. 离线应用（已被淘汰）

HTML5 原先支持 AppCache 离线功能，但因兼容性问题已被废弃，推荐使用 **Service Workers**（PWA 技术）实现离线缓存和前端离线体验。

## ✅9. Web Workers：多线程支持

HTML5 支持在浏览器中运行 JS 的“子线程”，避免主线程阻塞，提升性能。
