const n=`# Angular 装饰器（Decorator）大全

装饰器是 \`TypeScript\` 的元编程特性，\`Angular\` 大量使用装饰器来声明组件、指令、管道、服务以及它们的元数据和依赖。理解装饰器是理解 \`Angular\` 的钥匙。

## 一、什么是装饰器

装饰器本质上是一个**函数**，用来给类、方法、属性或参数附加「元数据」或改变其行为。在 \`Angular\` 中，装饰器通过 \`@\` 前缀使用：

\`\`\`typescript
@DecoratorName(参数)
class TargetClass {}
\`\`\`

## 二、类装饰器

### 1. @Component

声明一个组件，是最核心的装饰器：

\`\`\`typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-user", // 标签名
  standalone: true, // 是否独立组件
  imports: [CommonModule], // 依赖的模块/组件
  templateUrl: "./user.component.html", // 模板
  styleUrl: "./user.component.scss", // 样式
  changeDetection: ChangeDetectionStrategy.OnPush, // 变更检测策略
  providers: [] // 组件级服务
})
export class UserComponent {}
\`\`\`

### 2. @Directive

声明一个指令（属性型或结构型）：

\`\`\`typescript
import { Directive, HostListener, HostBinding } from "@angular/core";

@Directive({ selector: "[appHover]" })
export class HoverDirective {
  @HostBinding("class.active") isActive = false;

  @HostListener("mouseenter") onEnter() {
    this.isActive = true;
  }
}
\`\`\`

### 3. @Pipe

声明一个管道：

\`\`\`typescript
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "truncate" })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20): string {
    return value.length > limit ? value.slice(0, limit) + "..." : value;
  }
}
\`\`\`

### 4. @Injectable

声明可注入的服务：

\`\`\`typescript
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class UserService {}
\`\`\`

### 5. @NgModule

声明一个模块：

\`\`\`typescript
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [],
  imports: [],
  providers: [],
  exports: []
})
export class FeatureModule {}
\`\`\`

## 三、属性/字段装饰器

### 1. @Input —— 父传子接收

\`\`\`typescript
@Input() name = "";
@Input("aliasName") aliased = ""; // 指定外部别名
@Input({ required: true }) id!: string; // 必传输入
\`\`\`

### 2. @Output —— 子传父发射

\`\`\`typescript
import { EventEmitter } from "@angular/core";

@Output() nameChange = new EventEmitter<string>();

emitChange() {
  this.nameChange.emit("新名字");
}
\`\`\`

### 3. @ViewChild —— 查询视图中的子元素/组件

\`\`\`typescript
import { ViewChild, ElementRef } from "@angular/core";

@ViewChild("myInput") inputRef!: ElementRef; // 通过模板引用变量查询
@ViewChild(ChildComponent) child!: ChildComponent; // 通过组件类型查询

ngAfterViewInit() {
  this.inputRef.nativeElement.focus();
}
\`\`\`

### 4. @ViewChildren —— 查询多个

\`\`\`typescript
import { ViewChildren, QueryList } from "@angular/core";

@ViewChildren("item") items!: QueryList<ElementRef>;
\`\`\`

### 5. @ContentChild / @ContentChildren —— 查询投影内容

\`\`\`typescript
import { ContentChild } from "@angular/core";

@ContentChild(HeaderComponent) header!: HeaderComponent;

ngAfterContentInit() {
  // 投影内容初始化后才能访问
  console.log(this.header);
}
\`\`\`

## 四、宿主元素装饰器

### 1. @HostListener —— 监听宿主元素事件

\`\`\`typescript
@HostListener("click", ["$event"])
onHostClick(event: MouseEvent) {
  console.log("宿主元素被点击", event);
}

@HostListener("window:resize", ["$event"])
onWindowResize() {
  console.log("窗口大小变化");
}
\`\`\`

### 2. @HostBinding —— 绑定宿主元素属性

\`\`\`typescript
@HostBinding("class.active") active = true;
@HostBinding("style.width.px") width = 200;
@HostBinding("attr.role") role = "button";
\`\`\`

## 五、参数装饰器

### 1. @Inject —— 注入非类令牌

\`\`\`typescript
constructor(@Inject("API_URL") private apiUrl: string) {}
\`\`\`

### 2. @Optional —— 可选依赖

\`\`\`typescript
constructor(@Optional() private logger: Logger) {}
\`\`\`

### 3. @Self / @SkipSelf / @Host —— 控制注入查找范围

\`\`\`typescript
// @Self：只在自身注入器中查找
constructor(@Self() private service: DataService) {}

// @SkipSelf：跳过自身，从父级注入器查找
constructor(@SkipSelf() private parentService: DataService) {}

// @Host：限定在宿主注入器
constructor(@Host() private hostService: DataService) {}
\`\`\`

## 六、装饰器速查表

| 装饰器            | 作用位置 | 作用                                   |
| ----------------- | -------- | -------------------------------------- |
| \`@Component\`      | 类       | 声明组件                               |
| \`@Directive\`      | 类       | 声明指令                               |
| \`@Pipe\`           | 类       | 声明管道                               |
| \`@Injectable\`     | 类       | 声明服务                               |
| \`@NgModule\`       | 类       | 声明模块                               |
| \`@Input\`          | 属性     | 接收父组件数据                         |
| \`@Output\`         | 属性     | 向父组件发射事件                       |
| \`@ViewChild\`      | 属性     | 查询视图内单个元素/组件                |
| \`@ViewChildren\`   | 属性     | 查询视图内多个元素/组件                |
| \`@ContentChild\`   | 属性     | 查询投影内容                           |
| \`@ContentChildren\`| 属性     | 查询多个投影内容                       |
| \`@HostListener\`   | 方法     | 监听宿主元素事件                       |
| \`@HostBinding\`    | 属性     | 绑定宿主元素属性                       |
| \`@Inject\`         | 参数     | 注入非类令牌                           |
| \`@Optional\`       | 参数     | 声明可选依赖                           |
| \`@Self\`/\`@SkipSelf\`/\`@Host\` | 参数 | 控制注入查找范围               |

## 七、常见问题解答

**Q1：装饰器到底是什么？**

- 装饰器是一个接收目标并返回增强后目标的**函数**，\`Angular\` 用它来注册元数据。所以所有装饰器后面都要加括号 \`()\`（即使没有参数）。

**Q2：@ViewChild 和 @ContentChild 有什么区别？**

- \`@ViewChild\` 查询组件**自身模板**中的元素/组件
- \`@ContentChild\` 查询从父组件**投影（ng-content）进来的**内容

**Q3：@Input 什么时候可用？**

- 在 \`ngOnChanges\` 和 \`ngOnInit\` 阶段可用，\`constructor\` 中尚未完成绑定。

**Q4：@HostListener 能监听全局事件吗？**

- 可以，如 \`@HostListener("document:click")\` 或 \`@HostListener("window:scroll")\`，但记得在 \`ngOnDestroy\` 时无需手动移除（Angular 会自动清理）。
`;export{n as default};
