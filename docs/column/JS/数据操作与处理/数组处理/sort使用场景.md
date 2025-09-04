# sort方法的每个使用场景
___

**`arrayObject.sort(sortby)`**

 - 参数：`sortby` 是一个函数用来定义排序规则（正序、倒序、按字段排序）；
 - 无参数时，默认为正序排序（数值数组按数值正序，字符串数组按字符正序）；
 - 返回值：对数组的引用，会改变原数组；

**要实现不同的排序方式，只需实现sort的输入参数函数即可，a - b 是正序；b - a 是倒序；**

## 下面是日常工作中比较常用的案例：

### 1，按照id排序（正序和倒序）

```javascript
list = [
    { id: 1, createTime: '2000-1-20 12:11:40', title: '阿-续费视频通知需求' },
    {
        id: 3,
        createTime: '2001-1-20 12:11:40',
        title: '贝-视频通知需求',
    },
    {
        id: 2,
        createTime: '2004-1-20 12:11:40',
        title: '多-频通知需求',
    },
    {
        id: 4,
        createTime: '2003-1-20 12:11:40',
        title: '通知需求',
    },
    {
        id: 5,
        createTime: '2008-1-20 12:11:40',
        title: '需求',
    },
]
// 这是按照 id 的升叙排序
 let idList2 = list.sort((a,b)=>{
     return a.id - b.id
 })
 console.log(idList2);
 结果如下：
 [
  { id: 1, createTime: '2000-1-20 12:11:40', title: '阿-续费视频通知需求' },
  { id: 2, createTime: '2004-1-20 12:11:40', title: '多-频通知需求' },
  { id: 3, createTime: '2001-1-20 12:11:40', title: '贝-视频通知需求' },
  { id: 4, createTime: '2003-1-20 12:11:40', title: '通知需求' },
  { id: 5, createTime: '2008-1-20 12:11:40', title: '需求' }
]

// 这是按照 id 的倒序排序
 let idList = list.sort((a,b)=>{
      return b.id - a.id
  })
  console.log(idList);
   结果如下：
[
  { id: 5, createTime: '2008-1-20 12:11:40', title: '需求' },
  { id: 4, createTime: '2003-1-20 12:11:40', title: '通知需求' },
  { id: 3, createTime: '2001-1-20 12:11:40', title: '贝-视频通知需求' },
  { id: 2, createTime: '2004-1-20 12:11:40', title: '多-频通知需求' },
  { id: 1, createTime: '2000-1-20 12:11:40', title: '阿-续费视频通知需求' }
]
```
### 2，按照时间进行排序 从大到小（正序和倒序）

```javascript
//  时间升序进行排序 从大到小  Data.parse() 输出从 1970/01/01 到一个具体日期的毫秒数
let dataListDown = list.sort(function (a, b) {
    if (a.createTime && b.createTime) {
        return Date.parse(a.createTime) - Date.parse(b.createTime)
    }
    return -1
})
console.log(dataListDown)
结果如下：
[
  { id: 1, createTime: '2000-1-20 12:11:40', title: '阿-续费视频通知需求' },
  { id: 3, createTime: '2001-1-20 12:11:40', title: '贝-视频通知需求' },
  { id: 4, createTime: '2003-1-20 12:11:40', title: '通知需求' },
  { id: 2, createTime: '2004-1-20 12:11:40', title: '多-频通知需求' },
  { id: 5, createTime: '2008-1-20 12:11:40', title: '需求' }
]
// 时间倒序 Data.parse() 输出从 1970/01/01 到一个具体日期的毫秒数
let dataList = list.sort(function (a, b) {
    if (a.createTime && b.createTime) {
        return Date.parse(b.createTime) - Date.parse(a.createTime)
    }
    return '条件不够不能排序'
})
console.log(dataList)
结果如下：
[
  { id: 5, createTime: '2008-1-20 12:11:40', title: '需求' },
  { id: 2, createTime: '2004-1-20 12:11:40', title: '多-频通知需求' },
  { id: 4, createTime: '2003-1-20 12:11:40', title: '通知需求' },
  { id: 3, createTime: '2001-1-20 12:11:40', title: '贝-视频通知需求' },
  { id: 1, createTime: '2000-1-20 12:11:40', title: '阿-续费视频通知需求' }
]
```
### 3，按照中文进行排序 （升序和倒序）

```javascript
// 按照中文升序进行排序  汉字拼音顺序进行排序的 比如：阿贝多（本身就是升序）
 let cnList = list.sort(function (a, b) {
     return a.title.localeCompare(b.title)
 })
 console.log(cnList)
 结果如下：
[
  { id: 1, createTime: '2000-1-20 12:11:40', title: '阿-续费视频通知需求' },
  { id: 3, createTime: '2001-1-20 12:11:40', title: '贝-视频通知需求' },
  { id: 2, createTime: '2004-1-20 12:11:40', title: '多-频通知需求' },
  { id: 4, createTime: '2003-1-20 12:11:40', title: '通知需求' },
  { id: 5, createTime: '2008-1-20 12:11:40', title: '需求' }
]

// 按照中文倒序进行排序 同上
let cnList = list.sort(function (a, b) {
    return b.title.localeCompare(a.title)
})
console.log(cnList)
结果如下：
[
  { id: 5, createTime: '2008-1-20 12:11:40', title: '需求' },
  { id: 4, createTime: '2003-1-20 12:11:40', title: '通知需求' },
  { id: 2, createTime: '2004-1-20 12:11:40', title: '多-频通知需求' },
  { id: 3, createTime: '2001-1-20 12:11:40', title: '贝-视频通知需求' },
  { id: 1, createTime: '2000-1-20 12:11:40', title: '阿-续费视频通知需求' }
]

```