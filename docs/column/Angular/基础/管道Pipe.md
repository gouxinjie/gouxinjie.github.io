# Angular 管道(Pipe)

`管道(Pipe)是 Angular` 中一个非常强大的功能，它允许我们在模板中直接转换数据的显示格式，而无需修改原始数据。

## 一、管道的基本概念

### 什么是管道？

管道是一种可以在模板表达式中使用的简单函数，用于接受输入值并返回转换后的值。它们用管道符号(`|`)表示：

```html
<p>{{ today | date }}</p>
```

### 内置管道

Angular 提供了一系列内置管道：

1. **常用管道**：

   - `DatePipe`: 日期格式化 (`date`)
   - `UpperCasePipe`: 转大写 (`uppercase`)
   - `LowerCasePipe`: 转小写 (`lowercase`)
   - `CurrencyPipe`: 货币格式化 (`currency`)
   - `DecimalPipe`: 数字格式化 (`number`)
   - `PercentPipe`: 百分比格式化 (`percent`)

2. **高级管道**：
   - `JsonPipe`: 调试用 JSON 展示 (`json`)
   - `SlicePipe`: 数组/字符串截取 (`slice`)
   - `KeyValuePipe`: 对象转键值对 (`keyvalue`)
   - `AsyncPipe`: 自动处理异步数据 (`async`)

## 二、管道的基本使用

### 1. 链式管道

可以串联多个管道，数据会从左到右依次通过：

```html
<p>{{ 'angular pipes' | uppercase | titlecase }}</p>
<!-- 输出：Angular Pipes -->
```

### 2. 带参数的管道

许多管道接受参数来定制输出：

```html
<p>{{ 3.1415926 | number:'1.2-2' }}</p>
<!-- 输出：3.14 -->

<p>{{ 0.75 | percent }}</p>
<!-- 输出：75% -->

<p>{{ 1000 | currency:'CNY':'symbol':'4.2-2' }}</p>
<!-- 输出：CNY1,000.00 -->
```

### 3. AsyncPipe 的神奇用法

`AsyncPipe`可以自动订阅 Observable/Promise：

```typescript
// 组件中
time$ = interval(1000).pipe(map(() => new Date()));
```

```html
<!-- 模板中 -->
<p>当前时间: {{ time$ | async | date:'HH:mm:ss' }}</p>
```

## 三、创建自定义管道

### 1. 基本自定义管道

使用 Angular CLI 生成管道：

```bash
ng generate pipe truncate
```

实现一个简单的截断文本管道：

```typescript
@Pipe({ name: "truncate" })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20, ellipsis = "..."): string {
    return value.length > limit ? value.slice(0, limit) + ellipsis : value;
  }
}
```

使用示例：

```html
<p>{{ '这是一个很长的文本需要被截断' | truncate:10 }}</p>
<!-- 输出：这是一个很长的... -->
```

### 2. 支持国际化的管道

创建一个支持多语言的管道：

```typescript
@Pipe({ name: "i18n" })
export class I18nPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }
}
```

使用示例：

```html
<h1>{{ 'TITLE.WELCOME' | i18n }}</h1>
```

## 四、高级管道技巧

### 1. 纯管道 vs 非纯管道

- **纯管道(Pure Pipe)**：默认类型，仅当输入值变化时才执行
- **非纯管道(Impure Pipe)**：每次变更检测都会执行

```typescript
@Pipe({
  name: "filter",
  pure: false // 设置为非纯管道
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filterFn: (item: any) => boolean): any[] {
    return items.filter(filterFn);
  }
}
```

### 2. 性能优化技巧

1. 尽量使用纯管道
2. 对于大数据集，考虑在组件中预处理数据
3. 避免在模板中使用复杂计算

### 3. 管道与依赖注入

管道可以注入服务：

```typescript
@Pipe({ name: "formatPhone" })
export class FormatPhonePipe implements PipeTransform {
  constructor(private phoneService: PhoneService) {}

  transform(phone: string): string {
    return this.phoneService.format(phone);
  }
}
```

## 五、实战案例

### 1. 文件大小格式化管道

```typescript
@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  private units = ['B', 'KB', 'MB', 'GB', 'TB'];

  transform(bytes: number = 0, precision: number = 2): string {
    if (isNaN(bytes) return '?';

    let unitIndex = 0;
    while (bytes >= 1024 && unitIndex < this.units.length - 1) {
      bytes /= 1024;
      unitIndex++;
    }

    return `${bytes.toFixed(precision)} ${this.units[unitIndex]}`;
  }
}
```

### 2. 安全 HTML 渲染管道

```typescript
@Pipe({ name: "safeHtml" })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
```

## 六、常见问题解答

**Q1: 管道和方法调用有什么区别？**

- 管道是纯函数，适合简单转换
- 方法调用在每次变更检测都会执行，性能较低

**Q2: 什么时候应该创建自定义管道？**

- 当转换逻辑会在多个模板中复用时
- 当需要维护纯函数特性时
- 当转换逻辑较复杂但又不值得放在组件中时

**Q3: 管道能处理异步数据吗？**

- 可以，但应该使用内置的`AsyncPipe`
- 自定义管道处理异步数据较复杂，建议在组件中处理
