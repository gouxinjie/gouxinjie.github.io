const n=`# Next项目自动部署到ECS-优化版

这篇文章记录一次 Next.js 项目从“把源码上传到 ECS 再构建”，优化为“GitHub Actions 构建产物，ECS 只运行服务”的完整过程。

项目背景是一个基于 Next.js 的 Prompt Gallery 应用，包含页面渲染、接口路由、Supabase 数据访问、OSS 图片上传等能力。它不是纯静态站点，所以不能简单把 \`dist\` 或 \`.next\` 当静态文件丢给 Nginx，而是需要一个 Node.js 服务承载 Next.js 的服务端能力。

## 一、最开始的部署方式

最初的方案比较直接：

\`\`\`text
GitHub Actions
  -> SSH 到 ECS
  -> git clone 或 rsync 上传源码
  -> ECS 执行 npm install
  -> ECS 执行 npm run build
  -> PM2 执行 npm run start
  -> Nginx 反向代理到 127.0.0.1:5174
\`\`\`

这个方案能跑起来，但问题也明显：

- ECS 需要能稳定访问 GitHub 和 npm registry。
- ECS 上会保留完整源码。
- 每次部署都在 ECS 上构建，占用服务器 CPU 和内存。
- 如果 ECS 网络访问 GitHub 不稳定，部署会卡在 \`git clone\`。
- 如果 \`node_modules\` 或构建缓存状态不一致，排查会比较麻烦。

实际部署时就遇到过类似错误：

\`\`\`text
fatal: unable to access 'https://github.com/xxx/xxx.git/': Empty reply from server
\`\`\`

这个错误不是代码问题，而是 ECS 到 GitHub 的网络链路不稳定。既然 GitHub Actions 本身就在 GitHub 环境里运行，让 Actions 拉代码、安装依赖、构建项目会更合理。

## 二、优化后的整体方案

优化后的核心思路是：

> 构建放在 GitHub Actions，ECS 只接收可运行产物并负责运行。

架构可以理解为：

\`\`\`mermaid
flowchart TD
    A["开发者 push 到 main"] --> B["GitHub Actions 拉取源码"]
    B --> C["npm ci 安装依赖"]
    C --> D["npm run build 构建 Next.js"]
    D --> E["生成 standalone 运行产物"]
    E --> F["rsync 上传到 ECS /var/www/prompt"]
    F --> G["PM2 启动 server.js"]
    G --> H["Nginx 反向代理到 127.0.0.1:5174"]
    H --> I["用户通过 IP 或域名访问"]
\`\`\`

优化后的部署流程：

\`\`\`text
GitHub Actions
  -> actions/checkout 拉取源码
  -> npm ci
  -> npm run build
  -> 整理 .next/standalone 产物
  -> rsync 上传 deploy-artifact 到 /var/www/prompt
  -> SSH 到 ECS
  -> PM2 startOrReload server.js
  -> Nginx 反向代理访问
\`\`\`

这样 ECS 不再执行：

\`\`\`text
git clone
npm install
npm run build
\`\`\`

ECS 仍然需要：

\`\`\`text
Node.js
PM2
Nginx
rsync
生产环境 .env.local
\`\`\`

## 三、为什么 Next.js 不能直接用 Nginx root 访问

这个项目不是纯静态站。

它包含这些服务端能力：

- \`/api/cases/list\`
- \`/api/submissions/create\`
- \`/api/upload/image-policy\`
- \`/api/admin/*\`
- 服务端读取 Supabase service role key
- 服务端生成 OSS 上传策略

所以不能这样访问：

\`\`\`nginx
root /var/www/prompt;
index index.html;
\`\`\`

正确方式是：

\`\`\`text
浏览器
  -> Nginx
  -> proxy_pass http://127.0.0.1:5174
  -> PM2 管理的 Next.js server.js
\`\`\`

也就是说，Nginx 不是直接读取项目文件，而是把请求转发给 Node.js 服务。

## 四、Next.js standalone 是什么

Next.js 支持 \`output: 'standalone'\`。

在 \`next.config.ts\` 中配置：

\`\`\`ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone'
};

export default nextConfig;
\`\`\`

构建后会生成：

\`\`\`text
.next/standalone/
\`\`\`

这个目录里包含运行 Next.js 服务所需的最小文件集合，通常包括：

\`\`\`text
server.js
node_modules/
.next/server/
package.json
\`\`\`

但是要注意，\`.next/static\` 和 \`public\` 需要额外复制进去：

\`\`\`text
.next/static
public
\`\`\`

否则页面静态资源可能无法正常加载。

## 五、环境变量应该放在哪里

改成 GitHub Actions 构建后，环境变量要分两类。

第一类是构建期前端变量，必须放在 GitHub Actions 中：

\`\`\`text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_UPLOAD_POLICY_ENDPOINT
ENABLE_HTTPS_HEADERS
\`\`\`

原因是 \`NEXT_PUBLIC_*\` 会在 \`npm run build\` 时写入前端构建产物。现在构建发生在 GitHub Actions，所以这些变量必须在 GitHub Actions 里能读到。

第二类是运行时服务端密钥，应该只放在 ECS 的 \`.env.local\`：

\`\`\`text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ALIYUN_OSS_REGION
ALIYUN_OSS_BUCKET
ALIYUN_OSS_ACCESS_KEY_ID
ALIYUN_OSS_ACCESS_KEY_SECRET
ALIYUN_OSS_PUBLIC_BASE_URL
\`\`\`

这类密钥不应该写入 GitHub Variables，也不应该提交到仓库。

推荐拆分如下：

| 变量 | 放置位置 | 原因 |
| --- | --- | --- |
| \`NEXT_PUBLIC_SUPABASE_URL\` | GitHub Variables | 前端公开变量，构建期需要 |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | GitHub Variables | 前端公开变量，构建期需要 |
| \`ENABLE_HTTPS_HEADERS\` | GitHub Variables 和 ECS \`.env.local\` | 构建安全响应头时需要，运行时也保持一致 |
| \`SUPABASE_SERVICE_ROLE_KEY\` | ECS \`.env.local\` | 服务端密钥，不能暴露 |
| \`ALIYUN_OSS_ACCESS_KEY_SECRET\` | ECS \`.env.local\` | 服务端密钥，不能暴露 |

## 六、GitHub Actions 配置

仓库中需要配置 Secrets：

\`\`\`text
ECS_HOST      ECS 公网 IP 或域名
ECS_USER      SSH 用户，例如 root
ECS_SSH_KEY   SSH 私钥内容
ECS_PORT      SSH 端口，通常是 22，可以不填
\`\`\`

仓库中需要配置 Variables：

\`\`\`text
ECS_PATH                         /var/www/prompt
NEXT_PUBLIC_SUPABASE_URL         Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    Supabase anon key
NEXT_PUBLIC_UPLOAD_POLICY_ENDPOINT  可选，默认 /api/upload/image-policy
ENABLE_HTTPS_HEADERS             没有 HTTPS 时填 false
\`\`\`

这里有一个容易踩坑的点：

\`\`\`text
Missing NEXT_PUBLIC_SUPABASE_URL
\`\`\`

这个错误说明 GitHub Actions 构建阶段没有读到 \`NEXT_PUBLIC_SUPABASE_URL\`。它不是 ECS \`.env.local\` 缺失，而是 GitHub Actions 的 Variables 或 Secrets 没配置。

## 七、GitHub Actions 核心流程

核心流程可以拆成几步。

第一步，安装依赖并构建：

\`\`\`yaml
- name: Install dependencies
  run: npm ci

- name: Build Next.js standalone artifact
  run: npm run build
\`\`\`

第二步，整理部署产物：

\`\`\`yaml
- name: Prepare deploy artifact
  run: |
    set -e
    rm -rf deploy-artifact
    mkdir -p deploy-artifact/.next
    cp -R .next/standalone/. deploy-artifact/
    cp -R .next/static deploy-artifact/.next/static
    if [ -d public ]; then cp -R public deploy-artifact/public; fi
    cp package.json package-lock.json next.config.ts deploy-artifact/
\`\`\`

第三步，上传产物到 ECS：

\`\`\`yaml
- name: Upload artifact to ECS
  run: |
    set -e
    rsync -az --delete \\
      --exclude='.env' \\
      --exclude='.env.local' \\
      -e "ssh -i ~/.ssh/ecs_key -p $ECS_PORT" \\
      deploy-artifact/ \\
      "$ECS_USER@$ECS_HOST:$ECS_PATH/"
\`\`\`

这里排除了 \`.env.local\`，是为了避免覆盖 ECS 上的生产环境密钥。

第四步，重启服务：

\`\`\`yaml
- name: Restart standalone server on ECS
  run: |
    set -e
    ssh -i ~/.ssh/ecs_key -p "$ECS_PORT" "$ECS_USER@$ECS_HOST" "cd '$ECS_PATH' && \\
      if ! command -v node >/dev/null 2>&1; then echo 'Node.js is required on ECS' && exit 1; fi && \\
      if ! command -v pm2 >/dev/null 2>&1; then npm install -g pm2; fi && \\
      PM2_NAME='prompt-gallery' APP_PORT='5174' APP_HOST='127.0.0.1' pm2 startOrReload ecosystem.config.cjs --only 'prompt-gallery' --update-env && \\
      pm2 save"
\`\`\`

## 八、为什么不能继续用 npm run start

旧方式里 PM2 启动的是：

\`\`\`text
npm run start
\`\`\`

项目里的 \`start\` 命令是：

\`\`\`json
{
  "start": "next start -H 127.0.0.1 -p 5174"
}
\`\`\`

但是 standalone 部署后，ECS 上不再有完整项目依赖，也不一定存在 \`node_modules/.bin/next\`。因此会报：

\`\`\`text
sh: next: command not found
\`\`\`

standalone 正确启动方式是：

\`\`\`text
node server.js
\`\`\`

所以 PM2 需要从旧的 \`npm run start\` 切换为 \`server.js\`。

如果旧 PM2 进程已经存在，第一次切换时建议手动执行一次：

\`\`\`bash
cd /var/www/prompt
pm2 delete prompt-gallery
PM2_NAME=prompt-gallery APP_PORT=5174 APP_HOST=127.0.0.1 pm2 start ecosystem.config.cjs --only prompt-gallery --update-env
pm2 save
\`\`\`

之后再部署，\`pm2 startOrReload\` 就能正常复用新配置。

## 九、PM2 ecosystem 配置为什么要读取 .env.local

生产环境的 \`.env.local\` 放在 ECS：

\`\`\`bash
/var/www/prompt/.env.local
\`\`\`

PM2 启动时需要把里面的服务端密钥注入到 Node.js 进程。

不推荐这样做：

\`\`\`bash
source .env.local
\`\`\`

因为 \`.env.local\` 不是 shell 脚本，里面的特殊字符可能被 shell 错误解释。

更稳妥的做法是在 \`ecosystem.config.cjs\` 里用 Node.js 解析：

\`\`\`js
const fs = require('fs');
const path = require('path');

/**
 * 解析 dotenv 文件内容，避免通过 shell source 解释密钥。
 * @param {string} filePath 环境变量文件路径。
 * @returns {Record<string, string>} 解析后的环境变量。
 */
function readDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return fs.readFileSync(filePath, 'utf8').split(/\\r?\\n/).reduce((env, line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return env;

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex <= 0) return env;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
    return env;
  }, {});
}

const localEnv = readDotEnv(path.join(__dirname, '.env.local'));

module.exports = {
  apps: [
    {
      name: process.env.PM2_NAME || 'prompt-gallery',
      script: 'server.js',
      cwd: __dirname,
      exec_mode: 'fork',
      instances: 1,
      env: {
        ...localEnv,
        NODE_ENV: 'production',
        PORT: process.env.APP_PORT || '5174',
        HOSTNAME: process.env.APP_HOST || '127.0.0.1'
      }
    }
  ]
};
\`\`\`

## 十、ECS 上的 Nginx 配置

因为服务器上已有 \`/var/www/blog\` 项目占用 80 端口，所以不要动原来的 80 端口站点。可以先新增一个 8080 端口入口：

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

        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root html;
    }
}
\`\`\`

访问地址：

\`\`\`text
http://ECS公网IP:8080
\`\`\`

还需要在 ECS 安全组中放行 \`8080\` 端口。

## 十一、HTTP 访问时的 HTTPS 头问题

部署过程中还遇到过这个错误：

\`\`\`text
Failed to load resource: net::ERR_SSL_PROTOCOL_ERROR
Unsafe attempt to load URL https://IP:8080/ from frame with URL http://IP:8080/
\`\`\`

原因是项目开启了类似 \`upgrade-insecure-requests\` 或 HSTS 的 HTTPS 相关响应头，浏览器会把资源请求升级成 HTTPS。

如果当前只有 IP 和 HTTP 访问，必须保持：

\`\`\`text
ENABLE_HTTPS_HEADERS=false
\`\`\`

而且它要同时注意两个位置：

\`\`\`text
GitHub Actions Variables
ECS /var/www/prompt/.env.local
\`\`\`

尤其是 GitHub Actions Variables，因为安全响应头会在构建时进入 Next.js 配置。修改后需要重新触发一次部署。

## 十二、Nginx 50x 的排查过程

如果浏览器看到：

\`\`\`text
nginx error!
The page you are looking for is temporarily unavailable.
\`\`\`

这通常不是页面代码问题，而是 Nginx 反向代理的后端服务不可用。

按顺序检查：

\`\`\`bash
pm2 status
pm2 logs prompt-gallery --lines 100
ss -lntp | grep 5174
curl -I http://127.0.0.1:5174
\`\`\`

判断方式：

\`\`\`text
ss 没有 5174
=> Next.js 服务没启动。

curl 127.0.0.1:5174 失败
=> PM2 进程异常或端口不对。

curl 127.0.0.1:5174 正常，但外部访问失败
=> 检查 Nginx 配置、安全组、防火墙。
\`\`\`

这次实际遇到的关键日志是：

\`\`\`text
sh: next: command not found
\`\`\`

说明 PM2 还在用旧的 \`npm run start\` 方式启动，而不是新 standalone 的 \`server.js\`。删除旧进程并按 ecosystem 重新启动后恢复正常。

## 十三、最终部署目录里应该有什么

ECS 的 \`/var/www/prompt\` 里不再是完整源码，而是运行产物：

\`\`\`text
/var/www/prompt
  server.js
  ecosystem.config.cjs
  package.json
  package-lock.json
  public/
  node_modules/
  .next/
    server/
    static/
  .env.local
\`\`\`

不应该依赖这些源码目录：

\`\`\`text
src/
api/
supabase/
.git/
\`\`\`

\`.env.local\` 是 ECS 本地手动维护的文件，部署时不会覆盖。

## 十四、这个方案的优点

优化后主要收益：

- ECS 不需要访问 GitHub 拉源码。
- ECS 不需要执行 npm install 和 npm run build。
- ECS 上不保留完整源码，暴露面更小。
- 构建过程更稳定，失败可以直接在 GitHub Actions 日志中排查。
- 部署产物更明确，ECS 只负责运行。
- 可以继续保留 Nginx 反向代理和 PM2 进程守护。

对于中小型 Next.js 项目，这个方案已经足够实用。

## 十五、这个方案的不足

它也不是最终形态。

不足主要有：

- ECS 仍然需要安装 Node.js 和 PM2。
- 仍然需要手动维护 \`/var/www/prompt/.env.local\`。
- \`rsync --delete\` 需要严格保护部署路径。
- 多台 ECS 部署时，需要额外处理多机同步。
- 回滚不如镜像部署方便。

所以它更适合单机 ECS、个人项目、小团队项目。

## 十六、更好的后续方案

如果项目继续扩大，可以考虑进一步升级。

第一种是 Docker 镜像部署：

\`\`\`text
GitHub Actions
  -> docker build
  -> push 到镜像仓库
  -> ECS docker pull
  -> docker compose up -d
\`\`\`

优点是环境一致、回滚方便、部署边界清晰。

第二种是使用容器服务：

\`\`\`text
GitHub Actions
  -> 构建镜像
  -> 推送镜像
  -> 更新 ACK / 容器服务
\`\`\`

适合多实例、弹性扩容、正式生产环境。

第三种是托管平台：

\`\`\`text
Vercel
Netlify
Cloudflare Pages
EdgeOne Pages
\`\`\`

如果项目没有复杂服务端密钥和私有网络依赖，托管平台会省掉很多运维成本。

## 十七、最终结论

这次优化的核心不是“换一个启动命令”，而是把部署职责重新拆清楚：

\`\`\`text
GitHub Actions 负责构建
ECS 负责运行
Nginx 负责入口转发
PM2 负责进程守护
.env.local 负责生产密钥
\`\`\`

对于当前这个 Next.js 项目来说，\`output: 'standalone'\` 加 GitHub Actions 产物部署，是一个比“源码上传到 ECS 再构建”更稳定、更轻量、更容易排查的方案。

真正需要注意的细节有四个：

- \`NEXT_PUBLIC_*\` 必须在 GitHub Actions 构建阶段配置。
- 服务端密钥只放 ECS 的 \`.env.local\`。
- standalone 要用 \`node server.js\`，不能继续依赖 \`next start\`。
- HTTP IP 访问时不要开启 HTTPS 强制升级响应头。

把这些边界理清后，Next.js 部署到 ECS 就会稳定很多。
`;export{n as default};
