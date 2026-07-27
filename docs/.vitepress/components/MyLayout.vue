<script setup lang="ts">
import { useRouter, useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { watch, ref, computed, nextTick, provide, onMounted, onBeforeUnmount } from "vue";

const { Layout } = DefaultTheme;
const { route } = useRouter();
const { isDark } = useData();
const isTransitioning = ref(false);
const allowMotion = ref(false);
let transitionTimer: ReturnType<typeof setTimeout> | undefined;
let reducedMotionMedia: MediaQueryList | undefined;
let pointerMedia: MediaQueryList | undefined;

const shadeStyle = computed(() => ({
  backgroundColor: isDark.value ? "rgb(27, 27, 31)" : "rgb(255, 255, 255)"
}));

const showMouseClick = computed(() => allowMotion.value && route.path === "/");

// 备案号占位：备案通过后填写真实号（如「京ICP备12345678号-1」），留空则不显示
const beianNo = "沪ICP备2026024942号";

function syncMotionPreference() {
  if (typeof window === "undefined") {
    allowMotion.value = false;
    return;
  }

  allowMotion.value =
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
    window.matchMedia("(pointer: fine)").matches &&
    window.innerWidth >= 960;
}

const enableTransitions = () => "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`
  ];

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      fill: "forwards",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`
    }
  );
});

watch(
  () => route.path,
  () => {
    if (!allowMotion.value) {
      isTransitioning.value = false;
      return;
    }

    isTransitioning.value = true;
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      isTransitioning.value = false;
    }, 500);
  }
);

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: no-preference)");
  pointerMedia = window.matchMedia("(pointer: fine)");

  syncMotionPreference();
  reducedMotionMedia.addEventListener("change", syncMotionPreference);
  pointerMedia.addEventListener("change", syncMotionPreference);
  window.addEventListener("resize", syncMotionPreference);
});

onBeforeUnmount(() => {
  reducedMotionMedia?.removeEventListener("change", syncMotionPreference);
  pointerMedia?.removeEventListener("change", syncMotionPreference);
  window.removeEventListener("resize", syncMotionPreference);
  clearTimeout(transitionTimer);
});
</script>

<template>
  <Layout>
    <template #doc-top>
      <div class="shade" :class="{ 'shade-active': isTransitioning }" :style="shadeStyle">&nbsp;</div>
    </template>

    <template #layout-top>
      <MouseClick v-if="showMouseClick" />
    </template>

    <template #doc-footer-before>
      <BackToTop />
    </template>

    <template #layout-bottom>
      <div class="beian-footer">
        <a
          v-if="beianNo"
          class="beian-link"
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg class="beian-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1 3 5v6c0 5.25 3.75 10.2 9 12 5.25-1.8 9-6.75 9-12V5l-9-4Z" />
          </svg>
          <span>{{ beianNo }}</span>
        </a>
      </div>
    </template>
  </Layout>
</template>

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

.beian-footer {
  display: flex;
  justify-content: center;
  padding: 10px 24px 16px;
  font-size: 12px;
}

/* 拉近与 VPFooter 的垂直距离 */
.VPFooter {
  margin-bottom: 0 !important;
  padding-bottom: 8px !important;
}

.beian-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  color: var(--vp-c-text-2);
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: color 0.25s, border-color 0.25s, background 0.25s,
    box-shadow 0.25s, transform 0.25s;
}

.beian-link:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.beian-icon {
  width: 13px;
  height: 13px;
  fill: currentColor;
  opacity: 0.6;
  transition: opacity 0.25s, transform 0.25s;
}

.beian-link:hover .beian-icon {
  opacity: 1;
  transform: scale(1.12);
}
</style>
