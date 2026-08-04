const n=`# 个人档案 Archive 在 ECS 上的生产部署实战：从源码拉取到产物直传的落地总结

把一个 Nuxt 项目真正部署到 ECS，问题往往不出在“怎么运行起来”，而是出在“怎么稳定地跑下去”。如果项目里同时用了 SQLite、本地上传目录、PM2、Nginx 和 \`better-sqlite3\` 这种原生模块，部署方案稍微想当然一点，上线后就很容易踩坑。

这篇文章结合一个真实项目，把这次部署过程完整复盘一遍：为什么一开始的方案要调整，为什么最终选择了“GitHub Actions 构建产物并直接上传 ECS”，以及几个关键问题是怎么被定位和修掉的。

## 一、项目背景

项目名称叫“个人档案 Archive”，它是一个本地优先的私人资料管理系统，主要用于集中管理：

- 账号密码
- 文档资料
- 简历文件
- 图片文件
- 证件文件
- 学习资料

当前技术栈如下：

| 类型 | 技术 |
| --- | --- |
| 前端框架 | Nuxt 4、Vue 3 |
| 开发语言 | TypeScript |
| UI 和样式 | Element Plus、SCSS |
| 服务端 | Nuxt Server API |
| 数据库 | SQLite |
| 数据访问 | better-sqlite3 |
| 进程管理 | PM2 |
| 反向代理 | Nginx |
| 自动部署 | GitHub Actions |

这个项目有两个部署上的特点：

1. 数据库不是 MySQL、PostgreSQL，而是 SQLite。
2. 上传文件不是对象存储，而是 ECS 本机目录。

这意味着部署不能只考虑代码，还必须把数据目录和运行目录分离开。

## 二、最初的部署思路为什么不合适

一开始最自然的思路，是让 ECS 在部署时自己拉源码：

\`\`\`text
GitHub Actions -> SSH 登录 ECS -> git pull -> npm ci -> npm run build -> pm2 restart
\`\`\`

这个方案的优点很明显：

- 简单直接
- 不用处理构建产物上传
- ECS 上看到的是完整项目目录

但它很快暴露出几个问题。

### 1. 首次部署时目录里根本不是 Git 仓库

如果 \`/var/www/archive\` 只是一个空目录，工作流里执行：

\`\`\`bash
git fetch origin main
\`\`\`

就会直接报错：

\`\`\`text
fatal: not a git repository
\`\`\`

可以继续给工作流补“自动 \`git init\`、自动加 remote、自动拉分支”的逻辑，但这说明 ECS 已经开始承担“代码仓库管理”的职责了。

### 2. ECS 每次都要承担完整构建职责

源码部署意味着 ECS 每次发布都需要：

- 有完整 Node 环境
- 能装依赖
- 能跑构建
- 能处理所有构建期依赖

这会让 ECS 既是运行机，又是构建机。个人项目能跑，但结构不够清晰。

### 3. 源码目录和运行目录混在一起

如果同时把源码、\`.env.production\`、\`.output\`、SQLite 路径、上传目录都堆在一起，后面排查问题会越来越乱。

## 三、为什么最终改成“产物直传”

结合项目规模和维护成本，最终采用的是：

\`\`\`text
GitHub Actions 构建产物 -> 上传到 ECS -> ECS 只负责解压与重启
\`\`\`

具体来说，就是 GitHub Actions 负责：

1. checkout 代码
2. 安装依赖
3. 构建 Nuxt \`.output\`
4. 生成 PM2 的 \`ecosystem.config.cjs\`
5. 打包成压缩文件
6. 上传到 ECS

ECS 只负责：

1. 解压产物到 \`/var/www/archive\`
2. 保留 \`.env.production\`
3. 保留数据库目录和上传目录
4. 通过 PM2 重启服务

对于这个项目来说，这个方案更合适，原因很简单：

- ECS 不需要再维护 Git 仓库状态
- 发布目录职责更明确
- 数据目录和运行目录天然分离
- 部署逻辑更接近真正的生产发布

## 四、最终的目录结构

最终落地的目录结构如下：

\`\`\`text
/var/www/archive
├── .env.production
├── .output
└── ecosystem.config.cjs

/var/www/archive-data
├── data
│   └── archive.db
└── uploads
\`\`\`

其中：

- \`/var/www/archive\`：只放运行产物和生产环境变量
- \`/var/www/archive-data/data\`：SQLite 数据库
- \`/var/www/archive-data/uploads\`：上传文件

这种结构的核心原则是：

\`\`\`text
代码和运行产物可以覆盖，数据库和上传文件必须持久化。
\`\`\`

## 五、最终的访问链路

这次部署过程中，服务监听和对外端口也做了调整。

最终链路是：

\`\`\`text
公网 8081 -> Nginx -> 127.0.0.1:3000 -> Nuxt/PM2
\`\`\`

其中：

- Nuxt/PM2 只监听 ECS 本机 \`127.0.0.1:3000\`
- Nginx 对外监听 \`8081\`
- 浏览器访问入口统一是 Nginx

这样做有两个好处：

1. Node 服务不直接暴露到公网。
2. 后续切 HTTPS、域名、限流、日志都会更顺手。

Nginx 配置核心如下：

\`\`\`nginx
server {
  listen 8081;
  server_name _;

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

## 六、GitHub Actions 最终负责什么

这次部署落地后，GitHub Actions 的职责是：

\`\`\`text
checkout
-> npm ci
-> npm run build:prod
-> 打包 .output + ecosystem.config.cjs
-> 上传 deploy-artifact.tar.gz
-> SSH 登录 ECS
-> 解压到 /var/www/archive
-> pm2 restart archive --update-env
\`\`\`

注意这里构建命令用的是：

\`\`\`bash
npm run build:prod
\`\`\`

也就是 GitHub Actions 会先在仓库中准备一个临时 \`.env.production\`，再按生产命令构建；它不依赖 ECS 机器上的真实 \`.env.production\`。
真正的生产环境变量，只保留在 ECS 的：

\`\`\`text
/var/www/archive/.env.production
\`\`\`

## 七、部署过程中踩到的几个关键坑

这次部署真正有价值的部分，不是“把项目部署上去”，而是把这些坑逐个踩明白。

### 1. PM2 重载导致端口冲突

一开始部署脚本里用了：

\`\`\`bash
pm2 startOrReload ecosystem.config.cjs --only archive --update-env
\`\`\`

但这个项目是单实例 \`fork\` 模式，而且固定监听 \`127.0.0.1:3000\`。在某些时机下，旧进程没完全退出，新进程就开始抢端口，结果直接报：

\`\`\`text
Error: listen EADDRINUSE: address already in use 127.0.0.1:3000
\`\`\`

最终改成：

- 如果应用已存在，执行 \`pm2 restart\`
- 如果应用不存在，执行 \`pm2 start\`

这样避免了 \`reload\` 带来的双进程抢端口问题。

### 2. better-sqlite3 原生模块和 Node 版本不一致

项目用了 \`better-sqlite3\`，它不是纯 JavaScript 包，而是原生模块。

这意味着一个非常关键的事实：

\`\`\`text
构建产物所使用的 Node 大版本，必须和 ECS 实际运行的 Node 大版本一致。
\`\`\`

中间曾经出现过这样的错误：

\`\`\`text
Module did not self-register: better_sqlite3.node
\`\`\`

根因是：

- GitHub Actions 用 Node 22 构建
- ECS 实际运行是 Node 20
- \`better-sqlite3\` 的二进制 ABI 不兼容

后来也尝试过在 ECS 上直接：

\`\`\`bash
npm rebuild better-sqlite3
\`\`\`

但 Nuxt \`.output/server\` 里的依赖并不是完整源码包结构，这种修法并不稳，甚至会报：

\`\`\`text
binding.gyp not found
\`\`\`

最终的正确修复方式是：

- GitHub Actions 固定使用 Node 20
- 部署时额外校验 ECS 也是 Node 20.x

也就是说，不是在 ECS 上“补救原生模块”，而是在构建时就保证 ABI 一致。

### 3. HTTP 部署下的 CSRF Cookie 问题

项目登录态采用的是：

\`\`\`text
HttpOnly 签名 Cookie + CSRF Token
\`\`\`

一开始服务端对生产环境直接用了：

\`\`\`ts
secure: isProduction()
\`\`\`

这在 HTTPS 下没有问题，但当前部署入口是：

\`\`\`text
http://公网IP:8081
\`\`\`

也就是纯 HTTP。

浏览器对于 \`Secure\` Cookie 的规则很明确：

\`\`\`text
HTTP 请求不会保存或发送 Secure Cookie。
\`\`\`

于是现象就变成了：

- 页面能打开
- 登录请求返回

  \`\`\`json
  {"success":false,"code":"LOGIN_FAILED","message":"CSRF 令牌无效","data":null}
  \`\`\`

原因不是 CSRF 算法错了，而是：

- 浏览器根本没有保存 \`archive_csrf\`
- 服务端校验时拿不到 Cookie

最终修复逻辑改成：

- 开发环境：\`secure = false\`
- 生产环境：
  - 如果当前请求是 HTTPS，或者 \`NUXT_PUBLIC_ORIGIN\` 是 \`https://...\`
  - 才把 Cookie 标记为 \`Secure\`

这样 HTTP \`8081\` 部署也能正常登录，后续切 HTTPS 时又能自动回到更安全的模式。

### 4. 502 Bad Gateway 并不一定是 Nginx 配错了

部署时出现过一次 \`502 Bad Gateway\`，直觉很容易怀疑 Nginx。

但这次实际定位下来，真正的问题是：

- 后端进程没起来
- 或者 PM2 在重载时因为端口冲突失败
- 或者 \`better-sqlite3\` 在进程启动后第一次访问数据库时崩掉

所以这次部署也验证了一个很实用的排查顺序：

1. 先看 PM2 状态
2. 再看 Node 是否监听 \`127.0.0.1:3000\`
3. 再看 Nginx 反向代理配置

而不是一上来就盯着 Nginx。

## 八、最终稳定下来的配置原则

这次部署跑通后，最终沉淀下来的几个原则是：

### 1. 运行目录和数据目录必须分离

不要把 SQLite、上传文件和发布产物混在一起。

### 2. Node 大版本必须统一

GitHub Actions 和 ECS 的 Node 版本必须保持一致，尤其项目里用了 \`better-sqlite3\` 这种原生模块时，这一点不是建议，而是硬要求。

### 3. 反向代理和服务监听职责分清

Nginx 负责对外，Nuxt 只负责本机监听。

### 4. Cookie 安全策略要和实际协议一致

HTTP 部署下不能一刀切地把所有 Cookie 都标成 \`Secure\`。

### 5. 个人项目可以简化，但边界不能糊

这次最终没有上 \`releases/current\` 这种版本目录结构，而是直接覆盖 \`/var/www/archive\`。对个人项目来说，这样更简单，也更符合维护成本。

但即使简化部署结构，也不能牺牲这些底层边界：

- 数据目录独立
- Node 版本一致
- 反向代理明确
- 进程管理明确
- 环境变量不入库

## 九、最终方案总结

这次部署最终稳定下来的方案可以总结为：

\`\`\`text
GitHub Actions 使用 Node 20 构建 Nuxt 产物
-> 将 .output 和 PM2 配置打包上传到 ECS
-> ECS 解压到 /var/www/archive
-> PM2 监听 127.0.0.1:3000
-> Nginx 对外监听 8081
-> SQLite 和 uploads 持久化在 /var/www/archive-data
\`\`\`

对应的部署心智模型也可以总结成一句话：

\`\`\`text
代码产物可以覆盖，数据不能覆盖；访问入口交给 Nginx，应用只负责本机服务；原生模块是否稳定，首先看 Node 版本是否一致。
\`\`\`

## 十、结语

很多部署问题表面上看是“某一条命令报错了”，但真正要解决的是部署模型本身是否合理。

这次从源码拉取部署，调整到产物直传部署；从端口冲突，修到 PM2 启动策略；从 \`better-sqlite3\` 报错，定位到 Node ABI 一致性；再到 HTTP 下的 CSRF Cookie 失效，本质上都指向同一个结论：

\`\`\`text
部署不是把项目跑起来，而是把运行边界划清楚。
\`\`\`

如果项目只是个人使用，方案当然可以简化；但只要涉及 ECS、反向代理、原生依赖和真实登录链路，结构必须是清楚的，不能靠“先跑起来再说”长期维持。

这也是这次部署过程里最值得保留下来的经验。
`;export{n as default};
