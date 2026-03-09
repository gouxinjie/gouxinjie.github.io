import { transformMenuList } from "../../utils/functions";

// 日常项目模块相关
const projectList = [
  {
    text: "组件封装",
    collapsed: false,
    items: [
      {
        text: "录音组件"
      },
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
        text: "神策埋点"
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
  },
  {
    text: "性能与架构",
    collapsed: false,
    items: [
      {
        text: "import动态导入使用与高级应用"
      },
      {
        text: "网站图片优化方案"
      },
      {
        text: "客户端和服务器端渲染区别"
      },
      {
        text: "前端常用加密方式"
      },
      { text: "防抖和节流函数细节" }
    ]
  }
];

export const transformProjectList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(projectList, path, isFilterList);
};
