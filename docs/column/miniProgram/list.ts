// 日常项目模块相关
const miniProgramList = [
  {
    text: "uniApp",
    collapsed: false,
    items: [
      {
        text: "页面常用的生命周期"
      },
      {
        text: "uniApp中使用pinia状态管理库与持久化"
      },
      {
        text:'自动按需引入组件(easycom)'
      }
    ]
  },
  {
    text: "weixin",
    collapsed: false,
    items: [
      {
        text: "微信小程序的登录流程"
      },
      {
        text: "微信小程序返回上一个页面并刷新数据"
      },
      {
        text: "微信小程序页面之间传参的几种方式"
      }
    ]
  },
  {
    text: "alipay",
    collapsed: false,
    items: [
      {
        text: "支付宝不支持将自定义组件当page使用"
      },
      {
        text: "支付宝小程序引导用户开启定位"
      }
    ]
  }
];

/**
 * @description  导出左侧菜单栏的列表
 * @param {String} path 路径前缀
 * @param {Boolean} isFilterList  是否用于筛选页面的处理
 * @example transformVueList("/column/miniProgram/", true)
 */
export const transformMiniProgramList = (path: string, isFilterList: boolean = false) => {
  miniProgramList.forEach((colum) => {
    if (colum.items.length > 0) {
      colum.items = colum.items.map((subItem, index) => {
        // 是否是筛选页面的展示 link做特殊处理
        const link = isFilterList ? `${path}${colum.text}/${subItem.text}` : `${path}${colum.text}/${subItem.text}.md`;
        const text = isFilterList ? subItem.text : `${index + 1}. ${subItem.text}`;
        return { ...subItem, link, text };
      });
    }
  });

  return miniProgramList;
};
