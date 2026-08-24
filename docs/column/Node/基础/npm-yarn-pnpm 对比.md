# npm / yarn / pnpm 完整对比总结

目前 `JavaScript` 生态中最主流的三个包管理器是 **npm**、**yarn** 和 **pnpm**。它们都能完成安装依赖、管理版本、运行脚本等基础工作，但在存储方式、安装速度、磁盘占用、依赖严格性等方面差异明显。

### 一、基本信息

| 对比项 | npm | yarn | pnpm |
|--------|-----|------|------|
| 诞生时间 | 2010 | 2016 | 2017 |
| 是否随 Node 自带 | ✅ 是 | ❌ 否 | ❌ 否 |
| 锁文件 | `package-lock.json` | `yarn.lock` | `pnpm-lock.yaml` |
| 当前主流版本 | npm 10 / 11 | yarn Berry (v2~v4) | pnpm 9 / 10 / 11 |
| 核心理念 | 简单、兼容性优先 | 速度 + 确定性 + 插件 | 省空间 + 严格 + 快速 |

> 注：yarn 分为 **Classic（v1）** 和 **Berry（v2+）**。现在讨论的优势大多指 Berry，尤其是其 Plug’n’Play（PnP）模式。

### 二、核心差异：存储与链接方式

| 包管理器 | 存储方式 | 说明 |
|----------|----------|------|
| **npm** | 每个项目独立复制 | 同一个包在不同项目中会完整复制多份 |
| **yarn Classic** | 每个项目独立复制 + 全局缓存 | 和 npm 类似，有缓存加速 |
| **yarn Berry (PnP)** | 几乎无 `node_modules` | 用 `.pnp.cjs` 映射，实现零安装 |
| **pnpm** | **全局内容寻址存储 + 硬链接** | 所有项目共享同一份文件，通过硬链接引用 |

**pnpm 的核心优势**：
- 相同内容的文件在磁盘上只存一份
- 项目通过硬链接引用，几乎不占额外空间
- 多项目场景下磁盘占用可减少 50%~80%

### 三、多维度详细对比

| 维度 | npm | yarn | pnpm | 优胜者 |
|------|-----|------|------|--------|
| **安装速度** | 中等（已改善） | 快（并行下载） | **最快**（硬链接） | pnpm |
| **磁盘占用** | 高（重复复制） | 中高 / PnP 很低 | **极低** | pnpm |
| **幽灵依赖** | 存在 | Classic 存在，PnP 不存在 | **严格杜绝** | pnpm |
| **依赖隔离** | 弱（扁平化提升） | 中等 / PnP 强 | **强** | pnpm |
| **Monorepo 支持** | 有（workspaces） | 优秀 | **优秀** | yarn / pnpm |
| **生态兼容性** | **最好** | 很好（PnP 需适配） | 很好（极少问题） | npm |
| **学习成本** | 最低 | 中等 | 较低 | npm |
| **Zero-Installs** | ❌ | ✅（Berry PnP） | ❌ | yarn |
| **依赖补丁** | ❌ | ✅ | ✅ | yarn / pnpm |
| **对等依赖自动安装** | ✅ | ❌ | ✅ | npm / pnpm |
| **管理 Node 版本** | ❌ | ❌ | ✅ | pnpm |

### 四、什么是幽灵依赖？

**幽灵依赖（Phantom Dependencies）**：代码里可以 `import` 一个没有在 `package.json` 中声明的包。

原因是 npm / yarn Classic 会把间接依赖提升到 `node_modules` 顶层。

**危害**：
- 本地能跑，换环境或依赖升级后可能突然报错
- 依赖关系不清晰，不利于维护

**pnpm** 通过非扁平的严格结构，从根源上阻止了这个问题——只有你明确声明的依赖才能被访问。

### 五、常用命令对照

| 操作 | npm | yarn | pnpm |
|------|-----|------|------|
| 安装全部依赖 | `npm install` | `yarn` / `yarn install` | `pnpm install` |
| 添加依赖 | `npm install lodash` | `yarn add lodash` | `pnpm add lodash` |
| 添加开发依赖 | `npm i -D xxx` | `yarn add -D xxx` | `pnpm add -D xxx` |
| 删除依赖 | `npm uninstall xxx` | `yarn remove xxx` | `pnpm remove xxx` |
| 执行临时包 | `npx xxx` | `yarn dlx xxx` | `pnpm dlx xxx` |
| 运行脚本 | `npm run dev` | `yarn dev` | `pnpm dev` |
| 更新依赖 | `npm update` | `yarn up` | `pnpm update` |
| CI 严格安装 | `npm ci` | `yarn install --immutable` | `pnpm install --frozen-lockfile` |

### 六、其他重要细节

**1. Corepack（推荐使用）**
Node.js 自带的包管理器管理工具，可统一管理 npm / yarn / pnpm 的版本：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

**2. 安全相关**
- 三者都支持审计（audit）和完整性校验
- pnpm 支持 `minimumReleaseAge`（只安装发布一段时间后的包，降低供应链风险）
- yarn Berry 默认对 postinstall 脚本更谨慎

**3. 离线安装**
- npm：`npm ci`
- yarn：`yarn install --offline`
- pnpm：`pnpm install --offline`

### 七、适用场景建议

| 场景 | 推荐选择 | 原因 |
|------|----------|------|
| 新手学习 / 小项目 | **npm** | 自带，零配置，兼容性最好 |
| 个人多项目开发 | **pnpm** | 省磁盘、安装快、严格依赖 |
| 中大型项目 / 团队 | **pnpm** | 速度快 + 省空间 + 避免幽灵依赖 |
| 大型 Monorepo | **pnpm** 或 **yarn Berry** | 两者 workspaces 都很强 |
| 追求极致兼容 / 老项目 | **npm** | 兼容性最稳 |
| 喜欢插件生态 / 零安装 | **yarn Berry (PnP)** | 功能丰富，支持 Zero-Installs |

### 八、迁移建议（以 npm → pnpm 为例）

```bash
# 启用 corepack
corepack enable

# 安装并使用 pnpm
pnpm install

# 删除旧的 lock 文件
rm package-lock.json
```

大多数项目几乎无痛切换，只有极少数依赖扁平结构的老包可能需要微调。

### 九、一句话总结

- **npm**：官方默认，最稳最省心，适合入门和追求兼容的场景。
- **yarn**：曾经解决了 npm 的速度和确定性问题，现在 Berry 版本功能强大，尤其适合喜欢插件和 PnP 的团队。
- **pnpm**：目前综合表现最均衡，**省空间、速度快、依赖严格**，是 2025~2026 年很多新项目的首选。

**当前趋势**：新项目越来越多默认选择 **pnpm**，npm 继续作为兜底方案存在，yarn 则在 monorepo 和特定团队中保持影响力。
