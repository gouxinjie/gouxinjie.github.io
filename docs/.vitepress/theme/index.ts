/**
 * VitePress 主题配置文件
 * 配置主题颜色、布局、组件等
 * 颜色变量参考: https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css
 * 紫色品牌颜色: https://coolors.co/palette/dec9e9-dac3e8-d2b7e5-c19ee0-b185db-a06cd5-9163cb-815ac0-7251b5-6247aa
 */

// Vue 核心导入
import { onMounted, onBeforeUnmount, watch, nextTick } from "vue";

// VitePress 导入
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { inBrowser } from "vitepress";
import type { Theme } from "vitepress";

// 样式导入
import "./styles/index.scss"; // 启用新样式
import "./styles/home.scss"; // 新首页样式

// 第三方库导入
import mediumZoom from "medium-zoom"; // 图片预览插件
import { NProgress } from "nprogress-v2/dist/index.js"; // 进度条组件
import "nprogress-v2/dist/index.css"; // 进度条样式

// 组件导入
import MyLayout from "../components/MyLayout.vue"; // 布局组件 添加页面上下渐变出现的效果
import HomeUnderline from "../components/HomeUnderline.vue"; // 首页hero文字下划线
import ArticleMetadata from "../components/ArticleMetadata.vue"; // 字数及阅读时间
import MNavLinks from "../components/MNavLinks.vue"; // 导航组件
import ProjectsPanel from "../components/ProjectsPanel.vue"; // 在线项目展示
import PoetryDisplay from "../components/poetry/PoetryDisplay.vue"; // 诗词展示组件
import HeroDisplay from "../components/poetry/HeroDisplay.vue"; // 励志文本展示组件
import FamousDisplay from "../components/poetry/FamousDisplay.vue"; // 名句展示组件

// 同步组件导入（SSR 需要 scope id 来 hydration 匹配，defineAsyncComponent 在 SSR 中不会注入 scope id）
import SearchList from "../components/SearchList.vue";
import MyCard from "../components/MyCard.vue";
import DataPanel from "../components/DataPanel.vue";
import Confetti from "../components/Confetti.vue";
import MouseClick from "../components/MouseClick.vue";
import BackToTop from "../components/BackToTop.vue";
import CopyMarkdown from "../components/CopyMarkdown.vue";
import FeaturedArticles from "../components/home/FeaturedArticles.vue";
import StatsPanel from "../components/home/StatsPanel.vue";
import MermaidRenderer from "../components/MermaidRenderer.vue";
import XinjieHome from "../components/home/XinjieHome.vue";
import ChangelogTimeline from "../components/ChangelogTimeline.vue";
import { fetchBusuanziStats } from "../utils/site-stats";

const fetchBusuanzi = () => {
  fetchBusuanziStats();
};

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
    app.component("ArticleMetadata", ArticleMetadata); // 字数及阅读时间
    app.component("BackToTop", BackToTop);
    app.component("Mermaid", MermaidRenderer);
    app.component("MNavLinks", MNavLinks); // 导航组件
    app.component("ProjectsPanel", ProjectsPanel); // 在线项目展示
    app.component("PoetryDisplay", PoetryDisplay); // 诗词组件
    app.component("HeroDisplay", HeroDisplay); // 励志文本组件
    app.component("FamousDisplay", FamousDisplay); // 名句组件
    app.component("CopyMarkdown", CopyMarkdown);
    app.component("FeaturedArticles", FeaturedArticles); // 精选文章
    app.component("StatsPanel", StatsPanel); // 统计面板
    app.component("XinjieHome", XinjieHome); // 新首页主组件
    app.component("ChangelogTimeline", ChangelogTimeline); // 更新记录时间线

    /**
     * 访问量统计和进度条配置
     */
    if (inBrowser) {
      // 进度条配置
      NProgress.configure({ showSpinner: false });
      void fetchBusuanzi();

      // 路由守卫
      router.onBeforeRouteChange = () => {
        NProgress.start(); // 开始进度条
      };

      router.onAfterRouteChange = (to) => {
        void fetchBusuanzi(); // 触发访问量统计
        NProgress.done(); // 停止进度条

        // 百度统计：SPA 路由切换上报 PV
        if (import.meta.env.PROD && (window as any)._hmt) {
          (window as any)._hmt.push(["_trackPageview", to]);
        }
      };
    }
  },

  /**
   * 配置图片预览功能
   */
  setup() {
    const route = useRoute();
    let zoom: ReturnType<typeof mediumZoom> | undefined;

    /**
     * 初始化图片预览
     */
    const initZoom = () => {
      zoom?.close();
      zoom?.detach();
      zoom = mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
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

    onBeforeUnmount(() => {
      zoom?.detach();
      zoom?.close();
      zoom = undefined;
    });
  }
};

export default theme;
