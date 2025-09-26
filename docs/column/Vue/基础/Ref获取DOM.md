# Vue 中使用 ref 获取 DOM 元素

## 一、基本用法

### 1. 模板引用声明

```vue
<template>
  <!-- 通过 ref 属性标记 DOM 元素 -->
  <input ref="inputRef" type="text" />
</template>

<script setup>
import { ref, onMounted } from "vue";

// 声明一个与模板 ref 同名的响应式 ref
const inputRef = ref(null);

onMounted(() => {
  // DOM 元素将在组件挂载后赋值
  inputRef.value.focus(); // 自动获取焦点
});
</script>
```

### 2. 选项式 API 写法

```javascript
export default {
  data() {
    return {
      inputRef: null
    };
  },
  mounted() {
    this.inputRef.focus();
  }
};
```

## 二、v-for 中的 ref 使用

```vue
<template>
  <ul>
    <li v-for="item in list" :key="item.id" ref="itemRefs">
      {{ item.text }}
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";

const list = ref([
  { id: 1, text: "Item 1" },
  { id: 2, text: "Item 2" }
]);

const itemRefs = ref([]);

onMounted(() => {
  console.log(itemRefs.value); // 包含所有 li 元素的数组
});
</script>
```

## 三、动态 ref

```vue
<template>
  <div v-for="item in items" :key="item.id">
    <button @click="selectItem(item.id)" :ref="(el) => setItemRef(el, item.id)">
      {{ item.text }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([...])
const itemRefs = ref({})

const setItemRef = (el, id) => {
  if (el) {
    itemRefs.value[id] = el
  }
}

const selectItem = (id) => {
  const el = itemRefs.value[id]
  el.classList.add('selected')
}
</script>
```

## 四、组件 ref 的特殊处理

### 1. 获取子组件实例

```vue
<!-- 父组件 -->
<template>
  <ChildComponent ref="childRef" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import ChildComponent from "./ChildComponent.vue";

const childRef = ref(null);

onMounted(() => {
  // 访问子组件暴露的方法和属性
  childRef.value.someMethod();
});
</script>

<!-- 子组件 ChildComponent.vue -->
<script setup>
const someMethod = () => {
  console.log("子组件方法被调用");
};

// 明确暴露给父组件的内容
defineExpose({
  someMethod
});
</script>
```

### 2. 选项式 API 组件

```javascript
// 子组件
export default {
  methods: {
    someMethod() {
      console.log("方法被调用");
    }
  }
};
// 父组件可以直接通过 ref 访问所有实例方法和属性
```

## 五、最佳实践

1. **空值检查**：总是检查 ref 值是否为 null

   ```javascript
   if (inputRef.value) {
     inputRef.value.focus();
   }
   ```

2. **生命周期时机**：在 onMounted 或之后访问 DOM

   ```javascript
   onMounted(() => {
     // 安全访问 DOM
   });
   ```

3. **响应式更新**：DOM 变化时重新获取 ref

   ```javascript
   watch(someCondition, () => {
     nextTick(() => {
       // DOM 更新后执行操作
     });
   });
   ```

4. **清理引用**：必要时清除 ref
   ```javascript
   const cleanupRef = (el) => {
     if (el) {
       // 设置引用
     } else {
       // 清理工作
     }
   };
   ```
