# 循环中正确使用 await 处理异步操作（以批量加水印为例）

[[toc]]

## 前言

在实际开发中，我们经常会遇到「循环处理多个异步任务，并且要保证最终结果顺序」的场景。

典型例子：用户一次上传多张图片，需要对每张图片异步添加水印，然后再按原来的顺序上传到服务器。加水印是异步的，如果处理不当，就会出现顺序错乱、结果丢失、或者没有真正等待完成等问题。

常见处理方式有三种：

1. `forEach` + `async`（**不推荐**）
2. 普通 `for` / `for...of` + `await`（串行，推荐用于需要严格顺序的场景）
3. `Promise.all` + `map`（并行，推荐用于可并发的场景）

下面我们逐一分析，并给出正确写法。


## 1. forEach —— 最容易踩坑，不推荐

```js
const templateList = [];

this.fileList.forEach(async (item) => {
  if (!item.watermark) {
    const base64 = await this.base64AddWaterMaker(item.content, this.waterMakeConfig);
    const file = this.convertBase64UrlToBlob(base64);
    templateList.push({
      file,
      url: base64,
      watermark: true
    });
  } else {
    templateList.push(item);
  }
});

// 这里的代码会立刻执行，根本不会等上面的异步操作完成
console.log(templateList); // 大概率是空的，或者顺序错乱
```

### 为什么不行？

- `forEach` **不会等待**回调函数里的 Promise。
- 它只是同步地把所有异步任务“启动”出去，然后立即继续往下执行。
- `push` 的时机取决于哪个任务先完成，因此**结果顺序无法保证**。
- 外层代码也完全不知道这些异步任务什么时候全部结束。

**结论**：永远不要用 `forEach` + `async/await` 来控制顺序或等待全部完成。


## 2. 普通 for 循环 / for...of —— 串行执行（推荐）

这是最稳妥、最好理解的串行写法。每一张图片处理完，才会开始处理下一张，严格保证顺序。

```js
const templateList = [];

for (const item of this.fileList) {
  if (!item.watermark) {
    const base64 = await this.base64AddWaterMaker(item.content, this.waterMakeConfig);
    const file = this.convertBase64UrlToBlob(base64);
    templateList.push({
      file,
      url: base64,
      watermark: true
    });
  } else {
    templateList.push(item);
  }
}

// 这里可以安全地使用 templateList，顺序和原数组完全一致
```

### 优点
- 顺序严格保证
- 逻辑清晰，容易调试
- 对内存和 CPU 压力小（同一时间只处理一张）

### 缺点
- 速度较慢（必须一张一张等）

适合场景：对顺序有强要求、或者加水印操作本身比较重、不适合大量并发的情况。


## 3. Promise.all + map —— 并行执行（推荐）

如果加水印操作可以并发（大多数情况都可以），用 `Promise.all` 会快很多。

**关键点**：不要在回调里用 `push` 做副作用，而是**把结果 return 出去**，让 `Promise.all` 按原数组顺序收集结果。

```js
const templateList = await Promise.all(
  this.fileList.map(async (item) => {
    if (!item.watermark) {
      const base64 = await this.base64AddWaterMaker(item.content, this.waterMakeConfig);
      const file = this.convertBase64UrlToBlob(base64);
      return {
        file,
        url: base64,
        watermark: true
      };
    }
    return item;
  })
);

// templateList 的顺序和 this.fileList 完全一致
```

### 常见错误写法（顺序会乱）

```js
// ❌ 错误：push 是副作用，完成顺序不确定
const templateList = [];
await Promise.all(
  this.fileList.map(async (item) => {
    // ...await...
    templateList.push(...);  // 这里顺序会乱
  })
);
```

### 优点
- 并发执行，速度明显更快
- 最终结果顺序与原数组一致

### 缺点
- 同时处理的数量不受控制，图片很多或很大时可能造成卡顿或内存压力


## 串行 vs 并行，如何选择？

| 场景                         | 推荐方案                      | 说明                     |
|------------------------------|-------------------------------|--------------------------|
| 必须严格按顺序一个一个处理   | `for...of` + `await`         | 最稳妥                   |
| 可以并发，只要最终结果有序   | `Promise.all` + `map` 返回值 | 性能更好                 |
| 图片数量多，需要控制并发数   | 使用 `p-map` 或自己实现限流  | 生产环境更推荐           |
| 不关心顺序                   | 收集 Promise 后 `Promise.all`| 一般不推荐               |


## 进阶补充

### 1. 控制最大并发数（强烈推荐）

当图片较多时，建议限制同时处理的数量（比如最多 3~5 张），避免浏览器卡死。

可以使用 [p-map](https://github.com/sindresorhus/p-map) 库：

```js
import pMap from 'p-map';

const templateList = await pMap(
  this.fileList,
  async (item) => {
    if (!item.watermark) {
      const base64 = await this.base64AddWaterMaker(item.content, this.waterMakeConfig);
      const file = this.convertBase64UrlToBlob(base64);
      return { file, url: base64, watermark: true };
    }
    return item;
  },
  { concurrency: 3 }  // 最多同时处理 3 张
);
```

### 2. 错误处理

- **串行（for...of）**：某个失败后，后面的任务不会执行。
- **Promise.all**：一个失败，整个 Promise.all 都会 reject。
- 如果希望尽可能多成功，可以使用 `Promise.allSettled`。

### 3. 其他写法补充

- `for await...of`：主要用于异步迭代器场景。
- `Array.reduce` + `await`：也能实现串行，但可读性通常不如 `for...of`。


## 总结

1. **永远不要用 `forEach` + `async/await`** 来控制顺序或等待完成。
2. 需要严格串行 → 用 `for...of` + `await`。
3. 可以并发且要保持顺序 → 用 `Promise.all` + `map`，并且**返回结果**而不是用 `push`。
4. 生产环境建议加上并发数量限制（`p-map` 或自研限流）。

掌握以上写法后，再遇到「循环 + 异步 + 要保序」的需求，就能从容应对了。
