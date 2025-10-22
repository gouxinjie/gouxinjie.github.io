# knex

`Knex`是一个基于 `JavaScript` 的查询生成器，它允许你使用`JavaScript`代码来生成和执行 SQL 查询语句。

它提供了一种简单和直观的方式来与关系型数据库进行交互，而无需直接编写 SQL 语句。你可以使用 Knex 定义表结构、执行查询、插入、更新和删除数据等操作。

[knex 中文文档](https://knexjs.org/zh-CN/guide/query-builder.html)

## Knex 的安装和设置

用什么数据库安装对应的数据库就行了

```sh
#安装knex
$ npm install knex --save
#安装你用的数据库
$ npm install pg
$ npm install pg-native
$ npm install sqlite3
$ npm install better-sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install oracledb
$ npm install tedious
```

**连接数据库**

数据库配置文件：

```yaml
db:
  user: root
  password: "123456"
  host: localhost
  port: 3306
  database: xiaoman
```

`开始连接`

```sh
import knex from 'knex'
const db = knex({
    client: "mysql2",
    connection: config.db
})

```

## 定义表结构

```js
db.schema
  .createTable("list", (table) => {
    table.increments("id"); //id自增
    table.integer("age"); //age 整数
    table.string("name"); //name 字符串
    table.string("hobby"); //hobby 字符串
    table.timestamps(true, true); //创建时间和更新时间
  })
  .then(() => {
    console.log("创建成功");
  });
```

## 实现增删改查

```js
import mysql2 from "mysql2/promise";
import fs from "node:fs";
import jsyaml from "js-yaml";
import express from "express";
import knex from "knex";
const yaml = fs.readFileSync("./db.config.yaml", "utf8");
const config = jsyaml.load(yaml);
// const sql = await mysql2.createConnection({
//    ...config.db
// })
const db = knex({
  client: "mysql2",
  connection: config.db
});

const app = express();
app.use(express.json());

//查询接口 全部
app.get("/", async (req, res) => {
  const data = await db("list").select().orderBy("id", "desc");
  const total = await db("list").count("* as total");
  res.json({
    code: 200,
    data,
    total: total[0].total
  });
});

//单个查询 params
app.get("/user/:id", async (req, res) => {
  const row = await db("list").select().where({ id: req.params.id });
  res.json({
    code: 200,
    data: row
  });
});

//新增接口
app.post("/create", async (req, res) => {
  const { name, age, hobby } = req.body;
  const detail = await db("list").insert({ name, age, hobby });
  res.send({
    code: 200,
    data: detail
  });
});

//编辑
app.post("/update", async (req, res) => {
  const { name, age, hobby, id } = req.body;
  const info = await db("list").update({ name, age, hobby }).where({ id });
  res.json({
    code: 200,
    data: info
  });
});

//删除
app.post("/delete", async (req, res) => {
  const info = await db("list").delete().where({ id: req.body.id });
  res.json({
    code: 200,
    data: info
  });
});

const port = 4000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

## 事务

你可以使用事务来确保一组数据库操作的原子性，即要么全部成功提交，要么全部回滚

例如 A 给 B 转钱，需要两条语句，如果 A 语句成功了，B 语句因为一些场景失败了，那这钱就丢了，所以事务就是为了解决这个问题，要么都成功，要么都回滚，保证金钱不会丢失。

```js
//伪代码
db.transaction(async (trx) => {
  try {
    await trx("list").update({ money: -100 }).where({ id: 1 }); //A
    await trx("list").update({ money: +100 }).where({ id: 2 }); //B
    await trx.commit(); //提交事务
  } catch (err) {
    await trx.rollback(); //回滚事务
  }
});
```
