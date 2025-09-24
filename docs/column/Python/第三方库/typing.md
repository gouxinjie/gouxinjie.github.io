# Python `typing` 模块详解（新手友好版）

---

[[toc]]

## 1. 什么是 `typing`？

`typing` 是 Python 的 **类型提示（type hints）库**，它不改变 Python 本身的动态特性，但能让我们：

- **给变量、函数、类加上类型标注**，提高代码可读性；
- **帮助 IDE 和工具做静态检查**，提前发现 bug；
- **方便团队协作**，别人一眼就能看懂你函数需要什么类型、返回什么。

📌 注意：类型提示 **不会影响代码运行**，只是“标注”，主要用来提示和检查。

## 2. 基础用法

### （1）变量类型标注

```python
from typing import List, Dict

name: str = "Alice"
age: int = 18
scores: List[int] = [95, 88, 76]
info: Dict[str, int] = {"math": 95, "english": 88}
```

- `name: str` → 表示 `name` 是字符串
- `age: int` → 表示 `age` 是整数
- `scores: List[int]` → 表示 `scores` 是整数列表
- `info: Dict[str, int]` → 表示 `info` 是 key 为字符串，value 为整数的字典

### （2）函数类型标注

```python
from typing import List

def add(x: int, y: int) -> int:
    return x + y

def average(nums: List[int]) -> float:
    return sum(nums) / len(nums)
```

- 参数和返回值都可以标注
- `-> int` 表示返回值类型是整数
- `-> float` 表示返回值类型是浮点数

### （3）可选类型（`Optional`）

有时候参数可以是某种类型，也可以是 `None`：

```python
from typing import Optional

def greet(name: Optional[str]) -> str:
    if name:
        return f"Hello, {name}"
    return "Hello, stranger"
```

这里 `Optional[str]` 等价于 `Union[str, None]`。

### （4）联合类型（`Union`）

表示一个值可以是几种类型：

```python
from typing import Union

def square(x: Union[int, float]) -> float:
    return x * x
```

`x` 可以是 `int` 或 `float`。

### （5）任意类型（`Any`）

如果你不确定类型，可以用 `Any`：

```python
from typing import Any

def process(data: Any) -> None:
    print("接收到:", data)
```

👉 `Any` 就是“啥都行”。

## 3. 常用类型总结

| 类型                    | 含义                               |
| ----------------------- | ---------------------------------- |
| `List[int]`             | 整数列表                           |
| `Dict[str, float]`      | 键是字符串，值是浮点数的字典       |
| `Tuple[int, str]`       | 一个元组，里面是 `(int, str)`      |
| `Set[str]`              | 字符串集合                         |
| `Optional[T]`           | 类型 T 或 None                     |
| `Union[T1, T2]`         | 类型 T1 或 T2                      |
| `Any`                   | 任意类型                           |
| `Callable[[T1, T2], R]` | 一个函数，参数是 T1/T2，返回值是 R |

示例：

```python
from typing import Tuple, Set, Callable

def get_point() -> Tuple[int, int]:
    return (3, 5)

def unique_names() -> Set[str]:
    return {"Alice", "Bob"}

def operate(func: Callable[[int, int], int], x: int, y: int) -> int:
    return func(x, y)
```

## 4. 高级用法（简单提一下）

- **`TypedDict`**：可以给字典定义固定结构
- **`Literal`**：限制值只能是几个固定的常量
- **`Protocol`**：接口风格的类型检查（鸭子类型）

这些在大型项目中更常用，新手可以先跳过。

## 5. 学生成绩管理系统 Demo（含 typing 标注）

```python
from typing import List, Dict, Optional, Tuple

# 学生成绩类型：课程 -> 分数
Scores = Dict[str, float]

# 学生类型
class Student:
    def __init__(self, name: str, age: int, scores: Optional[Scores] = None) -> None:
        self.name: str = name
        self.age: int = age
        self.scores: Scores = scores or {}

    def add_score(self, subject: str, score: float) -> None:
        """添加或更新成绩"""
        self.scores[subject] = score

    def get_average(self) -> Optional[float]:
        """计算平均分"""
        if not self.scores:
            return None
        return sum(self.scores.values()) / len(self.scores)

    def __repr__(self) -> str:
        return f"Student(name={self.name}, age={self.age}, scores={self.scores})"


# 成绩管理系统
class GradeSystem:
    def __init__(self) -> None:
        self.students: List[Student] = []

    def add_student(self, student: Student) -> None:
        """添加学生"""
        self.students.append(student)

    def find_student(self, name: str) -> Optional[Student]:
        """按名字查找学生"""
        for s in self.students:
            if s.name == name:
                return s
        return None

    def get_top_student(self) -> Optional[Tuple[str, float]]:
        """获取平均分最高的学生 (名字, 平均分)"""
        if not self.students:
            return None
        top = max(
            self.students,
            key=lambda s: s.get_average() or 0.0
        )
        return (top.name, top.get_average() or 0.0)


# 使用示例
if __name__ == "__main__":
    # 初始化系统
    system = GradeSystem()

    # 添加学生
    alice = Student("Alice", 18)
    bob = Student("Bob", 19)

    system.add_student(alice)
    system.add_student(bob)

    # 添加成绩
    alice.add_score("math", 95)
    alice.add_score("english", 88)

    bob.add_score("math", 76)
    bob.add_score("english", 82)
    bob.add_score("physics", 90)

    # 查询学生
    stu = system.find_student("Alice")
    print("找到学生:", stu)

    # 平均分
    print("Alice 平均分:", stu.get_average() if stu else None)

    # 最强学霸
    top = system.get_top_student()
    print("学霸是:", top)
```

**📝 运行结果（示例）**

```
找到学生: Student(name=Alice, age=18, scores={'math': 95, 'english': 88})
Alice 平均分: 91.5
学霸是: ('Bob', 82.66666666666667)
```

**💡 这里的 `typing` 用法**

1. `Scores = Dict[str, float]` → 定义别名，更清晰表达“课程 -> 分数”。

2. `Optional[float]` → 平均分可能不存在（没成绩时返回 `None`）。

3. `List[Student]` → 学生列表。

4. `Tuple[str, float]` → 返回 `(名字, 平均分)` 的组合。
