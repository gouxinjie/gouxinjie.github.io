<div align="center">

# 苟新节的技术博客

基于 VitePress 搭建的个人技术站点。从前端基础到框架实战，从编码提效到工程化部署，记录每个真实项目的踩坑、决策和复盘——不追热点，写自己验证过的东西。

[![VitePress](https://img.shields.io/badge/VitePress-646CFF?style=flat&logo=vitepress&logoColor=white)](https://vitepress.dev/)
[![Vue](https://img.shields.io/badge/Vue-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)

[在线访问](https://gouxinjie.github.io) · [Vercel 镜像](https://gouxinjie.vercel.app) · [GitHub](https://github.com/gouxinjie/gouxinjie.github.io) · [提 Issue](https://github.com/gouxinjie/gouxinjie.github.io/issues)

</div>

![](./docs/public/home.png)

---

---

## 站点在写什么

不追热点，不抄文档，尽量写我自己踩过坑、验证过、回头还会翻的东西。

- **前端基础** — JS/TS 里那些"懂了但说不清楚"的细节
- **框架实战** — Vue/React/Angular 的真实项目经验，不是文档搬运
- **AI 应用** — 提示词、RAG、MCP，偏落地和思考，不堆概念
- **工程化** — Docker、Git、CI/CD，解决实际问题的配置和方案
- **个人复盘** — 项目里的决策、踩坑、反思

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | VitePress + Vue 3 + TypeScript |
| 样式 | Sass + TailwindCSS，Google Fonts (Inter / JetBrains Mono) |
| 搜索 | Algolia DocSearch |
| 图表 | Mermaid (vitepress-plugin-mermaid) |
| 交互 | medium-zoom 图片预览、NProgress 进度条、canvas-confetti 特效 |
| 统计 | Busuanzi 访问量 |
| 代码质量 | ESLint + Prettier + vue-tsc |
| 包管理 | pnpm |
| CI/CD | GitHub Actions（ECS 自动部署 + GitHub Pages） |
| 部署 | GitHub Pages / Vercel / 阿里云 ECS / Gitee Pages |
| 自定义 | 诗词展示、项目面板、复制源码、首页动画等 15+ Vue 组件 |

---

## 本地运行

```bash
# 克隆
git clone https://github.com/gouxinjie/gouxinjie.github.io.git
cd gouxinjie.github.io

# 安装依赖（需要 pnpm）
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:5174
```

### 常用命令

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 本地预览构建结果 |
| `pnpm lint` | ESLint 检查 + 自动修复 |

---

## 项目结构

```
docs/
├── .vitepress/
│   ├── components/    # 自定义 Vue 组件
│   ├── theme/         # 主题样式
│   ├── config.mts     # 站点配置
│   └── navAndSidebarConfig/  # 导航栏 & 侧边栏
├── column/            # 文章目录，按主题分类
│   ├── AIFuture/      # AI 应用与思考
│   ├── Vue/           # Vue 相关
│   ├── React/         # React 相关
│   └── ...            # 更多分类
├── public/            # 静态资源（图片等）
└── utils/             # 工具函数
```

---

## 添加新文章

1. 在对应目录下新建 `.md` 文件
2. 在同级 `list.ts` 里注册文章标题（VitePress 会自动生成路由）
3. 本地 `pnpm dev` 预览，没问题就提交

不需要手动配路由，这是 VitePress 的优势。

---

## 部署

推到 `main` 分支后自动触发：

- **GitHub Pages** — `gh-pages` 分支，[gouxinjie.github.io](https://gouxinjie.github.io)
- **Vercel** — 监听同一个仓库，自动构建，[gouxinjie.vercel.app](https://gouxinjie.vercel.app)
- **ECS** — 阿里云 ECS 自托管，[blog.gouxinjie.com](http://blog.gouxinjie.com)（HTTP）
- **Gitee** — 国内镜像，手动 push 同步

### ECS 部署详情

- **描述**: 个人技术博客（VitePress 静态站点），双线部署保障国内外访问
- **部署路径**: `/var/www/blog`
- **启动方式**: Nginx 直接托管静态文件，GitHub Actions 构建后 SCP 上传到 ECS
- **状态**: 正常运行
- **备注**: GitHub Actions 自动部署，push main 触发 vitepress build → SCP 上传 dist → ECS Nginx reload
- **端口**: 80（宿主 Nginx）
- **访问**: [blog.gouxinjie.com](http://blog.gouxinjie.com) · [gouxinjie.github.io](https://gouxinjie.github.io) · [gouxinjie.vercel.app](https://gouxinjie.vercel.app)

---

## 联系方式

- GitHub：[@gouxinjie](https://github.com/gouxinjie)
- 博客：[gouxinjie.github.io](https://gouxinjie.github.io)
- CSDN：[gouxinjie 的 CSDN 博客](https://blog.csdn.net/qq_43886365)

---

<div align="center">
如果这个博客有帮到你，点个 ⭐️ 就是最大的支持。
</div>
