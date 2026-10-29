import{_ as p}from"./chunks/plugin-vue_export-helper.DlAUqK2U.js";import{L as e,x as l,A as i,G as s,M as r,Z as c,B as t}from"./chunks/runtime-core.esm-bundler.BPWg86ya.js";const q=JSON.parse('{"title":"Agent Loop（智能体执行循环）：AI 是如何一步步完成任务的？","description":"","frontmatter":{},"headers":[],"relativePath":"column/AIFuture/AI Agent 核心技术/Agent Loop（智能体执行循环）.md","filePath":"column/AIFuture/AI Agent 核心技术/Agent Loop（智能体执行循环）.md","lastUpdated":1793259430000}'),o={name:"column/AIFuture/AI Agent 核心技术/Agent Loop（智能体执行循环）.md"};function b(u,n,d,m,g,h){const a=e("ArticleMetadata");return i(),l("div",null,[n[0]||(n[0]=s("h1",{id:"agent-loop-智能体执行循环-ai-是如何一步步完成任务的",tabindex:"-1"},[t("Agent Loop（智能体执行循环）：AI 是如何一步步完成任务的？ "),s("a",{class:"header-anchor",href:"#agent-loop-智能体执行循环-ai-是如何一步步完成任务的","aria-label":'Permalink to "Agent Loop（智能体执行循环）：AI 是如何一步步完成任务的？"'},"​")],-1)),r(a),n[1]||(n[1]=c(`<nav class="table-of-contents"><ul><li><a href="#一、什么是-agent-loop">一、什么是 Agent Loop？</a></li><li><a href="#二、agent-loop-是如何运转的">二、Agent Loop 是如何运转的？</a><ul><li><a href="#_2-1-第一步-接收任务-理解目标">2.1 第一步：接收任务，理解目标</a></li><li><a href="#_2-2-第二步-调用工具-获取真实信息">2.2 第二步：调用工具，获取真实信息</a></li><li><a href="#_2-3-第三步-根据反馈-决定下一步">2.3 第三步：根据反馈，决定下一步</a></li></ul></li><li><a href="#三、从代码角度理解-agent-loop">三、从代码角度理解 Agent Loop</a><ul><li><a href="#_3-1-定义模型与工具接口">3.1 定义模型与工具接口</a></li><li><a href="#_3-2-实现执行循环">3.2 实现执行循环</a></li></ul></li><li><a href="#四、为什么-agent-loop-不会一直运行下去">四、为什么 Agent Loop 不会一直运行下去？</a></li><li><a href="#五、agent-loop-与-react-有什么区别">五、Agent Loop 与 ReAct 有什么区别？</a></li><li><a href="#六、agent-loop-在实际开发中有什么价值">六、Agent Loop 在实际开发中有什么价值？</a></li><li><a href="#七、总结">七、总结</a></li></ul></nav><p>当我们使用 AI 编程工具时，可能会遇到这样的场景：告诉 AI“帮我修复这个项目的登录问题”，它并没有直接给出一段代码就结束，而是先读取项目文件，分析代码逻辑，修改相关文件，运行测试，发现错误后继续修复，直到问题得到解决。</p><p>这背后有一个非常重要的机制：<code>Agent Loop（智能体执行循环）</code>。</p><p>如果说大语言模型（LLM）是 AI 的“大脑”，负责理解问题、分析信息并决定下一步做什么，那么 <code>Agent Loop</code> 就是让这个大脑能够持续行动、接收反馈并调整方案的工作机制。</p><p>理解 <code>Agent Loop</code>，就能明白为什么普通的 AI 聊天通常是“一问一答”，而 AI Agent 却能够执行一连串操作，逐步完成复杂任务。</p><h2 id="一、什么是-agent-loop" tabindex="-1">一、什么是 Agent Loop？ <a class="header-anchor" href="#一、什么是-agent-loop" aria-label="Permalink to &quot;一、什么是 Agent Loop？&quot;">​</a></h2><p><code>Agent Loop</code>，中文通常称为“智能体执行循环”，指的是 <code>AI Agent</code> 在执行任务时，反复进行思考、调用工具、获取结果、根据反馈决定下一步行动的过程。</p><p>它不是某种特殊的模型，而是一种围绕大语言模型构建的任务执行机制。</p><p>普通的 AI 聊天通常是这样的：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>用户提出问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>“帮我分析一下这段代码”</span></span>
<span class="line"><span></span></span>
<span class="line"><span>大模型生成回答</span></span>
<span class="line"><span></span></span>
<span class="line"><span>分析代码并返回文本</span></span>
<span class="line"><span></span></span>
<span class="line"><span>本轮对话结束</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>而 AI Agent 的工作方式更像一个不断推进任务的执行流程</p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 理解任务:明确目标与当前状态</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 模型决定下一步:继续分析，或请求调用工具</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 执行工具:读取文件、运行命令、查询数据等</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 获取执行结果:成功结果、错误日志或其他反馈</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5. 判断是否完成</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>未完成则继续循环，完成则返回结果</p><p>未完成时，执行结果会再次进入模型上下文，触发下一轮决策。</p><p>两者最大的区别在于：普通聊天主要关注生成回答，而 <code>Agent Loop</code> 让模型可以在多轮执行中持续利用外部工具，并根据真实执行结果调整行动。</p><p>需要注意的是，循环本身并不意味着模型一定能自主完成任务。它能否成功，还取决于模型能力、工具质量、上下文信息、权限控制以及终止条件。</p><h2 id="二、agent-loop-是如何运转的" tabindex="-1">二、Agent Loop 是如何运转的？ <a class="header-anchor" href="#二、agent-loop-是如何运转的" aria-label="Permalink to &quot;二、Agent Loop 是如何运转的？&quot;">​</a></h2><p>继续以 AI 修复登录问题为例，看看一次完整的执行循环是怎样发生的。</p><h3 id="_2-1-第一步-接收任务-理解目标" tabindex="-1">2.1 第一步：接收任务，理解目标 <a class="header-anchor" href="#_2-1-第一步-接收任务-理解目标" aria-label="Permalink to &quot;2.1 第一步：接收任务，理解目标&quot;">​</a></h3><p>用户提出需求：</p><blockquote><p>帮我检查项目的登录功能，如果有问题就修复，并运行测试。</p></blockquote><p><code>Agent</code> 首先会把用户需求、系统提示词、已有对话以及必要的项目上下文发送给大模型。</p><p>模型需要判断当前任务应该怎么推进。例如，它可能决定先查看项目目录，再找到登录相关代码，而不是直接修改文件。</p><p>这里有一个关键点：大模型通常负责决定下一步行动，但并不天然拥有读取本地项目的能力。</p><p>真正执行读取操作的是 <code>Agent</code> 运行环境提供的文件工具。模型需要通过工具调用请求，让运行环境执行对应操作。</p><h3 id="_2-2-第二步-调用工具-获取真实信息" tabindex="-1">2.2 第二步：调用工具，获取真实信息 <a class="header-anchor" href="#_2-2-第二步-调用工具-获取真实信息" aria-label="Permalink to &quot;2.2 第二步：调用工具，获取真实信息&quot;">​</a></h3><p>假设 <code>Agent</code> 提供了一个 <code>readFile</code> 工具，模型可以请求读取登录模块：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;name&quot;: &quot;readFile&quot;,</span></span>
<span class="line"><span>  &quot;arguments&quot;: {</span></span>
<span class="line"><span>    &quot;path&quot;: &quot;src/auth/login.ts&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>上面的内容表示一次工具调用请求，并不是模型直接打开了电脑上的文件。</p><p>接下来，<code>Agent Runtime</code> 通常会完成以下工作：</p><ol><li>检查工具是否存在。</li><li>校验参数是否合法。</li><li>根据权限规则判断是否允许读取。</li><li>调用真正的文件读取函数。</li><li>将读取结果返回给模型。</li></ol><p>假设工具返回了登录代码，模型就可以根据实际内容继续分析，而不是仅凭猜测生成修复方案。</p><p>工具的定义、参数校验与执行过程可以参考 <code>LangChain</code> 的工具调用文档。</p><h3 id="_2-3-第三步-根据反馈-决定下一步" tabindex="-1">2.3 第三步：根据反馈，决定下一步 <a class="header-anchor" href="#_2-3-第三步-根据反馈-决定下一步" aria-label="Permalink to &quot;2.3 第三步：根据反馈，决定下一步&quot;">​</a></h3><p>拿到登录代码后，模型可能发现一个问题：登录请求失败时，没有正确处理异常。</p><p>它可以继续请求调用文件修改工具，修改对应代码，然后请求运行测试的工具。</p><p>如果测试返回：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FAIL src/auth/login.test.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Expected: 401</span></span>
<span class="line"><span>Received: 500</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>这条错误信息就成为下一轮模型调用的输入。</p><p>模型可以据此判断：第一次修改仍然存在问题，需要继续查看错误处理逻辑，或者调整测试相关代码。</p><p>于是，执行流程再次进入循环：</p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>模型分析当前信息</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>请求调用工具</span></span>
<span class="line"><span>读取文件、修改代码或运行测试</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>工具实际执行并返回结果</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>模型根据结果重新判断</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ├── 任务未完成 ──▶ 继续调用模型，进入下一轮循环</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>   任务完成</span></span>
<span class="line"><span>返回最终结果</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>这就是 <code>Agent Loop </code>最核心的机制：每次工具执行都会产生新的信息，模型根据这些信息决定下一步行动。</p><p>当然，并不是每次循环都必须调用工具。模型也可以判断现有信息已经足够，直接生成最终回答。</p><h2 id="三、从代码角度理解-agent-loop" tabindex="-1">三、从代码角度理解 Agent Loop <a class="header-anchor" href="#三、从代码角度理解-agent-loop" aria-label="Permalink to &quot;三、从代码角度理解 Agent Loop&quot;">​</a></h2><p>了解运行原理后，我们可以尝试使用 <code>TypeScript</code> 实现一个简化版本。</p><p>下面的示例不依赖具体的大模型 SDK，而是通过接口抽象模型调用过程，重点展示循环控制逻辑。</p><h3 id="_3-1-定义模型与工具接口" tabindex="-1">3.1 定义模型与工具接口 <a class="header-anchor" href="#_3-1-定义模型与工具接口" aria-label="Permalink to &quot;3.1 定义模型与工具接口&quot;">​</a></h3><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type ToolCall = {</span></span>
<span class="line"><span>  id: string;</span></span>
<span class="line"><span>  name: string;</span></span>
<span class="line"><span>  arguments: Record&lt;string, unknown&gt;;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type ModelResponse = {</span></span>
<span class="line"><span>  content?: string;</span></span>
<span class="line"><span>  toolCalls: ToolCall[];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Message = {</span></span>
<span class="line"><span>  role: &quot;user&quot; | &quot;assistant&quot; | &quot;tool&quot;;</span></span>
<span class="line"><span>  content: string;</span></span>
<span class="line"><span>  toolCallId?: string;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Tool = {</span></span>
<span class="line"><span>  name: string;</span></span>
<span class="line"><span>  execute: (</span></span>
<span class="line"><span>    args: Record&lt;string, unknown&gt;</span></span>
<span class="line"><span>  ) =&gt; Promise&lt;string&gt;;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Model = {</span></span>
<span class="line"><span>  generate: (</span></span>
<span class="line"><span>    messages: Message[]</span></span>
<span class="line"><span>  ) =&gt; Promise&lt;ModelResponse&gt;;</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><p>这里定义了三个核心对象：</p><ul><li><code>Model</code>：负责调用大模型，获取模型的下一步决策。</li><li><code>Tool</code>：封装真实的工具执行逻辑。</li><li><code>Message</code>：保存用户输入、模型回复和工具执行结果。</li></ul><p>模型返回的 <code>toolCalls</code> 表示它希望调用哪些工具。具体能否执行，还要由 Agent 自己判断。</p><h3 id="_3-2-实现执行循环" tabindex="-1">3.2 实现执行循环 <a class="header-anchor" href="#_3-2-实现执行循环" aria-label="Permalink to &quot;3.2 实现执行循环&quot;">​</a></h3><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async function runAgent(</span></span>
<span class="line"><span>  model: Model,</span></span>
<span class="line"><span>  tools: Tool[],</span></span>
<span class="line"><span>  userInput: string,</span></span>
<span class="line"><span>  maxSteps = 10</span></span>
<span class="line"><span>): Promise&lt;string&gt; {</span></span>
<span class="line"><span>  const messages: Message[] = [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      role: &quot;user&quot;,</span></span>
<span class="line"><span>      content: userInput,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  ];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const toolMap = new Map(</span></span>
<span class="line"><span>    tools.map((tool) =&gt; [tool.name, tool])</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for (let step = 0; step &lt; maxSteps; step++) {</span></span>
<span class="line"><span>    // 1. 请求模型决定下一步行动</span></span>
<span class="line"><span>    const response = await model.generate(messages);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 2. 记录模型回复</span></span>
<span class="line"><span>    messages.push({</span></span>
<span class="line"><span>      role: &quot;assistant&quot;,</span></span>
<span class="line"><span>      content: response.content ?? &quot;&quot;,</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 3. 没有工具调用，结束循环</span></span>
<span class="line"><span>    if (response.toolCalls.length === 0) {</span></span>
<span class="line"><span>      return response.content ?? &quot;任务已结束&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 4. 执行模型请求的工具</span></span>
<span class="line"><span>    for (const call of response.toolCalls) {</span></span>
<span class="line"><span>      const tool = toolMap.get(call.name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if (!tool) {</span></span>
<span class="line"><span>        messages.push({</span></span>
<span class="line"><span>          role: &quot;tool&quot;,</span></span>
<span class="line"><span>          toolCallId: call.id,</span></span>
<span class="line"><span>          content: \`工具不存在：\${call.name}\`,</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        continue;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        const result = await tool.execute(</span></span>
<span class="line"><span>          call.arguments</span></span>
<span class="line"><span>        );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        messages.push({</span></span>
<span class="line"><span>          role: &quot;tool&quot;,</span></span>
<span class="line"><span>          toolCallId: call.id,</span></span>
<span class="line"><span>          content: result,</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>      } catch (error) {</span></span>
<span class="line"><span>        const message =</span></span>
<span class="line"><span>          error instanceof Error</span></span>
<span class="line"><span>            ? error.message</span></span>
<span class="line"><span>            : &quot;未知工具执行错误&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        messages.push({</span></span>
<span class="line"><span>          role: &quot;tool&quot;,</span></span>
<span class="line"><span>          toolCallId: call.id,</span></span>
<span class="line"><span>          content: \`执行失败：\${message}\`,</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return &quot;已达到最大执行步数，任务停止。&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br></div></div><p>这段代码展示了 Agent Loop 的基本骨架：</p><ol><li>调用模型。</li><li>检查模型是否请求工具。</li><li>执行工具并记录结果。</li><li>把结果带入下一轮模型调用。</li><li>没有后续工具调用，或者达到最大步数时停止。</li></ol><p>注意：这只是用于理解原理的简化示例，不是可直接用于生产环境的完整 Agent。 真实模型接口还需要正确处理工具调用消息、调用 ID、参数 Schema、上下文管理和权限校验。</p><p>实际工程中，也可以使用 <code>LangGraph</code> 这样的框架组织循环、状态和条件路由。</p><h2 id="四、为什么-agent-loop-不会一直运行下去" tabindex="-1">四、为什么 Agent Loop 不会一直运行下去？ <a class="header-anchor" href="#四、为什么-agent-loop-不会一直运行下去" aria-label="Permalink to &quot;四、为什么 Agent Loop 不会一直运行下去？&quot;">​</a></h2><p>如果模型一直要求调用工具，而工具执行后又持续返回错误，Agent 就可能陷入循环。</p><p>例如：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>模型：运行测试</span></span>
<span class="line"><span>工具：测试失败</span></span>
<span class="line"><span></span></span>
<span class="line"><span>模型：修改代码，再运行测试</span></span>
<span class="line"><span>工具：测试失败</span></span>
<span class="line"><span></span></span>
<span class="line"><span>模型：再次修改代码</span></span>
<span class="line"><span>工具：测试仍然失败</span></span>
<span class="line"><span>...</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>因此，<code>Agent Loop</code> 不仅需要循环机制，还必须设计可靠的停止条件。</p><p>常见的控制方式包括：</p><table tabindex="0"><thead><tr><th>控制机制</th><th>作用</th></tr></thead><tbody><tr><td>最大执行步数</td><td>限制循环次数，防止无限运行</td></tr><tr><td>超时时间</td><td>避免任务长时间占用资源</td></tr><tr><td>Token 与费用限制</td><td>控制模型调用成本</td></tr><tr><td>错误次数限制</td><td>多次失败后暂停或交由人工处理</td></tr><tr><td>完成条件</td><td>根据测试结果、业务规则等判断任务是否真正完成</td></tr><tr><td>人工审批</td><td>对删除文件、发布代码等高风险操作进行确认</td></tr></tbody></table><p>其中，模型说“任务完成”并不一定代表任务真的完成了。</p><p>例如，模型可以声称代码已经修复，但实际测试仍然失败。因此，工程实践中应该尽可能使用构建结果、测试结果、业务状态等可验证的信息判断任务是否完成。工具执行错误也应该被妥善处理，而不是直接丢失。</p><h2 id="五、agent-loop-与-react-有什么区别" tabindex="-1">五、Agent Loop 与 ReAct 有什么区别？ <a class="header-anchor" href="#五、agent-loop-与-react-有什么区别" aria-label="Permalink to &quot;五、Agent Loop 与 ReAct 有什么区别？&quot;">​</a></h2><p>在学习<code> Agent Loop</code> 时，经常会遇到另一个概念：<code>ReAct</code>。</p><p>两者有关联，但并不是同一个概念。</p><ul><li><code>Agent Loop</code>：描述智能体反复调用模型、执行工具、接收反馈的整体执行机制。</li><li><code>ReAct</code>：一种将推理（Reasoning）与行动（Acting）结合起来的智能体设计模式。</li></ul><p>例如，模型在处理问题时，可以根据当前信息决定搜索资料，观察搜索结果，再决定是否继续搜索或给出答案。这类“思考—行动—观察”的模式，是 Agent Loop 的一种常见实现方式。</p><p>并非所有 <code>Agent Loop</code> 都必须采用 <code>ReAct</code>，也不是所有任务都适合让模型自由决定每一个步骤。对于固定流程，使用明确的程序逻辑或状态机，往往更容易控制和测试。</p><h2 id="六、agent-loop-在实际开发中有什么价值" tabindex="-1">六、Agent Loop 在实际开发中有什么价值？ <a class="header-anchor" href="#六、agent-loop-在实际开发中有什么价值" aria-label="Permalink to &quot;六、Agent Loop 在实际开发中有什么价值？&quot;">​</a></h2><p><code>Agent Loop</code> 的价值，不只是让 AI 多调用几次模型，而是让 AI 能够根据真实反馈推进任务。</p><p>在 AI 编程场景中，它可以形成这样的流程：</p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>读取项目</span></span>
<span class="line"><span>分析目录结构，定位目标代码</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>修改代码</span></span>
<span class="line"><span>根据需求生成修改，并写入文件</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>执行验证</span></span>
<span class="line"><span>运行测试、类型检查或构建命令</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>根据反馈迭代</span></span>
<span class="line"><span>读取错误日志，继续修复</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        └──▶ 未满足完成条件时，回到「执行验证」继续循环</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>这套机制同样可以用于自动化运维、数据分析、知识检索和业务流程处理。</p><p>但需要明确：<code>Agent Loop</code> 只是让任务能够持续执行的基础机制。真正可靠的 <code>AI Agent</code>，还需要工具系统、状态管理、权限控制、错误处理和结果验证等配套能力。</p><h2 id="七、总结" tabindex="-1">七、总结 <a class="header-anchor" href="#七、总结" aria-label="Permalink to &quot;七、总结&quot;">​</a></h2><p>理解 <code>Agent Loop</code>，可以记住一句话：</p><p>大模型负责决定下一步做什么，工具负责真正执行，执行结果再反馈给大模型，由此形成持续推进任务的循环。</p><p>当我们看到 AI 自动读取文件、修改代码、运行测试并修复错误时，背后通常并不是模型一次性完成了所有工作，而是运行环境持续协调模型与工具，直到满足停止条件。</p><p>这也是 <code>AI Agent</code> 与普通问答应用的重要区别：它不仅能够生成内容，还可以在工具和反馈的支持下，一步步推进真实任务。</p>`,84))])}const k=p(o,[["render",b]]);export{q as __pageData,k as default};
