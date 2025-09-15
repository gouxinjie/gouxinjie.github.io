<script setup lang="ts">
/**
 * @description  自定义布局组件
 * @author gxj
 * @date 2025-09-8
 */

import { useRouter, useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { watch, ref, computed, nextTick, provide } from "vue";

const { Layout } = DefaultTheme;
const { route } = useRouter();
const { isDark } = useData(); // 获取当前主题模式
const isTransitioning = ref(false);

// 根据主题模式计算遮罩层样式
const shadeStyle = computed(() => ({
  backgroundColor: isDark.value ? "rgb(27, 27, 31)" : "rgb(255, 255, 255)"
}));

// 下面是换肤动效代码
const enableTransitions = () => "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }
  const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`];
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;
  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`
    }
  );
});

// 监听路由变化，添加页面切换动画
watch(
  () => route.path,
  () => {
    isTransitioning.value = true;
    // 动画结束后重置状态
    setTimeout(() => {
      isTransitioning.value = false;
    }, 500); // 500ms 要和 CSS 动画时间匹配
  }
);
</script>

<template>
  <Layout>
    <template #doc-top>
      <div class="shade" :class="{ 'shade-active': isTransitioning }" :style="shadeStyle">&nbsp;</div>
    </template>

    <!-- 由于我们一个插槽使用了多个组件，我们将其放在 MyLayout.vue 组件中 -->
    <template #layout-top>
      <MouseFollower v-if="false" />
      <MouseClick />
    </template>

    <!-- doc-footer-before插槽 添加返回顶部组件 -->
    <template #doc-footer-before>
      <BackToTop />
    </template>
  </Layout>
</template>

<!-- 路由切换样式 -->
<style>
.shade {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: transform 0.5s ease-in-out;
}
.shade-active {
  opacity: 0;
  animation: shadeAnimation 0.5s ease-in-out;
}

@keyframes shadeAnimation {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(100vh);
  }
}
</style>

<!-- 换肤切换样式 -->
<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

/* 恢复原始开关按钮 */
/* .VPSwitchAppearance {
  width: 22px !important;
} */

.VPSwitchAppearance .check {
  transform: none !important;
}

/* 修正因视图过渡导致的按钮图标偏移 */
.VPSwitchAppearance .check .icon {
  top: -2px;
}
</style>
