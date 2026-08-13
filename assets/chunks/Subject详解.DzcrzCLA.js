const e=`# RxJS Subject 详解

\`Subject\` 是 \`RxJS\` 中一个特殊的存在：它**既是 Observable（可订阅），又是 Observer（可发送值）**，是实现多播和组件间通信的核心工具。

## 一、Subject 基础

### 1. 什么是 Subject

普通的 \`Observable\` 是**单播**的（每个订阅者独立执行），而 \`Subject\` 是**多播**的（多个订阅者共享同一个执行和同一份值）。

\`\`\`typescript
import { Subject } from "rxjs";

const subject = new Subject<number>();

// 多个观察者订阅同一个 subject
subject.subscribe((v) => console.log("A:", v));
subject.subscribe((v) => console.log("B:", v));

subject.next(1); // A: 1  B: 1
subject.next(2); // A: 2  B: 2
\`\`\`

### 2. Subject 既发又收

\`\`\`typescript
// 作为 Observer 使用
const observable = of(1, 2, 3);
observable.subscribe(subject); // subject 充当观察者

// 作为 Observable 使用
subject.subscribe((v) => console.log(v));
\`\`\`

## 二、四种 Subject 变体对比

| 类型                 | 是否保存最新值 | 是否带初始值 | 特点                                   |
| -------------------- | -------------- | ------------ | -------------------------------------- |
| \`Subject\`            | 否             | 否           | 纯事件总线，错过即错过                 |
| \`BehaviorSubject\`    | 是             | 是           | 新订阅者立即收到最新值                 |
| \`ReplaySubject\`      | 是（可指定 N） | 否           | 新订阅者重放最近 N 个值               |
| \`AsyncSubject\`       | 是             | 否           | 只在 complete 时发出最后一个值        |

### 1. Subject：错过即错过

\`\`\`typescript
const subject = new Subject<number>();
subject.next(1); // 此时还没有订阅者，值被丢弃
subject.subscribe((v) => console.log(v)); // 收不到 1
subject.next(2); // 2
\`\`\`

### 2. BehaviorSubject：总能拿到最新值

\`BehaviorSubject\` 必须有初始值，新订阅者会立即收到当前最新值：

\`\`\`typescript
import { BehaviorSubject } from "rxjs";

const subject = new BehaviorSubject<number>(0); // 初始值 0

subject.subscribe((v) => console.log("A:", v)); // A: 0（立即收到初始值）
subject.next(1);
subject.subscribe((v) => console.log("B:", v)); // B: 1（收到最新值）
\`\`\`

> \`BehaviorSubject\` 是「状态容器」的首选，适合保存当前状态（如当前登录用户、主题设置）。

### 3. ReplaySubject：重放历史值

\`\`\`typescript
import { ReplaySubject } from "rxjs";

const subject = new ReplaySubject<number>(2); // 缓存最近 2 个值

subject.next(1);
subject.next(2);
subject.next(3);

subject.subscribe((v) => console.log("A:", v)); // A: 2  A: 3（重放最近 2 个）
\`\`\`

### 4. AsyncSubject：只发最后一个值

\`\`\`typescript
import { AsyncSubject } from "rxjs";

const subject = new AsyncSubject<number>();
subject.subscribe((v) => console.log(v));

subject.next(1);
subject.next(2);
subject.next(3);
subject.complete(); // 3（complete 时才发出最后一个值）
\`\`\`

> 适用场景：只关心「最终结果」的异步操作，例如一次性加载完成后取最终配置、缓存「最后一次」结果。

## 三、Subject 在 Angular 中的典型应用

### 1. 组件间通信（事件总线）

\`\`\`typescript
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class EventBusService {
  private refreshSource = new Subject<void>();
  refresh$ = this.refreshSource.asObservable();

  // 对外只暴露发送方法，不暴露 next，保证数据单向
  triggerRefresh() {
    this.refreshSource.next();
  }
}
\`\`\`

### 2. 用 BehaviorSubject 做轻量状态管理

\`\`\`typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class CartService {
  private itemsSource = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSource.asObservable();

  addItem(item: CartItem) {
    this.itemsSource.next([...this.itemsSource.value, item]);
  }

  clear() {
    this.itemsSource.next([]);
  }
}
\`\`\`

### 3. 实现加载状态

\`\`\`typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class LoadingService {
  private loadingSource = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSource.asObservable();

  show() {
    this.loadingSource.next(true);
  }
  hide() {
    this.loadingSource.next(false);
  }
}
\`\`\`

## 四、多播操作符与 Subject 的关系

\`multicast\`、\`share\`、\`shareReplay\` 等操作符内部都依赖 \`Subject\` 实现多播：

\`\`\`typescript
import { interval } from "rxjs";
import { share, shareReplay } from "rxjs/operators";

// share：内部使用 Subject 实现多播，避免重复请求
const shared$ = this.http.get("/api/data").pipe(share());

// shareReplay：多播并缓存最新值（类似 ReplaySubject）
const cached$ = this.http.get("/api/config").pipe(shareReplay(1));
\`\`\`

## 五、常见问题解答

**Q1：Subject 和 BehaviorSubject 怎么选？**

- 需要「订阅者总是能拿到最新状态」→ \`BehaviorSubject\`
- 纯事件通知、错过也无所谓 → \`Subject\`
- 需要重放历史 → \`ReplaySubject\`

**Q2：为什么推荐用 \`asObservable()\` 暴露 Subject？**

- 防止外部代码直接调用 \`next()\` 随意篡改数据，保持数据流单向可控。

**Q3：Subject 会内存泄漏吗？**

- 会。\`Subject\` 会持有订阅者的引用，组件销毁时如果不取消订阅，Subject 仍持有已销毁组件的回调，导致泄漏。务必在 \`ngOnDestroy\` 取消订阅或使用 \`async\` 管道。

**Q4：hot 和 cold 与 Subject 有什么关系？**

- \`Subject\` 是典型的 **hot**（多播，共享执行）
- 普通 \`Observable\` 默认是 **cold**（每次订阅独立执行）
`;export{e as default};
