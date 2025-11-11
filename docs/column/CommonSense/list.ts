import { transformMenuList } from "../../utils/functions";

const commonSenseList = [
  {
    text: "生活常识",
    collapsed: false,
    items: [
      {
        text: "廿四节气"
      },
      {
        text: "车险相关"
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

export const transformCommonSenseList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(commonSenseList, path, isFilterList);
};
