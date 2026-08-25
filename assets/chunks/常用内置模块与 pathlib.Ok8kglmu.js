const n=`# Python 常用内置模块与 pathlib 讲解

Python 标准库非常丰富，很多常见需求不需要安装第三方包就能解决。这里重点讲解 **\`pathlib\`**（现代路径处理推荐方式），并介绍其他高频内置模块。

### 一、pathlib —— 现代路径处理（强烈推荐）

\`pathlib\` 从 Python 3.4 加入，提供面向对象的路径操作，比 \`os.path\` 更清晰、更安全。

#### 1. 基本使用

\`\`\`python
from pathlib import Path

# 创建路径对象
p = Path("folder/subfolder/file.txt")
p = Path.home() / "Documents" / "test.txt"     # 用 / 拼接路径（跨平台）
p = Path.cwd()                                 # 当前工作目录

print(p)                    # folder/subfolder/file.txt
print(p.name)               # file.txt
print(p.stem)               # file
print(p.suffix)             # .txt
print(p.parent)             # folder/subfolder
print(p.parts)              # ('folder', 'subfolder', 'file.txt')
\`\`\`

#### 2. 路径判断与信息

\`\`\`python
p = Path("test.txt")

p.exists()          # 是否存在
p.is_file()         # 是否是文件
p.is_dir()          # 是否是目录
p.stat().st_size    # 文件大小（字节）
p.stat().st_mtime   # 修改时间戳
\`\`\`

#### 3. 创建目录与文件

\`\`\`python
# 创建目录（parents=True 相当于 mkdir -p）
Path("a/b/c").mkdir(parents=True, exist_ok=True)

# 创建空文件
Path("hello.txt").touch()

# 写入文本（推荐）
Path("hello.txt").write_text("你好，Python！", encoding="utf-8")

# 读取文本
content = Path("hello.txt").read_text(encoding="utf-8")
print(content)

# 写入/读取字节
Path("data.bin").write_bytes(b"\\x00\\x01")
data = Path("data.bin").read_bytes()
\`\`\`

#### 4. 遍历目录

\`\`\`python
p = Path(".")

# 遍历当前目录下所有条目
for item in p.iterdir():
    print(item)

# 递归查找所有 .py 文件
for py_file in p.rglob("*.py"):
    print(py_file)

# 只在当前目录查找
for txt in p.glob("*.txt"):
    print(txt)
\`\`\`

#### 5. 常用操作对比（pathlib vs os.path）

| 操作             | pathlib 写法                  | 旧 os.path 写法              |
|------------------|-------------------------------|------------------------------|
| 拼接路径         | \`p / "file.txt"\`              | \`os.path.join(p, "file.txt")\`|
| 获取文件名       | \`p.name\`                      | \`os.path.basename(p)\`        |
| 获取父目录       | \`p.parent\`                    | \`os.path.dirname(p)\`         |
| 绝对路径         | \`p.resolve()\`                 | \`os.path.abspath(p)\`         |
| 存在判断         | \`p.exists()\`                  | \`os.path.exists(p)\`          |
| 读取文本         | \`p.read_text()\`               | 需要手动 open                |

**建议**：新代码优先使用 \`pathlib\`，可读性和跨平台性都更好。



### 二、其他常用内置模块

#### 1. \`sys\` —— 与 Python 解释器交互

\`\`\`python
import sys

print(sys.version)          # Python 版本
print(sys.platform)         # 操作系统
print(sys.argv)             # 命令行参数列表
sys.exit(1)                 # 退出程序（状态码 1 表示异常）
print(sys.path)             # 模块搜索路径
\`\`\`

#### 2. \`json\` —— JSON 序列化

\`\`\`python
import json

data = {"name": "Alice", "age": 25}

# 转换为 JSON 字符串
json_str = json.dumps(data, ensure_ascii=False, indent=2)

# 从字符串解析
obj = json.loads(json_str)

# 直接操作文件
Path("data.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
data = json.loads(Path("data.json").read_text(encoding="utf-8"))
\`\`\`

#### 3. \`datetime\` —— 日期时间

\`\`\`python
from datetime import datetime, timedelta, date

now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))

# 计算时间差
tomorrow = now + timedelta(days=1)
diff = tomorrow - now

# 解析字符串
dt = datetime.strptime("2026-08-24 12:00:00", "%Y-%m-%d %H:%M:%S")
\`\`\`

#### 4. \`collections\` —— 增强型容器

\`\`\`python
from collections import defaultdict, Counter, deque, namedtuple

# 带默认值的字典
d = defaultdict(int)
d["a"] += 1

# 计数器
c = Counter(["a", "b", "a", "c", "b", "a"])
print(c.most_common(2))     # [('a', 3), ('b', 2)]

# 双端队列（高效两端操作）
q = deque([1, 2, 3])
q.appendleft(0)
q.pop()

# 命名元组
Point = namedtuple("Point", ["x", "y"])
p = Point(10, 20)
print(p.x, p.y)
\`\`\`

#### 5. \`random\` —— 随机数

\`\`\`python
import random

random.random()             # 0~1 浮点数
random.randint(1, 10)       # 1~10 整数
random.choice(["a", "b", "c"])
random.shuffle(list)        # 原地打乱
random.sample(range(100), 5)  # 不重复抽样
\`\`\`

#### 6. \`re\` —— 正则表达式（入门）

\`\`\`python
import re

text = "我的手机号是 13812345678"
match = re.search(r"1[3-9]\\d{9}", text)
if match:
    print(match.group())     # 13812345678

# 替换
new_text = re.sub(r"\\d+", "***", text)
\`\`\`

#### 7. \`functools\` —— 函数工具

\`\`\`python
from functools import wraps, lru_cache, partial

# 缓存（装饰器）
@lru_cache(maxsize=128)
def fib(n):
    ...

# 偏函数
def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
print(square(5))            # 25
\`\`\`

#### 8. \`itertools\` —— 迭代器工具

\`\`\`python
from itertools import count, cycle, chain, groupby, combinations

# 无限计数
for i in count(10, 2):      # 10, 12, 14...
    if i > 20:
        break

# 链式拼接
list(chain([1, 2], [3, 4]))  # [1, 2, 3, 4]
\`\`\`

#### 9. 其他高频模块速览

| 模块          | 主要用途                     |
|---------------|------------------------------|
| \`os\`          | 环境变量、进程、系统相关     |
| \`shutil\`      | 高级文件操作（复制、移动、删除目录） |
| \`logging\`     | 日志记录（生产环境必备）     |
| \`argparse\`    | 命令行参数解析               |
| \`typing\`      | 类型注解（已单独讲解）       |
| \`unittest\` / \`pytest\`（第三方） | 测试               |
| \`math\`        | 数学函数                     |
| \`statistics\`  | 统计计算                     |
| \`urllib\`      | 简单网络请求（更推荐 requests/httpx） |



### 三、实际项目中的推荐组合

处理文件路径和读写时，推荐组合：

\`\`\`python
from pathlib import Path
import json
from datetime import datetime

data_dir = Path("data")
data_dir.mkdir(exist_ok=True)

file_path = data_dir / f"result_{datetime.now():%Y%m%d}.json"

data = {"time": datetime.now().isoformat(), "value": 42}
file_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
\`\`\`
`;export{n as default};
