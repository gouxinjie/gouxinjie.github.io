const n=`
# 为什么不能直接访问服务器文件路径（/var/www），必须使用 Nginx？

在前端部署到 Linux 服务器（如 ECS）时，很多开发者都会产生一个疑问：

为什么不能直接通过 <http://IP/var/www/>... 访问打包后的前端项目？
明明文件就在服务器上，为什么还需要 Nginx？

## 一、文件路径 vs HTTP URL

\`\`\`
47.xx.xx.xx/var/www/react-admin/build/index.html
\`\`\`

* 这是服务器上的 **文件系统路径**，不是 HTTP 地址。这是服务器上的 文件系统路径（Filesystem Path），属于操作系统层面。
* 浏览器只能通过 HTTP 请求访问 **服务器上暴露的端口和路径**，比如 \`http://47.xx.xx.xx/\` 或 \`http://47.xx.xx.xx/admin/\`。
* 浏览器并不会去服务器文件系统里找 \`/var/www/...\` 文件，除非你用 **本地文件协议**（\`file:///\`），而这种方式：

  * 不支持路由刷新（SPA 会 404）
  * 不支持跨浏览器资源加载
  * 安全性极差

> 浏览器无法直接访问服务器文件系统, 但是可以通过 HTTP 请求访问服务器上暴露的端口和路径。

## 二、HTTP 服务器的作用

Nginx（或 Apache、Caddy）是 HTTP 服务器，它做了几个关键工作：

1. **端口监听**：默认监听 80（HTTP）或者 443（HTTPS）端口

2. **路径映射**：把 \`http://47.xx.xx.xx/\` 请求映射到服务器上的某个目录，例如 \`/var/www/react-admin/build\`

3. **静态资源处理**：

   * 返回 HTML/CSS/JS 文件
   * 设置缓存、压缩（gzip）
   * 支持 SPA 前端路由：\`try_files $uri /index.html;\`

4. **反向代理**（Next.js、Node 服务）：把请求转发到内部 Node 服务，而不是暴露端口给外网

简单说：

> HTTP 浏览器请求的路径必须由 HTTP 服务器去解析和映射到服务器文件系统，而不是直接访问文件路径。

## 三、如果不用 Nginx，会发生什么

假设你直接访问：

\`\`\`
http://47.xx.xx.xx/var/www/react-admin/build/index.html
\`\`\`

* 没有 HTTP 服务器在监听 \`/var/www/...\`，所以浏览器会报 **404 或连接失败**
* 即使你改成 \`file:///var/www/...\` 打开：

  * 只能本地打开
  * SPA 刷新路由会 404
  * 不能通过网络分享

## 四、为什么必须用 Nginx（或任何 HTTP 服务）

1. **提供 HTTP 协议支持**
   浏览器只能通过 HTTP/HTTPS 请求资源，Nginx 就是这个“协议翻译器”。

2. **映射 URL → 文件系统**
   你可以把 \`/\` 映射到 \`/var/www/react-admin/build\`，浏览器访问 \`/index.html\` 就能返回正确文件。

3. **支持 SPA 路由**
   React/Vue 的前端路由不是文件系统真实路径，需要 Nginx 的 \`try_files\` 或 \`fallback\` 机制。

4. **性能优化**

   * gzip 压缩
   * 缓存策略
   * 静态文件直接送客户端

5. **安全**

   * 避免暴露整个服务器目录
   * 只能访问指定目录

### 🔑 小结

| 直接访问 \`/var/www/...\` | 通过 Nginx 访问             |
| ------------------- | ----------------------- |
| 不被浏览器识别 HTTP 路径     | 浏览器可以访问 URL             |
| SPA 刷新会 404         | \`try_files\` 支持 SPA 路由   |
| 不支持压缩、缓存            | 支持 gzip + Cache-Control |
| 需要暴露整个服务器目录         | 安全可控，只暴露 build/dist     |
`;export{n as default};
