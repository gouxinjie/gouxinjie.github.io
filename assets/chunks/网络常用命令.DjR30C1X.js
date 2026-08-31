const n=`# Linux 网络常用命令：排查、诊断与连通性分析

[[toc]]

![](../images/network-cover.jpg)

在 \`Linux\` 系统开发与运维中，网络命令是排查接口调用失败、端口冲突、 DNS 解析异常以及服务连通性问题的最有效工具。

我们将网络排查工具分为 **4 个核心维度**：连通性测试、端口与监听分析、路由与抓包诊断、以及 HTTP API 调试。


## 1. 连通性与域名解析工具

### 1.1 \`ping\`：测试 ICMP 网络连通性

测试当前主机与目标 IP/域名之间的网络连通性及延迟。

\`\`\`bash
# -c 4: 仅发送 4 个数据包后自动停止（Linux 下默认会一直 ping）
ping -c 4 gouxinjie.com

\`\`\`

> 💡 **注意**：部分服务器或防火墙会禁用 ICMP 协议，导致 \`ping\` 不通，但实际 HTTP/TCP 服务可能依然正常。

### 1.2 \`dig\` & \`nslookup\`：DNS 域名解析排查

用于查询域名的 DNS 解析记录，判断域名是否正确指向对应 IP。

\`\`\`bash
# 1. dig：显示详细的 DNS 查询过程与解析记录（推荐）
dig gouxinjie.com

# 指定特定 DNS 服务器（如 8.8.8.8）查询
dig @8.8.8.8 gouxinjie.com

# 2. nslookup：简易域名查询
nslookup gouxinjie.com

\`\`\`

## 2. 端口检查与网络连接状态

### 2.1 \`ss\` / \`netstat\`：查看端口占用与套接字状态

排查“端口是否已监听”、“被哪个进程占用”或“连接数是否爆满”。

> ⚠️ \`netstat\` 在现代 Linux 发行版中已被废弃，**强烈推荐使用更快更轻量的 \`ss\` 命令**。

\`\`\`bash
# 常用参数组合：-t (TCP) -u (UDP) -l (Listening 监听) -n (Numeric 数字端口) -p (Process 显示进程名/PID)

# 1. 查看当前系统所有正在监听的 TCP/UDP 端口及对应进程
sudo ss -tulnp

# 2. 精准排查特定端口（如 80 或 3000）是否被占用
sudo ss -tulnp | grep :3000

# 3. 统计各种 TCP 连接状态的数量（排查 TIME-WAIT 或 CLOSE-WAIT 积压问题）
ss -ant | awk '{print $1}' | sort | uniq -c

\`\`\`

### 2.2 \`nc\` (netcat) / \`telnet\`：测试 TCP 端口连通性

\`ping\` 只能测试 IP，而 \`nc\` 或 \`telnet\` 可以验证某个**特定的 TCP 端口**是否对外开放。

\`\`\`bash
# 检查目标主机的 443 端口是否能够建立 TCP 连接 (-z: 不发送数据, -v: 显示详细过程)
nc -zv gouxinjie.com 443

# 使用 telnet 测试端口（按 Ctrl + ] 然后输入 quit 退出）
telnet gouxinjie.com 80

\`\`\`

## 3. 路由路径与抓包诊断

### 3.1 \`traceroute\` / \`tracepath\`：追踪数据包路由路径

查看本地到目标服务器之间经过了哪些路由器跳数（Hops），常用于定位“网络在哪个节点断开或延迟变高”。

\`\`\`bash
traceroute gouxinjie.com

\`\`\`

### 3.2 \`tcpdump\`：网络抓包神器

Linux 终端最强大的网络数据包分析工具（相当于无界面的 Wireshark）。

\`\`\`bash
# 1. 抓取指定网卡 eth0 上端口为 80 的 TCP 数据包
sudo tcpdump -i eth0 tcp port 80 -n

# 2. 抓取来自特定源 IP 的数据包并保存为 pcap 文件，供本地 Wireshark 分析
sudo tcpdump -i any src 192.168.1.50 -w capture.pcap

\`\`\`

## 4. HTTP / API 接口调试与传输

### 4.1 \`curl\`：万能的网络请求命令行工具

用于发送各种 HTTP/HTTPS 请求，常用于测试后端接口、下载文件或验证 API。

\`\`\`bash
# 1. 查看响应头信息（-I 参数）与 HTTP 状态码
curl -I https://gouxinjie.com

# 2. 发送 POST JSON 请求
curl -X POST https://api.example.com/v1/user \\
     -H "Content-Type: application/json" \\
     -d '{"name": "alex", "role": "admin"}'

# 3. 显示详细的 HTTP 握手与请求过程（-v 参数，排查 TLS/SSL 证书问题）
curl -v https://gouxinjie.com

\`\`\`

### 4.2 \`wget\`：后台文件下载工具

专用于从指定 URL 递归或断点续传下载文件。

\`\`\`bash
# 下载文件并保存，支持断点续传 (-c 参数)
wget -c https://example.com/file.tar.gz

\`\`\`

## 5. 命令应用场景快速对齐
| 场景 | 推荐命令 | 作用 |
| --- | --- | --- |
| **测试服务端口是否开启** | \`nc -zv IP 端口\` | 快速确认端口是否通畅 |
| **端口冲突 / 查找进程** | \`sudo ss -tulnp | grep :端口\` | 找出占用端口的 PID |
| **域名解析排查** | \`dig 域名\` | 检查 DNS 是否正确生效 |
| **调试 Web / API 接口** | \`curl -i URL\` | 检查状态码与响应 Payload |
| **网络延迟 / 丢包测试** | \`ping IP\` | 基础 ICMP 连通性测试 |
`;export{n as default};
