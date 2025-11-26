# 一条 git push 同时推送 GitHub & Gitee：双远程仓库实战

[[toc]]

> 本地只有一份代码，却想「主份」放 GitHub、「镜像」放 Gitee（或公司内网 GitLab）？  
> 不必来回拷贝，也不必写脚本循环 push，Git 本身就能让「一个远程名」对应「多个 URL」。

## 一、核心原理

Git 的 remote 支持：

1. 一个 remote 可以有多条 `pushurl`
2. 执行 `git push <remote> <branch>` 时，会依次向所有 pushurl 发送数据

因此只要把两个平台的地址绑到同一个 remote（通常是 origin），就能实现「一条命令，多地开花」。

## 二、操作步骤（从零开始也适用）

### 0. 准备工作

- 已有本地仓库（或 `git init` 新建）
- 在 GitHub & Gitee 分别创建空仓库，拿到 HTTPS 或 SSH 地址  
  示例：
  - GitHub：`git@github.com:user/repo.git`
  - Gitee：`git@gitee.com:user/repo.git`

### 1. 查看当前远程

```bash
git remote -v
```

如果之前没加过远程，会空列表；若已有单平台，继续下一步即可。

### 2. 绑定「双 push 地址」

```bash
# 把 origin 的 fetch 地址设为 GitHub（习惯主仓）
git remote add origin git@github.com:user/repo.git

# 再追加 Gitee 作为第二条 pushurl
git remote set-url --add --push origin git@gitee.com:user/repo.git
```

### 3. 验证配置

```bash
git remote -v
```

预期输出：

```
origin  git@github.com:user/repo.git (fetch)
origin  git@github.com:user/repo.git (push)
origin  git@gitee.com:user/repo.git (push)
```

fetch 只有一条，push 有两条，说明成功。

### 4. 首次推送

```bash
# 本地已 commit 的前提下
git push -u origin main   # 或 master
```

终端会先刷 GitHub 进度，再刷 Gitee 进度，都 100% 即双平台完成！

以后正常开发，只需：

```bash
git push
```

即可保持同步。

## 三、常见场景 Q&A

1. **已存在 origin，只想追加？**  
   直接 `git remote set-url --add --push origin <新地址>`，无需删除旧地址。

2. **想同时推三个 / 四个仓库？**  
   继续 `--add --push` 第三条、第四条 URL，Git 不限制数量。

3. **拉取时从哪拉？**  
   fetch URL 只有第一条，默认 `git pull` 会从 GitHub 拉；  
   若想改到 Gitee，可：

   ```bash
   git remote set-url origin git@gitee.com:user/repo.git
   ```

   再 `--add --push` 把 GitHub 加回来即可。

4. **提示权限失败？**

   - 用 SSH 地址需先在各自平台添加本机公钥；
   - 用 HTTPS 地址可配置 personal access token，避免输入密码。

5. **CI 重复触发？**  
   双平台都有 Webhook/Actions 时，一次 push 会触发两遍。  
   可在 CI 里通过 `if: github.repository_owner == 'user'` 或仓库名过滤，避免重复。
