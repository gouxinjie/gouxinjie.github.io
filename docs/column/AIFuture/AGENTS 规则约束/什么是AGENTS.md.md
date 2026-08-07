
# 别再让 AI 瞎写代码了！一篇搞懂什么是 AGENTS.md


![](../images/agentmd.png)

如果你经常使用 Cursor、Claude Code、GitHub Copilot 或 CodeBuddy 等 AI 编程助手，大概率遇到过这些让人头疼的场景：

* **乱改依赖**：明明项目用的是 `pnpm`，AI 偏要执行 `npm install`，生成一堆 `package-lock.json`；
* **风格脱节**：项目要求全量使用 TypeScript + React 函数式组件，AI 却给你抛出一段 Class 组件或含 `any` 的代码；
* **破坏边界**：让它加个小功能，它顺手把你的 `.env` 删了或者把数据库 Migration 改得乱七八糟；
* **无限幻觉**：修改完代码不自动跑单测，直接告诉你“改好了”，结果一运行全是报错。

为了解决这些“AI 缺乏项目上下文”的痛点，开源社区和 AI 领域开始逐渐形成一个通用的约定——**`AGENTS.md`**。


## 一、 什么是 AGENTS.md？

一句话解释：**`README.md` 是写给人类开发者看的项目说明书，而 `AGENTS.md` 就是写给 AI 编程助手看的“入职手册”和“行为法典”。**

随着各种 AI Agent 深度参与到软件开发中，我们需要一种标准化的方式来告诉 AI：“在这个仓库里，你需要遵循什么规则，用什么工具，哪些能做，哪些绝对不能触碰。”

`AGENTS.md` 通常放在项目的**根目录下**，本质上是一个纯文本 Markdown 文件。当 AI 助手（Agent）进入你的项目上下文时，系统会自动读取这个文件，并将其转化为约束 AI 行为的全局系统提示词（System Instructions）。


## 二、 它能解决什么问题？

简单来说，`AGENTS.md` 为 AI 建立了明确的**行为边界（Guardrails）**与**作业标准（Definition of Done）**：

### 1. 明确红线与禁区（Hard Rules）

在配置文件中显式写明“绝对不能做的事”。例如：

* 严禁修改环境变量文件 (`.env*`)；
* 未经人类确认，不得引入新的第三方依赖；
* 修改 API 接口前必须先提问。

### 2. 锁定统一的技术规范与风格（Code Style & Tech Stack）

无需每次对话都重复提醒 AI 项目的技术栈。你可以在里面约定：

* 包管理器：统一使用 `pnpm`；
* 代码风格：错误处理必须显式返回 `Result` 类型，不盲目使用 `try-catch`；
* 组件规范：只使用 Tailwind CSS，禁止内联样式。

### 3. 自动化校验与完成标准（Commands & Verification）

告诉 AI“代码写完不代表任务完成”，指导它主动跑测试：

* 写完代码后，必须自动运行 `pnpm typecheck` 和 `pnpm test`；
* 只有当 Exit Code 为 0 时，才算真正完成任务。


## 三、 实战示例：一个标准的 AGENTS.md 长什么样？

下面是一个可直接参考的项目级 `AGENTS.md` 模板：

```markdown
# Agent Operational Policy & Rules

## 1. 核心边界与禁区 (Hard Rules)
- 【绝对禁止】未经许可，不得修改 `.env` 或任何包含敏感凭证的文件。
- 【绝对禁止】未经许可，不得在 `package.json` 中添加全新的第三方依赖。
- 【提问触发】在修改任何 API 路由逻辑或数据库 Schema 前，必须先向开发者提问确认。

## 2. 技术栈与技术规范 (Tech Stack & Style)
- **包管理器**：必须使用 `pnpm`，严禁使用 `npm` 或 `yarn`。
- **框架**：Next.js (App Router) + TypeScript (Strict Mode) + Tailwind CSS。
- **代码风格**：
  - 优先使用异步函数 (`async/await`)。
  - 所有导出的函数必须有明确的 TypeScript 类型定义，禁止使用 `any`。

## 3. 验证与完成标准 (Definition of Done)
每次提交代码或回答“已完成”之前，必须按顺序执行以下命令进行自我验证：
1. `pnpm typecheck` - 确保没有类型错误。
2. `pnpm lint` - 确保符合代码风格规范。
3. `pnpm test` - 确保现有单元测试全部通过。

如果上述命令报错，请先自我修复报错，直到全部通过为止。

```


## 四、 为什么说它正在成为未来的开放标准？

在过去，不同的 AI 工具各有各的规则文件：

* Cursor 使用 `.cursorrules`
* Claude Code 使用 `CLAUDE.md`
* GitHub Copilot / Windsurf 也各有专有配置

这种碎片的生态导致项目维护极其繁琐。而 **`AGENTS.md`** 正逐渐演变为一个**跨平台、通用的开放标准**。无论团队里的成员用的是什么 AI 编程工具，只要仓库根目录下存在 `AGENTS.md`，各大 Agent 工具就能读取同一套规矩，实现人机协作协同的无缝对接。

## 五、怎么使用 AGENTS.md？

直接在项目根目录创建 `AGENTS.md` 文件即可。 AI编辑器（如 Cursor、Trae）会自动识别并加载它。

除非你主动关闭，如下图（trae关闭）：

![trae关闭AGENTS.md](../images/agents-1.png)

然后就可以在 AI 编辑器中使用它了。下面我会提供我常用的 `AGENTS.md` 模板。

## 六、我的 AGENTS.md 常用模板

我的常用模板：见

[前端专用AGENTS.md模板](/column/AIFuture/AGENTS%20规则约束/前端专用AGENTS.md模板)

[后端专用AGENTS.md模板](/column/AIFuture/AGENTS%20规则约束/后端专用AGENTS.md模板)
