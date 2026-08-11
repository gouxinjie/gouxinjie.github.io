# 简单理解 this 的指向问题

[[toc]]

首先要说的是，传统函数 `this` 指向调用者 箭头函数 this 指向声明时所处的对象。

## 1，普通函数中的 this 指向-> Window

```javascript
function fun1() {
  console.log("this:", this);
}
fun1();
// 打印结果： this: Window顶层对象
```

## 2，严格模式下普通函数中的 this 指向-> undefined

`JavaScript` 除了提供正常模式外，还提供了严格模式（`strict mode`）。
ES5 的严格模式是采用具有限制性 `JavaScript` 变体的一种方式，即在严格的条件下运行 JS 代码。

::: tip 严格模式

- 消除了 Javascript 语法的一些不合理、不严谨之处，减少了一些怪异行为。
- 消除代码运行的一些不安全之处，保证代码运行的安全。
- 提高编译器效率，增加运行速度。
- 禁用了在 `ECMAScript` 的未来版本中可能会定义的一些语法，为未来新版本的 Javascript 做好铺垫。比如一些保留字如：`class, enum, export, extends, import, super`不能做变量名。

:::

```javascript
// "use strict";//开启严格属性
function fun1() {
  console.log("this:", this);
}
fun1();
// 打印结果： this: undefined
```

## 3，事件函数中的 this 指向-> Window 点击事件里面的 this 指向是 Window

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div class="demo">
        <button onClick='eventThis()'>事件中里面的this指向：</button>
    </div>
    <script>

        function eventThis(){
            console.log("普通事件中的this:",this);
            // 打印结果： this: Window顶层对象
        }
     </script>
</body>
</html>
```

## 4，构造函数以及类中的 this 指向 -> 实例化对象

在构造函数以及类中的 `this`，构造函数配合 new 使用, 而 new 关键字会将构造函数中的 this 指向实例化对象，所以构造函数中的 this 指向 当前实例化的对象；

### 4.1 构造函数中的 this 指向如下：

```javascript
1，创建一个构造函数：
 function UmbraFun(name, age) {
        this.name = name;
        this.age = age;
        this.say = function () {
          console.log('构造函数中的this指向：',this);
        };
      }
     2，进行实例化
      let Umbra = new UmbraFun('安柏',17)
      Umbra.say()
    打印结果：UmbraFun {name: '安柏', age: 17, say: ƒ}
```

### 4.2 类中的 this 指向如下：

```javascript
/* 在构造函数以及类中的this，构造函数配合 new 使用, 
 而 new 关键字会将构造函数中的 this 指向实例化对象，所以构造函数中的 this 指向 当前实例化的对象 */
class People {
  constructor() {
    console.log("构造器中的this:", this);
    // 打印结果  People
  }
  dance() {
    console.log("类中的this指向：", this);
  }
}
let Eula = new People();
Eula.dance(); // 打印结果  People
```

## 5， 对象中的普通函数和箭头函数的指向：普通函数指向-->该对象，箭头函数指向-->父级的 this 指向

```javascript
/* 对象中的this指向 */
let umbraObj = {
  name: "安柏",
  say: function () {
    console.log("对象中普通函数的this指向：", this);
    // 打印结果： {name: '安柏', say: ƒ, say2: ƒ}
  },
  say2: () => {
    console.log("对象中箭头函数的this指向：", this);
    // 打印结果： this: Window顶层对象
  }
};
umbraObj.say(); // {name: '安柏', say: ƒ, say2: ƒ}
umbraObj.say2(); // this: Window顶层对象
```
