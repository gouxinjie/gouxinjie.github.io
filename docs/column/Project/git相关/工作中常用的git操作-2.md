# 工作中常用的 git 操作(第二部分)

[[toc]]

## 1. git 怎么删除本地分支和远程分支 比如这个分支是 20250314

```bash
1. 删除本地分支：`git branch -d 20250314`
2. 强制删除本地分支：`git branch -D 20250314`
3. 删除远程分支：`git push origin --delete 20250314` 或 `git push origin :20250314`
4. 检查分支是否删除：`git branch`（查看本地分支） 和 `git branch -r` （查看远程分支）`git branch -a `（查看所有分支）
```

## 2. 在 gitlab 远程仓库创建了一个分支 staging 怎么同步到本地

1. 获取远程分支信息：`git fetch origin` origin 是远程仓库的别名，默认是 origin
2. 查看远程分支：`git branch -r`
3. 创建并切换到本地分支：`git checkout -b staging origin/staging`

```bash
`-b staging`：创建一个名为 `staging` 的本地分支。
`origin/staging`：基于远程分支 `origin/staging` 创建本地分支。
```

4. 验证同步状态：`git status`

5. 拉取最新代码（可选）：`git pull origin staging`

## 3. git pull origin main 和 git merge 的区别

前者：从远程仓库（`origin`）的 `main` 分支拉取最新的更改，并将其合并到当前分支；git pull 是一个组合命令 是`git fetch` + `git merge`的组合。

后者：git merge 是将一个分支的更改合并到当前分支。

`git merge` 是一个本地操作，它会将指定分支的更改合并到当前分支；它不会与远程仓库交互

## 4. git fetch 命令

```bash
git fetch [远程仓库名称] [分支名称]  如果不指定远程仓库名称，默认为 origin
```

从远程仓库获取最新的提交记录和分支信息，但不会自动合并这些更改到本地分支;它会更新本地的远程分支引用;但不会修改本地的工作目录或当前分支。如果需要将这些更改合并到本地分支，需要手动执行 `git merge` 或 `git rebase`。

## 5. git 撤销已 push 分支的方式

**1.** `git revert`：创建一个新的提交来撤销之前的提交；`git revert` 是一种安全的方式来撤销提交。**它会创建一个新的提交记录，这个提交的内容是撤销指定提交的更改。**

```bash
## 1、查看当前分支提交历史
git log
3c2eabe (HEAD ->master)
7e7006a add function

## 2、撤销指定提交内容  7e7006a
git revert 7e7006a

## 3、推送到远程
git push origin gouxinjie
```

**2.** `git reset`：回退到指定的提交

可以将当前分支的指针回退到指定的提交

```bash
## 1，找到要回退到的提交的哈希值：
git log
## 回退
git reset --hard 7e7006a
```

## 6. 暂存当前工作目录中的更改

```bash
git stash  # 暂存更改
git stash pop  # 恢复暂存的更改
```

## 7. git 撤销更改（已 commit，未 push）

参考第 5 步，撤销方式是一样的。

## 8. git 怎么回退已 merge 的代码

**1. 使用 `git revert` 撤销合并**

```bash
git log
git revert -m 1 abc123
```

**2. 使用 `git reset` 回退合并**

```bash
git log
git reset --hard def456
```

## 9. 修改远程分支的链接（多用于一个服务器迁移到另一个服务器）

```bash
git remote -v 查看当前远程仓库的 URL
git remote set-url <remote-name> <new-url>
git remote -v 验证更改
<remote-name> 是远程仓库的名称（通常是 origin）。
<new-url> 是新的远程仓库的 URL。
案例：
git remote set-url origin https://new-repo-url.com/repo.git
```

## 10. 修改远程分支的名称（默认是 origin）

```bash
git remote -v
git remote rename <old-name> <new-name>
<old-name> 是当前远程仓库的名称（通常是 origin）。
<new-name> 是你希望设置的新别名。
```

## 11. 添加新的远程仓库

```bash
git remote add <remote-name> <url>
<remote-name> 是你为远程仓库设置的别名（比如是upstream）。
<url> 是远程仓库的 URL。
案例：
git remote add upstream https://new-repo-url.com/repo.git
```

## 12. Git 中本地新建分支 并同步到远程仓库

```bash
## 第一步
git checkout -b new-branch-name
这个命令相当于以下两条命令的组合：
git branch new-branch-name   # 创建分支
git checkout new-branch-name # 切换到新分支

## 第二步 推送到远程分支
 git push origin gouxinjie-ssr-deep
```

## 13. Git 怎么重命名本地分支的名称 并推到远程

```bash
# 1. 切换到要重命名的分支
git checkout feature-old

# 2. 重命名本地分支
git branch -m feature-new

# 3. 删除远程旧分支（如果存在）
git push origin --delete feature-old

# 4. 推送新分支到远程并设置上游
git push origin feature-new

# 5. 重新拉取远程建立联系（不能直接使用git pull）
git pull origin feature-new

# 后面就可以正常提交代码了。

```
