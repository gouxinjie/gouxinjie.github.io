# Fiber 架构

[[toc]]

## 一、引言

在讲解`Fiber`架构之前，我们需要知道`react`中为什么`useState`钩子函数能够保留最新用户更该的值，（函数式组件中某一个 state 状态的改变，都会触发组件的重新渲染）

那么它是怎么存储更新后的值呢？

**因为**：

在 React 中，`useState` 能够保留最新的状态值，**即使函数组件在每次渲染时都会重新执行**，其背后的机制涉及 **闭包（Closure）** 和 **React Fiber 架构** 的协作。

### 1.1、闭包（Closure）的作用

`useState `返回的状态值（如 `count`）和更新函数（如 `setCount`）通过闭包引用了当前渲染周期的状态快照。每次组件渲染时，`useState` 会返回 当前最新的状态值（由 `React` 内部维护）。

更新函数（如 `setCount`）会将新状态 提交到 `React` 的调度系统，触发重新渲染。

```ts
function Counter() {
  const [count, setCount] = useState(0); // 闭包捕获当前 count 值
  const handleClick = () => {
    setCount(count + 1); // 提交更新，闭包中的 count 是当前渲染周期的值
  };
  return <button onClick={handleClick}>{count}</button>;
}
```

### 1.2、React Fiber 的状态存储

`React` 内部通过 `Fiber` 节点 管理组件的状态：每个函数组件对应一个 `Fiber` 节点，状态值存储在 `Fiber` 节点的 `memoizedState` 属性中。

组件重新渲染时，`useState` 会从` Fiber` 节点读取最新状态，而不是重新初始化。

Fiber 节点结构示例:

```ts
{
  memoizedState: 42, // 当前状态值
  queue: { ... },    // 更新队列（存储 setState 的调用）
  next: null,        // 指向下一个 Hook
}
```

### 1.3、状态更新的异步批处理

当调用 setCount 时： 1，React 不会立即修改状态，而是将更新放入 调度队列。 2，在下次渲染时，React 会 合并多个更新（批处理），并计算最终状态。 3，组件重新执行时，useState 会返回 更新后的最新值。

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1); // 第一次更新：基于当前 count=0
    setCount(count + 1); // 第二次更新：仍基于当前 count=0（闭包陷阱！）
  };
  // 点击后 count 只会 +1，而非 +2
  return <button onClick={handleClick}>{count}</button>;
}
```

## 二、Fiber 架构讲解

在`React`的 `Fiber` 架构 中，组件的节点关系是通过 链表结构（而非数组或纯对象）管理的；

### 2.1、Fiber 节点的核心结构

每个 Fiber 节点是一个 JavaScript 对象，包含以下关键属性（简化版）：

```ts
interface Fiber {
  // 标识组件类型（函数/类组件、Host 组件等）
  tag: WorkTag; // 如 FunctionComponent, ClassComponent, HostComponent

  // 组件相关的实例或函数
  type: any; // 对于函数组件，type 是组件函数本身

  // 状态相关的属性
  memoizedState: any; // 当前状态（hooks 链表存储在这里）
  stateNode: any;     // 类组件的实例或 DOM 节点

  // 链表结构（关键）
  child: Fiber | null;      // 第一个子节点
  sibling: Fiber | null;    // 下一个兄弟节点
  return: Fiber | null;     // 父节点

  // 更新队列和副作用
  updateQueue: UpdateQueue<any> | null; // 状态更新队列
  flags: Flags; // 标记是否需要插入、更新、删除等操作

  // 其他调度相关属性
  alternate: Fiber | null; // 指向当前/WorkInProgress 树的对应节点
}
```

### 2.2、多个 Fiber 节点如何组织？      

Fiber 节点之间通过 链表（而非数组）形成树状结构：

**HTML结构:**

```html
function App() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}
```
**对应的Fiber 树：**
```html
        App Fiber
           |
        div Fiber
         /    \
Header Fiber   Content Fiber 
```

### 2.3、Hooks 的存储方式

1，函数组件的状态（如 `useState、useEffect`）存储在 `Fiber `节点的 `memoizedState` 属性中，具体是通过 单向链表 组织的：
每个 Hook 是一个对象，包含` memoizedState（`如状态值）、`next`（指向下一个 Hook）。


2，React 通过调用顺序匹配 Hook（因此不能条件式调用 Hook）

**Hook 链表示例:**

```tsx
function Example() {
  const [count, setCount] = useState(0); // Hook 1
  const [name, setName] = useState("");  // Hook 2
  useEffect(() => {});                   // Hook 3
  // ...
}
```
对应的 Hook 链表：

```tsx
Fiber.memoizedState -> Hook1(count) -> Hook2(name) -> Hook3(effect) -> null
                        |                |               |
                     memoizedState    memoizedState    memoizedState
```

### 2.4、为什么用链表而非数组？

1.动态性：链表可以高效地插入、删除节点（如条件渲染）。<br/>
2.增量渲染：React 可以中断和恢复渲染过程，链表结构更灵活。<br/>
3.Hooks 依赖调用顺序：链表能严格保证 Hook 的顺序一致性。<br/>

### 2.5、完整 Fiber 树的遍历过程
React 通过 深度优先遍历 Fiber 树：<br/>
1.从根节点开始，访问 child 直到叶子节点。<br/>
2.如果没有 child，则访问 sibling。<br/>
3.如果没有 sibling，则回溯到 return（父节点）。<br/>

---
那么问题来了？什么是链表结构？js该怎么表示出来？


## 三、链表相关

### 3.1、什么是链表结构？
链表（`Linked List`）是一种 线性数据结构，由一系列节点（`Node`）组成，每个节点包含：<br/>
(1) 数据域（存储数据）<br/>
(2) 指针域（指向下一个节点的引用）<br/>


### 3.2、单链表的 JavaScript 实现

```ts
// 下面是链表结构
class ListNode {
  constructor(value) {
    this.value = value; // 数据域
    this.next = null;   // 指针域（指向下一个节点）
  }
}

// 创建链表: 1 -> 2 -> 3
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);

node1.next = node2;
node2.next = node3;

// 遍历链表
let current = node1;
console.log("链表内容：",current);
while (current !== null) {
  console.log(current.value); // 依次输出 1, 2, 3
  current = current.next;
}
```

**输出：**

```ts
// 链表内容：
 ListNode {
  value: 1,
  next: ListNode { value: 2, next: ListNode { value: 3, next: null } }
}
```

### 3.3、链表 vs 数组

链表优点：动态大小，插入删除比较快


| **特性**       | **数组**                          | **链表**                     |
|--------------|----------------------------------|-----------------------------|
| **内存**     | 连续内存                         | 非连续内存（动态分配）       |
| **查询**     | 快（O(1) 索引访问）              | 慢（O(n)，需遍历）          |
| **插入**     | 慢（需移动元素，O(n)）           | 快（修改指针，O(1)）        |
| **删除**     | 慢（需移动元素，O(n)）           | 快（修改指针，O(1)）        |
| **优点**     | 随机访问快                       | 动态大小，插入/删除快       |


**为什么查询比较慢：**<br/>
1，链表的节点在内存中是非连续存储的（无法像数组直接通过索引访问）。<br/>
2，链表的查询操作通常是线性查找，即从链表的头部开始，逐个节点遍历，直到找到目标节点。<br/>

**总结：**<br/>
链表：通过指针连接的非连续数据结构，适合动态增删（如 React 的 Fiber 树）。<br/>
DFS/BFS：DFS 用栈/递归深入到底，BFS 用队列按层扩展。<br/>
React 的应用：Fiber 树的链表结构 + DFS 遍历，实现了可中断的渲染。<br/>