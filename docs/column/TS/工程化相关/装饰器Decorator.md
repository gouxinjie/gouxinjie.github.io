# TypeScript 中的装饰器 (Decorator) 使用

[[toc]]

**装饰器**（Decorator）是 `TypeScript` 中的一种特殊类型的声明，允许你在类、方法、属性或方法参数上添加元数据。它们通常用于框架中，用来给类或类的成员添加额外的行为或特性。

装饰器的应用非常广泛，尤其是在像 `Angular` 和 `NestJS` 这样的框架中，它们用来注入依赖、绑定事件、或者处理类和方法的元数据。

### 1. **装饰器的基本概念**

装饰器本质上是一个**函数**，该函数用于修改类或类成员的行为。装饰器在类、方法、属性或方法参数前加上 `@` 符号。例如：

```typescript
@decorator
class MyClass {}
```

- **类装饰器**：作用于类声明。
- **方法装饰器**：作用于类的方法。
- **属性装饰器**：作用于类的属性。
- **参数装饰器**：作用于类方法的参数。

### 2. **启用装饰器支持**

在 TypeScript 中，装饰器是一个实验性的特性，因此需要在 `tsconfig.json` 文件中开启 `experimentalDecorators` 选项：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### 3. **装饰器的分类**

#### 3.1 **类装饰器**

类装饰器作用于类的构造函数，它接受一个参数，表示被装饰的类。类装饰器可以用来修改类的行为，或替换类的构造函数。

```typescript
function logClass(target: Function) {
  console.log(`Class created: ${target.name}`);
}

@logClass
class MyClass {
  constructor() {
    console.log("MyClass instance created.");
  }
}

const myClassInstance = new MyClass();
// 输出:
// Class created: MyClass
// MyClass instance created.
```

在这个例子中，`@logClass` 装饰器会在创建类实例时打印出类的名字。

#### 3.2 **方法装饰器**

方法装饰器作用于类的方法，它可以修改方法的行为，或替换方法。方法装饰器的参数包括：

- `target`: 类的原型对象。
- `propertyKey`: 被装饰的方法名称。
- `descriptor`: 方法的属性描述符。

```typescript
function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with arguments:`, args);
    return originalMethod.apply(this, args);
  };
}

class MyClass {
  @logMethod
  sayHello(name: string) {
    console.log(`Hello, ${name}`);
  }
}

const myClassInstance = new MyClass();
myClassInstance.sayHello("Alice");
// 输出:
// Calling sayHello with arguments: [ 'Alice' ]
// Hello, Alice
```

在这个例子中，`logMethod` 装饰器会在调用 `sayHello` 方法时打印参数。

#### 3.3 **属性装饰器**

属性装饰器用于装饰类的属性，它接受两个参数：

- `target`: 类的原型对象。
- `propertyKey`: 被装饰的属性名称。

```typescript
function readonly(target: any, propertyKey: string) {
  console.log(`${propertyKey} is readonly`);
}

class MyClass {
  @readonly
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const myClassInstance = new MyClass("Alice");
// 输出: name is readonly
```

在这个例子中，`readonly` 装饰器会在类的属性 `name` 被定义时打印消息，虽然在此例中它没有直接限制属性值的修改，但通常它会用来实现其他逻辑，比如只读属性的限制。

#### 3.4 **参数装饰器**

参数装饰器作用于方法的参数。它接受三个参数：

- `target`: 类的原型对象。
- `propertyKey`: 方法的名称。
- `parameterIndex`: 参数的索引。

```typescript
function logParameter(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`${propertyKey} has a parameter at index ${parameterIndex}`);
}

class MyClass {
  greet(@logParameter name: string) {
    console.log(`Hello, ${name}`);
  }
}

const myClassInstance = new MyClass();
myClassInstance.greet("Alice");
// 输出:
// greet has a parameter at index 0
// Hello, Alice
```

在这个例子中，`logParameter` 装饰器会打印出 `greet` 方法中参数的位置（即 `name` 是第一个参数）。

### 4. **装饰器工厂**

装饰器工厂是一个返回装饰器的函数。这样你就可以向装饰器传递参数。

```typescript
function logWithPrefix(prefix: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`${prefix}: Calling ${propertyKey} with arguments:`, args);
      return originalMethod.apply(this, args);
    };
  };
}

class MyClass {
  @logWithPrefix("INFO")
  sayHello(name: string) {
    console.log(`Hello, ${name}`);
  }
}

const myClassInstance = new MyClass();
myClassInstance.sayHello("Alice");
// 输出:
// INFO: Calling sayHello with arguments: [ 'Alice' ]
// Hello, Alice
```

在这个例子中，`logWithPrefix` 装饰器工厂接受一个 `prefix` 参数，并且返回一个装饰器，这样我们就能在调用 `sayHello` 时打印带有前缀的信息。

### 5. **装饰器的应用**

装饰器的常见应用包括但不限于：

- **日志记录**：如上例所示，使用方法装饰器记录方法调用日志。
- **权限验证**：在某些框架中，可以使用装饰器来验证访问权限或认证状态。
- **依赖注入**：在 Angular 和 NestJS 等框架中，装饰器用于实现依赖注入（DI）。
- **性能优化**：使用装饰器来计算函数执行时间，做性能分析。

### 6. **装饰器的规则**

- **只能在类、方法、属性和参数上使用装饰器**，并且装饰器是一个函数。
- **装饰器不会影响装饰的目标的实际类型**，它只是给它添加一些元数据或改变其行为。
- **装饰器是执行顺序**：多个装饰器按从上到下的顺序执行，且每个装饰器的执行顺序是固定的。

### 7. **总结**

- **装饰器** 是 TypeScript 的一种元编程技术，允许你在类、方法、属性或方法参数上添加元数据或修改其行为。
- 装饰器使用 `@` 符号进行标注，可以用于多种场景，如日志记录、权限验证、依赖注入等。
- TypeScript 装饰器目前是实验性特性，需要在 `tsconfig.json` 文件中启用 `experimentalDecorators` 选项。
- 装饰器可以是简单的，也可以是工厂函数（接受参数的装饰器）。
