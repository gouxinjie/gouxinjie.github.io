# Python 中的环境变量管理

[[toc]]

![Python环境变量管理](https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80){width=80%}

在日常开发中，我们经常需要处理各种配置信息：数据库连接字符串、API 密钥、调试标志等。将这些信息硬编码在代码中不仅不安全，还会给不同环境的部署带来麻烦。所以使用`.env`文件来优雅地管理环境变量。

## 一、为什么需要环境变量管理？

**传统做法的痛点**

```python
# ❌ 不推荐的硬编码方式
DATABASE_URL = "postgresql://user:password@localhost:5432/mydb"
API_KEY = "sk_1234567890abcdef"
DEBUG = True

def connect_to_database():
    # 直接使用硬编码的配置
    pass
```

这种方式的缺点很明显：

- **安全性风险**：敏感信息暴露在代码中
- **环境切换困难**：开发、测试、生产环境需要不同的配置
- **协作问题**：团队成员需要各自修改配置

  **环境变量的优势**

环境变量提供了以下好处：

- **安全性**：敏感信息与代码分离
- **灵活性**：不同环境使用不同配置
- **一致性**：统一的配置管理方式

## 二、开始使用.env 文件

**第一步：安装必要的库**

```bash
pip install python-dotenv
```

**第二步：创建.env 文件**

在项目根目录下创建`.env`文件：

```ini
# .env - 环境配置文件
# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=myuser
DB_PASSWORD=mypassword

# API配置
API_KEY=your_secret_api_key_here
API_SECRET=your_api_secret_here

# 应用配置
DEBUG=True
LOG_LEVEL=INFO
MAX_CONNECTIONS=100

# 第三方服务
STRIPE_SECRET_KEY=sk_test_1234567890
SENDGRID_API_KEY=SG.abc123def456
```

**第三步：在 Python 代码中加载配置**

```python
import os
from dotenv import load_dotenv

# 加载.env文件
load_dotenv()

class Config:
    """配置类，统一管理所有环境变量"""

    # 数据库配置
    DATABASE_URL = os.getenv('DATABASE_URL')
    DB_HOST = os.getenv('DB_HOST', 'localhost')  # 提供默认值
    DB_PORT = int(os.getenv('DB_PORT', 5432))    # 类型转换
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')

    print(f"DB_HOST: {DB_HOST}")
    print(f"DB_PORT: {DB_PORT}")
    print(f"DB_NAME: {DB_NAME}")
    print(f"DB_USER: {DB_USER}")
    print(f"DB_PASSWORD: {DB_PASSWORD}")

    # API配置
    API_KEY = os.getenv('API_KEY')
    API_SECRET = os.getenv('API_SECRET')

    print(f"API_KEY: {API_KEY}")
    print(f"API_SECRET: {API_SECRET}")

    # 应用配置
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'  # 布尔值转换
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    MAX_CONNECTIONS = int(os.getenv('MAX_CONNECTIONS', 50))

    print(f"DEBUG: {DEBUG}")
    print(f"LOG_LEVEL: {LOG_LEVEL}")
    print(f"MAX_CONNECTIONS: {MAX_CONNECTIONS}")

    # 第三方服务
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

    @classmethod
    def validate(cls):
        """验证必要配置是否存在"""
        required_vars = ['DB_NAME', 'DB_USER', 'API_KEY']
        missing_vars = [var for var in required_vars if not getattr(cls, var)]

        if missing_vars:
            raise ValueError(f"缺少必要的环境变量: {', '.join(missing_vars)}")

# 应用启动时验证配置
Config.validate()
```

运行以上代码，会输出所有环境变量的值。

**如图：**

![环境变量输出](../images/env-1.png)

## 三、多环境配置管理

在实际项目中，我们通常需要为不同环境准备不同的配置。

**多环境配置文件结构**

```
project/
├── .env.example          # 环境变量模板
├── .env.development      # 开发环境
├── .env.testing          # 测试环境
├── .env.production       # 生产环境
├── config/
│   └── __init__.py       # 配置加载逻辑
└── app.py
```

**智能环境检测与加载**

```python
import os
from dotenv import load_dotenv
from pathlib import Path

class EnvironmentConfig:
    """根据环境自动加载对应配置"""

    def __init__(self):
        self.env = os.getenv('APP_ENV', 'development')
        self.base_dir = Path(__file__).parent.parent

    def load_environment(self):
        """加载环境配置"""

        # 加载通用配置
        load_dotenv(self.base_dir / '.env')

        # 加载特定环境配置
        env_file = self.base_dir / f'.env.{self.env}'
        if env_file.exists():
            load_dotenv(env_file, override=True)

        # 验证环境
        self._validate_environment()

    def _validate_environment(self):
        """环境验证"""
        valid_environments = ['development', 'testing', 'production']
        if self.env not in valid_environments:
            raise ValueError(f"无效的环境: {self.env}")

    def get_database_config(self):
        """获取数据库配置"""
        return {
            'host': os.getenv('DB_HOST'),
            'port': int(os.getenv('DB_PORT', 5432)),
            'database': os.getenv('DB_NAME'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
        }

    def is_production(self):
        """判断是否为生产环境"""
        return self.env == 'production'

    def is_development(self):
        """判断是否为开发环境"""
        return self.env == 'development'

# 使用示例
config = EnvironmentConfig()
config.load_environment()

if config.is_development():
    print("运行在开发模式，启用调试功能")
```

**环境特定的配置文件示例**

**.env.development (开发环境)**

```ini
# 开发环境配置
DEBUG=True
LOG_LEVEL=DEBUG
DATABASE_URL=postgresql://localhost:5432/dev_db
API_BASE_URL=http://localhost:8000/api
```

**.env.production (生产环境)**

```ini
# 生产环境配置
DEBUG=False
LOG_LEVEL=WARNING
DATABASE_URL=postgresql://prod-server:5432/prod_db
API_BASE_URL=https://api.example.com
```

## 四、实际项目集成示例

### Flask 应用集成

```python
from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# 从环境变量加载Flask配置
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-fallback-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['DEBUG'] = os.getenv('DEBUG', 'False').lower() == 'true'

@app.route('/')
def hello():
    return f"当前环境: {os.getenv('APP_ENV', 'development')}"

if __name__ == '__main__':
    app.run()
```

### Django 项目集成

在`settings.py`中：

```python
import os
from pathlib import Path
from dotenv import load_dotenv

# 加载.env文件
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

_进一步学习资源：_

- [python-dotenv 官方文档](https://saurabh-kumar.com/python-dotenv/)
- [The Twelve-Factor App 配置原则](https://12factor.net/config)
- [Python 配置管理最佳实践](https://docs.python.org/3/library/configparser.html)
