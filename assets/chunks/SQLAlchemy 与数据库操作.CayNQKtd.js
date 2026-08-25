const n=`# SQLAlchemy 与数据库操作讲解

SQLAlchemy 是 Python 中最强大、最流行的 SQL 工具包，同时支持 **ORM（对象关系映射）** 和 **Core（核心表达式）** 两种风格。现代项目推荐使用 **SQLAlchemy 2.0** 风格，API 更清晰、类型提示更好。

### 一、核心概念

| 概念          | 说明 |
|---------------|------|
| **Engine**    | 数据库连接池的入口，负责管理连接 |
| **Session**   | ORM 的工作单元，负责对象的增删改查 |
| **Model**     | 普通 Python 类，对应数据库表 |
| **Core**      | 更接近 SQL 的表达式语言，性能更高、更灵活 |
| **ORM**       | 用对象操作数据库，开发效率高 |

大多数 Web 项目（尤其 FastAPI）使用 ORM 风格即可。


### 二、安装

\`\`\`bash
pip install sqlalchemy
# 根据数据库选择驱动
pip install psycopg2-binary     # PostgreSQL
pip install pymysql             # MySQL
pip install aiosqlite           # SQLite 异步（可选）
\`\`\`

### 三、快速开始（SQLAlchemy 2.0 风格）

#### 1. 创建引擎与基类

\`\`\`python
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Mapped, mapped_column

# 数据库连接地址
DATABASE_URL = "sqlite:///./test.db"
# PostgreSQL 示例：postgresql://user:password@localhost/dbname

engine = create_engine(
    DATABASE_URL,
    echo=True,              # 打印实际执行的 SQL（开发时建议开启）
)

class Base(DeclarativeBase):
    pass

# 创建 Session 工厂
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
\`\`\`

#### 2. 定义模型

\`\`\`python
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    # 一对多关系
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    author: Mapped["User"] = relationship(back_populates="posts")
\`\`\`

#### 3. 创建表

\`\`\`python
Base.metadata.create_all(bind=engine)
\`\`\`

### 四、最常用的 CRUD 操作

\`\`\`python
from sqlalchemy import select

# 获取 Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
\`\`\`

#### 1. 增加（Create）

\`\`\`python
db = SessionLocal()

user = User(name="Alice", email="alice@example.com", age=25)
db.add(user)
db.commit()                # 提交事务
db.refresh(user)           # 刷新对象（获取数据库生成的 id 等）
print(user.id)

# 批量添加
db.add_all([
    User(name="Bob", email="bob@example.com"),
    User(name="Charlie", email="charlie@example.com"),
])
db.commit()
\`\`\`

#### 2. 查询（Read）

\`\`\`python
# 查询所有
users = db.scalars(select(User)).all()

# 按主键查询
user = db.get(User, 1)

# 条件查询
stmt = select(User).where(User.age > 20).order_by(User.id.desc())
users = db.scalars(stmt).all()

# 查询第一条
user = db.scalars(select(User).where(User.email == "alice@example.com")).first()

# 只获取部分字段
stmt = select(User.name, User.email)
results = db.execute(stmt).all()
\`\`\`

#### 3. 更新（Update）

\`\`\`python
user = db.get(User, 1)
if user:
    user.age = 26
    user.name = "Alice Updated"
    db.commit()
\`\`\`

或者使用 \`update\` 语句（适合批量）：

\`\`\`python
from sqlalchemy import update

stmt = update(User).where(User.id == 1).values(age=26)
db.execute(stmt)
db.commit()
\`\`\`

#### 4. 删除（Delete）

\`\`\`python
user = db.get(User, 1)
if user:
    db.delete(user)
    db.commit()
\`\`\`


### 五、关系查询

\`\`\`python
# 创建用户和文章
user = User(name="Alice", email="alice@example.com")
post1 = Post(title="第一篇文章", content="内容...", author=user)
post2 = Post(title="第二篇文章", content="内容...", author=user)

db.add(user)          # 级联添加 posts（需要配置 cascade）
db.commit()

# 查询用户时加载文章
user = db.scalars(select(User).where(User.id == 1)).first()
print(user.posts)     # 自动加载相关文章（默认 lazy）
\`\`\`

常用关系加载策略：
- \`lazy="select"\`（默认）
- \`lazy="joined"\`（连表一次加载）
- \`lazy="selectin"\`（推荐，适合一对多）


### 六、FastAPI 中的典型用法

\`\`\`python
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    user = User(name=name, email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user
\`\`\`


### 七、事务与异常处理

\`\`\`python
db = SessionLocal()
try:
    user = User(name="Alice", email="alice@example.com")
    db.add(user)
    db.commit()
except Exception:
    db.rollback()          # 出错回滚
    raise
finally:
    db.close()
\`\`\`

在 FastAPI 的依赖中，通常把 \`commit\` 放在业务逻辑成功后，异常时自动回滚。


### 八、Alembic 数据库迁移（强烈建议）

直接 \`create_all\` 只适合开发阶段。生产环境应使用 **Alembic** 做版本化迁移。

\`\`\`bash
pip install alembic
alembic init alembic
\`\`\`

常用命令：
\`\`\`bash
alembic revision --autogenerate -m "create users table"
alembic upgrade head
alembic downgrade -1
\`\`\`


### 九、最佳实践

1. **使用 SQLAlchemy 2.0 风格**（\`Mapped\`、\`mapped_column\`、\`select()\`）
2. **Session 生命周期要短**，不要长期持有
3. 生产环境关闭 \`echo=True\`
4. 合理使用索引（\`index=True\`、\`unique=True\`）
5. 关系加载注意 N+1 问题，必要时用 \`selectinload\` 或 \`joinedload\`
6. 密码等敏感字段不要明文存储
7. 大型项目推荐把 Model、Session、CRUD 分层
8. 优先使用 Alembic 管理表结构变更


### 十、Core 与 ORM 如何选择？

- **ORM**：开发速度快，适合大多数业务系统
- **Core**：需要极致性能、复杂 SQL、批量操作时更合适

两者可以在同一项目中混合使用。
`;export{n as default};
