import { transformMenuList } from "../../utils/functions";

// 网络相关模块
const networkList = [
  {
    text: "网络基础",
    collapsed: false,
    items: [
      { text: "OSI七层网络模型详解" },
      { text: "TCP-IP协议和三次握手" },
      { text: "浏览器输入URL发生了什么" },
      { text: "本地开发端口原理" },
      { text: "网络常用命令集锦" }
    ]
  },

  {
    text: "网络通信与传输",
    collapsed: false,
    items: [
      { text: "HTTP基础讲解" },
      { text: "HTTP1.1和HTTP2" },
      { text: "HTTPS(TSL和SSL)" },
      { text: "GET和POST请求区别" },
      { text: "CDN内容分发网络" },
      { text: "强缓存和协商缓存" },
      { text: "Fetch请求和Ajax" },
      { text: "RESTful API设计规范" },
      { text: "对象存储服务讲解" },
      { text: "客户端数据库IndexedDB" },
      { text: "获取网络状态" },
      { text: "SSE流式传输" }
    ]
  },

  {
    text: "安全与数据上报",
    collapsed: false,
    items: [
      { text: "XSS跨站脚本攻击与防御" },
      { text: "跨域原理解决方案" },
      { text: "JWT与Cookie讲解" },
      { text: "数字证书简述" },
      { text: "添加埋点方式和原理" },
      { text: "sendBeacon可靠上报" },
      { text: "OAuth2.0授权流程" }
    ]
  },

  {
    text: "工具与抓包分析",
    collapsed: false,
    items: [{ text: "Wireshark抓包分析实战" }, { text: "Ngrok内网穿透配置" }]
  }
];

// 导出左侧菜单栏的列表
export const transformNetworkList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(networkList, path, isFilterList, false);
};
