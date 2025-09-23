import { transformMenuList } from "../../utils/functions";

// python模块相关
const pythonList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "基础入门"
      },
      {
        text: "内置模块"
      },
      {
        text: "模块化"
      }
    ]
  },
  {
    text: "第三方库",
    collapsed: false,
    items: [
      {
        text: "Flask"
      },
      {
        text: "try"
      }
    ]
  }
];

export const transformPythonList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(pythonList, path, isFilterList);
};
