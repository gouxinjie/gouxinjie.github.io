import { transformMenuList } from "../../utils/functions";

// 数据库模块相关
const databaseList = [
  {
    text: "MySQL",
    collapsed: false,
    items: [
      {
        text: "关系型和非关系型数据库"
      },
      {
        text: "数据类型"
      },
      {
        text: "基础语法"
      },
      {
        text: "SQL查询的本质"
      },
      {
        text: "事务理解"
      },
      {
        text: "关联关系"
      },
      {
        text: "JOIN连接操作"
      },
      {
        text: "表达式和函数"
      },
      {
        text: "实战演练"
      },
      {
        text: "请求数据"
      },
      {
        text: "knex"
      },
      {
        text: "prisma"
      },
      {
        text: "better-sqlite3"
      }
    ]
  }
];

export const transformDatabaseList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(databaseList, path, isFilterList);
};
