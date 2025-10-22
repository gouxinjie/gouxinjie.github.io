# 🔍 SQL 查询的本质：隐藏在代码背后的数学运算

> “SQL 语句看起来像是在查数据，但其实你在写数学公式。”

很多人学习 SQL 时，只关注语法：`SELECT`、`WHERE`、`JOIN`…… 但很少有人意识到：**SQL 查询的本质其实是“数学运算”** —— 它来自于一种严谨的数学理论：**关系代数（Relational Algebra）**。

::: tip 注意

非关系型数据库（NoSQL）可“不适用”关系代数，它们也有自己的逻辑数学基础。

:::

## 一、SQL 背后的数学世界

`SQL（Structured Query Language）`并不是凭空发明的。它诞生于上世纪 70 年代，基于 IBM 科学家 **E.F. Codd** 提出的 **关系模型（Relational Model）**。

在这个模型里：

| 关系模型概念                      | SQL 对应概念 |
| --------------------------------- | ------------ |
| 关系（Relation）                  | 表（Table）  |
| 元组（Tuple）                     | 行（Row）    |
| 属性（Attribute）                 | 列（Column） |
| 关系运算（Relational Operations） | SQL 查询语句 |

换句话说，SQL 语句其实是对“数据集合”的数学操作。

## 二、SQL 查询 ≈ 集合运算

从数学视角看，SQL 查询操作的本质就是对集合的各种变换和组合。数据库就是一个**集合运算引擎**，执行的其实是一系列关系代数运算。

| SQL 操作          | 对应的数学思想         | 含义               |
| ----------------- | ---------------------- | ------------------ |
| `SELECT ... FROM` | 投影（Projection）     | 选取集合中的部分列 |
| `WHERE`           | 选择（Selection）      | 筛选满足条件的行   |
| `JOIN`            | 笛卡尔积 + 选择        | 合并两个集合并匹配 |
| `UNION`           | 并集（Union）          | 合并集合并去重     |
| `INTERSECT`       | 交集（Intersection）   | 取共同的部分       |
| `EXCEPT`          | 差集（Difference）     | 去掉重叠的部分     |
| `GROUP BY`        | 聚合（Aggregation）    | 按组进行统计       |
| `DISTINCT`        | 去重（Set Uniqueness） | 消除重复元素       |

## 三、六大基本关系代数运算 与 SQL 对照

让我们一步步拆开来看这些“数学运算”与 SQL 的对应关系。

### ① 选择（Selection）σ

从表中选出满足条件的行。

**SQL 示例：**

```sql
SELECT * FROM Employee WHERE salary > 10000;
```

**代数表达式：**

```
σ(salary > 10000)(Employee)
```

解释：对集合 `Employee` 进行筛选，只保留工资大于 10000 的记录。

### ② 投影（Projection）π

选出需要的列。

**SQL 示例：**

```sql
SELECT name, salary FROM Employee;
```

**代数表达式：**

```
π(name, salary)(Employee)
```

解释：只保留 `name` 和 `salary` 这两列，去掉其他列。

### ③ 并集（Union）∪

合并两个结构相同的集合。

**SQL 示例：**

```sql
SELECT name FROM Employee_US
UNION
SELECT name FROM Employee_EU;
```

**代数表达式：**

```
Employee_US ∪ Employee_EU
```

注意：`UNION` 默认会去重。

### ④ 差集（Difference）−

求在一个集合中有而另一个没有的部分。

**SQL 示例：**

```sql
SELECT name FROM Employee_US
EXCEPT
SELECT name FROM Employee_EU;
```

**代数表达式：**

```
Employee_US − Employee_EU
```

### ⑤ 笛卡尔积（Cartesian Product）×

**SQL 示例：**

```sql
SELECT * FROM Department, Employee;
-- 或者
SELECT * FROM Department CROSS JOIN Employee;
```

**代数表达式：**

```
Department × Employee
```

解释：每个部门与每个员工都组合成一行结果。

### ⑥ 交集（Intersection）∩

**SQL 示例：**

```sql
SELECT name FROM Employee_US
INTERSECT
SELECT name FROM Employee_EU;
```

**代数表达式：**

```
Employee_US ∩ Employee_EU
```

取两个表中共有的数据。

## 四、扩展关系代数运算：SQL 的高级操作

### ① 连接（Join）⋈

连接其实是“笛卡尔积 + 选择”的组合。

**SQL 示例：**

```sql
SELECT e.name, d.dept_name
FROM Employee e
JOIN Department d ON e.dept_id = d.id;
```

**代数表达式：**

```
σ(e.dept_id = d.id)(Employee × Department)
```

### ② 聚合（Aggregation）γ

对数据分组并统计。

**SQL 示例：**

```sql
SELECT dept_id, AVG(salary)
FROM Employee
GROUP BY dept_id;
```

**代数表达式：**

```
γ(dept_id, AVG(salary))(Employee)
```

### ③ 排序（Sorting）τ

**SQL 示例：**

```sql
SELECT * FROM Employee ORDER BY salary DESC;
```

**代数表达式（扩展）：**

```
τ(salary DESC)(Employee)
```

### ④ 重命名（Rename）ρ

**SQL 示例：**

```sql
SELECT e.name AS employee_name FROM Employee e;
```

**代数表达式：**

```
ρ(e(employee_name))(Employee)
```

## 五、完整示例：SQL 到 关系代数的映射

**SQL 查询：**

```sql
SELECT d.name, AVG(e.salary)
FROM Department d
JOIN Employee e ON e.dept_id = d.id
WHERE e.salary > 10000
GROUP BY d.name;
```

**对应的关系代数：**

```
γ(d.name, AVG(e.salary))
(
  σ(e.salary > 10000)
  (
    (Employee e) ⋈ (Department d)
  )
)
```

**逐步解释：**

1. `(Employee e) ⋈ (Department d)` → 连接员工与部门
2. `σ(e.salary > 10000)` → 筛选工资大于 10000
3. `γ(d.name, AVG(e.salary))` → 按部门分组并计算平均工资

最终结果：按部门统计高薪员工的平均工资。

## 六、SQL 与 关系代数的对照速查表

| 关系代数符号 | 名称               | SQL 对应           |
| ------------ | ------------------ | ------------------ |
| σ            | 选择（Selection）  | `WHERE`            |
| π            | 投影（Projection） | `SELECT 列名`      |
| ∪            | 并集（Union）      | `UNION`            |
| −            | 差集（Difference） | `EXCEPT` / `MINUS` |
| ×            | 笛卡尔积           | `CROSS JOIN`       |
| ∩            | 交集               | `INTERSECT`        |
| ⋈            | 连接（Join）       | `JOIN ON`          |
| γ            | 聚合（Group）      | `GROUP BY`         |
| ρ            | 重命名（Rename）   | `AS`               |
| τ            | 排序（Order）      | `ORDER BY`         |
