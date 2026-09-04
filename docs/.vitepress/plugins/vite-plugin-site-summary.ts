/**
 * @description 站点统计虚拟模块插件
 * @author gxj
 * @date 2026-09-04
 *
 * 将 docs/column 的实时扫描结果以虚拟模块 `virtual:site-summary` 提供给前端组件：
 * - 构建期：扫描一次，结果为静态常量，不进入客户端运行时依赖（零额外体积）
 * - 开发期：文章新增/删除时失效模块缓存并刷新页面，编辑正文时不打断写作
 */
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

import { getSiteSummary } from "../utils/site-summary";

/** 虚拟模块 id */
const VIRTUAL_ID = "virtual:site-summary";
/** Vite 内部使用的解析后 id */
const RESOLVED_ID = "\0" + VIRTUAL_ID;

/** Vite 5 使用 server.ws 推送 HMR，Vite 6+ 使用 server.hot，此处做兼容 */
type ReloadableServer = ViteDevServer & {
  hot?: ViteDevServer["ws"];
};

/** 是否处于 dev 环境：dev 下每次重新扫描，build 下复用缓存 */
let devMode = false;

/** 统一为正斜杠，便于跨平台判断路径 */
const normalizePath = (file: string): string => file.split(path.sep).join("/");

/** 是否为专栏下的 Markdown 文件 */
const isColumnMarkdown = (file: string): boolean => {
  const normalized = normalizePath(file);
  return normalized.includes("/column/") && normalized.endsWith(".md");
};

export const VitePluginSiteSummary = (): Plugin => ({
  name: "vitepress-plugin-site-summary",
  enforce: "pre",

  resolveId(id) {
    if (id === VIRTUAL_ID) return RESOLVED_ID;
  },

  load(id) {
    if (id !== RESOLVED_ID) return;

    // dev：invalidate 后重新扫描，实时反映最新文章；build：只扫描一次
    const summary = getSiteSummary(!devMode);
    return `export default ${JSON.stringify(summary)};`;
  },

  configureServer(server: ViteDevServer) {
    devMode = true;

    /** 失效虚拟模块缓存，使下次请求重新扫描 */
    const invalidate = () => {
      const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (mod) server.moduleGraph.invalidateModule(mod);
    };

    /** 刷新页面 */
    const fullReload = () => {
      const hot = (server as ReloadableServer).hot ?? server.ws;
      hot.send({ type: "full-reload" });
    };

    server.watcher.on("all", (event, file) => {
      if (!isColumnMarkdown(file)) return;

      invalidate();

      // 仅在增删文章时刷新页面，编辑正文时等下次访问再更新，避免打断写作
      if (event === "add" || event === "unlink") fullReload();
    });
  }
});
