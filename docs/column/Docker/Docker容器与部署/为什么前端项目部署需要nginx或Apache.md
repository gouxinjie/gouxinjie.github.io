# 为什么前端项目部署需要 nginx 或 Apache？

[[toc]]

![compare](../images/compare.png)

::: tip 先一句话结论

因为浏览器不能直接“跑前端项目”，需要一个 Web 服务器把文件“按 HTTP 规则”正确地提供出来，而 Nginx / Apache 就是干这个的。

:::

## 一、前端项目本质是什么？

部署后的前端项目其实就是一堆 **静态资源**：

```
index.html
main.js
style.css
assets/xxx.png
```

浏览器只能通过 **HTTP/HTTPS** 访问这些文件，❌ 不能直接访问你服务器磁盘上的文件。

**为什么不能直接打开 HTML 文件？**

1. 路径问题

```html
<!-- 直接双击 index.html 在浏览器打开 -->
<!-- 会看到： -->
file:///D:/project/dist/index.html

<!-- 资源加载会失败 -->
<script src="/assets/index.js"></script>
<!-- 变成：file:///assets/index.js （不存在） -->
```

2. 模块和 API 限制

- ES 模块：`<script type="module">` 需要 HTTP 服务器
- CORS 限制：AJAX/Fetch 请求在 file:// 协议下被阻止
- 路由问题：Vue Router/React Router 需要服务器支持

## 二、为什么一定要“Web 服务器”？

### 2.1 提供 HTTP 服务

Nginx / Apache 的核心能力：

- 监听 80 / 443 端口
- 处理 HTTP 请求
- 返回正确的文件内容

```
浏览器 ──HTTP──> Nginx ──> index.html
```

没有它：

- 服务器不知道如何响应请求
- 也不会有正确的 headers（Content-Type、Cache 等）

## 三、为什么不能用 Node / 直接拷文件？

**直接拷文件**

- 浏览器不能 `file:///` 访问线上资源
- SPA 路由全部失效

**直接跑 `npm run dev`**

- 开发模式
- 性能差
- 不安全
- 不支持高并发

## 四、Nginx / Apache 在前端部署中的关键作用

### 4.1 静态文件托管（最重要）

```nginx
location / {
  root /usr/share/nginx/html;
  index index.html;
}
```

### 4.2 SPA 路由兜底（非常关键）

前端路由如：

```
/login
/user/123
```

实际服务器没有这些文件

```nginx
try_files $uri $uri/ /index.html;
```

否则刷新直接 404

### 4.3 性能优化（前端非常依赖）

- gzip / brotli 压缩
- HTTP/2
- 静态资源缓存

```nginx
expires 1y;
add_header Cache-Control public;
```

### 4.4 HTTPS & 证书

- TLS 终止
- 自动证书（Let’s Encrypt）

前端项目**必须 HTTPS**

### 4.5 反向代理（现代前端必备）

```nginx
/api/ -> 后端服务
```

- 解决跨域
- 前后端解耦
- 统一域名

## 五、不同 Web 服务器的对比

| 特性         | Nginx       | Apache      | Node.js     | 直接文件  |
| ------------ | ----------- | ----------- | ----------- | --------- |
| 静态文件服务 | ✅ 优秀     | ✅ 优秀     | ✅ 可以     | ❌ 有限   |
| SPA 路由支持 | ✅ 需要配置 | ✅ 需要配置 | ✅ 容易     | ❌ 不支持 |
| 性能         | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐    | ⭐⭐⭐      | N/A       |
| 配置复杂度   | 中等        | 较高        | 低          | 无        |
| 内存占用     | 低          | 中等        | 高          | 无        |
| 生产就绪     | ✅          | ✅          | ✅ 但需优化 | ❌        |

## 六、实际部署示例

### 1. **最简单的 Nginx 配置**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/vue-app;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. **Docker + Nginx 组合**

```dockerfile
# 多阶段构建：Node 构建，Nginx 运行
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. **Apache 配置示例**

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/vue-app

    <Directory /var/www/vue-app>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted

        # SPA 路由重写
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```
