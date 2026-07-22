import { transformMenuList } from "../../utils/functions";

const aliyunList = [
  {
    text: "核心概念",
    collapsed: false,
    items: [
      { text: "阿里云 ECS 入门介绍" },
      { text: '阿里云的容器镜像服务讲解' },
      { text: '阿里云安全组和服务器防火墙' },
      { text: "为什么前端项目部署需要nginx" },
      { text: "GitHub Actions 核心概念详解" },
      { text: "PM2在Next项目部署中的作用" },
      { text: 'SQLite 和 better-sqlite3介绍' },
      { text: '为什么使用 Docker 镜像' }
    ]
  },
  {
    text: "实战部署",
    collapsed: false,
    items: [
      { text: "VitePress博客自动部署到ECS" },
      { text: "Next项目自动部署到ECS-初始版" },
      { text: "Next项目自动部署到ECS-优化版" },
      { text: 'Nuxt项目自动部署到ECS' },
      { text: 'ECS+Nginx配置二级域名与多项目部署实战' },
      { text: 'PythonWeb项目发布到ECS实战' },
      { text: 'React+Node+SQLite项目自动发布到ECS实战-git看板' },
      { text: 'Next.js+SQLite项目自动部署到ECS全流程' },
      { text: 'React+Node+SQLite项目自动发布到ECS实战-天气看板' },
      { text: 'Next项目+Docker自动部署到ECS实战-个人站点' }

    ]
  },
  {
    text: '踩坑记录',
    collapsed: false,
    items: [
      { text: 'ECS中通过SSH克隆GitHub仓库' },
    ]
  }
];

export const transformAliyunList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aliyunList, path, isFilterList);
};
