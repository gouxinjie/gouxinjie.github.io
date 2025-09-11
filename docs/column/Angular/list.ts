import { transformMenuList } from '../../utils/functions';

const angularList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "概念"
      },
      {
        text: "组件"
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
        text: "http客户端"
      },
      { text: "Signal(信号)" },
      {
        text: "路由和导航"
      }
    ]
  },

  {
    text: "Ngrx",
    collapsed: false,
    items: [
      {
        text: "基本使用"
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
        text:'样式测试'
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
