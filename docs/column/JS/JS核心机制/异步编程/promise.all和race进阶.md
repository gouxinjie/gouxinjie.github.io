# promise.all 和 race 方法的用法详细分析

[[toc]]

## 一、`Promise.all()`

`Promise.all()`方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```javascript
const p = Promise.all([p1, p2, p3]);
```

上面代码中，`Promise.all()`方法接受一个数组作为参数，`p1`、`p2`、`p3`都是一个 `Promise` 实例，如果不是，就会先调` Promise.resolve` 方法，将参数转为 Promise 实例再进一步处理。另外，`Promise.all()`方法的参数可以不是数组，但必须具有 `Iterator` 接口，且返回的每个成员都是 `Promise` 实例。

**该怎么理解这句话呢，下面将逐句说明；**

#### 1，第一句：Promise.all()方法接受一个数组作为参数，且每一个都是 Promise 实例

这句话说明了 `Promise`的标准用法：

即传入一个数组，期望数组里面的每一项都是一个 promise 实例；如下使用：

```js
	 ## 1,先定义几个异步函数,此处用定时器
      let p1 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_1");
        }, 1000);
      });
      let p2 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_2");
        }, 2000);
      });
      let p3 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_3");
        }, 3000);
      });

	## 2，使用
	Promise.all([p1, p3, p2])
        .then((result) => {
          console.log(result); // 结果为：['success_2', 'success_3', 'success_1']
        })
        .catch((error) => {
          console.log(error);
        });
```

等待几秒后，结果打印为：

```js
["success_2", "success_3", "success_1"];
```

`Promise.all`接收到的数组顺序是一致的，即 p3 的结果在 p2 的前面，即便 p3 的结果获取的比 p2 要晚；这带来了一个很大的好处；

在前端开发请求数据的过程中，偶尔会遇到发送多个请求并根据请求顺序获取和使用数据的场景，使用`Promise.all`毫无疑问可以解决这个问题；

---

`Promise.all` 里面所有的 `promise` 都执行成功（fulfilled 状态）才会返回成功的数组，只要有一个失败（reject），就会被 `catch` 回调捕获；如下失败的情况：

```js
 	 let p1 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_1");
        }, 1000);
      });
      let p2 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_2");
        }, 2000);
      });
      ## 1，失败的promsie
      let p3 = Promise.reject("失败");

      	## 2，执行
  		 Promise.all([ p1,p2,p4])
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log("error:",error); // 失败了，打印 '失败'
        });

```

执行结果如下：

```js
error: 失败;
```

说明只要其中有一个失败就返回失败数据；

注意：如果作为参数的 `Promise` 实例，自己定义了 `catch` 方法，那么它一旦被`rejected`，并不会触发`Promise.all()的catch方法`。

**请务必记住**：`promise.all` 接收的 `promise` 数组，是按顺序且同步执行的

---

#### 2，第二句：如果不是，就会先调 Promise.resolve 方法，将参数转为 Promise 实例再进一步处理

如果我们传入的数组项不是 promsie 对象，还会正常执行吗：

（1）传入的数组每一项都不是 promise 实例

```js
		## 直接传 几个number类型
  		Promise.all([1, 2, 3])
        .then((res) => {
          console.log("res:", res); // [1,2,3]
        })
        .catch((err) => {
          console.log("err:", err);
        });
```

执行结果：

```css
[1,2,3]
```

可以看出：如果传入数组中的每一项都不是 promise 对象 则会原封不动的让 resolve()函数返回 ；既拿到什么就返回什么；

（2）第二种：传入的数组中既有 promise 实例 也有不是的

如下：我传了`number` 1,2 和两个`promise`实例 p2，p1;

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(function () {
    resolve("success_1");
  }, 1000);
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(function () {
    resolve("success_2");
  }, 2000);
});

Promise.all([1, 2, p2, p1])
  .then((res) => {
    console.log("res——2:", res); //  [1, 2, 'success_2', 'success_1']
  })
  .catch((err) => {
    console.log("err:", err);
  });
```

执行结果：

```js
[1, 2, "success_2", "success_1"];
```

可以看出：执行的顺序是先返回非 promise， 再执行 p2，p1 这两个`promise`对象，然后也按照顺序并返回结果；

---

#### 3，第三句：Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例

怎么理解这句话呢，说明 all 方法传入的不一定是数组，还可能是支持遍历（Iterator）的其他数据结构；那这个数据结构不就是 ES6 新增的 `Set集合`吗；

::: tip Set 集合概述

Set 也是 ES6 的数据结构。特点是无序不重复，它类似于数组，但是成员的值都是唯一的，没有重复的值。Set 本身是一个构造函数，用来生成 Set 数据结构，Set 函数可以接受一个数组作为参数，用来初始化。

:::

使用`Promise.all()传入 Set `集合：

```js
      let p1 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_1");
        }, 1000);
      });
      let p2 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_2");
        }, 2000);
      });
      let p3 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_3");
        }, 3000);
      });

	 ## 1,定义Set集合
	 let myMap = new Set([p2, p1, p3]);
   	 console.log("myMap:", myMap); // Set(3) {Promise, Promise, Promise}

	## 2,all方法传入Set集合
      Promise.all(myMap)
        .then((myMapRes) => {
          console.log("myMapRes:", myMapRes); //   ['success_2', 'success_1', 'success_3']
        })
        .catch((err) => {
          console.log("err:", err);
        });
```

执行结果：

```js
["success_2", "success_1", "success_3"];
```

可以看出，执行的结果是和数组的方式是一样的；

## 二、`Promise.race()`

`Promise.race`方法同样是将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

```js
const p = Promise.race([p1, p2, p3]);
```

`Promise.race` 是赛跑的意思，也就是说`Promise.race([p1, p2, p3])`里面的结果哪个获取的快，就返回哪个结果，不管结果本身是成功还是失败。

::: tip 使用场景

有时我们比如说有好几个服务器的好几个接口都提供同样的服务，我们不知道哪个接口更快，就可以使用` Promise.race`，哪个接口的数据先回来我们就用哪个接口的数据；

:::

代码如下：

```javascript
      let p1 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_1");
        }, 1000);
      });
      let p2 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_2");
        }, 2000);
      });
      let p3 = new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve("success_3");
        }, 3000);
      });

		## 调用race方法
        Promise.race([p2,p1,p3]).then(res=>{
          console.log("resRace:",res); // resRace: success_1
        }).catch(err=>{
          console.log("errRace:",err);
        })
```

执行结果：

```javascript
resRace: success_1;
```

p1 确实是执行最快的，返回执行最快的那个 `promise` 的 `resolve` 结果，其他的 `promise` 将不会再管了；

当然，如果最快的这个执行`promise`失败了，也是会走 catch 回调的；

## 三、总结

1. `promise.all 接收的 promise 数组`，总是按顺序且同步执行并返回的；只要有一个 `promise` 失败,最终状态就是失败的（reject）就会被 catch 捕获。
2. `promise.race 也接收 promise 数组`，总是返回执行最快的那一个，其他 `promise` 的状态并不关心。
