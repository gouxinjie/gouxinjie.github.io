# split 函数的和 join 函数的区别

---

`split` 方法和 `join` 方法是 `JavaScript` 中用于字符串操作的两个方法，它们的区别如下：

1. **功能**：`split` 方法用于将字符串分割成数组，而 `join` 方法用于将数组连接成字符串。
2. **参数**：`split` 方法接受一个参数，即分隔符，用于指定分割字符串的位置。`join` 方法接受一个参数，即连接符，用于指定连接数组元素的字符。
3. **返回值**：`split` 方法返回一个数组，其中包含分割后的字符串。`join` 方法返回一个字符串，其中包含连接后的数组元素。

## 1，split

**使用场景：**

1. **字符串解析**：当需要将一个具有特定分隔符的字符串拆分成一个数组时，`split` 方法非常有用。（例如，将逗号分隔的字符串转换为数组，用于处理数据。）
2. **处理格式化的文本**：如从一段有规律格式的文本中提取特定部分。
3. **按特定规则分割字符串**：根据多个字符、正则表达式等规则进行分割。

```js
let str = "apple,banana,cherry";
let fruits = str.split(","); // ["apple", "banana", "cherry"]

let dateStr = "2024-07-16";
let parts = dateStr.split("-"); // ["2024", "07", "16"]

let strWithSpaces = "Hello World";
let words = strWithSpaces.split(/\s+/); // ["Hello", "World"]
```

## 2，join

**使用场景：**

1. **数组转字符串**：需要将数组元素组合成一个字符串时使用据.
2. **自定义连接符**：可以指定连接数组元素的字符或字符串。
3. **数据格式化输出**：将数组元素按照特定格式输出为字符串。

```js
let arr = [1, 2, 3, 4, 5];
let str = arr.join(","); // "1,2,3,4,5"

let names = ["Alice", "Bob", "Charlie"];
let joinedNames = names.join(" - "); // "Alice - Bob - Charlie"
```

4. 获取一个 url 并把上面的多个参数提取出来，以对象的形式储存 如：` [{token：123} {policyNo:456}]`

```js
// 获取到的url链接
const url = 'http://localhost:8080?token=123&policyNo=456'
 第一步：获取后半部分
// url.split("?") = [ 'http://localhost:8080', 'token=123&policyNo=456' ]   要取第1项
const params = url.split('?')[1]// 第1项为：token=123&policyNo=456

第二步：按照&符号分割开来
const params_split = params.split('&')
// console.log("params_split:",params_split);

第三步：循环每一项，再次通过等号进行分割
等号左边为键，右边为值；最后储存到一个数组中
let arr = []
params_split.forEach((item) => {
    let obj = {}
    bj[item.split('=')[0]] = item.split('=')[1]
    arr.push(obj)
})
console.log('arr:', arr)
结果如下：
arr: [ { token: '123' }, { policyNo: '456' } ]


```
