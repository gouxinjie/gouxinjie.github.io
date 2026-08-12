<script setup lang="ts">
/**
 * @description 首页统计面板
 * @author gxj
 * @date 2026-08-11
 *
 * 4 项统计：文章总数 / 分类数量 / 阅读量 / 创建天数
 * 数据来源：
 *   - 文章总数：手动维护（docs/column 下 .md 不含 index.md）
 *   - 分类数量：sidebar 一级分类数（静态 22）
 *   - 阅读量：通过 inject 从 DataPanel 获取（与访问量面板数据一致）
 *   - 创建天数：首次提交 2024-11-05，运行时自动计算
 *
 * 每个图标的颜色和分类色与首页 hero 特性标签一致：
 *   文章总数（红）、分类数量（橙）、阅读量（绿）、创建天数（蓝）
 */
import { inject, computed, ref, type Ref } from "vue";

// 从 DataPanel 注入访问量数据（由 DataPanel onMounted 时 provide）
const injectedPv = inject<Ref<string>>("sitePv", ref("23680"));

// 阅读量 = PV（与 DataPanel 面板一致）
const displayPv = computed(() => {
  const n = parseInt(injectedPv.value, 10);
  if (isNaN(n)) return "50K+";
  if (n >= 10000) return (n / 1000).toFixed(0) + "K+";
  return String(n);
});

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

const stats = computed<StatItem[]>(() => [
  {
    title: "文章总数",
    value: "430",
    sub: "持续更新中",
    iconBg: "rgba(239, 68, 68, 0.12)",
    iconColor: "#ef4444",
    icon:
      '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>'
  },
  {
    title: "分类数量",
    value: "22",
    sub: "技术领域覆盖",
    iconBg: "rgba(249, 115, 22, 0.12)",
    iconColor: "#f97316",
    icon:
      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
  },
  {
    title: "阅读量",
    value: displayPv.value,
    sub: "累计访问次数",
    iconBg: "rgba(34, 197, 94, 0.12)",
    iconColor: "#22c55e",
    icon:
      '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
  },
  {
    title: "创建天数",
    value: Math.floor((Date.now() - startDate) / 86400000) + "+",
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
