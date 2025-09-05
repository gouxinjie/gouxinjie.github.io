// 在.vitepress/theme/custom.css文件
/* color vars: https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css */
/* purple brand color: https://coolors.co/palette/dec9e9-dac3e8-d2b7e5-c19ee0-b185db-a06cd5-9163cb-815ac0-7251b5-6247aa */

import { onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./styles2/index.scss"; // 启用新样式 参考茂茂物语
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { inBrowser } from "vitepress";
// import SiteList from "../components/siteList.vue"; 暂未使用
import busuanzi from "busuanzi.pure.js"; // 访问量统计
import DataPanel from "../components/DataPanel.vue"; // 浏览量统计
import mediumZoom from "medium-zoom"; // 图片预览插件
import MyCard from "../components/MyCard.vue"; // 卡片组件
import BackTop from "../components/BackTop.vue"; // 返回顶部
import SearchList from "../components/SearchList.vue"; // 搜索列表
import Confetti from "../components/Confetti.vue"; // 首页纸屑动画

/** 把站点曾经可能存在的 PWA 缓存和 Service Worker 全部清掉 */
if (typeof window !== "undefined") {
  /* 注销 PWA 服务 */
  if (window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
  /* 删除浏览器中的缓存 */
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


export default {
  ...DefaultTheme,
  NotFound: () => "404",
  enhanceApp({ app, router, siteData }) {
    app.use(ElementPlus);
    // 注册全局组件
    app.component("BackTop", BackTop);
    app.component("SearchList", SearchList);
    app.component("MyCard", MyCard);
    app.component("DataPanel", DataPanel);
    app.component("Confetti", Confetti);

    if (inBrowser) {
      router.onAfterRouteChanged = () => {
        busuanzi.fetch();
      };
    }
  },

  // 此处配置图片预览功能
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  }
};
