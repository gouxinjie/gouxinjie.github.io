# Node.js 中的 events 模块：事件驱动编程

[[toc]] 

`events` 模块是 Node.js 中的一个核心模块，用于处理事件驱动的编程。它为我们提供了一个基础的事件发布/订阅（EventEmitter）机制，允许对象发出事件，并允许其他对象监听并响应这些事件。这种机制广泛用于 Node.js 中，几乎所有的核心模块都使用了事件驱动模型。

### 1. 引入 `events` 模块

要使用 `events` 模块，首先需要引入它：

```javascript
const EventEmitter = require("events");
```

### 2. `EventEmitter` 类

`EventEmitter` 是 `events` 模块中的核心类，用于创建事件发射器对象。通过 `EventEmitter` 类，你可以：

- 触发事件（emit）。
- 监听事件（on）。
- 移除事件监听器（off 或 removeListener）。

### 3. 常用方法

#### 3.1 `emitter.on(eventName, listener)`

`on()` 方法用于为指定事件注册一个监听器。当事件被触发时，监听器会执行。

```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

// 注册事件监听器
emitter.on("greet", (name) => {
  console.log(`Hello, ${name}!`);
});

// 触发事件
emitter.emit("greet", "Alice"); // 输出：Hello, Alice!
```

- `eventName`：事件的名称（可以是任意字符串）。
- `listener`：事件触发时要执行的回调函数。

#### 3.2 `emitter.emit(eventName, ...args)`

`emit()` 方法用于触发指定的事件，并传递参数给事件处理函数。一个事件可以被触发多次。

```javascript
const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log(`Hello, ${name}!`);
});

emitter.emit("greet", "Bob"); // 输出：Hello, Bob!
emitter.emit("greet", "Charlie"); // 输出：Hello, Charlie!
```

- `eventName`：事件名称。
- `...args`：触发事件时传递的参数，可以有多个。

#### 3.3 `emitter.once(eventName, listener)`

`once()` 方法与 `on()` 类似，不同之处在于，`once()` 注册的事件监听器在事件被触发后，只会执行一次，之后会自动移除。

```javascript
const emitter = new EventEmitter();

emitter.once("greet", (name) => {
  console.log(`Hello, ${name}!`);
});

emitter.emit("greet", "David"); // 输出：Hello, David!
emitter.emit("greet", "Eva"); // 什么都不输出
```

#### 3.4 `emitter.removeListener(eventName, listener)`

`removeListener()` 方法用于移除指定事件的监听器。也可以使用 `off()` 方法，它是 `removeListener()` 的别名。

```javascript
const emitter = new EventEmitter();

const greetListener = (name) => {
  console.log(`Hello, ${name}!`);
};

emitter.on("greet", greetListener);
emitter.emit("greet", "Frank"); // 输出：Hello, Frank!
emitter.removeListener("greet", greetListener);
emitter.emit("greet", "Grace"); // 什么都不输出
```

#### 3.5 `emitter.removeAllListeners([eventName])`

`removeAllListeners()` 用于移除指定事件的所有监听器。如果没有提供事件名，则移除所有事件的所有监听器。

```javascript
const emitter = new EventEmitter();

const greetListener = (name) => {
  console.log(`Hello, ${name}!`);
};

emitter.on("greet", greetListener);
emitter.emit("greet", "Henry"); // 输出：Hello, Henry!
emitter.removeAllListeners("greet");
emitter.emit("greet", "Irene"); // 什么都不输出
```

#### 3.6 `emitter.listenerCount(eventName)`

`listenerCount()` 方法返回指定事件的监听器数量。

```javascript
const emitter = new EventEmitter();

emitter.on("greet", () => {});
emitter.on("greet", () => {});
console.log(emitter.listenerCount("greet")); // 输出：2
```

#### 3.7 `emitter.eventNames()`

`eventNames()` 方法返回一个数组，包含当前所有注册过的事件名称。

```javascript
const emitter = new EventEmitter();

emitter.on("greet", () => {});
emitter.on("bye", () => {});

console.log(emitter.eventNames()); // 输出：['greet', 'bye']
```

### 4. 事件循环和异步行为

`EventEmitter` 和 Node.js 的事件驱动模型是异步的。当你触发事件时，事件的监听器不会立即执行，而是会被排入事件队列，等待 Node.js 的事件循环机制来处理。因此，事件处理是非阻塞的。

例如：

```javascript
const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log("Hello", name);
});

console.log("Start");
emitter.emit("greet", "Alice");
console.log("End");
```

输出：

```
Start
End
Hello Alice
```

如上所示，`emit()` 会立即返回，`'Hello Alice'` 会在 `console.log('End')` 执行之后才被输出，体现了事件驱动的异步行为。

### 5. 示例：自定义事件

你可以创建一个自定义事件并根据需要触发它。例如，模拟一个按钮点击事件：

```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

// 注册事件监听器
emitter.on("buttonClicked", (buttonName) => {
  console.log(`${buttonName} 被点击了！`);
});

// 模拟点击按钮
emitter.emit("buttonClicked", "按钮1");
emitter.emit("buttonClicked", "按钮2");
```

输出：

```
按钮1 被点击了！
按钮2 被点击了！
```

### 6. 异常事件：`error`

`EventEmitter` 实例还会触发 `error` 事件。如果 `error` 事件没有被监听，并且触发了该事件，程序会抛出异常并退出。为了避免程序崩溃，你可以捕获 `error` 事件：

```javascript
const emitter = new EventEmitter();

// 注册 'error' 事件
emitter.on("error", (err) => {
  console.log("捕获到错误:", err);
});

// 触发 'error' 事件
emitter.emit("error", new Error("Something went wrong!"));
```

如果没有注册 `error` 事件，Node.js 会在控制台打印堆栈跟踪并终止进程。
