# 高阶函数 reduce()讲解

[[toc]]

## 一、介绍

首先 MDN 上 是这样描述 reduce 方法的：

> reduce() 方法对数组中的每个元素按序执行一个由您提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。
>
> `说白了就是会将上一次的运行结果当做下一轮计算的初始值`；

语法如下:

```javascript
箭头函数写法;
reduce((previousValue, currentValue, currentIndex, array) => {
  /* … */
});
reduce((previousValue, currentValue, currentIndex, array) => {
  /* … */
}, initialValue);

回调函数洗发;
reduce(callbackFn);
reduce(callbackFn, initialValue);
```

回调函数中有四个参数，回调的外面还有一个参数（`initialValue给定就算的初始值`）；参数截图如下： ![在这里插入图片描述](https://img-blog.csdnimg.cn/5707203e7c6e4b37b3d4fdeeaa6a6c72.png#pic_center =700x )

## 二、Array.reduce()的使用

看一下下面的代码：

```javascript
const arr = [1, 2, 3];
const initValue = 10;
function reducer(previousValue, currentValue, currentIndex, arrryTarget) {
  return preValue + currentValue;
}
arr.reduce(reducer, initValue); // res === 16
```

reduce 会遍历 arr 数组，数组有多少个，reducer 就会执行多少次。下面是执行流程：

| reducer 执行 | previousValue | currentValue | currentIndex | return |
| ------------ | ------------- | ------------ | ------------ | ------ |
| 第一次执行   | 10            | 1            | 0            | 11     |
| 第二次执行   | 11            | 2            | 1            | 13     |
| 第三次执行   | 13            | 3            | 2            | 16     |

这个过程用过 reduce 的应该都知道，MDN 上原话是这样的：

> 第一次执行回调函数时，不存在“上一次的计算结果”。如果需要回调函数从数组索引为 0 的元素开始执行，则需要传递初始值。否则，数组索引为 0 的元素将被作为初始值 initialValue，迭代器将从第二个元素开始执行（索引为 1 而不是 0）
>
> 也就是第一次执行 reducer 函数时，不存在“上一次的计算结果”。这里传递了初始值，因此 reducer 函数才从数组索引为 0 的元素开始执行，也就是 `arr.length` 等于 `reducer` 执行次数。

但如果不传递初始值呢？我们改动一下代码：

```javascript
const arr = [1, 2, 3];
const initValue = 10;
function reducer(previousValue, currentValue, currentIndex, arrryTarget) {
  return preValue + currentValue;
}
arr.reduce(reducer, initValue); // res === 16
arr.reduce(reducer); // res === 6
```

| reducer 执行 | previousValue | currentValue | currentIndex | return |
| ------------ | ------------- | ------------ | ------------ | ------ |
| 第一次执行   | 1             | 2            | 1            | 3      |
| 第二次执行   | 3             | 3            | 2            | 6      |

因为没有传递初始值，因此 reducer 函数从数组索引为 1 的元素开始执行，首次执行的时候 arr[0] 被作为了 `previousValue` ，`currentValue` 就是 arr[1]。

## 三，reduce()的使用场景

> 下面是一些 reduce 方法的使用场景。

**1，累加数组所有的值，累加可以，那么 加减乘除 中其他三个的原理是一样的不在多说**；

```javascript
let sum = [0, 1, 2, 3].reduce(function (previousValue, currentValue) {
  return previousValue + currentValue;
}, 0);
// sum is 6
```

**2，累加对象数组里的值**

要累加对象数组中包含的值，必须要提供 `initialValue`，以便各个 `item` 正确通过你的函数；

```javascript
let initialValue = 0;
let sum = [{ x: 1 }, { x: 2 }, { x: 3 }].reduce(function (previousValue, currentValue) {
  return previousValue + currentValue.x;
}, initialValue);

console.log(sum); // logs 6
```

**3，将二维数组转化为一维**

```javascript
第一种：
let flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  function(previousValue, currentValue) {
    return previousValue.concat(currentValue)
  },
  []
)
// flattened is [0, 1, 2, 3, 4, 5]

第二种：
let flattened  =  [[1,2], [3, 4]].reduce((arrA, arrB) => [...arrA, ...arrB])

```

那是不是封装一下就可以把多维数组组转为一维数组了？

```javascript
function flaten(arr) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  return arr.reduce((arrA, arrB) => {
    if (!Array.isArray(arrB)) {
      return [...arrA, arrB];
    }
    return flaten([...arrA, ...arrB]);
  }, []);
}
let flaten2 = flaten([1, 2, [3, 4], [6, [7, 8]]]);
console.log(flaten2);
[1, 2, 3, 4, 6, 7, 8];
```

**4，计算数组中每个元素出现的次数**

此方法也需要提供初始值：`{}`，用来给这个空对象添加属性，最后返回处理过的对象；

```javascript
let names = ["Alice", "Bob", "Tiff", "Bruce", "Alice"];

let countedNames = names.reduce(function (allNames, name) {
  if (name in allNames) {
    allNames[name]++;
  } else {
    allNames[name] = 1;
  }
  return allNames;
}, {});
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

**5，按属性对 object 分类**

注意：也要传初始值；

```javascript
let people = [
  { name: "Alice", age: 21 },
  { name: "Max", age: 20 },
  { name: "Jane", age: 20 }
];

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    let key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

let groupedPeople = groupBy(people, "age");
// groupedPeople is:
// {
//   20: [
//     { name: 'Max', age: 20 },
//     { name: 'Jane', age: 20 }
//   ],
//   21: [{ name: 'Alice', age: 21 }]
// }
```

**6，数组去重**

1，第一种使用 reduce 方法，利用数组的 indexOf 方法来筛选；

```javascript
let myArray = ["a", "b", "a", "b", "c", "e", "e", "c", "d", "d", "d", "d"];
let myArrayWithNoDuplicates = myArray.reduce(function (previousValue, currentValue) {
  if (previousValue.indexOf(currentValue) === -1) {
    previousValue.push(currentValue);
  }
  return previousValue;
}, []);

console.log(myArrayWithNoDuplicates);
```

2，第二种方式使用 `new Set`集合（无序不重复）；

```javascript
// 另一种方式
let myArray2 = ["a", "b", "a", "b", "c", "e", "e", "c", "d", "d", "d", "d"];
let arrayWithNoDuplicates = Array.from(new Set(myArray2));
console.log(arrayWithNoDuplicates);
```

**7，使用 .reduce() 替换 .filter().map()**

使用 Array.filter() 和 Array.map() 会遍历数组两次，而使用具有相同效果的 Array.reduce() 只需要遍历一次，这样做更加高效。

```javascript
const numbers = [-5, 6, 2, 0];

const doubledPositiveNumbers = numbers.reduce((previousValue, currentValue) => {
  if (currentValue > 0) {
    const doubled = currentValue * 2;
    previousValue.push(doubled);
  }
  return previousValue;
}, []);

console.log(doubledPositiveNumbers); // [12, 4]
```

**End**

---

**【参考文章】：**

1，码云笔记的博客：[https://blog.csdn.net/qq_41221596/article/details/129227617?spm=1001.2014.3001.5502](https://blog.csdn.net/qq_41221596/article/details/129227617?spm=1001.2014.3001.5502)

2，MDN-reduce：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
