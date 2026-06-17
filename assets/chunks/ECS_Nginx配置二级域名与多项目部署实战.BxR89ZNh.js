const n=`
# ECS + Nginx 配置二级域名与多项目部署实战

## 一、写在前面

最近我买了一个阿里云 ECS，拥有一个公网 IP（比如 \`10.101.10.206\`），同时注册了一个域名 \`gouxinjie.com\`。
我需要在这个服务器上部署**多个前端/后端项目**，并且要求：

- 每个项目通过**不同的二级域名**访问（如 \`prompt.gouxinjie.com\`、\`archive.gouxinjie.com\`）
- 访问时**不用加端口号**，即使用标准的 \`http://xxx.com\` 形式
- 页面加载速度要快，配置 Gzip 压缩、静态资源缓存
- 配置要规范，不同项目用独立的 Nginx 配置文件

在配置过程中我遇到了诸如 \`ERR_NAME_NOT_RESOLVED\`、\`default_server\` 捕获所有请求、\`www\` 解析不生效等一系列问题，这里我把完整的配置思路、步骤、避坑点整理成文，希望能帮到有同样需求的人。

## 二、整体思路

用户访问 \`http://二级域名.gouxinjie.com\` 时，请求会先经过 **DNS 解析**，指向我的 ECS 公网 IP（\`10.101.10.206\`）。
ECS 上的 **Nginx** 监听 \`80\` 端口，根据请求的 \`Host\` 头（即域名）反向代理到对应的本地后端端口（如 \`5174\`、\`3000\`），或者直接返回静态文件。

**核心**：Nginx 作为“反向代理 + 静态服务器”，一个 Nginx 可以服务多个域名/项目。

## 三、环境与工具

- **服务器**：阿里云 ECS（CentOS / Alibaba Cloud Linux）
- **Web 服务器**：Nginx
- **域名**：\`gouxinjie.com\`（阿里云购买）
- **项目 A**：监听 \`127.0.0.1:5174\`
- **项目 B**：监听 \`127.0.0.1:3000\`

## 四、详细步骤

### 1. 域名解析设置

![](../images/domain-1.png)

---

![](../images/domain-2.png)

在阿里云 DNS 控制台，为 \`gouxinjie.com\` 添加 **A 记录**：

| 主机记录 | 记录类型 | 记录值            | 说明               |
|----------|----------|-------------------|------------------|
| @        | A        | 10.101.10.206     | 根域名 \`gouxinjie.com\` |
| www      | A        | 10.101.10.206     | \`www.gouxinjie.com\`   |
| prompt   | A        | 10.101.10.206     | 二级域名             |
| archive  | A        | 10.101.10.206     | 二级域名             |

> **坑点**：新加的 \`www\` 或二级域名不会立即生效，因为本地 DNS 有缓存。
> 解决方法：
>
> - 等待 10~30 分钟
> - 执行 \`ipconfig /flushdns\`（Windows）或 \`sudo dscacheutil -flushcache\`（Mac）
> - 使用 \`nslookup prompt.gouxinjie.com\` 验证是否解析到正确 IP

### 2. 配置 Nginx – 根治 \`default_server\` 抢占问题

这是新手最容易踩的坑。Nginx 根配置文件 \`/etc/nginx/nginx.conf\` 中有一个 \`default_server\` 块：

\`\`\`nginx
server {
    listen       80 default_server;   # 默认服务器
    server_name  _;                   # 匹配所有未配置的域名
    root         /var/www/blog;
    ...
}
\`\`\`

这个块会**拦截**所有未明确 \`server_name\` 的请求，导致你的二级域名访问被“抢”走，显示根域名的博客内容。

#### 解决方法

**方案一：去掉 \`default_server\`（推荐）**

\`\`\`nginx
server {
    listen       80;                  # 去掉 default_server
    server_name  _;
    ...
}
\`\`\`

**方案二：将此 \`server\` 块整体删除或注释**（如果不再需要）

修改后必须重载 Nginx：

\`\`\`bash
nginx -t && nginx -s reload
\`\`\`

> 这一步非常关键，否则你配再多二级域名都不会生效。

### 3. 为每个项目创建独立的 Nginx 配置文件

在 \`/etc/nginx/conf.d/\` 目录下，为每个项目新建一个 \`.conf\` 文件。

#### 项目 A：\`prompt.gouxinjie.com\` → 端口 5174

文件：\`/etc/nginx/conf.d/prompt.conf\`

\`\`\`nginx
server {
    listen 80;
    server_name prompt.gouxinjie.com;

    location / {
        proxy_pass http://127.0.0.1:5174;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
\`\`\`

#### 项目 B：\`archive.gouxinjie.com\` → 端口 3000

文件：\`/etc/nginx/conf.d/archive.conf\`

\`\`\`nginx
server {
    listen 80;
    server_name archive.gouxinjie.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

每个配置文件互相独立，互不干扰，便于管理。

**📝 回顾一下你现在的架构**

\`\`\`
                    ┌─────────────────────────────────────┐
                    │            Nginx (端口 80)           │
                    │  根据 server_name 分发请求           │
                    └─────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│ prompt.gouxinjie.com  │   │ archive.gouxinjie.com │   │ gouxinjie.com         │
│ → 127.0.0.1:5174      │   │ → 127.0.0.1:3000      │   │ → /var/www/blog       │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
\`\`\`

### 4. 安全组放行 80 端口

即使 Nginx 配置正确，如果阿里云安全组没有放行 **80 端口**，外网仍然无法访问。

- 登录阿里云 ECS 控制台 → 安全组 → 配置规则 → 入方向
- 添加规则：端口范围 \`80/80\`，授权对象 \`0.0.0.0/0\`

> 注意：**禁止**对后端端口（5174、3000）开放外网访问，只允许 Nginx 在本地 \`127.0.0.1\` 转发，提高安全性。

### 5. Gzip 与缓存优化

#### 5.1 Gzip 全局配置

在 \`/etc/nginx/nginx.conf\` 的 \`http\` 块中添加：

\`\`\`nginx
http {
    # 启用 Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_disable "msie6";
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        application/atom+xml
        image/svg+xml
        font/ttf
        font/otf
        application/vnd.ms-fontobject
        application/x-font-ttf;
}
\`\`\`

这样所有站点自动继承 Gzip 压缩，减少传输体积 70%~90%。

#### 5.2 缓存策略

**动态内容（反向代理）禁止缓存：**

\`\`\`nginx
location / {
    proxy_pass http://127.0.0.1:5174;
    add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    add_header Pragma "no-cache" always;
    add_header Expires "0" always;
}
\`\`\`

**静态资源（图片、CSS、JS）启用强缓存：**

\`\`\`nginx
location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
\`\`\`

> 将静态缓存配置放在各个项目的 \`server\` 块内，不要放在全局 \`http\` 块，因为不同项目的静态资源路径不同。

### 6. 关于 \`proxy_http_version 1.1\` 能否改为 2.0 的澄清

**不能**。Nginx 反向代理到后端服务（如 Node.js、Java、Go）**只支持 HTTP/1.1**。

- 客户端 ↔ Nginx：可以开启 HTTP/2（需要 HTTPS）
- Nginx ↔ 后端服务：只能 HTTP/1.1，但可以通过 \`keepalive\` 优化连接复用

这是官方设计，没有收益实现后端 HTTP/2。
如果你希望前端网页加载更快，应配置 HTTPS + HTTP/2（见下文扩展）。

## 五、验证与测试

1. **检查 DNS 解析**

   \`\`\`bash
   nslookup prompt.gouxinjie.com
   \`\`\`

   应返回 \`10.101.10.206\`

2. **检查 Nginx 配置**

   \`\`\`bash
   nginx -t
   \`\`\`

3. **重载 Nginx**

   \`\`\`bash
   nginx -s reload
   \`\`\`

4. **浏览器访问**
   - \`http://prompt.gouxinjie.com\` → 项目 A
   - \`http://archive.gouxinjie.com\` → 项目 B
   - \`http://gouxinjie.com\` → 原静态博客

5. **检查 Gzip 是否生效**
   打开浏览器开发者工具 → Network，查看响应头 \`Content-Encoding: gzip\`

## 六、常见错误与解决方案

| 错误现象                                | 原因                        | 解决方法                                   |
|---------------------------------------|---------------------------|------------------------------------------|
| \`ERR_NAME_NOT_RESOLVED\`               | DNS 解析失败或未生效           | 添加 A 记录，清理本地 DNS 缓存               |
| 二级域名访问显示根域名内容               | \`default_server\` 捕获了请求 | 去掉 \`default_server\` 或删除该 server 块   |
| \`www\` 可以访问，根域名不行               | 只配了 \`www\` 没配 \`@\`        | 添加主机记录为 \`@\` 的 A 记录                |
| 访问 \`http://域名:8081\` 才通，不加端口不行 | Nginx 监听的是 8081 端口       | 改为 \`listen 80\`，并开放安全组 80 端口      |
| 修改配置后不生效                        | 未重载 Nginx                 | 执行 \`nginx -s reload\`                    |
| Gzip 不生效                           | 未配置 \`gzip_types\` 或未重载  | 添加常见 MIME 类型，重载 Nginx               |

## 七、扩展：配置 HTTPS + HTTP/2（可选但推荐）

如果你希望网站更安全，并且启用 HTTP/2 加速：

1. 在阿里云申请免费 SSL 证书（DigiCert 或 Symantec）
2. 下载证书，上传到 \`/etc/nginx/ssl/\`
3. 修改 \`server\` 块：

\`\`\`nginx
server {
    listen 443 ssl http2;
    server_name prompt.gouxinjie.com;

    ssl_certificate /etc/nginx/ssl/prompt.gouxinjie.com.pem;
    ssl_certificate_key /etc/nginx/ssl/prompt.gouxinjie.com.key;

    location / {
        proxy_pass http://127.0.0.1:5174;
        ...
    }
}

# 可选：HTTP 自动跳转 HTTPS
server {
    listen 80;
    server_name prompt.gouxinjie.com;
    return 301 https://$host$request_uri;
}
\`\`\`

这样用户访问 \`http://\` 会自动跳转到 \`https://\`，同时享受 HTTP/2 的多路复用优势。

## 八、总结

通过以上步骤，我成功实现了：

- 一个 Nginx 承载多个项目，按二级域名分发
- 标准 80 端口访问，无端口号
- Gzip 压缩 + 合理的缓存策略
- 配置文件分离，便于管理和扩展

整个过程的核心思想就是：**DNS 解析 + Nginx 反向代理 + 按域名分流**。
只要掌握这个模式，以后增加新项目只需要：

1. 添加 DNS 记录
2. 新建 Nginx 配置文件
3. 重载 Nginx

三步上线，非常高效。

希望这篇实战记录能帮助到正在被 Nginx 配置折磨的你。如果有任何疑问或更好的建议，欢迎留言交流。

> 本文配置环境：CentOS 7 / Alibaba Cloud Linux 3，Nginx 1.20+
> 首次发布时间：2026 年 6 月

---
`;export{n as default};
