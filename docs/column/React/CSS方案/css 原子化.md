# CSS 原子化

## 什么是 CSS 原子化？

`CSS 原子化（Atomic CSS）`是一种将样式拆分为最小且独立单元的设计方法，其核心思想是每个` CSS` 类只应用单一的样式属性，而不是组合样式。

例如，`.bg-red`只设置背景色为红色，`.text-center`只让文本居中。

::: tip 原子化 CSS 的特点

- 每个类名只控制一个样式属性
- 通过组合多个类实现复杂样式
- 减少冗余 CSS 代码，压缩文件大小
- 采用简单直观的命名规则，便于理解修改

:::

## 如何使用 CSS 原子化

### 1. 使用 Tailwind CSS

`Tailwind` 是目前最流行的原子化 `CSS` 框架之一。安装使用非常简单：

```bash
npm install -D tailwindcss
```

然后创建配置文件`tailwind.config.js`，在其中可以自定义断点值、间距单位等：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    },
    spacing: {
      1: "8px",
      2: "12px",
      3: "16px",
      4: "24px",
      5: "32px",
      6: "48px"
    }
  }
};
```

使用示例：

```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>
```

### 2. 使用 Unocss

`Unocss` 是另一款强大的原子化 CSS 引擎，相比 `Tailwind` 更加自由灵活。在 `Vue3 + Vite + TS `项目中的配置方法：

安装依赖：

```bash
pnpm i -D unocss @unocss/preset-uno @unocss/preset-attributify @unocss/preset-icons
```

配置 vite.config.ts：

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import { presetUno, presetAttributify, presetIcons } from "unocss";

export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [presetUno(), presetAttributify(), presetIcons()],
      rules: [
        [
          "p-c",
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%)`
          }
        ],
        [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })]
      ]
    })
  ]
});
```

使用示例：

```html
<div class="text-25px text-#ff6700 bg-#ccc">你好Unocss</div>
<div class="i-logos-atomic-icon w-50px h-50px"></div>
```

## 原子化 CSS vs SCSS：优势对比

### 1. 代码体积显著减少

Facebook 重构后采用原子化 CSS，主页 CSS 体积减少了 80%。这是因为原子化 CSS 通过高度复用样式规则，避免了传统 CSS 中的大量重复代码。

### 2. 更少的样式冲突

原子化 CSS 使用最简单的类选择器，CSS 权重问题几乎不存在。而在 SCSS 中，嵌套选择器可能导致权重问题，需要谨慎管理。

### 3. 更好的可维护性

当需要修改样式时，原子化 CSS 允许直接修改 HTML 中的类名，而不是去查找和修改 CSS 文件。这种"紧密耦合"在现代前端框架中被证明是高效的。

### 4. 更快的开发速度

有了完善的原子类库和编辑器智能提示，开发者可以快速组合出所需样式，无需反复在 HTML 和 CSS 文件间切换。而 SCSS 虽然提供了变量、混合等特性，但仍需要手动编写样式规则。

### 5. 更优的缓存策略

原子化 CSS 一旦准备好，将不会有太大变化或增长，可以更有效地缓存它。而 SCSS 生成的 CSS 会随着项目增长而不断变化。

### 6. 更简单的删除无用代码

删除功能时，原子化 CSS 确保相关样式也同时被删掉，因为样式直接写在 HTML 中。而 SCSS 中可能存在残留的无用样式规则。

## 谁在使用原子化 CSS？

### 1. Facebook

Facebook 是原子化 CSS 的主要推动者之一。他们在重构中完全抛弃了 Sass/Less，采用原子化 CSS 方法，使主页 CSS 体积减少了 80%。

### 2. Twitter

Twitter 也跟随 Facebook 的步伐，在产品部署中采用了原子化 CSS 的方法。

## 原子化 CSS 的局限性

尽管有诸多优势，原子化 CSS 也存在一些挑战：

1. **HTML 臃肿**：复杂的元素可能需要大量类名，使 HTML 变得冗长。不过类名中的高冗余使得 gzip 可以很好压缩。

2. **学习曲线**：需要学习一套新的命名约定，初期可能影响开发效率。

3. **一次性样式处理**：当需要一些特殊样式而原子库未提供时，处理起来不太方便。

4. **伪类支持有限**：需要用到伪类的地方通常需要结合传统写法。