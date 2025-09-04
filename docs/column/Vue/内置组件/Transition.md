# Vue Transition：打造流畅动画效果

## 一、Transition 基础用法

### 1. 基本过渡效果

```vue
<template>
  <button @click="show = !show">切换</button>
  <Transition>
    <p v-if="show">我会淡入淡出</p>
  </Transition>
</template>

<script setup>
import { ref } from "vue";
const show = ref(true);
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
```

### 2. 自定义类名

```vue
<Transition name="fade">
  <!-- 内容 -->
</Transition>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## 二、过渡的 6 个阶段类名

| 类名             | 作用时机       | 常用 CSS 属性         |
| ---------------- | -------------- | --------------------- |
| `v-enter-from`   | 进入动画开始前 | opacity: 0, transform |
| `v-enter-active` | 整个进入阶段   | transition 定义       |
| `v-enter-to`     | 进入动画完成后 | opacity: 1            |
| `v-leave-from`   | 离开动画开始前 | opacity: 1            |
| `v-leave-active` | 整个离开阶段   | transition 定义       |
| `v-leave-to`     | 离开动画完成后 | opacity: 0            |

## 三、JavaScript 钩子实现复杂动画

```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- 内容 -->
</Transition>

<script setup>
const onBeforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(20px)";
};

const onEnter = (el, done) => {
  anime({
    targets: el,
    opacity: 1,
    translateY: 0,
    duration: 300,
    complete: done
  });
};
</script>
```

## 四、常见过渡效果实现

### 1. 淡入淡出

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### 2. 滑动效果

```css
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
```

### 3. 缩放效果

```css
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter-from {
  transform: scale(0.5);
  opacity: 0;
}
.scale-leave-to {
  transform: scale(1.5);
  opacity: 0;
}
```

## 五、列表过渡 (TransitionGroup)

### 1. 基本列表动画

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">
    {{ item.text }}
  </li>
</TransitionGroup>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

### 2. 排序动画

```css
.list-move {
  transition: transform 0.8s ease;
}
```

## 六、性能优化技巧

1. **使用 will-change**

   ```css
   .v-enter-active,
   .v-leave-active {
     will-change: opacity, transform;
   }
   ```

2. **硬件加速**

   ```css
   transform: translateZ(0);
   ```

3. **简化动画属性**  
   优先使用 `opacity` 和 `transform`

4. **合理使用 duration**
   ```vue
   <Transition :duration="300">...</Transition>
   <!-- 或分开指定 -->
   <Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
   ```
