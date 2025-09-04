// CSS 模块相关 这里写入的顺序和渲染的顺序是一致的
const HtmlCssList = [
  {
    text: "HTML",
    collapsed: false,
    items: [
      {
        text: "HTML理论知识点"
      }
    ]
  },
  {
    text: "CSS",
    collapsed: false,
    items: [
      {
        text: "CSS理论知识点"
      },
      {
        text: "盒子水平垂直居中的几种方式"
      },
      {
        text: "绝对定位与Flex布局冲突解决"
      },
      {
        text: "类选择器中间有无空格的区别"
      },
      {
        text: "实现文本单行居中多行左对齐"
      },
      {
        text: "transform影响fixed定位"
      }
    ]
  }
];

/** 模块导出 */
export const HtmlCssListExport = (path: string, isFilterList: boolean = false) => {
  HtmlCssList.forEach((col) => {
    if (col.items.length > 0) {
      col.items = col.items.map((subItem, index) => {
        // 是否是筛选页面的展示 link做特殊处理
        const link = isFilterList ? `${path}${col.text}/${subItem.text}` : `${path}${col.text}/${subItem.text}.md`;
        const text = isFilterList ? subItem.text : `${subItem.text}`;
        return { ...subItem, link, text };
      });
    }
  });
  return HtmlCssList;
};
