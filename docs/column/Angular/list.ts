import { transformMenuList } from "../../utils/functions";

const angularList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "概念"
      },
      {
        text: "模块"
      },
      {
        text: "组件"
      },
      {
        text: "模板语法与指令"
      },
      {
        text: "数据绑定"
      },
      {
        text: "管道Pipe"
      },
      {
        text: "服务和依赖注入"
      },
      {
        text: "表单"
      },
      {
        text: "生命周期实战"
      },
      {
        text: "装饰器"
      },
      {
        text: "变更检测"
      },
      {
        text: "http客户端"
      },
      { text: "Signal(信号)" },
      {
        text: "路由和导航"
      },
      {
        text: "AngularCLI与项目结构"
      }
    ]
  },

  {
    text: "Ngrx",
    collapsed: false,
    items: [
      {
        text: "基本使用"
      },
      {
        text: "核心概念"
      },
      {
        text: "完整状态管理流程"
      },
      {
        text: "Entity与路由状态与ComponentStore"
      }
    ]
  },
  {
    text: "RxJs",
    collapsed: false,
    items: [
      {
        text: "基本使用"
      },
      {
        text: "Subject详解"
      },
      {
        text: "操作符实战"
      },
      {
        text: "订阅管理与内存泄漏"
      }
    ]
  }
];

/**
 * @description  导出左侧菜单栏的列表
 * @param {String} path 路径前缀
 * @param {Boolean} isFilterList  是否用于筛选页面的处理
 * @example transformAngularList("/column/Angular/", true)
 */
export const transformAngularList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(angularList, path, isFilterList, false);
};
