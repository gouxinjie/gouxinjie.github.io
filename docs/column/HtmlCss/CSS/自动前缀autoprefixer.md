# `autoprefixer` 是什么？

[[toc]]

## 一、为什么需要 `autoprefixer`？

许多 CSS 属性（如 `flexbox`、`grid`、`transform` 等）在早期的浏览器版本中并不完全支持，因此需要添加不同厂商的前缀来确保兼容性。比如，以下 CSS 代码可能需要为不同浏览器添加不同的前缀：

```css
/* 在老版本浏览器中，`flex` 需要前缀 */
display: -webkit-flex; /* Safari */
display: -ms-flexbox; /* Internet Explorer 10 */
display: flex; /* 标准 */
```

但是，手动添加这些前缀不仅冗长，而且容易出错。使用 `autoprefixer` 可以自动完成这项工作。

## 二、`autoprefixer` 工作原理

`autoprefixer` 基于 **Can I Use** 数据库来确定哪些 CSS 属性需要前缀，并且能够根据目标浏览器的支持情况，自动为你的 CSS 代码添加前缀。

它会根据你指定的浏览器兼容范围，分析 CSS 代码并添加必要的厂商前缀。例如，如果你配置了支持现代浏览器（如 Chrome、Firefox、Safari 和 Edge）的目标，`autoprefixer` 会自动添加这些浏览器所需的前缀。

## 三、如何使用 `autoprefixer`？

1. **通过 PostCSS 使用 `autoprefixer`**

   `autoprefixer` 通常和 **PostCSS** 一起使用，PostCSS 是一个 CSS 转换工具，可以通过插件来处理 CSS。你只需要在 `postcss.config.js` 中添加 `autoprefixer` 插件配置。

   **安装 `autoprefixer`**：

   ```bash
   npm install autoprefixer
   ```

   **配置 `postcss.config.js`**：

   ```js
   module.exports = {
     plugins: [require("autoprefixer")]
   };
   ```

   如果你还在使用 `tailwindcss`，`autoprefixer` 会自动作为 `tailwindcss` 配置的一部分加载。

2. **配置支持的浏览器**

   你可以通过 `browserslist` 配置来指定支持的浏览器。`autoprefixer` 会根据这个配置自动为兼容的浏览器添加前缀。

   在 `package.json` 中添加 `browserslist` 字段：

   ```json
   "browserslist": "> 1%, last 2 versions, Firefox ESR, not dead"
   ```

   这个配置的意思是：

   - 支持超过 1% 市场份额的浏览器。
   - 支持最新的 2 个版本的浏览器。
   - 支持 Firefox 的 ESR 版本。
   - 排除已废弃的浏览器（如 IE 10 以下的版本）。

   你也可以在单独的 `.browserslistrc` 文件中指定：

   ```txt
   > 1%
   last 2 versions
   Firefox ESR
   not dead
   ```

3. **在构建过程中使用**

   一旦配置完成，`autoprefixer` 会在构建时自动处理 CSS 文件，添加必要的前缀。例如，假设你有以下 CSS：

   ```css
   .container {
     display: flex;
     justify-content: center;
   }
   ```

   使用 `autoprefixer` 后，生成的 CSS 可能变成：

   ```css
   .container {
     display: -webkit-flex;
     display: -ms-flexbox;
     display: flex;
     justify-content: center;
   }
   ```

## 四、`autoprefixer` 的优势

- **减少冗余的手动工作**：不用再手动写各个浏览器的前缀，减少了错误和重复。
- **兼容性管理**：根据最新的浏览器市场份额自动为 CSS 属性添加前缀，确保样式兼容性。
- **节省时间**：可以在构建过程中自动为你处理前缀，不需要额外的维护。
- **可定制性**：可以根据不同的项目需求和浏览器市场份额配置目标浏览器。

## 五、 示例

**原始 CSS**：

```css
/* 使用 flexbox 布局 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**使用 `autoprefixer` 后**：

```css
/* 自动加上各个浏览器的前缀 */
.container {
  display: -webkit-flex; /* Safari */
  display: -ms-flexbox; /* Internet Explorer 10 */
  display: flex; /* 标准 */
  justify-content: center;
  align-items: center;
}
```
