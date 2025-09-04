# Vue3 reactive和ref响应式数据的区别


## 一、前言

在 `Vue3 `中，`reactive` 和` ref` 都是用来创建响应式数据的工具，但它们的工作方式和使用场景有所不同。

`vue3`的数据双向绑定，大家都明白是`proxy`数据代理，但是在定义响应式数据的时候，有ref和reactive两种方式，如果判断该使用什么方式，是大家一直不很清楚地问题。

首先，明白一点，`Vue3` 的 `reactive` 和 `ref` 是借助了vue3的`Proxy代理`来实现的。

## 二、reactive

`reactive`用于创建一个响应式的对象。它接受一个 `对象类型 `作为参数，并返回该对象的响应式代理。

### 1. 使用

js中使用

```js
import { reactive } from 'vue'
const state = reactive({ count: 0 })
```

模板中使用：
```html
<button @click="state.count++">
  {{ state.count }}
</button>
```

### 2. reactive() 的局限性​


reactive() API 有一些局限性：

**(1) 有限的值类型**：

它只能用于对象类型 (对象、数组和如 Map、Set 这样的集合类型)。它不能持有如` string`、 `number` 或 `boolean` 这样的原始类型。

**(2) 不能替换整个对象(直接用=号来赋值)**：

由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失：

对于这个问题，解决方案有三个:见
[reactive定义响应式数据进行列表赋值时，视图没有更新的解决方案](/column/Vue/响应式API进阶/reactive视图未更新.html)

```js
let state = reactive({ count: 0 })
// 上面的 ({ count: 0 }) 引用将不再被追踪
// (响应性连接已丢失！)
state = reactive({ count: 1 })
```

**(3) 对解构操作不友好**：

当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接：

```js
const state = reactive({ count: 0 })

// 当解构时，count 已经与 state.count 断开连接
let { count } = state
// 不会影响原始的 state
count++

// 该函数接收到的是一个普通的数字
// 并且无法追踪 state.count 的变化
// 我们必须传入整个对象以保持响应性
callSomeFunction(state.count)
```

由于这些限制，[vue官网](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive) 建议使用 ref() 作为声明响应式状态的主要 API。


### 3. toRefs解决reactive不能解构赋值的问题

::: tip toRefs介绍
将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。每个单独的 ref 都是使用 toRef() 创建的。

当你从一个 reactive 对象中解构出属性时，这些属性会失去响应性。使用 toRefs 可以确保解构后的属性仍然是响应式的。
:::



```js
import { reactive, toRefs } from 'vue';

// 创建一个 reactive 对象
const state = reactive({
  count: 0,
  message: 'Hello, World!'
});

// 使用 toRefs 将 reactive 对象转换为包含 ref 属性的对象
const { count, } = toRefs(state);

// 修改解构出来的 count
count.value++;
console.log(count.value); // 输出 1
console.log(state.count); // 输出 1

// 修改原始 reactive 对象中的 count
state.count++;
console.log(count.value); // 输出 2
console.log(state.count); // 输出 2
```
**工作原理**

toRefs 函数接受一个 reactive 对象，并返回一个新的对象，其中每个属性都是一个 ref。
这些 ref 对象的 .value 属性与原始 reactive 对象中的相应属性保持同步。
当你修改这些 ref 对象的 .value 时，原始 reactive 对象中的属性也会被更新，反之亦然。

**注意事项**
toRefs 主要用于 reactive 对象。如果你有一个单独的 ref，直接操作其 .value 即可，不需要使用 toRefs。
如果你需要对 ref 进行解构并保持响应性，可以考虑使用 computed 或其他方法。


## 三、ref


我们知道，在Vue3中，`reactive`数据响应式是通过Proxy代理来实现的，那同时就会存在一个问题：`reactive`只能代理**引用数据类型**的对象。

而`ref`却没有限制 既可以代理基本数据类型也可以代理引用数据类型。

**是怎么做到呢？**


vue源码给出的的解决方案是把基本数据类型套一个对象外壳变成一个对象：这个对象只有一个`value`属性，`value`属性的值就等于这个基本数据类型的值。然后，就可以用reactive方法将这个对象，变成响应式的Proxy对象。

实际上就是： ref(0) 等同于 reactive( { value:0 })

### 1. 使用

js中使用

```js
import { ref } from 'vue'
const count = ref(0)
```

模板中使用：

```html
<button>  {{ count}} </button>
```

在模板中使用 ref 时，不需要附加.value; 会自动解包 。

