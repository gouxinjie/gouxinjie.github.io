# Vue 2 核心响应式与渲染原理全景拆解

> 本文聚焦于 **Vue 2** 的底层架构设计，梳理从数据劫持、依赖收集、异步队列更新，到生命周期衔接与 `this.$nextTick` 机制的全流程。

[[toc]]

## 1. 响应式基石：`Object.defineProperty` 与 Getter / Setter

Vue 2 在初始化时，利用 `Object.defineProperty` 将 `data` 中定义的普通属性，改写为具有拦截能力的**访问器属性（Accessor Properties）**。

### Getter 与 Setter 的职责划分

* **`getter`（取值拦截器）：** 在读取数据属性（如模板渲染或计算属性取值）时触发。
* **核心任务：** 触发 **依赖收集（Dep.depend()）**，记录当前是哪个 `Watcher` 在读取该数据。


* **`setter`（赋值拦截器）：** 在给数据重新赋值（如 `this.count = 2`）时触发。
* **核心任务：** 触发 **派发更新（Dep.notify()）**，通知所有依赖该属性的 `Watcher` 数据发生了改变。



### 为什么组件中的 `data` 必须是一个函数？

在 Vue 组件定义中，`data` 必须写成返回对象的**函数**：

```javascript
// 正确写法
data() {
  return {
    count: 0
  }
}

```

* **根本原因（引用隔离）：** 组件本质上是一个可复用的 VueClass 实例。如果 `data` 是一个纯粹的对象，多个组件实例就会共享同一块内存地址。修改其中一个组件的 `data`，会直接污染其他实例。
* **Vue 的处理机制：** 每一个组件在实例化时，Vue 会执行 `data()` 函数，生成一份**全新的独立对象**，然后再对其进行响应式劫持。

> **使用函数能够返回全新独立对象的根本原因在于：**
> 函数的闭包/作用域机制结合对象的字面量创建，使得每次函数运行都会在内存堆中申请一块独立的新空间。
> 这相当于工厂的流水线模具——函数是“模具”，每次调用函数就是“压制一次”，生产出来的都是物理上互相独立的新产品。

### 特殊场景补充：数组响应式与 `$set`

1. **数组的重写拦截：** 出于性能开销考虑，Vue 2 没有对数组的每一个索引去定义 `getter/setter`。而是拦截重写了数组的 7 个变异原型方法（`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`）。在调用这些方法时，除了执行原生操作，还会手动调用数组本身持有的 `dep.notify()` 派发更新。
2. **新增/删除属性与 `this.$set`：** 由于 `Object.defineProperty` 无法侦测动态添加或删除的属性，Vue 2 提供了 `this.$set(target, key, value)`，其底层会调用 `defineReactive` 补建响应式拦截，并显式触发 `target.__ob__.dep.notify()` 通知视图更新。


## 2. 依赖收集核心：`Dep` 响应式通讯录

`Dep`（Dependence）在 Vue 2 中**不是一个单纯的函数，而是一个类（Class）**。它的主要作用是作为**依赖管理器**，连接响应式属性与视图观察者（Watcher）。

* **每个响应式属性**都有一个专属的 `Dep` 实例（保存在 `defineReactive` 的闭包作用域中）。
* **核心结构与方法：**
* `subs` 数组：存储所有依赖当前属性的 `Watcher` 实例。
* `depend()`：在 `getter` 中调用，将当前的 `Watcher` 加进 `subs` 列表。
* `notify()`：在 `setter` 中调用，遍历 `subs` 数组，依次调用每个 `Watcher.update()`。



> **概括来说：** `data` 里每一个嵌套对象的每一个属性，在底层都有自己独立的一套 `getter`、`setter` 以及存放在闭包里的 `Dep` 实例，负责精细化控制属于它自己的 `update` 通知。

### 简化版的实现模型

```javascript
// 全局属性，用于临时指向正在挂载/运行的 Watcher
Dep.target = null;

class Dep {
  constructor() {
    this.subs = []; // 订阅者列表 (Watcher 集合)
  }

  // 依赖收集
  depend() {
    if (Dep.target) {
      this.subs.push(Dep.target);
      // 双向收集：Watcher 内部也会记录当前的 Dep 实例
      Dep.target.addDep(this);
    }
  }

  // 派发更新
  notify() {
    // 拷贝一份订阅者数组进行遍历
    const subs = this.subs.slice();
    for (let i = 0; i < subs.length; i++) {
      subs[i].update();
    }
  }
}

// 属性数据劫持
function defineReactive(obj, key, val) {
  const dep = new Dep(); // 为每一个属性在闭包中绑定一个独立的 Dep 实例

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend(); // getter 触发，收集依赖
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify(); // setter 触发，派发更新
    }
  });
}

```


## 3. 视图异步更新机制（Async Queue）

当你连续修改多个数据属性时（如 `this.a = 1; this.b = 2;`），Vue 2 **绝不会立即去重新渲染页面**，而是将更新推入一个**异步更新队列**进行批量处理。

### 核心步骤与去重逻辑

1. **去重入队（`queueWatcher`）：**
数据改动触发 `setter` $\to$ 调用 `dep.notify()` $\to$ 触发 `watcher.update()`。`Watcher` 收到更新通知后，先通过专属的 `id` 检查自己是否已在队列中。如果在，则忽略；如果不在，则推入全局的 `queue` 数组。
2. **合并触发：**
即便在单次事件循环中修改了 100 个变量，由于同一个组件对应的是**同一个渲染 Watcher**，更新队列里始终只有这个 Watcher 的单一记录。
3. **在微任务中清空队列：**
Vue 内部调用 `nextTick(flushSchedulerQueue)` 注册一个微任务。待主线程同步代码全部执行完毕后，事件循环进入微任务阶段，批量遍历 `queue`，只执行**一次** Render 与 Diff 过程。

```javascript
const queue = [];
let has = {};
let waiting = false;

function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher); // 存入 Watcher

    if (!waiting) {
      waiting = true;
      // 在当前宏任务的同步代码结束后，由微任务统一刷新队列
      nextTick(flushSchedulerQueue);
    }
  }
}

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    const watcher = queue[i];
    has[watcher.id] = null;
    watcher.run(); // 真正开始重新渲染与 DOM 挂载
  }
  queue.length = 0;
  waiting = false;
}

```


## 4. `Watcher` 说明

### 什么是 `Watcher`？

`Watcher`（观察者 / 订阅者）在 Vue 2 中是一个**类（Class）**。
如果说 `Dep` 是“通讯录/发布者”，那么 `Watcher` 就是**真正干活的“订阅者/执行者”**。

当数据发生改变，`Dep.notify()` 喊了一声“数据变了！”，收到通知并真正去跑代码计算、去更新 DOM 节点的，就是 `Watcher`。

### 每一个属性都有 `Watcher` 吗？

**答案是：没有！绝不是每个属性都有 Watcher。**

* **`Dep` 是“属性级别”的：** 每一个属性在闭包中都有一个专属的 `Dep` 实例（1个属性 = 1个 Dep）。
* **`Watcher` 是“表达式/组件级别”的：** `Watcher` 只有在**需要监听变化并执行回调/渲染**的地方才会创建。

### Vue 2 中一共有哪几类 `Watcher`？

在 Vue 2 组件运行期间，一共只有以下 **3 种** `Watcher`：

1. **渲染 Watcher（Render Watcher）：**
* **数量：每个组件实例只有一个。**
* **作用：** 负责整个组件视图的重新渲染（执行 `vm._update(vm._render())`）。
* **属性与 Watcher 的关系：** 假设模板里用了 10 个数据属性（`a`, `b`, `c` ...），这 10 个属性对应的 10 个 `Dep` 里，存的都是**同一个渲染 Watcher**。


2. **用户 Watcher（User Watcher / `watch` 选项）：**
* **数量：你写了几个 `watch` 属性，就有几个。**
* **作用：** 执行你在 `watch: { foo(val) { ... } }` 中写的自定义回调函数。


3. **计算属性 Watcher（Computed Watcher）：**
* **数量：你写了几个 `computed`，就有几个。**
* **作用：** 内部维护一个 `dirty` 标志位，用来实现计算属性的**缓存机制**。

### Watcher 的全局唯一 `id`

**每一个 `Watcher` 实例都有一个全局唯一的 `id`！**

`id` 是实现 **“异步更新队列去重（防抖）”** 的核心关键！在 Vue 2 内部，有一个自增的全局计数器：

```javascript
let uid = 0; // 全局自增 ID 计数器

class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.id = ++uid; // 每一个 Watcher 诞生时，都会拿到一个递增且唯一的 id
    this.deps = [];
    this.depIds = new Set();
    // ...
  }

  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id);
      this.deps.push(dep); // 双向收集：Watcher 记录属性的 Dep，用于组件销毁和清除无效依赖
    }
  }
}

```

### `id` 在异步队列去重中的运用

当你写了如下代码：

```javascript
this.firstName = '张';
this.lastName = '三';

```

1. `firstName` 改变，触发它的 `Dep`，通知**渲染 Watcher（假设 `id: 1`）**。
2. Vue 执行 `queueWatcher(watcher)`：

```javascript
if (has[watcher.id] == null) { // 检查 has[1] 是否存在
  has[watcher.id] = true;       // 标记 has[1] = true
  queue.push(watcher);          // 把 id: 1 的渲染 Watcher 推入队列
}

```

3. `lastName` 改变，触发它的 `Dep`，**通知同一个渲染 Watcher（`id: 1`）**。
4. Vue 再次执行 `queueWatcher(watcher)`：

```javascript
if (has[1] == null) { ... } // 发现 has[1] 已经是 true 了！直接跳过！

```

正是因为每个 `Watcher` 有唯一的 `id`，Vue 才能用极其高效的 `O(1)` 时间复杂度过滤掉重复的更新通知。

## 5. `this.$nextTick` 的底层实现与 FIFO 顺序

`this.$nextTick(cb)` 能够准确拿到最新 DOM 的核心原因在于：**微任务队列的“先来后到（FIFO，先进先出）”执行顺序**。

### 并没有“反复横跳”

在底层，Vue 维护了一个统一的回调函数队列 `callbacks`：

```javascript
const callbacks = [];
let pending = false;

function nextTick(cb) {
  callbacks.push(cb); // 入队

  if (!pending) {
    pending = true; // 开启锁定，保证当前 Tick 内只开启一次微任务注册
    // 使用微任务 API（如 Promise.then）在主线程空闲时派发
    Promise.resolve().then(flushCallbacks);
  }
}

function flushCallbacks() {
  pending = false; // 解锁
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

```

### 完整运行流

假设有如下代码：

```javascript
this.message = 'Hello World'; // ① 修改数据
this.$nextTick(() => {       // ② 手动挂载回调
  console.log(this.$el.textContent);
});

```

1. **执行 ① 时：** 触发 `setter`，Vue 内部**自动**调用 `nextTick(flushSchedulerQueue)`。
* 此时 `callbacks` 队列为：`[ flushSchedulerQueue ]`。


2. **执行 ② 时：** 手动调用 `$nextTick`，你的回调函数被推入队列。
* 此时 `callbacks` 队列为：`[ flushSchedulerQueue, userCallback ]`。


3. **主线程同步代码结束，开启微任务：**
* **执行 `callbacks[0]`（`flushSchedulerQueue`）：** Vue 重新渲染并把新节点直接同步写到了内存 DOM 节点上。
* **执行 `callbacks[1]`（`userCallback`）：** 在此回调里读取 DOM，由于前一步内存 DOM 已经被更新，因此可以直接读取到最新结果。

## 6. 生命周期的完整衔接

响应式系统与异步更新机制并非孤立运行，而是贯穿在 Vue 组件的各个生命周期钩子中：

```text
  [ new Vue() 实例创建 ]
            │
            ▼
     beforeCreate 钩子
            │
  ┌─────────┴─────────┐
  │  初始化 Inject/  │
  │ Data/Props/Method │  --> 针对 data 递归调用 defineReactive，
  │  转换 Getter/Setter │      挂载对应的 Dep 实例
  └─────────┬─────────┘
            ▼
       created 钩子      --> 此时数据已具备响应式，但还没挂载 DOM
            │
     beforeMount 钩子
            │
  ┌─────────┴─────────┐
  │ 创建 Render Watcher│  --> 首次执行 Render，触发属性的 getter，
  │  并执行首次渲染过程 │      把 Render Watcher 收集进 Dep 的 subs 数组中
  └─────────┬─────────┘
            ▼
        mounted 钩子     --> 真实 DOM 首次渲染完成
            │
  ┌─────────┴─────────┐
  │  数据改变 (Setter)│  --> 触发 dep.notify()，将 Watcher 推入异步更新队列 (queueWatcher)
  └─────────┬─────────┘
            ▼
    beforeUpdate 钩子    --> 异步队列准备刷新视图前触发
            │
  ┌─────────┴─────────┐
  │ 执行 Watcher.run() │  --> 生成新 VNode，通过 Diff 算法对比，映射并更新真实 DOM
  └─────────┬─────────┘
            ▼
      updated 钩子       --> 视图更新完成
            │
    beforeDestroy 钩子   --> 销毁前，移除监听器、子组件及 Watcher
            │
      destroyed 钩子

```
