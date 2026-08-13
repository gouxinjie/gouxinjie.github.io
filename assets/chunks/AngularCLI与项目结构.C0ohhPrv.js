const n=`# Angular CLI 与项目结构

\`Angular CLI\` 是 \`Angular\` 官方提供的命令行工具，用于创建项目、生成代码、开发调试和构建发布。

## 一、CLI 基础命令

### 1. 安装与创建项目

\`\`\`bash
# 全局安装 Angular CLI
npm install -g @angular/cli

# 创建新项目
ng new my-app

# 创建时跳过交互（指定样式等）
ng new my-app --style=scss --routing --standalone
\`\`\`

### 2. 常用命令速查

| 命令                                    | 作用                           |
| --------------------------------------- | ------------------------------ |
| \`ng serve\`                              | 启动开发服务器（默认 4200 端口）|
| \`ng serve --port 4300 --open\`           | 指定端口并自动打开浏览器       |
| \`ng build\`                              | 构建生产版本（输出到 dist/）   |
| \`ng build --configuration=production\`   | 指定构建配置                   |
| \`ng test\`                               | 运行单元测试（Karma）          |
| \`ng lint\`                               | 运行代码检查                   |
| \`ng generate component xxx\`             | 生成组件                       |
| \`ng generate service xxx\`               | 生成服务                       |
| \`ng generate module xxx\`                | 生成模块                       |
| \`ng generate directive xxx\`             | 生成指令                       |
| \`ng generate pipe xxx\`                  | 生成管道                       |
| \`ng generate guard xxx\`                 | 生成路由守卫                   |
| \`ng generate interceptor xxx\`           | 生成拦截器                     |

> \`generate\` 可以简写为 \`g\`，例如 \`ng g c user\` 生成 \`UserComponent\`。

### 3. generate 的常用参数

\`\`\`bash
# 生成独立组件（默认）
ng g c user --standalone

# 生成到指定目录
ng g c user --path src/app/features

# 跳过生成测试文件
ng g c user --skip-tests

# 生成内联模板和内联样式
ng g c user --inline-template --inline-style
\`\`\`

## 二、项目目录结构

\`\`\`
my-app/
├── angular.json              # CLI 工作区与项目配置
├── package.json              # 依赖与脚本
├── tsconfig.json             # TypeScript 基础配置
├── src/
│   ├── index.html            # 单页入口 HTML
│   ├── main.ts               # 应用启动入口
│   ├── styles.scss           # 全局样式
│   ├── environments/
│   │   ├── environment.ts    # 开发环境配置
│   │   └── environment.prod.ts # 生产环境配置
│   └── app/
│       ├── app.component.ts  # 根组件
│       ├── app.config.ts     # 独立组件应用的全局配置
│       ├── app.routes.ts     # 根路由配置
│       └── features/         # 按业务拆分的特性目录
\`\`\`

### main.ts 启动入口

\`\`\`typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
\`\`\`

## 三、angular.json 关键配置

\`angular.json\` 是 CLI 的核心配置，定义了构建、开发服务器、测试等选项：

\`\`\`json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "configurations": {
            "production": {
              "budgets": [{ "type": "initial", "maximumWarning": "500kb" }]
            },
            "development": {}
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": { "buildTarget": "my-app:build:production" }
          }
        }
      }
    }
  }
}
\`\`\`

常用配置点：

- \`budgets\`：包体积预算，超过会告警/报错
- \`styles\` / \`scripts\`：全局样式和脚本入口
- \`assets\`：静态资源目录
- \`configurations\`：多环境构建配置

## 四、环境配置与代理

### 1. 环境变量

开发/生产环境使用不同的配置文件：

\`\`\`typescript
// environments/environment.ts（开发）
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api"
};
\`\`\`

\`\`\`typescript
// environments/environment.prod.ts（生产）
export const environment = {
  production: true,
  apiUrl: "https://api.example.com"
};
\`\`\`

使用时直接导入：

\`\`\`typescript
import { environment } from "../../environments/environment";

const url = \`\${environment.apiUrl}/users\`;
\`\`\`

### 2. 开发代理解决跨域

在 \`proxy.conf.json\` 中配置代理，避免开发时跨域：

\`\`\`json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
\`\`\`

启动时指定代理配置：

\`\`\`bash
ng serve --proxy-config proxy.conf.json
\`\`\`

也可以在 \`angular.json\` 的 \`serve\` 配置中默认指定：

\`\`\`json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
\`\`\`

## 五、常用构建优化

\`\`\`bash
# 查看构建产物分析
ng build --stats-json

# 开启压缩与 tree-shaking（生产默认开启）
ng build --configuration=production

# 指定 base-href（部署到子路径时）
ng build --base-href /my-app/
\`\`\`

## 六、常见问题解答

**Q1：\`ng serve\` 和 \`ng build\` 有什么区别？**

- \`ng serve\`：开发模式，开启热更新，不输出生产文件
- \`ng build\`：构建生产/开发产物到 \`dist/\` 目录，用于部署

**Q2：如何创建组件到指定业务目录？**

\`\`\`bash
ng g c user --path src/app/features/user
\`\`\`

**Q3：独立组件应用还有 AppModule 吗？**

- \`Angular 15+\` 默认使用独立组件，没有 \`AppModule\`，改用 \`app.config.ts\` + \`bootstrapApplication\`。但 \`NgModule\` 仍被支持。

**Q4：生产构建如何开启 AOT 和压缩？**

- \`ng build --configuration=production\` 默认开启 AOT（提前编译）、代码压缩和 tree-shaking。
`;export{n as default};
