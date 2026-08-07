const n=`# Skill 从零编写到发布上线：保姆级实战全流程

> 发布日期：2026-08-07
>
> 作者：gouxinjie
>
> 主题：CodeBuddy Skill 的完整生命周期——从设计、编写、打包，到发布 npm、配置自动发布
>
> 前置阅读：《Skill（技能）详解：从概念到发布》了解 Skill 基本概念

![](../images/skill-3.png)

## 一、写在前面

上一篇博客我们讲了"Skill 是什么"，这篇直接上干货：**如何从一个想法，把一个 Skill 完整地开发、打包、发布到 npm，并配置"打 tag 自动发布"的全自动化流程。**

我用自己真实创建并上线的 \`xinjie-review\`（全能代码审查技能）作为完整案例，每一步都有可复制的代码。

### 最终效果

发布完成后，用户只需一条命令即可使用你的技能：

\`\`\`bash
npm install -g xinjie-review
\`\`\`

而你维护技能时，只需：

\`\`\`bash
npm version patch && git push --tags
\`\`\`

npm 就会**自动更新**，全程零手动干预。

**使用如下：**

![](../images/skill-4.png)

![](../images/skill-5.png)


## 二、第一步：设计 Skill

动手写之前，先想清楚三件事。这一步决定技能好不好用。

### 1. 明确"做什么、不做什么"

以 \`xinjie-review\` 为例，我定义它：
- **做什么**：对前端/后端/CSS/文档/流程图/依赖安全进行质量审查，输出分级报告
- **不做什么**：不擅自修改代码（除非用户明确要求修复）——这是重要的边界约束

> 边界约束写进 \`SKILL.md\`，能防止 AI 在审查过程中意外改动代码。

### 2. 写清楚 \`description\`（最重要）

\`description\` 决定 AI **何时自动调用**这个技能。它要**具体**，不能泛泛而谈：

\`\`\`yaml
# ❌ 太泛，AI 难以判断
description: 代码审查

# ✅ 具体，AI 一看就懂
description: 全能代码与文档审查专家（xinjie 审查）。适用于对前端、后端、CSS/样式、Markdown 文档、流程图等进行系统性质量审查，覆盖正确性、性能、可访问性、安全性、可维护性、逻辑与语句通顺度等维度，输出结构化分级审查报告。
\`\`\`

### 3. 规划目录结构

一个 Skill 是独立目录，至少包含 \`SKILL.md\`：

\`\`\`
xinjie-review/
├── SKILL.md          # 必填，核心定义
├── README.md         # 技能说明（可选）
├── references/       # 分类检查清单（可选，按需加载）
├── examples/         # 示例输出（可选，帮助格式不走样）
└── scripts/          # 辅助脚本（可选）
\`\`\`

## 三、第二步：编写 SKILL.md

\`SKILL.md\` 由 **YAML Frontmatter** + **Markdown 指令** 两部分组成。

### Frontmatter（元数据）

\`\`\`yaml
---
name: xinjie-review
description: 全能代码与文档审查专家（xinjie 审查）。适用于对前端、后端、CSS/样式、Markdown 文档、流程图等进行系统性质量审查...
allowed-tools: Read, Write, Search, Grep, ListFiles, Bash
---
\`\`\`

> \`allowed-tools\` 用最小权限原则，只授予审查必需的只读工具。

### 正文（给 AI 的指令）

正文是"喂给模型的培训手册"，建议包含：

1. **身份定位**：一句话说明这个 AI 现在扮演什么角色
2. **核心目标**：要达成什么
3. **审查维度**：分类型列出要检查的具体项
4. **工作流程**：步骤化，让 AI 按顺序执行
5. **分级标准**：统一 🔴🟠🟡🔵 判定规则，保证不同模型输出一致
6. **边界约束**：哪些不能做
7. **报告格式**：规定输出模板

以分级标准为例，这是保证"输出质量稳定"的关键：

\`\`\`markdown
| 级别 | 图标 | 判定标准 |
|------|------|----------|
| 阻断级 | 🔴 | 功能错误、数据错误、崩溃、明显安全隐患 |
| 严重级 | 🟠 | 有明确 Bug 风险、边界情况会出错 |
| 建议级 | 🟡 | 可维护性、可读性可改进 |
| 风格级 | 🔵 | 命名、格式、风格 |

> 判定优先级：安全 > 正确性 > 性能 > 可维护性 > 风格
\`\`\`

### 本地验证

写完先放到 \`.codebuddy/skills/\` 或 \`~/.codebuddy/skills/\`，在 CodeBuddy 里实际跑一次，用真实代码验证输出质量。我最初就是用它审查一段 Vue 组件，准确识别出了 XSS、异步无捕获、内存泄漏等问题——**验证通过再进入下一步**。

## 四、第三步：打包成 npm 包

这里有个关键认知：**Skill 不是传统 JS 库**，用户不是 \`import\` 它，而是通过安装脚本把它放到 CodeBuddy 的技能目录。所以我们的玩法是：**把 Skill 打成 npm 包，用 \`postinstall\` 钩子自动安装。**

### 目录结构改造

\`\`\`
project/
├── package.json          # npm 包清单
├── README.md             # npm 首页 + 使用说明
├── bin/
│   ├── install.js        # 安装脚本
│   └── uninstall.js      # 卸载脚本
└── skills/
    └── xinjie-review/    # 技能本体
\`\`\`

### package.json（核心是钩子）

\`\`\`json
{
  "name": "xinjie-review",
  "version": "1.0.0",
  "description": "CodeBuddy 全能代码与文档审查技能...",
  "files": ["skills/", "bin/"],
  "bin": {
    "xinjie-review-install": "bin/install.js"
  },
  "scripts": {
    "postinstall": "node bin/install.js",
    "postuninstall": "node bin/uninstall.js",
    "prepublishOnly": "npm pack"
  }
}
\`\`\`

**三个关键点：**

1. \`postinstall\` / \`postuninstall\`：用户 \`npm install\` / \`npm uninstall\` 时自动执行，完成技能安装/卸载
2. \`files\`：只打包 \`skills/\` 和 \`bin/\`，**把 \`.codebuddy/\` 等开发配置排除在外**
3. \`prepublishOnly\`：发布前自动 \`npm pack\` 校验，防止发错内容

### 安装脚本 bin/install.js

核心逻辑：把 \`skills/xinjie-review\` 复制到 \`~/.codebuddy/skills/\`：

\`\`\`js
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILL_NAME = 'xinjie-review';
const SRC = path.join(__dirname, '..', 'skills', SKILL_NAME);
const TARGET = path.join(os.homedir(), '.codebuddy', 'skills', SKILL_NAME);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

copyDir(SRC, TARGET);
console.log(\`✅ 技能已安装到：\${TARGET}\`);
\`\`\`

> 生产版本可加 \`--project\` 参数支持安装到当前项目 \`.codebuddy/skills/\`，便于团队共享。

### 发布前检查

\`\`\`bash
npm pack --dry-run    # 检查打包内容（只应含 skills/ 和 bin/）
\`\`\`

\`\`\`bash
npm view <包名>       # 查包名是否已被占用（404 表示可用）
\`\`\`


## 五、第四步：发布到 npm

### 1. 登录

\`\`\`bash
npm login
\`\`\`

### 2. 首次发布

\`\`\`bash
npm publish
\`\`\`

发布后立即验证：

\`\`\`bash
npm view xinjie-review version
\`\`\`

> ⚠️ 刚发布的包 \`npm view\` 可能短暂返回 404，是 registry 传播延迟，等几十秒再查即可。

### 3. 用户侧体验

用户现在可以这样用：

\`\`\`bash
npm install -g xinjie-review   # postinstall 自动安装技能
\`\`\`

然后在 CodeBuddy 里直接说"审查 src/components/Button.vue"，AI 自动调用技能。

## 六、第五步：配置"打 tag 自动发布"

手动 \`npm publish\` 太麻烦，也容易忘记。我用 **GitHub Actions** 实现了"推送 \`v*\` tag 自动发布"。

### 创建 \`.github/workflows/npm-publish.yml\`

\`\`\`yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'            # 推送 v 开头的 tag 才触发

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org/'
      - name: Verify package
        run: npm pack --dry-run     # 发布前校验
      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
\`\`\`

### 配置 npm 令牌（关键一步）

1. **npmjs.com** → Access Tokens → Generate New Token（类型选 Automation）
2. **GitHub 仓库** → Settings → Secrets → Actions → New repository secret
   - Name: \`NPM_TOKEN\`
   - Value: 粘贴令牌

### 之后的发布流程（全自动）

\`\`\`bash
npm version patch        # 自动改版本号 + 打 tag（v1.0.1）
git push                 # 推送 main
git push --tags          # 推送 tag → 触发 Actions → 自动发布
\`\`\`

**实测验证**：推送 \`v1.0.1\` 后约 1 分钟，\`npm view xinjie-review version\` 返回 \`1.0.1\`，全流程跑通。


## 七、经验总结

### 做对了的事

| 决策 | 收益 |
|------|------|
| \`description\` 写得具体 | AI 自动识别准确 |
| 分级标准 + 边界约束写进 SKILL.md | 输出稳定、安全 |
| \`files\` 限定打包内容 | 包干净、不发多余文件 |
| \`postinstall\` 钩子 | 用户零操作安装 |
| GitHub Actions 打 tag 发布 | 版本管理 + 自动发布 |

### 踩过的坑

1. **包名冲突**：先 \`npm view\` 查重再定名，避免发布失败
2. **\`npm view\` 刚发布返回 404**：registry 有延迟，不是没发布成功
3. **\`.codebuddy/\` 开发目录**：务必用 \`files\` 排除，不能随包发布
4. **技能名 ≠ npm 包名**：技能名在 \`SKILL.md\`，npm 包名在 \`package.json\`，两者独立

### 一句话流程

> **写 SKILL.md → 本地验证 → 打包成 npm 包 → npm publish → 配 GitHub Actions → 打 tag 即上线**
`;export{n as default};
