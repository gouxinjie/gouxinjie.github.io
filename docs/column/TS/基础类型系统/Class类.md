# TypeScript 中的 Class 基本使用指南

`TypeScript` 为` JavaScript 的类(class)`添加了类型支持，让面向对象编程更加安全和可靠。下面是·类(class)的基本使用方法。

## 一、定义类的基本结构

```typescript
class Person {
  // 1. 属性声明（需要类型注解）
  name: string;
  age: number;

  // 2. 构造函数
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // 3. 方法定义
  introduce(): string {
    return `Hi, I'm ${this.name}, ${this.age} years old.`;
  }
}
```

## 二、创建类的实例

```typescript
// 创建实例时，TypeScript会检查参数类型
const person1 = new Person("Alice", 25); // 正确
const person2 = new Person("Bob", "30"); // 错误：'30'不是number类型

// 调用方法
console.log(person1.introduce()); // 输出: Hi, I'm Alice, 25 years old.
```

## 三、访问修饰符

TypeScript 提供了三种访问修饰符来控制类成员的可见性：

```typescript
class Employee {
  public name: string; // 公共属性（默认）
  private id: number; // 私有属性，只能在类内部访问
  protected dept: string; // 受保护属性，类和子类可访问

  constructor(name: string, id: number, dept: string) {
    this.name = name;
    this.id = id;
    this.dept = dept;
  }

  public getEmployeeId(): number {
    return this.id; // 可以访问私有属性
  }
}

const emp = new Employee("Charlie", 1001, "IT");
console.log(emp.name); // 可以访问
console.log(emp.id); // 错误：id是私有的
console.log(emp.dept); // 错误：dept是受保护的
```

## 四、readonly 修饰符

```typescript
class Circle {
  readonly PI = 3.14; // 只读属性
  radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  getArea(): number {
    return this.PI * this.radius ** 2;
  }
}

const circle = new Circle(5);
circle.PI = 3.14159; // 错误：PI是只读的
```

## 五、参数属性简写

TypeScript 提供了一种简写方式，可以在构造函数参数中直接声明类属性：

```typescript
class Point {
  // 直接在构造函数参数中声明并初始化属性
  constructor(public x: number, public y: number) {}

  getDistance(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

const point = new Point(3, 4);
console.log(point.getDistance()); // 输出: 5
```

## 六、类作为类型使用

类定义后，可以同时作为类型使用：

```typescript
class Product {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

// 使用类作为类型
function printProductInfo(product: Product) {
  console.log(`${product.name} - $${product.price}`);
}

const laptop = new Product("Laptop", 999);
printProductInfo(laptop); // 输出: Laptop - $999
```

## 七、继承基础

```typescript
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog("Buddy");
dog.move(10); // 输出: Buddy moved 10m.
dog.bark(); // 输出: Woof! Woof!
```
