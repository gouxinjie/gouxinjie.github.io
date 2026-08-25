const n=`
# Python 函数与装饰器入门

函数是 Python 中最核心的抽象工具之一，装饰器则是在函数基础上发展出来的强大语法糖。掌握这两部分，能让你写出更清晰、可复用、可扩展的代码。

### 一、函数基础回顾

#### 1. 最简单的函数

\`\`\`python
def greet(name: str) -> str:
    """向某人打招呼"""
    return f"Hello, {name}!"

print(greet("Alice"))  # Hello, Alice!
\`\`\`

- \`def\` 定义函数
- 参数可以加类型注解（推荐）
- \`->\` 后面是返回值类型注解
- 文档字符串（docstring）用三引号写在函数体第一行

#### 2. 参数的几种形式

\`\`\`python
def example(a, b=10, *args, c, d=20, **kwargs):
    print(f"a={a}, b={b}, args={args}, c={c}, d={d}, kwargs={kwargs}")
\`\`\`

| 参数类型       | 写法          | 说明                     |
|----------------|---------------|--------------------------|
| 位置参数       | \`a\`           | 必须按顺序传             |
| 默认参数       | \`b=10\`        | 可省略                   |
| 可变位置参数   | \`*args\`       | 接收多余的位置参数（元组）|
| 仅限关键字参数 | \`c\`（*后面）  | 必须用关键字传递         |
| 可变关键字参数 | \`**kwargs\`    | 接收多余的关键字参数（字典）|

调用示例：

\`\`\`python
example(1, 2, 3, 4, c=5, e=6, f=7)
# a=1, b=2, args=(3, 4), c=5, d=20, kwargs={'e': 6, 'f': 7}
\`\`\`

**注意**：默认参数只计算一次，不要用可变对象（list、dict）作为默认值。

\`\`\`python
# 错误示范
def bad_append(item, lst=[]):
    lst.append(item)
    return lst

# 正确写法
def good_append(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
\`\`\`


### 二、函数是“一等公民”

在 Python 中，函数可以像普通变量一样被传递、赋值、作为参数和返回值。

\`\`\`python
def add(x, y):
    return x + y

def sub(x, y):
    return x - y

def calculate(func, x, y):
    return func(x, y)

print(calculate(add, 10, 5))  # 15
print(calculate(sub, 10, 5))  # 5
\`\`\`

这是装饰器和很多高级用法的基础。

### 三、闭包（Closure）

内部函数可以记住并访问外部函数的变量，即使外部函数已经执行完毕。

\`\`\`python
def make_multiplier(n):
    def multiplier(x):
        return x * n      # 引用了外部的 n
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15
\`\`\`

闭包常用于：
- 创建带状态的函数
- 实现装饰器
- 延迟计算


### 四、装饰器入门

装饰器本质上是一个**接收函数作为参数、并返回一个新函数**的高阶函数。它用来在不修改原函数代码的情况下，增加额外功能。

#### 1. 最简单的装饰器

\`\`\`python
def simple_decorator(func):
    def wrapper():
        print("函数执行前")
        result = func()
        print("函数执行后")
        return result
    return wrapper

@simple_decorator          # 语法糖
def say_hello():
    print("Hello!")

say_hello()
\`\`\`

输出：
\`\`\`
函数执行前
Hello!
函数执行后
\`\`\`

\`@simple_decorator\` 等价于：

\`\`\`python
say_hello = simple_decorator(say_hello)
\`\`\`

#### 2. 带参数的函数如何装饰

原函数有参数时，\`wrapper\` 也要能接收参数：

\`\`\`python
def log_decorator(func):
    def wrapper(*args, **kwargs):   # 接收任意参数
        print(f"调用函数: {func.__name__}")
        print(f"参数: args={args}, kwargs={kwargs}")
        result = func(*args, **kwargs)
        print(f"返回值: {result}")
        return result
    return wrapper

@log_decorator
def add(a, b):
    return a + b

print(add(3, 5))
\`\`\`

#### 3. 保留原函数信息（重要！）

直接写装饰器会丢失原函数的 \`__name__\`、\`__doc__\` 等信息。推荐使用 \`functools.wraps\`：

\`\`\`python
from functools import wraps

def log_decorator(func):
    @wraps(func)          # 关键关键推荐加上
    def wrapper(*args, **kwargs):
        print(f"调用: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper
\`\`\`


### 五、常见实用装饰器示例

#### 1. 计时装饰器

\`\`\`python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} 耗时: {end - start:.4f} 秒")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)

slow_function()
\`\`\`

#### 2. 重试装饰器（简化版）

\`\`\`python
from functools import wraps
import time

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"第 {attempt} 次失败: {e}")
                    if attempt == max_attempts:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def unstable_api():
    # 模拟偶尔失败的操作
    import random
    if random.random() < 0.7:
        raise ConnectionError("网络错误")
    return "成功"
\`\`\`

注意：这里 \`retry\` 是一个**带参数的装饰器**，所以多包了一层。

#### 3. 权限检查示例（思想）

\`\`\`python
def require_admin(func):
    @wraps(func)
    def wrapper(user, *args, **kwargs):
        if not user.get("is_admin"):
            raise PermissionError("需要管理员权限")
        return func(user, *args, **kwargs)
    return wrapper
\`\`\`


### 六、装饰器的执行顺序

多个装饰器时，**靠近函数的先执行**（从下往上应用）：

\`\`\`python
@decorator_a
@decorator_b
def my_func():
    pass

# 等价于
my_func = decorator_a(decorator_b(my_func))
\`\`\`

`;export{n as default};
