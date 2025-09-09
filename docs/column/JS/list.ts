// js模块
export const JSList = [
  {
    text: "JS核心机制",
    items: [
      {
        text: "语言基础",
        items: [
          { text: "标准JS和浏览器JS的区别" },
          { text: "typeof与instanceof区别" },
          { text: "匿名函数和箭头函数" },
          { text: "常用的逻辑运算符" },
          { text: "展开运算符的使用" },
          { text: "类型转换" },
          {
            text: "ES6Module模块化跨域问题"
          },
          {
            text: "console打印相关"
          }
        ]
      },
      {
        text: "面向对象",
        items: [{ text: "原型和原型链" }, { text: "this指向问题" }, { text: "Proxy与Reflect" }]
      },
      {
        text: "异步编程",
        items: [
          { text: "promise讲解" },
          { text: "promise.all和race" },
          { text: "generator和async" },
          { text: "AbortController请求中断" },
          { text: "requestAnimationFrame" },
          { text: "IntersectionObserver" }
        ]
      }
    ]
  },
  {
    text: "数据操作与处理",
    items: [
      {
        text: "数组处理",
        items: [
          { text: "引用类型的拷贝" },
          { text: "常用的浅拷贝和深拷贝" },
          { text: "forEach进阶" },
          { text: "sort使用场景" },
          { text: "高阶函数reduce" },
          { text: "数组新增常用方法" },
          { text: "for in和for of循环的区别" },
          { text: "Iterator迭代器和for of循环" }
        ]
      },
      {
        text: "字符串处理",
        items: [{ text: "split和join区别" }, { text: "字符串新增常用方法" }, { text: "toLocaleString常用场景" }]
      },
      {
        text: "对象处理",
        items: [{ text: "对象、数组和字符串方法总结" }, { text: "对象新增的一些常用方法" }]
      }
    ]
  },
  {
    text: "浏览器与DOM操作",
    items: [
      {
        text: "事件冒泡和事件委托"
      },
      { text: "关于BOM浏览器对象模型" },
      {
        text: "getBoundingClientRect使用"
      },
      {
        text: "offset、client、scroll区别"
      },
      { text: "ios中video标签poster属性兼容问题" }
    ]
  }
];
/**
 * @description  导出左侧菜单栏的列表
 * @param {String} path 路径前缀
 * @param {Boolean} isFilterList  是否用于筛选页面的处理
 */
// export const transformJSList = (path: string, isFilterList: boolean = false) => {
//   JSList.forEach((col) => {
//     if (col.items.length > 0) {
//       col.items = col.items.map((subItem, index) => {
//         // 是否是筛选页面的展示 link做特殊处理
//         const link = isFilterList ? `${path}${col.text}/${subItem.text}` : `${path}${col.text}/${subItem.text}.md`;
//         const text = isFilterList ? subItem.text : `${index + 1}. ${subItem.text}`;
//         return { ...subItem, link, text };
//       });
//     }
//   });
//   return JSList;
// };

interface MenuItem {
  text: string;
  link?: string;
  items?: MenuItem[];
}

/**
 * @description 处理任意深度的嵌套结构
 * @param path
 * @param isFilterList
 * @returns
 */
export const transformJSList = (path: string, isFilterList: boolean = false): MenuItem[] => {
  // 使用深度优先遍历处理嵌套结构
  const transformItems = (items: MenuItem[], parentPath: string = ""): MenuItem[] => {
    return items.map((item, index) => {
      const currentPath = `${parentPath}${parentPath ? "/" : ""}${item.text}`;

      // 处理当前项
      const transformedItem: MenuItem = {
        ...item,
        text: isFilterList ? item.text : `${item.text}`
      };

      // 如果是筛选页面，添加链接（只对叶子节点添加）
      if (isFilterList && !item.items?.length) {
        transformedItem.link = `${path}${currentPath}`;
      } else if (!isFilterList) {
        transformedItem.link = `${path}${currentPath}.md`;
      }

      // 递归处理子项
      if (item.items) {
        transformedItem.items = transformItems(item.items, currentPath);
      }

      return transformedItem;
    });
  };

  return transformItems(JSList);
};
