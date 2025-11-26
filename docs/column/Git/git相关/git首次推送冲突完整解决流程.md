# Git 首次推送冲突完整解决流程（新手常遇到）

[[toc]]

**场景描述**

- 本地已有代码并执行过 `git commit`
- 远程仓库（GitLab）的 `main` 创建分支时已存在初始提交（README、.gitignore 等）
- 直接 `git push` 被拒绝：  
  `! [rejected] main -> main (non-fast-forward)`
- 受保护分支**禁止强制推送**，必须保留两段历史

## 1️. 建立远程连接

```powershell
git remote set-url origin 分支地址
```

## 2. 确保本地已提交

```powershell
git add .
git commit -m "Initial commit"
```

很多新手在这个时候下面会直接执行 `git push`，但是会被拒绝。更换强制命令为：

```powershell
git push -u origin main --force
```

也是会被拒绝，因为新建仓库时 main 或者是 master 分支是默认分支，同时也是受保护分支**禁止强制推送**，必须保留两段历史。

所以要先拉取远程历史，合并后再推送。如下步骤3：

## 3. 拉取远程历史（允许无关历史）

```powershell
git pull origin main --allow-unrelated-histories
```

**可能出现冲突** → 按提示打开文件解决，然后：

## 4. 标记冲突已解决并继续

```powershell
git add .
git rebase --continue        # 继续应用剩余提交
```

> 若还有冲突，重复 **解决 → add → --continue** 直至完成。

## 5. 推送合并后的历史

```powershell
git push -u origin main
```

成功后会看到 `Total xxx (delta yyy)`，远程即包含本地与远程两段历史。

## 6. 后续日常开发

```powershell
git pull --rebase   # 拉新代码
git push            # 推送，无需再 -u
```

## 常用应急命令

| 操作             | 命令                 |
| ---------------- | -------------------- |
| 放弃本次 rebase  | `git rebase --abort` |
| 跳过当前冲突提交 | `git rebase --skip`  |
| 查看状态         | `git status`         |
| 查看远程地址     | `git remote -v`      |

**结论**  
在**受保护分支**环境下，**禁止 `push -f`**；必须通过

```
git pull origin main --allow-unrelated-histories
```

把两段无关历史合并，再正常推送即可。
