## 关于循环中有 await 等待异步操作的情况

**前言：**

关于循环中有 await 等待异步操作的情况：

::: tip 循环添加水印按照顺序例如：有上传多个文件的需求，要求上传的时候要求对每一张图片打水印操作，但是打水印这个操作是异步的，想要保证图片上传的顺序和上传完成的结果；需要我们在循环中使用 await 等待这些异步操作，保证他们是按照顺序依次执行完成的。研究下来会有以下几种处理方法：

1，使用 forEach()循环 -- 注意：此方法不支持 还是异步循环的

2，普通的 for 循环

3，利用 promise.all()方法 

:::

## 1，forEach() -不推荐

这里请谨慎使用 forEach，处理的结果是异步的（顺序是乱的），达不到预期效果；原理暂不清楚；

```javascript
let templateList = []; //存储临时文件列表
this.fileList.forEach(async (item, index) => {
  if (!item.watermark) {
    // 开始加水印
    let base64 = await this.base64AddWaterMaker(newValue[index].content, this.waterMakeConfig);
    // 把base64转为文件类型 用于后续上传到后端
    let file = this.convertBase64UrlToBlob(base64);
    templateList.push({
      file,
      url: base64, // 图片的base64
      watermark: true //水印标识
    });
  } else {
    templateList.push(item);
    console.log("已经添加过水印");
  }
});
```

## 2，for循环 -推荐

```javascript
let templateList = []; //存储临时文件列表
let newValue = this.fileList;
for (let index = 0; index < newValue.length; index++) {
  // 说明没有添加水印
  if (!newValue[index].watermark) {
    // 开始加水印
    let base64 = await this.base64AddWaterMaker(newValue[index].content, this.waterMakeConfig);
    // 把base64转为文件类型 用于后续上传到后端
    let file = this.convertBase64UrlToBlob(base64);
    templateList.push({
      file,
      url: base64, // 图片的base64
      watermark: true //水印标识
    });
  } else {
    // 已经添加水印的会自动排在最前面
    templateList.push(newValue[index]);
    console.log("已经添加过水印");
  }
}
```

## 3，promise.all()方法 -推荐

promise.all()方法：`接收的是一个promise数组，是按顺序执行并且同步执行的`。

使用如下：

```javascript
let templateList = []; //存储临时文件列表
await Promise.all(
  newValue.map(async (item, index) => {
    if (!item.watermark) {
      // 开始加水印
      let base64 = await this.base64AddWaterMaker(newValue[index].content, this.waterMakeConfig);
      // 把base64转为文件类型 用于后续上传到后端
      let file = this.convertBase64UrlToBlob(base64);
      templateList.push({
        file,
        url: base64, // 图片的base64
        watermark: true //水印标识
      });
    } else {
      templateList.push(item);
      console.log("已经添加过水印");
    }
  })
);
```
