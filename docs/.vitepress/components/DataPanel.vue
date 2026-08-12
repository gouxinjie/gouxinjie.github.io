<script setup lang="ts">
import { computed } from "vue";
import { sitePv, siteUv, PV_BASE, UV_BASE } from "../utils/site-stats";

// 正式域名下由不蒜子（busuanzi）填充真实统计值（共享响应式 store）
// 本地/SSR 未加载时显示历史基数，避免首屏空白闪烁
const displayPv = computed(() => sitePv.value || String(PV_BASE));
const displayUv = computed(() => siteUv.value || String(UV_BASE));
</script>

<!-- 访问量展示 -->
<template>
  <div class="xinjie-datapanel">
    <div class="xinjie-datapanel__inner">
      <section class="xinjie-datapanel__grid">
        <span class="xinjie-datapanel__item">
          <span class="xinjie-datapanel__label">本站总访问量</span>
          <span id="busuanzi_value_site_pv" class="xinjie-datapanel__value font-bold">{{ displayPv }}</span>
          <span class="xinjie-datapanel__sub">累计页面访问次数</span>
        </span>
        <img src="/xinjie.png" alt="heart" width="100" height="100" />
        <!-- <img src="/tap.gif" alt="我让你敲" width="150" height="150" /> -->
        <span class="xinjie-datapanel__item">
          <span class="xinjie-datapanel__label">本站访客数</span>
          <span id="busuanzi_value_site_uv" class="xinjie-datapanel__value font-bold">{{ displayUv }}</span>
          <span class="xinjie-datapanel__sub">累计独立访客人数</span>
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

.xinjie-datapanel__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}

.xinjie-datapanel__label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.xinjie-datapanel__value {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.4;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-next));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.xinjie-datapanel__sub {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
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
    grid-template-columns: 1fr auto 1fr;
    justify-items: center;
    align-items: center;
    padding: 18px 8px;
    gap: 8px;
  }

  .xinjie-datapanel__grid img {
    width: 52px;
    height: 52px;
  }

  .xinjie-datapanel__label {
    font-size: 0.75rem;
  }

  .xinjie-datapanel__value {
    font-size: 1rem;
  }

  .xinjie-datapanel__sub {
    font-size: 0.65rem;
  }
}
</style>
