# Python with 语句与上下文管理讲解

`with` 语句是 Python 中用于**上下文管理**（Context Management）的语法糖，最核心的作用是**确保资源被正确获取和释放**，即使中间发生异常也能保证清理工作被执行。


### 一、为什么需要 `with`？

传统写法打开文件：

```python
f = open("test.txt", "r", encoding="utf-8")
try:
    data = f.read()
finally:
    f.close()          # 必须手动关闭
```

问题：
- 容易忘记写 `close()`
- 异常处理代码冗余
- 多个资源时嵌套很深

使用 `with` 后：

```python
with open("test.txt", "r", encoding="utf-8") as f:
    data = f.read()
# 到这里文件已经自动关闭，即使中间发生异常也会关闭
```

### 二、基本语法

```python
with 表达式 as 变量:
    # 使用资源
    ...
# 离开 with 代码块后，资源自动清理
```

- `表达式` 必须返回一个**上下文管理器**对象
- `as 变量` 是可选的，用来接收 `__enter__` 方法的返回值

常见例子：

```python
# 文件
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("hello")

# 多个文件（Python 3.10+ 支持括号换行）
with (
    open("a.txt") as f1,
    open("b.txt") as f2
):
    ...
```

### 三、上下文管理器协议

一个对象只要实现了以下两个方法，就可以成为上下文管理器：

```python
class MyContext:
    def __enter__(self):
        """进入 with 代码块时调用"""
        print("获取资源")
        return self          # 返回值会赋给 as 后面的变量

    def __exit__(self, exc_type, exc_val, exc_tb):
        """离开 with 代码块时调用（无论是否发生异常）"""
        print("释放资源")
        # 返回 True 表示异常已被处理，不再向外抛出
        # 返回 False 或 None 表示异常继续向外抛出
        return False
```

使用：

```python
with MyContext() as obj:
    print("在 with 内部")
    # 如果这里发生异常，__exit__ 依然会被调用
```

执行顺序：
1. 调用 `__enter__`
2. 执行 `with` 代码块
3. 调用 `__exit__`（即使发生异常也会调用）

### 四、自定义上下文管理器的两种方式

#### 1. 基于类的实现

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.elapsed = time.perf_counter() - self.start
        print(f"耗时：{self.elapsed:.4f} 秒")
        return False          # 不吞掉异常

with Timer():
    # 做一些耗时操作
    sum(range(1000000))
```

#### 2. 基于生成器的实现（推荐，更简洁）

使用 `contextlib.contextmanager` 装饰器：

```python
from contextlib import contextmanager
import time

@contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield          # yield 之前的代码相当于 __enter__
                       # yield 的值会赋给 as 后面的变量
    finally:
        elapsed = time.perf_counter() - start
        print(f"耗时：{elapsed:.4f} 秒")

with timer():
    sum(range(1000000))
```

带返回值的例子：

```python
@contextmanager
def open_file(path, mode="r"):
    f = open(path, mode, encoding="utf-8")
    try:
        yield f
    finally:
        f.close()

with open_file("test.txt") as f:
    print(f.read())
```
### 五、`__exit__` 的三个参数

```python
def __exit__(self, exc_type, exc_val, exc_tb):
    ...
```

| 参数       | 含义                             | 无异常时 |
|------------|----------------------------------|----------|
| `exc_type` | 异常类（如 `ValueError`）        | `None`   |
| `exc_val`  | 异常实例                         | `None`   |
| `exc_tb`   | traceback 对象                   | `None`   |

如果 `__exit__` 返回 `True`，异常会被“吞掉”；返回 `False` 或 `None` 则继续向外抛出。

```python
def __exit__(self, exc_type, exc_val, exc_tb):
    if exc_type is not None:
        print(f"发生异常：{exc_val}")
    return True          # 吞掉异常，程序继续执行
```

### 六、常见实际应用场景

1. **文件操作**（最经典）
2. **数据库连接 / 事务**
3. **线程锁**
4. **临时修改系统状态**（如当前目录、环境变量）
5. **计时、日志、性能监控**
6. **网络连接**
7. **测试中的 mock 环境**

示例：临时切换目录

```python
from contextlib import contextmanager
import os

@contextmanager
def change_dir(path):
    old_dir = os.getcwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(old_dir)

with change_dir("/tmp"):
    print(os.getcwd())      # /tmp
# 自动恢复原来的目录
```


### 七、`contextlib` 常用工具

```python
from contextlib import contextmanager, suppress, redirect_stdout, ExitStack
```

| 工具                  | 作用                              |
|-----------------------|-----------------------------------|
| `@contextmanager`     | 用生成器快速创建上下文管理器      |
| `suppress`            | 忽略指定异常                      |
| `redirect_stdout`     | 临时重定向标准输出                |
| `ExitStack`           | 动态管理多个上下文管理器          |
| `nullcontext`         | 空的上下文管理器（占位用）        |

忽略异常示例：

```python
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove("不存在的文件.txt")
# 文件不存在也不会报错
```


### 八、最佳实践

1. **优先使用 `with` 管理资源**（文件、连接、锁等）
2. 需要自定义时，优先用 `@contextmanager`（代码更少）
3. `__exit__` 中尽量做好清理，不要轻易吞掉异常
4. 多个资源可以用嵌套 `with` 或 `ExitStack`
5. 不要在 `__enter__` / `__exit__` 里写过于复杂的业务逻辑

