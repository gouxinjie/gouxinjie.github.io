# npx 命令

[[toc]]

`npx` 是 `npm 5.2+` 版本内置的一个工具，用于**直接运行 Node.js 包中的可执行文件**，无需先全局或局部安装包。它的设计初衷是简化包的临时使用和项目依赖管理。下面是详细解析：

### 1. 核心功能

- **直接运行本地/远程的 npm 包**：无需全局安装即可执行命令。
- **自动查找依赖**：优先从本地 `node_modules/.bin` 或项目依赖中查找命令。
- **临时安装并运行**：如果包未安装，自动从 npm 仓库下载（运行后删除）。
- **执行 GitHub/URL 代码**：直接运行远程脚本或仓库代码。

### 2. 基本用法

#### 2.1 运行本地已安装的包

```bash
npx <package-name> [args]
# 示例：运行本地安装的 eslint
npx eslint --version
```

#### 2.2 临时运行未安装的包

```bash
# 临时安装 create-react-app 并执行，完成后删除
npx create-react-app my-app
```

#### 2.3 指定包版本

```bash
npx <package-name>@<version> [args]
# 示例：使用特定版本的 create-react-app
npx create-react-app@5.0.1 my-app
```

### 3. 与 `npm run` 的区别

| **对比项**   | `npx`                             | `npm run`                                     |
| ------------ | --------------------------------- | --------------------------------------------- |
| **安装要求** | 可临时安装包                      | 必须提前安装包（写入 `package.json`）         |
| **作用范围** | 可运行任意 npm 包                 | 仅运行 `package.json` 中 `scripts` 定义的命令 |
| **使用场景** | 一次性命令（如脚手架工具）        | 项目标准化脚本（如构建、测试）                |
| **路径解析** | 自动查找全局和本地 `node_modules` | 仅限本地 `node_modules/.bin`                  |

### 4. 常见使用场景

#### 场景 1：快速调用脚手架工具

```bash
# 无需全局安装，直接创建 React 项目
npx create-react-app my-app
# 执行后不会残留全局包
```

#### 场景 2：运行项目依赖中的 CLI

```bash
# 即使未全局安装，也能运行项目内的 webpack
npx webpack --config webpack.config.js
```

#### 场景 3：执行远程代码

```bash
# 运行 GitHub Gist 中的脚本
npx https://gist.github.com/username/1234567
```

#### 场景 4：切换包版本测试

```bash
# 临时使用旧版本工具
npx prettier@2.8.0 --write .
```

### 5. 高级用法

#### 5.1 强制使用本地包（避免下载）

```bash
npx --no-install <package-name>  # 如果本地不存在则报错
```

#### 5.2 忽略缓存（重新下载）

```bash
npx --ignore-existing create-react-app my-app
```

#### 5.3 指定 Node.js 版本运行

```bash
npx -p node@16 npm run build  # 使用 Node 16 执行命令
```

#### 5.4 并行执行多个包

```bash
npx -p lodash -p moment cat <<< "console.log(_.VERSION, moment().format())" | node
```

### 6. 工作原理

1. **查找路径**：
   - 检查本地 `node_modules/.bin` 和全局 `PATH` 中是否存在目标命令。
2. **临时安装**：
   - 如果未找到，从 npm 仓库下载包到临时目录（通常位于 `~/.npm/_npx`）。
3. **执行后清理**：
   - 运行完成后，自动删除临时安装的包（除非使用 `--no-clean` 参数）。
