# TypeScript 中 Object、object 和 {} 的解析与区别

## 一、核心区别总览

| 类型     | 含义                          | 包含值范围                         | 原型链               | 最佳实践     |
| -------- | ----------------------------- | ---------------------------------- | -------------------- | ------------ |
| `Object` | JavaScript 的 Object 构造函数 | 所有值（除 null 和 undefined）     | 包含 Object 原型方法 | 避免使用     |
| `object` | 非原始类型的对象              | 所有引用类型（对象、数组、函数等） | 无特定要求           | 推荐使用     |
| `{}`     | 空对象字面量类型              | 任何值（除 null 和 undefined）     | 无约束               | 特定场景使用 |

`Object` 其实和`{}`是一样的，`{}`相当于 `new Object`，但是`{}`更加简洁。

## 二、详细解析

### 1. `Object` 类型

**特点**：

- 表示 JavaScript 的 `Object` 构造函数类型
- 包含所有 JavaScript 对象共有的原型方法（如 `toString`, `hasOwnProperty`）
- 可以接受任何值（除了 `null` 和 `undefined`）

```typescript
let obj: Object;

obj = { name: "Alice" }; // OK
obj = 42; // OK (原始值会被自动装箱)
obj = "hello"; // OK
obj = [1, 2, 3]; // OK
obj = null; // Error
obj = undefined; // Error
```

**问题示例**：

```typescript
function logObject(obj: Object) {
  console.log(obj.toString()); // 可能不是预期的对象行为
}

logObject(123); // 输出 "[object Number]"
logObject("text"); // 输出 "[object String]"
```

**不推荐使用的原因**：

- 过于宽泛，失去了类型检查的意义
- 允许原始值自动装箱，可能导致意外行为

### 2. `object` 类型

**特点**：

- 表示非原始类型的对象
- **只接受引用类型（对象、数组、函数、类实例等）**
- 不接受原始值（`string, number, boolean, symbol, null, undefined`）

```typescript
let obj: object;

obj = { name: "Alice" }; // OK
obj = [1, 2, 3]; // OK
obj = () => {}; // OK (函数也是对象)
obj = new Date(); // OK
obj = 42; // Error
obj = "hello"; // Error
obj = null; // Error
obj = undefined; // Error
```

**推荐用法**：

```typescript
function processObject(obj: object) {
  // 需要先进行类型收窄才能安全访问属性
  if (obj && typeof obj === "object" && "name" in obj) {
    console.log(obj.name);
  }
}
```

### 3. `{}` 类型

**特点**：

- 表示空对象字面量类型
- 可以接受任何非 `null` 和 `undefined` 的值
- 不允许直接访问任何属性（即使实际值有属性）

```typescript
let emptyObj: {};

emptyObj = { name: "Alice" }; // OK
emptyObj = 42; // OK
emptyObj = "hello"; // OK
emptyObj = [1, 2, 3]; // OK
emptyObj = null; // Error
emptyObj = undefined; // Error

// 以下都会报错（即使赋值了有属性的对象）
emptyObj.name; // Error
emptyObj.toString; // Error
```

**特殊行为**：

```typescript
const obj: {} = { name: "Alice" };
// obj.name 会报错，但可以通过类型断言访问
console.log((obj as { name: string }).name); // OK
```

## 三、对比示例

### 1. 赋值兼容性

```typescript
// 原始值
const num = 123;
const str = "hello";

let o1: Object = num; // OK
let o2: object = num; // Error
let o3: {} = num; // OK

// 对象
const user = { name: "Alice" };

let o4: Object = user; // OK
let o5: object = user; // OK
let o6: {} = user; // OK

// null/undefined
let o7: Object = null; // Error
let o8: object = null; // Error
let o9: {} = null; // Error
```

### 2. 方法访问

```typescript
const obj = { name: "Alice" };

// Object 类型可以访问原型方法
let obj1: Object = obj;
obj1.toString(); // OK
obj1.hasOwnProperty("name"); // OK

// object 类型需要类型收窄
let obj2: object = obj;
if ("name" in obj2) {
  console.log(obj2.name); // OK
}

// {} 类型不允许直接访问任何属性
let obj3: {} = obj;
obj3.toString(); // Error (虽然奇怪，但这是TS设计)
```
