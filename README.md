# VitePress 个人博客

## 项目介绍

苟新节的个人博客，使用 VitePress 搭建的静态网站。本博客专注于前端技术分享，涵盖 JavaScript、HTML/CSS、Angular、Docker、Git 等多个技术领域的知识点总结和实践经验。

## 技术栈

- **VitePress** - 基于 Vite 的静态网站生成器
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集
- **TailwindCSS** - 实用优先的 CSS 框架
- **Sass** - CSS 预处理器
- **Mermaid** - 图表和流程图绘制
- **Algolia** - 站内搜索服务

## 功能特性

- 📝 Markdown 文档编写，支持代码高亮
- 🎨 支持深色/浅色主题切换
- 🔍 集成 Algolia 搜索功能
- 📊 支持 Mermaid 图表渲染
- ✅ 支持 Todo 任务列表
- 🖼️ 图片懒加载优化
- 📱 响应式设计，支持移动端访问
- 🏷️ 文章字数统计和阅读时间
- 📅 文章最后更新时间显示
- 🎯 页面锚点导航

## 项目结构

```
gouxinjie.github.io/
├── .github/
│   └── workflows/              # GitHub Actions 工作流配置
│       └── jekyll-gh-pages.yml  # 自动部署到 GitHub Pages
├── docs/                        # 文档源码目录
│   ├── .vitepress/             # VitePress 配置目录
│   │   ├── components/         # 自定义 Vue 组件
│   │   ├── navAndSidebarConfig/# 导航和侧边栏配置
│   │   ├── theme/              # 主题样式文件
│   │   └── config.mts          # VitePress 主配置文件
│   ├── column/                 # 博客文章分类
│   │   ├── Angular/            # Angular 相关文章
│   │   ├── CommonSense/        # 生活常识
│   │   ├── Docker/             # Docker 相关文章
│   │   ├── Git/                # Git 相关文章
│   │   ├── HtmlCss/            # HTML/CSS 相关文章
│   │   ├── JS/                 # JavaScript 相关文章
│   │   └── Network/            # 网络相关文章
│   └── api-examples.md         # API 示例文档
├── .gitignore                  # Git 忽略文件配置
├── .nvmrc                      # Node 版本配置
├── package.json                # 项目依赖配置
└── README.md                   # 项目说明文档
```

## 快速开始

### 安装依赖

```bash
npm i
```

### 运行项目

```bash
npm run dev
```

开发服务器将在 `http://localhost:5174` 启动

### 项目打包

```bash
npm run build
```

构建产物将输出到 `docs/.vitepress/dist` 目录

### 预览构建结果

```bash
npm run preview
```

## 开发指南

### 添加新文章

1. 在 `docs/column/` 对应的分类目录下创建新的 Markdown 文件
2. 在对应分类的 `list.ts` 文件中注册新文章
3. 运行 `npm run dev` 查看效果

### 修改配置

- **站点配置**：修改 `docs/.vitepress/config.mts`
- **导航配置**：修改 `docs/.vitepress/navAndSidebarConfig/index.ts`
- **样式定制**：修改 `docs/.vitepress/theme/styles/` 下的样式文件

### 自定义组件

自定义 Vue 组件存放在 `docs/.vitepress/components/` 目录，可在 Markdown 文件中直接使用。

## 部署

### GitHub Pages 自动部署

项目已配置 GitHub Actions 工作流，当代码推送到 `main` 分支时自动触发部署流程。

部署后的访问地址：https://gouxinjie.github.io

### Vercel 部署

项目已连接到 Vercel，通过 GitHub 仓库同步自动部署。

部署后的访问地址：https://gouxinjie.vercel.app

## 需要注意

1. 当前发布并没有使用 pnpm，后续如果使用 pnpm，需要在 yaml 脚本文件进行配置；参考：https://github.com/maomao1996/mm-notes/tree/master/.github/workflows

2. 当前项目打包后的静态资源存放在 gh-pages 分支中；由 github page 自动构建用发布；

3. 当前项目我同时绑定了两个远程仓库，另外一个是 gitee 都是 main 分支，用户同时同步两个平台的代码

```git

## git remote -v
gitee   https://gitee.com/gou-xinjie/vite-press-blog.git (fetch) 这两个仓库都指向了 gitee 的仓库
gitee   https://gitee.com/gou-xinjie/vite-press-blog.git (push)

## 执行 git push origin命令的时候，会同时推送到这两个仓库
origin  https://github.com/gouxinjie/gouxinjie.github.io.git (fetch)
origin  https://github.com/gouxinjie/gouxinjie.github.io.git (push)
origin  https://gitee.com/gou-xinjie/vite-press-blog.git (push)

```

4. vercel 也同步进行了静态网站的自动部署,连接的 github 仓库同样是 https://github.com/gouxinjie/gouxinjie.github.io.git

```bash

## vercel 相关

vercel个人中心：  https://vercel.com/xinjies-projects/gxj.github.io
部署后的访问地址： gouxinjie.vercel.app

```
