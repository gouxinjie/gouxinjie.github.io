// 问题笔记模块相关
const problemList = [
  {
    text: "问题笔记",
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
        text:'Mac版钉钉微应用流式输出时前端报TypeError Load failed'
      },
      {
        text:'前端流式输出被浏览器截断问题'
      }
    ]
  }
];

/**
 * @description  导出左侧菜单栏的列表
 * @param {String} path 路径前缀
 * @param {Boolean} isFilterList  是否用于筛选页面的处理
 * @example transformProblemList("/column/ProblemNotes/", true)
 */
export const transformProblemList = (path: string, isFilterList: boolean = false) => {
  problemList.forEach((col) => {
    if (col.items.length > 0) {
      col.items = col.items.map((subItem, index) => {
        // 是否是筛选页面的展示 link做特殊处理
        const link = isFilterList ? `${path}${col.text}/${subItem.text}` : `${path}${col.text}/${subItem.text}.md`;
        const text = isFilterList ? subItem.text : `${index + 1}. ${subItem.text}`;
        return { ...subItem, link, text };
      });
    }
  });

  return problemList;
};
