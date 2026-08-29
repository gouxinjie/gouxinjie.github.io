const n=`# Linux 系统服务管理：systemd 与 systemctl 实战指南


[[toc]]

![](../images/systemd-cover.jpg)

在现代 Linux 系统（如 Ubuntu、Debian、CentOS 7+、Rocky Linux）中，**systemd** 是默认的系统与服务管理器（Init 软件）。它接管了系统启动、服务（Daemon）生命周期管理、日志收集等核心功能。

掌握 systemd 的核心工具 **\`systemctl\`**，不仅能帮助你管理常见的官方服务（如 Nginx、MySQL、Docker），还能让你轻松把自己的程序（Node.js、Python、Go 等）注册为**开机自启、崩溃自动重启**的后台系统服务。


## 1. 什么是 systemd 与 systemctl？

* **systemd**：Linux 开机后启动的**第一个进程**（PID = 1），也是所有其他进程的父进程。它通过并行启动服务大幅缩短了系统开机时间。
* **systemctl**：用户与 systemd 进行交互的主要**命令行工具**，专门用于控制服务的启动、停止、重启、开机自启和状态查看。
* **Unit（单元）**：systemd 管理的对象统称为 Unit。最常见的就是 **Service Unit（以 \`.service\` 结尾的服务单元）**。

## 2. 核心服务管理命令（systemctl）

在平时运维和部署中，大部分场景都在使用 \`systemctl\`。操作语法通常为：\`systemctl <操作> <服务名>\`。

### 2.1 常用核心命令速查表

| 操作需求 | 命令示例 | 说明 |
| --- | --- | --- |
| **启动服务** | \`sudo systemctl start nginx\` | 立即启动服务（对当前运行环境生效） |
| **停止服务** | \`sudo systemctl stop nginx\` | 立即停止服务 |
| **重启服务** | \`sudo systemctl restart nginx\` | 强制重启服务 |
| **平滑重载** | \`sudo systemctl reload nginx\` | **推荐**。不中断服务的情况下重新加载配置文件 |
| **查看服务状态** | \`systemctl status nginx\` | 查看服务是否正常运行、PID 及最新日志 |
| **开机自启** | \`sudo systemctl enable nginx\` | 设置服务在开机时自动启动 |
| **禁止开机自启** | \`sudo systemctl disable nginx\` | 取消服务的开机自启 |
| **开机自启并立即启动** | \`sudo systemctl enable --now nginx\` | **组合技**：一步完成 enable 和 start |
| **检查是否开机自启** | \`systemctl is-enabled nginx\` | 输出 \`enabled\` 或 \`disabled\` |

### 2.2 详解 \`systemctl status\` 诊断输出

当服务运行异常时，\`systemctl status\` 是排错的第一现场：

\`\`\`text
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Sat 2026-08-29 09:30:00 CST; 20min ago
       Docs: man:nginx(8)
   Main PID: 12345 (nginx)
      Tasks: 3 (limit: 4621)
     Memory: 5.2M
        CPU: 12ms
     CGroup: /system.slice/nginx.service
             ├─12345 nginx: master process /usr/sbin/nginx
             └─12346 nginx: worker process

\`\`\`

* **\`Loaded\`**：显示配置文件的路径，以及**是否设置了开机自启（enabled/disabled）**。
* **\`Active\`**：显示当前的运行状态。
* **\`active (running)\`**：服务正在正常运行。
* **\`inactive (dead)\`**：服务已停止。
* **\`failed\`**：服务启动失败或崩溃。


* **\`Main PID\`**：主进程的 PID。


## 3. 查看服务日志：\`journalctl\`

systemd 内置了强大的日志管理组件 \`systemd-journald\`，所有由 systemd 管理的服务输出的日志（包含 stdout/stderr）都会被自动收集。

\`\`\`bash
# 1. 查看指定服务的全部历史日志
sudo journalctl -u nginx

# 2. 实时追踪某个服务的最新日志（类似 tail -f）
sudo journalctl -fu nginx

# 3. 查看最近 50 行日志
sudo journalctl -u nginx -n 50

# 4. 查看自本次系统开机以来的该服务日志
sudo journalctl -u nginx -b

\`\`\`


## 4. 实战：将自己的程序注册为 systemd 服务

假设你写了一个 Node.js / Python / Go 的 Web 应用，配置文件路径为 \`/home/alex/app/server.js\`。如果不配置系统服务，一旦命令行终端关闭或服务器重启，应用就会停止。

通过配置 \`.service\` 配置文件，可以实现 **后台运行 + 开机自启 + 崩溃自动重启**。

### 4.1 配置文件存放位置

systemd 服务配置文件分为两类：

* **系统/软件包默认配置**：\`/lib/systemd/system/\` 或 \`/usr/lib/systemd/system/\`
* **管理员自定义配置（优先使用）**：**\`/etc/systemd/system/\`**

### 4.2 编写 \`.service\` 模板

新建服务配置文件 \`/etc/systemd/system/myapp.service\`：

\`\`\`ini
[Unit]
Description=My Custom Node.js Application
# 确保在网络服务启动完成后再启动本服务
After=network.target

[Service]
# 服务类型：simple 表示 ExecStart 指定的进程为主进程
Type=simple

# 运行该服务的用户与组（出于安全考虑，切忌用 root）
User=alex
Group=devteam

# 程序的工作目录
WorkingDirectory=/home/alex/app

# 启动服务的具体命令（建议写绝对路径）
ExecStart=/usr/bin/node /home/alex/app/server.js

# 崩溃重启策略：always 表示无论正常退出还是崩溃，总是自动重启
Restart=always
# 每次重启之间的间隔延迟（单位秒）
RestartSec=5s

# 环境变量设置
Environment=NODE_ENV=production PORT=3000

[Install]
# 规定该服务在系统的多用户模式（Multi-User Target）下生效
WantedBy=multi-user.target

\`\`\`
### 4.3 部署并启用自定义服务

编写完 \`.service\` 文件后，遵循以下标准四步法：

\`\`\`bash
# 第一步：重载 systemd 配置，让系统识别新的 service 文件
sudo systemctl daemon-reload

# 第二步：启动服务
sudo systemctl start myapp

# 第三步：检查服务运行状态
systemctl status myapp

# 第四步：设置开机自启
sudo systemctl enable myapp

\`\`\`


## 5. 总结

1. **统一的命令体验**：无论是官方软件还是自己编写的服务，一律使用 \`systemctl start/stop/status/restart\` 管理。
2. **\`daemon-reload\` 是关键**：只要修改或新建了 \`/etc/systemd/system/\` 下的 \`.service\` 文件，**必须先执行 \`sudo systemctl daemon-reload**\` 才能生效。
3. **安全运行**：编写自定义服务时，\`Service\` 段落中显式配置 \`User=非root用户\`，遵循最小权限原则。
`;export{n as default};
