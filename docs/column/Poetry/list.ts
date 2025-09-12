import { transformMenuList } from "../../utils/functions";
// 问题笔记模块相关
const problemList = [
  {
    text: "诗词相关",
    collapsed: false,
    items: [
      {
        text: "蝶恋花"
      },
      {
        text: "浣溪沙"
      },
      {
        text: "菩萨蛮"
      },
      {
        text: "临江仙"
      }
    ]
  }
];

export const transformPoetryList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(problemList, path, isFilterList);
};
