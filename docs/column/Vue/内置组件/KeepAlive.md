# Vue KeepAlive：优化组件状态缓存

## 一、KeepAlive 核心概念

`KeepAlive` 是 Vue 内置的抽象组件，用于缓存动态组件实例，避免重复渲染带来的性能损耗。它的核心特性包括：

- 💾 **状态保留**：缓存组件实例的状态（数据、DOM 状态等）
- ⚡ **性能优化**：减少不必要的组件挂载/卸载
- 🏷️ **条件缓存**：通过 `include`/`exclude` 控制缓存策略
- 🔢 **最大缓存**：通过 `max` 控制缓存实例数量

## 二、基础用法

### 1. 基本缓存

```vue
<template>
  <button @click="toggleComponent">切换组件</button>
  <KeepAlive>
    <component :is="currentComponent"></component>
  </KeepAlive>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import CompA from "./CompA.vue";
import CompB from "./CompB.vue";

const currentComponent = shallowRef(CompA);
const toggleComponent = () => {
  currentComponent.value = currentComponent.value === CompA ? CompB : CompA;
};
</script>
```

### 2. 结合路由使用

```vue
<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
```

## 三、缓存控制策略

### 1. 包含/排除特定组件

```vue
<!-- 只缓存 CompA 和 CompB -->
<KeepAlive :include="['CompA', 'CompB']">
  <component :is="currentComponent"></component>
</KeepAlive>

<!-- 排除 CompC -->
<KeepAlive :exclude="['CompC']">
  <component :is="currentComponent"></component>
</KeepAlive>
```

### 2. 限制缓存数量

```vue
<KeepAlive :max="3">
  <!-- 最多缓存3个组件实例 -->
  <component :is="currentComponent"></component>
</KeepAlive>
```

## 四、生命周期钩子

被 `KeepAlive` 缓存的组件会获得两个特殊的生命周期钩子：

1. **onActivated**：组件被插入到 DOM 时调用
2. **onDeactivated**：组件从 DOM 移除时调用

```javascript
import { onActivated, onDeactivated } from "vue";

onActivated(() => {
  console.log("组件激活");
  // 恢复定时器或其他副作用
});

onDeactivated(() => {
  console.log("组件停用");
  // 清除定时器或其他副作用
});
```

## 五、高级用法

### 1. 自定义缓存策略

```javascript
// 自定义缓存键生成函数
const cacheKey = (component) => {
  return component.type.name + (component.props.id || '')
}

<KeepAlive :cache-key="cacheKey">
  <component :is="currentComponent" :id="itemId" />
</KeepAlive>
```

### 2. 结合 Transition 使用

```vue
<RouterView v-slot="{ Component }">
  <Transition name="fade" mode="out-in">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </Transition>
</RouterView>
```
