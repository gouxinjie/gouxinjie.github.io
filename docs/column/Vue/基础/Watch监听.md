# Watch 监听详细讲解

[[toc]]

::: tip watch 监听的作用

- 计算属性允许我们声明性地计算衍生值。然而在有些情况下，我们需要在状态变化时执行一些“副作用”；  
- 例如更改`DOM`，或是根据异步操作的结果去修改另一处的状态。组合式 `API` 中，我们可以使用 `watch` 函数在每次响应式状态发生变化时触发回调函数从而来进行一些其它的操作；  
- 可以在页面使用多次；

:::

## 1，可以监听什么数据？

`watch` 监听的第一个参数可以是不同形式的“数据源”：它可以是一个` ref` (包括计算属性)、一个响应式对象、一个 `getter` 函数、或多个数据源组成的数组；

## 2，使用监听

```javascript
<script setup>
import { reactive, ref, watch, onMounted } from "vue";
// 定义响应式数据
const message = ref("");
const a = ref(1);
const b = ref(2);
const messageList = ref([
  { name: "Eula", age: "18", isActive: false },
  { name: "Umbra", age: "17", isActive: false },
  { name: "Kaya", age: "19", isActive: false },
  { name: "Diluk", age: "19", isActive: false },
]);
const obj = reactive({ count: 0 });

// 定义一个简单的seeter函数
function count() {
  return a.value + b.value;
}

// 1，监听一个响应式字符串
watch(message, (newX) => {
// 如果等于123 来修改messageList的值 看messageList的变化会不会被监听：可以监听到 数组需要添加深度监听
  if (newX == "123") {
    messageList.value.push({ name: "222" });
    console.log("messageList.value", messageList.value);
  }
});

//2，监听一个响应式数组  要使用深度监听 deep:true
watch(
  messageList,
  (newX) => {
    console.log(`拿到改变后的数组：`, messageList.value);

    // 如果等于3 在改变a的值看下面的count函数会不会监听到  监听到了
    if (count() == 3) {
      a.value = 3;
    }
  },
  { deep: true }
);

// 3，监听一个函数
watch(count, (newX) => {
  console.log("新的函数值：", newX); // 3+2 = 5 监听到了 函数值的变化
});

//4，多个来源组成的数组  按照顺序进行监听的
watch([message, messageList, count], ([newX, newY, newZ]) => {
  console.log("监听的数组第一项newX：", newX);
  console.log("监听的数组第二项newY：", newY);
  console.log("监听的数组第三项newX：", newZ);
});

onMounted(() => {
  console.log("Mounted");
});
</script>

<template>
  <div class="watch">
    <h3>watch监听演示</h3>
    <p>Message is: {{ message }}</p>
    <input v-model="message" placeholder="请输入123触发其它监听" />
  </div>
</template>

<style scoped></style>

```

## 3，监听器里面可以进行异步操作

触发监听后可以`立即执行异步`的请求操作；这解决了计算属性不能操作异步的弊端；因为`计算属性(computed)`是通过 return 返回值传递参数 异步操作的时候 `return` 是没有意义的；

```javascript
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>

```

## 4，不能直接监听响应式对象的属性值

```javascript
const obj = reactive({ count: 0 });
// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`);
});
```

解决方法：需要使用一个函数返回这个属性值

```javascript
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`);
  }
);
```

## 5，watchEffect 与 watch 的区别(细节)

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` **只追踪明确侦听的数据源**。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
- `watchEffect`，**则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性**。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

**`watchEffects` 使用如下：**

侦听器的回调使用与源完全相同的响应式状态是很常见的。

如下代码，在每当 `todoId` 的引用发生变化时使用侦听器来加载一个远程资源：加载资源时并用到了 todoId

```js
const todoId = ref(1);
const data = ref(null);
watch(
  todoId,
  async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId.value}`);
    data.value = await response.json();
  },
  { immediate: true }
);
```

特别是注意侦听器是如何两次使用 `todoId` 的，一次是作为源，另一次是在回调中。

我们可以用 [`watchEffect` 函数](https://cn.vuejs.org/api/reactivity-core.html#watcheffect) 来简化上面的代码。`watchEffect()` 允许我们**自动跟踪回调的响应式依赖**。上面的侦听器可以重写为：

```js
watchEffect(async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId.value}`);
  data.value = await response.json();
});
```

## 6，监听器回调的触发时机

如果想在侦听器回调中能访问被 Vue 更新**之后**的所属组件的 DOM，你需要指明 `flush: 'post'` 或直接使用简写：watchPostEffect（）

设置 `flush: 'post'` 将会使侦听器延迟到组件渲染之后再执行

```js
watch(source, callback, {
  flush: "post"
});
watchEffect(callback, {
  flush: "post"
});
```

你还可以创建一个同步触发的侦听器，它会在 Vue 进行任何更新之前触发：别名 `watchSyncEffect()`

```js
watch(source, callback, {
  flush: "sync"
});
watchEffect(callback, {
  flush: "sync"
});
```

## 7，停止侦听器

在 `setup()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器

一个关键点是，侦听器必须用**同步**语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下方这个例子：。

```js
<script setup>
  import {watchEffect} from 'vue' // 它会自动停止 watchEffect(() => {}) // ...这个则不会！ setTimeout(() => {watchEffect(() => {})}, 100)
</script>
```

要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数

```js
const unwatch = watchEffect(() => {});
// ...当该侦听器不再需要时
unwatch();
```
