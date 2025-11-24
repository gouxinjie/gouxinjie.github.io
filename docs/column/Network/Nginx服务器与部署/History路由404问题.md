# 前端 hash、history 模式的区别及 history 路由刷新报 404 问题

[[toc]]

## 1，前端路由原理

在前端单页面(`SPA`)中, 只有一个 html 页面，单纯的浏览器地址改变，不会再去请求新的 html 网页，而是通过监听路由的变化，并利用 JS 动态显示和隐藏页面内容来达到类似多个网页的切换效果；

实现切换的路由模式也分为两种：**hash** 模式 和 **history** 模式。

两种路由模式对比如下：

|          | **hash**                     | **history**               |
| -------- | ---------------------------- | ------------------------- |
| url 显示 | 地址中永远带着 `#`，不美观   | 地址干净、美观            |
| 页面刷新 | 可以加载到 hash 值对应页面   | 可能会出现 404 找不到页面 |
| 支持版本 | 支持低版本浏览器和 IE 浏览器 | HTML5 新推出的 API        |
| 上线部署 | 无需额外配置                 | 需要设置一下 nginx 的配置 |

**注意：**

- 如果用户考虑 url 的规范那么就需要使用`history模式`，因为 history 模式没有#号，是个正常的 url 适合推广宣传。
- 其功能也有区别，比如我们在开发 app 的时候有分享页面，咱们把这个页面分享到第三方的 app 里，有的 app 里面 url 是不允许带有#号的，会被标记为不合法。所以要将#号去除那么就要使用 history 模式。

## 2，hash 模式

**概述：** hash 指的是地址中#号以及后面的字符，这个#就是 hash 符号，中文名哈希符或锚点，哈希符后面的值，我们称之为哈希值；如：

```javascript
http://localhost:31001/#/videoProduce
http://localhost:31001/#/xgplayer
```

这里的`#/videoProduce`和`#/xgplayer`就是 hash。

**特点：** hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对请求后端资源完全没有影响，`因此改变 hash 不会重新加载页面。`

路由的哈希模式其实是利用了 window 可以监听`onhashchange`事件，可以实现监听浏览器地址 hash 值变化，执行相应的 js 切换网页。这么一来，即使前端并没有发起 http 请求它也能够找到对应页面的代码块进行按需加载。

## 3，history 模式

`window.history` 属性指向 `History` 对象，它表示当前窗口的浏览历史，更新 URL 地址不重新发请求。`History` 对象保存了当前窗口访问过的所有页面网址，它提供的一些方法如下：

| 方法 | 描述 |
| --- | --- |
| back() | 该方法转到浏览器会话历史的上一页，与用户单击浏览器的 Back 按钮的行为相同。等价于 `history.go(-1)`。 |
| forward() | 该方法转到浏览器会话历史的下一页，与用户单击浏览器的 forward 按钮的行为相同。 |
| go() | 该方法从会话历史记录中加载特定页面。你可以使用它在历史记录中前后移动，具体取决于你传的参数值。注意：window.history.go()和 go(0) 都会重新加载当前页面; |
| pushState() | 该方法用于在历史中添加一条记录。pushState()方法不会触发页面刷新，只是导致 History 对象发生变化，地址栏会有变化; |
| replaceState() | 该方法用来修改 History 对象的当前记录，用法与 pushState() 方法一样; |

**弊端**：刷新页面会报 404；解决方案如下：

## 4，解决刷新 404 问题

我的 vue 前端项目是使用`nginx`部署到本地的，当路由模式是 hash 模式刷新页面没有任何问题，当是 history 模式时 刷新页面就会报 404 错误；

这是典型的`SPA`页面会出现的一个问题。

![在这里插入图片描述](../images/history.png)

**history 路由模式：**

```javascript
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL, // 应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 “/app/”
  routes
});
```

**原因**：

::: tip 路由刷新为什么会 404？

- 地址栏显示 video/videoProduce，但这是前端路由伪造的路径，磁盘上并不存在 video/videoProduce 这样的实体文件。
- 浏览器刷新 → 服务器去硬盘找 video/videoProduce → 找不到 → 返回 404。
- CSR（客户端渲染）的通病：只有首页 / 能正常返回 index.html，其他深度路径都会暴毙。

:::

我 nginx 代理的项目路径是`/video/` 如果直接访问 `http://localhost/video/`是没有问题的，因为 nginx 能够匹配到 `/video/` 并找到 alias 目录下面的 index.html 文件并运行，也就是启动了前端项目；

但是我访问的是 `/video/videoProduce` 它匹配不到 当然就报 404 了；

```javascript
# 视频演示项目 http协议
location /video/ {
    alias  D:/myProject/deployProject/video/;
    index index.html index.htm;
}
```

**解决方案：**

在 nginx 配置添加一行配置： `try_files $uri $uri/ /index.html last;`

::: tip try_files 做了什么

try_files file1 file2 … fallback;

- 按顺序检查文件是否存在：

1. $uri → 磁盘真实文件（如 /js/app.123.js、/favicon.ico）
2. $uri/ → 目录（可选，一般用于目录索引）
3. /index.html → 兜底，前面都没找到就返回它

- 返回第一个命中的；若全部失败，内部重写到最后的 fallback。

:::

**因此：**

静态资源（JS/CSS/图片）→ 第 1 步就命中，正常返回。  
前端路由路径（/user/123）→ 前两项都不存在 → 回退到 index.html → 浏览器拿到入口页 → 前端路由（Vue-Router / React-Router）读取当前 URL → 渲染对应组件 → 页面正常显示，不会 404。

**解决方案：**

```javascript
# 视频演示项目 http协议
location /video/ {
​    alias  D:/myProject/deployProject/video/;
​    try_files $uri $uri/ /index.html last;
​    index index.html index.htm;
​}
```

vue 官网给出的解决方案就有这条：[https://router.vuejs.org/zh/guide/essentials/history-mode.html](https://router.vuejs.org/zh/guide/essentials/history-mode.html)

## 5，try_file 重定向首页那为什么浏览器地址栏不会改变？

这是一个 **非常典型、但很多人第一次会困惑的问题**：

> 使用 `try_files $uri /index.html`，刷新访问 `/user/123` 明明会 fallback 到 `/index.html`， **那为什么浏览器的地址栏仍然显示 `/user/123`，前端路由页面也正常展示？**

答案：**这正是 SPA（单页应用）工作原理的一部分——由前端路由控制页面展示，URL 保持不变。**

下面我用非常清晰的步骤解释：

### 1. 浏览器地址栏的 URL 是不会因为返回 index.html 而改变的

你访问：

```
https://example.com/user/123
```

刷新时，浏览器发起真实的 HTTP 请求：

```
GET /user/123
```

然后 nginx 执行你的配置：

```nginx
location / {
    try_files $uri /index.html;
}
```

流程是：

1. 检查 `/user/123` 是否存在 → ❌ 没有这个文件
2. fallback → 返回 `/index.html` → ✔ 发送给浏览器

📌 **注意：返回 index.html 只是“响应内容”，不是“重定向”。** 也就是说：

🎯 **服务器返回了 index.html，但是浏览器地址栏不会改成 /index.html** 🎯 **URL 保持 /user/123 不变，这才是 SPA 的特性**

### 2. 为什么前端路由能在 `/user/123` 下正常显示页面？

因为 index.html 只是入口文件，里面会加载你的前端 JS：

例如：

```html
<script src="/assets/index.js"></script>
```

而这个 JS（Vue Router / React Router / etc）会：

1. 读取当前浏览器 URL（仍然是 `/user/123`）
2. 根据 URL 匹配对应的前端路由
3. 渲染正确的页面组件
4. 不需要服务器参与

👉 **前端接管了路由解析，所以页面显示正确的内容。**
