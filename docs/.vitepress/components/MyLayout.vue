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

// 仅首页（站点根路径与 Personal 主页）显示自定义页脚
const isHome = computed(() => {
  const p = route.path.replace(/index\.html$/, "").replace(/\/+$/, "");
  return p === "" || p === "/column/Personal";
});

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

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// 移动端页脚模块折叠状态
interface FooterCollapsed {
  nav: boolean;
  resource: boolean;
  contact: boolean;
}
const footerCollapsed = ref<FooterCollapsed>({
  nav: false,
  resource: false,
  contact: false
});

function toggleFooterCol(key: keyof FooterCollapsed) {
  footerCollapsed.value[key] = !footerCollapsed.value[key];
}
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
      <footer v-if="isHome" class="site-footer">
        <div class="footer-inner">
          <div class="footer-col footer-brand">
            <a class="footer-logo" href="/">
              <img src="/xinjie.png" alt="logo" />
              <span>xinjie</span>
            </a>
            <p class="footer-slogan">用代码构建价值，用 AI 探索未来。</p>
            <div class="footer-brand-actions">
              <span class="action-btn" title="English">EN</span>
              <span class="action-btn" title="切换主题" @click="isDark = !isDark">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/></svg>
              </span>
            </div>
            <div class="footer-badge">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
              持续学习，持续构建。
            </div>
          </div>

          <div class="footer-col">
            <h4 class="col-head" @click="toggleFooterCol('nav')">
              导航
              <svg class="col-chevron" :class="{ open: !footerCollapsed.nav }" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </h4>
            <div class="footer-col-body" :class="{ collapsed: footerCollapsed.nav }">
              <a href="/column/Personal/">主页</a>
              <a href="/column/Node/">Node.js</a>
              <a href="/column/Next/">Next.js</a>
              <a href="/column/Network/">网络相关</a>
              <a href="/column/Docker/">服务与部署</a>
            </div>
          </div>

          <div class="footer-col">
            <h4 class="col-head" @click="toggleFooterCol('resource')">
              资源
              <svg class="col-chevron" :class="{ open: !footerCollapsed.resource }" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </h4>
            <div class="footer-col-body" :class="{ collapsed: footerCollapsed.resource }">
              <a class="external-link" href="http://gouxinjie.com/" target="_blank" rel="noopener noreferrer">
                我的主页
                <svg class="external-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6m0-6-9 9m-3-9H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3"/></svg>
              </a>
              <a class="external-link" href="https://github.com/gouxinjie" target="_blank" rel="noopener noreferrer">
                GitHub
                <svg class="external-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6m0-6-9 9m-3-9H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3"/></svg>
              </a>
              <a class="external-link" href="https://gitee.com/gou-xinjie" target="_blank" rel="noopener noreferrer">
                Gitee
                <svg class="external-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6m0-6-9 9m-3-9H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3"/></svg>
              </a>
              <a class="external-link" href="https://blog.csdn.net/qq_43886365" target="_blank" rel="noopener noreferrer">
                CSDN
                <svg class="external-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6m0-6-9 9m-3-9H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3"/></svg>
              </a>
            </div>
          </div>

          <div class="footer-col">
            <h4 class="col-head" @click="toggleFooterCol('contact')">
              联系
              <svg class="col-chevron" :class="{ open: !footerCollapsed.contact }" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </h4>
            <div class="footer-col-body" :class="{ collapsed: footerCollapsed.contact }">
              <a class="contact-row" href="mailto:gxj1311318389@163.com">
                <svg viewBox="0 0 24 24" class="contact-icon" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><path d="m22 6-10 7L2 6"/></svg>
                gxj1311318389@163.com
              </a>
              <div class="contact-row no-link">
                <svg viewBox="0 0 24 24" class="contact-icon" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/></svg>
                微信: 13113183859
              </div>
              <div class="contact-row no-link">
                <svg viewBox="0 0 24 24" class="contact-icon" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                上海 · 浦东新区
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-left">
            <span class="footer-copy">© 2026 gouxinjie. All rights reserved.</span>
            <a
              v-if="beianNo"
              class="beian-text"
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ beianNo }}
            </a>
          </div>
          <button class="back-to-top" @click="scrollToTop" title="回到顶部">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V4m0 0-6 6m6-6 6 6"/></svg>
            <span>回到顶部</span>
          </button>
        </div>
      </footer>
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

/* 使用自定义页脚，隐藏默认 VPFooter */
.VPFooter {
  display: none !important;
}

.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.footer-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 32px 24px 20px;
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1fr;
  gap: 32px;
}

.footer-brand .footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 19px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.footer-logo img {
  width: 34px;
  height: 34px;
  border-radius: 8px;
}

.footer-slogan {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  max-width: 260px;
  font-size: 14px;
}

.footer-brand-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
}

.action-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.action-btn svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.footer-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding: 5px 14px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 500;
}

.footer-badge svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.footer-col h4 {
  margin: 0 0 5px;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-col h4::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

/* 折叠箭头：桌面端隐藏，移动端显示 */
.col-chevron {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  display: none;
  transition: transform 0.3s ease;
}

.col-chevron.open {
  transform: rotate(180deg);
}

.footer-col-body {
  display: block;
}

.footer-col a {
  display: block;
  padding: 3px 0;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
  font-size: 14px;
}

.footer-col a:hover {
  color: var(--vp-c-brand-1);
}

.footer-col a.external-link {
  display: flex;
  align-items: center;
  gap: 4px;
}

.external-icon {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.6;
}

.footer-col .contact-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 3px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-row.no-link {
  cursor: default;
}

.contact-row:hover:not(.no-link) {
  color: var(--vp-c-brand-1);
}

.contact-icon {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.6;
  flex-shrink: 0;
}

.footer-bottom {
  border-top: 1px solid var(--vp-c-divider);
  max-width: 1152px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
}

.footer-bottom-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.footer-copy {
  color: var(--vp-c-text-3);
}

.beian-text {
  flex-basis: 100%;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

.beian-text:hover {
  color: var(--vp-c-brand-1);
}

.back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.back-to-top:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.back-to-top svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 28px 24px 16px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }

  /* 移动端：模块标题可点击折叠，箭头靠右 */
  .footer-col .col-head {
    cursor: pointer;
    user-select: none;
  }

  .footer-col .col-chevron {
    display: block;
    margin-left: auto;
  }

  /* 折叠容器：用 max-height 实现展开/收起过渡 */
  .footer-col-body {
    max-height: 600px;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .footer-col-body.collapsed {
    max-height: 0;
  }
}

@media (max-width: 480px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
