# 深入理解 React 的 useRef Hook：DOM 引用与可变值的容器

`useRef`是 React 提供的一个多功能 Hook，它主要有两个核心用途：**访问 DOM 元素**和**保存可变值**而不会触发组件重新渲染。

## 基本概念

### 什么是 useRef？

`useRef`返回一个可变的 ref 对象，其`.current`属性被初始化为传入的参数（`initialValue`）。这个对象在组件的整个生命周期内保持不变。

### 基本语法

```javascript
const refContainer = useRef(initialValue);
```

## 核心特性

### 1. 引用持久性

`useRef`创建的 ref 对象在组件的整个生命周期中保持不变，即使组件重新渲染：

```javascript
function Component() {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`渲染次数: ${renderCount.current}`);
  });

  return <div>查看控制台日志</div>;
}
```

### 2. 不会触发重新渲染

与`useState`不同，修改`ref.current`的值不会导致组件重新渲染：

```javascript
function Counter() {
  const count = useRef(0);

  const increment = () => {
    count.current += 1;
    console.log(count.current); // 值会变化，但不会触发渲染
  };

  return (
    <div>
      <button onClick={increment}>增加</button>
      <p>当前值: {count.current}</p> {/* 这里不会更新 */}
    </div>
  );
}
```

## 主要使用场景

### 1. 访问 DOM 元素（最常见用法）

```javascript
function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    inputEl.current.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>聚焦输入框</button>
    </>
  );
}
```

### 2. 保存可变值（不触发渲染）

```javascript
function TimerComponent() {
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log("定时器运行中...");
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  return <button onClick={stopTimer}>停止定时器</button>;
}
```

### 3. 保存上一次的值

```javascript
function Component({ value }) {
  const prevValue = useRef();

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return (
    <div>
      当前值: {value}, 上一次值: {prevValue.current}
    </div>
  );
}
```

## 与 createRef 的区别

| 特性     | useRef                       | createRef                |
| -------- | ---------------------------- | ------------------------ |
| 适用场景 | 函数组件                     | 类组件                   |
| 生命周期 | 在整个组件生命周期中保持不变 | 每次渲染都会创建新的 ref |
| 性能     | 更高效                       | 每次渲染都新建对象       |

## 高级用法

### 1. 转发 Refs（forwardRef）

当需要在父组件中访问子组件的 DOM 节点时：

```javascript
const FancyInput = React.forwardRef((props, ref) => {
  return <input ref={ref} className="fancy-input" {...props} />;
});

function Parent() {
  const inputRef = useRef();

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={focusInput}>聚焦子组件输入框</button>
    </>
  );
}
```

### 2. 回调 Refs

另一种设置 refs 的方式，在组件挂载和卸载时会调用回调函数：

```javascript
function MeasureExample() {
  const [height, setHeight] = useState(0);
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div ref={measuredRef}>
      <h1>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </div>
  );
}
```

### 3. 多个 Refs 管理

```javascript
function MultiInputForm() {
  const inputs = [useRef(null), useRef(null), useRef(null)];

  const focusNext = (index) => {
    if (inputs[index + 1]) {
      inputs[index + 1].current.focus();
    }
  };

  return (
    <form>
      {inputs.map((ref, index) => (
        <input key={index} ref={ref} onChange={() => focusNext(index)} />
      ))}
    </form>
  );
}
```

## 最佳实践

### 1. 避免在渲染期间修改 refs

```javascript
// 错误：在渲染期间修改ref
function Component() {
  const myRef = useRef(0);
  myRef.current = 42; // 不应该这样做

  return <div />;
}

// 正确：在事件处理或effect中修改
function Component() {
  const myRef = useRef(0);

  useEffect(() => {
    myRef.current = 42; // 可以这样做
  }, []);

  return <div />;
}
```

### 2. 不要过度使用 refs

优先考虑 React 的声明式编程模型，只在必要时使用 refs（如管理焦点、媒体播放或集成第三方 DOM 库）。

### 3. 与 TypeScript 配合使用

```typescript
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    // TypeScript知道current可能是null
    if (inputRef.current) {
      inputRef.current.focus(); // 安全访问
    }
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>聚焦</button>
    </>
  );
}
```

## 常见误区

### 1. 误用为状态管理

```javascript
// 错误：使用ref代替state
function Counter() {
  const count = useRef(0);

  const increment = () => {
    count.current += 1;
    // 不会触发重新渲染！
  };

  return (
    <button onClick={increment}>
      Count: {count.current} {/* 不会更新 */}
    </button>
  );
}

// 正确：需要UI更新的值应该用useState
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((c) => c + 1);
  };

  return (
    <button onClick={increment}>
      Count: {count} {/* 会更新 */}
    </button>
  );
}
```

### 2. 忘记 ref 可能为 null

```javascript
function Component() {
  const divRef = useRef(null);

  useEffect(() => {
    console.log(divRef.current.offsetHeight); // 可能在挂载前访问
  }, []);

  return <div ref={divRef}>内容</div>;
}

// 正确：在effect中添加条件检查
useEffect(() => {
  if (divRef.current) {
    console.log(divRef.current.offsetHeight);
  }
}, []);
```

## 性能考量

`useRef`本身非常轻量，几乎没有性能开销。但要注意：

1. **避免频繁更新 ref.current**：虽然不会触发渲染，但频繁操作仍可能影响性能
2. **大型对象存储**：存储在 ref 中的大型对象不会被垃圾回收，可能导致内存问题
3. **回调 refs**：内联回调 ref 会在每次渲染时创建新函数，可能影响性能

## 与其他 Hook 的配合

### 1. 与 useImperativeHandle 配合

控制暴露给父组件的实例值：

```javascript
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    value: () => {
      return inputRef.current.value;
    }
  }));

  return <input ref={inputRef} />;
});

// 父组件可以调用ref.current.focus()和ref.current.value()
```

### 2. 与 useEffect 配合

```javascript
function Component() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetState = useCallback((state) => {
    if (isMounted.current) {
      setState(state);
    }
  }, []);
}
```

## 总结

`useRef`是 React Hook 中一个简单但强大的工具，主要用途包括：

1. **直接访问 DOM 元素**（表单焦点管理、媒体控制等）
2. **保存可变值**而不触发重新渲染（定时器 ID、上一次 props 值等）
3. **跨渲染周期持久化数据**（保持相同的引用）

关键要点：

- 修改`.current`不会触发重新渲染
- ref 对象在组件生命周期内保持不变
- 在函数组件中替代了类组件的`createRef`和实例属性
- 与`forwardRef`结合可实现 ref 转发
- TypeScript 能提供良好的类型支持

合理使用`useRef`可以让你的 React 组件更高效、更可控，特别是在需要与 DOM 直接交互或管理不涉及 UI 的状态时。
