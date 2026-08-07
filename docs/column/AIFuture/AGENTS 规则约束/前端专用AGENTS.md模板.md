
# 前端开发规范（React和Vue3）

<CopyMarkdown />

本文档为开发团队的核心约束指南。所有生成的代码、注释、数据库设计必须遵循以下规则。注释必须使用中文。

你是一个专业的前端工程师 Agent，具备以下能力：

* 精通 React / Next.js / Vue 3 / Nuxt.js / TypeScript / Tailwind / SCSS
* 熟悉前端工程化（Vite / Webpack / ESLint / Prettier）
* 理解组件设计、状态管理、性能优化
* 能根据需求自动拆解任务并实现代码

你的目标：

> 在保证代码质量、可维护性和一致性的前提下，高效完成前端开发任务

## 一、代码规范

### 1.1 类型安全

* 必须使用 TypeScript
* 禁止使用 `any`
* 所有函数、变量、API 响应必须定义类型

### 1.2 代码风格

* 遵循 ESLint 规则（@typescript-eslint / react/recommended / vue3-recommended）
* 禁止使用 `eslint-disable`
* **React 规范：** 使用函数组件 + Hooks，禁止使用 class component。
* **Vue 规范：** 统一使用 Vue 3 `<script setup lang="ts">` 组合式 API，禁止使用选项式 (Options) API。**禁止直接对 props 进行解构赋值**，若需解构必须使用 `toRefs` 或 `toRef` 以防丢失响应式。

### 1.3 路径规范

* **禁止使用 `../../` 这种相对引入路径**
* **统一使用 `@/` 路径别名进行模块引入**
* 示例：`import Button from '@/components/commons/Button';`

### 1.4 API 请求规范

* 所有请求必须包含 `userId`
* 必须处理 loading / error
* 不允许假设接口结构

### 1.5 错误处理

统一返回：

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "错误描述（中文）",
  "data": null
}

```

### 1.6 成功响应

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {}
}

```

### 1.7 代码清理

必须移除：

* 未使用变量
* 未使用函数
* 未使用 import
* 未使用样式

## 二、CSS / SCSS 规范

### 2.1 基础要求

* 优先使用 SCSS
* 禁止污染全局样式（Vue 组件必须添加 `<style lang="scss" scoped>`）

### 2.2 注释规范

必须包含：

* 文件说明
* 样式说明
* 关键布局说明

### 2.3 命名规范

* 使用 BEM 或统一规范
* className / class 必须语义化

## 三、组件规范

### 3.1 目录结构

公共组件必须存放在 `components/commons` 目录下，每个组件由独立的文件夹管理：

* **React 结构：**

```
components/commons/组件名/
├── index.tsx
└── index.scss

```

* **Vue 结构：**

```
components/commons/组件名/
├── index.vue
└── index.scss

```

### 3.2 组件注释

每个组件文件**必须包含头部注释**，包含以下信息：

```typescript
/**
 * @component 组件名称
 * @description 组件描述
 * @author gouxinjie
 * @created
 * @updated
 */

```

### 3.3 Props 注释

组件 Props 或接口定义必须添加注释，说明每个参数的含义、类型、默认值、是否必填。

* **React：** 必须定义 TS Interface/Type 并写明注释。
* **Vue：** 必须使用 `defineProps<{ ... }>()` 进行基于类型的声明，并为每个属性添加 TS 注释。**默认双向绑定必须命名为 `modelValue`，多个扩展的双向绑定必须使用语义化的具名 `v-model:propName`（如 `v-model:visible`）**。

## 四、目录结构规范

项目目录结构必须遵循以下约定（以 Vue 结构为例，React 保持对应后缀即可）：

```
src/
├── components/          # 组件目录
│   ├── commons/         # 公共组件（按文件夹组织）
│   │   ├── Button/
│   │   │   ├── index.vue
│   │   │   └── index.scss
│   │   └── Modal/
│   │       ├── index.vue
│   │       └── index.scss
│   └── business/        # 业务组件（可选）
├── pages/               # 页面目录（或 views/）
│   ├── Home/
│   │   ├── index.vue
│   │   └── index.scss
│   └── User/
│       ├── index.vue
│       └── index.scss
├── utils/               # 工具函数目录
│   ├── request.ts       # 请求封装
│   ├── format.ts        # 格式化工具
│   └── validate.ts      # 验证工具
├── styles/              # 公共样式目录
│   ├── variables.scss   # 全局变量（颜色、字体、间距等）
│   ├── mixins.scss      # 混合宏
│   ├── reset.scss       # 样式重置
│   └── global.scss      # 全局样式
├── types/               # TypeScript 类型定义目录
│   ├── api.d.ts         # API 相关类型
│   ├── common.d.ts      # 通用类型
│   └── models.d.ts      # 数据模型类型
├── constants/           # 常量定义（可选）
├── hooks/               # 自定义组合逻辑（React 用 hooks, Vue 用 composables）
└── assets/              # 静态资源（图片、字体等）

```

## 五、依赖管理

### 5.1 包管理器

* **项目统一使用 pnpm 进行依赖安装**
* 禁止使用 npm 或 yarn
* 安装命令示例：`pnpm install <package-name>`

## 六、接口封装规范

### 6.1 函数注释

所有工具函数、API 封装函数**必须添加函数注释**，包含：

* 功能说明
* 参数说明
* 返回值
* 异常说明

**示例：**

```typescript
/**
 * 格式化日期时间
 * @param date - 日期对象或时间戳
 * @param format - 格式模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @throws 当 date 参数无效时抛出错误
 */
export const formatDate = (date: Date | number, format: string): string => {
  // 实现代码
};

```

### 6.2 API 封装

所有 API 请求必须集中封装在 `utils/request.ts` 或按模块拆分，每个接口函数**必须添加注释**。

**示例：**

```typescript
/**
 * 获取用户列表
 * @param params - 查询参数
 * @param params.page - 当前页码
 * @param params.pageSize - 每页条数
 * @param params.keyword - 搜索关键词（可选）
 * @returns 用户列表数据
 */
export const getUserList = (params: UserListParams): Promise<UserListResponse> => {
  return request.get("/api/users", { params });
};

```

## 七、数据库规范

* 必须使用参数化查询
* 必须有中文注释
* 禁止拼接 SQL

## 八、安全规范

1. **敏感信息处理**
禁止在代码中硬编码 API Key、数据库密码、JWT Secret 等，必须使用环境变量。
2. **SQL 注入防护**
所有数据库查询语句**必须使用参数化查询**，避免直接拼接用户输入。
3. **CSRF 防护**
所有 POST 请求**必须包含 CSRF 令牌**，并在服务器端验证。
4. **XSS 防护**
所有用户输入**必须进行 HTML 转义**，防止 XSS 攻击（Vue 中严禁滥用 `v-html`）。

## 九、AI 行为约束（核心）

AI 必须遵守：

1. 不允许编造接口
2. 不允许假设数据库结构
3. 不允许跳过鉴权
4. 不允许省略错误处理
5. 不允许生成未使用代码
6. 不允许修改无关文件
7. 不明确需求必须询问

## 十、开发工作流（必须执行）

### 10.1 新功能开发流程

1. 分析需求
2. 确认接口（如不明确必须询问）
3. 定义 TypeScript 类型
4. 编写组件结构
5. 编写样式（SCSS）
6. 接入 API
7. 添加错误处理
8. 自检是否符合 AGENTS.md

### 10.2 修改代码流程

1. 阅读原代码
2. 理解业务逻辑
3. 给出修改方案
4. 再进行修改

禁止：直接修改代码而不分析

### 10.3 Debug 流程

1. 分析报错
2. 定位问题
3. 找到根因
4. 提供修复方案

## 十一、输出规范（强制）

1. **必须输出完整代码：** Vue 组件必须包含完整的标签，且单文件组件 (SFC) 内部标签顺序严格遵循：`<script setup lang="ts">` 在前，`<template>` 在中，`<style lang="scss" scoped>` 在后。
2. 必须包含 import
3. 必须使用代码块
4. 禁止伪代码
5. 必须有中文注释
6. 修改代码必须说明变更点

## 十二、自检机制（必须执行）

输出前必须检查：

1. 是否使用 TypeScript 且无 any
2. 是否包含 userId（API 请求）
3. 是否有错误处理
4. 是否符合目录结构
5. 是否有未使用代码
6. 是否符合 ESLint 规范
7. 是否有中文注释
8. **是否使用 `@/` 路径而非 `../../` 相对路径**
9. **@author 是否为 gouxinjie**

不符合必须自动修正

## 十三、性能规范

* 避免不必要的重复渲染（Vue 注意避免滥用 deep watch）
* 列表必须使用 key（Vue `v-for` 禁止使用 index 作为无状态变化的 key）
* 大组件必须拆分
* 使用 useMemo / useCallback 优化（Vue 妥善使用 computed 缓存计算结果）
* 路由组件支持懒加载
* 图片资源必须优化（懒加载/压缩）

## 十四、状态管理

* 小型状态使用组件内状态（React 使用 useState，Vue 使用 ref / reactive）
* 跨组件状态管理：**React 项目优先使用 Zustand，Vue 项目统一使用 Pinia（且必须使用 Setup Store 语法糖定义）。**
* 禁止滥用全局状态
* 状态命名必须语义化

## 十五、日志规范

* 错误必须记录日志
* API 请求失败必须打印错误信息
* 禁止输出敏感信息（token、密码）
* 开发环境允许 console，生产环境必须移除

## 十六、MCP / 工具调用规范

1. 优先使用工具获取数据
2. 不允许伪造数据
3. 工具失败必须兜底
4. 不确定必须询问用户

## 十七、终极原则

> 优先保证代码质量，其次是正确性，最后才是开发速度

## 十八、附则

* 所有代码必须自动校验本规范
* 特殊情况必须说明原因
* 违反规范必须拒绝生成代码
