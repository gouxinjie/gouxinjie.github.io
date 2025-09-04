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
  angularList.forEach((colum) => {
    if (colum.items.length > 0) {
      colum.items = colum.items.map((subItem, index) => {
        // 是否是筛选页面的展示 link做特殊处理
        // const link = isFilterList ? `${path}${subItem.text}` : `${path}${subItem.text}.md`;
        // const text = isFilterList ? subItem.text : `${index + 1}. ${subItem.text}`;
        const link = isFilterList ? `${path}${colum.text}/${subItem.text}` : `${path}${colum.text}/${subItem.text}.md`;
        const text = isFilterList ? subItem.text : `${subItem.text}`;
        return { ...subItem, link, text };
      });
    }
  });
  return angularList;
};
