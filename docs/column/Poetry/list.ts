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

  // TODO: 暂时不展示生活常识模块
  // {
  //   text: "生活常识",
  //   collapsed: false,
  //   items: [
  //     {
  //       text: "廿四节气"
  //     },
  //     {
  //       text: "车险相关"
  //     },
  //     {
  //       text: "我国的行政区域划分"
  //     },
  //     {
  //       text: "我国的政权划分"
  //     },
  //     {
  //       text: "我国的官衔划分"
  //     },
  //     {
  //       text: "我国教育学历划分"
  //     },
  //     {
  //       text: "我国的社保体系"
  //     }
  //   ]
  // }
];

export const transformPoetryList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(poetryList, path, isFilterList);
};
