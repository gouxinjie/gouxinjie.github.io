# Vue Suspense ：优雅处理异步依赖

## 一、Suspense 核心概念

`Suspense 是 Vue 3` 新增的内置组件，用于协调多个嵌套异步依赖的加载状态，提供统一的加载中/错误处理机制。它的核心特性包括：

- ⏳ **统一加载状态**：管理多个嵌套异步组件的加载状态
- 🛠️ **两种使用模式**：支持组合式 API 的 `async setup()` 和异步组件
- 💡 **插槽机制**：通过 `#default` 和 `#fallback` 插槽控制展示
- 🚦 **错误处理**：可捕获嵌套异步操作的错误

## 二、基础用法

### 1. 配合异步组件

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const AsyncComponent = defineAsyncComponent(() => import("./AsyncComponent.vue"));
</script>
```

### 2. 配合 async setup()

```vue
<!-- AsyncComponent.vue -->
<script setup>
const data = await fetchData(); // 异步操作
</script>

<!-- 父组件 -->
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <Spinner />
  </template>
</Suspense>
```

## 三、Suspense 生命周期

### 1. 挂载阶段流程

1. 开始渲染 `<Suspense>` 时显示 `#fallback` 内容
2. 等待所有异步依赖解析完成
3. 当所有异步依赖就绪后显示 `#default` 内容

### 2. 特殊生命周期钩子

- **onPending**：挂载或更新开始时触发
- **onResolve**：默认插槽内容解析完成时触发
- **onFallback**：回退插槽内容显示时触发

```javascript
import { onPending, onResolve } from "vue";

onPending(() => {
  console.log("数据加载开始");
});

onResolve(() => {
  console.log("数据加载完成");
});
```

## 四、高级用法

### 1. 错误处理

```vue
<Suspense @resolve="onResolve" @fallback="onFallback" @error="onError">
  <!-- 内容 -->
</Suspense>

<script setup>
const onError = (err) => {
  console.error("加载失败:", err);
  // 显示错误页面或重试逻辑
};
</script>
```

### 2. 嵌套 Suspense

```vue
<Suspense>
  <template #default>
    <ParentComponent />
  </template>
  <template #fallback>
    <MainLoader />
  </template>
</Suspense>

<!-- ParentComponent.vue -->
<template>
  <Suspense>
    <ChildComponent />
    <template #fallback>
      <LocalLoader />
    </template>
  </Suspense>
</template>
```

### 3. 结合路由使用

```vue
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Suspense timeout="0">
      <component :is="Component"></component>
      <template #fallback>
        <GlobalLoader />
      </template>
    </Suspense>
  </template>
</RouterView>
```

## 五、关键配置选项

### 1. timeout 属性

```vue
<Suspense :timeout="500">
  <!-- 
    如果500ms内未解析完成，
    将显示fallback内容 
  -->
</Suspense>
```

### 2. suspensible 属性

```javascript
defineAsyncComponent({
  loader: () => import("./Component.vue"),
  suspensible: false // 此组件不触发Suspense
});
```

## 六、性能优化技巧

1. **分块加载**：结合异步组件实现代码分割

   ```javascript
   const HeavyComponent = defineAsyncComponent(() => import("./HeavyComponent.vue"));
   ```

2. **骨架屏优化**：在 fallback 中使用骨架屏提升体验

   ```vue
   <template #fallback>
     <ArticleSkeleton />
   </template>
   ```

3. **预加载策略**：在用户 hover 时预加载组件

   ```javascript
   const preloadComponent = () => import("./Component.vue");
   ```

4. **错误边界**：配合 ErrorCaptured 处理嵌套错误

## 七、与 React Suspense 的区别

| 特性         | Vue Suspense         | React Suspense       |
| ------------ | -------------------- | -------------------- |
| **触发条件** | async setup/异步组件 | 任意异步操作         |
| **错误处理** | 需手动@error 捕获    | 需配合 ErrorBoundary |
| **SSR 支持** | 完全支持             | 有限支持             |
| **嵌套行为** | 自动等待所有依赖     | 需要手动协调         |
