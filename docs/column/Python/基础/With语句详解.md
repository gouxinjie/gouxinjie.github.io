
# Python 的 with 语句：把「资源管理」这件事交给语法

在 `Python` 里，你经常会看到这样的代码：

```python
with open(sql_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()
```

很多人知道它“更安全”，但并不真正清楚：

* `with` 到底解决了什么问题？
* 它和 `try / finally` 有什么关系？
* 自己能不能写一个 `with`？

这篇文章一次讲清楚。

## 一、with 语句是干什么的？

::: tip 一句话概括

`with` 用来自动管理资源的“申请与释放

:::

常见资源包括：

* 文件
* 网络连接
* 数据库连接
* 锁（Lock）
* 临时状态

核心目标只有一个：
👉 **不管中间发生什么，最后一定能正确清理**

## 二、不用 with 会发生什么？

以文件操作为例：

```python
f = open("test.txt", "r")
content = f.read()
f.close()
```

看起来没问题，但一旦中间出错：

```python
f = open("test.txt", "r")
content = f.read()
raise Exception("boom")
f.close()  # 永远执行不到
```

资源泄漏风险立刻出现。

## 三、传统解法：try / finally

```python
f = open("test.txt", "r")
try:
    content = f.read()
finally:
    f.close()
```

✅ 安全
❌ 冗长
❌ 容易忘

## 四、with 的本质：语法级 try / finally

```python
with open("test.txt", "r") as f:
    content = f.read()
```

等价于（简化版）👇

```python
f = open("test.txt", "r")
try:
    content = f.read()
finally:
    f.close()
```

👉 **with 只是把“模板代码”交给了语法**

## 五、上下文管理器（Context Manager）

能被 `with` 使用的对象，必须满足一个条件：

> **实现上下文管理协议**

也就是这两个方法：

```python
__enter__()
__exit__(exc_type, exc_val, exc_tb)
```

### 5.1 一个最简单的例子

```python
class FileManager:
    def __init__(self, filename):
        self.filename = filename

    def __enter__(self):
        self.file = open(self.filename, "r")
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()
```

使用：

```python
with FileManager("test.txt") as f:
    print(f.read())
```

### 5.2 `__enter__` 和 `__exit__` 到底干了什么？

 **`__enter__`**

* 在 `with` 代码块开始前执行
* 返回值绑定给 `as` 后的变量

```python
with obj() as x:
    ...
# x 就是 obj.__enter__() 的返回值
```

**`__exit__`**

```python
__exit__(exc_type, exc_val, exc_tb)
```

* 代码块结束时一定执行
* 不论是否发生异常
* 可以选择是否“吞掉异常”

```python
def __exit__(self, exc_type, exc_val, exc_tb):
    return True  # 异常被吞掉
```

👉 一般 **不建议吞异常**

## 六、常见 with 使用场景

### 6.1 文件操作（最常见）

```python
with open("a.txt") as f:
    ...
```

### 6.2 锁（多线程）

```python
from threading import Lock

lock = Lock()

with lock:
    ...
```

### 6.3 数据库连接

```python
with db.connect() as conn:
    ...
```

### 6.4 临时修改状态

```python
with tempfile.TemporaryDirectory() as tmp:
    ...
```
