<script setup lang="ts">
/**
 * @description 新版首页主组件（按设计稿重构）
 * @author gxj
 * @date 2026-08-11
 *
 * 设计稿包含：
 * 1. Hero 区：左侧文案 + 按钮组 + 特性 tags，右侧装饰圆环 + 漂浮技术标签
 * 2. 精选文章：3x2 卡片网格
 * 3. 统计数据：4 项指标卡片
 * 4. 访问量（DataPanel）
 * 5. 站点导航（MNavLinks）
 *
 * 色调：沿用品牌色（--vp-c-brand-1 渐变），暖色用得很克制仅作为点缀
 */
import { NAV_DATA } from "../../../utils/homenav-data";
</script>

<template>
  <div id="xinjie-home-root" class="xinjie-home">
    <!-- ============ HERO ============ -->
    <section class="xinjie-hero">
      <div class="xinjie-hero__inner">
        <div class="xinjie-hero__left">
          <div class="xinjie-hero__title-block">
            <span class="xinjie-hero__badge">
              <span class="xinjie-hero__badge-dot" aria-hidden="true"></span>
              <span class="xinjie-hero__badge-text">欢迎来到我的技术博客</span>
            </span>
            <h1 class="xinjie-hero__title">
              <span class="xinjie-hero__title-grad">Xinjie's Personal Blog</span>
            </h1>
          </div>

          <p class="xinjie-hero__subtitle">专注于 Web 技术与效率提升</p>

          <p class="xinjie-hero__desc">
            记录学习与实践的点滴, 分享经验与思考, 希望能帮助你解决问题,
            也期待与更优秀的开发者交流成长。
          </p>

          <div class="xinjie-hero__actions">
            <a class="xinjie-hero__btn xinjie-hero__btn--about" href="/column/Personal/">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/></svg>
              关于我
              <svg class="xinjie-hero__btn-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
            </a>
            <a class="xinjie-hero__btn xinjie-hero__btn--ghost" href="/column/React/">React</a>
            <a class="xinjie-hero__btn xinjie-hero__btn--ghost" href="/column/Vue/">Vue</a>
            <a class="xinjie-hero__btn xinjie-hero__btn--ghost" href="/column/Next/">Next.js</a>
          </div>

          <div class="xinjie-hero__tags">
            <span class="xinjie-hero__tag">
              <span class="xinjie-hero__tag-icon xinjie-hero__tag-icon--red" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
              </span>
              <span class="xinjie-hero__tag-text">
                <span class="xinjie-hero__tag-title">持续更新</span>
                <span class="xinjie-hero__tag-sub">保持高频输出</span>
              </span>
            </span>
            <span class="xinjie-hero__tag">
              <span class="xinjie-hero__tag-icon xinjie-hero__tag-icon--green" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M20 7h-3V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M9 4h6v3H9z"/><circle cx="12" cy="14" r="3"/></svg>
              </span>
              <span class="xinjie-hero__tag-text">
                <span class="xinjie-hero__tag-title">内容原创</span>
                <span class="xinjie-hero__tag-sub">实践经验沉淀</span>
              </span>
            </span>
            <span class="xinjie-hero__tag">
              <span class="xinjie-hero__tag-icon xinjie-hero__tag-icon--blue" aria-hidden="true">
                <svg viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 8h3a2 2 0 0 1 2 2v3"/><path d="m11 17 2-3"/><path d="M9 9H6a2 2 0 0 0-2 2v3"/></svg>
              </span>
              <span class="xinjie-hero__tag-text">
                <span class="xinjie-hero__tag-title">开源共享</span>
                <span class="xinjie-hero__tag-sub">代码开源分享</span>
              </span>
            </span>
            <span class="xinjie-hero__tag">
              <span class="xinjie-hero__tag-icon xinjie-hero__tag-icon--purple" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/></svg>
              </span>
              <span class="xinjie-hero__tag-text">
                <span class="xinjie-hero__tag-title">专注质量</span>
                <span class="xinjie-hero__tag-sub">追求深度价值</span>
              </span>
            </span>
          </div>
        </div>

        <!-- 右侧装饰：VitePress 原生 hero image 容器 + 头像 -->
        <div class="xinjie-hero__right" aria-hidden="true">
          <div class="xinjie-hero__image-wrapper">
            <div class="xinjie-hero__image-bg"></div>
            <img class="xinjie-hero__avatar" src="/xinjie.png" alt="avatar" />
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 精选文章 ============ -->
    <FeaturedArticles />

    <!-- ============ 统计 ============ -->
    <StatsPanel />

    <!-- ============ 访问量 ============ -->
    <DataPanel />

    <!-- ============ 站点导航 ============ -->
    <div class="xinjie-nav-group">
      <MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>
    </div>
  </div>
</template>

<style scoped>
/* 确保 Vue SSR 注入 scope id，使客户端 hydration 能正确匹配组件 */
.xinjie-home {
  display: block;
}
</style>
