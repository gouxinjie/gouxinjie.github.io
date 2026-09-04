<script setup lang="ts">
/**
 * @description 首页统计面板
 * @author gxj
 * @date 2026-08-11
 *
 * 4 项统计：文章总数 / 分类数量 / 累计字数 / 创建天数
 * 数据来源：
 *   - 文章总数 / 分类数量 / 累计字数：构建期自动扫描 docs/column（虚拟模块 virtual:site-summary）
 *   - 创建天数：首次提交 2024-11-05，运行时自动计算
 *
 * 每个图标的颜色和分类色与首页 hero 特性标签一致：
 *   文章总数（红）、分类数量（橙）、累计字数（绿）、创建天数（蓝）
 */
import { computed, ref, onMounted } from "vue";
import siteSummary from "virtual:site-summary";

/** 字数展示：超过 1 万以「万」为单位，保留一位小数 */
const formatWordCount = (count: number): string =>
  count >= 10000 ? `${(count / 10000).toFixed(1)}万` : String(count);

// 文章总数：docs/column 下全部 .md（不含各专栏 index.md）
const articleTotal = String(siteSummary.articleCount);

// 分类数量：包含文章的一级目录数
const categoryTotal = String(siteSummary.categoryCount);

// 累计字数：全部文章正文总字数
const totalWords = formatWordCount(siteSummary.wordCount);

interface StatItem {
  title: string;
  value: string;
  sub: string;
  icon: string;
  /** 图标背景色（浅色）+ icon 主色 */
  iconBg: string;
  iconColor: string;
}

const startDate = new Date("2024-11-05").getTime();

// SSR 安全：构建时用静态天数，客户端 onMounted 后更新
const daysCount = ref(Math.floor((Date.now() - startDate) / 86400000) + "+");
onMounted(() => {
  daysCount.value = Math.floor((Date.now() - startDate) / 86400000) + "+";
});

const stats = computed<StatItem[]>(() => [
  {
    title: "文章总数",
    value: articleTotal,
    sub: "持续更新中",
    iconBg: "rgba(239, 68, 68, 0.12)",
    iconColor: "#ef4444",
    icon:
      '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>'
  },
  {
    title: "分类数量",
    value: categoryTotal,
    sub: "技术领域覆盖",
    iconBg: "rgba(249, 115, 22, 0.12)",
    iconColor: "#f97316",
    icon:
      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
  },
  {
    title: "累计字数",
    value: totalWords, // 构建期自动统计值
    sub: "全部文章正文",
    iconBg: "rgba(34, 197, 94, 0.12)",
    iconColor: "#22c55e",
    icon:
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/>'
  },
  {
    title: "创建天数",
    value: daysCount.value, // SSR 安全：静态值，客户端 onMounted 后响应式更新
    sub: "持续创作中",
    iconBg: "rgba(59, 130, 246, 0.12)",
    iconColor: "#3b82f6",
    icon:
      '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
  }
]);
</script>

<template>
  <section class="xinjie-stats" aria-label="站点统计">
    <div class="xinjie-stats__inner">
      <div v-for="(item, idx) in stats" :key="idx" class="xinjie-stats__item">
        <div
          class="xinjie-stats__icon"
          :style="{ background: item.iconBg, color: item.iconColor }"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" v-html="item.icon" />
        </div>
        <div>
          <h3 class="xinjie-stats__title">{{ item.title }}</h3>
          <p class="xinjie-stats__value">{{ item.value }}</p>
          <p class="xinjie-stats__sub">{{ item.sub }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.xinjie-stats { display: block; }
</style>
