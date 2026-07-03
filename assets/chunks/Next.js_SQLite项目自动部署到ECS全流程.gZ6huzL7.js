const n=`# Next.js + SQLite 自动部署到 ECS 全流程

> 项目：青柠日历（Lime Calendar）— Web 移动端 H5 生活记录工具
>
> 仓库：<https://github.com/gouxinjie/flow-calendar>
>
> 地址：<http://flow-calendar.gouxinjie.com>


## 1. 一图看懂整体架构

\`\`\`
┌──────────────┐     git push main      ┌─────────────────────┐
│  本地开发机   │ ──────────────────────→ │  GitHub Actions      │
│  (Windows)   │                        │  (ubuntu-latest)     │
└──────────────┘                        │  ① npm ci           │
                                        │  ② prisma generate  │
                                        │  ③ next build       │
                                        │  ④ 打包 standalone  │
                                        │  ⑤ rsync → ECS      │
                                        └──────────┬──────────┘
                                                   │ SSH + rsync
                                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  阿里云 ECS (CentOS / RHEL)                                       │
│                                                                   │
│  ┌──────────┐     ┌──────────────────────────────────────────┐  │
│  │  Nginx   │────→│  PM2 → Next.js Standalone (:3400)        │  │
│  │  :80     │     │         ├─ server.js                      │  │
│  └──────────┘     │         ├─ .next/                         │  │
│                   │         └─ Prisma Client → SQLite         │  │
│                   └──────────────────┬───────────────────────┘  │
│                                      │                           │
│  /var/www/flow-calendar/             │                           │
│  ├── app/  ← 每次部署覆盖             │                           │
│  ├── data/prod.db  ← 持久化，不覆盖  │                           │
│  └── logs/  ← 持久化                 │                           │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

**一句话**：代码推到 main 分支 → GitHub Actions 自动构建打包 → rsync 同步到 ECS → PM2 热重载 → 上线。

## 2. 技术栈

| 层面 | 选型 | 说明 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | standalone 模式输出，自带精简 node_modules |
| 数据库 | SQLite (Prisma 5.22) | 零配置，单文件，可平滑迁移 PostgreSQL |
| 进程守护 | PM2 (fork 模式) | 单实例（SQLite 不支持多进程写入） |
| 反向代理 | Nginx | 80 端口对外，反代到 127.0.0.1:3400 |
| CI/CD | GitHub Actions | push main 自动触发 |
| 同步工具 | rsync (ssh-deploy) | --delete 保持目录干净，排除 db 文件 |
| 缓存 | IndexedDB | 仅客户端最近访问缓存，非主数据源 |

## 3. ECS 环境初始化（一次性）

部署项目前，先在 ECS 上完成以下一次性配置。

### 3.1 安装基础环境

\`\`\`bash
# Node.js 20（Next.js 16 要求）
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# PM2
npm install -g pm2

# Nginx
yum install -y nginx
systemctl enable nginx
systemctl start nginx

# 安装 rsync（CI 同步依赖）
yum install -y rsync
\`\`\`

### 3.2 创建目录结构

\`\`\`bash
mkdir -p /var/www/flow-calendar/{app,data,logs}
\`\`\`

### 3.3 配置 Nginx

将 \`deploy/nginx.conf\` 复制到 \`/etc/nginx/conf.d/flow-calendar.conf\`，然后：

\`\`\`bash
nginx -t                # 验证配置
nginx -s reload         # 重载
\`\`\`

### 3.4 配置 SSH 公钥（让 GitHub Actions 能连上 ECS）

\`\`\`bash
# 在 ECS 上添加公钥
mkdir -p ~/.ssh
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
\`\`\`

### 3.5 首次 prisma db push

首次部署时 standalone 包里没有 prisma CLI，需要手动同步数据库：

\`\`\`bash
cd /var/www/flow-calendar/app
npm install prisma@5.22.0 --no-save
npx prisma db push
\`\`\`

之后每次 CI 部署都会通过 rsync 增量同步，不再需要手动操作。

## 4. GitHub Actions 自动部署流程

触发条件：**推送代码到 \`main\` 分支**。

完整的 \`deploy.yml\` 分 6 步：

### 第 1 步：检出 + 安装

\`\`\`yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with: { node-version: "20", cache: "npm" }
- run: npm ci
\`\`\`

### 第 2 步：生成 Prisma Client（含跨平台引擎）

\`\`\`yaml
- run: npx prisma generate
\`\`\`

这一步会根据 \`prisma/schema.prisma\` 中的 \`binaryTargets\` 生成引擎二进制：

\`\`\`prisma
generator client {
  provider      = "prisma-client-js"
  // CI (debian) 生成 debian + rhel 两套引擎，ECS (rhel) 直接可用
  binaryTargets = ["native", "rhel-openssl-1.1.x"]
}
\`\`\`

\`native\` 对应 CI 环境（Debian/Ubuntu），\`rhel-openssl-1.1.x\` 对应 ECS（CentOS/RHEL）。两套引擎各约 16MB，随 standalone 一起打包到 ECS。

### 第 3 步：Next.js 构建

\`\`\`yaml
- run: npm run build
  env:
    DATABASE_URL: "file:./dev.db"  # 构建时仅做类型检查，不连真实数据库
\`\`\`

\`next.config.ts\` 中配置了 \`output: "standalone"\`，构建产物包含自包含的 \`server.js\` + 精简 \`node_modules\`。

### 第 4 步：打包部署产物

\`\`\`bash
mkdir -p deploy-package

# shopt -s dotglob 让 * 通配符匹配 .next 等点开头目录
shopt -s dotglob
cp -r .next/standalone/* deploy-package/
shopt -u dotglob

# 补充 standalone 不含的内容
cp -r .next/static deploy-package/.next/   # JS/CSS chunks
cp -r public deploy-package/               # favicon 等静态文件
cp -r prisma deploy-package/               # schema.prisma
cp ecosystem.config.js deploy-package/     # PM2 配置
rm -f deploy-package/prisma/dev.db         # 删除开发库，防止覆盖生产数据
\`\`\`

**最终 deploy-package 结构：**

\`\`\`
deploy-package/
├── server.js                # Next.js standalone 入口
├── .next/
│   ├── BUILD_ID, routes-manifest.json ...  # 构建元数据
│   ├── static/              # JS/CSS chunks
│   └── server/              # 服务端 bundle
├── public/                  # 静态文件
├── prisma/
│   └── schema.prisma
├── node_modules/            # 精简依赖
├── ecosystem.config.js
└── .env                     # 由 SCRIPT_AFTER 写入
\`\`\`

### 第 5 步：rsync 同步到 ECS

\`\`\`yaml
- uses: easingthemes/ssh-deploy@v6
  with:
    SSH_PRIVATE_KEY: \${{ secrets.ECS_SSH_KEY }}
    REMOTE_HOST: \${{ secrets.ECS_HOST }}
    REMOTE_USER: \${{ secrets.ECS_USER }}
    SOURCE: "deploy-package/"
    TARGET: \${{ secrets.ECS_DEPLOY_PATH }}
    ARGS: "-avz --delete --exclude='prisma/prod.db' --exclude='.env'"
\`\`\`

关键参数：

- \`--delete\`：删除 ECS 上源码已移除的旧文件
- \`--exclude='prisma/prod.db'\`：保护生产数据库不被覆盖
- \`--exclude='.env'\`：保护环境变量（后续 SCRIPT_AFTER 重写）

### 第 6 步：ECS 后置脚本

\`\`\`bash
# 写入 .env
cat > $ECS_DEPLOY_PATH/.env << 'DOTENV'
DATABASE_URL="file:/var/www/flow-calendar/data/prod.db"
ALLOWED_ORIGINS="flow-calendar.gouxinjie.com"
DOTENV

# PM2 热重载（首次自动启动）
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
\`\`\`

---

## 5. GitHub Secrets 配置

| Secret | 值 | 说明 |
|--------|-----|------|
| \`ECS_HOST\` | \`12.34.56.78\` | ECS 公网 IP |
| \`ECS_USER\` | \`root\` | SSH 用户名 |
| \`ECS_SSH_KEY\` | \`-----BEGIN OPENSSH PRIVATE KEY-----...\` | SSH 私钥（完整内容） |
| \`ECS_DEPLOY_PATH\` | \`/var/www/flow-calendar/app\` | 部署目标目录 |

## 6. 三个关键设计决策

### 6.1 为什么 SQLite 数据库放 \`data/\` 而不是 \`app/\` 里？

因为 rsync 用 \`--delete\` 同步，\`app/\` 下的所有内容都会被覆盖。\`data/\` 与 \`app/\` 平级，不在部署范围内，数据不会丢失。

### 6.2 为什么 Prisma 引擎要跨平台生成？

GitHub Actions CI 跑在 Ubuntu（Debian 系，openssl 3.0），而 ECS 是 CentOS/RHEL（openssl 1.1）。Prisma Query Engine 是平台相关的 \`.so\` 文件，必须两套都生成。

如果不加 \`rhel-openssl-1.1.x\`，ECS 启动时会报：

\`\`\`
Prisma Client could not locate the Query Engine for runtime "rhel-openssl-1.1.x".
This happened because Prisma Client was generated for "debian-openssl-3.0.x"
\`\`\`

### 6.3 为什么 PM2 用 fork 而不用 cluster？

SQLite 是文件级数据库，不支持并发写入。如果用 cluster 模式开多个进程，会出现数据库锁冲突。所以用 \`fork\` 单实例，最大内存限制 \`512M\`。

## 7. 实战问题排查

### 7.1 502 Bad Gateway

**现象**：访问域名返回 502。

**排查**：

\`\`\`bash
pm2 status                     # 看进程是否 online
netstat -tlnp | grep 3400      # 看 Next.js 是否监听 3400
pm2 logs flow-calendar --lines 20 --nostream  # 查看错误日志
\`\`\`

**常见原因**：

- PM2 进程 errored 未恢复 → 手动 \`pm2 delete flow-calendar && pm2 start ecosystem.config.js\`
- \`node_modules\` 损坏 → 重新触发 GitHub Actions 部署（完整覆盖）
- 端口被占用 → \`lsof -i :3400\` 查看并 kill 旧进程

### 7.2 API 返回 403

**现象**：注册/登录接口返回 \`FORBIDDEN\`。

**根因**：Nginx 反代下，浏览器 \`Origin\` 是 \`http://flow-calendar.gouxinjie.com\`，但 Next.js 内部是 \`http://127.0.0.1:3400\`，\`isTrustedMutationRequest()\` 认为跨域。

**解决**：通过 \`ALLOWED_ORIGINS\` 环境变量添加域名白名单。

### 7.3 PrismaClientInitializationError（引擎找不到）

**现象**：日志显示 \`Prisma Client could not locate the Query Engine for runtime "rhel-openssl-1.1.x"\`。

**解决**：确保 \`binaryTargets = ["native", "rhel-openssl-1.1.x"]\`，然后重新 push 触发 CI 构建。

### 7.4 Prisma 校验错误 P1012

**现象**：\`error: This line is not a valid definition within a generator.\`

**根因**：\`generator\` 块内不支持 \`/** */\` 块注释，只用 \`//\` 行注释。

### 7.5 构建产物 \`.next/\` 元数据丢失

**现象**：\`Could not find a production build in the './.next' directory\`。

**根因**：\`cp -r .next/standalone/* deploy-package/\` 在不启用 dotglob 时，\`*\` 不匹配 \`.next\` 前缀的隐藏目录。

**解决**：\`shopt -s dotglob\` 启用后再复制。

### 7.6 PM2 errored 后未自动恢复

**现象**：进程反复重启多次后进入 \`errored\` 不再恢复，重新部署也不会自动拉起。

**解决**：

\`\`\`bash
pm2 delete flow-calendar
cd /var/www/flow-calendar/app && pm2 start ecosystem.config.js
\`\`\`

## 8. 日常运维

\`\`\`bash
pm2 status                          # 查看进程状态
pm2 logs flow-calendar              # 实时日志
pm2 logs flow-calendar --lines 30 --nostream  # 最近 30 行
pm2 reload flow-calendar            # 手动热重载

nginx -t && nginx -s reload         # Nginx 重载

ls -la /var/www/flow-calendar/app/server.js  # 确认部署文件时间戳
\`\`\`

## 9. 后续建议

1. **HTTPS**：用 certbot 申请免费 SSL 证书
2. **日志轮转**：\`pm2 install pm2-logrotate\` 防止日志占满磁盘
3. **数据库备份**：定时 \`cp /var/www/flow-calendar/data/prod.db\` 到 OSS
4. **健康检查**：增加 \`/api/health\` 端点，配合 Nginx 探测
5. **迁移 PostgreSQL**：本方案 SQLite 可随时切换，只需改 datasource 和连接串
`;export{n as default};
