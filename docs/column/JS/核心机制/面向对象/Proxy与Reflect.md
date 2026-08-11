# Proxy 与 Reflect 讲解

[[toc]]

::: tip Proxy:

Proxy: 代理，顾名思义主要用于为对象创建一个代理，从而实现对对象基本操作的拦截和自定义。可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

:::

::: tip Reflect:

Reflect: 反射，就是将代理的内容反射出去。Reflect 与 Proxy 一样，也是 ES6 为了操作对象而提供的新 API。它提供拦截 JavaScript 操作的方法，这些方法与 Proxy handlers 提供的的方法是一一对应的，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。且 Reflect 不是一个函数对象，即不能进行实例化，其所有属性和方法都是静态的。

:::

## 1、Proxy 代理的基本使用

**1、基本使用**

```js
let target = {};
let p = new Proxy(target, {});
p.a = 10;
console.log("p", p); // { a: 10 }
console.log("target", target); // { a: 10 }
```

上面代码中，使用了 `Proxy` 对 `target` 对象进行了代理，但没有定义任何特定的处理器（handler）。因此，默认情况下，`Proxy` 的行为是将对代理对象的操作转发到原始对象上。

在你的代码中，执行 `p.a = 10;` 实际上会将 `a` 属性添加到 `target` 对象中，因为没有定义任何拦截器。

**2、希望 target 不被修改 该怎么做**

```js
let target = {};
let p = new Proxy(target, {
  set: function (obj, prop, value) {
    console.log(`Attempt to set property ${prop} to ${value} on target.`);
    return false; // 阻止设置属性
  }
});

p.a = 10; // 尝试修改 p.a
console.log("p", p); // p仍然是空对象 {}
console.log("target", target); // target仍然是空对象 {}
```

要确保 `target` 不被修改，可以使用 `Proxy` 的 `set` 拦截器来阻止对 `target` 的任何修改。这样一来 p 和 target 都不会受影响，便是空的。

**3、我只想改变 p 呢**

```js
let target = {}; // target 不参与new Proxy 构造函数中
let p = new Proxy(
  {},
  {
    set: function (obj, prop, value) {
      obj[prop] = value; // 修改代理对象的属性
      return true; // 表示成功
    },
    get: function (obj, prop) {
      return obj[prop]; // 获取代理对象的属性
    }
  }
);

// 通过代理对象 p 修改属性
p.a = 10;

console.log("p", p); // p的值是 { a: 10 }
console.log("target", target); // target仍然是 {}
```

`p` 是一个独立的对象，通过代理的 `set` 和 `get` 方法来管理其属性。这样，修改 `p` 的属性不会影响到 `target`。

## 2、Proxy 的 set 方法说明

**`set()`** 方法是设置属性值操作的捕获器。

```js
let obj1 = {};
let p = new Proxy(obj1, {
  set: function (obj, prop, value) {
    obj[prop] = value; // 修改代理对象的属性
    return true; // 表示成功
  }
});
p.name = "前端";
console.log(obj1); // { name: '前端' }
console.log(p); // { name: '前端' }
```

`set()` 方法应当返回一个布尔值。

(1) 返回 `true` 代表属性设置成功。

(2) 在严格模式下，如果 `set()` 方法返回 `false`，那么会抛出一个 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 异常。

**拦截**

该方法会拦截目标对象的以下操作：（只要是下方的操作改变了对象的属性就会触发 set 方法）

- 指定属性值：`proxy[foo] = bar` 和 `proxy.foo = bar`

```js
  set: function (obj, prop, value) {
    obj.prop = value; // obj[prop] = value; 这两个效果是一样的
    return true;  // 表示成功
  }
```

(1) 指定继承者的属性值：`Object.create(proxy)[foo] = bar`

(2) [`Reflect.set()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set)

```
  set: function (obj, prop, value) {
    Reflect.set(obj, prop, value);
    return true; // 表示成功
  }
```

**Reflect.set() 方法介绍**

**Reflect** 是一个内置的对象，它提供拦截 JavaScript 操作的方法。通过.调用它里面的一些方法，而不能使用 new 关键字去构造；

静态方法 **`Reflect.set()`** 工作方式就像在一个对象上设置一个属性。

```js
// Object  设置对象
var obj = {};
Reflect.set(obj, "prop", "value"); // true
obj.prop; // "value"

// Array  设置数组
var arr = ["duck", "duck", "duck"];
Reflect.set(arr, 2, "goose"); // true
arr[2]; // "goose"
```

## 3、Proxy 的 get 方法说明

**`get()`** 方法用于拦截对象的读取属性操作。

```js
var p = new Proxy(
  {},
  {
    get: function (target, prop, receiver) {
      console.log("called: " + prop);
      return 10;
    }
  }
);
console.log(p.a); // "called: a"; ouptut 10
```

该方法会拦截目标对象的以下操作：（和 set 方法如出一辙）

(1) 访问属性：`proxy[foo] 和` `proxy.bar`

(2) 访问原型链上的属性：`Object.create(proxy)[foo]`

(3) [`Reflect.get()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get)

## 4、为什么要使用 Reflect 来更改对象

在真正的响应式原理中，通常会使用 `Reflect` 对象来操作目标对象，而不是直接操作目标对象本身。这样做有几个优点：

1，**更加规范和易读：** 使用 `Reflect` 提供的方法，如 `Reflect.get`、`Reflect.set`、`Reflect.deleteProperty`，使代码更符合规范，易于阅读和理解。这些方法的名称清晰地表明了它们的功能，使代码更易于维护和修改。

2，**更安全：** `Reflect` 方法的使用会使代码更安全，因为它们提供了一种标准的方式来执行基本操作，避免了直接操作目标对象可能导致的一些潜在问题。例如，`Reflect.set` 方法会返回一个布尔值，指示属性是否成功设置，而直接设置属性时，你必须自己处理设置是否成功的情况。

3，**拓展性：** 使用 `Reflect` 提供的方法，使得代码更具有拓展性。你可以在这些方法的基础上自定义更复杂的行为，而不会影响到 `Proxy` 的行为。

4，**一致性：** `Reflect` 方法的行为与语言内部操作的行为一致，这使得代码更一致和可预测。与直接操作目标对象不同，`Reflect` 方法在处理特殊情况时也会返回一致的结果。

## 5、Proxy 和 Object.defineProperty 的区别

`Proxy` 和 `Object.defineProperty` 都是 JavaScript 中用于拦截和操作对象属性的工具，但它们的工作方式和使用场景有所不同。

### 1. `Object.defineProperty`

`Object.defineProperty` 是 ES5 引入的方法，用于在一个对象上定义一个新的属性或修改一个现有的属性，并可以指定该属性的具体配置。通过这个方法，您可以精确地控制属性的行为，比如是否可写、是否可枚举以及设置或获取属性值时触发的函数（getter/setter）。

```js
let obj = {};
Object.defineProperty(obj, "name", {
  value: "John",
  writable: false,
  enumerable: true,
  configurable: true
});

console.log(obj.name); // 输出: John
obj.name = "Jane"; // 不会改变，因为writable为false
console.log(obj.name); // 输出: John
```

### 2. `new Proxy`

`Proxy` 是 ES6 引入的一个构造函数，用于创建一个代理对象，该对象可以拦截并重新定义对目标对象的基本操作（如属性查找、赋值、枚举、函数调用等）。`Proxy`提供了更广泛的控制能力，不仅仅局限于单个属性，而是整个对象的行为。

**主要区别**

1，**范围**:

- `Object.defineProperty` 仅作用于单个属性。
- `Proxy` 可以作用于整个对象及其所有属性。
- 2，**灵活性**:
- `Object.defineProperty` 提供了对单个属性的精细控制。
- `Proxy` 提供了对多种操作的拦截功能，更加灵活和强大。
- 3， **兼容性**:
- `Object.defineProperty` 在 ES5 中就已经存在，具有更好的浏览器兼容性。
- `Proxy` 是 ES6 的新特性，在一些旧版本的浏览器中可能不被支持。
- 4，**性能**:
- 对于简单的属性控制，`Object.defineProperty` 可能比 `Proxy` 更高效。
- `Proxy` 的性能开销通常更大，因为它需要处理更多的操作类型。

## 6、Object.defineProperty 在 vue2 中的一些缺点

我们知道 `Vue2` 中使用的是 `Object.defineProperty`，但是会出现以下的问题，虽然有妥协的解决方式，但还是有点不太好用。

**1，需要遍历对象所有 key，这会影响初始化速度。**

```js
// 遍历响应式处理
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
}
```

在 `Vue2` 中，对于一个深层属性嵌套的对象，要劫持它内部深层次的变化，就需要递归遍历这个对象，执行 `Object.defineProperty` 把每一层对象数据都变成响应式的，这无疑会有很大的性能消耗。

**2、Vue2 对于数组要做特殊处理，修改数据时也不能使用索引方式**

```js
// 数组响应式
// 1、替换数组原型中的 7个方法
const originalProto = Array.prototype;
// 备份一份，修改备份
const arrayProto = Object.create(originalProto);
["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach((method) => {
  arrayProto[method] = function () {
    // 原始操作
    originalProto[method].apply(this, arguments);
    // 覆盖操作，通知更新
    console.log("数组执行" + method + "操作");
  };
});
```

**3、Vue2 中动态添加或删除对象属性需要使用额外 API：Vue.set()/delete()**

```js
Vue.set(obj, "a", "前端");
Vue.delete(obj, "a");
```

**4、Vue2 不支持 Map、Set、Class 等数据结构**

而 Vue3 中利用 Proxy 可以很好的解决以上的问题。
