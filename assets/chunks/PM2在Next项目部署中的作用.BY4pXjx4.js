const n=`# PM2在Next项目部署中的作用

在把 Next.js 项目部署到 ECS 的过程中，很多人会先理解 Nginx、Node.js、GitHub Actions，却容易忽略 PM2。

但在真实部署里，PM2 是很关键的一环。它不负责写业务代码，不负责构建项目，也不直接处理 HTTP 入口，但它决定了 Node.js 服务能不能稳定地在服务器后台运行。

这篇文章从当前 Prompt Gallery 项目的部署实践出发，梳理 PM2 的作用、启动时机、和 Node/Nginx 的关系，以及常见问题怎么排查。

## 一、先看整体链路

当前项目的访问链路是：

\`\`\`text
浏览器
  -> Nginx 监听 8080
  -> proxy_pass 到 127.0.0.1:5174
  -> PM2 管理的 Node 进程
  -> node server.js
  -> Next.js 应用
\`\`\`

这条链路里每一层职责都不同：

| 层级 | 作用 |
| --- | --- |
| 浏览器 | 发起页面和接口请求 |
| Nginx | 对外暴露端口、反向代理、后续承载 HTTPS |
| PM2 | 管理 Node.js 服务进程 |
| Node.js | 执行 \`server.js\`，运行 Next.js 服务 |
| Next.js | 处理页面、路由、API、服务端逻辑 |

所以 PM2 不是入口层，也不是业务框架。它更像是服务器上的“进程管家”。

## 二、PM2 是什么

PM2 是 Node.js 生态中常用的进程管理工具。

如果不用 PM2，直接执行：

\`\`\`bash
node server.js
\`\`\`

服务虽然能启动，但会有几个问题：

- 终端关闭后，Node 进程可能随之退出。
- 服务崩溃后不会自动恢复。
- 服务器重启后不会自动启动。
- 日志分散，不方便查看。
- 部署时不好做重载和进程管理。

PM2 解决的就是这些问题。

使用 PM2 后，启动命令变成：

\`\`\`bash
pm2 start server.js --name prompt-gallery
\`\`\`

这时 PM2 会把 Node 服务放到后台，并持续管理它。

## 三、PM2 在当前项目中做什么

当前项目采用 Next.js standalone 部署。

构建后 ECS 上的核心文件是：

\`\`\`text
/var/www/prompt
  server.js
  ecosystem.config.cjs
  .next/
  node_modules/
  public/
  .env.local
\`\`\`

PM2 负责启动这个入口：

\`\`\`text
server.js
\`\`\`

本质上就是：

\`\`\`bash
node /var/www/prompt/server.js
\`\`\`

但实际不会手动执行 \`node server.js\`，而是交给 PM2：

\`\`\`bash
PM2_NAME=prompt-gallery APP_PORT=5174 APP_HOST=127.0.0.1 \\
pm2 startOrReload ecosystem.config.cjs --only prompt-gallery --update-env
\`\`\`

PM2 会读取 \`ecosystem.config.cjs\`，找到应用配置，然后启动 Node 服务。

## 四、Node 是什么时候启动的

Node 不是 Nginx 启动的，也不是用户访问页面时才启动的。

它是在部署流程最后一步启动的。

当前流程是：

\`\`\`text
1. 代码 push 到 main
2. GitHub Actions 拉取源码
3. GitHub Actions 执行 npm ci
4. GitHub Actions 执行 npm run build
5. 生成 Next.js standalone 产物
6. rsync 上传到 ECS /var/www/prompt
7. GitHub Actions 通过 SSH 连接 ECS
8. 执行 pm2 startOrReload
9. PM2 启动 node server.js
10. Node 监听 127.0.0.1:5174
\`\`\`

所以 Node 服务是在部署时启动的，并由 PM2 持续守护。

用户访问页面时，只是请求已经运行中的 Node 服务。

## 五、Nginx 和 PM2 的关系

Nginx 和 PM2 不互相替代。

Nginx 负责对外入口：

\`\`\`nginx
server {
    listen 8080 default_server;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5174;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto http;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
\`\`\`

PM2 负责让 \`127.0.0.1:5174\` 上的 Node 服务保持运行。

如果 PM2 没有启动 Node 服务，Nginx 就会代理失败，浏览器可能看到：

\`\`\`text
nginx error!
The page you are looking for is temporarily unavailable.
\`\`\`

这时问题通常不是 Nginx 页面本身，而是后端 Node 服务不可用。

## 六、为什么 Node 监听 127.0.0.1

当前项目中 Node 服务监听：

\`\`\`text
127.0.0.1:5174
\`\`\`

这表示它只允许 ECS 本机访问，不直接暴露给公网。

外部用户访问的是：

\`\`\`text
http://ECS公网IP:8080
\`\`\`

再由 Nginx 转发到：

\`\`\`text
http://127.0.0.1:5174
\`\`\`

这样做有几个好处：

- Node 服务不直接暴露在公网。
- 后续可以统一在 Nginx 配置域名和 HTTPS。
- 可以和服务器上已有的其他项目共存。
- Nginx 更适合作为入口处理代理、证书、超时和请求头。

## 七、为什么不能继续用 next start

旧部署方式可能会用：

\`\`\`bash
npm run start
\`\`\`

对应 \`package.json\` 中的：

\`\`\`json
{
  "start": "next start -H 127.0.0.1 -p 5174"
}
\`\`\`

但是当前已经改成 Next.js standalone 部署。

standalone 部署的正确启动方式是：

\`\`\`bash
node server.js
\`\`\`

如果 PM2 还在执行旧的 \`npm run start\`，就可能报：

\`\`\`text
sh: next: command not found
\`\`\`

原因是 standalone 产物里不保证存在完整的 \`node_modules/.bin/next\`。它只需要运行 \`server.js\`，不需要在 ECS 上执行 \`next start\`。

所以第一次从旧方案切到 standalone 时，需要删除旧 PM2 进程：

\`\`\`bash
pm2 delete prompt-gallery
\`\`\`

然后重新按 ecosystem 启动：

\`\`\`bash
cd /var/www/prompt
PM2_NAME=prompt-gallery APP_PORT=5174 APP_HOST=127.0.0.1 \\
pm2 start ecosystem.config.cjs --only prompt-gallery --update-env
pm2 save
\`\`\`

之后再部署，就可以直接使用：

\`\`\`bash
pm2 startOrReload ecosystem.config.cjs --only prompt-gallery --update-env
\`\`\`

## 八、ecosystem.config.cjs 是什么

\`ecosystem.config.cjs\` 是 PM2 的应用配置文件。

它描述了：

- 应用名称是什么。
- 启动哪个脚本。
- 工作目录在哪里。
- 注入哪些环境变量。
- 使用几个实例。
- 是否更新环境变量。

当前项目的核心配置是：

\`\`\`js
module.exports = {
  apps: [
    {
      name: process.env.PM2_NAME || 'prompt-gallery',
      script: 'server.js',
      cwd: __dirname,
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.APP_PORT || '5174',
        HOSTNAME: process.env.APP_HOST || '127.0.0.1'
      }
    }
  ]
};
\`\`\`

这里最关键的是：

\`\`\`text
script: 'server.js'
\`\`\`

它说明 PM2 管理的是 standalone 的 \`server.js\`，不是 \`npm run start\`。

## 九、PM2 和 .env.local 的关系

项目里的服务端密钥放在 ECS：

\`\`\`text
/var/www/prompt/.env.local
\`\`\`

例如：

\`\`\`txt
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ALIYUN_OSS_ACCESS_KEY_SECRET=
\`\`\`

PM2 启动 Node 进程时，需要把这些变量注入进去。

不建议直接执行：

\`\`\`bash
source .env.local
\`\`\`

因为 \`.env.local\` 不是 shell 脚本，密钥里如果有特殊字符，可能被 shell 错误解释。

更稳妥的方式是在 \`ecosystem.config.cjs\` 中用 Node.js 读取 \`.env.local\`，再传给 PM2 的 \`env\`。

这样服务启动后，Next.js 的 API 路由就能读取：

\`\`\`ts
process.env.SUPABASE_SERVICE_ROLE_KEY
\`\`\`

这些密钥不会进入前端构建产物，也不会提交到 Git。

## 十、常用 PM2 命令

查看进程列表：

\`\`\`bash
pm2 status
\`\`\`

查看指定应用详情：

\`\`\`bash
pm2 describe prompt-gallery
\`\`\`

查看日志：

\`\`\`bash
pm2 logs prompt-gallery --lines 100
\`\`\`

重启应用：

\`\`\`bash
pm2 restart prompt-gallery
\`\`\`

重新加载 ecosystem 配置：

\`\`\`bash
pm2 startOrReload ecosystem.config.cjs --only prompt-gallery --update-env
\`\`\`

删除旧进程：

\`\`\`bash
pm2 delete prompt-gallery
\`\`\`

保存当前进程列表：

\`\`\`bash
pm2 save
\`\`\`

配置开机自启：

\`\`\`bash
pm2 startup
\`\`\`

执行 \`pm2 startup\` 后，PM2 会输出一条需要复制执行的系统命令。执行完成后，再配合 \`pm2 save\`，服务器重启后应用才能自动恢复。

## 十一、怎么确认 PM2 跑的是正确的服务

执行：

\`\`\`bash
pm2 describe prompt-gallery
\`\`\`

重点看：

\`\`\`text
script path
\`\`\`

如果是：

\`\`\`text
/var/www/prompt/server.js
\`\`\`

说明是正确的 standalone 启动方式。

如果看到类似：

\`\`\`text
npm
\`\`\`

或者日志中反复出现：

\`\`\`text
next start -H 127.0.0.1 -p 5174
\`\`\`

说明 PM2 还在使用旧启动方式，需要删除旧进程后重新启动。

## 十二、怎么确认 Node 服务正常

先看 PM2：

\`\`\`bash
pm2 status
\`\`\`

再看端口：

\`\`\`bash
ss -lntp | grep 5174
\`\`\`

如果正常，应该能看到 5174 被 Node 进程监听。

然后在 ECS 本机测试：

\`\`\`bash
curl -I http://127.0.0.1:5174
\`\`\`

如果这个请求正常，说明 Node 服务本身没问题。

如果外部浏览器仍然打不开，再排查 Nginx、安全组、防火墙。

## 十三、常见故障复盘

### 1. Nginx 显示 50x 错误页

现象：

\`\`\`text
nginx error!
The page you are looking for is temporarily unavailable.
\`\`\`

排查：

\`\`\`bash
pm2 status
pm2 logs prompt-gallery --lines 100
ss -lntp | grep 5174
curl -I http://127.0.0.1:5174
\`\`\`

常见原因是 PM2 没有把 Node 服务正常跑起来。

### 2. sh: next: command not found

现象：

\`\`\`text
sh: next: command not found
\`\`\`

原因是 PM2 仍然在执行旧的 \`npm run start\`。

修复：

\`\`\`bash
cd /var/www/prompt
pm2 delete prompt-gallery
PM2_NAME=prompt-gallery APP_PORT=5174 APP_HOST=127.0.0.1 \\
pm2 start ecosystem.config.cjs --only prompt-gallery --update-env
pm2 save
\`\`\`

### 3. 修改了环境变量但没有生效

如果修改了 ECS 上的：

\`\`\`text
/var/www/prompt/.env.local
\`\`\`

需要重载 PM2：

\`\`\`bash
cd /var/www/prompt
PM2_NAME=prompt-gallery APP_PORT=5174 APP_HOST=127.0.0.1 \\
pm2 startOrReload ecosystem.config.cjs --only prompt-gallery --update-env
pm2 save
\`\`\`

如果修改的是 GitHub Actions Variables 中的 \`NEXT_PUBLIC_*\`，则需要重新触发 GitHub Actions 构建，因为这些变量会进入前端构建产物。

## 十四、PM2 的优点

PM2 对这个项目的价值主要是：

- 让 Node 服务在后台运行。
- 服务崩溃后自动重启。
- 统一查看 stdout 和 error 日志。
- 配合 \`pm2 startup\` 和 \`pm2 save\` 支持服务器重启后自动恢复。
- 部署时可以通过 \`startOrReload\` 重载服务。
- 管理命令简单，适合单机 ECS 项目。

## 十五、PM2 的局限

PM2 适合单机部署，但它不是完整的云原生部署平台。

它的局限包括：

- 多台服务器部署时，需要额外同步和负载均衡。
- 回滚能力不如 Docker 镜像清晰。
- 环境依赖仍然安装在 ECS 上。
- 进程状态依赖服务器本身。

如果后续项目规模变大，可以考虑 Docker、Docker Compose、Kubernetes 或云厂商容器服务。

## 十六、最终总结

PM2 在当前 Next.js 项目中的定位很清楚：

\`\`\`text
GitHub Actions 负责构建
rsync 负责上传产物
PM2 负责运行和守护 Node 进程
Node 负责执行 server.js
Next.js 负责页面和 API
Nginx 负责对外入口和反向代理
\`\`\`

它不是替代 Nginx，也不是替代 Node。它的核心价值是让 \`node server.js\` 这个服务长期、稳定、可观测地运行在 ECS 上。

对于当前这种单机 ECS 部署来说，PM2 是一个务实的选择。只要确认它启动的是 \`server.js\`，环境变量注入正确，5174 端口正常监听，整个 Next.js 服务链路就基本清晰了。
`;export{n as default};
