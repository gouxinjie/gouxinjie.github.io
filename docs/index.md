---
# https://vitepress.dev/reference/default-theme-home-page

layout: home
title: Xinjie
titleTemplate: "blog"
editLink: true
lastUpdated: true

hero:
  name: Xinjie's Personal Blog
  text: Web Developer
  tagline: 光而不耀，静水流深。
  image:
    src: /xinjie.png # 首页右边的图片
    alt: avatar # 图片的描述

  # 按钮相关
  actions:
    - theme: brand
      text: React
      link: /column/React/

    - theme: alt
      text: Vue
      link: /column/Vue/

    - theme: alt
      text: Next.js
      link: /column/Next/

    - theme: alt
      text: 我的主页
      link: /column/Personal/index.md

# 按钮下方的描述
features:
  - title: 为什么前端项目部署需要 nginx 或 Apache？
    icon:
      src: /light_pwa.svg
    details: 部署时需使用Web服务器（如Nginx），因为浏览器无法直接运行本地文件，必须通过HTTP协议访问才能解决路径、路由和跨域等关键问题。
    link: /column/Docker/Docker容器与部署/为什么前端项目部署需要nginx或Apache
    linkText: 查看详情

  - title: Vite的依赖预构建过程是什么样的？
    icon:
      src: /config.svg
    details: Vite 之所以需要依赖预构建（pre-bundling），主要是为了提高开发环境下的启动速度和热更新性能，提升开发体验，解决模块之间的兼容性问题。
    link: /column/Vue/Vite相关/依赖预构建.html
    linkText: 查看详情

  - title: 使用Docker本地部署 CSR 前端项目完整指南
    icon:
      src: /terminal.svg
    details: 本文详解了使用Docker部署Vue3+Vite项目的完整方案，涵盖多阶段构建、Nginx优化及docker-compose编排，简化部署流程。
    link: /column/Docker/Docker容器与部署/Docker本地部署CSR前端项目
    linkText: 查看详情

  - title: 工作中常用的git操作
    icon:
      src: /earth.svg
    details: 通过分支管理、变更追踪和历史记录等功能，确保代码的完整性和项目的协同效率，同时还支持错误回滚和代码审查。
    link: /column/Git/git相关/工作中常用的git操作-2.html
    linkText: 查看详情

  - title: Nginx开启 Gzip 压缩
    icon:
      src: /mode.svg
    details: 在前端项目中，JS/CSS 文件较大时，启用 Gzip 压缩可以显著减少传输体积，提高页面加载速度。
    link: /column/Nginx/Nginx服务器与部署/开启gzip压缩.html
    linkText: 查看详情

  - title: 前端常用加密方式有哪些？
    icon:
      src: /lightning.svg
    details: 前端常用加密方式有很多，比如 MD5、SHA1、AES、DES 等。选择合适的加密方式可以提高数据的安全性和完整性，保障用户隐私和数据的安全性。
    link: /column/Project/性能与架构/前端常用加密方式.html
    linkText: 查看详情
---

<style>
  
/* 先隐藏小图标 */
.box .VPImage{
  display: none;
}
</style>

<script setup>
import { NAV_DATA } from './utils/homenav-data.ts'
</script>

<!-- 首页hero文字下划线 -->
<HomeUnderline />

<!-- 碎纸屑组件 -->
<Confetti />

<!-- 统计组件 -->
<DataPanel />

<!-- 首页站点导航 -->
<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>

<!-- 回到顶部组件 -->
<BackToTop />
