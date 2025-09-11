// node模块相关
const nodeList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "npm package.json"
      },
      {
        text: "npm install原理"
      },
      {
        text: "npm run原理"
      },
      {
        text: "npx 命令"
      },
      {
        text: "全局变量"
      },
      { text: "模块化规范" },
      {
        text: "CSR SSR SSG"
      },
      {
        text: "模块查找规则"
      },
      {
        text: "pnpm解决幽灵依赖"
      },
      {
        text: "nvm相关"
      },
      {
        text:'npm serve'
      }
    ]
  },

  {
    text: "内置模块",
    collapsed: false,
    items: [
      {
        text: "path 模块"
      },
      {
        text: "os 模块"
      },
      {
        text: "fs 模块"
      },
      {
        text: "process 模块"
      },
      {
        text: "events 模块"
      },
      {
        text: "http 模块"
      },
      {
        text: "crypto 模块"
      },
      {
        text: "express 模块"
      }
    ]
  },
  {
    text: "MySQL",
    collapsed: false,
    items: [
      {
        text: "基础"
      },
      {
        text: "增删改查"
      },
      {
        text: "表达式和函数"
      },
      {
        text: "请求数据"
      },
      {
        text: "knex"
      },
      {
        text: "prisma"
      }
    ]
  }
];

/**
 * @description  导出左侧菜单栏的列表
 * @param {String} path 路径前缀
 * @param {Boolean} isFilterList  是否用于筛选页面的处理
 * @example transformNodeList("/column/Node/", true)
 */
export const transformNodeList = (path: string, isFilterList: boolean = false) => {
  nodeList.forEach((colum) => {
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
  return nodeList;
};
