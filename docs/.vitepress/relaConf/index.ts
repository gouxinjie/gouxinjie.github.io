import { DefaultTheme } from "vitepress";
import { transformJSList } from "../../column/JS/list";
import { transformVueList } from "../../column/Vue/list";
import { ReactListExport } from "../../column/React/list";
import { HtmlCssListExport } from "../../column/HtmlCss/list";
import { transformProjectList } from "../../column/Project/list";
import { transformMiniProgramList } from "../../column/miniProgram/list";
import { transformNetworkList } from "../../column/Network/list";
import { transformNodeList } from "../../column/Node/list";
import { transformAngularList } from "../../column/Angular/list";
import { transformTSList } from "../../column/TS/list";
import { transformProblemList } from "../../column/ProblemNotes/list";
import { transformPoetryList } from "../../column/Poetry/list";
import { transformPythonList } from "../../column/Python/list";
import { transformNextList } from "../../column/Next/list";

/**
 * 顶部导航区
 * 设置了侧边栏 会自动跳转到侧边栏第一项
 */
export const nav: DefaultTheme.NavItem[] = [
  {
    text: "首页",
    link: "/" // 表示docs/index.md
  },
  // {
  //   text: "入微",
  //   link: "/column/Inspiration/index.md"
  // },
  {
    text: "React",
    link: "/column/React/index.md"
  },
  {
    text: "Vue",
    link: "/column/Vue/index.md"
  },
  {
    text: "Next.js",
    link: "/column/Next/index.md"
  },
  {
    text: "Node.js",
    link: "/column/Node/index.md"
  },
  {
    text: "Python",
    link: "/column/Python/index.md"
  },
  {
    text: "网络相关",
    link: "/column/Network/index.md"
  },
  {
    text: "更多",
    items: [
      {
        text: "Angular",
        link: "/column/Angular/index.md"
      },
      {
        text: "TS进阶",
        link: "/column/TS/index.md"
      },
      {
        text: "JS进阶",
        link: "/column/JS/index.md"
      },
      {
        text: "项目相关",
        link: "/column/Project/"
      },
      {
        text: "小程序相关",
        link: "/column/miniProgram/"
      },
      {
        text: "HTML/CSS",
        link: "/column/HtmlCss/index.md"
      }
    ]
  },
  {
    text: "前端生态",
    items: [
      {
        text: "框架组件",
        link: "/column/Ecology/com.md"
      },
      {
        text: "工程化相关",
        link: "/column/Ecology/project.md"
      },
      {
        text: "工具推荐",
        link: "/column/Recommend/index.md"
      },
      {
        text: "HTML/CSS",
        link: "/column/Ecology/html-css.md"
      },
      {
        text: "面试题总结",
        link: "/column/Interview/index.md"
      }
    ]
  },
  {
    text: "问题/笔记",
    link: "/column/ProblemNotes/index.md"
  },
  {
    text: "日常总结",
    link: "/column/Poetry/index.md"
  }

  // {
  //   text: "个人成长",
  //   items: [
  //     {
  //       text: "个人",
  //       link: "/column/Self/Travel.md"
  //     },
  //     {
  //       text: "成长",
  //       link: "/column/Self/Growing.md"
  //     }
  //   ]
  // }
  // {
  //   text: "关于我",
  //   items: [
  //     { text: "Github", link: "https://github.com/Jacqueline712" },
  //     {
  //       text: "掘金",
  //       link: "https://juejin.cn/user/3131845139247960/posts"
  //     },
  //     {
  //       text: "飞书社区",
  //       link: "https://pzfqk98jn1.feishu.cn/wiki/space/7193915595975491587?ccm_open_type=lark_wiki_spaceLink"
  //     }
  //   ]
  // }
];

/** 显示侧边栏 */
export const sidebar: DefaultTheme.Sidebar = {
  /** js模块 */
  "/column/JS/": transformJSList("/column/JS/"),

  /** vue模块 */
  "/column/Vue/": transformVueList("/column/Vue/"),

  /** react模块 */
  "/column/React/": ReactListExport("/column/React/"),

  /** Node.js相关 */
  "/column/Node/": transformNodeList("/column/Node/"),

  /** nextjs模块 */
  "/column/Next/": transformNextList("/column/Next/"),

  /** python模块 */
  "/column/Python/": transformPythonList("/column/Python/"),

  /** 网络相关 */
  "/column/Network/": transformNetworkList("/column/Network/"),

  /** angular模块 */
  "/column/Angular/": transformAngularList("/column/Angular/"),

  /** TS模块 */
  "/column/TS/": transformTSList("/column/TS/"),

  /** html/css模块 */
  "/column/HtmlCss/": HtmlCssListExport("/column/HtmlCss/"),

  /** 小程序相关 */
  "/column/miniProgram/": transformMiniProgramList("/column/miniProgram/"),

  /** 项目相关 */
  "/column/Project/": transformProjectList("/column/Project/"),

  /** 问题笔记相关 */
  "/column/ProblemNotes/": transformProblemList("/column/ProblemNotes/"),

  /** 诗词相关 */
  "/column/Poetry/": transformPoetryList("/column/Poetry/")
};
