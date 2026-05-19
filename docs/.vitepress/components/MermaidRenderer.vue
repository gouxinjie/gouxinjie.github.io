<template>
  <div v-html="svg" :class="className"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRaw } from "vue";
import { useData } from "vitepress";
import type { MermaidConfig } from "mermaid";

const props = withDefaults(
  defineProps<{
    graph: string;
    id: string;
    class?: string;
  }>(),
  {
    class: "mermaid"
  }
);

const { page } = useData();
const frontmatter = toRaw(page.value.frontmatter);
const mermaidPageTheme = frontmatter.mermaidTheme || "";
const svg = ref("");
const className = computed(() => props.class);
let observer: MutationObserver | undefined;

const baseConfig: MermaidConfig = {
  securityLevel: "loose",
  startOnLoad: false
};

const renderChart = async () => {
  const { default: mermaid } = await import("mermaid");
  const hasDarkClass = document.documentElement.classList.contains("dark");
  const config: MermaidConfig = { ...baseConfig };

  if (mermaidPageTheme) config.theme = mermaidPageTheme;
  if (hasDarkClass) config.theme = "dark";

  mermaid.initialize(config);
  const { svg: svgCode } = await mermaid.render(props.id, decodeURIComponent(props.graph));
  const salt = Math.random().toString(36).slice(2);
  svg.value = `${svgCode} <span style="display: none">${salt}</span>`;
};

onMounted(async () => {
  observer = new MutationObserver(() => {
    void renderChart();
  });
  observer.observe(document.documentElement, { attributes: true });
  await renderChart();
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
