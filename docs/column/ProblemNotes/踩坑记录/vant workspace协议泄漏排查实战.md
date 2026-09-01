# 记一次 CI 构建事故：vant 把 `workspace:` 协议发布到了 npm，Jenkins 直接崩了

## 事故现场

2026-8-31早上，`Jenkins` 构建突然失败：

```bash
npm ERR! code EUNSUPPORTEDPROTOCOL
npm ERR! Unsupported URL Type "workspace:": workspace:^
npm ERR! A complete log of this run can be found in: /home/jenkins/.npm/_logs/2026-08-31T02_47_51_131Z-debug-0.log
```

`EUNSUPPORTEDPROTOCOL`、`workspace:^`——npm 在安装依赖时遇到了一个它不认识的协议。

## 第一个疑问：项目里明明没有 workspace 依赖

我在项目里翻了个遍，没有任何 `workspace:` 痕迹：

- `package.json` 无 `workspace:` 协议
- 没有 `pnpm-workspace.yaml`
- git 历史里从未出现过 `workspace:`

关键线索是用户的一句话：**"Jenkins 一直用 npm，上周是好的，今天突然报错。"**

"上周好、今天坏"说明**不是代码变了，而是外部依赖变了**。

## 背景知识：`workspace:` 协议是什么

在 pnpm / Yarn 的 monorepo（多包仓库）里，`workspace:^` 用来引用**同仓库内的兄弟包**：

```json
{
  "dependencies": {
    "@shared/utils": "workspace:^"
  }
}
```

**这个协议只有 pnpm / Yarn 认识，npm 完全不支持**，解析时一撞上就抛 `EUNSUPPORTEDPROTOCOL`。

所以问题变成：**npm 到底在解析哪个包时撞上了 `workspace:^`？**

## 复现与定位：二分法揪出"真凶"

本地用临时目录 + `npm install --dry-run`（只解析不落盘）完整复现，确认依赖树确实无法用 npm 安装。然后用**二分法**把 20 多个依赖对半拆、逐个击破，很快锁定：

```text
=== 问题依赖: vant (^4.10.0) ===
单独安装该依赖: 失败
```

单独装一个 `vant` 都会失败——答案呼之欲出。

## 实锤：vant 把 monorepo 的协议发到了 npm

> 官方的 `issue` 链接: https://github.com/youzan/vant/issues/13911

对比 `vant` 两个版本：

**`vant@4.10.0`**（2026-06-28 发布）：

```json
{
  "@vant/use": "^1.6.0",
  "@vue/shared": "^3.5.39",
  "@vant/popperjs": "^1.3.0"
}
```

**`vant@4.10.1`**（2026-08-30 发布）：

```json
{
  "@vant/use": "workspace:^",
  "@vue/shared": "^3.5.42",
  "@vant/popperjs": "workspace:^"
}
```

**真相大白**：Vant 发布 `4.10.1` 时，把 monorepo 内部的 `workspace:^` 协议原封不动带到了 npm。项目声明 `"vant": "^4.10.0"`，npm 每次解析最新版，昨天才发的 `4.10.1` 今天就被拉到了。

时间线完全吻合：

| 时间 | 事件 |
|---|---|
| 2026-06-28 | `vant@4.10.0` 发布，依赖正常 |
| 2026-08-30 | `vant@4.10.1` 发布，**携带 `workspace:` 协议** |
| 2026-08-31 | Jenkins `npm install` 命中 `4.10.1` → 报错 |

本地没炸是因为有 `pnpm-lock.yaml` 锁着 `vant@4.10.0`；Jenkins 用 npm 且无 lock 文件，只能被最新版牵着走。

## 科普：`^` 版本号到底是什么意思

### 版本号三段式

语义化版本（SemVer）：`主版本.次版本.补丁版本`，如 `4.10.0`：

| 段 | 含义 | 示例 |
|---|---|---|
| 主版本（major） | 不兼容的大改动 | `5.0.0` |
| 次版本（minor） | 向后兼容的新功能 | `4.11.0` |
| 补丁版本（patch） | 向后兼容的 bug 修复 | `4.10.1` |

### `^`（caret，插入符）

表示：**允许更新次版本和补丁版本，但不允许跨越主版本**。

```
"vant": "^4.10.0"  ⇔  >=4.10.0 且 <5.0.0
```

npm 会选范围内**最新**的版本，但绝不会碰 `5.0.0`。

### 常见写法对照表

| 写法 | 含义 | 命中范围 |
|---|---|---|
| `"vant": "4.10.0"` | 精确锁定 | 只有 `4.10.0` |
| `"vant": "~4.10.0"` | 只允许补丁更新 | `>=4.10.0 <4.11.0` |
| `"vant": "^4.10.0"` | 允许次版本+补丁更新 | `>=4.10.0 <5.0.0` |
| `"vant": "*"` | 任意版本 | 全部 |

### 正是 `^` 让我们"中招"

- 项目写 `"vant": "^4.10.0"` → 允许 `4.10.x` 任意新版本
- Vant 发 `4.10.1`，满足 `^4.10.0` 范围
- npm 无 lock 文件兜底，每次挑范围内最新版 → 命中带毒的 `4.10.1`

## 解决方案

### 第一步：锁定安全版本（立即止血）

```json
{
  "dependencies": {
    "vant": "4.10.0"   // 由 ^4.10.0 改为精确锁定
  }
}
```

去掉 `^`，任何包管理器都不会再拉到带毒的 `4.10.1`。提交后 Jenkins 重新构建即恢复。

### 第二步：关注上游修复（后续跟进）

等 Vant 发布 `4.10.2+` 修复版本后，再恢复 `^4.10.0` 或升级新版本。

### 第三步：治本——统一包管理器（长期建议）

项目 README 规定"**必须使用 pnpm，禁止 npm / yarn**"，但 Jenkins 一直在用 npm。pnpm 有 lock 文件锁死版本，上游"带毒发布"也不受影响。建议 Jenkins 改为：

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm build:uat
```

## 经验与反思

1. **版本声明与锁文件，缺一不可。** `^` 意味着"用范围内最新版"，等于把命运交给上游；lock 文件的作用正是把范围冻结成具体版本。CI 环境必须有 lock 文件，否则任何一次上游发布都可能变成事故。
2. **包管理器要"言行一致"。** 规范里写 pnpm，CI 却跑 npm，等于自己拆掉了锁文件这道防线。从本地到 CI 应全链路统一。
3. **"突然变坏"优先怀疑"变化的东西"。** 代码没改、上周还好，那变化的一定是外部因素——依赖版本、环境、镜像源。
4. **二分法是依赖问题的利器。** 面对几十个依赖，对半拆解、逐个击破，比对着日志猜快得多。
5. **大型生态的依赖也可能"带毒"。** Vant 是老牌组件库一样会踩 `workspace:` 泄漏的坑，供应链上的任何一环都值得警惕。

---

*事故不可怕，可怕的是没有锁版本。*
