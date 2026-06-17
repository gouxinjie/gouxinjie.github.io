const n=`
# Python 类型注解：从能跑到优雅

> \`Python\` 是动态语言，但这并不意味着你只能“随缘写代码”。

从 \`Python 3.5\` 开始，**类型注解（Type Hints）** 正式进入语言核心。
它**不影响运行时**，却能极大提升：

* 可读性
* IDE 智能提示
* 静态检查能力
* 大型项目的可维护性

## 一、什么是 Python 类型注解？

最直观的理解：

> **给变量、函数参数、返回值“贴标签”，告诉人和工具：这是什么类型**

\`\`\`python
def add(a: int, b: int) -> int:
    return a + b
\`\`\`

* \`a: int\`：参数类型
* \`-> int\`：返回值类型

⚠️ **重要：类型注解不会影响运行**

\`\`\`python
add("1", "2")  # 运行时不会报错
\`\`\`

Python 解释器不会检查类型，**检查的是工具（IDE / mypy / pyright）**。

## 二、为什么要写类型注解？

### 1️⃣ IDE 智能提示直接起飞 🚀

\`\`\`python
def get_name(user: dict) -> str:
    return user["name"]
\`\`\`

IDE 能帮你：

* 自动补全
* 参数提示
* 重构安全

### 2️⃣ 提前发现 bug（静态检查）

\`\`\`python
def sum_list(nums: list[int]) -> int:
    return sum(nums)

sum_list(["1", "2"])  # ❌ 静态检查直接报错
\`\`\`

运行前就能发现问题，而不是等到线上炸。

### 3️⃣ 大型项目必备（尤其是多人协作）

* 不用翻实现
* 看签名就知道怎么用
* 类似 **TypeScript 对 JavaScript 的价值**

## 三、基础类型注解

### 1️⃣ 内置基础类型

\`\`\`python
name: str = "Alice"
age: int = 18
height: float = 1.72
is_admin: bool = False
\`\`\`

### 2️⃣ 容器类型（Python 3.9+ 推荐写法）

\`\`\`python
numbers: list[int] = [1, 2, 3]
user: dict[str, str] = {"name": "Tom"}
tags: set[str] = {"python", "typing"}
point: tuple[int, int] = (10, 20)
\`\`\`

👉 **Python 3.9 之前写法**

\`\`\`python
from typing import List, Dict, Tuple

numbers: List[int]
\`\`\`

## 四、函数类型注解（重点）

### 1️⃣ 参数 + 返回值

\`\`\`python
def greet(name: str) -> str:
    return f"Hello {name}"
\`\`\`

### 2️⃣ 没有返回值

\`\`\`python
def log(msg: str) -> None:
    print(msg)
\`\`\`

\`None\` ≠ 没写返回值
👉 表示“**明确不返回任何东西**”

### 3️⃣ 可选参数（Optional）

\`\`\`python
from typing import Optional

def get_user(id: int) -> Optional[str]:
    if id == 0:
        return None
    return "Tom"
\`\`\`

等价写法（Python 3.10+）👇

\`\`\`python
def get_user(id: int) -> str | None:
    ...
\`\`\`

## 五、Union / Literal / Any

### 1️⃣ Union（多种类型之一）

\`\`\`python
from typing import Union

def parse_id(id: Union[int, str]) -> int:
    return int(id)
\`\`\`

Python 3.10+：

\`\`\`python
def parse_id(id: int | str) -> int:
    return int(id)
\`\`\`

### 2️⃣ Literal（字面量类型）

\`\`\`python
from typing import Literal

def set_theme(theme: Literal["light", "dark"]) -> None:
    ...
\`\`\`

👉 适合 **配置项 / 状态值**

### 3️⃣ Any（慎用）

\`\`\`python
from typing import Any

def parse(data: Any) -> Any:
    return data
\`\`\`

⚠️ \`Any\` = 放弃类型检查
👉 **不到万不得已别用**

## 六、类型别名（让类型更可读）

\`\`\`python
User = dict[str, str]

def get_user() -> User:
    return {"name": "Tom"}
\`\`\`

复杂类型尤其有用：

\`\`\`python
Response = dict[str, int | str | bool]
\`\`\`

## 七、TypedDict（字典结构约束）

普通 dict 太宽松？

\`\`\`python
from typing import TypedDict

class User(TypedDict):
    id: int
    name: str
    active: bool

def get_user() -> User:
    return {
        "id": 1,
        "name": "Tom",
        "active": True
    }
\`\`\`

👉 非常适合：

* JSON
* API 返回值
* 配置对象

## 八、Class & 方法类型注解

\`\`\`python
class UserService:
    def __init__(self, name: str):
        self.name: str = name

    def get_name(self) -> str:
        return self.name
\`\`\`

## 九、泛型（进阶但很香）

\`\`\`python
from typing import TypeVar, Generic

T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, value: T):
        self.value = value

    def get(self) -> T:
        return self.value
\`\`\`

使用：

\`\`\`python
box = Box
box.get()  # 推断为 int
\`\`\`

👉 类似 TypeScript 泛型


---

**扩展资源**：
- [Python 官方 typing 模块文档](https://docs.python.org/3/library/typing.html)
- [mypy 文档](https://mypy.readthedocs.io/)
- [Python 类型提示指南](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)
- [Real Python 类型提示教程](https://realpython.com/python-type-checking/)
`;export{n as default};
