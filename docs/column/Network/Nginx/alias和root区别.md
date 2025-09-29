# Nginx 中 `alias` 和 `root` 的区别详解

[[toc]]

在使用 `Nginx` 部署前端项目或者静态资源时，经常会遇到一个问题：到底该用 `root` 还是 `alias`？

很多同学第一次写配置时，常常把这两个混用，导致请求路径解析错误，文件 `404`。本文就来详细讲解 **`root` 与 `alias` 的区别**，并通过案例帮你彻底搞懂。

## 1. 基本概念

- **`root`**：将 **请求路径** 拼接到 `root` 指定的目录下。
- **`alias`**：将 **location 匹配到的路径前缀** 替换为 `alias` 指定的目录。

一句话总结： 👉 `root` 是 **拼接路径**，`alias` 是 **路径替换**。

## 2. `root` 示例

```nginx
location /static/ {
    root /var/www/html;
}
```

请求：

```
http://example.com/static/logo.png
```

Nginx 的解析过程：

```
root = /var/www/html
location 匹配 /static/
请求路径 = /static/logo.png

最终文件路径 = /var/www/html/static/logo.png
```

✅ 注意：`/static/` 仍然会拼接到 `root` 后面。

## 3. `alias` 示例

```nginx
location /static/ {
    alias /var/www/images/;
}
```

请求：

```
http://example.com/static/logo.png
```

Nginx 的解析过程：

```
alias = /var/www/images/
location 匹配 /static/
去掉 /static/，剩下 /logo.png

最终文件路径 = /var/www/images/logo.png
```

✅ 注意：`/static/` 被完全替换成了 `/var/www/images/`。

## 4. 最常见的坑

很多人会这样写：

```nginx
location /static/ {
    root /var/www/images/;
}
```

然后请求：

```
http://example.com/static/logo.png
```

Nginx 实际解析：

```
最终路径 = /var/www/images/static/logo.png  ❌
```

因为 `root` 会把 **location 前缀** `/static/` 拼接到后面。正确写法应该是：

```nginx
location /static/ {
    alias /var/www/images/;
}
```

这样路径才是：

```
/var/www/images/logo.png ✅
```

## 5. 对比总结

| 特性     | root                           | alias                          |
| -------- | ------------------------------ | ------------------------------ |
| 作用方式 | 拼接请求路径                   | 替换 location 前缀             |
| 最终路径 | root + location + 请求剩余路径 | alias + 请求去掉 location 部分 |
| 常见用途 | 整个站点的根目录               | 单独路径映射到特殊目录         |
| 常见错误 | 多拼一层目录                   | 忘记在路径后加 `/`             |

## 6. 推荐使用场景

- **适合用 root**

  - 配置整个站点根目录：

    ```nginx
    server {
        root /var/www/html;
        location / {
            index index.html;
        }
    }
    ```

- **适合用 alias**

  - 配置子路径资源映射：

    ```nginx
    location /static/ {
        alias /var/www/project/static/;
    }
    ```

## 7. 总结

- `root` = **拼接路径**，常用于全局网站目录。
- `alias` = **替换路径**，常用于某个子路径单独映射。
- 如果要把 `/static/` URL 对应到 `/var/www/images/` 目录，记得用 **alias**。
- 如果要整个站点都从 `/var/www/html` 提供，记得用 **root**。

👉 口诀：

> **root 拼接，alias 替换。**
