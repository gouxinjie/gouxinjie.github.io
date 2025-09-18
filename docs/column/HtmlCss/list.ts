import { transformMenuList } from "../../utils/functions";

// CSS 模块相关 这里写入的顺序和渲染的顺序是一致的
const HtmlCssList = [
  {
    text: "HTML",
    collapsed: false,
    items: [
      {
        text: "HTML理论基础"
      },
      {
        text: "HTML5新特性"
      },
      {
        text: "HTML5视频做天气卡片背景"
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
        text: "root选择器"
      },
      {
        text: "实现上下渐变的框线"
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
  return transformMenuList(HtmlCssList, path, isFilterList, false);
};
