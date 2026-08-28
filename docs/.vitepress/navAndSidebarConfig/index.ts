/**
 * @description 导航配置
 * 顶部导航区和左侧导航栏
 */
import { DefaultTheme } from "vitepress";
import { transformJSList } from "../../column/JS/list";
import { transformVueList } from "../../column/Vue/list";
import { ReactListExport } from "../../column/React/list";
import { HtmlCssListExport } from "../../column/ProblemNotes/HtmlCss/list";
import { transformFrontendAdvanceList } from "../../column/前端进阶/list";
import { transformDatabaseList } from "../../column/数据库/list";
import { transformMiniProgramList } from "../../column/ProblemNotes/miniProgram/list";
import { transformNetworkList } from "../../column/Network/list";
import { transformNodeList } from "../../column/Node/list";
import { transformAngularList } from "../../column/Angular/list";
import { transformTSList } from "../../column/TS/list";
import { transformProblemData } from "../../column/ProblemNotes/list";
import { transformComponentFileList } from "../../column/ProblemNotes/组件封装与文件处理/list";
import { transformPoetryList } from "../../column/Poetry/list";
import { transformPythonList } from "../../column/Python/list";
import { transformNextList } from "../../column/Next/list";
import { transformCommonSenseList } from "../../column/CommonSense/list";
import { transformGitList } from "../../column/Git/list";
import { transformNginxList } from "../../column/Nginx/list";
import { transformDockerList } from "../../column/Docker/list";
import { transformLinuxList } from "../../column/Linux/list";
import { transformAIFutureList } from "../../column/AIFuture/list";
import { transformAliyunList } from "../../column/Aliyun/list";

/**
 * 顶部导航区
 * 设置了侧边栏 会自动跳转到侧边栏第一项
 */
export const nav: DefaultTheme.NavItem[] = [
  {
    text: "主页",
    link: "/column/Personal/index.md" // 表示docs/index.md
  },
  {
    text: "AI 提效",
    link: "/column/AIFuture/index.md"
  },
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
    text: "网络相关",
    link: "/column/Network/index.md"
  },
  {
    text: "后端相关",
    items: [
      {
        text: "Node.js",
        link: "/column/Node/index.md"
      },
      {
        text: "Python",
        link: "/column/Python/index.md"
      },
      {
        text: "数据库",
        link: "/column/数据库/index.md"
      }
    ]
  },
  {
    text: "服务与部署",
    items: [
      {
        text: "Nginx常用",
        link: "/column/Nginx/index.md"
      },
      {
        text: "Docker常用",
        link: "/column/Docker/index.md"
      },
      {
        text: "Linux常用",
        link: "/column/Linux/index.md"
      },
      {
        text: "阿里云ECS",
        link: "/column/Aliyun/index.md"
      }
    ]
  },
  {
    text: "更多",
    items: [
      {
        text: "进阶",
        items: [
          {
            text: "Angular",
            link: "/column/Angular/index.md"
          },
          {
            text: "JS进阶",
            link: "/column/JS/index.md"
          },
          {
            text: "TS进阶",
            link: "/column/TS/index.md"
          },
          {
            text: "Git常用",
            link: "/column/Git/index.md"
          },
          {
            text: "前端进阶",
            link: "/column/前端进阶/index.md"
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
            text: "常见面试题",
            link: "/column/Interview/index.md"
          }
        ]
      },
      {
        text: "日常记录",
        items: [
          {
            text: "踩坑记录",
            link: "/column/ProblemNotes/踩坑记录/"
          },
          {
            text: "组件封装与文件处理",
            link: "/column/ProblemNotes/组件封装与文件处理/"
          },
          {
            text: "小程序相关",
            link: "/column/ProblemNotes/miniProgram/"
          },
          {
            text: "HTML/CSS",
            link: "/column/ProblemNotes/HtmlCss/index.md"
          }
        ]
      }
    ]
  },
  {
    text: "其它",
    items: [
      {
        text: "更新记录",
        link: "/column/UpdateLog/changelog.md"
      },
      {
        text: "样式测试",
        link: "/column/StyleText/index.md"
      },
      {
        text: "诗词相关",
        link: "/column/Poetry/index.md"
      },
      {
        text: "生活常识",
        link: "/column/CommonSense/index.md"
      }
    ]
  },
  // {
  //   text: "关于我",
  //   items: [
  //     { text: "Github", link: "https://github.com/gouxinjie" },
  //     {
  //       text: "Gitee",
  //       link: "https://gitee.com/gou-xinjie"
  //     },
  //     {
  //       text: "CSND社区",
  //       link: "https://blog.csdn.net/qq_43886365"
  //     }
  //   ]
  // }
];

/**
 * @description 侧边栏配置
 */
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

  /** AI相关 */
  "/column/AIFuture/": transformAIFutureList("/column/AIFuture/"),

  /** 网络相关 */
  "/column/Network/": transformNetworkList("/column/Network/"),

  /** angular模块 */
  "/column/Angular/": transformAngularList("/column/Angular/"),

  /** TS模块 */
  "/column/TS/": transformTSList("/column/TS/"),

  /** html/css模块 */
  "/column/ProblemNotes/HtmlCss/": HtmlCssListExport("/column/ProblemNotes/HtmlCss/"),

  /** git相关 */
  "/column/Git/": transformGitList("/column/Git/"),

  /** nginx相关 */
  "/column/Nginx/": transformNginxList("/column/Nginx/"),

  /** docker相关 */
  "/column/Docker/": transformDockerList("/column/Docker/"),

  /** linux相关 */
  "/column/Linux/": transformLinuxList("/column/Linux/"),

  /** 阿里云相关 */
  "/column/Aliyun/": transformAliyunList("/column/Aliyun/"),

  /** 小程序相关 */
  "/column/ProblemNotes/miniProgram/": transformMiniProgramList("/column/ProblemNotes/miniProgram/"),

  /** 前端进阶相关 */
  "/column/前端进阶/": transformFrontendAdvanceList("/column/前端进阶/"),

  /** 数据库相关 */
  "/column/数据库/": transformDatabaseList("/column/数据库/"),

  /** 踩坑记录相关 */
  "/column/ProblemNotes/踩坑记录/": transformProblemData("/column/ProblemNotes/"),

  /** 组件封装与文件处理相关 */
  "/column/ProblemNotes/组件封装与文件处理/": transformComponentFileList("/column/ProblemNotes/组件封装与文件处理/"),

  /** 诗词相关 */
  "/column/Poetry/": transformPoetryList("/column/Poetry/"),

  /** 生活常识相关 */
  "/column/CommonSense/": transformCommonSenseList("/column/CommonSense/")
};
