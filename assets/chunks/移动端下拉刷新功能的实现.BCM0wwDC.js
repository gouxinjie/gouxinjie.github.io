const n=`# HTML + JS 实现下拉刷新效果

[[toc]]

## 一、实现目标

- ✅ 支持“下拉刷新”交互（仅在顶部触发）
- ✅ 拖拽时跟手滑动
- ✅ 松开后回弹平滑
- ✅ 模拟刷新加载并恢复
- ✅ 注释清晰、兼容性好

最终效果如下：

> 👉 用户向下拖拽 → 出现刷新指示器 → 松手触发刷新 → 动画回弹恢复。

**如图所示：**

![下拉刷新效果](../images/refersh.gif){width=80%}

## 二、核心思路

1. **监听触摸事件 (\`touchstart\`, \`touchmove\`, \`touchend\`)**

   - 记录手指起始位置；
   - 计算拖拽距离；
   - 在滚动条位于顶部时才允许触发下拉。

2. **用 CSS \`transform: translateY()\` 来移动内容**

   - 不改变布局（性能高，不会频繁 reflow）；
   - 拖拽时实时更新位移；
   - 回弹时添加动画过渡。

3. **设置触发阈值**

   - 下拉距离达到一定值（如 70px）才触发刷新；
   - 否则松手直接回弹。

4. **使用 \`transition\` 实现平滑回弹**

   - 拖拽阶段移除 transition；
   - 松手后再添加 transition；
   - 动画结束后清理状态。

## 三、完整源码

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>下拉刷新效果 - 原生实现</title>
    <style>
      /* === 基础样式 === */
      html,
      body {
        margin: 0;
        height: 100%;
        overscroll-behavior-y: contain; /* 阻止浏览器默认回弹刷新 */
        -webkit-user-select: none; /* 禁止选中文本 */
      }

      .app {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      /* === 顶部刷新指示器 === */
      .ptr {
        height: 0; /* 初始高度为0 */
        display: flex;
        align-items: flex-end;
        justify-content: center;
        overflow: visible;
      }

      .indicator {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid rgba(0, 0, 0, 0.15);
        border-top-color: #007bff;
        transform-origin: center;
        opacity: 0;
      }

      /* 下拉中显示指示器 */
      .ptr.pull .indicator {
        opacity: 1;
      }

      /* 刷新中旋转动画 */
      .ptr.refreshing .indicator {
        animation: spin 1s linear infinite;
        opacity: 1;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* === 主内容区 === */
      .content {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        background: #fafafa;
        padding: 16px;
        transform: translateY(0);
      }

      /* 添加过渡动画的类（松手阶段） */
      .animate {
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      }
    </style>
  </head>
  <body>
    <div class="app">
      <div class="ptr" id="ptr">
        <div class="indicator" id="indicator"></div>
      </div>
      <div class="content" id="content">
        <h2>下拉刷新</h2>
        <p>向下拉看看吧～</p>
        <div id="list"></div>
      </div>
    </div>

    <script>
      /**
       * 下拉刷新核心逻辑
       * @author gxj
       */
      (function () {
        // DOM 引用
        const content = document.getElementById("content");
        const ptr = document.getElementById("ptr");
        const indicator = document.getElementById("indicator");
        const list = document.getElementById("list");

        // 初始化列表内容
        for (let i = 1; i <= 30; i++) {
          const p = document.createElement("p");
          p.textContent = "列表项 " + i;
          list.appendChild(p);
        }

        // 配置参数
        const THRESHOLD = 70; // 触发刷新阈值
        const MAX_PULL = 150; // 最大可下拉距离
        let startY = 0; // 手指起始位置
        let pulling = false; // 是否正在下拉
        let canPull = false; // 是否允许下拉
        let refreshing = false; // 是否正在刷新

        /** touchstart: 判断是否可以下拉 **/
        content.addEventListener(
          "touchstart",
          (e) => {
            if (refreshing) return;
            if (content.scrollTop <= 0) {
              canPull = true;
              startY = e.touches[0].clientY;
              content.classList.remove("animate"); // 去除过渡，保持跟手
            } else {
              canPull = false;
            }
          },
          { passive: true }
        );

        /** touchmove: 计算下拉距离并实时更新UI **/
        content.addEventListener(
          "touchmove",
          (e) => {
            if (!canPull || refreshing) return;
            const delta = e.touches[0].clientY - startY;
            if (delta > 0) {
              e.preventDefault(); // 阻止默认滚动
              pulling = true;
              // 添加阻尼效果，防止拉得太远
              const offset = Math.min(delta * 0.5, MAX_PULL);
              // 同步移动内容和指示器
              ptr.style.height = offset + "px";
              content.style.transform = \`translateY(\${offset}px)\`;
              ptr.classList.toggle("pull", offset > 0);
              // 旋转指示器，作为“下拉进度”
              indicator.style.transform = \`rotate(\${(offset / THRESHOLD) * 180}deg)\`;
            }
          },
          { passive: false }
        );

        /** touchend: 松手后决定是否触发刷新 **/
        content.addEventListener("touchend", async () => {
          if (!pulling) return;
          pulling = false;
          content.classList.add("animate"); // ✅ 添加回弹动画
          const h = parseFloat(ptr.style.height || 0);

          if (h >= THRESHOLD) {
            // === 触发刷新 ===
            refreshing = true;
            ptr.classList.add("refreshing");
            ptr.style.height = THRESHOLD + "px";
            content.style.transform = \`translateY(\${THRESHOLD}px)\`;

            await onRefresh(); // 执行异步刷新逻辑

            // === 刷新完成，平滑回弹 ===
            ptr.classList.remove("refreshing");
            ptr.style.height = "0px";
            content.style.transform = "translateY(0)";
            // 等待动画完成后解除动画类
            setTimeout(() => {
              refreshing = false;
              content.classList.remove("animate");
            }, 350);
          } else {
            // === 未超过阈值，直接回弹 ===
            ptr.style.height = "0px";
            content.style.transform = "translateY(0)";
            setTimeout(() => content.classList.remove("animate"), 350);
          }
        });

        /**
         * 模拟异步刷新函数
         * 真实场景中可在此发起接口请求
         */
        function onRefresh() {
          return new Promise((resolve) => {
            setTimeout(() => {
              const p = document.createElement("p");
              p.textContent = "刷新时间：" + new Date().toLocaleTimeString();
              list.prepend(p);
              resolve();
            }, 1200);
          });
        }
      })();
    <\/script>
  </body>
</html>
\`\`\`

## 四、核心逻辑详解

| 步骤        | 事件             | 关键点                  | 说明                                         |
| ----------- | ---------------- | ----------------------- | -------------------------------------------- |
| 1️⃣ 触摸开始 | \`touchstart\`     | 判断是否滚动到顶部      | 只有当 \`scrollTop === 0\` 才允许触发下拉      |
| 2️⃣ 拖拽中   | \`touchmove\`      | 实时计算下拉距离        | 用 \`translateY\` 实现“跟手”效果，阻尼系数 0.5 |
| 3️⃣ 松手     | \`touchend\`       | 判断阈值                | 超过阈值触发刷新，否则回弹                   |
| 4️⃣ 刷新中   | Promise 模拟请求 | 添加 \`.refreshing\` 动画 | 指示器旋转、内容保持下移                     |
| 5️⃣ 刷新完成 | 动画回弹         | 移除 \`.animate\`         | 平滑回到初始位置                             |

## 五、让回弹更流畅的关键

1. **拖拽阶段禁用 transition**

   \`\`\`js
   content.classList.remove("animate");
   \`\`\`

   👉 避免手指拖动时动画滞后，保证“跟手”。

2. **松手阶段再添加 transition**

   \`\`\`js
   content.classList.add("animate");
   \`\`\`

   👉 让松开后的回弹自然、平滑。

3. **使用合适的缓动曲线**

   \`\`\`css
   transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
   \`\`\`

   👉 模拟原生 iOS 弹性效果（比默认 \`ease\` 更顺滑）。

4. **在动画结束后清理状态**

   \`\`\`js
   setTimeout(() => content.classList.remove("animate"), 350);
   \`\`\`

   👉 保证下次下拉时依旧流畅。

📘 **延伸阅读**

- [MDN - Touch Events](https://developer.mozilla.org/zh-CN/docs/Web/API/Touch_events)
- [overscroll-behavior 属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overscroll-behavior)
`;export{n as default};
