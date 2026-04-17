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
      <MouseFollower v-if="false" />
      <MouseClick v-if="showMouseClick" />
    </template>

    <template #doc-footer-before>
      <BackToTop />
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
</style>
