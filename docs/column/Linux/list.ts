import { transformMenuList } from "../../utils/functions";

const linuxList = [
  {
    text: "基础入门",
    collapsed: false,
    items: [
      { text: "Linux 简介与常见发行版" },
      { text: "目录结构与基础命令" },
      { text: "文件权限与用户管理" },
      { text: "包管理器使用 apt、yum" },
      { text: "环境变量与软硬链接" }
    ]
  },
  {
    text: "系统管理",
    collapsed: false,
    items: [
      { text: "进程管理（ps、top、kill）" },
      { text: "systemd 服务管理" },
      { text: "定时任务（cron）" },
      { text: "磁盘与文件系统管理" },
      { text: "系统日志查看" }
    ]
  },
  {
    text: "网络与安全",
    collapsed: false,
    items: [
      { text: "网络常用命令" },
      { text: "防火墙基础" },
      { text: "SSH 使用与免密登录" }
    ]
  },
  {
    text: "Shell 与实战",
    collapsed: false,
    items: [
      { text: "Bash 基础与脚本入门" },
      { text: "grep / sed / awk 文本处理" },
      { text: "常用排查与部署脚本实践" }
    ]
  }
];

export const transformLinuxList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(linuxList, path, isFilterList);
};
