import { transformMenuList } from "../../utils/functions";

// vue模块相关
const vueList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "生命周期"
      },
      {
        text: "计算属性"
      },
      {
        text: "类与样式绑定"
      },
      {
        text: "列表渲染"
      },
      {
        text: "动态组件"
      },
      {
        text: "Watch监听"
      },
      {
        text: "Slots插槽"
      },
      {
        text: "defineExpose"
      },
      {
        text: "Attributes属性透传"
      },
      {
        text: "组件注册和组件通信"
      },
      {
        text: "Ref获取DOM"
      },
      {
        text: "Mixin混入"
      }
    ]
  },

  {
    text: "深入组件",
    collapsed: false,
    items: [
      {
        text: "reactive和ref区别"
      },
      {
        text: "vue是mvvm模型吗"
      },
      {
        text: "scoped属性原理"
      },
      {
        text: "依赖注入"
      },
      {
        text: "异步组件"
      }
    ]
  },

  {
    text: "内置组件",
    collapsed: false,
    items: [
      {
        text: "Teleport"
      },
      {
        text: "Transition"
      },
      {
        text: "KeepAlive"
      },
      {
        text: "Suspense"
      }
    ]
  },

  {
    text: "响应式API进阶",
    collapsed: false,
    items: [
      {
        text: "toRaw"
      },
      {
        text: "shallowRef"
      },
      {
        text: "shallowReactive"
      },
      {
        text: "shallowReadonly"
      },
      {
        text: "watchEffect"
      },
      {
        text: "watchPostEffect"
      },
      {
        text: "watchSyncEffect"
      },
      {
        text: "reactive视图未更新"
      }
    ]
  },
  // {
  //   text: "性能优化",
  //   collapsed: false,
  //   items: [
  //     {
  //       text: ""
  //     }
  //   ]
  // },
  {
    text: "构建打包相关",
    collapsed: false,
    items: [
      {
        text: "publicPath讲解"
      },
      {
        text: "环境变量和NODE_ENV"
      },
      {
        text: "vue.config.js"
      },
      {
        text: "index.html中获取环境"
      }
    ]
  },
  {
    text: "Vite相关",
    collapsed: false,
    items: [
      {
        text: "依赖预构建"
      },
      {
        text: "常用优化插件"
      },
      {
        text: "使用Eslint"
      }
    ]
  },
  {
    text: "第三方库使用",
    collapsed: false,
    items: [
      {
        text: "VueX详解"
      },
      {
        text: "VueUse工具集"
      },
      {
        text: "I18n国际化"
      },
      {
        text: "Pinia状态管理"
      },
      {
        text: "Echarts绘制地图"
      },
      {
        text: "打包可视化分析"
      },
      {
        text: "VueRouter路由导航"
      },
      {
        text: "clipboardjs复制文本"
      },
      {
        text: "BOS百度对象存储"
      },
      {
        text: "Canvas图片合并"
      },
      {
        text: "图片添加水印和截图"
      }
    ]
  },
  {
    text: "其它",
    collapsed: false,
    items: [
      {
        text: "路由传参的三种方式"
      },
      {
        text: "常见的性能优化"
      },
      {
        text: "常见的移动端rem适配方案"
      },
      {
        text: "腾讯地图使用"
      },
      {
        text: "优雅的vue2项目总体结构"
      },
      {
        text: "路由匹配和懒加载"
      },
      {
        text: "webpack的基本使用和总结"
      }
    ]
  }
];

export const transformVueList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(vueList, path, isFilterList);
};
