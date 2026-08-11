# 用 better-sqlite3 管理本地 SQLite 数据库

在一个个人档案类项目里，数据规模通常不会特别大，但数据类型很多：账号密码、文档、简历、图片、证件、学习资料。这个场景更看重本地化、低部署成本、数据可控和开发效率，所以本项目没有一开始就接入 MySQL、PostgreSQL 这类独立数据库服务，而是选择了 SQLite。

SQLite 的特点是：数据库就是一个文件。本项目默认数据库文件是：

```text
data/archive.db
```

Node.js 后端通过 `better-sqlite3` 读写这个文件。它的 API 简单、同步执行、性能稳定，非常适合个人工具、小型后台、桌面化应用、原型系统和低并发场景。

## SQLite 和 better-sqlite3 的关系

SQLite 是数据库引擎，负责真正的数据存储、SQL 执行、事务、索引和文件读写。

`better-sqlite3` 是 Node.js 访问 SQLite 的驱动库。项目代码不会直接去改 `.db` 文件，而是通过 `better-sqlite3` 打开数据库连接，再执行 SQL：

```ts
import Database from 'better-sqlite3';

const database = new Database('./data/archive.db');
```

可以把它理解为：

```text
业务接口 -> database.ts -> better-sqlite3 -> SQLite -> data/archive.db
```

## 数据库文件在哪里

项目中数据库路径由环境变量 `NUXT_DATABASE_PATH` 控制。如果没有配置，就使用默认路径：

```ts
process.env.NUXT_DATABASE_PATH || './data/archive.db'
```

也就是说，默认情况下，数据库就在项目根目录下的 `data` 文件夹里。

实际运行时，SQLite 还可能生成两个辅助文件：

```text
data/archive.db
data/archive.db-wal
data/archive.db-shm
```

其中 `archive.db` 是主数据库文件，`archive.db-wal` 和 `archive.db-shm` 是 WAL 模式下的日志和共享内存文件。项目里开启了：

```ts
databaseConnection.pragma('journal_mode = WAL');
databaseConnection.pragma('foreign_keys = ON');
```

`WAL` 可以提升读写并发体验，`foreign_keys` 用来开启外键约束。

## 初始化数据库连接

项目会先计算数据库路径，再确保目录存在，然后创建连接：

```ts
const databasePath = resolve(process.env.NUXT_DATABASE_PATH || './data/archive.db');
mkdirSync(dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
```

这里有两个细节：

1. `resolve()` 会把相对路径转成绝对路径，避免运行目录变化导致数据库位置混乱。
2. `mkdirSync(dirname(databasePath), { recursive: true })` 会自动创建 `data` 目录，避免数据库文件无法生成。

连接创建后，项目会执行表结构初始化：

```ts
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);
```

`CREATE TABLE IF NOT EXISTS` 的好处是：第一次启动会建表，后续启动不会重复创建，也不会覆盖已有数据。

## 项目中的核心表

本项目里比较重要的表有：

```text
users
password_items
file_assets
app_settings
archive_profiles
```

其中：

`users` 保存登录账号、显示名称、密码哈希和账号状态。

`password_items` 保存密码模块的数据，例如平台名称、账号、密码、手机号、邮箱、备注等。

`file_assets` 统一保存文档、简历、图片、证件、学习资料的文件索引，例如文件标题、分类、原始文件名、存储路径、MIME 类型和大小。

真正的文件内容不直接存进 SQLite，而是放在 `uploads` 目录。数据库只保存文件元信息和路径。这种设计更适合图片、PDF、Word 等二进制文件，避免数据库文件膨胀过快。

## 查询：SELECT

查询数据时，项目会使用 `prepare()` 创建 SQL 语句，然后用 `.get()` 或 `.all()` 执行。

查询单条数据用 `.get()`：

```ts
const row = database
  .prepare('SELECT value FROM app_settings WHERE key = ?')
  .get(key);
```

查询多条数据用 `.all()`：

```ts
const rows = database
  .prepare(`
    SELECT id, title, category, account, password, remark, updated_at
    FROM password_items
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `)
  .all(profileId);
```

这里的 `?` 是占位符。真实参数通过 `.get(key)` 或 `.all(profileId)` 传入。

这就是参数化查询，它比字符串拼接更安全。

错误写法是：

```ts
database.prepare(`SELECT * FROM users WHERE username = '${username}'`);
```

如果 `username` 来自用户输入，就可能引发 SQL 注入。

正确写法是：

```ts
database
  .prepare('SELECT * FROM users WHERE username = ?')
  .get(username);
```

## 新增：INSERT

新增数据通常使用 `INSERT INTO`。

以密码记录为例：

```ts
database
  .prepare(`
    INSERT INTO password_items (
      id, user_id, title, category, login_url, login_method,
      account, password, phone, email, remark, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `)
  .run(
    input.id,
    input.profileId,
    input.title,
    input.category,
    input.loginUrl,
    input.loginMethod,
    input.account,
    input.password,
    input.phone,
    input.email,
    input.remark
  );
```

`.run()` 用于执行不会返回结果集的 SQL，比如 `INSERT`、`UPDATE`、`DELETE`。

项目里新增文件记录时，也是同样思路：

```ts
database
  .prepare(`
    INSERT INTO file_assets (
      id, user_id, module, category, title, original_name,
      storage_path, mime_type, size, remark, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `)
  .run(
    input.id,
    input.profileId,
    input.module,
    input.category,
    input.title,
    input.originalName,
    input.storagePath,
    input.mimeType,
    input.size,
    input.remark
  );
```

## 修改：UPDATE

修改数据使用 `UPDATE`。

项目中更新密码记录时，会同时限制 `id` 和 `user_id`：

```ts
const result = database
  .prepare(`
    UPDATE password_items
    SET
      title = ?,
      category = ?,
      account = ?,
      password = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `)
  .run(
    input.title,
    input.category,
    input.account,
    input.password,
    input.id,
    input.profileId
  );
```

这里有一个很重要的设计点：`WHERE id = ? AND user_id = ?`。

只用 `id` 可能也能定位数据，但加上 `user_id` 可以避免跨用户修改。即使有人拿到了别人的记录 ID，只要当前登录账号不匹配，也无法更新那条数据。

`better-sqlite3` 的 `.run()` 会返回执行结果，其中 `changes` 表示受影响的行数：

```ts
return result.changes > 0;
```

如果 `changes` 是 `0`，说明没有记录被修改。项目可以据此返回“记录不存在”或“无权限操作”。

## 删除：DELETE

删除数据使用 `DELETE`。

项目中删除密码记录：

```ts
const result = database
  .prepare('DELETE FROM password_items WHERE id = ? AND user_id = ?')
  .run(id, profileId);

return result.changes > 0;
```

删除文件记录时，还会加上模块限制：

```ts
const result = database
  .prepare('DELETE FROM file_assets WHERE id = ? AND user_id = ? AND module = ?')
  .run(id, profileId, module);
```

这是因为 `file_assets` 是一个通用文件表，文档、简历、图片、证件、学习资料都存在这里。加上 `module` 可以避免误删其他模块的文件索引。

实际文件删除流程通常分两步：

1. 先删除数据库里的文件索引。
2. 再删除 `uploads` 目录里的真实文件。

项目里这样做是为了保证列表查询不再展示已删除的文件。

## 搜索：LIKE 查询

搜索功能使用 `LIKE`。

例如文件列表搜索：

```ts
const normalizedKeyword = `%${keyword.trim()}%`;

database
  .prepare(`
    SELECT id, module, category, title, original_name, storage_path, mime_type, size, remark, updated_at
    FROM file_assets
    WHERE user_id = ?
      AND module = ?
      AND (title LIKE ? OR category LIKE ? OR original_name LIKE ? OR remark LIKE ?)
    ORDER BY updated_at DESC
  `)
  .all(profileId, module, normalizedKeyword, normalizedKeyword, normalizedKeyword, normalizedKeyword);
```

这里仍然没有拼接 SQL，而是把 `%关键字%` 作为参数传进去。

这样既能做模糊搜索，也能保持参数化查询的安全性。

## 为什么要封装 database.ts

如果每个 API 文件都自己打开数据库、自己写 SQL、自己处理表结构，项目会很快变乱。

所以本项目把数据库操作集中放在 `server/utils/database.ts`：

```text
server/utils/database.ts
```

它负责：

1. 获取数据库路径。
2. 创建 SQLite 连接。
3. 初始化表结构。
4. 执行迁移逻辑。
5. 封装常用增删改查函数。

API 层只关心业务：

```text
接收请求 -> 校验登录和参数 -> 调用 database.ts -> 返回统一响应
```

数据库层只关心数据：

```text
准备 SQL -> 传入参数 -> 执行 -> 返回结果
```

这种分层让代码更容易维护，也方便后续替换数据库或调整表结构。

## better-sqlite3 的几个常用方法

`new Database(path)`：打开 SQLite 数据库文件。

`database.exec(sql)`：执行一整段 SQL，常用于建表、迁移、PRAGMA 设置。

`database.prepare(sql)`：预编译 SQL，返回 statement。

`statement.get(...params)`：查询一条记录。

`statement.all(...params)`：查询多条记录。

`statement.run(...params)`：执行新增、修改、删除。

`result.changes`：查看本次写操作影响了多少行。

## 这个方案适合什么项目

SQLite + better-sqlite3 很适合：

1. 个人工具。
2. 本地知识库。
3. 桌面应用。
4. 内部管理系统原型。
5. 小型单机服务。
6. 数据量不大、部署成本要低的项目。

它不太适合：

1. 高并发写入系统。
2. 多服务实例同时写同一个数据库文件。
3. 需要复杂权限、审计、复制、分片的大型系统。
4. 需要云数据库托管和多人协同运维的业务系统。

本项目是个人档案管理工具，SQLite 的优势非常明显：部署简单、数据文件可备份、开发成本低、迁移方便。

## 手动编辑数据库要注意什么

虽然 `.db` 文件可以用 DB Browser for SQLite、SQLiteStudio 或 `sqlite3` 命令行打开，但不建议在项目运行时随意修改。

更稳妥的做法是：

1. 停止 `npm run dev`。
2. 备份 `data/archive.db`。
3. 使用图形工具或命令行修改。
4. 保存后重新启动项目。

如果启用了 WAL 模式，数据库旁边的 `archive.db-wal` 和 `archive.db-shm` 也属于运行状态的一部分。不要只复制一个 `.db` 文件就认为一定是完整备份，最好在服务停止后再备份。

## 总结

本项目使用 SQLite 保存结构化数据，用 `better-sqlite3` 在 Node.js 后端执行 SQL。它的核心不是“直接编辑 `.db` 文件”，而是把数据库文件当成本地存储引擎，通过封装好的数据库工具函数进行增删改查。

整个流程可以总结为：

```text
前端操作
  -> Nuxt API
  -> 参数校验和鉴权
  -> database.ts
  -> better-sqlite3
  -> SQLite
  -> data/archive.db
```

对于个人档案这种项目来说，这套方案简单、可控、成本低，也足够稳定。只要坚持参数化查询、按用户隔离数据、集中封装数据库访问，就能在保持轻量的同时，拥有清晰可靠的数据层。
