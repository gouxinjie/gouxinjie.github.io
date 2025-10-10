import { transformMenuList } from "../../utils/functions";
// 问题笔记模块相关
const problemList = [
  {
    text: "诗词相关",
    collapsed: false,
    items: [
      {
        text: "词牌名",
        items: [{ text: "蝶恋花" }, { text: "浣溪沙" }, { text: "菩萨蛮" }, { text: "临江仙" }]
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
  },
  {
    text: "其他",
    collapsed: false,
    items: [
      {
        text: "廿四节气"
      },
      {
        text: "我国的行政区域划分"
      },
      {
        text: "我国的政权划分"
      },
      {
        text: "我国的官衔划分"
      },
      {
        text: "我国教育学历划分"
      },
      {
        text: "我国的社保体系"
      }
    ]
  }
];

export const transformPoetryList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(problemList, path, isFilterList);
};
