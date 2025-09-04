# defineExpose 的使用场景

---

在 Vue 3 `中，defineExpose` 是一个` Composition API` 提供的功能，用于自定义组件实例暴露给父组件的属性和方法。  
默认情况下，当使用 `setup` 语法糖时，组件内部的状态（如响应式变量、方法等）不会直接暴露给父组件。`defineExpose` 允许你明确指定哪些属性或方法可以被父组件访问。

::: tip 使用场景

当你需要在父组件中通过 `ref` 或 `template ref` 访问子组件的特定属性或方法时。当你希望控制暴露给父组件的内容，避免将整个组件实例暴露出去，从而减少不必要的耦合。

:::

假设你有一个子组件 `ChildComponent.vue`，你想暴露其中的一个方法 `doSomething` 给父组件使用，如下：

子组件（ChildComponent.vue）

```js
<template>
  <div>这是一个子组件</div>
</template>

<script setup>
import { defineExpose } from 'vue'

// 定义一个方法
const doSomething = () => {
  console.log('Doing something...')
}

// 使用 defineExpose 暴露方法
defineExpose({
  doSomething
})
</script>

```

父组件（ParentComponent.vue）

```js
<template>
  <div>
    <h1>这是父组件</h1>
    <ChildComponent ref="childRef" />
    <button @click="callChildMethod">调用子组件的方法</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 创建一个 ref 来引用子组件
const childRef = ref(null)

// 在按钮点击时调用子组件的方法
const callChildMethod = () => {
  if (childRef.value) {
    childRef.value.doSomething()
  }
}

// 可以在 onMounted 中检查是否成功引用了子组件
onMounted(() => {
  console.log(childRef.value) // 应该输出子组件实例
})
</script>

```

::: warning 注意 

`defineExpose` 仅在使用 `<script setup>` 语法时有效。避免过度暴露：只暴露必要的属性和方法，以保持组件之间的松耦合。 

:::
