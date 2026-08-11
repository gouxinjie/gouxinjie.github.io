# JavaScript 常见算法与手写函数实现

## 概述

将介绍 JavaScript 中常见的排序算法、数组操作方法、函数式编程技巧以及一些重要手写函数的实现。这些算法和函数在前端开发面试和实际项目中都非常有用。

## 排序算法

### 1. 快速排序

快速排序是一种高效的排序算法，采用分治策略。

```javascript
function quickSort(list) {
  if (list.length <= 1) {
    return list;
  }

  const middleIndex = Math.floor(list.length / 2);
  const middleItem = list.splice(middleIndex, 1)[0]; // 注意这里要取数组的第一个元素
  const left = [];
  const right = [];

  for (let i = 0; i < list.length; i++) {
    if (list[i] < middleItem) {
      left.push(list[i]);
    } else {
      right.push(list[i]);
    }
  }

  return [...quickSort(left), middleItem, ...quickSort(right)];
}

// 使用示例
const numberArr = [10, 3, 9, 8, 7, 6, 5, 4, 3];
console.log(quickSort(numberArr)); // [3, 3, 4, 5, 6, 7, 8, 9, 10]
```

### 2. 冒泡排序

冒泡排序通过重复遍历列表并交换相邻元素来实现排序。

```javascript
function bubbleSort(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return list;
  }

  const arr = [...list]; // 创建副本，避免修改原数组
  let temp = null;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}

// 使用示例
const numberArr2 = [10, 3, 9, 8, 3, 2, 5, 6, 7, 7, 7];
console.log(bubbleSort(numberArr2)); // [2, 3, 3, 5, 6, 7, 7, 7, 8, 9, 10]
```

## 数组操作

### 1. 数组去重

**方法一：使用 indexOf**

```javascript
function noRepeat(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  const tempList = [];
  for (let i = 0; i < list.length; i++) {
    if (tempList.indexOf(list[i]) === -1) {
      tempList.push(list[i]);
    }
  }

  return tempList;
}
```

**方法二：使用 Set**

```javascript
function noRepeat2(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  return [...new Set(list)];
}
```

**方法三：使用 includes**

```javascript
function noRepeat3(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  const tempList = [];
  for (let i = 0; i < list.length; i++) {
    if (!tempList.includes(list[i])) {
      tempList.push(list[i]);
    }
  }

  return tempList;
}
```

**方法四：双重循环**

```javascript
function noRepeat4(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  const arr = [...list]; // 创建副本

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }

  return arr;
}
```

**方法五：使用 filter 和 indexOf**

```javascript
function unique(arr) {
  return arr.filter((item, index, array) => {
    return array.indexOf(item) === index;
  });
}
```

### 2. 统计字符出现次数

```javascript
function countCharacters(str) {
  if (typeof str !== "string" || str.trim().length === 0) {
    return {};
  }

  const chars = str.trim().split("");
  const result = {};

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    result[char] = (result[char] || 0) + 1;
  }

  return result;
}

// 使用示例
const str = "hello world";
const charCount = countCharacters(str);
for (const char in charCount) {
  console.log(`${char} 出现了 ${charCount[char]} 次`);
}
```

### 3. 使用 reduce 进行数组操作

```javascript
// 数组求和
const arr = [{ x: 1 }, { x: 2 }, { x: 3 }];
const sum = arr.reduce((pre, cur) => pre + cur.x, 0);
console.log(sum); // 6

// 二维数组转一维数组
const twoDArray = [
  [0, 1],
  [2, 3],
  [4, 5]
];
const oneDArray = twoDArray.reduce((pre, cur) => pre.concat(cur), []);
console.log(oneDArray); // [0, 1, 2, 3, 4, 5]
```

## 函数式编程

### 1. 防抖函数

```javascript
function debounce(fn, delay = 1000) {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用示例
const debouncedFn = debounce(() => {
  console.log("防抖函数执行");
}, 500);

// 快速调用多次，只会执行最后一次
debouncedFn();
debouncedFn();
debouncedFn();
```

### 2. 节流函数

```javascript
function throttle(fun, delay = 500) {
  let timer = null;
  if (timer) {
    return false;
  }
  timer = setInterval(function () {
    fun();
    clearTimeout(timer);
  }, delay);
}

// 使用示例
const throttledFn = throttle(() => {
  console.log("节流函数执行");
}, 1000);

// 快速调用多次，但每1000ms最多执行一次
throttledFn();
throttledFn();
throttledFn();
```

### 3. 函数柯里化

```javascript
function add(x) {
  return function (y) {
    return x + y;
  };
}

// 使用示例
console.log(add(5)(7)); // 12

// 更通用的柯里化函数
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

// 使用示例
const curriedAdd = curry((a, b, c) => a + b + c);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

## 常用算法进阶

### 1. 倒计时实现

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

### 2. 快速排序优化版

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

### 3. call 和 apply 方法

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

### 4. 数组去重多种方法

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

### 5. 字节单位转换

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

### 6. 数组扁平化

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

### 7. sleep 函数

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

### 8. Promise.all 实现

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

### 9. 模拟 new 操作符

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

### 10. Cookie 解析

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

### 11. 异步函数 promisify

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
>
> 1. 第一次 return 是为了把原函数 fn 转换成一个“新函数”（即 promisified 版本）并交出去；
> 2. 第二次 return 是在新函数内部返回一个 Promise，这样调用者才能用 await 或 .then()。

```javascript
function promisify(fn) {
  // [!code highlight] ① 第一层：接收原函数
  return function (...args) {
    // [!code highlight] ② 第二次 return：交出“新函数”
    return new Promise((resolve, reject) => {
      // [!code highlight] ③ 第三次 return：新函数里返回 Promise
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

### 12. 异步执行顺序分析

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
