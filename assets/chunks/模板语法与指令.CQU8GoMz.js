const n=`# Angular 模板语法与指令

指令是 \`Angular\` 模板的核心扩展机制，它通过给 DOM 元素附加行为或改变其结构，来实现动态渲染。

## 一、指令的三大分类

| 分类         | 说明                                           | 常见例子                                   |
| ------------ | ---------------------------------------------- | ------------------------------------------ |
| 组件         | 带模板的指令（最常用）                         | 自定义组件                                 |
| 属性型指令   | 改变元素外观或行为的指令                       | \`NgClass\`、\`NgStyle\`、\`ngModel\`           |
| 结构型指令   | 通过增删 DOM 元素来改变结构的指令（带 \`*\`）    | \`*ngIf\`、\`*ngFor\`、\`*ngSwitch\`            |

## 二、模板语法

### 1. 插值与属性绑定

\`\`\`html
<!-- 插值表达式 -->
<p>{{ title }}</p>
<!-- 属性绑定 -->
<p [title]="title">悬停查看</p>
<!-- 事件绑定 -->
<button (click)="onClick()">点击</button>
<!-- 双向绑定 -->
<input [(ngModel)]="name" />
\`\`\`

### 2. 模板引用变量（#）

在模板中用 \`#\` 声明一个引用变量，可以在模板中直接访问元素或组件实例：

\`\`\`html
<input #nameInput type="text" />
<button (click)="log(nameInput.value)">读取输入框</button>
\`\`\`

### 3. 安全导航操作符（?.）

当对象可能为 \`null\`/\`undefined\` 时，用 \`?.\` 避免报错：

\`\`\`html
<p>{{ user?.address?.city }}</p>
\`\`\`

### 4. 管道操作符（|）

\`\`\`html
<p>{{ today | date:'yyyy-MM-dd' }}</p>
<p>{{ price | currency }}</p>
\`\`\`

## 三、结构型指令详解

### 1. *ngIf 与 else

\`\`\`html
<div *ngIf="isLoggedIn; else loginTemplate">欢迎回来</div>
<ng-template #loginTemplate>
  <button>请登录</button>
</ng-template>
\`\`\`

### 2. *ngFor 与局部变量

\`\`\`html
<li *ngFor="let item of list; let i = index; let even = even">
  {{ i + 1 }} - {{ item.name }} <span *ngIf="even">(偶数行)</span>
</li>
\`\`\`

\`*ngFor\` 常用局部变量：

| 变量       | 含义             |
| ---------- | ---------------- |
| \`index\`    | 当前项索引（从 0） |
| \`first\`    | 是否为第一项     |
| \`last\`     | 是否为最后一项   |
| \`even\`     | 是否为偶数索引   |
| \`odd\`      | 是否为奇数索引   |

### 3. trackBy 优化列表渲染

当列表数据变化时，\`trackBy\` 能让 Angular 只更新变化的项，避免重建整个列表：

\`\`\`html
<li *ngFor="let item of list; trackBy: trackById">{{ item.name }}</li>
\`\`\`

\`\`\`typescript
trackById(index: number, item: any) {
  return item.id;
}
\`\`\`

## 四、ng-container 与 ng-template

### 1. ng-container

不产生任何真实 DOM 元素的「透明容器」，适合需要逻辑包裹但不想多一层 DOM 的场景：

\`\`\`html
<ng-container *ngIf="user">
  <p>{{ user.name }}</p>
  <p>{{ user.email }}</p>
</ng-container>
\`\`\`

### 2. ng-template 与 * 语法糖

\`*ngIf\` 实际上是 \`ng-template\` 的语法糖。下面两段是等价的：

\`\`\`html
<div *ngIf="condition">内容</div>
\`\`\`

\`\`\`html
<ng-template [ngIf]="condition">
  <div>内容</div>
</ng-template>
\`\`\`

## 五、自定义属性型指令

用 \`@Directive\` 创建属性型指令，通过 \`@HostListener\` 监听宿主元素事件、\`@HostBinding\` 绑定宿主属性：

\`\`\`typescript
import { Directive, HostListener, HostBinding } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
  standalone: true
})
export class HighlightDirective {
  // 绑定宿主的样式属性
  @HostBinding("style.backgroundColor") bgColor = "transparent";

  // 监听宿主元素的 mouseenter 事件
  @HostListener("mouseenter")
  onMouseEnter() {
    this.bgColor = "yellow";
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.bgColor = "transparent";
  }
}
\`\`\`

使用：

\`\`\`html
<p appHighlight>鼠标移上来会高亮</p>
\`\`\`

## 六、自定义结构型指令

结构型指令通过 \`TemplateRef\` + \`ViewContainerRef\` 控制模板的渲染，核心是 \`*\` 语法糖展开：

\`\`\`typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appUnless]",
  standalone: true
})
export class UnlessDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  // setter：当条件变化时触发
  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      // 条件为 false 时才渲染
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
\`\`\`

使用（注意语义与 \`*ngIf\` 相反）：

\`\`\`html
<p *appUnless="isLoading">加载完成！</p>
\`\`\`

## 七、常见问题解答

**Q1：\`*ngIf\` 和 \`[hidden]\` 有什么区别？**

- \`*ngIf\`：为 false 时**从 DOM 中移除**元素，释放其组件和资源
- \`[hidden]\`：元素仍在 DOM 中，只是通过 CSS 隐藏，组件依然存活

**Q2：什么时候用 \`ng-container\` 而不是 \`div\`？**

- 当只需要逻辑分组、不希望产生多余的 DOM 元素时（尤其影响 CSS 布局或语义时）

**Q3：结构型指令为什么必须带 \`*\`？**

- \`*\` 是语法糖，实际展开为 \`ng-template\`。理解这一点有助于自定义结构型指令时正确使用 \`TemplateRef\`/\`ViewContainerRef\`。
`;export{n as default};
