const n=`# Embedding向量化入门

Embedding 是把文本、图片、音频等内容转换成一组数字向量的技术。向量之间的距离可以表示语义相似度，因此它是语义搜索、推荐系统、聚类分析、RAG 知识库的基础。

OpenAI 官方文档把 Embedding 描述为把文本转换为数字，从而支持搜索、聚类等任务。

## 一、先用一个例子理解

有三句话：

\`\`\`text
A：我想买一台适合编程的笔记本电脑
B：推荐一款开发用的电脑
C：今晚吃什么比较好
\`\`\`

关键词上，A 和 B 并不完全一样；语义上，A 和 B 很接近，C 离它们很远。

Embedding 会把它们变成向量：

\`\`\`text
A → [0.12, -0.45, 0.87, ...]
B → [0.10, -0.41, 0.83, ...]
C → [-0.76, 0.18, 0.09, ...]
\`\`\`

然后通过相似度计算判断：

\`\`\`text
相似度(A, B) > 相似度(A, C)
\`\`\`

## 二、Embedding 在系统里的位置

\`\`\`mermaid
flowchart TD
  A["原始文本"] --> B["清洗和切片"]
  B --> C["Embedding 模型"]
  C --> D["向量"]
  D --> E["向量数据库"]
  F["用户问题"] --> G["生成查询向量"]
  G --> H["相似度检索"]
  E --> H
  H --> I["返回相关文本片段"]
\`\`\`

在 RAG 中，文档和用户问题都会被转成向量。系统通过向量距离找到语义最接近的文档片段。

## 三、核心概念

| 概念 | 解释 | 例子 |
| --- | --- | --- |
| 向量 | 一组数字，表示内容的语义特征 | \`[0.12, -0.45, ...]\` |
| 维度 | 向量中数字的数量 | 1536 维、3072 维 |
| 相似度 | 衡量两个向量是否接近 | 余弦相似度 |
| TopK | 返回最相似的前 K 条 | Top5 文档片段 |
| 元数据 | 和向量一起保存的业务信息 | 标题、来源、权限、时间 |

## 四、常见相似度算法

### 4.1 余弦相似度

看两个向量方向是否接近，常用于文本语义相似度。

\`\`\`text
cosine(A, B) 越接近 1，表示越相似
\`\`\`

### 4.2 点积

常用于经过归一化的向量，计算速度快。

### 4.3 欧氏距离

看两个向量在空间中的距离，距离越短越相似。

实际项目中，不一定要自己实现这些算法，向量数据库通常已经提供。

## 五、Embedding 能做什么

### 5.1 语义搜索

用户搜索“报销规则”，系统可以找到：

- 差旅费用审批制度
- 发票提交要求
- 补贴标准说明

即使文档标题没有出现“报销规则”四个字，也可以被召回。

### 5.2 相似内容推荐

文章、商品、课程、用户画像都可以向量化，然后做相似推荐。

### 5.3 文档去重

判断两篇文档是否高度相似，避免知识库里出现大量重复内容。

### 5.4 聚类分析

把大量用户反馈按语义聚成几类，辅助产品分析。

## 六、工程实践怎么做

### 6.1 文档入库

\`\`\`mermaid
sequenceDiagram
  participant D as 文档
  participant C as 清洗器
  participant E as Embedding模型
  participant V as 向量数据库

  D->>C: 提取正文、标题、来源
  C->>C: 按段落或标题切片
  C->>E: 每个片段生成向量
  E->>V: 写入向量 + 原文 + 元数据
\`\`\`

### 6.2 查询检索

\`\`\`mermaid
sequenceDiagram
  participant U as 用户问题
  participant E as Embedding模型
  participant V as 向量数据库
  participant L as 大模型

  U->>E: 生成查询向量
  E->>V: 检索相似片段
  V->>L: 返回上下文
  L->>U: 基于上下文回答
\`\`\`

## 七、常见坑

### 7.1 不保存原文

只保存向量是不够的。向量用于检索，原文用于回答和追溯。

### 7.2 不保存元数据

至少保存：

- 文档标题
- 原始链接
- 更新时间
- 所属业务
- 权限范围
- 切片序号

### 7.3 混用不同模型

同一个向量库里尽量不要混用不同 Embedding 模型生成的向量，否则相似度空间不一致。

### 7.4 只看 TopK，不看质量

TopK 返回了结果不代表结果正确。要抽样检查召回片段是否真的能回答问题。

## 八、延伸阅读

- [OpenAI：Vector Embeddings](https://developers.openai.com/api/docs/guides/embeddings)
- [OpenAI：Create Embeddings API](https://developers.openai.com/api/reference/resources/embeddings/methods/create)
- [Microsoft：Azure OpenAI Embeddings](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/embeddings)

一句话总结：

> Embedding 是 AI 系统理解“语义相似”的基础设施。
`;export{n as default};
