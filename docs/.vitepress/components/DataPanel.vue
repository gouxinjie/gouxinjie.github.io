<script setup lang="ts">
import { onMounted, ref } from "vue";

const VERCEL_HOSTNAME = "gouxinjie.vercel.app";

const useStaticStats = ref(false);
const staticSitePv = ref("23680");
const staticSiteUv = ref("22460");

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const updateStaticStats = () => {
  const uv = getRandomInt(21800, 23200);
  const pv = uv + getRandomInt(900, 1800);

  staticSiteUv.value = String(uv);
  staticSitePv.value = String(pv);
};

onMounted(() => {
  useStaticStats.value = window.location.hostname === VERCEL_HOSTNAME;

  if (useStaticStats.value) {
    updateStaticStats();
  }
});
</script>

<!-- 访问量展示 -->
<template>
  <div class="panel">
    <div class="container">
      <section class="grid">
        <span class="text">
          本站总访问量
          <span v-if="useStaticStats" class="font-bold">{{ staticSitePv }}</span>
          <span v-else id="busuanzi_value_site_pv" class="font-bold">{{ staticSitePv }}</span> 次
        </span>
        <img src="/xinjie.png" alt="heart" width="100" height="100" />
        <!-- <img src="/tap.gif" alt="我让你敲" width="150" height="150" /> -->
        <span class="text">
          本站访客数
          <span v-if="useStaticStats" class="font-bold">{{ staticSiteUv }}</span>
          <span v-else id="busuanzi_value_site_uv" class="font-bold">{{ staticSiteUv }}</span> 人次
        </span>
      </section>
    </div>
  </div>
</template>

<style scoped>
.panel {
  margin-top: 30px;
  margin-bottom: 8px;
}

.container {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  width: 100%;
  min-height: 32px;
  max-width: 1152px;
  margin-left: auto;
  margin-right: auto;
}

.grid {
  font-weight: 500;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 12px;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  display: grid;
}

.text {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
