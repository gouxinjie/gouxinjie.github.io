### 项目介绍

苟新节的个人博客，使用 vitepress 搭建的静态网站。

### 安装依赖

```
npm i
```

#### 运行项目

```
npm run dev
```

#### 项目打包

```
npm run build
```

### 需要注意

1，当前发布并没有使用 pnpm，后续如果使用 pnpm，需要在 yaml 脚本文件进行配置；参考：https://github.com/maomao1996/mm-notes/tree/master/.github/workflows

2，当前项目打包后的静态资源存放在 gh-pages 分支中；由 github page 自动构建用发布；

3，当前项目我同时绑定了两个远程仓库，另外一个是 gitee 都是 main 分支，用户同时同步两个平台的代码

```git

## git remote -v
gitee   https://gitee.com/gou-xinjie/vite-press-blog.git (fetch) 这两个仓库都指向了 gitee 的仓库
gitee   https://gitee.com/gou-xinjie/vite-press-blog.git (push)

## 执行 git push origin命令的时候，会同时推送到这两个仓库
origin  https://github.com/gouxinjie/gouxinjie.github.io.git (fetch)
origin  https://github.com/gouxinjie/gouxinjie.github.io.git (push)
origin  https://gitee.com/gou-xinjie/vite-press-blog.git (push)

```

4，vercel 也同步进行了静态网站的自动部署,连接的 github 仓库同样是 https://github.com/gouxinjie/gouxinjie.github.io.git

```bash

## vercel 相关

vercel个人中心：  https://vercel.com/xinjies-projects/gxj.github.io
部署后的访问地址： gouxinjie.vercel.app

```
