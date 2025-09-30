# watchSyncEffect：同步执行的响应式副作用

[[toc]]

## 一、核心概念与基本用法

`watchSyncEffect` 是 Vue 3.2+ 引入的特殊版本 `watchEffect`，它会在**依赖变化时同步立即执行**副作用函数。这种执行方式使其成为需要即时反应的场景的理想选择。

它让你能够在响应式数据变化时，同步执行副作用。与 `watchEffect` 不同，`watchSyncEffect` 是同步的，这意味着它会在数据变化后的当前执行周期内执行，而不是异步等待。

### 基础示例

```javascript
import { ref, watchSyncEffect } from "vue";

const count = ref(0);

// 同步响应变化
watchSyncEffect(() => {
  console.log("count同步变化:", count.value);
});

// 立即触发上面的console.log
count.value = 1;
```

## 二、与其它 watch 变体的关键区别

| 特性         | watchEffect (pre) | watchPostEffect (post) | watchSyncEffect (sync) |
| ------------ | ----------------- | ---------------------- | ---------------------- |
| **执行时机** | 更新队列前        | DOM 更新后             | 同步立即执行           |
| **执行顺序** | 默认              | 最后                   | 最先                   |
| **DOM 状态** | 可能未更新        | 已更新                 | 可能未更新             |
| **适用场景** | 常规副作用        | DOM 相关操作           | 需要即时反应的操作     |

## 三、典型应用场景

### 1. 表单即时验证

```javascript
const inputValue = ref("");
const errorMessage = ref("");

watchSyncEffect(() => {
  if (inputValue.value.length > 10) {
    errorMessage.value = "不能超过10个字符";
  } else {
    errorMessage.value = "";
  }
});
```

### 2. 状态同步

```javascript
const source = ref(0);
const target = ref(0);

// 保持target与source完全同步
watchSyncEffect(() => {
  target.value = source.value;
});
```

### 3. 紧急状态处理

```javascript
const systemStatus = ref("normal");

watchSyncEffect(() => {
  if (systemStatus.value === "emergency") {
    // 立即执行紧急处理
    triggerEmergencyProtocol();
  }
});
```

## 四、高级用法与技巧

### 1. 性能敏感操作

```javascript
const highPriorityState = ref(null);

watchSyncEffect(() => {
  // 对高频变化的状态进行低开销处理
  localStorage.setItem("hp-state", highPriorityState.value);
});
```

### 2. 与自定义 Ref 结合

```javascript
function syncRef(source) {
  const target = ref(source.value);

  watchSyncEffect(() => {
    target.value = source.value;
  });

  return target;
}
```

### 3. 调试技巧

```javascript
watchSyncEffect(
  () => {
    // 副作用逻辑
  },
  {
    onTrack(e) {
      debugger; // 依赖被追踪时
    },
    onTrigger(e) {
      debugger; // 依赖变化时
    }
  }
);
```
