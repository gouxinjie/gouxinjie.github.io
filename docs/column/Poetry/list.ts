import { transformMenuList } from "../../utils/functions";

const poetryList = [
  {
    text: "诗词相关",
    collapsed: false,
    items: [
      {
        text: "词牌名",
        items: [{ text: "蝶恋花" }, { text: "浣溪沙" }, { text: "菩萨蛮" }, { text: "临江仙" }]
      },
      {
        text: "田园风光"
      },
      {
        text: "相思别离"
      },
      { text: "寓情于景" },
      {
        text: "名句总结"
      },
      {
        text: "人性"
      }
    ]
  }
];

export const transformPoetryList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(poetryList, path, isFilterList);
};
