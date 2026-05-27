# VitePress 博客自动部署到 ECS：GitHub Actions + Nginx 完整实践

## 项目背景

我的博客项目是基于 **VitePress** 搭建的静态站点。项目构建后会生成纯静态文件，最终产物目录是：

```txt
docs/.vitepress/dist
```

之前站点可以部署到 GitHub Pages、EdgeOne Pages 这类平台，但如果想拥有更高的可控性，比如自定义 Nginx 配置、部署多个项目、统一管理服务器资源，那么部署到 ECS 是一个比较合适的选择。

本次目标是：

```txt
代码 push 到 GitHub
→ GitHub Actions 自动构建
→ 上传静态产物到 ECS
→ Nginx 通过 blog.xxx.com 提供访问
```

## 整体架构

```mermaid
flowchart LR
  A["本地开发"] --> B["git push"]
  B --> C["GitHub Actions"]
  C --> D["pnpm install"]
  D --> E["pnpm run build"]
  E --> F["docs/.vitepress/dist"]
  F --> G["rsync 上传到 ECS"]
  G --> H["/var/www/blog"]
  H --> I["Nginx"]
  I --> J["blog.xxx.com"]
```

## 一、ECS 准备目录

先在 ECS 上创建博客部署目录：

```bash
sudo mkdir -p /var/www/blog
```

如果 GitHub Actions 使用 `root` 用户 SSH 登录，可以保持默认权限。
如果使用普通用户，比如 `deploy`，需要授权：

```bash
sudo chown -R deploy:deploy /var/www/blog
```

本次使用的部署目录是：

```txt
/var/www/blog
```

## 二、安装 rsync

`GitHub Actions` 后面会通过 `rsync` 把构建产物同步到 ECS。

检查是否安装：

```bash
rsync --version
```

如果提示：

```txt
rsync: command not found
```

说明没有安装。

CentOS / Alibaba Cloud Linux / RHEL 系统使用：

```bash
sudo yum install rsync -y
```

安装完成后再次确认：

```bash
rsync --version
```

## 三、配置 Nginx

当前项目使用独立子域名：

```txt
blog.xxx.com
```

VitePress 配置里的 `base: "/"` 不需要修改，因为它适合部署在独立域名或子域名根路径下。

在 `/etc/nginx/nginx.conf` 的 `http {}` 中添加博客站点配置：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name blog.xxx.com;

    root /var/www/blog;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ /404.html;
    }

    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    error_page 404 /404.html;
}
```

这里最关键的是：

```nginx
try_files $uri $uri.html $uri/ /404.html;
```

因为 VitePress 开启了 `cleanUrls: true` 后，访问路径可能是：

```txt
/column/React/index
```

但真实文件是：

```txt
/column/React/index.html
```

所以 Nginx 需要尝试匹配 `.html` 文件，否则文章页刷新可能 404。

检查配置：

```bash
sudo nginx -t
```

重载 Nginx：

```bash
sudo systemctl reload nginx
```

## 四、配置 DNS

在域名控制台添加一条 A 记录：

```txt
类型：A
主机记录：blog
记录值：ECS 公网 IP
```

配置后访问：

```txt
http://blog.xxx.com
```

如果 ECS 安全组没有开放 80 端口，也需要在云服务器控制台放行：

```txt
80
22
443
```

## 五、准备 SSH Key

GitHub Actions 需要通过 SSH 登录 ECS。建议单独生成一把部署专用密钥，不要使用个人常用私钥。

生成密钥的本质是：**GitHub Actions 拿到私钥，ECS 存入公钥**。因此，在哪台机器上生成都可以，这里提供两种常见方式，任选其一即可：

### 方式一：在 ECS 服务器上生成（推荐，操作最连贯）

因为你现在可能正好连着 ECS，直接在服务器上生成会更顺手。

在 ECS 终端执行：

```bash
ssh-keygen -t ed25519 -C "github-actions-ecs-deploy" -f ~/.ssh/ecs_deploy
```

直接将公钥追加到授权列表：

```bash
cat ~/.ssh/ecs_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

查看**私钥**内容（准备下一步复制给 GitHub）：

```bash
cat ~/.ssh/ecs_deploy
```

*(可选安全建议：把私钥复制到 GitHub Secrets 后，可以执行 `rm ~/.ssh/ecs_deploy` 将其从 ECS 上删除，更符合安全规范)*

### 方式二：在本地电脑生成（最符合安全规范）

在本地生成，私钥永远不会出现在 ECS 上。以 Windows PowerShell 为例：

```powershell
ssh-keygen -t ed25519 -C "github-actions-ecs-deploy" -f "$env:USERPROFILE\.ssh\ecs_deploy"
```

生成两个文件：`ecs_deploy`（私钥）和 `ecs_deploy.pub`（公钥）。

查看**公钥**内容：

```powershell
Get-Content "$env:USERPROFILE\.ssh\ecs_deploy.pub"
```

把复制的**公钥**追加到 ECS 中：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "这里粘贴刚才复制的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

查看**私钥**内容（准备下一步复制给 GitHub）：

```powershell
Get-Content "$env:USERPROFILE\.ssh\ecs_deploy" -Raw
```

本机测试 SSH 是否能登录 ECS：

```powershell
ssh -i "$env:USERPROFILE\.ssh\ecs_deploy" root@你的ECS公网IP
```

能登录说明密钥配置成功。

## 六、配置 GitHub Secrets

进入 GitHub 仓库：

```txt
Settings
→ Secrets and variables
→ Actions
→ New repository secret
```

添加以下变量：

```txt
ECS_HOST       ECS 公网 IP
ECS_USER       root 或 deploy
ECS_PORT       22
ECS_PATH       /var/www/blog
ECS_SSH_KEY    上一步获取的私钥完整内容
```

复制私钥时必须包含：

```txt
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

## 七、编写 GitHub Actions

新增文件：

```txt
.github/workflows/deploy-ecs.yml
```

内容如下：

```yaml
name: Deploy VitePress to ECS

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ecs
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      ECS_HOST: ${{ secrets.ECS_HOST }}
      ECS_USER: ${{ secrets.ECS_USER }}
      ECS_PORT: ${{ secrets.ECS_PORT }}
      ECS_PATH: ${{ secrets.ECS_PATH }}
      ECS_SSH_KEY: ${{ secrets.ECS_SSH_KEY }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build VitePress site
        run: pnpm run build

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          printf '%s\n' "$ECS_SSH_KEY" > ~/.ssh/ecs_key
          chmod 600 ~/.ssh/ecs_key
          ssh-keyscan -p "$ECS_PORT" "$ECS_HOST" >> ~/.ssh/known_hosts

      - name: Ensure remote directory
        run: |
          ssh -i ~/.ssh/ecs_key -p "$ECS_PORT" "$ECS_USER@$ECS_HOST" "mkdir -p '$ECS_PATH'"

      - name: Deploy to ECS
        run: |
          rsync -az --delete \
            -e "ssh -i ~/.ssh/ecs_key -p $ECS_PORT" \
            docs/.vitepress/dist/ \
            "$ECS_USER@$ECS_HOST:$ECS_PATH/"
```

## 八、提交并触发部署

提交 workflow：

```bash
git add .github/workflows/deploy-ecs.yml
git commit -m "ci: deploy vitepress to ecs"
git push
```

push 到 `main` 后，GitHub Actions 会自动执行部署。

也可以手动触发：

```txt
GitHub → Actions → Deploy VitePress to ECS → Run workflow
```

## 九、验证部署结果

ECS 上查看：

```bash
ls /var/www/blog
```

应该看到：

```txt
index.html
404.html
assets
column
sitemap.xml
```

访问：

```txt
http://blog.xxx.com
```

再测试文章页刷新是否正常：

```txt
http://blog.xxx.com/column/xxx/xxx
```

如果刷新不 404，说明 Nginx 配置正确。

## 优点

这种方案的优点很明显：

```txt
1. ECS 不需要安装 Node
2. ECS 只负责 Nginx 静态托管
3. GitHub Actions 自动构建，环境稳定
4. 每次 git push 自动发布
5. rsync --delete 会清理旧文件
6. 多项目可以通过不同子域名统一部署到同一台 ECS
```

## 缺点

也有一些缺点：

```txt
1. 需要自己维护 ECS 和 Nginx
2. 需要管理 SSH Key
3. HTTPS 需要额外配置
4. 服务器安全、备份、监控都要自己负责
5. 如果部署多个项目，Nginx 配置需要保持清晰
```

## 更好的方案有哪些

如果只是个人博客，最省心的是：

```txt
Vercel
GitHub Pages
Cloudflare Pages
EdgeOne Pages
```

这些平台不需要自己维护服务器。

如果追求国内访问速度，可以考虑：

```txt
对象存储 OSS/COS + CDN
```

这种方式更适合纯静态网站，成本低，访问快，也不需要维护 Nginx。

如果项目后续变多，推荐升级为：

```txt
Docker + GitHub Actions + Nginx
```

每个项目独立容器，部署和回滚更规范。

如果团队协作更复杂，可以进一步升级为：

```txt
CI/CD 平台 + 制品管理 + 灰度发布
```

但对个人博客来说，当前的：

```txt
GitHub Actions + rsync + Nginx
```

已经足够简单、稳定、可控。

## 常见问题

**1. 页面打开 404**

检查：

```txt
ECS_PATH 是否等于 Nginx root
/var/www/blog 是否有 index.html
Nginx 是否 reload
DNS 是否解析到 ECS
```

**2. 文章页刷新 404**

检查 Nginx 是否有：

```nginx
try_files $uri $uri.html $uri/ /404.html;
```

**3. GitHub Actions SSH 失败**

检查：

```txt
ECS_SSH_KEY 是否复制完整
公钥是否写入 ~/.ssh/authorized_keys
ECS_PORT 是否正确
安全组是否开放 22
```

**4. rsync 失败**

检查 ECS 是否安装：

```bash
rsync --version
```

## 总结

这次部署的核心是把构建和运行分离：

```txt
GitHub Actions 负责构建
ECS 负责托管
Nginx 负责访问
```

最终链路是：

```txt
git push
→ GitHub Actions
→ pnpm run build
→ rsync 到 /var/www/blog
→ Nginx 提供 blog.xxx.com 访问
```

对于 VitePress 这类静态博客，这是一种成本低、可控性强、后期也容易扩展的部署方式。



