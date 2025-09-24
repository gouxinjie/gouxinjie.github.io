import { transformMenuList } from "../../utils/functions";

// python模块相关
const pythonList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "基础语法入门"
      },
      {
        text: "常用内置模块"
      },
      {
        text: "__name__和__main__"
      },
      {
        text: "导入导出模块化"
      },
      {
        text: "env环境变量管理"
      },
      {
        text: "pip包管理工具"
      },
      {
        text: "async异步编程"
      }
    ]
  },
  {
    text: "第三方库",
    collapsed: false,
    items: [
      {
        text: "flask"
      },
      {
        text: "fastapi"
      },
      {
        text: "typing"
      },
      {
        text: "requests"
      },
      {
        text:'sqlalchemy'
      }
    ]
  }
];

export const transformPythonList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(pythonList, path, isFilterList);
};
