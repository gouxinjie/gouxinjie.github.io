import { transformMenuList } from "../../utils/functions";

// python模块相关
const pythonList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "基础语法入门"
      },
      {
        text: "常用内置模块"
      },
      {
        text: "Env环境变量管理"
      },
      {
        text: "Pip包管理工具"
      },
      {
        text: "类型注解详解"
      },
      {
        text: "__name__与__main__"
      },
      {
        text: "导入导出模块化"
      },
      {
        text: "Async异步编程"
      },
      {
        text: 'With语句详解'
      }
    ]
  },
  {
    text: "进阶",
    collapsed: false,
    items: [
      {
        text: "Web框架FastAPI"
      },
      {
        text: "typing"
      },
      {
        text: "requests"
      },
      {
        text: 'sqlalchemy'
      }
    ]
  }
];

export const transformPythonList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(pythonList, path, isFilterList);
};


// FastAPI + SQLAlchemy 完整实战
// FastAPI + JWT 登录鉴权
// FastAPI vs Next.js API Routes 深度对比

// 1. 核心框架：FastAPI 全栈开发
// 依赖注入系统 (Depends)：深入浅出 FastAPI 的 Depends 机制——如何优雅地管理数据库连接和用户鉴权。
// 自动化文档：从代码到 Swagger UI——FastAPI 如何利用类型提示实现零配置的交互式文档。
// 异步编程基础：在 FastAPI 中使用 async/await 的最佳实践（虽然本项目中多为同步 IO，但这是核心卖点）。
// 2. 数据库与 ORM：SQLAlchemy 2.0 深度实践
// SQLAlchemy 2.0 现代语法：告别旧版用法，体验从 Query 到 Select 的演进。
// 数据库初始化与迁移：编写鲁棒的初始化脚本——如何处理 Unknown Database 错误并一键构建表结构。
// 软删除逻辑实现：如何在 ORM 层实现逻辑删除 (is_delete) 而非物理删除。
// 3. 数据校验与契约：Pydantic 2.0
// 模型驱动开发：使用 Pydantic 定义 API 输入输出 (Schemas)——告别手动的数据格式转换。
// 环境变量管理：利用 Pydantic-settings 轻松读取
// .env
//  配置。
// 代码解耦技巧：如何通过 Pydantic 过滤掉敏感字段（如密码）并安全返回给前端。
// 4. 安全与鉴权：OAuth2 & JWT
// JWT 鉴权全流程：从登录获取 Token 到验证中间件的完整链路实现。
// 密码安全哈希：为什么不要明文存储密码？使用 Passlib (Bcrypt) 的安全性分析。
// 权限保护装饰器：如何保护你的 API 路由——确保用户只能操作属于自己的数据。
// 5. Python 工程化与进阶语法
// 类型提示 (Type Hinting)：Python 3.9+ 类型提示在大型项目中的重要性——如何提高代码的可读性与健壮性。
// 模块化项目结构：如何组织一个干净的 Python 后端目录（API, Models, Schemas, Core）。
// 脚本化运维：利用 sys.path 和 __file__ 编写与安装路径无关的独立工具脚本。
// 6. 跨域与 Web 部署
// CORS 跨域全解析：解决前端调试时的 Cross-Origin 报错——FastAPI 中间件配置。
// Uvicorn 工作原理：ASGI 服务器与传统 WSGI 的区别，以及如何在生产环境中运行 Python Web 应用。
