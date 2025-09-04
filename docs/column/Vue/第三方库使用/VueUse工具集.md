# vue3 项目中使用 VueUse 工具集

## 一、介绍

`VueUse 是基于 Vue Composition API `的实用函数集合，它提供了一组轻量级但功能强大的工具函数。这些工具函数可以用于处理常见的 `JavaScript` 任务，如处理状态、处理异步操作等。

## 二、安装

可以通过 npm 或 yarn 来安装 `VueUse`

```shell
npm install @vueuse/core
# or
yarn add @vueuse/core
```

## 三、使用

在 Vue3 项目中使用 `VueUse` 非常简单。首先，需要导入所需的工具函数并使用它们：

### 3.1 使用 useDebounceFn 进行防抖处理

```js
<div><input type="text" @input="debounceSearchChange" /></div>

import { useDebounceFn } from '@vueuse/core'
const debounceSearchChange = useDebounceFn(inputChange, 1000);

function inputChange(event) {
  let value = event.target.value;
  console.log("value", value);
}

```

上面代码的意思是，当用户输入时，每 1000 毫秒执行一次 inputChange 函数。

### 3.2 使用 useClipboard 进行文本复制

```js
<el-button type="primary" @click="clipBoard"> 点击复制</el-button>

import { useDebounceFn, useClipboard } from "@vueuse/core";
const { text: copiedText, isSupported, copy, copied } = useClipboard();

function clipBoard(){
  copy('复制成功')
}

```

上面代码的意思是，当用于点击复制按钮时，会成功复制 copy 函数里面的值。

以下是对 `text: copiedText, isSupported, copy, 和 copied `这几个属性和方法的详细解释：

::: tip 属性解释 1，**text:** copiedText：这是一个响应式引用（ref），用于存储最近一次成功复制到剪贴板的文本内容。

2，**isSupported:** 这是一个布尔值，表示当前浏览器是否支持 Clipboard API。在执行复制操作之前，你可以检查 isSupported 来确保用户的浏览器支持该功能

3，**copy**：这是一个异步函数，用于将给定的文本复制到剪贴板。

4，**copied**：这是一个响应式引用（ref），表示最近一次复制操作的状态。通常用于指示复制操作是否成功。 

:::

### 3.3 开启全屏模式

```js
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();
```

`isFullscreen`:当前是否处于全屏模式。

`toggle`是一个函数：用于切换全屏模式，如果 `isFullscreen` 为` true`，则退出全屏模式；否则进入。

### 3.4 更多使用

`VueUse` 提供了许多其他有用的工具函数，如`useLocalStorage、useSessionStorage、useFetch` 等。

可以在官方文档中找到这些函数的详细信息和使用方法：https://vueuse.org/
