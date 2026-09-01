# 前端 Monorepo 彻底讲清楚

[[toc]]

很多人对 Monorepo 的理解停留在「把多个项目放在一个仓库里」，但对它和 Workspace 的区别、为什么要写那么多 `package.json`、`pnpm-workspace.yaml` 到底干什么，仍然容易混淆。

> https://github.com/lexmin0412/dify-app-hub 这个项目使用了 Monorepo 进行管理

这篇文章按章节把这些概念彻底拆开讲清楚。


## 第一章：Monorepo 到底是什么？

**Monorepo 不是协议，不是工具，也不是技术标准。**

它只是一种**代码仓库的组织策略**：

> 把多个相关的项目，放在同一个 Git 仓库里管理。

对应的反面是 Multi-repo（每个项目一个独立仓库）。

举个例子，你有这些东西：

- 一个用户前台（web）
- 一个管理后台（admin）
- 一套公共组件库（ui）
- 一些工具函数（utils）

**Multi-repo 的做法**：四个独立的 Git 仓库。
**Monorepo 的做法**：全部放进同一个仓库。

```
my-frontend/
├── apps/
│   ├── web/
│   └── admin/
└── packages/
    ├── ui/
    └── utils/
```

只要代码在同一个仓库里，它就已经是 Monorepo 了。
**到这一步，不需要任何配置文件。**


## 第二章：为什么前端需要 Monorepo？

在多项目场景下，Multi-repo 会遇到这些问题：

- 公共组件要先发 npm 包，再在其他项目里升级版本，流程长且容易出版本不一致
- 改一个基础库，需要同时改多个仓库、提多个 PR
- 依赖版本、ESLint、TypeScript 配置容易各写各的
- 跨项目重构成本高

Monorepo 的核心价值在于：

- 共享代码可以直接引用源码，改完立刻生效，不需要发版
- 工具链和规范可以统一
- 一次改动能覆盖所有相关项目
- CI 和依赖管理更集中

它解决的是「多个前端项目如何高效协作」的问题。


## 第三章：Workspace —— 让项目真正能互相使用

Monorepo 只解决了「代码放在一起」，但默认情况下，这些项目仍然互相不认识。

这时候就需要 **Workspace**。

### Workspace 是什么？

Workspace 是包管理器（pnpm / yarn / npm）提供的一种机制，用来告诉它：

> 「这几个文件夹是当前仓库的工作区成员，请把它们当作一个整体来管理，允许互相引用。」

以 pnpm 为例，需要在根目录创建：

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

有了这个配置后，你就可以在项目里这样引用：

```json
{
  "dependencies": {
    "@myorg/ui": "workspace:*"
  }
}
```

`workspace:*` 的含义是：去当前仓库的 workspace 里找名为 `@myorg/ui` 的包，直接使用本地源码，不要去 npm 下载。

### 关键区别

| 概念       | 本质                     | 是否必须配置文件              |
|------------|--------------------------|-------------------------------|
| Monorepo   | 把多个项目放进一个仓库   | 不需要                        |
| Workspace  | 让这些项目能互相引用     | 需要（如 pnpm-workspace.yaml）|

没有 Workspace 配置，只是「物理上的 Monorepo」；
有了 Workspace，才是真正能协作的 Monorepo。


## 第四章：为什么根目录和子包都要有 package.json？

这是最容易让人觉得「多此一举」的地方。

### 根目录的 package.json 做什么？

它是整个仓库的**总控中心**，主要负责：

- 声明这是一个 workspace
- 安装整个仓库共用的开发工具（typescript、eslint、turbo 等）
- 定义统一的脚本（`dev`、`build`、`lint`）
- 标记 `"private": true`，防止被误发布到 npm

### 子包的 package.json 做什么？

每一个 `apps/*` 或 `packages/*` 在逻辑上都是一个**独立的包**，必须有自己的身份证，包括：

- 名字（`@myorg/ui`、`@myorg/web`）—— 别人才能引用它
- 自己的依赖
- 自己的启动/构建脚本
- 入口文件（`main`、`exports`、`types`）
- 版本号（以后如果要单独发 npm 包）

如果 `packages/ui` 没有自己的 `package.json`，它就没有名字，其他包就无法通过 `@myorg/ui` 引用它。

### 用一个类比理解

- 根目录的 `package.json` = 公司总部（制定制度、提供公共工具）
- 子包的 `package.json` = 每个部门自己的营业执照和职责说明

总部有制度，不代表下面部门可以没有自己的身份。两者职责不同，不能互相替代。


## 第五章：子包如何使用根目录的能力？

子包**不需要、也不能**把根目录的 `package.json` 当作依赖来安装。

它们之间是「管理与被管理」的关系，而不是普通的依赖关系。

当你在根目录执行 `pnpm install` 时，包管理器会：

1. 读取 `pnpm-workspace.yaml`，识别所有子包
2. 把根目录的 `devDependencies`（如 typescript）提升到整个仓库可用
3. 处理子包之间通过 `workspace:*` 产生的本地引用

因此：

- 子包可以直接使用根目录安装的工具
- 在根目录执行统一脚本，可以驱动所有子包
- 子包只需要声明自己依赖哪些**其他子包**


## 第六章：完整关系梳理

用一张表把所有概念放在一起：

| 概念                  | 它是什么                       | 核心作用                         | 必须配置吗？ |
|-----------------------|--------------------------------|----------------------------------|--------------|
| Monorepo              | 代码组织策略                   | 多个项目放在同一个仓库           | 不需要       |
| Workspace             | 包管理器提供的机制             | 让项目能互相引用、共享依赖       | 需要         |
| 根 package.json       | 仓库总控                       | 公共工具 + 统一脚本              | 需要         |
| 子包 package.json     | 每个项目的身份证               | 起名、声明依赖、定义入口和脚本   | 需要         |
| pnpm-workspace.yaml   | Workspace 的声明文件（pnpm）   | 告诉 pnpm 哪些目录是工作区成员   | 使用 pnpm 时需要 |

再看它们之间的关系：

```
根目录 package.json          ← 管理者
        │
        │ 通过 Workspace 机制连接
        │
   ┌────┴────┐
   │         │
apps/web   packages/ui       ← 被管理者（各自有身份证）
   │         │
   └────┬────┘
        │
   通过 workspace:* 互相引用
```


## 第七章：总结

1. **Monorepo** 解决的是「代码放哪里」的问题，它只是一种组织方式。
2. **Workspace** 解决的是「放在一起之后怎么互相用」的问题，需要配置文件支持。
3. 根目录和子包的 `package.json` 职责不同，都是必需的。
4. 子包不会去「引入」根目录的 `package.json`，包管理器通过 Workspace 自动连接它们。
5. 没有 Workspace 的 Monorepo，只是文件夹的集合；有了 Workspace，才真正发挥协作价值。

理解这几层区别后，再去看 Turborepo、Changesets、Nx 等工具，就会清晰很多。

