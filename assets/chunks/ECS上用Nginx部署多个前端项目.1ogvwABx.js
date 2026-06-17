const n=`# 在 ECS 上用 Nginx 部署多个前端项目：不使用子路径，利用二级域名管理

在前端项目日益增多的今天，我们常常需要在同一台服务器上部署多个独立的前端应用，例如 React、Vue 甚至 Next.js。很多教程会建议用子路径 \`/react\`、\`/vue\` 来区分项目，但这会带来 \`basePath\` 配置、路由刷新 404、资源引用路径混乱等问题。

本文将详细讲解如何在 **ECS 服务器上，通过 Nginx + 二级域名部署多个前端项目**，无需修改项目 \`basePath\` 或 \`homepage\`，保证部署简单且与生产环境一致。

## 一、部署前的准备

1. **服务器**：一台 ECS 或云服务器，安装好 Linux 系统。
2. **域名**：至少拥有一个主域名，可以配置多个二级域名，例如：

   \`\`\`
   admin.example.com  → React 项目
   blog.example.com   → Vue 项目
   www.example.com    → Next.js 项目
   \`\`\`

   如果暂时没有正式域名，可以在本地电脑 \`hosts\` 文件模拟二级域名测试。
3. **环境**：

   * Nginx（用于静态资源托管和反向代理）
   * Node.js（Next.js 运行时）
   * PM2（用于管理 Node 进程）

## 二、服务器目录结构

为了维护清晰，推荐每个项目单独目录：

\`\`\`
/var/www/
├── react-admin/  react项目
│   └── build/
├── vue-blog/     vue博客项目
│   └── dist/
└── next-site/    next.js项目
    ├── .next/
    └── package.json
\`\`\`

* React / Vue：静态文件构建产物放在 \`build/\` 或 \`dist/\`
* Next.js：保持 SSR 服务运行，\`.next/\` 目录存放构建产物

## 三、Nginx 配置

### 1. React 项目

\`\`\`nginx
server {
    listen 80;
    server_name admin.example.com;

    root /var/www/react-admin/build;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
\`\`\`

> 核心点：通过 \`try_files $uri $uri/ /index.html;\` 支持前端路由刷新，避免 404。

### 2. Vue 项目

\`\`\`nginx
server {
    listen 80;
    server_name blog.example.com;

    root /var/www/vue-blog/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
\`\`\`

> 与 React 类似，Vue 也需要 \`try_files\` 来支持路由刷新。

### 3. Next.js 项目（SSR）

\`\`\`nginx
server {
    listen 80;
    server_name www.example.com;

    gzip on;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

> Next.js 是 SSR，需要保持 Node 服务运行。Nginx 只是反向代理。

## 四、Next.js 的 Node 服务管理

使用 PM2 管理 Node 进程：

\`\`\`bash
cd /var/www/next-site
npm install
pm2 start npm --name next-site -- start
pm2 save
pm2 startup
\`\`\`

* SSR 服务监听 \`localhost:3000\`
* Nginx 将 \`/\` 请求反代到 Node 服务

## 五、临时测试（没有正式域名）

在本地电脑修改 \`hosts\` 文件：

\`\`\`
47.xx.xx.xx admin.test.com
47.xx.xx.xx blog.test.com
47.xx.xx.xx www.test.com
\`\`\`

访问：

\`\`\`
http://admin.test.com
http://blog.test.com
http://www.test.com
\`\`\`

> 这种方式只在本地有效，方便测试 Nginx 配置和前端项目部署。

## 六、GitHub Actions 部署提示

* React / Vue：构建产物直接部署到对应目录，例如 \`/var/www/react-admin/build\`
* Next.js：构建后上传整个项目到服务器，并使用 PM2 reload 更新服务
* 不需要修改 basePath 或子路径，构建出的资源路径即为根路径 \`/\`

> 核心原则：Nginx 通过 \`server_name\` 区分项目，二级域名必须唯一。

## 七、优势总结

* 每个项目访问路径干净，无需 \`/react\` 或 \`/vue\` 前缀
* 不需要修改前端代码的 basePath 或 homepage
* 支持 SPA（React / Vue）路由刷新
* Next.js SSR 可以通过 PM2 + Nginx 高效管理
* 支持未来扩展更多前端项目，只需添加新的 Nginx server 即可
`;export{n as default};
