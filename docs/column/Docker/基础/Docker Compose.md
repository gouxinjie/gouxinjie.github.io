# Docker Compose: 多容器应用的“编排说明书”

[[toc]]

![](../images/dockercompose.png)

一句话定义：

> **Docker Compose 是一个用 YAML 文件定义和运行“多容器应用”的工具。**

你只需要一个 `docker-compose.yml`：

```bash
docker compose up
```

就可以把一整套服务跑起来。

## 一、为什么需要 Docker Compose？

有的时候 一个完整的应用可能会是很多部分组成的，例如前端、后端、数据库 以及各种附加的技术栈，这些东西应该如何容器化呢？

我们可以自然的想到，将这些模块都打包在一起，做成一个巨大的容器。但这样做有一个弊端，只要其中一个模块发生故障，例如 服务端内存泄露，可能会导致整个容器都崩溃挂掉。

并且这样做的可伸缩性差，如果想给系统做扩容，只能把整个大容器在复制一份，做不到对某个模块的精确扩容。

多应用的最佳实践，是把每一个模块都打包成一个独立的容器。但这样多容器 增加了很多使用成本，因为想创建多个 容器 就要多次使用 `docker run` ，还需要配置容器之间的网络环境，尝试管理这些容器时，一个遗漏就会导致很多问题，并且若让其他人部署项目，如果操作者对部署流程不熟悉 也会导致各种问题的发生。

这个时候，容器编排技术就很有用了，也就是 `Docker Compose`，它使用 yml 文件 管理多个容器，在这个文件中记录了容器之间时如何创建以及如何协同工作的，我们可以简单的把 `Docker Compose` 文件理解成一个或多个 `Docker run` 命令，按照特定的格式书写到一个文件中。

### 1.1 不用 Compose 会怎样？

在真实项目中，我们很少只跑一个容器：

- 前端（Nginx）
- 后端（Node / Java）
- 数据库（MySQL / Redis）
- 反向代理

如果每个容器都用 `docker run` 手动启动，**不仅麻烦，而且不可维护**。

```bash
docker run mysql
docker run redis
docker run backend
docker run nginx
```

问题：

- 容器启动顺序难控制
- 网络配置复杂
- 参数多、容易出错
- 无法版本化、无法复现

### 1.2 使用 Docker Compose 后

```bash
docker compose up -d
```

✔️ 自动创建网络 ✔️ 自动容器互联 ✔️ 配置文件即文档 ✔️ 一条命令启动整个系统

## 二、常用配置项详解

### 2.1 image / build

#### 使用现成镜像

```yaml
image: nginx:alpine
```

#### 使用 Dockerfile 构建

```yaml
build:
  context: .
  dockerfile: Dockerfile
```

### 2.2 ports（端口映射）

```yaml
ports:
  - "8080:80"
```

含义：

```
宿主机 8080 → 容器 80
```

### 2.3 volumes（数据挂载）

```yaml
volumes:
  - ./nginx.conf:/etc/nginx/conf.d/default.conf
```

作用：

- 配置热更新
- 数据持久化

### 2.4 environment（环境变量）

```yaml
environment:
  - NODE_ENV=production
  - DB_HOST=mysql
```

👉 **服务名就是容器的域名**

### 2.5 depends_on（依赖关系）

```yaml
depends_on:
  - mysql
  - redis
```

说明：

- 控制启动顺序
- 不保证“服务已就绪”

### 2.6 networks（网络）

```yaml
networks:
  app-net:
```

Docker Compose 会：

- 自动创建网络
- 所有服务默认互通

## 三、一个真实的前端 + 后端 + 数据库示例

### 3.1 项目结构

```
.
├── frontend/
│   └── Dockerfile
├── backend/
│   └── Dockerfile
├── docker-compose.yml
```

### 3.2 docker-compose.yml

```yaml
# 指定 Docker Compose 文件格式版本，3.9 版本支持最新特性
version: "3.9"

# services 部分定义所有要运行的服务（容器）
services:
  # 前端服务定义
  frontend:
    # 使用 ./frontend 目录下的 Dockerfile 构建镜像
    build: ./frontend
    # 端口映射：将主机的80端口映射到容器的80端口
    ports:
      - "80:80"
    # 依赖关系：确保 backend 服务先启动再启动 frontend
    depends_on:
      - backend

  # 后端服务定义
  backend:
    # 使用 ./backend 目录下的 Dockerfile 构建镜像
    build: ./backend
    # 端口映射：将主机的3000端口映射到容器的3000端口
    ports:
      - "3000:3000"
    # 设置环境变量：数据库主机名设为 mysql（服务名）
    environment:
      - DB_HOST=mysql
    # 依赖关系：确保 mysql 服务先启动再启动 backend
    depends_on:
      - mysql

  # MySQL 数据库服务定义
  mysql:
    # 使用官方的 MySQL 8 镜像，不构建，直接拉取
    image: mysql:8
    # 设置 MySQL 环境变量
    environment:
      # 设置 root 用户密码（生产环境应该使用更安全的方式）
      MYSQL_ROOT_PASSWORD: root
      # 创建默认数据库
      MYSQL_DATABASE: app
    # 数据卷挂载：将 mysql-data 卷挂载到容器的数据库目录
    volumes:
      - mysql-data:/var/lib/mysql

# 定义项目中使用的数据卷
volumes:
  # 创建名为 mysql-data 的持久化数据卷
  mysql-data:
    # 注意：这里可以进一步配置卷的属性，但当前配置使用默认设置
```

### 3.3 服务间是如何通信的？

```text
frontend → backend:3000
backend → mysql:3306
```

👉 **直接用 service 名，不用 IP**

## 四、Docker Compose 常用命令

### 4.1 启动服务

```bash
# 启动所有服务（前台运行）
docker-compose up

# 后台启动
docker-compose up -d

# 重新构建镜像后启动
docker-compose up --build

# 强制重新创建容器
docker-compose up --force-recreate
```

### 4.2 停止服务

```bash
# 停止服务
docker-compose stop

# 停止并删除容器、网络
docker-compose down

# 停止并删除所有资源（包括卷）
docker-compose down -v

# 停止并删除所有资源（包括镜像）
docker-compose down --rmi all
```

### 4.3 查看状态

```bash
# 查看运行状态
docker-compose ps

# 查看所有服务状态（包括停止的）
docker-compose ps -a

# 查看服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs -f backend

# 查看服务资源使用情况
docker-compose top
```

### 4.4 管理服务

```bash
# 重启服务
docker-compose restart

# 重启特定服务
docker-compose restart backend

# 暂停服务
docker-compose pause

# 恢复服务
docker-compose unpause

# 缩放服务实例数量
docker-compose up --scale backend=3
```

### 4.5 执行命令

```bash
# 在运行的容器中执行命令
docker-compose exec backend bash

# 执行一次性命令
docker-compose run --rm backend npm test

# 以特定用户执行
docker-compose exec -u root backend bash
```

### 4.6 构建和推送

```bash
# 构建镜像
docker-compose build

# 构建特定服务
docker-compose build backend

# 推送镜像到仓库
docker-compose push

# 拉取镜像
docker-compose pull
```
