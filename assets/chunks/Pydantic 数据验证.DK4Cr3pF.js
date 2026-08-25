const n=`# Pydantic 数据验证讲解

Pydantic 是 Python 中最流行的**数据验证与设置管理**库，深度结合类型注解，能自动做类型转换、数据校验、生成文档和序列化。它是 FastAPI 的核心依赖，也广泛应用于配置管理、API 接口、数据处理等场景。

当前主流版本是 **Pydantic v2**（性能大幅提升，API 更清晰）。


### 一、为什么需要 Pydantic？

传统手动验证：

\`\`\`python
def create_user(data: dict):
    if "name" not in data or not isinstance(data["name"], str):
        raise ValueError("name 必须是字符串")
    if "age" in data and (not isinstance(data["age"], int) or data["age"] < 0):
        raise ValueError("age 必须是非负整数")
    # ... 非常繁琐
\`\`\`

使用 Pydantic 后：

\`\`\`python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

user = User(name="Alice", age=25)      # 自动验证 + 转换
print(user.name, user.age)
\`\`\`

优点：
- 声明式，代码简洁
- 自动类型转换（如 \`"25"\` → \`25\`）
- 详细的错误信息
- 与 IDE / 类型检查器完美配合
- 支持 JSON 序列化/反序列化
- 可生成 JSON Schema


### 二、安装

\`\`\`bash
pip install pydantic
# 如果需要配置管理
pip install pydantic-settings
\`\`\`


### 三、基础模型（BaseModel）

\`\`\`python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str
    age: int
    email: str | None = None          # 可选字段
    is_active: bool = True            # 默认值

# 创建实例（自动验证）
user = User(name="Alice", age="25")  # 字符串 "25" 会自动转成 int
print(user)                          # name='Alice' age=25 email=None is_active=True
print(user.model_dump())             # 转成字典（v2 推荐用法）
print(user.model_dump_json())        # 转成 JSON 字符串
\`\`\`

**常用方法**（Pydantic v2）：

| 方法                  | 作用                         |
|-----------------------|------------------------------|
| \`model_dump()\`        | 转成 Python 字典             |
| \`model_dump_json()\`   | 转成 JSON 字符串             |
| \`model_validate()\`    | 从字典/对象创建并验证        |
| \`model_validate_json()\`| 从 JSON 字符串创建并验证    |
| \`model_json_schema()\` | 生成 JSON Schema             |


### 四、Field：更精细的控制

\`\`\`python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(min_length=2, max_length=50, description="用户名")
    age: int = Field(gt=0, lt=150, example=25)          # gt=大于, lt=小于
    score: float = Field(default=0, ge=0, le=100)       # ge=大于等于
    tags: list[str] = Field(default_factory=list)       # 可变默认值用 default_factory
    password: str = Field(repr=False)                   # 不在 repr 中显示
\`\`\`

常用约束参数：
- \`min_length\` / \`max_length\`（字符串、列表等）
- \`gt\` / \`ge\` / \`lt\` / \`le\`（数值）
- \`pattern\`（正则，字符串）
- \`default\` / \`default_factory\`
- \`description\`、\`example\`（用于文档生成）
- \`alias\`（别名，用于接收/输出不同字段名）


### 五、自定义验证器

#### 1. 字段验证器（\`field_validator\`）

\`\`\`python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    name: str
    age: int

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("姓名不能为空")
        return v.strip().title()          # 可顺便做转换

    @field_validator("age")
    @classmethod
    def age_check(cls, v: int) -> int:
        if v < 0:
            raise ValueError("年龄不能为负数")
        return v
\`\`\`

#### 2. 模型级验证器（\`model_validator\`）

用于跨字段校验：

\`\`\`python
from pydantic import BaseModel, model_validator

class RegisterForm(BaseModel):
    password: str
    confirm_password: str

    @model_validator(mode="after")
    def check_passwords_match(self) -> "RegisterForm":
        if self.password != self.confirm_password:
            raise ValueError("两次密码不一致")
        return self
\`\`\`

\`mode="before"\` 在验证前处理原始数据，\`mode="after"\` 在字段验证后处理。


### 六、嵌套模型与复杂类型

\`\`\`python
from pydantic import BaseModel
from datetime import datetime

class Address(BaseModel):
    city: str
    street: str

class User(BaseModel):
    name: str
    address: Address                    # 嵌套模型
    tags: list[str] = []
    metadata: dict[str, str] = {}
    created_at: datetime

user = User(
    name="Alice",
    address={"city": "北京", "street": "中关村大街"},   # 自动转成 Address 对象
    created_at="2026-08-24T12:00:00"                   # 自动解析时间
)
print(user.address.city)    # 北京
\`\`\`

支持的类型非常丰富：\`list\`、\`dict\`、\`set\`、\`tuple\`、\`Optional\`、\`Union\`、\`Literal\`、自定义类等。


### 七、配置管理（pydantic-settings）

非常适合读取环境变量和 \`.env\` 文件：

\`\`\`python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"          # 忽略未定义的环境变量
    )

    app_name: str = "MyApp"
    debug: bool = False
    database_url: str
    max_connections: int = 10

settings = Settings()
print(settings.database_url)
\`\`\`

对应 \`.env\` 文件：

\`\`\`env
DATABASE_URL=postgresql://user:pass@localhost/db
DEBUG=true
\`\`\`


### 八、常用进阶特性速览

| 特性                    | 说明                              |
|-------------------------|-----------------------------------|
| \`Literal\`               | 限制字段只能是特定值              |
| \`EmailStr\`              | 邮箱格式验证（需安装 \`email-validator\`） |
| \`HttpUrl\`               | URL 验证                          |
| \`conint\` / \`constr\` 等  | 带约束的类型（v2 更推荐用 Field） |
| \`ConfigDict\`            | 模型配置（\`frozen=True\` 不可变、\`extra="forbid"\` 禁止额外字段等） |
| \`computed_field\`        | 计算字段                          |
| \`model_serializer\`      | 自定义序列化逻辑                  |
| \`TypeAdapter\`           | 不需要完整模型也能验证简单类型    |

示例（禁止额外字段 + 不可变）：

\`\`\`python
from pydantic import BaseModel, ConfigDict

class User(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    name: str
    age: int
\`\`\`

### 九、与 FastAPI 的结合（预告）

FastAPI 直接使用 Pydantic 模型做请求体验证和响应序列化：

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    age: int

@app.post("/users/")
def create_user(user: UserCreate):
    return {"message": f"创建用户 {user.name}"}
\`\`\`

这就是为什么学 FastAPI 之前强烈建议先掌握 Pydantic。


### 十、最佳实践

1. **优先使用类型注解 + Field 约束**，少写手动 if 判断
2. 可变默认值一定要用 \`default_factory\`
3. 生产环境建议设置 \`extra="forbid"\`，防止多余字段悄悄进入
4. 复杂校验优先用 \`field_validator\` / \`model_validator\`
5. 配置类继承 \`BaseSettings\`，业务数据模型继承 \`BaseModel\`
6. v2 中统一使用 \`model_dump()\`、\`model_validate()\` 等方法（旧的 \`.dict()\`、\`.parse_obj()\` 已弃用）
`;export{n as default};
