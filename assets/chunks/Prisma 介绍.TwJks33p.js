const n=`# Prisma 介绍

## 1. 什么是 Prisma

Prisma 是一个现代化 Node.js/TypeScript ORM（对象关系映射），提供了类型安全的数据库访问层。它包含三个核心工具：

- **Prisma Schema**：用声明式语法定义数据模型、关系和数据库连接
- **Prisma Client**：自动生成的类型安全查询构建器，在代码中直接调用
- **Prisma Migrate**：基于 Schema 的数据库迁移系统，自动同步 Schema 与数据库结构

与传统 ORM 相比，Prisma 的核心优势在于**完全类型安全**——所有查询结果的类型都由 Schema 自动推导，无需手动维护类型定义。

## 2. 核心概念

### 2.1 Schema 文件（schema.prisma）

Schema 文件是 Prisma 的唯一配置入口，包含三部分：

\`\`\`prisma
// 1. 数据源 — 连接哪个数据库
datasource db {
  provider = "sqlite"            // 数据库类型
  url      = env("DATABASE_URL") // 连接地址，通过环境变量注入
}

// 2. 生成器 — 生成什么客户端
generator client {
  provider = "prisma-client-js"  // 生成 TypeScript/JavaScript 客户端
}

// 3. 数据模型 — 定义表和字段
model User {
  id    String @id @default(cuid())
  name  String
  email String @unique
}
\`\`\`

### 2.2 Prisma Client

Schema 定义后，运行 \`prisma generate\` 生成客户端。之后在代码中这样使用：

\`\`\`ts
import { prisma } from "@/server/db";

// 查询所有用户
const users = await prisma.user.findMany();

// 条件查询
const user = await prisma.user.findUnique({
  where: { id: "xxx" },
  select: { name: true, email: true }, // 只选择需要的字段
});

// 创建
const newUser = await prisma.user.create({
  data: { name: "张三", email: "zhangsan@example.com" },
});

// 更新
await prisma.user.update({
  where: { id: "xxx" },
  data: { name: "李四" },
});

// 删除
await prisma.user.delete({ where: { id: "xxx" } });
\`\`\`

### 2.3 关联查询（include / select）

Prisma 对关联数据的处理非常自然：

\`\`\`ts
// 查询用户及其所有记录
const userWithLogs = await prisma.user.findUnique({
  where: { id: userId },
  include: { activityLogs: true },
});

// 查询记录并带上所属标签
const records = await prisma.activityLog.findMany({
  where: { date: "2026-07-01" },
  include: { tag: true },
});
\`\`\`

## 3. 本项目中的 Prisma

### 3.1 技术选型

当前项目使用 \`SQLite\` 作为数据库，\`Prisma\` 作为唯一的数据库访问层。后续可平滑迁移到 \`PostgreSQL\`，只需修改 \`datasource\` 配置。

### 3.2 项目中的 Prisma 相关文件

\`\`\`
prisma/
├── schema.prisma    # 数据模型定义（核心文件）
├── seed.ts          # 种子数据脚本，用于初始化测试数据
└── dev.db           # SQLite 数据库文件（不提交到 Git）

src/
└── server/
    └── db.ts        # Prisma Client 单例（全局复用，避免开发时热更新创建多个实例）
\`\`\`

### 3.3 当前数据模型

| 表名 | 说明 | 核心字段 |
|------|------|---------|
| \`User\` | 用户表 | \`id\`, \`name\`, \`phone\`, \`passwordHash\` |
| \`ActivityLog\` | 活动记录表 | \`id\`, \`userId\`, \`tagId\`, \`title\`, \`date\`, \`timeType\`, \`startTime\`, \`status\` |
| \`ActivityTag\` | 活动标签表 | \`id\`, \`userId\`, \`name\`, \`color\`, \`category\`, \`sortOrder\` |
| \`UserSettings\` | 用户设置表 | \`id\`, \`userId\`, \`weekStartsOn\`, \`showLunar\`, \`defaultView\` |

### 3.4 db.ts — 客户端单例

\`\`\`ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 确保开发环境下热更新不会重复创建 PrismaClient 实例
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
\`\`\`

## 4. 常用命令

\`\`\`bash
# 根据 schema.prisma 生成 Prisma Client
npx prisma generate

# 将 schema 变更推送到数据库（开发阶段用，不生成迁移文件）
npx prisma db push

# 创建数据库迁移（生产环境推荐）
npx prisma migrate dev --name 描述本次变更

# 执行迁移（生产环境）
npx prisma migrate deploy

# 填充种子数据
npx prisma db seed

# 打开 Prisma Studio（可视化数据库浏览器）
npx prisma studio
\`\`\`

## 5. 最佳实践

### 5.1 查询必须参数化

Prisma 所有查询方法天然支持参数化，无需手动拼接 SQL：

\`\`\`ts
// ✅ 正确 — Prisma 自动参数化
const user = await prisma.user.findUnique({
  where: { phone: inputPhone },
});

// ❌ 错误 — 永远不要用 $queryRaw 拼接字符串
// await prisma.$queryRaw\`SELECT * FROM User WHERE phone = \${inputPhone}\`;
\`\`\`

### 5.2 善用 select 减少数据传输

\`\`\`ts
// ✅ 只查需要的字段
const records = await prisma.activityLog.findMany({
  where: { userId, date },
  select: { id: true, title: true, tagId: true, startTime: true },
});

// ❌ 不推荐 — 返回所有字段（包含不需要的 createdAt、updatedAt 等）
// const records = await prisma.activityLog.findMany({ where: { userId, date } });
\`\`\`

### 5.3 批量操作使用事务

涉及多表写入时使用事务保证数据一致性：

\`\`\`ts
await prisma.$transaction([
  prisma.activityLog.create({ data: { ... } }),
  prisma.user.update({ where: { id: userId }, data: { ... } }),
]);
\`\`\`

### 5.4 索引优化

在常用查询条件上加索引，提升查询性能。本项目中的索引示例：

\`\`\`prisma
model ActivityLog {
  // ...
  @@index([userId, date])  // 按用户+日期查询是最常见的场景
}
\`\`\`

### 5.5 枚举值使用 @default

对于状态、类型等枚举字段，始终设置合理的默认值：

\`\`\`prisma
model ActivityLog {
  timeType String @default("all_day")  // 默认为全天事件
  status   String @default("logged")   // 默认为已记录
}
\`\`\`

## 6. 迁移到 PostgreSQL

当项目需要从 SQLite 迁移到 PostgreSQL 时，只需三步：

1. **修改 \`schema.prisma\` 的数据源**：

\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

2. **安装 PostgreSQL 驱动**：

\`\`\`bash
npm install pg
npm install -D @types/pg
\`\`\`

3. **修改 \`DATABASE_URL\` 环境变量**：

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/lime_calendar"
\`\`\`

完成后运行 \`npx prisma migrate dev\` 创建新迁移即可。业务代码无需修改，因为 Prisma Client 屏蔽了底层数据库差异。

> **注意**：SQLite 和 PostgreSQL 在部分字段行为上有差异（如 \`@default(autoincrement())\`、JSON 字段等），迁移前建议先在测试环境验证。

## 7. 常见问题

### 7.1 "PrismaClient is not defined"

确保 \`prisma generate\` 已执行，且 \`@prisma/client\` 已安装。

### 7.2 开发时出现 "Too many PrismaClient instances"

这是热更新导致的，项目已通过 \`db.ts\` 中的 \`globalForPrisma\` 模式解决。

### 7.3 Schema 改了但查询报错

每次修改 \`schema.prisma\` 后必须运行以下命令之一：
- \`npx prisma db push\`（开发阶段，直接同步）
- \`npx prisma migrate dev\`（需要生成迁移记录）
- 然后运行 \`npx prisma generate\` 重新生成客户端

## 8. 参考资源

- [Prisma 官方文档](https://www.prisma.io/docs)
- [Prisma Schema 参考](https://www.prisma.io/docs/orm/prisma-schema)
- [Prisma Client API](https://www.prisma.io/docs/orm/prisma-client)
`;export{n as default};
