const n=`# 闭包讲解

[[toc]]

在 JavaScript 中，闭包（Closure）是极为重要且高频的基础概念。用一句话总结：**闭包就是一个函数以及其捆绑的周边词法环境（Lexical Environment）的组合。** 简单来说，**当一个内部函数访问了外部函数的变量，并且该内部函数在外部函数执行完后依然被保留/调用时，就形成了闭包。**


### 一、 闭包的底层原理（它是如何产生的？）

在大部分编程语言中，函数的局部变量只在函数执行期间存在。函数执行完毕后，调用栈弹出，局部变量就会被垃圾回收（GC）销毁。

但 JavaScript 采用的是**词法作用域（Lexical Scoping）**：**函数的作用域在函数定义时就已经确定了，而不是在执行时确定。**

当一个内部函数被返回或传递到外部时，为了保证它未来执行时仍能访问到定义时的变量，JS 引擎会将这些被引用的外部变量“打包”保存在内存中（称为 \`[[Scopes]]\`），这就形成了闭包。


### 二、 经典代码演示

#### 1. 基础闭包模型

\`\`\`javascript
function createCounter() {
  let count = 0; // 外部函数的局部变量

  return function() { // 内部函数（闭包）
    count++; // 引用了外部函数的 count 变量
    return count;
  };
}

const counter = createCounter(); // createCounter 执行完毕，按理说 count 应该被销毁

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

\`\`\`

* **解析**：\`createCounter\` 执行完后，\`count\` 并没有被回收。\`counter\` 保持了对 \`count\` 的引用，每次调用 \`counter()\` 都在修改同一个 \`count\`。

#### 2. 经典面试题：\`var\` 与循环异步

\`\`\`javascript
// ❌ 错误问题：1秒后打印出 5 个 5（而不是 0, 1, 2, 3, 4）
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}

// ✅ 解决方案 1：使用闭包保存每次循环的 i
for (var i = 0; i < 5; i++) {
  (function(j) { // 立即执行函数 (IIFE) 形成闭包
    setTimeout(function() {
      console.log(j); // 0, 1, 2, 3, 4
    }, 1000);
  })(i);
}

// ✅ 解决方案 2：ES6 块级作用域 let（现代推荐，底层机制类似闭包）
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}

\`\`\`


### 三、 日常开发中的常见应用场景

闭包在框架设计和业务开发中有着举足轻重的地位：

#### 1. 创建私有变量 / 数据隐藏（模拟封装）

防止外部直接修改变量，仅提供指定的 API 访问：

\`\`\`javascript
function createPerson(initialName) {
  let name = initialName; // 私有变量，外部无法通过 person.name 直接访问

  return {
    getName() { return name; },
    setName(newName) { name = newName; }
  };
}

const person = createPerson('Alice');
console.log(person.getName()); // Alice
person.setName('Bob');
console.log(person.getName()); // Bob

\`\`\`

#### 2. 函数柯里化（Currying）与偏函数

把接受多个参数的函数变换成接受一个单一参数的函数，利用闭包暂存部分参数：

\`\`\`javascript
function add(x) {
  return function(y) {
    return x + y; // 闭包保存了参数 x
  };
}

const addFive = add(5);
console.log(addFive(10)); // 15
console.log(addFive(20)); // 25

\`\`\`

#### 3. 节流（Throttle）与防抖（Debounce）

高级 API（如 Lodash 的防抖）依赖闭包保存定时器 ID（\`timer\`）或上一次执行时间戳：

\`\`\`javascript
function debounce(fn, delay) {
  let timer = null; // 闭包保存 timer 变量

  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

\`\`\`

#### 4. React Hooks 的核心实现基实

在 React 函数组件中，\`useState\` 和 \`useEffect\` 之所以能够在组件多次重新渲染（Re-render）时依然“记住”上一次的状态，其底层依赖的就是闭包机制（将状态挂载在 Fiber 节点的 \`memoizedState\` 链表上）。


### 四、 闭包的缺点与内存泄漏问题

闭包虽然强大，但使用不当会导致性能问题：

1. **内存占用增加**：闭包引用的变量不会被垃圾回收，长期滞留在内存中（堆内存）。
2. **潜在的内存泄漏风险**：如果闭包被长期持有（如挂载到全局变量或 DOM 事件监听器上），而其引用的外部 DOM 元素或大对象不再使用，就会导致这部分内存无法释放。

#### 如何解决与释放闭包？

如果不再需要闭包，显式将其引用置为 \`null\`，以便垃圾回收器进行回收：

\`\`\`javascript
let counter = createCounter();
// ... 使用 counter

counter = null; // 释放闭包引用，内部的 count 变量随后会被 GC 回收

\`\`\`
`;export{n as default};
