# useState 更新机制（直接更新和函数式更新）

[[toc]]

## 1、直接更新

每当函数内部访问外部作用域的变量时，就会形成闭包；

```tsx
const [count, setCount] = useState(0);
const handleMultipleUpdates = () => {
  //   这里访问了外部作用域的 count 变量；形成了闭包。
  setCount(count + 1); // 计划更新为 1
  setCount(count + 1); // 再次计划更新为 1
  setCount(count + 1); // 又一次计划更新为 1
};
```

函数在定义的时候，它已经"记住"(捕获)了当前渲染周期中的 `count` 值也就是初始值`0` ；所以上面的代码等同于下面的：

```tsx
const handleMultipleUpdates = () => {
  setCount(0 + 1);
  setCount(0 + 1);
  setCount(0 + 1);
};
```

所以当`react`更新队列依次执行这个三个`setCount`;值都是 1；所以在这个事件中`count`的值始终是 1；

但是这里还有另外一个影响因素需要讨论。`React` 会等到事件处理函数中的 所有 代码都运行完毕再处理你的 state 更新。 这就是重新渲染只会发生在所有这些 `setNumber()`调用 之后 的原因。这种特性也就是 **批处理**。

## 2、函数式更新

```tsx
const handleMultipleUpdates = () => {
  setCount((prevCount) => prevCount + 1);
  setCount((prevCount) => prevCount + 1);
  setCount((prevCount) => prevCount + 1);
};
```

使用函数式更新可以拿到最新变动的值，符合我们代码所表现出来的预期结果。

使用`setCount(prev => prev + 1)`函数式更新会使用最新变动的值做计算。因为：**参数注入**

1，React 会在处理更新时**自动将最新状态**作为 `prev` 参数传入<br> 2，不依赖外部作用域的变量

**直接更新和函数式更新对比**

| 特性               | `setCount(count + 1)`                | `setCount(prev => prev + 1)`   |
| :----------------- | :----------------------------------- | :----------------------------- |
| **依赖值**         | 依赖当前闭包中的 `count` 值          | 依赖 React 提供的上一个状态值  |
| **多次调用的结果** | 所有调用都基于同一个初始值           | 每次调用都基于前一次更新后的值 |
| **更新队列处理**   | 批量更新但使用相同的基础值           | 批量更新但依次传递最新值       |
| **闭包问题**       | 受闭包影响，获取的是当前渲染周期的值 | 不受闭包影响，总能获取最新值   |
| **适用场景**       | 简单独立的状态更新                   | 连续依赖前一次更新的状态变更   |

## 3、异步更新注意

```tsx
const [count, setCount] = useState(0);
const handleAsyncUpdate = () => {
  setCount(count + 5);
  console.log("立即获取count:", count); // 0
  setTimeout(() => {
    console.log("定时器里面的count:", count); // 0
  }, 0);
};
```

这里面存在的问题是：为什么 setTimeout 里面获取的也是 count 的旧值，因为 setTimeout 函数也形成了闭包，所以闭包值在函数创建时就确定了，不会自动更新；依旧是 0；

那该怎么解决呢？

解决方案： `在函数式更新中获取`

```tsx
const handleAsyncUpdate = () => {
  setCount(count + 5);
  setTimeout(() => {
    setCount((prev) => {
      console.log("函数式更新中的count:", prev); // 5 和视图保持一致
      return prev;
    });
  }, 0);
};
```

## 4、批量更新机制

批量更新(`Batching`)是 `React` 优化性能的核心机制之一，它通过合并多个状态更新来减少不必要的渲染。

```tsx
// 演示批量更新
const handleBatchUpdates = () => {
  setCount(count + 2);
  setText("Updated Text");
};
```

React 会自动批量处理这些更新，只触发一次渲染

## 5、更新复杂数据类型（对象和数组）

React 的状态更新遵循不可变数据原则。React 通过浅比较（`shallow comparison`）来判断状态是否变化：

1，对于基本类型（`string, number, boolean` 等），比较值本身<br/> 2，对于引用类型（`object, array` 等），比较内存引用地址

```tsx
const [user, setUser] = useState({ name: "Alice", age: 25 });

// 直接修改（错误）
user.age = 26; // 内存地址不变
setUser(user); // React认为"没有变化"，不会触发重新渲染

// 正确做法
setUser({ ...user, age: 26 }); // 创建新对象，新内存地址
```

### 5.1 深层对象属性更新

```js
const [data, setData] = useState({
  user: {
    name: "Alice",
    profile: {
      level: 1
    }
  }
});
// 更新深层属性
setData({
  ...data,
  user: {
    ...data.user,
    profile: {
      ...data.user.profile,
      level: 2
    }
  }
});
```

### 5.2 更新数组操作

```js
const [items, setItems] = useState(["a", "b", "c"]);

// 添加元素
setItems([...items, "d"]);

// 删除第二个元素
setItems(items.filter((item, index) => index !== 1));

// 更新元素
setItems(items.map((item, index) => (index === 1 ? "new" : item)));

// 排序
setItems([...items].sort()); // 先创建副本再排序
```

### 5.3 复杂操作示例

```js
// 所操作的数据源
const [todos, setTodos] = useState([
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Build app", done: false }
]);

// 切换完成状态
setTodos(todos.map((todo) => (todo.id === 1 ? { ...todo, done: !todo.done } : todo)));

// 删除项目
setTodos(todos.filter((todo) => todo.id !== 2));

// 替换索引为2的元素
const [items, setItems] = useState(["a", "b", "c", "d"]);
setItems((prevItems) => prevItems.map((item, index) => (index === 2 ? "new" : item)));

// 替换特定ID的对象
setTodos(todos.map((todo) => (todo.id === 2 ? { ...todo, text: "Build awesome app" } : todo)));

// 在特定位置插入元素
const [items, setItems] = useState(["a", "b", "d"]);
// 在索引2处插入'c' (插入到'b'和'd'之间)
setItems([
  ...items.slice(0, 2), // 取前两个元素
  "c", // 插入新元素
  ...items.slice(2) // 剩余元素
]);
// 更安全的实现方式
function insertItem(array, index, newItem) {
  return [...array.slice(0, index), newItem, ...array.slice(index)];
}
setItems(insertItem(items, 2, "c"));
```

### 5.4 为什么 React 选择浅比较？

::: tip 为什么 React 选择浅比较

1，性能考量：深比较对大型对象/数组开销过大  
2，明确性：强制开发者显式声明状态变更  
3，可预测性：避免深比较可能导致的意外行为  
4，与不可变性配合：鼓励使用不可变数据模型  

:::

| 特性       | 浅比较                      | 深比较                         |
| :--------- | :-------------------------- | :----------------------------- |
| 比较深度   | 只比较第一层                | 递归比较所有嵌套属性           |
| 性能       | 高效（O(1)或 O(n)简单遍历） | 低效（O(n)复杂递归）           |
| React 使用 | 默认采用                    | 几乎不使用                     |
| 适用场景   | 频繁比较的大数据结构        | 需要精确知道所有变化的特殊场景 |
