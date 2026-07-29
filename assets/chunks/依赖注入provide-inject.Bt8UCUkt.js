const n=`# Vue 依赖注入(provide/inject) 的原理

[[toc]]

在 Vue 中，\`provide\` 和 \`inject\` 用于解决跨层级组件通信（避免“Prop 逐级透传 / Prop Drilling”）。

它的核心设计非常优雅，在 **Vue 3** 中，实现原理本质上巧用了 **JavaScript 原型链（Prototype Chain）** 的查找特性；而在 **Vue 2** 中，则是基于 **组件实例链逐级向上遍历（\`while\` 循环）**。

![provide-inject-vue3-vue2](../images/provide.png)

## 一、 Vue 3 的实现原理：原型链（Prototype Chain）

Vue 3 的 \`provide / inject\` 依靠组件实例（Component Instance）上的 \`provides\` 对象来实现。

### 1. 关键的数据结构

每一个组件实例内部都有一个 \`provides\` 属性：

* 默认情况下，子组件的 \`instance.provides\` 简单**继承/指向**父组件的 \`provides\`。
* 当子组件 **自己也调用 \`provide()\`** 时，Vue 会以父组件的 \`provides\` 为原型（\`Object.create()\`）创建一个新的 \`provides\` 对象。

### 2. \`provide\` 源码逻辑与原型链构建

在 Vue 3 源码中（简化版逻辑）：

\`\`\`typescript
export function provide<T>(key: InjectionKey<T> | string | number, value: T) {
  // 1. 获取当前正在初始化的组件实例
  const currentInstance = currentInstance

  if (currentInstance) {
    let provides = currentInstance.provides
    const parentProvides = currentInstance.parent && currentInstance.parent.provides

    // 2. 第一次在该组件中 provide 时，进行初始化
    // 默认情况下 provides 和 parent.provides 指向同一个对象
    if (provides === parentProvides) {
      // 巧用 Object.create：以父级的 provides 为原型创建一个新的对象！
      provides = currentInstance.provides = Object.create(parentProvides)
    }

    // 3. 将 key-value 挂载到全新的 provides 对象上
    provides[key as string] = value
  }
}

\`\`\`

#### 原型链是如何建立起来的？

假设存在组件树：\`App (Root) -> Parent -> Child\`

1. **Root 组件**：\`provides = {}\`
2. **Parent 组件初始化**：
* 默认继承 Root：\`Parent.provides = Root.provides\`
* Parent 调用 \`provide('theme', 'dark')\`：
* 触发 \`provides === parentProvides\` 校验，执行 \`Parent.provides = Object.create(Root.provides)\`
* 此时 \`Parent.provides.__proto__ === Root.provides\`


3. **Child 组件初始化**：
* 默认继承 Parent：\`Child.provides = Parent.provides\`



最终形成的 \`provides\` 原型链链路如下：

\`\`\`text
Child.provides  ──(继承)──>  Parent.provides  ──(__proto__)──>  Root.provides

\`\`\`

### 3. \`inject\` 源码逻辑：直接属性查找

因为原型链已经建立好，\`inject\` 查找数据的实现变得极为简单和高效：

\`\`\`typescript
export function inject(key, defaultValue, treatDefaultAsFactory = false) {
  // 1. 获取当前组件实例
  const instance = currentInstance || currentRenderingInstance

  if (instance) {
    // 2. 注意：如果 ancestor/parent 存在，优先从 parent.provides 中查找
    const provides = instance.parent == null
      ? instance.vnode.appContext && instance.vnode.appContext.provides
      : instance.parent.provides

    // 3. 利用 JS 原型链机制直接检索 key
    if (provides && key in provides) {
      return provides[key]
    } else if (arguments.length > 1) {
      // 支持默认值
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance.proxy)
        : defaultValue
    }
  }
}

\`\`\`

因为 \`provides\` 建立了原型链结构，执行 \`key in provides\` 或 \`provides[key]\` 时，JavaScript 引擎会**自动沿着 \`__proto__\` 向上查找**，直到找到对应的属性或到达终端 \`null\`。这意味着 \`inject\` 查找的时间复杂度接近 $O(1)$，效率极高。

## 二、 Vue 2 的实现原理：沿父链向上递归遍历

在 Vue 2 的 Options API 中，实现机制有所不同：

1. **\`provide\` 阶段**：
在组件初始化（\`initInjections\` -> \`initProvide\`）时，运行 \`provide\` 选项（若是函数则执行并获取返回的对象），直接将其挂载在 \`vm._provided\` 属性上。
2. **\`inject\` 阶段**：
在子组件初始化 \`initInjections\` 时，Vue 2 会通过一个 \`while\` 循环，**沿着 \`$parent\` 指针逐级向上查找**：

\`\`\`javascript
// Vue 2 核心思想模拟
function initInjections (vm) {
  const result = resolveInject(vm.$options.inject, vm)
  // ... 将 result 定义为响应式/挂载到 vm 上
}

function resolveInject (inject, vm) {
  if (inject) {
    const result = {}
    const keys = Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      let source = vm
      // 沿 $parent 树一直向上搜寻，直到找到 _provided 中包含 key 的祖先
      while (source) {
        if (source._provided && hasOwn(source._provided, key)) {
          result[key] = source._provided[key]
          break
        }
        source = source.$parent
      }
    }
    return result
  }
}

\`\`\`

* **Vue 2 缺点**：如果有深度嵌套的组件树，每次 \`inject\` 都需要运行 \`while\` 循环做链表遍历，查找性能略低于 Vue 3 的原型链。

## 三、 响应式原理（为什么 provide 的值能保持响应式？）

许多开发者有一个误区，以为 \`provide\` 本身会自动把数据变成响应式的。**事实上，\`provide\` / \`inject\` 本身只负责传递引用（Pass by reference）。**

1. **传递非响应式数据（如普通字符串/数字）**：
\`provide('color', 'red')\` -> 子组件 \`inject('color')\` 拿到的是静态字面量，后续父组件修改变量，子组件不会触发视图更新。
2. **传递响应式数据（如 \`ref\` 或 \`reactive\`）**：
\`provide('color', ref('red'))\` -> \`provides\` 对象上保存的是该 \`ref\` 的引用。
当子组件在 Template 中使用这个 \`inject\` 进来的 \`ref\` 时，**子组件的渲染 Watcher 会自动收集这个 \`ref\` 的依赖**。当父组件更新 \`ref.value\` 时，依赖触发，子组件自然随之重新渲染。


## 四、 Vue 2 vs Vue 3 原理对比表

| 维度 | Vue 2 实现 | Vue 3 实现 |
| --- | --- | --- |
| **内部存储字段** | \`vm._provided\` | \`instance.provides\` |
| **查找算法** | \`while(source = source.$parent)\` 递归向上遍历 | 利用 \`Object.create()\` 建立原型链，直接读取 |
| **性能表现** | 嵌套越深，查找越慢 | 借助 JS 引擎优化，原型链查找性能更优 |
| **与 Setup 配合** | Options 阶段通过 \`initInjections\` 确定 | 可以在 \`setup()\` 中灵活多次调用 \`provide/inject\` |

## 五、 总结

Vue 的 \`provide / inject\` 依赖注入机制，巧妙地避开了组件层层透传 Props 的尴尬。

* **在 Vue 3 中**，它利用 JavaScript 的 \`Object.create()\` 在组件初始化时动态构建了一条基于 \`provides\` 的原型链，让 \`inject\` 操作可以直接依赖引擎底层的属性查找机制，高效且优雅。
* **在响应式处理上**，它遵循“只传引用，不改本质”的原则，完美契合 Vue 自身的依赖收集与响应式更新体系。

掌握了这一底层原理，在日常架构大型应用或封装复杂组件库（如 Form、Tree、Menu 等）时，我们就能更加游刃有余地运用 \`provide / inject\` 来设计解耦、高效的通信方案。
`;export{n as default};
