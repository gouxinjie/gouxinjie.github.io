declare module 'markdown-it-task-checkbox' {
  const plugin: (md: any) => void
  export default plugin
}

/**
 * 站点内容统计虚拟模块（由 vite-plugin-site-summary 在构建期生成）
 */
declare module 'virtual:site-summary' {
  const siteSummary: {
    /** 文章总数 */
    articleCount: number
    /** 分类数量（一级目录数） */
    categoryCount: number
    /** 累计字数 */
    wordCount: number
  }
  export default siteSummary
}
