<script setup lang="ts">
/**
 * @description 首页精选文章卡片网格
 * @author gxj
 * @date 2026-08-11
 *
 * 布局：3 列 2 行，每张卡片含 SVG 图标 + 标题 + 描述 + 标签 + 阅读量 + 悬停箭头
 */
import { FEATURED_ARTICLES } from "./home-articles";
</script>

<template>
  <section class="xinjie-section">
    <header class="xinjie-section__head">
      <h2 class="xinjie-section__title">
        <span class="xinjie-section__title-icon" aria-hidden="true">🔥</span>
        精选文章
      </h2>
    </header>

    <div class="xinjie-articles">
      <a
        v-for="(item, idx) in FEATURED_ARTICLES"
        :key="idx"
        class="xinjie-article"
        :href="item.link"
      >
        <div class="xinjie-article__head">
          <div class="xinjie-article__icon" :style="{ background: item.iconBg }">
            <svg viewBox="0 0 24 24" aria-hidden="true" v-html="item.icon" />
          </div>
          <h3 class="xinjie-article__title">{{ item.title }}</h3>
        </div>
        <p class="xinjie-article__desc">{{ item.desc }}</p>
        <div class="xinjie-article__foot">
          <span
            class="xinjie-article__tag"
            :style="{ color: item.tagColor, background: item.tagColor + '1a' }"
          >{{ item.tag }}</span>
          <span class="xinjie-article__reading">{{ item.reading }}</span>
        </div>
        <span class="xinjie-article__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.xinjie-section { display: block; }
</style>
