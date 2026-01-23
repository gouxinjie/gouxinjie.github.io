<div align="center">

# 🚀 苟新节的技术博客

基于 VitePress 构建的现代化个人技术博客

[![VitePress](https://img.shields.io/badge/VitePress-1.2.3-646CFF?style=flat&logo=vite)](https://vitepress.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.4.27-4FC08D?style=flat&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.7.0-F69220?style=flat&logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

[在线访问](https://gouxinjie.github.io) · [Vercel 访问](https://gouxinjie.vercel.app) · [报告问题](https://github.com/gouxinjie/gouxinjie.github.io/issues)

</div>

![](./docs/public/home.png)

---

## 📖 关于项目

这是一个专注于前端技术分享的个人博客，涵盖 JavaScript、TypeScript、Vue、React、Angular、Docker、Git 等多个技术领域的知识总结和实践经验。采用现代化的技术栈构建，提供流畅的阅读体验和优秀的开发体验。

### ✨ 核心特性

- 📝 **Markdown 写作** - 支持扩展语法、代码高亮、任务列表
- 🎨 **主题切换** - 深色/浅色模式自动切换
- 🔍 **全文搜索** - 集成 Algolia 搜索引擎
- 📊 **图表支持** - Mermaid 流程图、时序图等
- 🖼️ **图片优化** - 懒加载、响应式图片
- 📱 **移动适配** - 完美支持移动端访问
- ⚡ **极速体验** - Vite 驱动的快速热更新
- � **SEO 优化** - 完善的 Meta 标签和 Open Graph 支持
- 📈 **阅读统计** - 字数统计、阅读时间估算
- 🔖 **锚点导航** - 智能目录导航

### �️ 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | VitePress 1.2.3 | 基于 Vite 的静态站点生成器 |
| 前端 | Vue 3.4.27 | 渐进式 JavaScript 框架 |
| 语言 | TypeScript 5.4.5 | JavaScript 的超集，提供类型安全 |
| 样式 | TailwindCSS + Sass | 实用优先的 CSS 框架 + 预处理器 |
| 包管理 | pnpm 10.7.0 | 快速、节省磁盘空间的包管理器 |
| 代码规范 | ESLint + Prettier | 代码检查和自动格式化 |
| 图表 | Mermaid | 支持多种图表和流程图 |
| 搜索 | Algolia | 强大的站内搜索服务 |
| 部署 | GitHub Pages + Vercel | 自动化 CI/CD 部署 |

---

## 📂 项目结构

```
gouxinjie.github.io/
├── .github/
│   └── workflows/           # GitHub Actions 自动化部署
├── .vscode/                 # VS Code 编辑器配置
│   ├── extensions.json      # 推荐扩展列表
│   ├── settings.json        # 编辑器设置
│   ├── tasks.json           # 任务配置
│   └── launch.json          # 调试配置
├── docs/                    # 文档源码目录
│   ├── .vitepress/          # VitePress 配置
│   │   ├── components/      # 自定义 Vue 组件
│   │   ├── navAndSidebarConfig/  # 导航和侧边栏配置
│   │   ├── theme/           # 主题样式文件
│   │   └── config.mts       # 主配置文件
│   ├── column/              # 博客文章分类
│   │   ├── Angular/         # Angular 技术栈
│   │   ├── Docker/          # Docker 容器化
│   │   ├── Git/             # Git 版本控制
│   │   ├── JS/              # JavaScript 核心
│   │   ├── React/           # React 生态
│   │   ├── Vue/             # Vue 生态
│   │   ├── TS/              # TypeScript
│   │   ├── Node/            # Node.js 后端
│   │   ├── Network/         # 网络协议
│   │   └── ...              # 更多分类
│   ├── public/              # 静态资源
│   └── utils/               # 工具函数
├── .editorconfig            # 编辑器配置
├── .eslintrc.cjs            # ESLint 配置
├── .prettierrc.cjs          # Prettier 配置
├── .gitignore               # Git 忽略文件
├── .npmrc                   # pnpm 配置
├── package.json             # 项目依赖
├── pnpm-lock.yaml           # 依赖锁定文件
├── tsconfig.json            # TypeScript 配置
└── README.md                # 项目说明
```

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 20.0.0
- **pnpm**: >= 10.7.0

### 安装 pnpm

如果还没有安装 pnpm，选择以下任一方式：

```bash
# 方式 1: 使用 npm 安装（推荐）
npm install -g pnpm

# 方式 2: 使用 corepack（Node.js 16.13+）
corepack enable
corepack prepare pnpm@10.7.0 --activate

# 方式 3: 使用安装脚本（macOS/Linux）
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 克隆项目

```bash
git clone https://github.com/gouxinjie/gouxinjie.github.io.git
cd gouxinjie.github.io
```

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5174 查看效果

### 构建生产版本

```bash
pnpm build
```

构建产物输出到 `docs/.vitepress/dist` 目录

### 预览构建结果

```bash
pnpm preview
```

---

## 🔧 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览构建结果 |
| `pnpm lint` | ESLint 代码检查并自动修复 |
| `pnpm format` | Prettier 代码格式化 |
| `pnpm type-check` | TypeScript 类型检查 |

---

## 📝 开发指南

### 添加新文章

1. **创建 Markdown 文件**

   在对应分类目录下创建文章：
   ```bash
   docs/column/Vue/基础/新文章.md
   ```

2. **编写文章内容**

   ```markdown
   # 文章标题

   文章简介...

   ## 章节 1
   内容...
   ```

3. **注册文章路由**

   在对应的 `list.ts` 文件中注册：
   ```typescript
   // docs/column/Vue/list.ts
   export default [
     {
       text: '基础',
       items: [
         { text: '新文章', link: '/column/Vue/基础/新文章' }
       ]
     }
   ];
   ```

4. **预览效果**

   ```bash
   pnpm dev
   ```

### 修改配置

| 配置项 | 文件路径 | 说明 |
|--------|---------|------|
| 站点配置 | `docs/.vitepress/config.mts` | 站点标题、描述、SEO 等 |
| 导航配置 | `docs/.vitepress/navAndSidebarConfig/index.ts` | 顶部导航和侧边栏 |
| 主题样式 | `docs/.vitepress/theme/styles/` | 自定义样式文件 |
| 自定义组件 | `docs/.vitepress/components/` | Vue 组件 |

### 使用自定义组件

在 Markdown 文件中直接使用：

```markdown
# 文章标题

<MyComponent />

正文内容...
```

### 代码规范

项目使用 ESLint + Prettier 进行代码规范管理：

- **保存时自动格式化**：VS Code 已配置自动格式化
- **提交前检查**：建议运行 `pnpm lint && pnpm type-check`
- **代码风格**：2 空格缩进、单引号、LF 换行符

---

## 🚢 部署说明

### GitHub Pages

项目配置了 GitHub Actions 自动部署：

- **触发条件**：推送到 `main` 分支
- **部署分支**：`gh-pages`
- **访问地址**：https://gouxinjie.github.io

工作流文件：`.github/workflows/jekyll-gh-pages.yml`

### Vercel

通过 GitHub 仓库同步自动部署：

- **访问地址**：https://gouxinjie.vercel.app
- **配置**：自动检测 VitePress 项目

### 多仓库同步

项目同时推送到两个远程仓库：

```bash
# 查看远程仓库
git remote -v

# 推送到所有仓库
git push origin main
```

- **GitHub**: https://github.com/gouxinjie/gouxinjie.github.io.git
- **Gitee**: https://gitee.com/gou-xinjie/vite-press-blog.git

---

## 💡 优化亮点

### 性能优化

- ✅ **pnpm 包管理**：安装速度提升 2-3 倍，磁盘占用减少 30-40%
- ✅ **构建缓存**：GitHub Actions 启用依赖缓存，构建时间减少 30-50%
- ✅ **图片懒加载**：优化首屏加载速度
- ✅ **代码分割**：按需加载，减少初始包体积

### 开发体验

- ✅ **TypeScript 严格模式**：完整的类型检查和智能提示
- ✅ **路径别名**：`@/`、`@components/`、`@theme/`、`@utils/`
- ✅ **ESLint + Prettier**：统一的代码风格和自动格式化
- ✅ **VS Code 配置**：开箱即用的编辑器配置

### SEO 优化

- ✅ **Meta 标签**：完善的 SEO 元信息
- ✅ **Open Graph**：优化社交媒体分享效果
- ✅ **Twitter Card**：支持 Twitter 卡片展示
- ✅ **站点地图**：自动生成 sitemap.xml

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

在贡献之前，请阅读 [贡献指南](./CONTRIBUTING.md)。

---

## 📄 许可证

本项目采用 [ISC](LICENSE) 许可证。

---

## 📞 联系方式

- **GitHub**: [@gouxinjie](https://github.com/gouxinjie)
- **微信**: 13113183859
- **博客**: https://gouxinjie.github.io
- **CSDN**: https://blog.csdn.net/qq_43886365

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by [苟新节](https://github.com/gouxinjie)

</div>
