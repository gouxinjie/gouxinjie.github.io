const n=`# Linux 包管理器使用（apt / yum）：从软件安装到配置管理

[[toc]]

![](../images/package-cover.jpg)

在 Linux 世界中，**包管理器（Package Manager）** 就好比系统的“应用商店”和“软件管家”。

在早期的 Linux 中，安装软件需要下载源代码、解压、配置编译环境并手动编译，不仅耗时，还容易陷入极其繁琐的“依赖地狱（Dependency Hell）”。

现代 Linux 发行版通过包管理器解决了这个问题。它不仅负责**软件的安装、更新、卸载**，还能**自动解决软件依赖关系**，并从安全的官方软件源（Repository）中下载预编译好的安装包。

本文将聚焦两大最主流的包管理器：**Debian/Ubuntu 系的 \`apt\`** 和 **Red Hat/CentOS/Rocky 系的 \`yum\`/\`dnf\`**。


## 1. 软件源与包管理器的核心逻辑

包管理器之所以能一键安装软件，依靠的是背后的**软件源（Repositories）**。

\`\`\`
          ┌──────────────────────────────────────────────┐
          │     官方 / 第三方 镜像服务器 (Repository)      │
          │         (包含 .deb 或 .rpm 安装包及索引)      │
          └──────────────────────┬───────────────────────┘
                                 │
                   ( apt update  │  yum makecache )
                                 │ 下载元数据/索引文件
                                 ▼
          ┌──────────────────────────────────────────────┐
          │           本地软件索引数据库 (Local Cache)     │
          └──────────────────────┬───────────────────────┘
                                 │
                     ( apt install / yum install )
                                 │ 比对依赖关系并下载安装
                                 ▼
          ┌──────────────────────────────────────────────┐
          │             你的 Linux 操作系统              │
          └──────────────────────────────────────────────┘

\`\`\`

* **更新索引**：告诉本地系统当前软件源里有哪些软件、什么版本。
* **依赖解析**：当你安装软件 A 时，包管理器自动检测并同时安装所需的依赖项 B 和 C。


## 2. APT 使用指南（Ubuntu / Debian 派系）

\`apt\`（Advanced Package Tool）是 Debian 及其衍生版（如 Ubuntu、Linux Mint）的核心包管理工具。

> 💡 **小知识**：过去常用 \`apt-get\` 和 \`apt-cache\`，现代系统推荐直接使用整合且对用户更友好的 **\`apt\`** 命令。

### 2.1 常用核心命令表

| 操作类型 | \`apt\` 命令 | 说明 |
| --- | --- | --- |
| **更新软件索引** | \`sudo apt update\` | 刷新本地软件库索引（安装新软件前**必做**） |
| **升级已安装软件** | \`sudo apt upgrade\` | 将系统已安装的所有软件升级到最新版本 |
| **搜索软件** | \`apt search <软件名>\` | 在软件库中查找相关包 |
| **查看软件详情** | \`apt show <软件名>\` | 查看软件版本、依赖关系与描述信息 |
| **安装软件** | \`sudo apt install <软件名>\` | 自动下载并安装软件及依赖 |
| **重新安装** | \`sudo apt reinstall <软件名>\` | 修复损坏或文件缺失的软件 |
| **卸载软件（保留配置）** | \`sudo apt remove <软件名>\` | 卸载软件本体，但保留其配置文件 |
| **彻底卸载（包含配置）** | \`sudo apt purge <软件名>\` | 卸载软件并**删除所有相关的配置文件** |
| **清理无用依赖** | \`sudo apt autoremove\` | 自动删除先前作为依赖安装但现在不再需要的无用包 |

### 2.2 替换国内镜像源（加速下载）

默认的官方源服务器在海外，国内下载速度可能较慢。可以通过修改 \`/etc/apt/sources.list\` 换成国内镜像（如清华源、阿里云源）：

\`\`\`bash
# 1. 备份原有的镜像配置文件
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

# 2. 编辑配置文件（以清华源为例）
sudo nano /etc/apt/sources.list

# 3. 修改后刷新本地索引
sudo apt update

\`\`\`


## 3. YUM / DNF 使用指南（Red Hat / CentOS / Rocky 派系）

在 \`Red Hat Enterprise Linux (RHEL)、CentOS、Rocky Linux 以及 AlmaLinux\` 中，传统使用的是 **\`yum\`**（Yellowdog Updater, Modified）。

在较新的系统中（如 RHEL 8/9、Fedora、Rocky Linux 8+），\`yum\` 底层已被全新的 **\`dnf\`** 替代。但在实际使用中，\`yum\` 和 \`dnf\` 的语法完全兼容，输入 \`yum\` 会自动调取 \`dnf\`。

### 3.1 常用核心命令表

| 操作类型 | \`yum\` / \`dnf\` 命令 | 说明 |
| --- | --- | --- |
| **更新软件索引** | \`sudo yum makecache\` | 刷新并建立本地软件包元数据缓存 |
| **检查可更新项目** | \`sudo yum check-update\` | 列出所有有可用更新的软件包 |
| **升级所有软件** | \`sudo yum update\` (或 \`dnf upgrade\`) | 升级系统中的所有软件包 |
| **搜索软件** | \`yum search <软件名>\` | 在软件库中匹配名称或描述 |
| **安装软件** | \`sudo yum install <软件名>\` | 自动下载并安装（加 \`-y\` 可免去手动确认） |
| **卸载软件** | \`sudo yum remove <软件名>\` | 卸载软件及其独有的依赖包 |
| **清理缓存** | \`sudo yum clean all\` | 清除下载的缓存文件和旧的元数据 |
| **查看安装历史** | \`yum history\` | 查看历史安装/卸载记录（支持 \`yum history undo ID\` 撤销操作） |

### 3.2 EPEL 扩展软件源

\`CentOS / Rocky Linux\` 的官方源为了追求极致稳定性，软件数量较少。通常运维人员会优先安装 **EPEL（Extra Packages for Enterprise Linux）** 扩展源：

\`\`\`bash
# 一键安装 EPEL 扩展源
sudo yum install epel-release -y

# 刷新缓存后即可安装更多常用软件（如 nginx、htop、redis 等）
sudo yum makecache

\`\`\`


## 4. apt vs yum 命令对照速查

下表整理了两大体系中最常用操作的语法对比，方便在不同系统中切换：

| 功能需求 | Debian / Ubuntu (\`apt\`) | Red Hat / Rocky (\`yum\` / \`dnf\`) |
| --- | --- | --- |
| **刷新本地索引** | \`sudo apt update\` | \`sudo yum makecache\` |
| **安装指定软件** | \`sudo apt install nginx\` | \`sudo yum install nginx -y\` |
| **普通卸载软件** | \`sudo apt remove nginx\` | \`sudo yum remove nginx\` |
| **彻底清除卸载** | \`sudo apt purge nginx\` | \`sudo yum remove nginx\` *(手动清理 \`/etc/nginx\`)* |
| **搜索软件包** | \`apt search nginx\` | \`yum search nginx\` |
| **升级系统所有包** | \`sudo apt upgrade\` | \`sudo yum update\` |
| **清理无用缓存/依赖** | \`sudo apt autoremove\` | \`sudo yum autoremove\` |


## 5. 生产环境实战案例

### 场景：在 Ubuntu 和 Rocky Linux 上分别部署 Nginx Web 服务器

 **实操案例 1：Ubuntu 上部署 Nginx**
 \`\`\`bash
 # 1. 养成习惯，安装前先更新软件包索引
 sudo apt update

 # 2. 安装 Nginx
 sudo apt install nginx -y

 # 3. 启动并设置开机自启
 sudo systemctl start nginx
 sudo systemctl enable nginx

 \`\`\`



 **实操案例 2：Rocky Linux 上部署 Nginx**
 \`\`\`bash
 # 1. 安装 EPEL 扩展源以确保获取最新的软件包
 sudo yum install epel-release -y

 # 2. 安装 Nginx
 sudo yum install nginx -y

 # 3. 启动服务并检查状态
 sudo systemctl enable --now nginx

 \`\`\`

## 6. 总结

1. **先 Update，后 Install**：在 Ubuntu 中，安装新软件前一定要执行 \`sudo apt update\`，确保下载的是最新的索引与安全补丁。
2. **区别卸载命令**：在 \`apt\` 中，\`remove\` 只删程序保留配置，想连带配置一起清空需要用 \`purge\`。
3. **扩展源是关键**：RHEL/Rocky 系系统如果找不到某些常见软件（如 \`htop\`），先确认是否安装了 \`epel-release\`。
`;export{n as default};
