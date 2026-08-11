import { transformMenuList } from "../../../utils/functions";

// 组件封装与文件处理模块
const componentFileList = [
  {
    text: "组件封装",
    collapsed: false,
    items: [
      {
        text: "png序列动画"
      },
      {
        text: "可编辑模板字符串"
      },
      {
        text: "各格式文件预览"
      },
      {
        text: "录音组件"
      },
      {
        text: "移动端B站风格弹幕系统实现方案"
      },
      {
        text: "移动端下拉刷新功能的实现"
      }
    ]
  },
  {
    text: "表单与表格专题",
    collapsed: false,
    items: [
      {
        text: "实现[记住密码]功能"
      },
      {
        text: "常用form表单验证"
      },
      {
        text: "form表单嵌套table表格"
      },
      {
        text: "动态切换不同form表单"
      },
      {
        text: "合并行列且循环的table表格"
      },
      {
        text: "移动端的table表格实现"
      }
    ]
  },
  {
    text: "文件处理专题",
    collapsed: false,
    items: [
      {
        text: "前端文件处理完全指南：File、Blob、Base64转换"
      },
      {
        text: "前端实现文件下载的完整流程"
      },
      {
        text: "前端PDF渲染与下载实现"
      },
      {
        text: "把页面导出为PDF"
      },
      {
        text: "使用 XLSX.js 导出 Excel 文件"
      }
    ]
  }
];

export const transformComponentFileList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(componentFileList, path, isFilterList);
};
