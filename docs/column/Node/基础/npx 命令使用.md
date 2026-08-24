# npx 命令：不用全局安装也能愉快使用各种工具

[[toc]]

在 Node.js 开发中，我们经常需要用到各种命令行工具，比如创建项目的脚手架、代码检查、格式化工具等。以前的做法通常是全局安装：

```bash
npm install -g create-react-app
create-react-app my-app
```

这种方式有两个明显的问题：
1. 全局安装容易造成版本冲突
2. 只是偶尔用一次的工具，却永久占用了系统空间

于是，npm 在 `5.2.0` 版本引入了 **npx**，很好地解决了这些问题。

### 什么是 npx？

npx 的全称是 **Node Package Execute**，可以简单理解为「包执行器」。

| 工具 | 主要职责 | 类比 |
|------|----------|------|
| npm  | 安装、管理包 | 工具仓库管理员 |
| npx  | 执行包里的命令 | 工具租赁服务 |

一句话总结：**npx 让你可以临时使用一个 npm 包，而不需要全局安装它。**

### npx 是怎么工作的？

当你执行 `npx 某个命令` 时，它会按以下顺序查找：

1. 先看当前项目的 `node_modules/.bin` 里有没有
2. 再看全局有没有安装
3. 如果都没有，就从 npm 仓库临时下载并执行

执行完成后，npx 会把这次临时安装的目录删除，保持系统干净。

需要注意的是：
- 删除的只是**临时目录**
- 下载的包会被缓存起来
- 下次再使用时，会直接从缓存中解压，速度更快

这就像去酒店：酒店有永久的房间库存（缓存），你住一次就分配一个房间，退房后房间被清理，但下次还可以再来住。

### 常见使用场景

**1. 创建项目脚手架（最经典）**

```bash
# 创建 React 项目
npx create-react-app my-app

# 创建 Vite 项目
npx create-vite@latest my-vite-app

# 创建 Next.js 项目
npx create-next-app@latest my-next-app
```

**2. 运行项目本地已安装的工具**

```bash
# 不用再写 ./node_modules/.bin/eslint
npx eslint src/
npx prettier --write .
npx tsc --init
```

**3. 指定版本运行**

```bash
npx create-react-app@5.0.1 my-app
```

**4. 临时体验一个工具**

```bash
npx cowsay "Hello npx"
npx http-server
```

### 常用参数

| 参数 | 作用 | 示例 |
|------|------|------|
| `@版本` | 指定包版本 | `npx create-react-app@latest` |
| `-y` / `--yes` | 跳过确认提示 | `npx -y create-react-app my-app` |
| `--no-install` | 只使用本地已有的包 | `npx --no-install eslint` |
| `-p` / `--package` | 指定包名（命令名和包名不一致时） | `npx -p cowsay cowsay hello` |

### 实际开发建议

- **脚手架类工具**（create-xxx）：优先用 `npx`，永远不建议全局安装
- **项目内工具**（eslint、prettier、jest 等）：用 `npx` 或写在 `package.json` 的 scripts 里
- **高频长期使用的工具**：可以考虑全局安装，但多数情况 `npx` 已经足够

### 总结

npx 的核心价值在于：

> **需要时临时借用，用完自动清理，既方便又不污染系统。**

它让我们告别了「为了用一次工具就全局安装」的旧习惯，是现代 Node.js 开发中非常实用的工具。

下次当你想用某个命令行工具时，不妨先试试：

```bash
npx 工具名
```

或许你会发现，根本不需要全局安装。
