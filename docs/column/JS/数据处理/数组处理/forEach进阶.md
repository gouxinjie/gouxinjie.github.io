# 对 forEach()函数的一些理解

## 1，定义和用法

**定义：**

> `forEach()` 方法用于调用数组的每个元素，并将元素传递给回调函数。注意: `forEach()` 对于空数组是不会执行回调函数的。

**用法：**

```js
// 箭头函数
forEach((element) => { /* … */ })
forEach((element, index) => { /* … */ })
forEach((element, index, array) => { /* … */ })

// 回调函数
forEach(callbackFn)
forEach(callbackFn, thisArg)

// 内联回调函数
forEach(function(element) { /* … */ })
forEach(function(element, index) { /* … */ })
forEach(function(element, index, array){ /* … */ })
forEach(function(element, index, array) { /* … */ }, thisArg)片
```

## 2，forEach 是否会改变原数组？

**结论**：对于简单数据类型是不会改变原数组的，对于复杂数据类型的直接赋值操作则是可以改变原数组的,因为复杂数据类型是引用类型。

**1，简单数据类型不会改变原数组**

```js
const arrNumber = [1, 2, 3, 4];
arrNumber.forEach((item, index) => {
  item = item * 2;
});
console.log("arrNumber:", arrNumber); // [1, 2, 3, 4]
```

```js
const arrString = ["Eula", "Kaya", "Umbar"];
arrString.forEach((item, index) => {
  item = item + "_" + index;
});
console.log("arrString:", arrString); // ['Eula','Kaya','Umbar']
```

那我如果就是想要改变原数组，可以这样写：

```js
const arrNumber = [1, 2, 3, 4];
   arrNumber.forEach((item,index,arr)=>{
        if(item % 2 === 0){
          console.log("可以被2整除的需要重新赋值:",item);
          arr[index] = 100/
        }
    })
console.log("arrNumber:",arrNumber);//[1, 100, 3, 100]
```

直接 `arr[index]` ；相当于你平常的 数组名[第几项] = 值。这样自然是可以修改原数组的；

**2，引用数据类型直接对其直接赋值能够改变原数组**

```js
const list = [
    { name: "Kaya", age: 18 },
    { name: "Eula", age: 19 },
    { name: "Umbar", age: 20 }
];

// 直接进行赋值是可以改变原数组的 改变姓名
list.forEach((item, index) => {
    if (item.name === "Eula") {
        item.name = "Xinjie";
    }
});

// 改变年龄
list.forEach((item, index) => {
    item.age++;
});

console.log("list:", list);
打印如下：
0:{name: 'Kaya', age: 19}
1: {name: 'Xinjie', age: 20}
2: {name: 'Umbar', age: 21}
```

`forEach()` 相当于把原数组拷贝出来，对拷贝出来的数据进行操作，因为基本类型的数据相当于深拷贝，引用数据是浅拷贝，相当于只拷贝了指针地址，更改数据也会连带把原数组给改掉；

对于基本数据类型：`number,string,Boolean,null,undefined`它们在栈内存中直接存储变量与值。而 Object 对象的真正的数据是保存在堆内存，栈内只保存了对象的变量以及对应的堆的地址，所以操作 Object 其实就是直接操作了原数组对象本身。

## 3，除了抛出异常以外，无法中止或跳出循环

forEach 对数组进行遍历时，不能使用`break`或`return`等关键字跳出循环，使用`return`只能跳过本次循环，相当于 continue。

**1，使用 return 跳出本次循环**

```js
var arr = [1, 2, 3, 4, 5];
arr.forEach(function (item) {
  // 只能跳出本次循环
  if (item === 3) {
    return;
  }
  console.log("item:", item); // 1 2  4 5
});
```

**2，抛出错误跳出终止整个循环（不推荐使用）**

```js
var arr = [1, 2, 3, 4, 5];
try {
  arr.forEach(function (item) {
    // 只能跳出本次循环
    if (item === 3) {
      throw new Error("主动跳出循环");
    }
    console.log("item:", item); // 1 2
  });
} catch (error) {
  console.log("error:", error);
}
```

`注意`：抛出异常虽然能够跳出整个循环体，但需要`try catch`函数来捕获此异常，否则控制台报错将会阻断代码的向下执行；

**3，`forEach()方法`不支持使用 break 或 continue 语句来跳出循环或跳过某一项。**

如果需要跳出循环或跳过某一项，应该使用`for循环`或其他支持`break或continue`语句的方法。

## 4，不能处理异步函数（async await）

**1，先看下面这个案例：**

```js
async function test() {
  let arr = [3, 2, 1];
  arr.forEach(async (item) => {
    const res = await mockSync(item);
    console.log(res);
  });
  console.log("end");
}

function mockSync(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x);
    }, 1000 * x);
  });
}
test();
我们期望的结果是: 3;
2;
1;
end;
但是实际上会输出: end;
1;
2;
3;
```

**2，针对上面问题可以有以下两种解决方案：**

`第一种`：使用普通的`for循环`语法

```js
function mockSync(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x);
    }, 1000 * x);
  });
}
// 使用for循环
async function test() {
  let arr = [3, 2, 1];
  for (let i = 0; i < arr.length; i++) {
    const res = await mockSync(arr[i]);
    console.log(res);
  }
}
test(); // 3,2,1
```

现在执行顺序是正常的：等待 3 秒后打印 3，然后等待 2 秒后打印 2，最后等待 1 秒后打印 1；

**第二种：使用for of 循环来处理异步函数**

```js
function mockSync(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x);
    }, 1000 * x);
  });
}
// 使用for of 循环
async function test() {
  let arr = [3, 2, 1];
  for (const item of arr) {
    const res = await mockSync(item);
    console.log("res:", res);
  }
}
test();
```
