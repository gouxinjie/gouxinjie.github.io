import { transformMenuList } from "../../utils/functions";
// 问题笔记模块相关
const problemList = [
  {
    text: "踩坑记录",
    collapsed: false,
    items: [
      {
        text: "项目部署完成静态文件404"
      },
      {
        text: "Vue2使用sort排序报死循环"
      },
      {
        text: "IOS手机橡皮筋回弹问题"
      },
      {
        text: "IOS手机video标签poster属性兼容问题"
      },
      {
        text: "Mac版钉钉微应用流式输出时前端报TypeError Load failed"
      },
      {
        text: "前端流式输出被浏览器截断问题"
      },
      {
        text:'发版后浏览器缓存问题'
      }
    ]
  },
  {
    text: "日常笔记",
    collapsed: false,
    items: [
      {
        text: "软件设计五大核心原则"
      },
      {
        text: "JS常见算法总结"
      },
      {
        text: "JS常见算法进阶"
      },
      {
        text: "使用有限状态机"
      },
      {
        text:'让用户回到上次页面阅读的位置'
      }
    ]
  }
];

export const transformProblemList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(problemList, path, isFilterList);
};
