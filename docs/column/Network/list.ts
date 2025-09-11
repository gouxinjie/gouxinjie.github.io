import { transformMenuList } from "../../utils/functions";

// 网络相关模块
const networkList = [
  {
    text: "网络基础",
    collapsed: false,
    items: [
      {
        text: "OSI七层网络模型"
      },
      {
        text: "TCP-IP协议"
      },
      {
        text: "FetchApi请求"
      },
      {
        text: "AJAX与Axios"
      },
      {
        text: "网络常用命令"
      },
      {
        text: "Wireshark抓包工具"
      },
      {
        text: "Ngrok内网穿透"
      },
      {
        text: "添加埋点方式和原理"
      },
      {
        text: "sendBeacon数据上报"
      },
      {
        text: "XSS脚本攻击"
      },
      {
        text: "跨域解决方式"
      },
      {
        text: "浏览器输入URL发生了什么"
      }
    ]
  },
  {
    text: "Web传输",
    collapsed: false,
    items: [
      {
        text: "HTTP基础"
      },
      {
        text: "HTTP1.1和HTTP2"
      },
      {
        text: "HTTPS(TSL和SSL)"
      },
      {
        text: "JWT鉴权"
      },
      {
        text: "CDN内容分发"
      },
      {
        text: "强缓存和协商缓存"
      },
      {
        text: "IndexDB缓存"
      },
      {
        text: "网络状态"
      },
      {
        text: "对象存储"
      },
      {
        text: "RESTful API"
      },
      {
        text: "SSE流式传输"
      },
      {
        text: "OAuth2.0授权流程"
      },
      {
        text: "PWA简单介绍"
      },
      {
        text: "GET和POST请求区别"
      }
    ]
  },
  {
    text: "Nginx",
    collapsed: false,
    items: [
      {
        text: "基本介绍"
      },
      {
        text: "常用命令"
      },
      {
        text: "部署项目和代理"
      },
      {
        text: "负载均衡策略"
      },
      {
        text: "History路由404问题"
      }
    ]
  }
];
// 导出左侧菜单栏的列表
export const transformNetworkList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(networkList, path, isFilterList, false);
};
