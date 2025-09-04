# TypeScript 中的装饰器 (Decorator) 使用

装饰器是 `TypeScript` 中一种特殊类型的声明，它可以被附加到类声明、方法、访问器、属性或参数上，用来修改类的行为。装饰器使用 `@expression` 形式，其中 `expression` 必须求值为一个函数。

## 基本概念

装饰器是一种设计模式，它允许在不修改原始代码的情况下，通过添加标注来扩展功能。在 `TypeScript` 中，装饰器目前仍处于实验性阶段，需要在 `tsconfig.json` 中启用：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 装饰器类型

### 1. 类装饰器

类装饰器应用于类构造函数，可以用来观察、修改或替换类定义。

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 2. 方法装饰器

方法装饰器应用于方法的属性描述符，可以用来观察、修改或替换方法定义。

```typescript
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 3. 访问器装饰器

访问器装饰器应用于访问器的属性描述符，可以用来观察、修改或替换访问器的定义。

```typescript
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}
```

### 4. 属性装饰器

属性装饰器应用于类的属性。

```typescript
function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    let value = target[propertyKey];

    const getter = () => {
      return `${formatString} ${value}`;
    };

    const setter = (newVal: string) => {
      value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class Greeter {
  @format("Hello")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
}

const greeter = new Greeter("World");
console.log(greeter.greeting); // 输出: Hello World
```

### 5. 参数装饰器

参数装饰器应用于构造函数或方法参数。

```typescript
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  console.log(`Parameter ${parameterIndex} in ${String(propertyKey)} is required`);
}

class Greeter {
  greeting: string;

  constructor(@required message: string) {
    this.greeting = message;
  }
}
```

## 装饰器工厂

装饰器工厂是一个返回装饰器函数的函数，允许你通过参数配置装饰器行为。

```typescript
function color(value: string) {
  return function (target: any) {
    target.prototype.color = value;
  };
}

@color("red")
class Circle {
  radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }
}

const circle = new Circle(10);
console.log((circle as any).color); // 输出: red
```

## 装饰器执行顺序

不同类型的装饰器按以下顺序执行：

1. 参数装饰器，然后依次是方法装饰器、访问器装饰器或属性装饰器应用到每个实例成员
2. 参数装饰器，然后依次是方法装饰器、访问器装饰器或属性装饰器应用到每个静态成员
3. 参数装饰器应用到构造函数
4. 类装饰器应用到类
