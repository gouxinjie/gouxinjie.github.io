
# 后端开发规范

<CopyMarkdown />

本文档为后端开发团队的核心约束指南。 所有生成的代码、注释、数据库设计必须遵循以下规则。注释必须使用简体中文。

## 一、通用规范

### 1.1 类型安全

- Python 项目必须使用类型注解（Type Hints）
- Node.js 项目必须使用 TypeScript
- 禁止使用 `any`（TS）或 `Any`（Python）
- 所有函数、变量、API 响应必须定义类型

### 1.2 代码风格

- Python 遵循 PEP 8 规范，使用 Black 格式化
- Node.js 遵循 ESLint 规则（@typescript-eslint / node/recommended）
- 禁止使用 `eslint-disable` 或 `# noqa` 跳过检查
- 优先使用异步编程（async/await）

### 1.3 路径规范

- **禁止使用 `../../` 这种相对引入路径**
- **统一使用 `@/` 或项目根目录别名进行模块引入**
- Python 示例：`from src.utils.logger import logger`
- Node.js 示例：`import { logger } from '@/utils/logger';`

### 1.4 API 请求规范

- 所有请求必须包含 `userId`
- 必须处理 loading / error
- 不允许假设接口结构

### 1.5 错误处理

统一返回：

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "错误描述（中文）",
  "data": null
}
```

### 1.6 成功响应

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 1.7 代码清理

必须移除：

- 未使用变量
- 未使用函数
- 未使用 import
- 未使用样式

## 二、Python 规范

### 2.1 项目结构

```
src/
├── api/                 # API 路由层
│   ├── routes/
│   │   ├── user.py
│   │   └── order.py
│   └── __init__.py
├── services/            # 业务逻辑层
│   ├── user_service.py
│   └── order_service.py
├── models/              # 数据模型层
│   ├── user.py
│   └── order.py
├── repositories/        # 数据访问层
│   ├── user_repo.py
│   └── order_repo.py
├── utils/               # 工具函数目录
│   ├── logger.py        # 日志封装
│   ├── response.py      # 统一响应封装
│   └── validate.py      # 验证工具
├── config/              # 配置目录
│   ├── database.py      # 数据库配置
│   └── settings.py      # 应用配置
├── middleware/          # 中间件
│   ├── auth.py          # 鉴权中间件
│   └── error_handler.py # 错误处理中间件
├── types/               # 类型定义目录
│   ├── api.py           # API 相关类型
│   └── models.py        # 数据模型类型
├── constants/           # 常量定义
├── exceptions/          # 自定义异常
└── main.py              # 应用入口
```

### 2.2 函数注释

所有函数**必须添加文档字符串**，包含：

- 功能说明
- 参数说明
- 返回值
- 异常说明

**示例：**

```python
from typing import Optional
from datetime import datetime

def format_date(date: datetime | int, fmt: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    格式化日期时间

    Args:
        date: 日期对象或时间戳
        fmt: 格式模板，默认为 '%Y-%m-%d %H:%M:%S'

    Returns:
        格式化后的日期字符串

    Raises:
        ValueError: 当 date 参数无效时抛出错误
    """
    # 实现代码
    pass
```

### 2.3 异步规范

- 所有 IO 操作必须使用异步（数据库查询、HTTP 请求、文件读写）
- 使用 `async def` 定义异步函数
- 使用 `await` 调用异步操作

**示例：**

```python
from sqlalchemy.ext.asyncio import AsyncSession

async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    """
    根据用户ID获取用户信息

    Args:
        db: 数据库会话
        user_id: 用户ID

    Returns:
        用户对象，不存在时返回 None
    """
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
```

## 三、Node.js 规范

### 3.1 项目结构

```
src/
├── api/                 # API 路由层
│   ├── routes/
│   │   ├── user.ts
│   │   └── order.ts
│   └── index.ts
├── services/            # 业务逻辑层
│   ├── userService.ts
│   └── orderService.ts
├── models/              # 数据模型层
│   ├── User.ts
│   └── Order.ts
├── repositories/        # 数据访问层
│   ├── userRepo.ts
│   └── orderRepo.ts
├── utils/               # 工具函数目录
│   ├── logger.ts        # 日志封装
│   ├── response.ts      # 统一响应封装
│   └── validate.ts      # 验证工具
├── config/              # 配置目录
│   ├── database.ts      # 数据库配置
│   └── settings.ts      # 应用配置
├── middleware/          # 中间件
│   ├── auth.ts          # 鉴权中间件
│   └── errorHandler.ts  # 错误处理中间件
├── types/               # 类型定义目录
│   ├── api.d.ts         # API 相关类型
│   └── models.d.ts      # 数据模型类型
├── constants/           # 常量定义
├── exceptions/          # 自定义异常
└── app.ts               # 应用入口
```

### 3.2 函数注释

所有函数**必须添加 JSDoc 注释**，包含：

- 功能说明
- 参数说明
- 返回值
- 异常说明

**示例：**

```typescript
/**
 * 格式化日期时间
 * @param date - 日期对象或时间戳
 * @param format - 格式模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @throws 当 date 参数无效时抛出错误
 */
export const formatDate = (date: Date | number, format: string): string => {
  // 实现代码
};
```

### 3.3 异步规范

- 所有 IO 操作必须使用异步
- 使用 `async/await` 语法
- 禁止回调函数（Callback Hell）

**示例：**

```typescript
import { Pool } from 'pg';

/**
 * 根据用户ID获取用户信息
 * @param pool - 数据库连接池
 * @param userId - 用户ID
 * @returns 用户对象，不存在时返回 null
 */
export const getUserById = async (pool: Pool, userId: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0] || null;
};
```

## 四、数据库规范

### 4.1 通用规范

- 必须使用参数化查询
- 必须有中文注释
- 禁止拼接 SQL
- 表名使用小写，单词间用下划线分隔
- 字段名使用小写，单词间用下划线分隔

### 4.2 MySQL 规范

**连接示例：**

```python
import aiomysql
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_db_connection():
    """
    获取 MySQL 数据库连接
    """
    conn = await aiomysql.connect(
        host='localhost',
        port=3306,
        user='user',
        password='password',
        db='database',
        charset='utf8mb4'
    )
    try:
        yield conn
    finally:
        conn.close()
```

**查询示例：**

```python
async def get_user_by_id(conn, user_id: int) -> Optional[dict]:
    """
    根据用户ID查询用户信息

    Args:
        conn: 数据库连接
        user_id: 用户ID

    Returns:
        用户字典，不存在时返回 None
    """
    async with conn.cursor(aiomysql.DictCursor) as cur:
        await cur.execute(
            "SELECT id, username, email FROM users WHERE id = %s",
            (user_id,)
        )
        return await cur.fetchone()
```

### 4.3 PostgreSQL 规范

**连接示例：**

```python
import asyncpg
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_db_connection():
    """
    获取 PostgreSQL 数据库连接
    """
    conn = await asyncpg.connect(
        host='localhost',
        port=5432,
        user='user',
        password='password',
        database='database'
    )
    try:
        yield conn
    finally:
        await conn.close()
```

**查询示例：**

```python
async def get_user_by_id(conn, user_id: int) -> Optional[asyncpg.Record]:
    """
    根据用户ID查询用户信息

    Args:
        conn: 数据库连接
        user_id: 用户ID

    Returns:
        用户记录，不存在时返回 None
    """
    return await conn.fetchrow(
        "SELECT id, username, email FROM users WHERE id = $1",
        user_id
    )
```

### 4.4 SQLite 规范

**连接示例：**

```python
import aiosqlite
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_db_connection():
    """
    获取 SQLite 数据库连接
    """
    conn = await aiosqlite.connect('database.db')
    try:
        yield conn
    finally:
        await conn.close()
```

**查询示例：**

```python
async def get_user_by_id(conn, user_id: int) -> Optional[tuple]:
    """
    根据用户ID查询用户信息

    Args:
        conn: 数据库连接
        user_id: 用户ID

    Returns:
        用户元组，不存在时返回 None
    """
    async with conn.execute(
        "SELECT id, username, email FROM users WHERE id = ?",
        (user_id,)
    ) as cursor:
        return await cursor.fetchone()
```

## 五、依赖管理

### 5.1 包管理器

- **Python 项目统一使用 pip 或 poetry 进行依赖管理**
- **Node.js 项目统一使用 pnpm 进行依赖安装**
- 禁止使用 npm 或 yarn（Node.js）
- 必须包含 `requirements.txt`（Python）或 `package.json`（Node.js）

**Python 示例：**

```bash
pip install -r requirements.txt
```

**Node.js 示例：**

```bash
pnpm install <package-name>
```

## 六、接口封装规范

### 6.1 API 路由注释

所有 API 路由函数**必须添加注释**，包含：

- 接口说明
- 请求参数
- 响应数据
- 异常说明

**Python 示例（FastAPI）：**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/users", tags=["用户管理"])

@router.get("/{user_id}")
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ResponseModel[UserInfo]:
    """
    获取用户信息

    Args:
        user_id: 用户ID
        db: 数据库会话
        current_user: 当前登录用户

    Returns:
        用户信息

    Raises:
        HTTPException: 用户不存在时返回 404
    """
    user = await user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return success_response(data=user)
```

**Node.js 示例（Express）：**

```typescript
import { Router, Request, Response } from 'express';

const router = Router();

/**
 * 获取用户信息
 * @route GET /api/users/:userId
 * @param req.params.userId - 用户ID
 * @param req.user - 当前登录用户
 * @returns 用户信息
 * @throws 404 - 用户不存在
 */
router.get('/:userId', authMiddleware, async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await userService.getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      code: 'USER_NOT_FOUND',
      message: '用户不存在',
      data: null
    });
  }

  return res.json({
    success: true,
    code: 200,
    message: '操作成功',
    data: user
  });
});
```

## 七、安全规范

1. **敏感信息处理**
   禁止在代码中硬编码 API Key、数据库密码、JWT Secret 等，必须使用环境变量。

2. **SQL 注入防护**
   所有数据库查询语句**必须使用参数化查询**，避免直接拼接用户输入。

3. **CSRF 防护**
   所有 POST 请求**必须包含 CSRF 令牌**，并在服务器端验证。

4. **XSS 防护**
   所有用户输入**必须进行 HTML 转义**，防止 XSS 攻击。

5. **密码安全**
   密码必须使用 bcrypt 或 argon2 进行哈希存储，禁止明文存储。

6. **JWT 安全**
   - 使用强密钥签名
   - 设置合理的过期时间
   - 刷新令牌机制

## 八、AI 行为约束（核心）

AI 必须遵守：

1. 不允许编造接口
2. 不允许假设数据库结构
3. 不允许跳过鉴权
4. 不允许省略错误处理
5. 不允许生成未使用代码
6. 不允许修改无关文件
7. 不明确需求必须询问

## 九、开发工作流（必须执行）

### 9.1 新功能开发流程

1. 分析需求
2. 确认接口（如不明确必须询问）
3. 定义类型（Python Type Hints / TypeScript）
4. 设计数据库表结构
5. 编写数据访问层
6. 编写业务逻辑层
7. 编写 API 路由层
8. 添加错误处理
9. 编写单元测试
10. 自检是否符合 AGENTS.md

### 9.2 修改代码流程

1. 阅读原代码
2. 理解业务逻辑
3. 给出修改方案
4. 再进行修改

禁止：直接修改代码而不分析

### 9.3 Debug 流程

1. 分析报错
2. 定位问题
3. 找到根因
4. 提供修复方案

## 十、输出规范（强制）

1. 必须输出完整代码
2. 必须包含 import
3. 必须使用代码块
4. 禁止伪代码
5. 必须有中文注释
6. 修改代码必须说明变更点

## 十一、自检机制（必须执行）

输出前必须检查：

1. 是否使用类型注解（Python）或 TypeScript 且无 any
2. 是否包含 userId（API 请求）
3. 是否有错误处理
4. 是否符合目录结构
5. 是否有未使用代码
6. 是否符合代码风格规范
7. 是否有中文注释
8. **是否使用项目根目录路径而非 `../../` 相对路径**
9. **@author 是否为 gouxinjie**
10. 是否使用参数化查询（数据库操作）
11. 是否使用异步编程（IO 操作）

不符合必须自动修正

## 十二、性能规范

- 数据库查询必须添加索引
- 避免 N+1 查询问题
- 使用连接池管理数据库连接
- 大数据量查询使用分页
- 使用缓存（Redis）减少数据库压力
- API 响应时间控制在 200ms 以内

## 十三、日志规范

- 错误必须记录日志
- API 请求失败必须打印错误信息
- 日志必须包含请求ID、用户ID、时间戳
- 禁止输出敏感信息（token、密码、数据库连接字符串）
- 开发环境允许 print/console，生产环境必须使用日志框架

**Python 日志示例：**

```python
import logging
import uuid
from contextvars import ContextVar

request_id: ContextVar[str] = ContextVar('request_id', default='')

logger = logging.getLogger(__name__)

def log_request(user_id: int, action: str, status: str):
    """
    记录请求日志

    Args:
        user_id: 用户ID
        action: 操作描述
        status: 操作状态
    """
    logger.info(
        f"[{request_id.get()}] 用户 {user_id} {action} - 状态: {status}",
        extra={
            'request_id': request_id.get(),
            'user_id': user_id,
            'action': action,
            'status': status
        }
    )
```

**Node.js 日志示例：**

```typescript
import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<string>();

export const logRequest = (userId: number, action: string, status: string): void => {
  const requestId = asyncLocalStorage.getStore() || 'unknown';
  console.log(`[${requestId}] 用户 ${userId} ${action} - 状态: ${status}`);
};
```

## 十四、测试规范

- 所有业务逻辑必须编写单元测试
- API 路由必须编写集成测试
- 测试覆盖率不低于 80%
- 使用 pytest（Python）或 Jest（Node.js）

**Python 测试示例：**

```python
import pytest
from unittest.mock import AsyncMock, MagicMock

@pytest.mark.asyncio
async def test_get_user_by_id():
    """
    测试根据用户ID获取用户信息
    """
    # 准备
    mock_db = AsyncMock()
    mock_user = MagicMock(id=1, username='test', email='test@example.com')
    mock_db.execute.return_value.scalar_one_or_none.return_value = mock_user

    # 执行
    result = await user_service.get_user_by_id(mock_db, 1)

    # 验证
    assert result.id == 1
    assert result.username == 'test'
```

**Node.js 测试示例：**

```typescript
import { describe, it, expect, jest } from '@jest/globals';

describe('UserService', () => {
  it('should return user by id', async () => {
    // 准备
    const mockPool = {
      query: jest.fn().mockResolvedValue({ rows: [{ id: 1, username: 'test' }] })
    };

    // 执行
    const result = await userService.getUserById(mockPool as any, 1);

    // 验证
    expect(result).toEqual({ id: 1, username: 'test' });
  });
});
```

## 十五、MCP / 工具调用规范

1. 优先使用工具获取数据
2. 不允许伪造数据
3. 工具失败必须兜底
4. 不确定必须询问用户

## 十六、终极原则

> 优先保证代码质量，其次是正确性，最后才是开发速度

## 十七、附则

- 所有代码必须自动校验本规范
- 特殊情况必须说明原因
- 违反规范必须拒绝生成代码

```

---

### 主要变更说明：

| 变更项 | 说明 |
|--------|------|
| **语言支持** | 新增 Python 和 Node.js 双后端语言规范 |
| **数据库支持** | 新增 MySQL、PostgreSQL、SQLite 三种数据库的异步连接和查询示例 |
| **项目结构** | 按后端分层架构（API / Service / Repository / Model）重新设计 |
| **异步规范** | 强制所有 IO 操作使用 async/await |
| **类型安全** | Python 强制 Type Hints，Node.js 强制 TypeScript |
| **日志规范** | 新增请求追踪（request_id）和上下文变量规范 |
| **测试规范** | 新增 pytest 和 Jest 测试示例 |
| **@author** | 统一为 `gouxinjie` |
| **路径规范** | 禁止 `../../`，使用项目根目录别名 |
| **包管理** | Python 使用 pip/poetry，Node.js 使用 pnpm |
| **自检机制** | 新增数据库参数化查询和异步编程检查项 |
