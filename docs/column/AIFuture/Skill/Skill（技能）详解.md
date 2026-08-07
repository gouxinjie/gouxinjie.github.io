# Skill（技能）详解：从概念到发布

> 发布日期：2026-08-07
>
> 主题：CodeBuddy / Codex / Claude 等 AI 编程助手中的 Skill 机制

![](../images/skill.png)

## 一、什么是 Skill

**Skill（技能）** 是 AI 编程助手的一种"扩展能力系统"，本质上是给 AI 提供的一份 **"专业培训手册 + 工作流模板"**。

它把某个特定领域的最佳实践、操作流程、参考文档封装成一个**可复用的模块**，让通用模型在处理该领域任务时表现得像专家。

举个直白的类比：

> 一个通用 AI 助手好比一个"什么都会一点的多面手"；
> Skill 则像给它发了一张"专科医生执业证"——遇到对应的病症时，它就知道该按什么流程检查、关注哪些要点、输出什么格式的结果。

### 与 Slash Command（斜杠命令）的区别

| | Slash Command | Skill |
|---|---|---|
| 触发方式 | 用户**手动**输入 `/xxx` | AI **根据任务自动识别**并调用（也可手动触发） |
| 使用场景 | 固定、重复的操作 | 需要按需加载的专业能力 |
| 资源消耗 | 每次输入都执行 | 渐进式加载，按需读取 |


`codebuddy` 中skill的位置，其他AI编程工具也同理。

![](../images/skill-1.png)


## 二、Skill 的目录结构与文件格式

### 存放位置

Skill 必须放在约定的固定位置，否则不会被识别：

```
.codebuddy/skills/xxx-skill/    # 项目级（仓库根目录，可团队共享）
~/.codebuddy/skills/xxx-skill/  # 用户级（个人使用）
```

> 注意：Skill **不能**随便放在项目根目录。根目录放的是 `AGENTS.md`（项目全局指令），两者职责不同。

### 目录内部结构

一个 Skill 是独立目录，至少包含 `SKILL.md`：

```
release-docs/
├── SKILL.md          # 必填，核心文件
├── references/       # 参考资料/检查清单（可选）
├── scripts/          # 可执行脚本（可选）
├── examples/         # 示例输出（可选）
└── assets/           # 模板/静态资源（可选）
```

如图：

![](../images/skill-2.png)

### SKILL.md 文件格式

`SKILL.md` 由 **YAML Frontmatter（元数据）** + **Markdown 指令（正文）** 两部分组成。

**Frontmatter 常用字段：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 否 | 技能名称，默认取目录名 |
| `description` | 否 | **最重要**，帮助 AI 判断何时使用，要写清晰具体 |
| `allowed-tools` | 否 | 工具白名单，支持模式匹配，如 `Bash(git:*)` |
| `disable-model-invocation` | 否 | `true` 时仅可手动 `/skill-name` 触发 |
| `user-invocable` | 否 | `false` 时从 `/` 菜单隐藏 |
| `context` | 否 | `fork` 时在独立 subagent 上下文执行 |
| `agent` / `model` / `hooks` | 否 | 配合 `context: fork` 使用 |

**最小可用的 SKILL.md 示例：**

```markdown
---
name: pdf
description: PDF 文档解析和转换专家，可将 PDF 提取为 Markdown/HTML 等格式
allowed-tools: Read, Write, Bash, WebFetch
---

# PDF 处理专家
你是一个专业的 PDF 文档处理专家。

## 核心能力
- 提取 PDF 文本内容
- 转换 PDF 为 Markdown、HTML 等格式

## 工作流程
1. 读取文档
2. 提取内容
3. 输出转换结果
```


## 三、Skill 的调用过程

Skill 采用的是 **渐进式信息披露（Progressive Disclosure）** 机制，核心目的是**节约上下文窗口（token）**。整个调用分为三个阶段：

### 第 1 步：启动注册（只读元数据）

CodeBuddy 启动时扫描技能目录，对每个 Skill **只读取 Frontmatter 中的 `name` + `description`**，放入 AI 的"已知技能清单"。此时不读取正文，消耗极小的上下文。

### 第 2 步：按需加载（匹配触发）

当你在对话中提出任务时，AI 将你的需求与每个 Skill 的 `description` 进行匹配：

- 匹配 → 读取完整的 `SKILL.md` 正文，获得审查流程、维度、报告格式等指令
- 不匹配 → 不加载，节省上下文

**触发方式有两种：**
1. **自动触发**：AI 根据 `description` 判断任务相关，主动调用
2. **手动触发**：用户显式输入 `/skill-name` 或指名调用

### 第 3 步：运行时引用（按需读取参考资料）

执行任务时，AI 按 `SKILL.md` 的指引**按需打开** `references/` 等目录里对应的文件。比如审查前端代码就读 `frontend-checklist.md`。这些清单"用到才读"，不会在每次对话都加载。

### 调用过程总览（流程图）

下图完整展示了一次 Skill 调用的流程：

```text
┌─────────────────┐
│  用户提出任务    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 【阶段一：启动注册】                 │
│  CodeBuddy 扫描技能目录              │
│  只读取各 Skill 的 name + description│
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 【阶段二：按需加载】                 │
│  AI 匹配任务与 description          │
└────────┬─────────────┬──────────────┘
         │ 匹配        │ 不匹配
         ▼             ▼
┌──────────────────┐  ┌──────────────────────┐
│ 读取完整 SKILL.md │  │ 不加载该 Skill        │
│ 正文（流程/维度/ │  │ （节省上下文）        │
│ 报告格式等）     │  └──────────────────────┘
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 【阶段三：运行时引用】               │
│  按类型按需读取 references/ 清单     │
│  （如前端→frontend-checklist.md）   │
└────────┬────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  AI 执行审查/任务 │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 输出结构化结果    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      结束         │
└──────────────────┘
```

> 图中三个方框分别对应上文三个阶段：**阶段一 启动注册 → 阶段二 按需加载 → 阶段三 运行时引用**。可以看到 `references/` 只有在最后阶段、且匹配到对应类型时才被读取。

### 谁在"读取"？

需要澄清一个关键点：**不是某个固定程序在读取清单，而是 AI 模型（LLM）本身**。

`references/` 里的清单、`SKILL.md` 里的指令，本质都是**喂给模型的文本**。模型利用推理能力逐项核对、判断、生成报告。因此：

> 你补充清单 = 给 AI 更多审查依据；
> 清单只是"提词器"，最终判断靠模型的智能。


## 四、Skill 的发布与共享

发布方式取决于你想共享的范围：

### 1. 团队内共享（最简单）
把 `.codebuddy/skills/` 目录随代码仓库提交，团队成员 clone 后技能自动生效。

### 2. 个人分发
把 Skill 目录放到用户的 `~/.codebuddy/skills/`，或写个安装脚本。

### 3. 插件市场分发（最正式）
将 Skill 打包成插件发布到插件市场，可被更广范围的用户安装，且不受 `skillOverrides` 设置影响。

### 可见性管理（skillOverrides）

可在 settings 中配置控制 Skill 可见性，无需修改 SKILL.md：

| 值 | 对模型可见 | 在 `/` 菜单 |
|---|---|---|
| `on` | 名称 + 描述 | 是 |
| `name-only` | 仅名称 | 是 |
| `user-invocable-only` | 隐藏 | 是 |
| `off` | 隐藏 | 隐藏 |


## 五、最佳实践

### 写 SKILL.md 的建议

- **`description` 要具体**：❌ `处理文件` → ✅ `PDF 文档解析和转换专家...`
- **提供详细的核心能力、工作流程、工具列表**
- **只授予必需的工具权限**，最小化安全风险（如 `Bash(git:*)` 精确控制）
- 复杂任务可补充**分级标准、边界约束、示例报告**（参考下面实践案例）

### 安全注意事项

⚠️ **admin-trusted 安全闸门**：来自非内置来源的 Skill 的 frontmatter `hooks` 默认不会注册。需在 `~/.codebuddy/settings.json` 中设置 `"allowUntrustedFrontmatterHooks": true` 才能启用——这是为了防范恶意 Skill。


## 六、实践案例：xinjie-review 技能

今天我用本仓库真实创建了一个全栈审查技能 `xinjie-review`，可作为参考模板。

NPM仓库地址：https://www.npmjs.com/package/xinjie-review

发布文章：[Skill 从零编写到发布上线](/column/AIFuture/Skill/Skill%20从零编写到发布上线)

### 目录结构

```
.codebuddy/skills/xinjie-review/
├── SKILL.md                              # 核心定义
├── README.md                             # 使用说明
├── references/                           # 分类检查清单
│   ├── frontend-checklist.md
│   ├── backend-checklist.md
│   ├── style-checklist.md
│   ├── document-checklist.md
│   ├── flowchart-checklist.md
│   └── dependency-security-checklist.md
├── examples/
│   └── sample-review.md                  # 示例报告
└── scripts/
    └── gen-report.sh                     # 报告生成脚本
```

### 设计要点（值得借鉴）

1. **多类型覆盖**：SKILL.md 定义了"自动识别类型"表，支持前端/后端/样式/文档/流程图等混合审查
2. **统一分级标准**：为 🔴阻断 / 🟠严重 / 🟡建议 / 🔵风格 定义了明确的判定标准表和优先级规则，保证不同模型判定一致
3. **边界约束**：明确"只审查不擅自修改，除非用户明确要求"，防止审查过程中意外改动代码
4. **PR/MR 审查流程**：基于 `git diff` 的输出流程，支持 Approve / Request changes 结论
5. **示例参照**：提供 `examples/sample-review.md`，让 AI 首次输出格式不走样

### 实测效果

用该技能审查了一段 Vue 登录组件，准确识别出：
- 🔴 阻断级：`v-html` 渲染接口数据（XSS 风险）
- 🟠 严重级：`await` 无 try/catch 导致 loading 卡死、调试日志泄露
- 🟡 建议级：魔法数字、高频轮询无缓存
- 同时肯定了定时器正确清理等亮点

输出为带 **文件 + 行号 + 问题 + 影响 + 修复建议** 的结构化分级报告。


## 七、总结

Skill 是 AI 编程助手中"把专家经验封装为可复用模块"的机制，核心价值在于：

- **让通用模型在特定领域表现更专业**
- **通过渐进式披露节约上下文**
- **实现团队/社区的技能复用与共享**

如果你要创建一个 Skill，记住三步：**建目录 → 写 `SKILL.md` → 放到约定位置**。官方也提供了 `skill-creator` 技能辅助初始化。
