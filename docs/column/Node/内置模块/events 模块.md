# **Node.js 中的 events 模块：事件驱动编程**

`events` 模块是 Node.js **事件驱动架构**的核心实现，几乎所有异步操作（如 HTTP 请求、文件读写）底层都依赖事件机制。

## **1. 事件驱动基础**

### **什么是 EventEmitter？**

- 它是 Node.js 提供的一个**发布-订阅模式**实现类。
- 允许对象（称为 "emitter"）触发命名事件，其他对象（"listeners"）监听这些事件并响应。

### **基本使用**

```javascript
const EventEmitter = require("events"); // 引入模块

// 1. 创建事件发射器实例
const emitter = new EventEmitter();

// 2. 监听事件（订阅）
emitter.on("order", (item) => {
  console.log(`订单已创建: ${item}`);
});

// 3. 触发事件（发布）
emitter.emit("order", "iPhone 15"); // 输出: 订单已创建: iPhone 15
```

## **2. 核心 API 解析**

### **（1）监听事件**

| 方法                            | 说明                               |
| ------------------------------- | ---------------------------------- |
| `emitter.on(event, listener)`   | 持续监听事件（可多次触发）         |
| `emitter.once(event, listener)` | 只监听一次（触发后自动移除）       |
| `emitter.prependListener()`     | 将监听器添加到队列开头（优先执行） |
| `emitter.prependOnceListener()` | 一次性监听器，但插入队列开头       |

**示例**：

```javascript
emitter.once("first-order", (user) => {
  console.log(`${user}的首单优惠已发放`);
});
```

### **（2）触发事件**

| 方法                             | 说明                         |
| -------------------------------- | ---------------------------- |
| `emitter.emit(event, [...args])` | 触发事件，可传递任意数量参数 |

**示例**：

```javascript
emitter.emit("login", { user: "Alice", ip: "192.168.1.1" });
```

### **（3）移除监听器**

| 方法                                  | 说明                                    |
| ------------------------------------- | --------------------------------------- |
| `emitter.off(event, listener)`        | 移除指定事件的某个监听器（Node.js 10+） |
| `emitter.removeListener()`            | 同 `off()`（旧版语法）                  |
| `emitter.removeAllListeners([event])` | 移除所有（或指定事件）的监听器          |

**示例**：

```javascript
const handler = () => console.log("Handler");
emitter.on("test", handler);
emitter.off("test", handler); // 移除监听
```

## **3. 高级特性**

### **（1）错误事件**

- 当 `EventEmitter` 实例发生错误时，如果没有监听 `error` 事件，Node.js 会抛出异常并退出进程。
- **必须处理 error 事件**：

```javascript
emitter.on("error", (err) => {
  console.error("发生错误:", err.message);
});

emitter.emit("error", new Error("数据库连接失败"));
```

### **（2）获取监听器信息**

| 方法                           | 说明                         |
| ------------------------------ | ---------------------------- |
| `emitter.eventNames()`         | 返回已注册的事件名数组       |
| `emitter.listenerCount(event)` | 返回指定事件的监听器数量     |
| `emitter.listeners(event)`     | 返回指定事件的监听器函数数组 |

**示例**：

```javascript
console.log(emitter.listenerCount("login")); // 输出监听器数量
```

### **（3）同步 vs 异步**

- **默认同步执行**：监听器按注册顺序同步调用。
- **强制异步化**：用 `setImmediate` 或 `process.nextTick` 包裹：

```javascript
emitter.on("async-event", () => {
  setImmediate(() => {
    console.log("异步执行");
  });
});
```

## **4. 实际应用场景**

### **场景 1：自定义日志系统**

```javascript
class Logger extends EventEmitter {
  log(message) {
    this.emit("log", `${new Date().toISOString()} - ${message}`);
  }
}

const logger = new Logger();
logger.on("log", (msg) => fs.appendFileSync("app.log", msg + "\n"));

logger.log("用户登录");
```

### **场景 2：HTTP 服务器事件**

```javascript
const server = require("http").createServer();

server.on("request", (req, res) => {
  res.end("Hello World");
});

server.on("error", (err) => {
  console.error("服务器错误:", err);
});

server.listen(3000);
```

### **场景 3：数据库连接池**

```javascript
class Database extends EventEmitter {
  connect() {
    setTimeout(() => {
      this.emit("connected");
      // this.emit('error', new Error('连接超时')); // 模拟错误
    }, 1000);
  }
}

const db = new Database();
db.on("connected", () => console.log("数据库已连接"));
db.connect();
```

## **5. 性能与陷阱**

### **（1）内存泄漏**

- 未移除监听器可能导致内存泄漏（尤其复用 `EventEmitter` 实例时）。
- **解决方案**：
  ```javascript
  emitter.on("event", handler);
  // 任务完成后移除
  emitter.off("event", handler);
  ```

### **（2）监听器数量限制**

- 默认最多为同一事件注册 `10` 个监听器（超出会警告）。
- **调整限制**：
  ```javascript
  emitter.setMaxListeners(20); // 提高限制
  ```

### **（3）避免阻塞事件循环**

- 长时间运行的监听器会阻塞其他事件。
- **优化方案**：
  ```javascript
  emitter.on("compute", () => {
    setImmediate(() => {
      // 耗时操作
    });
  });
  ```

## **6. 继承 EventEmitter**

通过继承实现自定义事件发射器：

```javascript
class OrderSystem extends EventEmitter {
  placeOrder(item) {
    this.emit("order-placed", item);
  }
}

const orders = new OrderSystem();
orders.on("order-placed", (item) => {
  console.log(`新订单: ${item}`);
});

orders.placeOrder("MacBook Pro");
```

## **7. 总结**

| **场景**     | **推荐方法**              |
| ------------ | ------------------------- |
| 基础事件监听 | `emitter.on()` + `emit()` |
| 一次性事件   | `emitter.once()`          |
| 错误处理     | 必须监听 `error` 事件     |
| 性能敏感场景 | 控制监听器数量 + 异步化   |
| 内存管理     | 及时用 `off()` 移除监听器 |
