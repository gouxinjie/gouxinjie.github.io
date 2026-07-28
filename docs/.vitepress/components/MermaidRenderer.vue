<template>
  <div
    class="mermaid-wrapper"
    @mouseenter="showControls = true"
    @mouseleave="showControls = false"
  >
    <!-- 缩放 + 全屏控制栏 -->
    <Transition name="toolbar-fade">
      <div v-if="svg && showControls" class="mermaid-toolbar">
        <button class="tb-btn" title="放大" @click.stop="zoomIn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/>
          </svg>
        </button>
        <button class="tb-btn" title="缩小" @click.stop="zoomOut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>
          </svg>
        </button>
        <span class="tb-pct" @click.stop="zoomReset" title="重置缩放">
          {{ Math.round(zoom * 100) }}%
        </span>
        <button class="tb-btn reset-btn" title="重置" @click.stop="zoomReset">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
        </button>
        <span class="tb-divider"></span>
        <button class="tb-btn" title="全屏" @click.stop="openFullscreen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- 带缩放的 SVG 内容视口 -->
    <div class="mermaid-viewport" ref="viewportRef" :style="{ maxHeight: svgMaxHeight }">
      <div class="mermaid-scaler" :style="scalerStyle">
        <div :style="innerStyle">
          <div v-html="svg" :class="className"></div>
        </div>
      </div>
    </div>

    <!-- 全屏浮层 -->
    <Teleport to="body">
      <Transition name="fullscreen">
        <div
          v-if="isFullscreen"
          class="mermaid-fs-backdrop"
          @click.self="closeFullscreen"
          @mouseenter="showFsControls = true"
          @mouseleave="showFsControls = false"
        >
          <Transition name="fs-toolbar-fade">
            <div v-if="showFsControls" class="fs-floating-toolbar">
              <button class="fs-btn" title="放大" @click="zoomIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/>
                </svg>
              </button>
              <button class="fs-btn" title="缩小" @click="zoomOut">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>
                </svg>
              </button>
              <span class="fs-pct" @click="zoomReset">{{ Math.round(zoom * 100) }}%</span>
              <button class="fs-btn" title="重置" @click="zoomReset">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                </svg>
              </button>
              <span class="fs-divider"></span>
              <button class="fs-btn fs-close" title="关闭 (Esc)" @click="closeFullscreen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </Transition>
          <div
            class="mermaid-fs-body"
            @wheel.prevent="onWheelZoom"
            @mousedown="onFsMouseDown"
            @mousemove="onFsMouseMove"
            @mouseup="onFsMouseUp"
            @mouseleave="onFsMouseUp"
          >
            <div class="mermaid-scaler" :style="scalerStyle">
              <div :style="innerStyle">
                <div v-html="svg" :class="className"></div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, onUnmounted, ref, toRaw, watch, nextTick } from "vue";
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
const mermaidPageTheme = frontmatter["mermaidTheme"] || "";
const svg = ref("");
const className = computed(() => props.class);
let observer: MutationObserver | undefined;

const zoom = ref(1.2);
const prevZoom = ref(1.2); // 进入全屏前记录的缩放，关闭时还原，避免吞掉默认值
const showControls = ref(false);
const isFullscreen = ref(false);
const showFsControls = ref(false);
const viewportRef = ref<HTMLElement | undefined>();

// 图表真实（未缩放）尺寸，用于占位，保证缩放后滚动范围正确
const natural = ref({ w: 0, h: 0 });

const measureNatural = () => {
  const root = viewportRef.value;
  if (!root) return;
  const el = root.querySelector(".mermaid") as HTMLElement | null;
  if (!el) return;
  let w = el.offsetWidth;
  let h = el.offsetHeight;
  // 布局未就绪时回退到 SVG 自带的 width/height 属性
  if (w === 0 || h === 0) {
    const svgEl = el.querySelector("svg");
    if (svgEl) {
      w = parseFloat(svgEl.getAttribute("width") || "") || w;
      h = parseFloat(svgEl.getAttribute("height") || "") || h;
    }
  }
  if (w === 0 || h === 0) return; // 防止测量到 0 导致塌陷
  natural.value = { w, h };
};

// 外层占位：缩放后的实际尺寸（撑开滚动区，避免 transform 不改变布局导致的滚动范围过小）
// natural 尚未测得时（初始/布局未就绪）不限制尺寸，让内容自然显示，保证图表可见
const scalerStyle = computed(() => {
  if (natural.value.w === 0 || natural.value.h === 0) return {};
  return {
    width: `${natural.value.w * zoom.value}px`,
    height: `${natural.value.h * zoom.value}px`
  };
});

// 内层：仅做缩放，不限制宽高（由 SVG 自然撑开，避免塌陷）
const innerStyle = computed(() => ({
  transform: `scale(${zoom.value})`,
  transformOrigin: "top left"
}));

const zoomIn = () => { zoom.value = Math.min(zoom.value + 0.2, 4); };
const zoomOut = () => { zoom.value = Math.max(zoom.value - 0.2, 0.3); };
const zoomReset = () => { zoom.value = 1; };

// 全屏下滚轮缩放
const onWheelZoom = (e: WheelEvent) => {
  const delta = e.deltaY < 0 ? 0.15 : -0.15;
  zoom.value = Math.min(Math.max(zoom.value + delta, 0.3), 4);
};

// 全屏下按住拖动平移
let dragState: { x: number; y: number; sl: number; st: number } | null = null;
const onFsMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return;
  const el = e.currentTarget as HTMLElement;
  dragState = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop };
  el.classList.add("fs-grabbing");
};
const onFsMouseMove = (e: MouseEvent) => {
  if (!dragState) return;
  const el = e.currentTarget as HTMLElement;
  el.scrollLeft = dragState.sl - (e.clientX - dragState.x);
  el.scrollTop = dragState.st - (e.clientY - dragState.y);
};
const onFsMouseUp = (e: MouseEvent) => {
  if (!dragState) return;
  dragState = null;
  (e.currentTarget as HTMLElement).classList.remove("fs-grabbing");
};

const openFullscreen = () => {
  prevZoom.value = zoom.value; // 记住当前缩放，关闭时还原
  showFsControls.value = false;
  isFullscreen.value = true;
  document.body.style.overflow = "hidden";
  nextTick(measureNatural);
};
const closeFullscreen = () => {
  isFullscreen.value = false;
  document.body.style.overflow = "";
  zoom.value = prevZoom.value; // 还原进入全屏前的缩放（保留 1.2 默认）
};

// Esc 关闭全屏
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isFullscreen.value) closeFullscreen();
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

const svgMaxHeight = computed(() => {
  if (typeof window === "undefined") return "640px";
  const w = window.innerWidth;
  if (w <= 640) return "420px";
  if (w <= 960) return "560px";
  return "640px";
});

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
  observer = new MutationObserver(() => { void renderChart(); });
  observer.observe(document.documentElement, { attributes: true });
  await renderChart();
  await nextTick(measureNatural);
});

// SVG 重新渲染后重新测量真实尺寸
watch(svg, () => nextTick(measureNatural));

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<style scoped>
/* ===== 外层容器 ===== */
.mermaid-wrapper {
  position: relative;
  margin: 20px 0;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

/* ===== 视口 ===== */
.mermaid-viewport {
  overflow: auto;
  /* safe center：内容窄时水平居中；宽时可滚动到全部，避免 margin:auto 溢出变 0 导致贴左 */
  display: flex;
  justify-content: safe center;
  align-items: flex-start;
  padding: 24px 20px 20px;
}

.mermaid-viewport::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.mermaid-viewport::-webkit-scrollbar-track {
  background: transparent;
}

.mermaid-viewport::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 3px;
}

.mermaid-viewport::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

/* 缩放占位层：撑开滚动区，保证缩放后可完整拖动查看（居中由父级 flex safe center 处理） */
.mermaid-scaler {
  flex: 0 0 auto;
}

/* ===== 悬停工具栏 ===== */
.mermaid-toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0,0,0,.04),
    0 4px 16px rgba(0,0,0,.08);
  backdrop-filter: blur(8px);
}

/* 进入/离开过渡 */
.toolbar-fade-enter-active,
.toolbar-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.toolbar-fade-enter-from,
.toolbar-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ----- 按钮 ----- */
.tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.15s, background 0.15s, transform 0.15s;
}

.tb-btn:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: scale(1.08);
}

.tb-btn:active {
  transform: scale(0.94);
}

.tb-btn svg {
  width: 16px;
  height: 16px;
}

/* ----- 百分比 + 分隔线 ----- */
.tb-pct {
  padding: 0 6px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
  cursor: pointer;
  user-select: none;
  min-width: 36px;
  text-align: center;
  line-height: 30px;
  transition: color 0.15s;
}

.tb-pct:hover {
  color: var(--vp-c-brand-1);
}

.tb-divider {
  width: 1px;
  height: 18px;
  margin: 0 4px;
  background: var(--vp-c-divider);
  border-radius: 1px;
}

/* ===== 全屏浮层 ===== */
.mermaid-fs-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, .88);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
}

/* 进入/离开过渡 */
.fullscreen-enter-active {
  transition: opacity 0.22s ease;
}

.fullscreen-leave-active {
  transition: opacity 0.18s ease;
}

.fullscreen-enter-from,
.fullscreen-leave-to {
  opacity: 0;
}

/* ----- 全屏悬浮工具栏（鼠标移入显示） ----- */
.fs-floating-toolbar {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, .55);
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, .4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.fs-toolbar-fade-enter-active,
.fs-toolbar-fade-leave-active {
  transition: opacity 0.18s ease;
}

.fs-toolbar-fade-enter-from,
.fs-toolbar-fade-leave-to {
  opacity: 0;
}

/* ----- 全屏按钮 ----- */
.fs-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, .08);
  color: rgba(255, 255, 255, .75);
  cursor: pointer;
  transition: color 0.15s, background 0.15s, transform 0.12s;
}

.fs-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, .18);
  transform: translateY(-1px);
}

.fs-btn:active {
  transform: translateY(0);
}

.fs-btn svg {
  width: 17px;
  height: 17px;
}

.fs-close:hover {
  color: #fff !important;
  background: rgba(231, 76, 60, .85) !important;
}

/* ----- 全屏百分比 + 分隔线 ----- */
.fs-pct {
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, .7);
  cursor: pointer;
  user-select: none;
  line-height: 34px;
  transition: color 0.15s;
  min-width: 44px;
  text-align: center;
}

.fs-pct:hover {
  color: #fff;
}

.fs-divider {
  width: 1px;
  height: 20px;
  margin: 0 6px;
  background: rgba(255, 255, 255, .12);
  border-radius: 1px;
}

/* ----- 全屏内容区 ----- */
.mermaid-fs-body {
  flex: 1;
  overflow: auto;
  display: flex;
  /* safe center：内容小于视口时居中；大于视口时对齐起点，保证可滚动到全部边缘 */
  justify-content: safe center;
  align-items: safe center;
  padding: 40px;
  cursor: grab;
}

.mermaid-fs-body.fs-grabbing {
  cursor: grabbing;
  user-select: none;
}

.mermaid-fs-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.mermaid-fs-body::-webkit-scrollbar-track {
  background: transparent;
}

.mermaid-fs-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, .18);
  border-radius: 4px;
}

.mermaid-fs-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, .32);
}

.mermaid-fs-body :deep(.mermaid) {
  display: flex;
  justify-content: center;
  padding: 32px;
  background: #f9fafb;
  box-shadow: 0 24px 80px rgba(0, 0, 0, .15);
}

/* ===== SVG 适配 ===== */
.mermaid-wrapper :deep(.mermaid) svg {
  max-width: none;
}
</style>
