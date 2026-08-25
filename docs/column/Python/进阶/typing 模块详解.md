# Python `typing` 模块详解

# Web框架FastAPI

**Python `typing` 模块**是标准库中用于**静态类型提示**（type hints）的核心模块。它让代码在运行时行为不变的前提下，能被类型检查器（如 mypy、pyright、Pylance）理解，从而提前发现错误、提升可读性和 IDE 智能提示。

从 Python 3.5（PEP 484）引入，后续版本不断增强，许多常用类型已逐渐“内建化”。


### 1. 为什么需要 typing？

Python 是动态语言，运行时才知道类型。类型提示是**可选的注解**，主要服务于：

- 静态类型检查
- IDE 自动补全与跳转
- 文档可读性
- 大型项目维护

运行时几乎不执行这些注解（除非使用 `typing.get_type_hints()` 等）。

### 2. 基本类型与集合类型

#### 2.1 内置类型（推荐用法，Python 3.9+）

从 3.9 开始（PEP 585），可以直接使用内置泛型，不再需要从 `typing` 导入：

```python
# Python 3.9+ 推荐
def process(items: list[int]) -> dict[str, float]:
    ...
```

#### 2.2 旧式写法（仍兼容，但已弃用）

```python
from typing import List, Dict, Tuple, Set, FrozenSet

def process(items: List[int]) -> Dict[str, float]:
    ...
```

**对照表**：

| 用途          | 3.9+ 推荐写法       | 旧写法（typing）     |
|---------------|---------------------|----------------------|
| 列表          | `list[int]`         | `List[int]`          |
| 字典          | `dict[str, int]`    | `Dict[str, int]`     |
| 元组          | `tuple[int, str]`   | `Tuple[int, str]`    |
| 集合          | `set[str]`          | `Set[str]`           |
| 不可变集合    | `frozenset[int]`    | `FrozenSet[int]`     |

**注意**：`tuple[int, ...]` 表示任意长度的同质元组；`tuple[int, str]` 表示固定长度。

### 3. 常用特殊类型

#### 3.1 `Optional` 与 `Union`

```python
from typing import Optional, Union

# Optional[X] 等价于 X | None（3.10+）或 Union[X, None]
def find_user(id: int) -> Optional[str]:
    ...

# 多个可能类型
def parse(value: Union[int, str, float]) -> float:
    ...
```

**Python 3.10+ 更推荐使用 `|`**：

```python
def find_user(id: int) -> str | None:
    ...

def parse(value: int | str | float) -> float:
    ...
```

#### 3.2 `Any`、`object`、`NoReturn`

```python
from typing import Any, NoReturn

def accept_anything(x: Any) -> None: ...      # 关闭类型检查
def never_returns() -> NoReturn:              # 永远不返回（如抛异常、sys.exit）
    raise RuntimeError("永远不会回来")
```

- `Any`：完全绕过类型检查，尽量少用。
- `object`：所有类型的基类，比 `Any` 更安全（不能随意调用方法）。

#### 3.3 `Callable`

```python
from typing import Callable

# Callable[[参数类型...], 返回类型]
Handler = Callable[[str, int], bool]

def register(callback: Handler) -> None:
    ...
```

Python 3.9+ 也可用 `collections.abc.Callable`。

### 4. 类型变量与泛型（Generics）

#### 4.1 `TypeVar`

```python
from typing import TypeVar, Sequence

T = TypeVar("T")                    # 无约束
NumberT = TypeVar("NumberT", int, float)  # 受约束

def first(items: Sequence[T]) -> T:
    return items[0]
```

#### 4.2 自定义泛型类

```python
from typing import Generic, TypeVar

T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, content: T) -> None:
        self.content = content

    def get(self) -> T:
        return self.content

box = Box[int](42)
```

Python 3.12+ 支持更简洁的语法（PEP 695）：

```python
class Box[T]:
    def __init__(self, content: T) -> None:
        self.content = content
```

### 5. 结构化类型：`TypedDict`、`Protocol`、`NamedTuple`

#### 5.1 `TypedDict`（字典结构检查）

```python
from typing import TypedDict

class User(TypedDict):
    name: str
    age: int
    email: str | None

def create_user(data: User) -> None:
    ...
```

支持 `total=False`（部分字段可选）和继承。

#### 5.2 `Protocol`（结构化子类型 / 鸭子类型）

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

def render(obj: Drawable) -> None:
    obj.draw()
```

只要对象有 `draw` 方法即可，无需显式继承。

#### 5.3 `NamedTuple`

```python
from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float
```

### 6. 类型别名与 `NewType`

```python
from typing import NewType

UserId = NewType("UserId", int)     # 创建“名义上不同”的类型
Vector = list[float]                # 简单别名（3.12+ 可用 type 语句）

def get_user(user_id: UserId) -> str:
    ...
```

`NewType` 在运行时仍是 `int`，但类型检查器会把它当作独立类型。

Python 3.12+ 推荐：

```python
type Vector = list[float]
type UserId = NewType("UserId", int)  # 仍需 NewType
```

### 7. 其他实用工具

| 工具              | 用途 |
|-------------------|------|
| `Literal`         | 字面量类型（`Literal["a", "b"]`） |
| `Final`           | 声明不可重新赋值的常量 |
| `ClassVar`        | 类变量（非实例变量） |
| `Annotated`       | 附加元数据（常与 Pydantic、FastAPI 配合） |
| `TypeGuard`       | 自定义类型收窄函数 |
| `Self`（3.11+）   | 表示当前类自身 |
| `Never`（3.11+）  | 空类型（比 `NoReturn` 更通用） |
| `overload`        | 函数重载声明 |

示例：

```python
from typing import Literal, Final, overload

Mode = Literal["r", "w", "a"]
MAX_SIZE: Final = 1024

@overload
def process(x: int) -> str: ...
@overload
def process(x: str) -> int: ...
def process(x: int | str) -> str | int:
    ...
```

### 8. 版本演进与最佳实践（截至 2026）

| Python 版本 | 重要变化 |
|-------------|----------|
| 3.9         | 内置集合支持泛型（`list[int]`） |
| 3.10        | `X \| Y` 联合类型、`match` 模式匹配 |
| 3.11        | `Self`、`Never`、`TypeVarTuple`、异常组相关 |
| 3.12        | `type` 语句、更简洁的泛型语法（PEP 695） |
| 3.13+       | 继续优化性能与类型系统 |

**推荐实践**：

1. **优先使用内置类型**（`list[int]` 而非 `List[int]`）。
2. **3.10+ 优先用 `|` 代替 `Union`/`Optional`**。
3. 只在真正需要时使用 `Any`。
4. 大型项目配合 **mypy** 或 **pyright** + CI。
5. 运行时需要类型信息时，使用 `typing.get_type_hints()` 或 `inspect`。
6. 避免过度注解简单脚本；对公共 API 和复杂逻辑优先添加。

---

### 9. 快速示例汇总

```python
from typing import (
    TypedDict, Protocol, TypeVar, Callable,
    Literal, Final, Self
)

T = TypeVar("T")

class Config(TypedDict):
    host: str
    port: int

class Closable(Protocol):
    def close(self) -> None: ...

def identity(x: T) -> T:
    return x

def connect(cfg: Config, on_error: Callable[[Exception], None]) -> None:
    ...

class Builder:
    def set_name(self, name: str) -> Self:
        ...
        return self

MODE: Final[Literal["dev", "prod"]] = "dev"
```
