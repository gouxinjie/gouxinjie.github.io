import { transformMenuList } from "../../utils/functions";

// 日常项目模块相关
const gitList = [
  {
    text: "git相关",
    collapsed: false,
    items: [
      {
        text: "git安装与常用命令"
      },
      {
        text: "github配置ssh密钥"
      },
      {
        text: "工作中常用的git操作-1"
      },
      {
        text: "工作中常用的git操作-2"
      },
      {
        text: "git版本回退的两种方式"
      },
      {
        text:'git首次推送冲突完整解决流程'
      },
      {
        text:'git同时推送到多个远程仓库'
      }
    ]
  }
];

export const transformGitList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(gitList, path, isFilterList);
};
