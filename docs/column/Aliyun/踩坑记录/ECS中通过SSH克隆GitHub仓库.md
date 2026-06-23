
# 解决阿里云 ECS 克隆 GitHub 失败的问题

## 一、 前言：在阿里云 ECS 上克隆代码翻车了

作为开发者，我们经常需要登录到云服务器上部署项目。最近我在阿里云 ECS 服务器（Linux `root` 环境）上尝试克隆一个 GitHub 仓库时，直接迎面撞上了这个经典的 Git 报错：

```bash
[root@iZuf68x0y81jmfv00sbveuZ paper]# git clone git@github.com:gouxinjie/paper.git
Cloning into 'paper'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights and the repository exists.

```

“明明我的 Windows 电脑上克隆得好好的，为什么到了阿里云 ECS 上就不行了？”

在排查过程中，因为本地电脑同时配了 GitLab，导致我一度在 Windows 的 CMD 和 PowerShell 之间反复横跳（还顺便踩了 Windows 环境变量的坑）。其实，**从云服务器克隆 GitHub 仓库，有着它独立且极其纯粹的底层逻辑。** 今天就用这篇文章把前因后果和最快解法一次性说透。

## 二、 核心痛点：为什么阿里云 ECS 连不上 GitHub？

这里有两个最核心的误区，也是大多数人卡住的地方：

### 1. 本地电脑 不等于 云服务器

你在本地 Windows 电脑上配好了 GitHub 密钥，只能保证你的笔记本可以畅行 GitHub。**阿里云 ECS 是一台完全独立的远程计算机**，有它自己的系统环境。当你在 ECS 终端执行 `git clone` 时，发起请求的主体是 ECS 服务器（通常是 `root` 用户），Git 只会去服务器本地的 `/root/.ssh/` 路径下寻找身份令牌。ECS 没在 GitHub “登记”过，自然会被拒绝。

### 2. 不同平台的密钥可以“一箭双雕”

我的 ECS 服务器之前为了拉取公司的代码，已经生成过默认密钥（`id_rsa`）并绑定了 GitLab。很多同学以为一个密钥只能配一个平台，为了连 GitHub 就盲目去重新生成，结果把原本配好的 GitLab 给覆盖冲掉了。

**其实，GitHub 的铁律是：同一个密钥不能被两个不同的 GitHub 账号绑定（会报 Key is already in use）。但只要这个密钥没在 GitHub 绑定过，哪怕它在 GitLab 上用得再频繁，它在 GitHub 看来也是崭新的，完全可以复用！**

## 三、 完美解决步骤（在 ECS 上 2 步搞定）

既然我的阿里云 ECS 上已经有现成的默认密钥，且没有绑定过其他 GitHub 账号，那就完全不需要重新生成新密钥，更不需要折腾复杂的 `config` 多密钥路由分流。

直接把 ECS 现有的默认公钥，复制并登记到当前的 GitHub 账号中即可：

### 第一步：在阿里云 ECS 上查看并复制现有的默认公钥

直接在你的阿里云 ECS 终端运行以下命令，打印出公钥内容：

```bash
cat /root/.ssh/id_rsa.pub

```

> **💡 贴心提示**：如果提示 `No such file or directory`，说明你的服务器默认密钥采用了新的 Ed25519 算法，可以尝试运行：`cat /root/.ssh/id_ed25519.pub`。

运行后，终端会输出一段以 `ssh-rsa` 或 `ssh-ed25519` 开头的长字符串。**完整复制这一整段内容**。

### 第二步：将公钥添加到你的 GitHub 账号

1. 打开并登录你的 **GitHub 网页**。
2. 点击右上角头像 $\rightarrow$ 进入 **Settings**（设置）。
3. 在左侧导航栏中，找到并点击 **SSH and GPG keys**。
4. 点击右上角的绿色按钮 **New SSH key**。
5. **Title（标题）**：建议填一个辨识度高的名字，比如 `Aliyun-ECS-Server`，方便以后管理。
6. **Key（密钥）**：把刚才在服务器终端复制的整段公钥粘贴进去。
7. 点击 **Add SSH key** 保存。

## 四、 验证与结果

配置完成后，我们回到阿里云 ECS 服务器的终端，运行 SSH 握手命令测试两台服务器之间的连接：

```bash
ssh -T git@github.com

```

如果看到下面这行欢迎语，就说明你的阿里云 ECS 和 GitHub 已经成功“认亲”了：

> `Hi gouxinjie! You've successfully authenticated, but GitHub does not provide shell access.`

此时，重新在 ECS 上执行克隆命令：

```bash
git clone git@github.com:gouxinjie/paper.git

```

代码如丝般顺滑地开始下载，问题完美解决！

## 五、 总结

从阿里云 ECS 想要克隆 GitHub 的仓库，本质上就一句话：**谁发起 Git 命令，就去谁的系统里拿公钥去 GitHub 网页端登记。**

* **不要瞎折腾本地环境**：本地 Windows 的 CMD（使用 `%USERPROFILE%`）或者 PowerShell（使用 `$HOME`）配得再好，也渡不过去阿里云的河。
* **不要盲目覆盖老密钥**：只要没在 GitHub 上起过冲突，老密钥完全可以同时兼顾 GitLab 和 GitHub。
* **万一真的冲突了怎么办**：如果在别的场景下真的遇到了 `Key is already in use`，正确的姿势是用 `ssh-keygen -f` 专门给 GitHub 生成一个“分身密钥”，再通过 `.ssh/config` 文件进行域名路由分流，千万别动默认密钥这尊“本尊”。
