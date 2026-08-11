# 前端实现水印的两种方式：SVG 与 Canvas

[[toc]]

## 🧩 一、为什么要在前端添加水印？

在现代 Web 页面（尤其是移动端展示场景）中，**前端水印** 是防止截图、内容盗用的重要手段。它常用于：

- 🔒 在线预览文档、防截图保护
- 🧍 用户身份标识（展示用户名称或时间）
- 📱 移动端页面内容保护
- 🖼️ 可视化报告防泄露

前端水印的优点：

✅ 实时生成，无需后端参与 ✅ 灵活控制文字、样式、透明度 ✅ 不影响交互体验

## 🧭 二、两种主流实现方式对比

| 特性       | **SVG 水印**   | **Canvas 水印**       |
| ---------- | -------------- | --------------------- |
| 清晰度     | ★★★★★ 高清矢量 | ★★★★ 位图缩放可能失真 |
| 性能       | ★★★★★ 原生渲染 | ★★★ 绘制后性能稍低    |
| 动态生成   | ★★★ 一般       | ★★★★★ 灵活绘制        |
| 防篡改性   | ★★★            | ★★★★★                 |
| 开发复杂度 | ★★ 简单        | ★★★ 中等              |

> 🧠 简单总结：
>
> - 想快速上水印？👉 用 **SVG**。
> - 想防截图、定制更灵活？👉 用 **Canvas**。

## 🖌️ 三、SVG 实现水印（推荐方案）

SVG 利用 `<pattern>` 模式定义一个可重复的图案（比如文字），然后用 `<rect>` 将它平铺到全屏，性能高、清晰度好，非常适合移动端。

### ✅ 示例源码

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SVG 水印示例</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f8f8f8;
        min-height: 100vh;
        overflow-x: hidden;
      }
      .content {
        padding: 20px;
      }
      /* SVG 水印层样式 */
      .svg-watermark {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* 不影响点击 */
        z-index: 9999;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <h1>SVG 水印实现示例</h1>
      <p>这是一个演示 SVG 水印的页面。无论你滚动、缩放或截图，水印都会保持固定且清晰。</p>
      <p>SVG 方式利用了 pattern 平铺机制，具有高分辨率、低性能损耗等优点，非常适合移动端。</p>
    </div>

    <!-- SVG 水印层 -->
    <svg class="svg-watermark">
      <defs>
        <!-- 定义平铺 pattern -->
        <pattern id="wmPattern" width="180" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <!-- 水印文字 -->
          <text x="0" y="60" fill="rgba(0,0,0,0.1)" font-size="16" font-family="Arial">SVG 水印 ©2025</text>
        </pattern>
      </defs>
      <!-- 用矩形填充整个页面 -->
      <rect width="100%" height="100%" fill="url(#wmPattern)" />
    </svg>
  </body>
</html>
```

### 🔍 关键点说明：

| 参数                             | 作用                                     |
| -------------------------------- | ---------------------------------------- |
| `patternUnits="userSpaceOnUse"`  | 以像素为单位控制平铺间隔                 |
| `patternTransform="rotate(-30)"` | 设置整体旋转角度                         |
| `<text>`                         | 定义文字样式，可替换为 `<image>` 放 logo |
| `pointer-events:none`            | 避免阻挡按钮、输入框操作                 |
| `fill="rgba(0,0,0,0.1)"`         | 控制透明度（建议 0.05 ～ 0.15）          |

### 🧱 优点总结：

✅ 矢量高清，缩放不失真 ✅ 性能极高，浏览器原生渲染 ✅ 样式灵活，可旋转、平铺、透明化 ✅ 兼容所有现代移动浏览器

## 🎨 四、Canvas 实现水印

`Canvas` 可以直接绘制文字、图像等，并生成水印层。相较于 SVG，它在动态生成（如用户名、时间戳）和防篡改上更强。

### ✅ 示例源码

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Canvas 水印实现</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #fafafa;
        min-height: 100vh;
      }

      .content {
        padding: 20px;
      }

      /* Canvas 水印层 */
      #watermarkCanvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <h2>Canvas 水印示例</h2>
      <p>Canvas 通过绘制文字并平铺，实现全屏水印。</p>
    </div>

    <canvas id="watermarkCanvas"></canvas>

    <script>
      function createCanvasWatermark(text) {
        const canvas = document.getElementById("watermarkCanvas");
        const ctx = canvas.getContext("2d");

        // 设置 Canvas 尺寸为全屏
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "16px Arial";
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // 旋转画布实现倾斜水印
        ctx.rotate((-30 * Math.PI) / 180);

        const stepX = 150; // 水印水平间距
        const stepY = 100; // 水印垂直间距

        // 双层循环平铺水印
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
            ctx.fillText(text, x, y);
          }
        }
      }

      // 初始化
      createCanvasWatermark("Canvas 水印 ©2025");

      // 监听屏幕大小变化自动重绘
      window.addEventListener("resize", () => createCanvasWatermark("Canvas 水印 ©2025"));
    </script>
  </body>
</html>
```

### 🔍 Canvas 关键技巧：

| 参数                              | 作用         |
| --------------------------------- | ------------ |
| `ctx.rotate(-30 * Math.PI / 180)` | 实现倾斜效果 |
| `pointer-events:none`             | 防止遮挡操作 |
| `stepX` / `stepY`                 | 控制水印间距 |
| `rgba(0,0,0,0.1)`                 | 控制透明度   |
| `window.resize`                   | 响应式刷新   |

### ⚙️ 优点总结：

✅ 可动态生成内容（用户名、时间） ✅ 防篡改性更强 ✅ 支持图形、渐变等复杂样式

缺点：

- 缩放后可能轻微模糊（位图特性）；
