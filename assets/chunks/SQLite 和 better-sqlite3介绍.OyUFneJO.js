const n=`# SQLite 和 better-sqlite3 是什么：适合什么项目，为什么这个项目用它

很多人第一次接触 SQLite，都会把它理解成“一个轻量数据库”。这个说法不算错，但还不够准确。SQLite 更值得关注的地方，不只是轻量，而是它把“数据库服务”收缩成了“一个数据库文件 + 一个嵌入式引擎”。

对于个人工具、小型后台、桌面应用、本地优先系统，SQLite 往往不是妥协方案，反而是更合适的方案。再配合 Node.js 里的 \`better-sqlite3\`，开发体验会非常直接。

这篇文章就把两个问题讲清楚：

1. SQLite 到底是什么。
2. \`better-sqlite3\` 在 Node.js 里到底负责什么。

## 一、SQLite 是什么

SQLite 是一个嵌入式关系型数据库。

它和 MySQL、PostgreSQL 最大的区别，不在于有没有 SQL，而在于部署形态：

- MySQL / PostgreSQL 通常需要单独安装数据库服务进程。
- SQLite 不需要独立数据库服务。
- SQLite 的数据库本体，就是一个本地文件。

比如在当前这个项目里，默认数据库文件就是：

\`\`\`text
data/archive.db
\`\`\`

这意味着：

- 没有额外数据库服务需要启动。
- 没有单独的数据库端口需要维护。
- 备份时，核心对象就是这个 \`.db\` 文件。
- 对于单机、本地优先、个人使用场景，部署复杂度会明显下降。

## 二、SQLite 的核心特点

### 1. 数据库就是文件

SQLite 最直观的特点，就是一个库对应一个文件。

这对个人项目很友好：

- 本地开发简单。
- 测试环境容易复制。
- 数据迁移成本低。
- 做备份和恢复时心智负担小。

### 2. 支持标准 SQL

SQLite 不是“简化版键值存储”，它支持表、索引、事务、约束，也支持大部分常见 SQL。

所以它很适合这类有明确结构的数据：

- 用户账号
- 密码资料
- 文件索引
- 分类信息
- 系统设置

### 3. 非常适合低到中等并发的单机应用

SQLite 的强项不是高并发分布式写入，而是：

- 单机稳定
- 读性能足够好
- 小中型数据集管理简单
- 事务可靠

对于“个人档案 Archive”这种项目，核心诉求本来就不是高并发，而是：

- 数据可控
- 部署简单
- 维护成本低
- 本地和单机服务器都能稳定运行

这正是 SQLite 擅长的区域。

## 三、SQLite 适合什么项目

SQLite 特别适合下面这些场景：

- 个人工具
- 管理后台
- 内部系统
- 本地优先应用
- 小型内容管理系统
- 桌面应用
- 原型验证项目

如果你的项目同时满足下面几点，SQLite 往往就值得优先考虑：

- 数据量不算夸张
- 不是高并发写入系统
- 更重视部署简单
- 更重视数据本地可控
- 更重视快速开发和低运维成本

## 四、SQLite 不擅长什么

SQLite 也不是通用最优解。

它通常不适合：

- 高频并发写入场景
- 多实例同时强写入场景
- 明确需要数据库集群的系统
- 强依赖复杂权限管理和数据库级运维体系的大型业务

也就是说，如果你做的是：

- 大型电商核心交易系统
- 高并发社交平台
- 多节点水平扩展服务

那 SQLite 往往不是首选。

## 五、better-sqlite3 是什么

SQLite 是数据库引擎，但在 Node.js 项目里，你不能直接拿 SQL 去操作 \`.db\` 文件，你还需要一个驱动库。

\`better-sqlite3\` 就是这个驱动。

它的角色可以理解成：

\`\`\`text
业务代码 -> better-sqlite3 -> SQLite -> archive.db
\`\`\`

在 Node.js 里，代码通常像这样：

\`\`\`ts
import Database from 'better-sqlite3';

const db = new Database('./data/archive.db');
const rows = db.prepare('SELECT * FROM users').all();
\`\`\`

这里：

- \`better-sqlite3\` 负责打开数据库连接。
- \`prepare()\` 负责预编译 SQL。
- \`all()\` / \`get()\` / \`run()\` 负责执行查询或写入。

## 六、为什么很多 Node.js 项目会选 better-sqlite3

### 1. API 很直接

\`better-sqlite3\` 的 API 非常朴素，学习成本低。

常见操作基本就是这几类：

\`\`\`ts
db.prepare(sql).get()
db.prepare(sql).all()
db.prepare(sql).run()
db.transaction(() => {})
\`\`\`

对个人项目和中小型服务来说，这种直接性很有价值，因为代码可读性高，排查问题也快。

### 2. 同步调用模型更适合 SQLite

\`better-sqlite3\` 一个很明显的特点是：它主要是同步 API。

很多人第一次看到“同步”会紧张，觉得这是不是落后了。其实要看场景。

SQLite 本身就是单机文件型数据库，很多本地数据库操作本来就不是“远程网络 IO”模型。对这种场景，\`better-sqlite3\` 的同步 API 反而有两个好处：

- 代码简单，不会因为一层层 \`await\` 让数据访问变得啰嗦。
- 事务边界更自然，不容易把逻辑拆散。

### 3. 事务使用很顺手

例如：

\`\`\`ts
const saveUserAndSetting = db.transaction((user, setting) => {
  db.prepare('INSERT INTO users (id, name) VALUES (?, ?)').run(user.id, user.name);
  db.prepare('INSERT INTO app_settings (key, value) VALUES (?, ?)').run(setting.key, setting.value);
});
\`\`\`

这种写法非常适合“要么一起成功，要么一起失败”的业务。

### 4. 性能稳定

在 SQLite 这类场景里，\`better-sqlite3\` 的表现通常比较稳定。对于个人项目、后台系统、桌面化工具，这一点已经够用了。

## 七、better-sqlite3 需要注意什么

它也有一个明确特点：\`better-sqlite3\` 是原生模块。

这意味着它不是纯 JavaScript 包，部署时要注意 Node.js 运行环境兼容性，尤其是：

- 本地构建用的 Node.js 大版本
- 服务器运行时的 Node.js 大版本

如果两边不一致，就可能出现这类错误：

\`\`\`text
Module did not self-register: better_sqlite3.node
\`\`\`

这也是很多人在部署阶段第一次真正意识到：数据库驱动不是“装上就完了”，它和运行环境是绑定的。

所以在生产部署时，最好保证：

- 本地 / CI / 服务器使用同一大版本 Node.js
- 不要在一个 Node 版本构建，再拿去另一个大版本运行

## 八、这个项目为什么选择 SQLite + better-sqlite3

当前这个“个人档案 Archive”项目选择 SQLite 和 \`better-sqlite3\`，原因并不复杂：

### 1. 它是一个本地优先项目

这个项目主要管理的是个人资料：

- 密码
- 文档
- 简历
- 图片
- 证件
- 学习资料

它天然更适合“单人使用、单机部署、数据本地保存”。

### 2. 部署要尽量简单

如果这里换成 MySQL 或 PostgreSQL，部署时就要多维护一套数据库服务。

但当前项目还需要同时处理：

- 文件上传目录
- 登录态
- PM2
- Nginx
- ECS 产物部署

这时候数据库如果还能保持“一个文件就够”，整体复杂度会低很多。

### 3. 数据模型是典型的结构化数据

这个项目并不是无结构文件仓库，它有明确的数据表关系，比如：

- \`users\`
- \`password_items\`
- \`file_assets\`
- \`app_settings\`

这种场景本来就适合关系型数据库，而 SQLite 足够胜任。

### 4. 当前并发要求并不高

它不是一个公开高并发平台，更不是多节点写入系统。所以没有必要为了“未来可能很大”提前引入更重的数据库体系。

## 九、SQLite 和 better-sqlite3 怎么配合理解

可以用一句话记住：

- SQLite 是数据库引擎。
- \`better-sqlite3\` 是 Node.js 访问 SQLite 的驱动。

再展开一点就是：

\`\`\`text
SQLite 负责存储、事务、索引、SQL 执行
better-sqlite3 负责让 Node.js 代码能够稳定地操作 SQLite
\`\`\`

它们不是竞争关系，而是上下游关系。

## 十、什么时候该从 SQLite 走向更重的数据库

如果后面项目出现这些变化，就应该重新评估：

- 多个应用实例需要同时高频写入
- 数据规模持续增长且查询越来越复杂
- 运维层面需要更成熟的主从、备份、审计和权限体系
- 团队协作规模扩大，数据库能力边界开始成为瓶颈

到了这个阶段，再迁移到 MySQL 或 PostgreSQL 才是合理的演进，而不是项目一开始就先把复杂度加满。

## 十一、总结

SQLite 的价值，不只是“轻”，而是它把数据库能力和部署复杂度控制在了一个很合适的平衡点上。

\`better-sqlite3\` 的价值，也不只是“能连 SQLite”，而是它让 Node.js 项目能用一种非常直接、稳定、低心智负担的方式管理本地数据库。

对于本地优先、单机部署、个人使用、后台管理这类项目，\`SQLite + better-sqlite3\` 往往是一个很务实的组合。
`;export{n as default};
