import { transformMenuList } from "../../utils/functions";
// 问题笔记模块相关
const problemList = [
  {
    text: "诗词相关",
    collapsed: false,
    items: [
      {
        text: "词牌名-蝶恋花"
      },
      {
        text: "词牌名-浣溪沙"
      },
      {
        text: "词牌名-菩萨蛮"
      },
      {
        text: "词牌名-临江仙"
      },
      {
        text: "写尽相思-道尽别离"
      },
    ]
  },
  {
    text: "其他",
    collapsed: false,
    items: [
      {
        text: "人性"
      }
    ]
  }
];

export const transformPoetryList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(problemList, path, isFilterList);
};
