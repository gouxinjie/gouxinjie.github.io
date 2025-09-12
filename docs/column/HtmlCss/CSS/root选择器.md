# :root 选择器的强大功能

CSS 变量（也称为自定义属性）彻底改变了我们编写和维护样式表的方式，而`:root`选择器正是这一功能的核心所在。

## 一、什么是:root 选择器？

`:root`是一个 CSS 伪类选择器，它匹配文档树的根元素。在 HTML 文档中，这始终是`<html>`元素，但`:root`的特异性更高（0,0,1,0），因此在与 html 选择器竞争时具有优先级。

```css
:root {
  --main-color: #3498db;
  --accent-color: #e74c3c;
  --text-color: #2c3e50;
  --spacing: 1rem;
}
```

## 二、为什么使用 CSS 变量？

### 1. 维护性

无需在整个样式表中搜索和替换颜色值，只需更改变量值即可全局更新。

### 2. 一致性

确保整个项目中使用统一的配色方案、间距和字体大小。

### 3. 动态主题

通过 JavaScript 轻松切换主题，只需更改变量值。

### 4. 减少重复代码

使用计算值和复合值，减少 CSS 代码量。

## 三、实际应用示例

### 基础用法

```css
:root {
  --primary: #3498db;
  --secondary: #e74c3c;
  --padding: 15px;
  --border-radius: 8px;
}

.button {
  background-color: var(--primary);
  padding: var(--padding);
  border-radius: var(--border-radius);
}

.alert {
  background-color: var(--secondary);
  padding: var(--padding);
  border-radius: var(--border-radius);
}
```

### 响应式设计

```css
:root {
  --base-font-size: 16px;
  --spacing: 1rem;
}

@media (min-width: 768px) {
  :root {
    --base-font-size: 18px;
    --spacing: 1.5rem;
  }
}

@media (min-width: 1200px) {
  :root {
    --base-font-size: 20px;
    --spacing: 2rem;
  }
}
```

### 暗黑模式

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #dddddd;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #444444;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
```

## 四、JavaScript 交互

CSS 变量可以通过 JavaScript 动态修改：

```javascript
// 更改变量值
document.documentElement.style.setProperty("--primary-color", "#ff0000");

// 获取变量值
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-color");

// 切换主题
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
}
```

## 五、最佳实践

1. **命名约定**：使用有意义的名称（如`--color-primary`而非`--red`）
2. **备用值**：提供回退值`var(--custom-property, fallback-value)`
3. **组织变量**：按功能分组变量
4. **浏览器支持**：现代浏览器都支持 CSS 变量（IE 除外）
