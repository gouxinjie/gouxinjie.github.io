# css modules

## 什么是 css modules

因为 React 没有 Vue 的`Scoped`，但是 React 又是 SPA(单页面应用)，所以需要一种方式来解决 css 的样式冲突问题，也就是把每个组件的样式做成单独的作用域，实现样式隔离，而 css modules 就是一种解决方案，但是我们需要借助一些工具来实现;

比如 webpack，postcss，css-loader，vite 等。

## 如何在 Vite 中使用 css modules

css modules，可以配合各种 css 预处理去使用，例如 less，sass，stylus 等。

```js
npm install less -D # 安装less 任选其一
npm install sass -D # 安装sass 任选其一
npm install stylus -D # 安装stylus 任选其一
```

> [!TIP] 在 Vite 中 css Modules 是开箱即用的，只需要把文件名设置为 xxx.module.[css|less|sass|stylus]，就可以使用 css modules 了。

src/components/Button/index.module.scss

```scss
.button {
  color: red;
}
```

src/components/Button/index.tsx

```tsx
//使用方法，直接引入即可
import styles from "./index.module.scss";

export default function Button() {
  return <button className={styles.button}>按钮</button>;
}
```

编译结果, 可以看到 button 类名被编译成了 button_pmkzx_6，这就是 css modules 的实现原理，通过在类名前添加一个唯一的哈希值，来实现样式隔离。

```html
<button class="button_pmkzx_6">按钮</button>
```
