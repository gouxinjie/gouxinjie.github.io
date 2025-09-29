# Nginx 中 `location` 配置详解

[[toc]]

在前端项目上线时，我们经常需要对 **静态资源（HTML、CSS、JS、图片、字体等）** 做缓存优化。在 `Nginx` 配置里，经常会看到这样的写法：

```nginx
# 静态资源目录
location ~* \.(html|htm|gif|jpg|jpeg|bmp|png|ico|txt|js|css|woff|ttf)$ {
    root /var/www/static;
    expires 30d;  # 缓存30天
    access_log off;
}

# 静态资源缓存控制
location ~* \.(jpg|png|gif)$ {
    expires 365d;
    add_header Cache-Control "public, no-transform";
}
```

很多小伙伴第一次看到这种配置，都会有疑问：

- `location ~*` 是什么语法？
- `\.(jpg|png|gif)$` 这种正则怎么理解？
- 为什么要分开两个规则？

下面详细讲解。

## 1. `location` 指令回顾

在 `Nginx` 中，`location` 用于匹配请求的 URL，决定如何处理请求。常见的匹配方式有：

- **前缀匹配**（最常见）：

  ```nginx
  location /static/ {
      root /var/www/html;
  }
  ```

  匹配 `/static/` 开头的请求。

- **精确匹配**：

  ```nginx
  location = /index.html {
      root /var/www/html;
  }
  ```

  只匹配 `/index.html`。

- **正则匹配**：

  ```nginx
  location ~ \.php$ {
      fastcgi_pass 127.0.0.1:9000;
  }
  ```

  匹配 `.php` 结尾的请求。

## 2. `location ~*` 语法

- `~`：表示使用 **正则匹配**，区分大小写。
- `~*`：表示使用 **正则匹配，不区分大小写**。

举个例子：

```nginx
location ~ \.jpg$   # 区分大小写，logo.JPG 不会匹配
location ~* \.jpg$  # 不区分大小写，logo.JPG 也能匹配
```

因此，`location ~* \.(jpg|png|gif)$` 表示：匹配 **以 .jpg 或 .png 或 .gif 结尾的请求（不区分大小写）**。

## 3. 配置一：通用静态资源目录

```nginx
location ~* \.(html|htm|gif|jpg|jpeg|bmp|png|ico|txt|js|css|woff|ttf)$ {
    root /var/www/static;
    expires 30d;
    access_log off;
}
```

### 解释：

1. `~* \.(html|htm|gif|...)$`

   - 匹配常见的静态资源扩展名：网页、图片、文本、JS、CSS、字体等。
   - **作用：全局规则，一网打尽常见静态资源**。

2. `root /var/www/static;`

   - 静态文件所在目录。
   - 请求 `/main.css` → 实际读取 `/var/www/static/main.css`

3. `expires 30d;`

   - 设置缓存时间为 30 天。
   - 浏览器收到响应头：

     ```
     Cache-Control: max-age=2592000
     Expires: <30天后日期>
     ```

4. `access_log off;`

   - 关闭访问日志，减少日志文件体积，优化性能。

## 4. 配置二：单独优化图片缓存

```nginx
location ~* \.(jpg|png|gif)$ {
    expires 365d;
    add_header Cache-Control "public, no-transform";
}
```

### 解释：

1. `~* \.(jpg|png|gif)$`

   - 匹配所有 **图片资源**（不区分大小写）。

2. `expires 365d;`

   - 设置缓存时间为 **一年**。

3. `add_header Cache-Control "public, no-transform";`

   - `public`：允许任何中间代理（如 CDN）缓存该资源。
   - `no-transform`：禁止代理或浏览器对图片进行格式转换或压缩，保证原图质量。

👉 为什么要单独写？

- 图片体积大，通常不常变动，适合长时间缓存。
- JS/CSS 更新频率高，缓存过久可能导致版本问题，因此只给 30 天。

## 5. 两个配置的区别

| 配置   | 匹配范围                    | 缓存策略               | 应用场景               |
| ------ | --------------------------- | ---------------------- | ---------------------- |
| 配置一 | html, js, css, 图片, 字体等 | 缓存 30 天             | 整站通用静态资源       |
| 配置二 | 图片 (jpg/png/gif)          | 缓存 365 天 + CDN 优化 | 针对图片资源的专项优化 |

实际项目里，两者会 **同时存在**。

- 优先匹配更具体的规则（比如图片走 365d）。
- 其他资源走默认的 30d。

## 6. 总结

- `location ~*` = 使用正则匹配，不区分大小写。
- `\.(xxx|yyy)$` = 匹配以指定扩展名结尾的文件。
- 可以为不同类型的资源设置不同的缓存策略。

  - HTML/JS/CSS → 短缓存（30d）
  - 图片/字体 → 长缓存（365d，immutable）

- 这样既能提高性能，又能避免缓存导致的版本问题。

---

✍️ **一句话记忆**：

> `location ~*` = 不区分大小写的正则匹配，常用于静态资源缓存控制。
