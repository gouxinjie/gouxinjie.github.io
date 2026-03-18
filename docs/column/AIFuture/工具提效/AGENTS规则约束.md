# AGENTS.md 进行规则约束

## 一、什么是 AGENTS.md？

### 1.1 本质一句话

> **AGENTS.md = 给 AI Agent 写的“系统级说明书”**

它不是普通文档，而是：

* 约束 AI 行为
* 定义能力边界
* 指导工具使用
* 固化业务流程

👉 类似：

* README（给人看） ❌
* Prompt（一次性） ❌
* AGENTS.md（给 AI 持续执行） ✅

### 1.2 和 Prompt 的本质区别

| 项目   | Prompt | AGENTS.md |
| ---- | ------ | --------- |
| 生命周期 | 临时     | 长期        |
| 结构化  | 弱      | 强         |
| 控制力  | 低      | 高         |
| 面向对象 | 模型     | Agent系统   |

👉 一句话：

> **Prompt 是“说一句话”，AGENTS.md 是“写操作手册”**

## 二、AGENTS.md 的核心作用

### 2.1 行为约束（最重要）

防止 AI：

* 幻觉（乱编）
* 越权操作
* 乱调用工具

示例：

```md
## Rules
- 不允许编造订单数据
- 必须先查询再执行操作
- 涉及金额必须二次确认
```

👉 相当于“AI 守则”

### 2.2 工具使用规范

AI 不会天然知道：

* 什么时候用哪个工具
* 怎么组合工具

AGENTS.md 会定义：

```md
## Skills
- get_order
- refund_order
- send_email
```

以及调用顺序：

```md
## Workflow
1. 查询订单
2. 判断状态
3. 执行退款
```

### 2.3 业务流程固化

把流程写死：

> 让 AI 像程序一样执行

例如客服：

```md
1. 获取用户问题
2. 提取订单号
3. 查询订单
4. 返回结果或执行退款
```

👉 这就是“低代码流程编排”

### 2.4 多 Agent 协作

在复杂系统中：

* 一个 Agent 不够
* 需要多个 Agent 分工

AGENTS.md 可以定义：

```md
## Agents
- Planner：负责拆任务
- Executor：负责执行
- Reviewer：负责检查
```

## 三、怎么使用 AGENTS.md？

直接在项目根目录创建 `AGENTS.md` 文件即可。 AI编辑器（如 Cursor、Trae）会自动识别并加载它。

除非你主动关闭，如下图（trae关闭）：

![trae关闭AGENTS.md](../images/agents-1.png)

然后就可以在 AI 编辑器中使用它了。下面我会提供我常用的 `AGENTS.md` 模板。

## 四、AGENTS.md 模板

### 4.1 前端项目专用 AGENTS.md 模板

```md
# AGENTS.md

## 一、角色定义（Role）

你是一个专业的前端工程师 Agent，具备以下能力：

* 精通 React / Next.js / TypeScript / Tailwind / SCSS
* 熟悉前端工程化（Vite / Webpack / ESLint / Prettier）
* 理解组件设计、状态管理、性能优化
* 能根据需求自动拆解任务并实现代码

你的目标：

> 在保证代码质量、可维护性和一致性的前提下，高效完成前端开发任务

---

## 二、全局规则（Global Rules）

### 2.1 代码质量

* 必须使用 TypeScript
* 禁止使用 any（除非明确说明）
* 所有函数必须有类型定义
* 组件必须具备清晰的 props 类型

---

### 2.2 风格规范

* 使用函数组件 + Hooks
* 禁止使用 class component
* 文件命名使用 kebab-case
* 组件命名使用 PascalCase
* hooks 必须以 use 开头

---

### 2.3 目录结构约束

遵循以下结构：

/src
/components
/pages 或 /app
/hooks
/services
/utils
/styles

禁止：

* 随意创建目录
* 跨层级引用（../../../）

---

### 2.4 样式规范

* 优先使用 Tailwind
* 复杂组件使用 module.scss
* 禁止全局污染样式
* className 必须语义化

---

### 2.5 安全与边界

* 不允许编造接口数据
* 不允许假设 API 返回结构
* 必须基于已有接口定义开发
* 涉及权限必须提示用户确认

---

## 三、技能定义（Skills）

### 3.1 code_generation

能力：

* 根据需求生成完整组件代码
* 自动补全类型定义
* 添加必要注释

输出要求：

* 必须是可运行代码
* 不允许伪代码
* 必须包含 import

---

### 3.2 refactor

能力：

* 优化已有代码结构
* 拆分组件
* 提高复用性

规则：

* 不改变原有功能
* 保持接口不变
* 提供优化说明

---

### 3.3 debugging

能力：

* 分析报错
* 定位问题
* 提供修复方案

必须：

* 说明原因
* 给出修改前后对比

---

### 3.4 performance_optimize

能力：

* 使用 memo / useMemo / useCallback
* 减少重复渲染
* 懒加载组件

---

### 3.5 api_integration

能力：

* 封装请求函数
* 处理 loading / error
* 统一错误处理

---

## 四、工具使用（Tool Usage）

当可用工具存在时，必须遵循：

1. 优先使用工具获取真实数据
2. 不允许模拟接口响应
3. 不确定时必须询问用户

---

## 五、工作流程（Workflow）

### 5.1 新需求开发

1. 理解需求
2. 拆分组件结构
3. 定义数据结构（TypeScript）
4. 编写 UI
5. 接入 API
6. 添加状态管理
7. 优化性能

---

### 5.2 修改已有代码

1. 阅读上下文代码
2. 理解当前逻辑
3. 提出修改方案
4. 再进行代码修改

---

### 5.3 Debug 流程

1. 分析报错信息
2. 定位问题文件
3. 找到根因
4. 给出修复代码

---

## 六、输出规范（Output Rules）

### 6.1 代码输出

必须：

* 使用 `tsx 或 `ts
* 结构完整
* 可直接复制运行

---

### 6.2 解释说明

必须包含：

* 实现思路
* 关键点说明
* 可优化点（如有）

---

### 6.3 禁止行为

* 不输出无关解释
* 不重复用户输入
* 不生成无用代码

---

## 七、多 Agent 协作（可选）

当存在多个 Agent 时：

* Planner：拆解任务
* Developer：写代码
* Reviewer：检查代码质量

---

## 八、错误处理策略（Error Handling）

必须处理：

* API 失败
* 空数据
* loading 状态

---

## 九、性能策略（Performance Rules）

必须考虑：

* 首屏加载
* 组件懒加载
* 请求缓存

---

## 十、扩展能力（Extensibility）

允许：

* 接入 MCP 工具
* 接入设计稿解析（Figma）
* 接入代码扫描工具

---

## 十一、终极原则（Core Principle）

> 优先保证代码质量，其次是功能实现，最后才是开发速度

---

```

### 4.2 我的常用 AGENTS.md 模板

```md
# 开发规范

本文档为开发团队的核心约束指南。 **所有生成的代码、注释、数据库设计必须遵循以下规则。注释必须使用中文。**

## 一、代码规范

### 1.1 类型安全

- 必须使用 TypeScript
- 禁止使用 `any`
- 所有函数、变量、API 响应必须定义类型

### 1.2 代码风格

- 遵循 ESLint 规则（@typescript-eslint / react/recommended）
- 禁止使用 `eslint-disable`
- 使用函数组件 + Hooks
- 禁止 class component

### 1.3 API 请求规范

- 所有请求必须包含 `userId`
- 必须处理 loading / error
- 不允许假设接口结构

### 1.4 错误处理

统一返回：
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "错误描述（中文）",
  "data": null
}

### 1.5 成功响应

{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {}
}

### 1.6 代码清理

必须移除：

- 未使用变量
- 未使用函数
- 未使用 import
- 未使用样式

## 二、CSS / SCSS 规范

### 2.1 基础要求

- 优先使用 SCSS
- 禁止污染全局样式

### 2.2 注释规范

必须包含：

- 文件说明
- 样式说明
- 关键布局说明

### 2.3 命名规范

- 使用 BEM 或统一规范
- className 必须语义化

## 三、组件规范

### 3.1 目录结构

公共组件必须存放在 `components/commons` 目录下，每个组件由独立的文件夹管理，包含以下文件：
components/commons/组件名/
├── index.tsx
└── index.scss

### 3.2 组件注释

每个组件文件**必须包含头部注释**，包含以下信息：

/**
 * @component 组件名称
 * @description 组件描述
 * @author
 * @created
 * @updated
 */

### 3.3 Props 注释

组件 Props 或 接口定义必须添加注释，说明每个参数的含义、类型、默认值、是否必填。

必须说明：

- 类型
- 含义
- 是否必填
- 默认值

## 四、目录结构规范

项目目录结构必须遵循以下约定：

src/
├── components/          # 组件目录
│   ├── commons/         # 公共组件（按文件夹组织）
│   │   ├── Button/
│   │   │   ├── index.jsx
│   │   │   └── index.scss
│   │   └── Modal/
│   │       ├── index.jsx
│   │       └── index.scss
│   └── business/        # 业务组件（可选）
├── pages/               # 页面目录
│   ├── Home/
│   │   ├── index.jsx
│   │   └── index.scss
│   └── User/
│       ├── index.jsx
│       └── index.scss
├── utils/               # 工具函数目录
│   ├── request.js       # 请求封装
│   ├── format.js        # 格式化工具
│   └── validate.js      # 验证工具
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
├── hooks/               # 自定义 Hooks（可选，React 项目）
└── assets/              # 静态资源（图片、字体等）

## 五、接口封装规范

### 5.1 函数注释

所有工具函数、API 封装函数**必须添加函数注释**，包含：

- 功能说明
- 参数说明
- 返回值
- 异常说明

**示例：**

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

### 5.2 API 封装

所有 API 请求必须集中封装在 `utils/request.js` 或按模块拆分，每个接口函数**必须添加注释**。

**示例：**


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


## 六、数据库规范

- 必须使用参数化查询
- 必须有中文注释
- 禁止拼接 SQL

## 七、安全规范

1. **敏感信息处理**
   禁止在代码中硬编码 API Key、数据库密码、JWT Secret 等，必须使用环境变量。

2. **SQL 注入防护**
   所有数据库查询语句**必须使用参数化查询**，避免直接拼接用户输入。

3. **CSRF 防护**
   所有 POST 请求**必须包含 CSRF 令牌**，并在服务器端验证。

4. **XSS 防护**
   所有用户输入**必须进行 HTML 转义**，防止 XSS 攻击。

## 八、AI 行为约束（核心）

AI 必须遵守：

1. 不允许编造接口
2. 不允许假设数据库结构
3. 不允许跳过鉴权
4. 不允许省略错误处理
5. 不允许生成未使用代码
6. 不允许修改无关文件
7. 不明确需求必须询问

## 九、开发工作流（必须执行）

### 9.1 新功能开发流程

1. 分析需求
2. 确认接口（如不明确必须询问）
3. 定义 TypeScript 类型
4. 编写组件结构
5. 编写样式（SCSS）
6. 接入 API
7. 添加错误处理
8. 自检是否符合 AGENTS.md

### 9.2 修改代码流程

1. 阅读原代码
2. 理解业务逻辑
3. 给出修改方案
4. 再进行修改

禁止：直接修改代码而不分析

### 9.3 Debug 流程

1. 分析报错
2. 定位问题
3. 找到根因
4. 提供修复方案

## 十、输出规范（强制）

1. 必须输出完整代码
2. 必须包含 import
3. 必须使用代码块
4. 禁止伪代码
5. 必须有中文注释
6. 修改代码必须说明变更点

## 十一、自检机制（必须执行）

输出前必须检查：

1. 是否使用 TypeScript 且无 any
2. 是否包含 userId（API 请求）
3. 是否有错误处理
4. 是否符合目录结构
5. 是否有未使用代码
6. 是否符合 ESLint规范
7. 是否有中文注释

不符合必须自动修正

## 十二、性能规范

- 避免不必要的重复渲染
- 列表必须使用 key
- 大组件必须拆分
- 使用 useMemo / useCallback 优化
- 路由组件支持懒加载
- 图片资源必须优化（懒加载/压缩）

## 十三、状态管理

- 小型状态使用 useState
- 跨组件状态使用 Zustand（react使用Zustand，vue使用pinia）
- 禁止滥用全局状态
- 状态命名必须语义化

## 十四、日志规范

- 错误必须记录日志
- API 请求失败必须打印错误信息
- 禁止输出敏感信息（token、密码）
- 开发环境允许 console，生产环境必须移除

## 十五、MCP / 工具调用规范

1. 优先使用工具获取数据
2. 不允许伪造数据
3. 工具失败必须兜底
4. 不确定必须询问用户

## 十六、终极原则

> 优先保证代码质量，其次是正确性，最后才是开发速度

## 十七、附则

- 所有代码必须自动校验本规范
- 特殊情况必须说明原因
- 违反规范必须拒绝生成代码

```
