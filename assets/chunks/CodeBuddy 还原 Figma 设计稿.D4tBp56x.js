const n=`# CodeBuddy 还原 Figma 设计稿：从设计到代码的完整操作步骤

> 发布日期：2026-10-20
>
> 主题：CodeBuddy / Figma / 设计稿转代码

[[toc]]

在使用 AI 将 Figma 设计稿转化为前端代码时，核心在于 **「规范的源文件」** 与 **「正确的工具入口」**。以下是使用 \`CodeBuddy\` 自动还原 UI 的完整实操步骤。

## 准备工作：下载与安装

| 工具 | 官方地址 | 说明 |
| --- | --- | --- |
| CodeBuddy | [www.codebuddy.ai](https://www.codebuddy.ai/) | 进入官网首页后点击下载，按系统选择 Windows / macOS 版本；使用文档见 [codebuddy.ai/docs/zh](https://www.codebuddy.ai/docs/zh/) |
| Figma 桌面版 | [www.figma.com/downloads](https://www.figma.com/downloads/) | 支持 macOS、Windows（含 Windows Arm）；也可直接使用网页版 [www.figma.com](https://www.figma.com/) |

> 两个工具都请从官方域名下载，不要使用第三方软件站或网盘转存的安装包。

## 第一阶段：在 Figma 中规范化设计（代码友好型）

如果 Figma 图层杂乱无章，AI 生成的代码将是满屏的绝对定位。请务必按以下标准设计：

1. **构建 Frame 容器**：摒弃 Group，所有区块（页面、卡片、输入框）必须使用 Frame（快捷键 \`F\` 或 \`Shift+A\`）。
2. **开启 Auto Layout**：所有 Frame 开启自动布局，对应前端 Flexbox。设置好排列方向（横/竖）、间距（Gap）和内边距（Padding）。
3. **语义化命名图层**：将默认的 \`Frame 12\`、\`Text 3\` 改为 \`LoginCard\`、\`Input_Phone\`、\`Button_Submit\` 等前端语义名称。
4. **定义 Variables**：尽量使用 Figma 的颜色和间距变量，避免散落的硬编码值。


**可以使用左侧的 \`agent\` 对话快速设计**

如图：

![](../images/figma.png)


## 第二阶段：在 CodeBuddy 中导入设计稿

这是最关键的一步，**严禁使用外部浏览器**，必须走 CodeBuddy 的内置通道。

1. **启动内置集成**：打开 \`CodeBuddy IDE\`，进入 **Craft Agent** 界面，点击界面上的 **Figma** 按钮。
2. **完成授权登录**：系统会弹出 Figma 的官方授权页面，登录你的账号并允许 CodeBuddy 访问。
   - *注：若此前授权过但未成功，请先退出 Figma 账号重新登录。*
   - *注：若弹出 \`Upgrade to work in Dev Mode\` 提示，直接点 \`Not now\` 关闭即可，免费版不影响。*
3. **选中目标画板**：在 CodeBuddy 内置的 Figma 视图中，打开你的设计文件，在左侧 Layers 面板**选中整个页面的最外层 Frame**（如 \`手机号登录\`）。
4. **添加至对话**：选中后，Figma 界面右上角会浮现出 **\`Add to Conversation\`** 按钮，点击它。此时设计稿的上下文数据已被送入右侧的 AI 对话框。

如图所示：

![](../images/figma-1.png)


## 第三阶段：生成与调优代码

1. **下发指令**：在 \`CodeBuddy\` 右侧的输入框中，补充你的技术栈需求。例如：

  > 请根据导入的 Figma 设计稿，使用 React 和 Tailwind CSS 生成前端登录页面，要求还原颜色、字号和间距。

   我当前写入的是：
  > 在html中还原这个设计稿，先不使用框架。

2. **查看生成结果**：按下回车，\`CodeBuddy\` 会读取设计稿节点并生成代码。生成完毕后，在右侧的 **Preview（预览）** 面板中检查效果。

生成结果：

![](../images/figma-2.png)
`;export{n as default};
