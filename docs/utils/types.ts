/* types.ts */
export interface NavLink {
  /** 站点图标 */
  icon?: string | { svg: string };
  badge?:
    | string
    | {
        text?: string;
        type?: "info" | "tip" | "warning" | "danger";
      };
  /** 站点名称 */
  title: string;
  /** 站点名称 */
  desc?: string;
  /** 站点链接 */
  link: string;
}

export interface NavData {
  title: string;
  items: NavLink[];
}

export interface Project {
  /** 项目名称 */
  name: string
  /** 项目描述 */
  desc: string
  /** 访问地址 */
  url: string
  /** 技术栈标签 */
  tech: string[]
  /** 部署方式 */
  deploy: string
}
