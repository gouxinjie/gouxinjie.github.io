const n=`# Linux 系统日志查看：日志体系、核心命令与实战排查

[[toc]]

![](../images/log-cover.jpg)

在 Linux 系统维护与软件开发中，**日志（Logs）** 是排查错误、分析系统性能和审计安全事件最直接的依据。

现代 Linux 系统（如 Ubuntu, Debian, CentOS 7+, Rocky Linux）采用了**双轨日志体系**：

1. **传统文件日志**：由 \`rsyslog\` 守护进程管理，以明文文本存放在 \`/var/log\` 目录下。
2. **systemd 结构化日志**：由 \`systemd-journald\` 守护进程管理，以二进制格式高效存储，通过 \`journalctl\` 工具统一查询。


## 1. 核心日志目录 \`/var/log\` 解析

在 \`/var/log\` 目录中，存放着各类系统核心服务的明文日志文件。

| 日志文件路径 | 记录内容与用途 |
| --- | --- |
| **\`/var/log/syslog\`** 或 **\`/var/log/messages\`** | **最核心的系统全局日志**。包含系统启动、内核消息、各类后台服务运行与报错信息。（Ubuntu/Debian 常用 \`syslog\`，CentOS/RHEL 常用 \`messages\`） |
| **\`/var/log/auth.log\`** 或 **\`/var/log/secure\`** | **安全与身份验证日志**。记录用户登录、\`sudo\` 提权、SSH 远程连接尝试及失败记录。 |
| **\`/var/log/kern.log\`** | **内核日志**。记录内核产生的警告与错误（如硬件故障、OOM 内存溢出）。 |
| **\`/var/log/dmesg\`** | **开机启动环形缓冲区日志**。记录硬件检测与驱动加载过程。 |
| **\`/var/log/nginx/\`** / **\`/var/log/mysql/\`** | 各种应用软件服务的专用日志目录。 |

## 2. 文本日志查看命令（排查四剑客）

对于 \`/var/log\` 下的明文日志，结合 Linux 文本处理工具可以实现高效定位：

\`\`\`bash
# 1. tail -f：实时追踪日志末尾最新动态（排查线上实时问题的神器）
sudo tail -fn 100 /var/log/syslog

# 2. less：分页阅读大日志文件（支持 / 键向下搜索，? 键向上搜索，G 到文件底部，q 退出）
sudo less /var/log/auth.log

# 3. grep：过滤特定关键字（如筛选 SSH 登录失败记录）
sudo grep "Failed password" /var/log/auth.log

# 4. zgrep / zless：直接查看被 logrotate 压缩过的历史日志文件（.gz 结尾）
sudo zgrep "ERROR" /var/log/syslog.2.gz

\`\`\`

## 3. systemd 日志管理：\`journalctl\`

\`journalctl\` 是与 \`systemd-journald\` 交互的命令行工具。它打破了传统按文件存储日志的限制，支持按**服务名、时间段、日志级别**进行多维度的结构化查询。

### 3.1 高频使用指令集

\`\`\`bash
# 1. 查看指定服务的日志（最常用）
sudo journalctl -u nginx

# 2. 实时追踪某个服务的最新输出（相当于 tail -f）
sudo journalctl -fu nginx

# 3. 按时间范围精准筛选
sudo journalctl --since "2026-08-29 08:00:00" --until "2026-08-29 09:30:00"

# 4. 只查看某种错误级别以上的日志
# 日志级别: 0:emerg, 1:alert, 2:crit, 3:err, 4:warning, 5:notice, 6:info, 7:debug
sudo journalctl -p err -u nginx

# 5. 查看本次系统开机以来的所有日志
sudo journalctl -b

# 6. 查看内核日志（相当于 dmesg）
sudo journalctl -k

\`\`\`

## 4. 生产环境高频实战案例

### 案例 1：排查 SSH 暴力破解与非法登录

通过检查认证日志，分析是否有异常 IP 在尝试爆破密码：

\`\`\`bash
# 查看所有 SSH 登录失败的记录及来源 IP
sudo grep "Failed password for" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr

# 使用 journalctl 排查 sshd 服务日志
sudo journalctl -u ssh -n 50 --no-pager

\`\`\`

### 案例 2：排查程序莫名“被杀”（OOM Killer 内存爆满）

当 Java、Node.js 或 Python 应用在后台无故退出，且应用自身日志没有报错时，通常是被系统的 OOM (Out Of Memory) 机制强制斩杀：

\`\`\`bash
# 在内核日志中搜索 Out of memory 关键字
sudo dmesg -T | grep -i "out of memory"

# 或者使用 journalctl 查询
sudo journalctl -k | grep -i "oom"

\`\`\`

## 5. 日志清理与轮转机制（\`logrotate\`）

为了防止日志文件无限膨胀挤爆磁盘，Linux 内置了 **\`logrotate\`** 机制。

* **工作原理**：定时对日志进行**切分、压缩（\`.gz\`）、备份与过期删除**。
* **配置文件路径**：\`/etc/logrotate.conf\` 以及 \`/etc/logrotate.d/\` 目录。

### 清理 \`journalctl\` 二进制日志

如果 \`journalctl\` 占用磁盘空间过大，可以使用内置命令限制或清理：

\`\`\`bash
# 查看当前 journal 日志占用的磁盘空间
journalctl --disk-usage

# 限制日志只保留最近 2 天
sudo journalctl --vacuum-time=2d

# 限制日志总量不超过 500M
sudo journalctl --vacuum-size=500M

\`\`\`

## 6. 总结

1. **查服务看 \`journalctl\`**：管理由 \`systemd\` 托管的服务时，优先使用 \`journalctl -fu <service>\`。
2. **查安全看 \`auth.log\` / \`secure\`**：排查登录、权限、提权相关事件。
3. **查系统异常看 \`dmesg\` / \`syslog\`**：遇到应用崩溃或硬件报错，优先在内核与系统日志中寻找 OOM 或硬件错误标记。
`;export{n as default};
