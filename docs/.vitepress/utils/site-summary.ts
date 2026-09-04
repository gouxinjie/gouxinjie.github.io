/**
 * @description 站点内容统计（文章总数 / 分类数量 / 累计字数）
 * @author gxj
 * @date 2026-09-04
 *
 * 在 Node 侧（dev server / build）扫描 docs/column 目录实时计算，
 * 由 vite-plugin-site-summary 以虚拟模块形式注入，
 * 避免手动维护数字导致与真实内容不一致。
 *
 * 统计口径：
 *   - 文章总数：docs/column 下所有 .md（排除各专栏的 index.md 索引页）
 *   - 分类数量：包含文章的一级目录数量
 *   - 累计字数：全部文章正文（去除 frontmatter）后按中英文混排规则统计
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { countWord } from "../../utils/functions";

export interface SiteSummary {
  /** 文章总数 */
  articleCount: number;
  /** 分类数量（一级目录数） */
  categoryCount: number;
  /** 累计字数 */
  wordCount: number;
}

/** 专栏根目录：docs/column */
const COLUMN_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../column"
);

/** 不参与统计的文件（专栏索引页） */
const EXCLUDED_FILES = new Set(["index.md"]);

/** 匹配 frontmatter 的正则（含可选 BOM） */
const FRONTMATTER_RE = /^\uFEFF?---[\s\S]*?---/;

/**
 * 递归扫描专栏目录，统计文章数、分类数与总字数
 */
const scanColumn = (): SiteSummary => {
  let articleCount = 0;
  let wordCount = 0;
  const categories = new Set<string>();

  const walk = (dir: string, category?: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, category ?? entry.name);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
      if (EXCLUDED_FILES.has(entry.name)) continue;

      const raw = fs.readFileSync(fullPath, "utf8");
      const body = raw.replace(FRONTMATTER_RE, "");

      articleCount += 1;
      wordCount += countWord(body);
      if (category) categories.add(category);
    }
  };

  if (fs.existsSync(COLUMN_DIR)) walk(COLUMN_DIR);

  return {
    articleCount,
    categoryCount: categories.size,
    wordCount
  };
};

// 构建期扫描结果缓存（构建过程中 client / SSR 两次打包共用同一份数据）
let cachedSummary: SiteSummary | null = null;

/**
 * 获取站点内容统计
 * @param useCache 是否复用缓存，dev 环境下传 false 以实时反映最新文章
 */
export const getSiteSummary = (useCache = true): SiteSummary => {
  if (!useCache || !cachedSummary) {
    cachedSummary = scanColumn();
  }
  return cachedSummary;
};
