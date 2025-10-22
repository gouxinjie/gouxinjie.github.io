# URLSearchParams 获取参数

## 一、基本概念

`URLSearchParams` 是 **浏览器原生提供的接口**，用于操作 URL 中 `?key=value&key2=value2` 部分的查询参数。

特点：

1. 提供了 **读、写、删除、遍历** 查询参数的 API
2. 遵循 **URL 编码规范**，自动处理 `%20`、`+` 等转义字符
3. 与 `URL` 对象结合使用非常方便

浏览器兼容：

- 现代浏览器（Chrome、Firefox、Edge、Safari）都支持
- IE 不支持，需要 polyfill

## 二、创建 URLSearchParams

### 1️⃣ 从字符串创建

```js
const params = new URLSearchParams("foo=1&bar=2");
console.log(params.get("foo")); // "1"
console.log(params.get("bar")); // "2"
```

### 2️⃣ 从对象创建

```js
const params = new URLSearchParams({ foo: 1, bar: 2 });
console.log(params.toString()); // "foo=1&bar=2"
```

### 3️⃣ 从已有 URL 创建

```js
const url = new URL("https://example.com/?foo=1&bar=2");
const params = url.searchParams;
console.log(params.get("foo")); // "1"
```

## 三、常用方法

| 方法                  | 说明                 | 示例                                                 |
| --------------------- | -------------------- | ---------------------------------------------------- |
| `get(name)`           | 获取指定参数值       | `params.get('foo')` → `"1"`                          |
| `getAll(name)`        | 获取同名参数的所有值 | `foo=1&foo=2` → `params.getAll('foo')` → `["1","2"]` |
| `set(name, value)`    | 设置参数（覆盖原值） | `params.set('foo', 42)`                              |
| `append(name, value)` | 添加新值（不覆盖）   | `params.append('foo', 3)`                            |
| `delete(name)`        | 删除参数             | `params.delete('bar')`                               |
| `has(name)`           | 检查参数是否存在     | `params.has('foo')` → `true`                         |
| `toString()`          | 返回查询字符串       | `params.toString()` → `"foo=42&foo=3"`               |

## 四、遍历参数

```js
for (const [key, value] of params) {
  console.log(key, value);
}

// 或者使用 forEach
params.forEach((value, key) => {
  console.log(key, value);
});
```

## 五、修改 URL 的查询参数

```js
const url = new URL("https://example.com/?foo=1&bar=2");
url.searchParams.set("foo", "100");
url.searchParams.append("baz", "3");

console.log(url.toString());
// https://example.com/?foo=100&bar=2&baz=3
```
