# useImperativeHandle让子组件“暴露方法”给父组件调用

[[toc]]

> React 一直提倡“数据流向下、事件流向上”，即**父 → 子传数据，子 → 父触发回调**。  
> 但在某些场景下，我们希望父组件**直接调用子组件内部函数**，  
> 比如：让子组件聚焦、清空输入框、打开弹窗等。
>
> 这时，`useImperativeHandle` 就登场了！

## 一、useImperativeHandle 是什么？

### 📘 定义：

```tsx
useImperativeHandle(ref, createHandle, [deps]);
```

| 参数           | 类型         | 说明                                     |
| -------------- | ------------ | ---------------------------------------- |
| `ref`          | React.Ref    | 来自父组件传入的 ref                     |
| `createHandle` | () => object | 返回一个对象，定义父组件可访问的“方法”   |
| `[deps]`       | Array        | 可选依赖数组，控制重新创建暴露对象的时机 |

> 它的作用是：**自定义 ref 暴露给父组件的内容**。

## 二、最经典的例子：父组件控制子组件聚焦

### ✅ 普通做法（错误的期望）

```jsx
function Child() {
  const inputRef = useRef();
  return <input ref={inputRef} />;
}

function Parent() {
  const childRef = useRef();

  return (
    <div>
      <Child ref={childRef} /> {/* ❌ 无法直接访问 inputRef */}
      <button onClick={() => childRef.current.focus()}>聚焦</button>
    </div>
  );
}
```

> 这段代码会报错：`childRef.current` 是 `null`！因为默认情况下，函数组件**不会将内部 ref 暴露出去**。

## 三、正确做法：forwardRef + useImperativeHandle

```jsx
import React, { useRef, forwardRef, useImperativeHandle } from "react";

const ChildInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  // 通过 useImperativeHandle 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => (inputRef.current.value = "")
  }));

  return <input ref={inputRef} placeholder="请输入..." />;
});

export default function Parent() {
  const childRef = useRef();

  return (
    <div>
      <ChildInput ref={childRef} />
      <button onClick={() => childRef.current.focus()}>聚焦</button>
      <button onClick={() => childRef.current.clear()}>清空</button>
    </div>
  );
}
```

✅ 执行结果：

- 点击“聚焦” → 子输入框获得焦点；
- 点击“清空” → 子输入框内容被清空；
- 父组件无需访问 DOM，只调用子组件暴露的方法。

## 四、工作原理解析

1️⃣ `forwardRef`：允许父组件传入的 `ref` 被**传递到子组件内部**。

2️⃣ `useImperativeHandle`：控制 **这个 ref 暴露给父组件的内容**。

📦 可以理解为：

> 默认 ref 暴露整个 DOM 节点；
>
> 使用 `useImperativeHandle` 后，只暴露你指定的接口。

```js
useImperativeHandle(ref, () => ({
  // 父组件可调用的方法
  doSomething: () => { ... },
}));
```

## 五、更多实战场景

### 1️⃣ 控制 Modal 弹窗

```jsx
import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";

const Modal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false)
  }));

  if (!visible) return null;

  return (
    <div className="modal">
      <div className="content">
        {props.children}
        <button onClick={() => setVisible(false)}>关闭</button>
      </div>
    </div>
  );
});

export default function App() {
  const modalRef = useRef();

  return (
    <>
      <button onClick={() => modalRef.current.open()}>打开弹窗</button>
      <Modal ref={modalRef}>这里是弹窗内容</Modal>
    </>
  );
}
```

✅ 父组件无需控制状态，只调用 `modalRef.current.open()`。

### 2️⃣ 表单校验组件

```jsx
const Form = forwardRef((props, ref) => {
  const [value, setValue] = useState("");

  useImperativeHandle(ref, () => ({
    validate: () => value.trim() !== "",
    getValue: () => value
  }));

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
});

function Parent() {
  const formRef = useRef();

  const handleSubmit = () => {
    if (!formRef.current.validate()) {
      alert("请输入内容！");
      return;
    }
    console.log("提交内容：", formRef.current.getValue());
  };

  return (
    <div>
      <Form ref={formRef} />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}
```

✅ 父组件通过 ref 可直接校验和获取数据。

## 六、依赖项的作用

第三个参数 `[deps]` 控制暴露对象的更新时机。

```jsx
useImperativeHandle(
  ref,
  () => ({
    scrollToTop: () => listRef.current.scrollTo(0, 0)
  }),
  []
);
```

- 若省略依赖数组 → 每次渲染都会创建新对象；
- 若传入空数组 → 仅创建一次；
- 若传入依赖 → 当依赖变化时重新定义。

💡 建议像 `useMemo` 一样合理使用依赖，避免不必要的更新。
