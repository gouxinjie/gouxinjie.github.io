<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import confetti from "canvas-confetti";
import { useData } from "vitepress"; // 导入 useData API

const { isDark } = useData(); // 获取当前主题模式
let frameId: number | undefined;

function shouldAnimate() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches && window.innerWidth >= 960;
}

onMounted(() => {
  if (!shouldAnimate()) {
    return;
  }

  /* 第一个特效：五彩纸屑 */
  confetti({
    particleCount: 100,
    spread: 170,
    origin: { y: 0.6 }
  });

  /* 第二个特效：雪花 */
  var duration = 15 * 1000;
  var animationEnd = Date.now() + duration;
  var skew = 1;
  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  (function frame() {
    var timeLeft = animationEnd - Date.now();
    var ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: Math.random() * skew - 0.2
      },
      colors: [isDark.value ? "#ffffff" : "#ffffff"], // 根据主题模式动态设置颜色 #bfbfbf
      shapes: ["circle"],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4)
    });

    if (timeLeft > 0) {
      frameId = requestAnimationFrame(frame);
    }
  })();
});

onBeforeUnmount(() => {
  if (frameId) {
    cancelAnimationFrame(frameId);
  }
});
</script>

<template></template>
