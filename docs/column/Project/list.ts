// 日常项目模块相关
const projectList = [
  {
    text: "表单与表格专题",
    collapsed: false,
    items: [
      {
        text: "实现[记住密码]功能"
      },
      {
        text: "常用form表单验证"
      },
      {
        text: "form表单嵌套table表格"
      },
      {
        text: "动态切换不同form表单"
      },
      {
        text: "合并行列且循环的table表格"
      },
      {
        text: "移动端的table表格实现"
      }
    ]
  },
  {
    text: "文件处理专题",
    collapsed: false,
    items: [
      {
        text: "base64、file、blob转换"
      },
      {
        text: "PDF渲染和下载"
      },
      {
        text: "页面导出为PDF"
      },
      {
        text: "浏览器导出各种文件"
      },
      {
        text: "导出excel文件"
      }
    ]
  },
  {
    text: "性能与架构",
    collapsed: false,
    items: [
      {
        text: "import动态导入使用"
      },
      {
        text: "网站图片优化方案"
      },
      {
        text: "客户端和服务器端渲染区别"
      },
      {
        text: "前端常用加密方式"
      },
      { text: "防抖和节流函数细节" }
    ]
  },
  {
    text: "组件封装",
    collapsed: false,
    items: [
      {
        text: "录音组件"
      },
      {
        text: "png序列动画"
      },
      {
        text: "可编辑模板字符串"
      },
      {
        text: "各格式文件预览"
      },
      {
        text: "神策埋点"
      }
    ]
  },
  {
    text: "git相关",
    collapsed: false,
    items: [
      {
        text: "工作中常用的git操作-1"
      },
      {
        text: "工作中常用的git操作-2"
      }
    ]
  }
];

/**
 * @description  导出左侧菜单栏的列表
 * @param {String} path 路径前缀
 * @param {Boolean} isFilterList  是否用于筛选页面的处理
 * @example transformVueList("/column/Project/", true)
 */
export const transformProjectList = (path: string, isFilterList: boolean = false) => {
  projectList.forEach((col) => {
    if (col.items.length > 0) {
      col.items = col.items.map((subItem, index) => {
        // 是否是筛选页面的展示 link做特殊处理
        const link = isFilterList ? `${path}${col.text}/${subItem.text}` : `${path}${col.text}/${subItem.text}.md`;
        const text = isFilterList ? subItem.text : `${index + 1}. ${subItem.text}`;
        return { ...subItem, link, text };
      });
    }
  });

  return projectList;
};
