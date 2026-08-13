const n=`# Angular 生命周期钩子实战

生命周期钩子让开发者能在组件创建、变更、销毁等关键节点执行自定义逻辑。本文聚焦每个钩子的**实际应用场景**与**代码示例**。

## 一、生命周期总览

\`\`\`mermaid
flowchart TD
    A[constructor 构造] --> B[ngOnChanges 输入变化]
    B --> C[ngOnInit 初始化]
    C --> D[ngDoCheck 变更检测]
    D --> E[ngAfterContentInit 内容初始化]
    E --> F[ngAfterContentChecked 内容检查]
    F --> G[ngAfterViewInit 视图初始化]
    G --> H[ngAfterViewChecked 视图检查]
    H --> I[ngOnDestroy 销毁]
\`\`\`

| 钩子                       | 触发时机                         | 常用场景                     |
| -------------------------- | -------------------------------- | ---------------------------- |
| \`constructor\`              | 实例化时                         | 注入依赖（不做复杂逻辑）     |
| \`ngOnChanges\`              | \`@Input\` 属性变化时              | 响应输入变化、重置状态       |
| \`ngOnInit\`                 | 首次初始化完成后                 | 初始化数据、发起请求         |
| \`ngDoCheck\`                | 每次变更检测                     | 自定义变更检测（慎用）       |
| \`ngAfterContentInit\`       | 投影内容初始化后                 | 访问 \`@ContentChild\`         |
| \`ngAfterContentChecked\`    | 投影内容检查后                   | 内容变化后的逻辑             |
| \`ngAfterViewInit\`          | 视图初始化后                     | 访问 \`@ViewChild\`、DOM 操作  |
| \`ngAfterViewChecked\`       | 视图检查后                       | 视图渲染完成后的逻辑         |
| \`ngOnDestroy\`              | 组件销毁前                       | 清理订阅、定时器、资源       |

## 二、核心钩子实战

### 1. constructor vs ngOnInit

\`\`\`typescript
import { Component, OnInit } from "@angular/core";
import { UserService } from "./user.service";

@Component({ selector: "app-user", standalone: true, templateUrl: "./user.component.html" })
export class UserComponent implements OnInit {
  constructor(private userService: UserService) {
    // 只做依赖注入，不要在这里发起请求或访问 @Input
  }

  ngOnInit() {
    // 组件初始化完成，@Input 已就绪，适合发起数据请求
    this.userService.getUsers().subscribe((users) => (this.users = users));
  }
}
\`\`\`

> 经验法则：\`constructor\` 只负责注入依赖；所有初始化逻辑（请求数据、访问输入属性）放到 \`ngOnInit\`。

### 2. ngOnChanges：响应输入变化

当父组件传入的 \`@Input\` 值变化时触发，适合在值变化时重新计算或重置状态：

\`\`\`typescript
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({ selector: "app-child", standalone: true, template: \`<p>{{ title }}</p>\` })
export class ChildComponent implements OnChanges {
  @Input() title = "";
  @Input() count = 0;

  ngOnChanges(changes: SimpleChanges) {
    // changes 中记录了哪个输入属性发生了变化
    if (changes["count"]) {
      console.log("count 从", changes["count"].previousValue, "变为", changes["count"].currentValue);
    }
  }
}
\`\`\`

### 3. ngAfterViewInit：访问视图/DOM

\`@ViewChild\` 查询到的元素或子组件，只有在视图初始化后才能访问到：

\`\`\`typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

@Component({ selector: "app-home", standalone: true, template: \`<canvas #myCanvas></canvas>\` })
export class HomeComponent implements AfterViewInit {
  @ViewChild("myCanvas") canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    // 此时 canvas 元素已渲染到 DOM，可以进行 DOM 操作
    const ctx = this.canvas.nativeElement.getContext("2d");
    ctx?.fillRect(0, 0, 100, 100);
  }
}
\`\`\`

### 4. ngOnDestroy：清理资源（防内存泄漏）

这是最容易被忽略但最重要的钩子，务必清理订阅、定时器、事件监听：

\`\`\`typescript
import { Component, OnDestroy } from "@angular/core";
import { Subscription, interval } from "rxjs";

@Component({ selector: "app-timer", standalone: true, template: \`<p>{{ seconds }}s</p>\` })
export class TimerComponent implements OnDestroy {
  seconds = 0;
  private sub!: Subscription;

  ngOnInit() {
    // 启动定时器
    this.sub = interval(1000).subscribe(() => this.seconds++);
  }

  ngOnDestroy() {
    // 组件销毁时取消订阅，避免内存泄漏
    this.sub.unsubscribe();
  }
}
\`\`\`

> 更优雅的替代方案：使用 \`async\` 管道自动管理订阅，或 \`takeUntil\` 模式统一取消，可避免手动 \`unsubscribe\` 遗漏。

## 三、ngOnChanges 与 Signal 输入的替代

\`Angular 16+\` 引入了 \`input()\` 信号输入，配合 \`computed\`/\`effect\` 可以更优雅地响应输入变化，替代 \`ngOnChanges\`：

\`\`\`typescript
import { Component, input, computed, effect } from "@angular/core";

@Component({ selector: "app-child", standalone: true, template: \`<p>{{ doubleCount() }}</p>\` })
export class ChildComponent {
  count = input(0); // 信号输入

  // 自动跟随 count 变化
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log("count 变为:", this.count());
    });
  }
}
\`\`\`

## 四、完整生命周期示例

一个记录完整生命周期的调试组件：

\`\`\`typescript
import {
  Component, Input, OnChanges, OnInit, DoCheck, AfterContentInit,
  AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy, SimpleChanges
} from "@angular/core";

@Component({ selector: "app-lifecycle", standalone: true, template: \`<p>{{ name }}</p>\` })
export class LifecycleComponent
  implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy
{
  @Input() name = "";

  private log(msg: string) {
    console.log(\`[Lifecycle] \${msg}\`);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.log("ngOnChanges");
  }
  ngOnInit() {
    this.log("ngOnInit");
  }
  ngDoCheck() {
    this.log("ngDoCheck");
  }
  ngAfterContentInit() {
    this.log("ngAfterContentInit");
  }
  ngAfterContentChecked() {
    this.log("ngAfterContentChecked");
  }
  ngAfterViewInit() {
    this.log("ngAfterViewInit");
  }
  ngAfterViewChecked() {
    this.log("ngAfterViewChecked");
  }
  ngOnDestroy() {
    this.log("ngOnDestroy");
  }
}
\`\`\`

## 五、常见问题解答

**Q1：ngOnInit 和 ngAfterViewInit 该用哪个发请求？**

- 数据请求用 \`ngOnInit\`（早，减少白屏等待）
- 需要访问 DOM / \`@ViewChild\` 的操作用 \`ngAfterViewInit\`

**Q2：ngDoCheck 要慎用吗？**

- 是的。\`ngDoCheck\` 在每次变更检测都会触发，频率极高，滥用会导致性能问题，仅在 \`OnPush\` 策略下需要手动检测时考虑。

**Q3：为什么要在 ngOnDestroy 取消订阅？**

- 订阅若不取消，即使组件销毁，Observable 仍持有回调引用，导致内存泄漏，甚至出现「已销毁组件还在响应事件」的诡异 bug。

**Q4：constructor 里能访问 @Input 吗？**

- 不能。\`@Input\` 属性在 \`constructor\` 阶段还未完成绑定，要到 \`ngOnChanges\`/\`ngOnInit\` 阶段才可用。
`;export{n as default};
