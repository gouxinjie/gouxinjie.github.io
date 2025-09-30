# Vue Transition：打造流畅动画效果

[[toc]]

在 `Vue` 中，`Transition` 是一个非常重要的功能，主要用于为 **元素和组件的进入、离开、更新** 添加 **过渡效果**。它可以帮助开发者在元素或组件生命周期发生变化时，轻松地应用过渡动画或过渡效果，从而提升用户体验。

还可以结合 CSS 动画、JavaScript 动画以及第三方动画库来实现各种复杂的动画效果。

## 1. `Transition` 的基本概念

`Transition` 是 Vue 提供的一个包裹元素或组件的标签，专门用于处理元素或组件在 **进入**、**离开**、**更新** 时的过渡效果。它可以配合 **CSS** 或 **JavaScript** 动画来实现动态效果。

### 基本用法

```vue
<template>
  <transition name="fade">
    <div v-if="show">Hello, Vue 3!</div>
  </transition>

  <button @click="show = !show">Toggle</button>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 解释：

- **`<transition>`**：是包裹需要进行过渡效果的元素或组件的标签。
- **`v-if` / `v-show`**：Vue 提供的指令，决定元素是否渲染。
- **CSS 过渡类**：`fade-enter-active` 和 `fade-leave-active` 用来指定过渡时的样式，`fade-enter` 和 `fade-leave-to` 则控制进入和离开的初始/结束状态。

## 2. `Transition` 的生命周期钩子

Vue 的 `Transition` 提供了多个生命周期钩子，用于在过渡的不同阶段执行操作：

- **`before-enter`**：进入过渡开始之前调用。
- **`enter`**：进入过渡过程中调用。
- **`after-enter`**：进入过渡结束之后调用。
- **`before-leave`**：离开过渡开始之前调用。
- **`leave`**：离开过渡过程中调用。
- **`after-leave`**：离开过渡结束之后调用。

### 示例：使用 JavaScript 钩子

```vue
<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <div v-if="show">Hello, Vue 3!</div>
  </transition>

  <button @click="show = !show">Toggle</button>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  },
  methods: {
    beforeEnter(el) {
      console.log("Before enter");
    },
    enter(el, done) {
      console.log("Enter");
      done(); // 手动完成过渡
    },
    afterEnter(el) {
      console.log("After enter");
    },
    beforeLeave(el) {
      console.log("Before leave");
    },
    leave(el, done) {
      console.log("Leave");
      done(); // 手动完成过渡
    },
    afterLeave(el) {
      console.log("After leave");
    }
  }
};
</script>
```

### 解释：

- **生命周期钩子**：通过 `@before-enter`、`@enter`、`@after-enter` 等钩子，可以在不同阶段执行操作。`done` 是在 `enter` 和 `leave` 钩子中必须调用的回调，用于通知 Vue 过渡已经完成。
- **`done`**：用于告诉 Vue 动画何时结束。如果是异步动画，必须手动调用 `done` 来完成过渡。

## 3. 使用 CSS 实现过渡

Vue 通过 CSS 动画或者 CSS 过渡来实现元素的动态效果。这些动画或过渡效果的类是由 `Transition` 组件自动添加的。

### 示例：使用 CSS 过渡

```vue
<template>
  <transition name="fade">
    <div v-if="show">Hello, Vue 3!</div>
  </transition>

  <button @click="show = !show">Toggle</button>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
```

### 解释：

- **`.fade-enter-active`**：控制进入过渡的动画。
- **`.fade-leave-active`**：控制离开过渡的动画。
- **`.fade-enter`**：指定元素进入时的初始状态。
- **`.fade-leave-to`**：指定元素离开时的结束状态。

## 4. 动画和过渡的配合

Vue 3 不仅支持 **CSS 过渡**，还可以结合 **CSS 动画** 或 **JavaScript 动画** 来实现更复杂的过渡效果。

### 示例：使用 CSS 动画

```vue
<template>
  <transition name="bounce">
    <div v-if="show">Bounce Animation</div>
  </transition>

  <button @click="show = !show">Toggle</button>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  }
};
</script>

<style>
.bounce-enter-active {
  animation: bounce 1s;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
```

### 解释：

- 使用 **CSS 动画** 来实现弹跳效果。通过 `@keyframes` 定义动画，`bounce-enter-active` 控制动画的持续时间。

## 5. `Transition` 和 `v-if` / `v-show`

- **`v-if`**：会销毁和重新创建 DOM 元素，因此适合使用过渡效果。
- **`v-show`**：不会销毁 DOM 元素，只是改变元素的显示与隐藏状态，因此过渡效果通常不会影响元素本身。

### 示例：`v-if` 与 `Transition`

```vue
<template>
  <transition name="fade">
    <div v-if="show">Hello, Vue 3!</div>
  </transition>
  <button @click="show = !show">Toggle</button>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 示例：`v-show` 与 `Transition`

```vue
<template>
  <transition name="fade">
    <div v-show="show">Hello, Vue 3!</div>
  </transition>
  <button @click="show = !show">Toggle</button>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 解释：

- 使用 `v-if` 时，Vue 会销毁并重新创建元素，因此过渡效果能够正常生效。
- 使用 `v-show` 时，Vue 只会改变元素的 `display` 样式，元素并不会被销毁，因此 `v-show` 不会触发过渡的移除。

## 6. `Transition` 和 `key` 的配合

`key` 可以帮助 Vue 跟踪每个元素的身份，在元素列表变化时，Vue 会重新渲染 DOM。与 `Transition` 配合使用时，可以确保过渡效果正常工作。

### 示例：使用 `key` 控制元素的过渡

```vue
<template>
  <transition name="fade">
    <div :key="currentKey">Current content: {{ currentKey }}</div>
  </transition>
  <button @click="nextContent">Next Content</button>
</template>

<script>
export default {
  data() {
    return {
      currentKey: 1
    };
  },
  methods: {
    nextContent() {
      this.currentKey++;
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 解释：

- 每当 `currentKey` 改变时，Vue 会识别为新的一项，触发

元素的过渡效果。
