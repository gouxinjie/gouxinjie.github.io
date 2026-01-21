/**
 * VitePress 主题配置文件
 * 配置主题颜色、布局、组件等
 * 颜色变量参考: https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css
 * 紫色品牌颜色: https://coolors.co/palette/dec9e9-dac3e8-d2b7e5-c19ee0-b185db-a06cd5-9163cb-815ac0-7251b5-6247aa
 */

// Vue 核心导入
import { onMounted, watch, nextTick } from "vue";

// VitePress 导入
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { inBrowser } from "vitepress";
import type { Theme } from "vitepress";

// 样式导入
import "./styles/index.scss"; // 启用新样式

// 第三方库导入
import busuanzi from "busuanzi.pure.js"; // 访问量统计
import mediumZoom from "medium-zoom"; // 图片预览插件
import { NProgress } from "nprogress-v2/dist/index.js"; // 进度条组件
import "nprogress-v2/dist/index.css"; // 进度条样式

// 组件导入
import DataPanel from "../components/DataPanel.vue"; // 浏览量统计
import MyCard from "../components/MyCard.vue"; // 卡片组件
import SearchList from "../components/SearchList.vue"; // 搜索列表
import Confetti from "../components/Confetti.vue"; // 首页五彩纸屑动画
import MyLayout from "../components/MyLayout.vue"; // 布局组件 添加页面上下渐变出现的效果
import HomeUnderline from "../components/HomeUnderline.vue"; // 首页hero文字下划线
import MouseClick from "../components/MouseClick.vue"; // 鼠标点击效果
import MouseFollower from "../components/MouseFollower.vue"; // 鼠标跟随效果
import Update from "../components/update.vue"; // 更新时间
import ArticleMetadata from "../components/ArticleMetadata.vue"; // 字数及阅读时间
import BackToTop from "../components/BackToTop.vue";
import MNavLinks from "../components/MNavLinks.vue"; // 导航组件
import PoetryDisplay from "../components/poetry/PoetryDisplay.vue"; // 诗词展示组件
import HeroDisplay from "../components/poetry/HeroDisplay.vue"; // 励志文本展示组件
import FamousDisplay from "../components/poetry/FamousDisplay.vue"; // 名句展示组件

/**
 * 清理 PWA 缓存和 Service Worker
 * 把站点曾经可能存在的 PWA 缓存和 Service Worker 全部清掉
 */
if (typeof window !== "undefined") {
  /**
   * 注销 PWA 服务
   */
  if (window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
  
  /**
   * 删除浏览器中的缓存
   */
  if ("caches" in window) {
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          return caches.delete(key);
        })
      );
    });
  }
}

/**
 * 彩虹背景动画样式元素
 */
let homePageStyle: HTMLStyleElement | undefined;

/**
 * 主题配置
 */
const theme: Theme = {
  ...DefaultTheme,
  NotFound: () => "404",
  Layout: MyLayout, // 自定义 Layout

  /**
   * 增强应用
   * @param app 应用实例
   * @param router 路由实例
   */
  enhanceApp({ app, router }) {
    /**
     * 注册全局组件
     */
    app.component("SearchList", SearchList);
    app.component("MyCard", MyCard);
    app.component("DataPanel", DataPanel);
    app.component("Confetti", Confetti);
    app.component("HomeUnderline", HomeUnderline); // 首页hero文字下划线
    app.component("MouseClick", MouseClick);
    app.component("MouseFollower", MouseFollower);
    app.component("Update", Update); // 更新时间
    app.component("ArticleMetadata", ArticleMetadata); // 字数及阅读时间
    app.component("BackToTop", BackToTop);
    app.component("MNavLinks", MNavLinks); // 导航组件
    app.component("PoetryDisplay", PoetryDisplay); // 诗词组件
    app.component("HeroDisplay", HeroDisplay); // 励志文本组件
    app.component("FamousDisplay", FamousDisplay); // 名句组件

    /**
     * 彩虹背景动画样式
     * 监听路由变化，在首页添加彩虹背景动画
     */
    if (typeof window !== "undefined") {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === "/"),
        { immediate: true }
      );
    }

    /**
     * 访问量统计和进度条配置
     */
    if (inBrowser) {
      // 进度条配置
      NProgress.configure({ showSpinner: false });
      
      // 路由守卫
      router.onBeforeRouteChange = () => {
        NProgress.start(); // 开始进度条
      };
      
      router.onAfterRouteChange = () => {
        busuanzi.fetch(); // 触发访问量统计
        NProgress.done(); // 停止进度条
      };
    }
  },

  /**
   * 配置图片预览功能
   */
  setup() {
    const route = useRoute();
    
    /**
     * 初始化图片预览
     */
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    
    // 组件挂载时初始化
    onMounted(() => {
      initZoom();
    });
    
    // 路由变化时重新初始化
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  }
};

export default theme;

/**
 * 彩虹背景动画样式
 * @param value 是否添加彩虹背景动画
 */
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return;

    homePageStyle = document.createElement("style");
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`;
    document.body.appendChild(homePageStyle);
  } else {
    if (!homePageStyle) return;

    homePageStyle.remove();
    homePageStyle = undefined;
  }
}
