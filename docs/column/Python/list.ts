import { transformMenuList } from "../../utils/functions";

// python模块相关
const pythonList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "基础入门"
      }
    ]
  }
];

export const transformPythonList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(pythonList, path, isFilterList);
};
