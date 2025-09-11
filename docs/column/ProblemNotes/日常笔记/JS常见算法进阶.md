# JavaScript 常用算法与手写函数进阶总结

## 倒计时实现

```javascript
// 实现倒计时，传入的是秒数
function countDown(duration, delay = 1000) {
  let time = duration;

  const timer = setInterval(function () {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    // 格式化时间显示
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    console.log(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);

    time--;

    if (time < 0) {
      clearInterval(timer);
      console.log("倒计时结束");
    }
  }, delay);
}

// 使用示例
countDown(600); // 10分钟倒计时
```

## 排序算法

### 快速排序优化版

```javascript
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  // 选择中间元素作为基准
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];

  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i++) {
    if (i === pivotIndex) continue;

    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 使用示例
const arr = [9, 9, 5, 8, 5, 4, 6, 2, 1, 0];
console.log(quickSort(arr)); // [0, 1, 2, 4, 5, 5, 6, 8, 9, 9]
```

## 函数方法实现

### call 和 apply 方法

```javascript
// 实现 call 方法
Function.prototype.myCall = function (context, ...args) {
  context = context || window;
  const fn = Symbol("fn");
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

// 实现 apply 方法
Function.prototype.myApply = function (context, args) {
  context = context || window;
  const fn = Symbol("fn");
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

// 使用示例
const obj = { name: "xinjie" };

function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

greet.myCall(obj, "Hello", "!"); // Hello, xinjie!
greet.myApply(obj, ["Hi", "."]); // Hi, xinjie.
```

## 数组操作

### 数组去重多种方法

```javascript
// 方法1: 使用 reduce
function uniqueWithReduce(arr) {
  return arr.reduce((acc, current) => {
    if (!acc.includes(current)) {
      acc.push(current);
    }
    return acc;
  }, []);
}

// 方法2: 使用 Set
function uniqueWithSet(arr) {
  return [...new Set(arr)];
}

// 方法3: 使用 Map
function uniqueWithMap(arr) {
  const map = new Map();
  arr.forEach((item) => map.set(item, true));
  return Array.from(map.keys());
}

// 方法4: 使用 filter
function uniqueWithFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

// 使用示例
const uniList = [1, 1, 1, 2, 3, 4, 3, 4];
console.log(uniqueWithReduce(uniList)); // [1, 2, 3, 4]
console.log(uniqueWithSet(uniList)); // [1, 2, 3, 4]
console.log(uniqueWithMap(uniList)); // [1, 2, 3, 4]
console.log(uniqueWithFilter(uniList)); // [1, 2, 3, 4]
```

### 字节单位转换

```javascript
function convertBytes(bytes) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const digitGroups = Math.floor(Math.log(bytes) / Math.log(1024));

  return (bytes / Math.pow(1024, digitGroups)).toFixed(2) + " " + units[digitGroups];
}

// 使用示例
console.log(convertBytes(2025)); // 1.98 KB
console.log(convertBytes(1048576)); // 1.00 MB
console.log(convertBytes(1073741824)); // 1.00 GB
```

### 数组扁平化

```javascript
// 递归实现
function flattenRecursive(arr) {
  return arr.reduce((acc, current) => {
    return acc.concat(Array.isArray(current) ? flattenRecursive(current) : current);
  }, []);
}

// 迭代实现
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length) {
    const next = stack.pop();

    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }

  return result.reverse();
}

// 使用示例
const nestedArray = [1, [2, 3, [4, 5]], 6, 7];
console.log(flattenRecursive(nestedArray)); // [1, 2, 3, 4, 5, 6, 7]
console.log(flattenIterative(nestedArray)); // [1, 2, 3, 4, 5, 6, 7]
```

## 异步处理

### sleep 函数

```javascript
function sleep(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// 使用示例
async function demo() {
  console.log("开始等待...");
  await sleep(2000);
  console.log("2秒后继续执行");
}

demo();
```

### Promise.all 实现

```javascript
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("参数必须是一个数组"));
    }

    if (promises.length === 0) {
      return resolve([]);
    }

    const results = new Array(promises.length);
    let completed = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          completed++;

          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
};

// 使用示例
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = new Promise((resolve) => setTimeout(() => resolve(3), 1000));

Promise.myAll([promise1, promise2, promise3])
  .then((values) => console.log(values)) // [1, 2, 3]
  .catch((error) => console.error(error));
```

## 对象操作

### 模拟 new 操作符

```javascript
function myNew(constructor, ...args) {
  // 创建一个新对象，继承构造函数的原型
  const obj = Object.create(constructor.prototype);

  // 调用构造函数，绑定this到新对象
  const result = constructor.apply(obj, args);

  // 如果构造函数返回一个对象，则返回该对象，否则返回新创建的对象
  return typeof result === "object" && result !== null ? result : obj;
}

// 使用示例
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`);
};

const john = myNew(Person, "John", 30);
john.greet(); // Hello, my name is John and I'm 30 years old.
```

### Cookie 解析

```javascript
function parseCookie(cookieString) {
  return cookieString.split(";").reduce((cookies, part) => {
    const [key, value] = part.trim().split("=");
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
    return cookies;
  }, {});
}

// 使用示例
const cookie = "name=xinjie; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
console.log(parseCookie(cookie)); // { name: "xinjie", expires: "Fri, 31 Dec 9999 23:59:59 GMT", path: "/" }
```

## 异步函数 promisify

`promisify` 是 `Node.js` 提供的一个“小工具”，作用只有一句话： 

把“**错误优先**”的回调风格函数包装成返回 `Promise` 的函数，让你能用`async/await`写异步代码，而不用再写回调地狱。

**核心原理**：内部新建一个 Promise，把原函数最后一个参数替换成 (err, ...args) => err ? reject(err) : resolve(args[0]) 的回调即可

```javascript
const { promisify } = require("util");
const fs = require("fs");

// 原回调风格
fs.readFile("a.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 经过 promisify 后
const readFile = promisify(fs.readFile);
const data = await readFile("a.txt", "utf8"); // 直接 await
```


**promisify 实现如下：**
> 为什么 `“return` 两次”，是因为：
> 1. 第一次 return 是为了把原函数 fn 转换成一个“新函数”（即 promisified 版本）并交出去；
> 2. 第二次 return 是在新函数内部返回一个 Promise，这样调用者才能用 await 或 .then()。
```javascript
function promisify(fn) {    // [!code highlight] ① 第一层：接收原函数
  return function (...args) {  // [!code highlight] ② 第二次 return：交出“新函数”
    return new Promise((resolve, reject) => {   // [!code highlight] ③ 第三次 return：新函数里返回 Promise
      fn(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// 使用示例（假设有fs.readFile）
// const readFileAsync = promisify(fs.readFile);
// readFileAsync('file.txt', 'utf8')
//   .then(content => console.log(content))
//   .catch(error => console.error(error));
```


## 异步执行顺序分析

```javascript
async function async1() {
  console.log(1);
  await async2();
  console.log(2);
}

async function async2() {
  await Promise.resolve().then(() => {
    console.log(3);
  });
}

async1();
console.log(4);

// 输出顺序: 1, 4, 3, 2
```
