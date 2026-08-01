const n=`# 容器日志和监控

[[toc]]

在 Docker 容器化架构中，**日志（Logs）** 和 **监控（Metrics）** 是保证系统可观测性（Observability）的两大核心支柱。

* **日志** 解决的是 **“发生了什么”**（追溯具体事件、报错信息）。
* **监控** 解决的是 **“系统状态如何”**（CPU/内存使用率、请求延迟、系统健康度）。


## 一、 容器日志体系

与传统虚拟机不同，Docker 容器设计倡导 **“单一进程”** 理念。容器的标准输出（\`stdout\`）和标准错误（\`stderr\`）是捕获日志的最主要途径。

### 1. 日志驱动（Logging Drivers）

Docker 通过内置的 Logging Driver 来决定如何处理容器输出的日志：

* **\`json-file\`（默认）**：将日志以 JSON 格式写入宿主机磁盘（路径通常在 \`/var/lib/docker/containers/<container-id>/<container-id>-json.log\`）。
* *缺点*：如果不做配置，日志文件会无限增长，占满宿主机磁盘。


* **\`journald\`**：将日志发送到宿主机的 \`systemd-journald\` 服务。
* **\`syslog\`**：将日志发送到系统的 syslog 守护进程。
* **\`fluentd\` / \`gelf\` / \`splunk**\`：直接将日志通过网络转发给远端集中式日志收集系统。

> 💡 **生产避坑提示**：使用默认 \`json-file\` 驱动时，务必设置**日志滚动策略（Log Rotation）**，防止磁盘被塞满！
> \`\`\`yaml
> # docker-compose.yml 示例
> services:
>   web:
>     image: nginx
>     logging:
>       driver: "json-file"
>       options:
>         max-size: "10m"   # 单个文件最大 10MB
>         max-file: "3"     # 最多保留 3 个文件
>
> \`\`\`
>
>

---

### 2. 主流集中式日志收集架构

在多容器/集群环境下，登录到单个宿主机用 \`docker logs\` 查看日志是不切实际的，通常采用以下几种集中式收集方案：

\`\`\`
[容器 stdout/stderr] ──► [日志收集 Agent] ──► [消息队列/存储] ──► [可视化界面]

\`\`\`

| 方案 | 收集组件 (Collector) | 存储/引擎 (Storage) | 展示组件 (UI) | 特点与适用场景 |
| --- | --- | --- | --- | --- |
| **ELK / EFK** | Filebeat / Fluentd | Elasticsearch | Kibana | 业界标杆，功能极度丰富，但 **内存和 CPU 开销较大**。 |
| **PLG (Loki)** | Promtail | Grafana Loki | Grafana | 轻量级，日志不索引全文只索引标签，**成本低、与 Prometheus 无缝集成**。 |


## 二、 容器监控体系

容器具有短生命周期、高动态扩缩容的特点，传统的固定 IP 监控方式已不再适用。监控的核心指标主要包括：**CPU、内存、网络 I/O、磁盘 I/O** 以及**应用业务指标**。

### 1. 指标来源：cgroups

Docker 容器的资源隔离与限制依赖于 Linux 底层的 **cgroups（Control Groups）**。
监控工具正是通过读取 \`/sys/fs/cgroup/\` 下的虚拟文件（或通过 Docker Daemon API）来获取容器的实时资源消耗数据的。


### 2. 主流监控架构组合：Prometheus + cAdvisor + Grafana

这是当前 Docker 和 Kubernetes 领域**最标准、最流行**的开源监控套件：

1. **数据采集 (cAdvisor):** Google 开源的容器指标收集器.
cAdvisor 以容器形式运行在每台宿主机上，实时读取 cgroups 信息，将容器的 CPU、内存、网络、磁盘等指标暴露为标准 HTTP 接口。


2. **数据存储 (Prometheus):** 时序数据库 (TSDB).
Prometheus 定期（如每 15 秒）主动向 cAdvisor 抓取（Pull）指标数据，并按照时间序列保存在内部数据库中。


3. **可视化展示 (Grafana):** 仪表盘看板.
Grafana 连接 Prometheus 作为数据源，通过配置好的 Dashboard 呈现出直观的图表（CPU 使用率曲线、内存报警阀值等）。



## 三、 总结与最佳实践

| 维度 | 基础/单机环境 | 中大型/生产环境 |
| --- | --- | --- |
| **日志** | 限制 \`json-file\` 文件大小 + \`docker logs -f\` | **Grafana Loki + Promtail** 或 **EFK (Elasticsearch + Filebeat)** |
| **监控** | \`docker stats\` 命令 | **Prometheus + cAdvisor + Grafana** |
| **告警** | 简单脚本触发邮件 | Prometheus **Alertmanager** 关联钉钉/企业微信/PagerDuty |

* **应用层面**：确保程序直接写日志到 \`stdout\` 和 \`stderr\`，不要写到容器内部的静态文件中。
* **运维层面**：监控不仅要看容器，还要同时监控**宿主机物理指标**（如宿主机磁盘空间、inode 节点数），防止基础层崩溃导致容器批量故障。
`;export{n as default};
