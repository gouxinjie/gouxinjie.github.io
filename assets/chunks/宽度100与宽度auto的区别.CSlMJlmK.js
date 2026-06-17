const n=`# CSS 中 width: 100% 与 width: auto 的区别

[[toc]]

在前端布局中，**元素宽度的设置**是一个非常常见但容易引起混淆的点。尤其是 **\`width: 100%\`** 与 **\`width: auto\`**，看似相似，但实际行为却大不相同。

## 1. width: 100% 与 width: auto 的基本概念

**width: 100%**

- 意味着元素的内容区宽度 **完全填满父元素的内容区**。
- 不考虑元素自身的 \`padding\` 或 \`border\`（在默认 \`box-sizing: content-box\` 下）。
- 如果有 \`padding\` 和 \`border\`，元素会 **超出父容器**。

**width: auto**

- 元素宽度由 **内容、父容器和布局上下文** 自动计算。
- 对块级元素，默认宽度就是 \`auto\`，会 **自动填满父容器剩余可用空间**，同时考虑 \`padding\` 和 \`border\`。
- 对内联元素，宽度自动适应内容。

## 2. width: 100% 与 auto 的关键区别

| 属性        | 特性说明                     | 注意点                                                                   |
| ----------- | ---------------------------- | ------------------------------------------------------------------------ |
| width: 100% | 强制内容区宽度占满父元素     | \`padding/border\` 会导致实际宽度超过父元素                                |
| width: auto | 宽度根据内容和父容器自动调整 | 内容少时不会撑满整个父元素，内容多时会自动换行或扩大容器（受父容器约束） |

> 💡 简单理解：
>
> - \`auto\` = 灵活、自适应
> - \`100%\` = 强制填满父容器

## 3. 实例对比

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .parent {
        width: 300px;
        padding: 10px;
        border: 2px solid #333;
      }

      .child-100 {
        width: 100%;
        padding: 10px;
        border: 2px solid red;
        background-color: #fdd;
        box-sizing: content-box; /* 浏览器默认布局 */
      }

      .child-auto {
        width: auto;
        padding: 10px;
        border: 2px solid blue;
        background-color: #ddf;
        box-sizing: content-box; /* 浏览器默认布局 */
      }
    </style>
  </head>
  <body>
    <div class="parent">
      s
      <div class="child-100">宽度100%</div>
      <hr style="margin: 10px 0" />
      <div class="child-auto">宽度auto</div>
    </div>
  </body>
</html>
\`\`\`

**宽度 100%的盒子模型表现:**

![](../images/width-1.png)

**宽度 auto 的盒子模型表现:**

![](../images/width-2.png)

**效果分析**：

- \`.child-100\` 的内容区宽度为父元素宽度 300px，再加上 \`padding\` 和 \`border\`，总宽度超过父容器，可能出现溢出。
- \`.child-auto\` 会自动计算宽度，内容、padding、border 都在父元素宽度范围内，不会溢出。

### 使用 box-sizing 修正

在现代布局中，通常推荐统一使用：

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

- \`width: 100%\` 会 **包含 padding 和 border**，不会超出父元素。
- 提高布局一致性，避免“100% 却溢出”的问题。

## 4️. 实际开发中的最佳实践

1. **块级元素默认使用 auto**

   - 灵活适应父容器，避免不必要的溢出问题。

2. **需要铺满父容器时，配合 box-sizing**

   \`\`\`css
   box-sizing: border-box;
   width: 100%;
   \`\`\`

   - 既能填满父容器，又不会超出。

3. **行内元素、内联块元素**

   - 一般使用 \`auto\` 或结合 \`min-width\`/\`max-width\` 控制。

## 5. 总结

- **\`width: auto\`** → 自适应，随内容和父容器调整
- **\`width: 100%\`** → 强制填满父容器，需要注意 padding/border
- **现代布局推荐**：统一 \`box-sizing: border-box\`，再使用 \`width: 100%\` 或 \`auto\` 根据场景选择
`;export{n as default};
