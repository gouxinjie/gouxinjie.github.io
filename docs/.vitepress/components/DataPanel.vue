<script setup lang="ts">
import { computed } from "vue";
import { sitePv, siteUv } from "../utils/site-stats";

// 正式域名下由不蒜子（busuanzi）填充真实统计值（共享响应式 store）
// SSR/未加载时显示占位符，避免首屏空白闪烁
const displayPv = computed(() => sitePv.value || "—");
const displayUv = computed(() => siteUv.value || "—");
</script>

<!-- 访问量展示 -->
<template>
  <div class="xinjie-datapanel">
    <div class="xinjie-datapanel__inner">
      <section class="xinjie-datapanel__grid">
        <span class="xinjie-datapanel__text">
          本站总访问量
          <span id="busuanzi_value_site_pv" class="font-bold">{{ displayPv }}</span> 次
        </span>
        <img src="/xinjie.png" alt="heart" width="100" height="100" />
        <!-- <img src="/tap.gif" alt="我让你敲" width="150" height="150" /> -->
        <span class="xinjie-datapanel__text">
          本站访客数
          <span id="busuanzi_value_site_uv" class="font-bold">{{ displayUv }}</span> 人次
        </span>
      </section>
    </div>
  </div>
</template>

<style scoped>
.xinjie-datapanel {
  margin-top: 30px;
  margin-bottom: 8px;
}

.xinjie-datapanel__inner {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  width: 100%;
  min-height: 32px;
}

.xinjie-datapanel__grid {
  font-weight: 500;
  padding: 20px 24px;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  display: grid;
  gap: 8px;
}

.xinjie-datapanel__text {
  font-size: 0.9rem;
  line-height: 1.5rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.xinjie-datapanel__text :deep(.font-bold) {
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-next));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.xinjie-datapanel__grid img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s;
}

.xinjie-datapanel__grid img:hover {
  transform: scale(1.08);
}

@media (max-width: 640px) {
  .xinjie-datapanel__grid {
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 18px 16px;
    gap: 12px;
  }

  .xinjie-datapanel__grid img {
    width: 72px;
    height: 72px;
  }

  .xinjie-datapanel__text {
    font-size: 0.8rem;
    justify-content: center;
    text-align: center;
  }

  .xinjie-datapanel__text :deep(.font-bold) {
    font-size: 1.05rem;
  }
}
</style>
