# 在map中使用async/await进行处理文件的操作


## 背景

在日常开发中 用户上传图片需要得到`文件的base64`格式进行回显；
当用户选择多个时，需要循环的调用file转base64的方法进行同步的获取；就会用到promsie；但在map循环的过程中使用`async await得到的是一个 promise对象并不是一个 ba64编码；`


解决方法：可以通过`Promise.all`方法进行解决

**file类型转base64的 方法使用了promise**

```javascript
/**
 * 将file文件转化为base64 使用promise
 * @param file 该文件的file类型
 */
export function fileTransferBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); //异步读取
      reader.readAsDataURL(file);
      // 成功和失败返回对应的信息，reader.result一个base64，可以直接使用
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      // 失败返回失败的信息
      reader.onerror = (error) => {
        console.warn('file文件转化为base64s失败：', error);
        reject(error);
      };
    });
}
```
**正确使用：**

fileList 是一个数组 里面是多个file文件类型；这里循环每个file并都放到一个对象里面，且还添加了一个content属性 （file的base64格式）

```javascript
 let base64List = await Promise.all(
        fileList.map(async (item) => {
          return { file: item, content: await fileTransferBase64(item) };
        })
      );
```

**错误使用：**

我刚开始也是这样直接用的，但返回的content是一个`【promise】对象`;没法用。大家注意一下不要再这样用了；

```javascript
 let base64List = fileList.map(async (item) => {
     return { file: item, content: await fileTransferBase64(item) };
 })

```
