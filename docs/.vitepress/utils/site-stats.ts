import { ref } from "vue";

/**
 * 站点访问量统计相关配置
 * 线上正式域名列表：这些域名下使用「不蒜子」真实统计
 */
export const PROD_HOSTNAMES = [
  "gouxinjie.github.io",
  "blog.gouxinjie.com",
  "gouxinjie.vercel.app",
];

/**
 * 判断当前是否处于线上正式域名
 * @param hostname 当前窗口 hostname，默认从 window.location.hostname 获取
 */
export const isProdHostname = (hostname?: string): boolean => {
  const target = hostname ?? (typeof window !== "undefined" ? window.location.hostname : "");
  return PROD_HOSTNAMES.includes(target);
};

/**
 * 历史统计基数（启用不蒜子统计之前的既有数据）
 * - PV_BASE：历史总访问量
 * - UV_BASE：历史访客数
 * 最终显示值 = 不蒜子实时值 + 该历史基数
 */
export const PV_BASE = 49437;
export const UV_BASE = 36102;

/**
 * 共享的真实统计值（由不蒜子回调写入，已叠加历史基数）
 * - sitePv：总访问量（PV）
 * - siteUv：访客数（UV）
 * 供 DataPanel、StatsPanel 等组件响应式读取
 */
export const sitePv = ref("");
export const siteUv = ref("");

/**
 * 不蒜子回调：写入真实统计值（叠加历史基数）
 * @param data 不蒜子返回的数据，包含 site_pv / site_uv 等字段
 */
const applyBusuanzi = (data: Record<string, string>) => {
  if (data?.["site_pv"] != null)
    sitePv.value = String((parseInt(data["site_pv"], 10) || 0) + PV_BASE);
  if (data?.["site_uv"] != null)
    siteUv.value = String((parseInt(data["site_uv"], 10) || 0) + UV_BASE);
};

/**
 * 通过 JSONP 请求不蒜子真实统计数据，并写入共享响应式 store。
 * 各面板（DataPanel、StatsPanel）通过响应式 ref 自动更新，无需手动操作 DOM。
 *
 * 说明：busuanzi.pure.js 的 fetch() 不支持传入回调，因此这里自行发起 JSONP 请求，
 * 以便同时拿到 site_pv / site_uv 数据。
 */
export const fetchBusuanziStats = () => {
  if (typeof window === "undefined" || !isProdHostname()) return;

  const callbackName = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
  // window 上的动态回调挂载，使用索引签名类型以绕过 TS 对未知属性的限制
  const win = window as unknown as Record<string, unknown>;

  let timeoutId: number | undefined;

  const cleanup = () => {
    delete win[callbackName];
    if (timeoutId) window.clearTimeout(timeoutId);
  };

  win[callbackName] = (data: Record<string, string>) => {
    try {
      applyBusuanzi(data);
    } catch (e) {
      console.error("busuanzi callback error:", e);
    } finally {
      cleanup();
    }
  };

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = "//busuanzi.ibruce.info/busuanzi?jsonpCallback=" + callbackName;
  script.onerror = () => {
    cleanup();
    script.remove();
  };
  document.head.appendChild(script);

  // 超时兜底：10s 内未返回则清理，避免回调泄漏
  timeoutId = window.setTimeout(() => {
    cleanup();
    script.remove();
  }, 10000);
};
