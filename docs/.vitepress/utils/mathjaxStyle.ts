/**
 * MathJax 公式样式处理工具
 *
 * markdown-it-mathjax3 渲染公式时，会在每一处公式位置内联一份 <style> 块
 * （包含 MathJax 的 SVG 样式表），且该插件无法配置关闭内联。
 *
 * 问题：
 *   - Vue 编译器（vite:vue）在 dev 模式会把 markdown 渲染结果当模板编译，
 *     正文中的 <style>/<script> 会直接抛出 "Tags with side effect..." 错误。
 *   - 每处公式重复输出一整份相同 CSS，页面体积极度冗余。
 *
 * 解决方案：
 *   wrapMathjaxRenderers(md)：包装 math_inline / math_block 渲染规则，剥离
 *   公式输出中的 <style> 块。对应样式已由 theme/styles/mathjax.scss 全局注入。
 *   必须在 md.use(markdownItMathjax3) 之后调用，以确保渲染规则已存在。
 *   这样 dev 和 build 阶段，正文中都不再有 <style>，Vue 编译器不会再报错。
 */

/**
 * 剥离字符串中所有 <style>...</style> 块
 */
function stripStyles(content: string): string {
  return content.replace(/<style>[\s\S]*?<\/style>/g, "");
}

/**
 * 包装 mathjax3 的渲染规则，剥离 <style> 块，避免 Vue 编译器报错。
 * @param md 已通过 md.use(markdownItMathjax3) 注册的 markdown-it 实例
 */
export function wrapMathjaxRenderers(md: any) {
  const ruleNames = ["math_inline", "math_block"];

  for (const ruleName of ruleNames) {
    const orig = md.renderer.rules[ruleName] as
      | ((tokens: any, idx: number, options: any, env: any, self: any) => string)
      | undefined;
    if (typeof orig !== "function") continue;

    md.renderer.rules[ruleName] = (
      tokens: any,
      idx: number,
      options: any,
      env: any,
      self: any
    ) => {
      return stripStyles(orig(tokens, idx, options, env, self));
    };
  }
}
