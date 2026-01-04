import { transformMenuList } from "../../utils/functions";
// react模块相关 这里写入的顺序和渲染的顺序是一致的
const ReactList = [
  {
    text: "组件",
    collapsed: false,
    items: [
      {
        text: "Fiber架构"
      },
      {
        text: "认识组件"
      },
      {
        text: "组件通信"
      },
      {
        text: "受控组件"
      },
      {
        text: "传送组件"
      },
      {
        text: "异步组件"
      },
      {
        text: "严格模式"
      }
    ]
  },
  {
    text: "CSS方案",
    collapsed: false,
    items: [
      {
        text: "css modules"
      },
      {
        text: "css in js(不推荐)"
      },
      {
        text: "css 原子化"
      }
    ]
  },
  {
    text: "Hooks",
    collapsed: false,
    items: [
      {
        text: "useState"
      },
      {
        text: "useState更新机制"
      },
      {
        text: "useReducer"
      },
      {
        text: "useSyncExternalStore"
      },
      {
        text: "useTransition"
      },
      {
        text: "useDeferredValue"
      }
    ]
  },
  {
    text: "副作用",
    collapsed: false,
    items: [
      {
        text: "useEffect"
      },
      {
        text: "利用useEffect处理竟态操作"
      },
      {
        text: "useLayoutEffect"
      },
      {
        text: "useInsertionEffect"
      }
    ]
  },
  {
    text: "状态传递",
    collapsed: false,
    items: [
      {
        text: "useRef"
      },
      {
        text: "useImperativeHandle"
      },
      {
        text: "createContext与useContext"
      }
    ]
  },
  {
    text: "性能优化",
    collapsed: false,
    items: [
      {
        text: "父组件变化导致子组件重新渲染"
      },
      {
        text: "useMemo和React.memo"
      },
      {
        text: "useCallback"
      },
      {
        text: "使用函数引用作为依赖项"
      }
    ]
  },
  {
    text: "其它相关",
    collapsed: false,
    items: [
      {
        text: "Immer库使用"
      },
      {
        text: "Hooks为什么不能写到判断里面"
      },
      {
        text: "自定义Hooks的封装"
      },
      {
        text: "函数式组件中使用Redux"
      }
    ]
  },
  {
    text: "Zustand",
    collapsed: false,
    items: [
      {
        text: "基本使用"
      },
      {
        text: "Immer和持久化"
      },
      {
        text: "状态简化"
      },
      {
        text: "状态订阅"
      }
    ]
  }
];

// 模块导出
export const ReactListExport = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(ReactList, path, isFilterList);
};
