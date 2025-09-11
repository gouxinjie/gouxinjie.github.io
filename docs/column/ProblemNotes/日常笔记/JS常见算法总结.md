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

#### 方法一：使用 indexOf

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

#### 方法二：使用 Set

```javascript
function noRepeat2(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  return [...new Set(list)];
}
```

#### 方法三：使用 includes

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

#### 方法四：双重循环

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

#### 方法五：使用 filter 和 indexOf

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
