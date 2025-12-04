import { text } from "stream/consumers";
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
        text: "发版后浏览器缓存问题"
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
        text: "理解前端的运行时与编译时"
      },
      {
        text: "JS常见函数与算法总结"
      },
      {
        text: "有限状态机在前端中的应用"
      },
      {
        text: "让用户回到上次页面阅读的位置"
      },
      {
        text: "前端本地开发构建和更新的过程"
      },
      {
        text: "IntersectionObserver与懒加载"
      },
      {
        text:'构建时hash和contenthash区别'
      },
      {
        text:'使用FNM进行Node的版本管理'
      },
      {
        text:'移动端下拉刷新功能实现'
      },
      {
        text:'移动端B站弹幕功能实现'
      },
      {
        text:'SVG与Canvas添加水印'
      },
      {
        text:'APP扫码登录的原理'
      },
      {
        text:'共享单车的扫码逻辑'
      },
      {
        text:'CDN资源不会产生跨域问题'
      },
      {
        text:'网站主题切换原理与实践'
      },
      {
        text:'顶部阅读进度条实现'
      },
      {
        text:'NProgress“跟随”页面加载的原理'
      }
    ]
  }
];

export const transformProblemList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(problemList, path, isFilterList);
};
