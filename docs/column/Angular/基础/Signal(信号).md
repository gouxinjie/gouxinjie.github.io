# Angular Signals 解析：响应式编程的新范式

`Angular 16` 引入了全新的 **Signals（信号）** 机制，这是 `Angular` 响应式系统的一次重大革新。

## 一、Signals 基础概念

### 什么是 Signal？

`Signal` 是一个**响应式原始类型**，它包含一个值，并能在其值变化时通知依赖它的消费者。`Signal` 是：

- **可变的**：通过`.set()`或`.update()`修改值
- **响应式的**：自动跟踪依赖关系
- **高效的**：精确的变更检测机制

### 为什么需要 Signal？

- 更**精细**的变更检测（相比 Zone.js 的全应用检查）
- 更**直观**的响应式编程模型
- 更好的**性能**（减少不必要的变更检测）
- 为未来的**无 Zone.js**模式铺路

## 二、核心 API 详解

### 1. 创建 Signal

```typescript
import { signal } from "@angular/core";

// 创建可写Signal
const count = signal(0); // 初始值为0

// 创建带有复杂对象的Signal
const user = signal({
  name: "张三",
  age: 25
});
```

### 2. 读取 Signal 值

```typescript
// 在组件中
currentCount = this.count(); // 通过函数调用获取值

// 在模板中
<p>当前计数: {{ count() }}</p>
```

### 3. 更新 Signal

```typescript
// 直接设置新值
count.set(10);

// 基于前值更新
count.update((v) => v + 1);

// 修改对象的部分属性
user.mutate((u) => {
  u.age = 26;
});
```

### 4. 计算 Signal（Computed）

```typescript
import { computed } from "@angular/core";

const doubleCount = computed(() => count() * 2);
// 当count变化时，doubleCount会自动重新计算
```

## 三、在组件中使用 Signal

### 1. 基本用法

```typescript
@Component({
  template: `
    <p>计数: {{ count() }}</p>
    <p>双倍计数: {{ doubleCount() }}</p>
    <button (click)="increment()">增加</button>
  `
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update((v) => v + 1);
  }
}
```

### 2. 与输入属性结合

```typescript
@Component({...})
export class UserComponent {
  // 输入属性转换为Signal
  userId = input.required<number>(); // Angular 16+新特性

  // 基于输入的Signal
  user = computed(() => {
    return this.userService.getUser(this.userId());
  });
}
```

### 3. 与 Effect 结合

```typescript
import { effect } from '@angular/core';

@Component({...})
export class UserComponent {
  user = signal<User | null>(null);

  constructor() {
    // 当user变化时自动执行
    effect(() => {
      if (this.user()) {
        console.log('用户已更新:', this.user());
      }
    });
  }
}
```

## 四、Signal 与 RxJS 的对比与集成

### 1. Signal vs Observable

| 特性       | Signal       | Observable |
| ---------- | ------------ | ---------- |
| 值获取方式 | 同步直接调用 | 异步订阅   |
| 依赖跟踪   | 自动         | 手动管理   |
| 适用场景   | 本地状态管理 | 异步数据流 |

### 2. 与 RxJS 互操作

```typescript
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({...})
export class UserComponent {
  private userService = inject(UserService);

  // Observable转Signal
  users = toSignal(this.userService.getUsers(), { initialValue: [] });

  // Signal转Observable
  searchTerm = signal('');
  searchResults$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    switchMap(term => this.userService.search(term))
  );
}
```

## 五、高级模式与最佳实践

### 1. 自定义响应式指令

```typescript
@Directive({
  selector: "[appIf]",
  standalone: true
})
export class IfDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  @Input({ required: true }) set appIf(condition: Signal<boolean>) {
    effect(() => {
      if (condition()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
```

### 2. 状态管理模式

```typescript
// 全局状态服务
@Injectable({ providedIn: 'root' })
export class CounterStore {
  private count = signal(0);

  readonly count = this.count.asReadonly();
  readonly double = computed(() => this.count() * 2);

  increment() {
    this.count.update(v => v + 1);
  }
}

// 组件中使用
@Component({...})
export class CounterComponent {
  counterStore = inject(CounterStore);
}
```

### 3. 性能优化技巧

1. **避免过度计算**：保持 computed 逻辑简单
2. **合理使用 effect**：避免在 effect 中执行耗时操作
3. **使用 untracked**：当不需要跟踪依赖时
   ```typescript
   effect(() => {
     const count = this.count(); // 被跟踪
     untracked(() => {
       console.log("当前窗口大小:", window.innerWidth); // 不跟踪
     });
   });
   ```

## 六、常见问题解答

**Q1: Signal 会取代 RxJS 吗？**

- 不会，两者是互补关系
- Signal 适合**本地状态管理**
- RxJS 适合**复杂异步数据流**

**Q2: Signal 何时触发变更检测？**

- 当 Signal 值**实际变化**时（与之前值不同）
- 通过**精细的依赖跟踪**，只更新受影响的部分

**Q3: 如何在服务中使用 Signal？**

- 与组件中使用方式相同
- 可以作为**全局状态容器**
- 通过`asReadonly()`暴露只读版本

## 七、实战示例：购物车功能

```typescript
// 购物车服务
@Injectable({ providedIn: "root" })
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly items = this.items.asReadonly();
  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));

  addItem(item: CartItem) {
    this.items.update((items) => [...items, item]);
  }

  removeItem(id: string) {
    this.items.update((items) => items.filter((i) => i.id !== id));
  }
}

// 组件中使用
@Component({
  template: `
    <div *ngFor="let item of cart.items()">{{ item.name }} - {{ item.price | currency }}</div>
    <p>总计: {{ cart.total() | currency }}</p>
  `
})
export class CartComponent {
  cart = inject(CartService);
}
```
