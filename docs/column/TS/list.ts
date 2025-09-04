const TSList = [
  {
    text: "基础类型系统",
    collapsed: false,
    items: [
      { text: "ts简单介绍" },
      { text: "内置类型" },
      { text: "Class类" },
      { text: "索引签名" },
      { text: "交叉类型" },
      { text: "泛型使用" },
      { text: "非空断言操作符" },
      { text: "as const类型收窄" },
      { text: "type和interface" },
      { text: "字面量类型赋值问题" },
      { text: "keyof T & on${string}组合" },
      { text: "unknown、never、any区别" },
      { text: "Object、object、{}区别" }
    ]
  },
  {
    text: "类型工具",
    collapsed: false,
    items: [
      { text: "Record类型" },
      { text: "Partial类型" },
      { text: "Pick类型" },
      { text: "Omit类型" },
      { text: "Required类型" },
      { text: "Exclude类型" },
      { text: "Extract类型" },
      { text: "NonNullable类型" }
    ]
  },
  {
    text: "工程化相关",
    collapsed: false,
    items: [
      { text: "tsconfig.json配置文件" },
      { text: "三斜线指令" },
      { text: "命名空间" },
      { text: "声明文件" },
      { text: "装饰器Decorator" },
      { text: "协变和逆变" },
      { text: "类型守卫" }
    ]
  }
];

// 模块导出
export const transformTSList = (path: string, isFilterList: boolean = false) => {
  TSList.forEach((colum) => {
    if (colum.items.length > 0) {
      colum.items = colum.items.map((subItem, index) => {
        const link = isFilterList ? `${path}${colum.text}/${subItem.text}` : `${path}${colum.text}/${subItem.text}.md`;
        const text = isFilterList ? subItem.text : `${subItem.text}`;
        return { ...subItem, link, text };
      });
    }
  });
  return TSList;
};
