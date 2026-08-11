# webpack 的基本使用和总结

[[toc]]

## 1，webpack 概念

**什么是 webpack**

1.  Webpack 前端资源模块化管理和打包工具。可以将许多松散的模块按照依赖和引用关系打包成符合生产环境部署的前端资源。并将按需加载的模块进行代码分隔，等到实际需要的时候再加载。

2.  webpack 运行在 node 环境上的一个包；webpack 可以把前端的任何资源, 当做模块, 来进行打包整合, 也可以支持不同的代码(ES6 模块代码, CSS 文件, LESS 文件, 图片....) 编写前端代码后, 可以被 webpack 打包整合, 运行在浏览器上；

## 2，为什么学 webpack

1.  开发的时候需要一个开发环境，要是我们修改一下代码保存之后浏览器就自动展现最新的代码那就好了；
2.  ​ 本地写代码的时候，要是调后端的接口不跨域就好了（代理服务）；
3.  为了跟上时代，要是能用上什么 ES6 等新东西就好了（翻译服务）；
4.  项目要上线了，要是能一键压缩代码啊图片什么的就好了（压缩打包服务）；

## 3，webpack 特点

1.  丰富的插件，流行的插件, 方便进行开发工作；
2.  大量的加载器，便于处理和加载各种静态资源；
3.  将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载；

## 4，相对于其他工具优点

相对于其他模块打包工具(Grant/Gulp)优势,

1. Webpack 以 CommonJS 的形式来书写脚本，对 AMD / CMD / ES6 模块 的支持也很全面，方便旧项目进行代码迁移。所有资源都能模块化；
2. 开发便捷，能替代 Grunt / Gulp 的工作，比如打包 js/css、打包压缩图片、CSS 分离, 代码压缩等。扩展性强，插件机制完善，支持模块热替换等；

## 5，准备工作

**1，安装 node 和 npm** 

node 是 nodejs 运行的环境, npm 是安装 node 一起安装的包管理器的工具, 可以方便的管理我们需要的所有第三方依赖包

**2，安装 webpack 模块**

​webpack 通常使用 npm 包管理工具进行安装。现在 webpack 对外公布的稳定版本是 webpack4；全局安装 webpack 命令：`npm install webpack -g`

| 命令 | 安装环境 | 备注 |
| --- | --- | --- |
| npm view webpack versions --json | 不安装, 查看 | 查看现在所有 webpack 模块的版本号 |
| npm install webpack -g | -g 全局安装CssList | 在全局安装 webpack在电脑就可以使用 webpack 命令了(工具类模块要全局) |
| webpack -v | 不安装, 查看全局 webpack 版本号(注意, webpack4.x 版本, 还要安装 webpack-cli 工具才可以运行此命令) | 可能出现的问题: 1. webpack 不是内部或外部命令(证明你全局安装失败/计算机的环境变量 node 的配置失效) |

**3，安装 webpack-cli 工具包** ​ 

webpack 的命令, 大多都会执行 webpack-cli 里的 Api 方法, 来实现具体的功能效果, 所以 webpack4.x 版本需要在全局安装此模块, 而 webpack3.x 没有抽离出来那些 API 方法, 所以 webpack3.x 则不需要安装此模块；

​ 命令: `npm i webpack-cli -g`

​ 注意 webpack4 配合 webpack-cli3.x 版本

**4，两种环境讲解**

- 本地开发环境(development): 我们在本地写代码的时候；
- 线上发布环境(production): 我们在本地开发完代码, 进行打包后, 对外的环境；

## 6，webpack 的核心介绍

**1，重点说明：webpack.config.js 文件**

​ Webpack 为开发者提供了程序打包的配置信息入口，让开发者可以更好的控制, 管理程序的打包过程与最后程序的输出结果。默认的 webpack 配置文件是 webpack.config.js, 运行 webpack 打包命令, 会自动查看运行命令时, 所在目录下的 webpack.config.js 文件；

> 注意: webpack4.x 版本可以省略这个文件, webpack3.x 版本是必须声明此文件的

 **2，核心概念讲解** 
 
官网链接: https://www.webpackjs.com/concepts/

| webpack的概念名 |                             解释                             |
| :-------------: | :----------------------------------------------------------: |
|    入口起点     | 基础目录, 指定了"./src"目录, 那么下面所有的配置中使用的相对路径, 都是以src为起点 |
|      入口       | 入口起点指示 webpack 应该使用哪个模块来作为构建其内部*依赖图*的开始进入起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的 |
|      出口       | output告诉 webpack 在哪输出它所创建的结果及如何命名文件，默认值为 `./dist` |
|     加载器      | loader 让 webpack 能去处理非 JavaScript 文件(webpack 自身只理解 JavaScript）loader 可以将所有类型的文件转换为webpack 能够处理的有效模块 然后你就可以利用 webpack 的打包能力，对它们进行处理。 |
|      插件       | loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。 插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。[插件接口](https://www.webpackjs.com/api/plugins)功能极其强大，可以用来处理各种各样的任务。 |
|      模式       | 通过选择 `development` 或 `production` 之中的一个，来设置 `mode` 参数，你可以启用相应模式下的 webpack 内置的优化 |



**3，配置文件参数讲解** 

官网链接: https://www.webpackjs.com/configuration/ 

| 键名    | 概念        | 解释                                                         |
| ------- | ----------- | ------------------------------------------------------------ |
| context | 入口起点    | 基础目录，**绝对路径**，用于从配置中解析入口起点(entry point) |
| entry   | 入口 (必须) | 配置打包入口文件的名字                                       |
| output  | 出口 (必须) | 打包后输出到哪里, 和输出的文件名                             |
| module  | 加载器配置  | 在rules对应数组中, 定义对象规则                              |
| plugins | 插件配置    | 配置插件功能                                                 |
| mode    | 模式        | 选择线上/线下环境模式                                        |
| devtool | 开发工具    | 如何生成 source map, 记录代码所在文件的行数 (调试方式)       |


## 7，webpack 使用 - 打包 js 代码

**1，打包 js 代码**

1. 准备前端模块 js 文件, 和主入口文件 main.js(名字自定义), 在主入口文件里使用前端封装的模块
2. 在当前工程目录中声明 webpack.config.js 的 webpack 配置文件, 并且填入配置对象信息(入口+出口必须的)
   - dist 不存在会自动创建
   - output.path 的值必须是绝对路径 (因为 webpack 是从全局开始创建 dist 目录, 所以必须从全局出发)
3. 在当前工程目录中执行 webpack 打包命令, 查看出口生成的打包后的 js 文件
4. 自己新建 index.html 文件引入打包后的 js, 执行查看效果

> webpack 命令会自动查找当前命令所在目录下的 webpack.config.js 配置文件, 根据配置文件进行代码的打包

**2，单入口--单出口**

1. 单个入口, 可以引入很多个要使用的模块部分, 单入口(指的是打包时候指定的入口文件)
2. 单个出口, 指的打包所有 js, 最后要输入到一个单独的.js 文件当中使用

```javascript
module.exports = {
  context: __dirname + "/src", // 拼接src的绝对路径, context设置入口的文件前缀, 代表入口要从这个文件夹开始寻找 (必须是绝对路径) __dirname: 指的当前文件所在文件夹的路径路径
  entry: "./main.js",
  output: {
    path: __dirname + "/dist", // 给我输出到同级下的dist目录中(如果没有会自动创建)
    filename: "bundle.js" // 输出js文件的名字
  }
};
```

**3，多入口--单出口**

1，多入口: 告诉 webpack, 去哪些文件里进行打包

```javascript
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: ["./main.js", "./center.js"], // 设置多入口文件路径
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  }
};
```

**4，多入口--多出口**

```javascript
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    first: "./main.js",
    second: "./center.js"
  }, // 如果是多入口单出口用数组结构, 如果是多入口, 多出口用对象结构, 而且key值是打包后的文件名
  output: {
    path: __dirname + "/dist",
    filename: "[name].js" // [name]是webpack内置的字符串变量, 对应entry里每个key
  }
};
```

## 8，打包 css 代码

1. 需要下载 2 个加载器模块 (目的是为了让 webpack 认识 css 文件)
   - css-loader: 接收一个 css 文件, 并且解析 import 方式 下载 cssloader 的时候 降低一个版本 @3 下载的版本是 3.6
   - style-loader: 接收 css 代码, 并且将其注入到 html 网页中的
2. 在 webpack.config.js 中, 加载器配置：

```javascript
module: {
  // 对加载器进行配置
  rules: [
    // 加载器的使用规则
    {
      // 独立的规则对象
      test: /\.css$/, // 以.css结尾的文件类型
      use: ["style-loader", "css-loader"] // 使用哪些加载器进行转换
      // 注意:  2个加载器的顺序, 默认是从右往左进行使用
    }
  ];
}
```

3. 在入口文件引入 css 模块

```javascript
import "./style/home.css"; // 注意无需用变量接收
```

4. 会把 css 代码以字符串的形式, 打包进 js 文件当中

5. 在 dist 下新建 index.html, 只要引入打包后的 bundle.js, 来查看 css 代码被打包进 js 的效果即可

## 9，生成 html 文件

1. 需要下载 1 个插件模块
   - html-webpack-plugin: [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin)简化了 HTML 文件的创建，你可以让插件为你生成一个 HTML 文件，使用默认模板, 或使用你自己指定的模板
2. webpack.config.js 插件配置

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
plugins: [
  // 配置各种插件
  new HtmlWebpackPlugin({
    // 插件配置对象
    title: "webpack ldx使用",
    filename: "index.html", // 产出文件名(在dist目录查看)
    template: __dirname + "/index.html", // 以此文件来作为基准(注意绝对路径, 因为此文件不在src下)
    inject: true, // 代表打包后的资源都引入到html的什么位置
    favicon: "./assets/favicon.ico", // 插入打包后的favicon图标
    // base: "./", // html网页中所有相对路径的前缀 (一般不给/给./, 虚拟路径)
    // 控制html文件是否要压缩(true压缩, false不压缩)
    minify: {
      //对html文件进行压缩，
      collapseBooleanAttributes: true, //是否简写boolean格式的属性如：disabled="disabled"简写为disabled
      collapseWhitespace: true, //是否去除空格，默认false
      minifyCSS: true, //是否压缩html里的css（使用clean-css进行的压缩） 默认值false
      minifyJS: true, //是否压缩html里的js（使用uglify-js进行的压缩）
      removeAttributeQuotes: true, //是否移除属性的引号 默认false
      removeComments: true, //是否移除注释 默认false
      removeCommentsFromCDATA: true, //从脚本和样式删除的注释, 默认false
      useShortDoctype: true //使用短的文档类型，将文档转化成html5，默认false
    }
  }) // 数组元素是插件new对象
];
```

3. src/index.html 静态网页模板
4. 执行 webpack 打包命令, 观察在 dist 生成的目录中, 是否新增了 xxx.html 文件, 并且会自动引入所有需要的外部资源

**报错**

> Cannot find module "webpack/lib/node/NodeTeplatePlugins"

在安装 html-webpack-plugin 插件的工程中, 单独的在本地安装一下跟全局 webpack 对应的版本

**插件配置项如下:**

| 选项 key | 值类型 | 默认值 | 解释 |
| --- | --- | --- | --- |
| title | String | Webpack App | 在生成 html 网页中title标签里的内容 (如果指定 template 选项, 则此选项失效 |
| filename | String | index.html | 生成的 html 网页文件的名字 (也可以设置目录+名字) |
| template | String |  | 以哪个现有的 html 文件作为基础模板, 在此模板的基础上, 生成 html 网页文件 |
| inject | Boolean/String | true | 值的范围(true \|\| 'head' \|\| 'body' \|\| false) true/'body' -> script 等引入代码, 放到 body 标签内部末尾 'head'/false -> script 等引入代码, 放到 head 标签内部末尾 |
| favicon | String |  | 将制定 favicon.ico 图标的路径, 插入到 html 网页中去 |
| base | String |  | 制定 html 中所有相对路径, 都以它的值为出发起点, 例如: base 的值为/bar/, 那么你 HTML 网页里的 img, src="my.img", 那实际上去找的路径其实是 /bar/my.img |
| minify | Boolean | 看 mode 的值 | 是否压缩 html 代码, 如果 mode 为'production', 那么 minify 的值为 true, 否则为 false |

## 10，分离 css 代码

1. 需要引入 1 个插件模块,
   - extract-text-webpack-plugin 使用下一个版本@next 会将所有的入口中引用的`*.css`，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS 中，而是会放到一个单独的 CSS 文件中。如果你的样式文件较大，这会做更快加载，因为 CSS 会跟 JS 并行加载。
   - 此插件没有压缩 css 代码的功能

2. webpack.config.js 加载器修改

```javascript
const ExtractTextPlugin = require("extract-text-webpack-plugin");
rules: [
  // 加载器的使用规则
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      // 从一个已存在的 loader 中，创建一个提取(extract) loader。
      fallback: "style-loader", // 应用于当CSS没有被提取(正常使用use:css-loader进行提取, 如果失败, 则使用fallback来提取)
      use: "css-loader" // loader被用于将资源转换成一个CSS单独文件
    })
  }
];
```

3. 插件配置: 其他选项默认即可

   ```javascript
   new ExtractTextPlugin("style.css"), // 输出的文件名
   ```

4. 在 dist 打包生成的目录中, 就会分离出单独的.css 文件

**报错**

> Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead

"extract-text-webpack-plugin": "^3.0.2" 此插件 3.x 版本对应 webpack3.x, 所以我们需要更高的 extract 版本, 所以下载 extract-text-webpack-plugin@next (@next 下载下一个内测最新版)

## 11，打包 less

1. 需要安装 less 和 less-loader 来解析 less 代码, 和加载 less 文件

   ​ npm install less

   ​ npm install less-loader

2. 在 webpack.config.js 中 配置加载器, 解析.less 文件

   ```js
   {
   	test: /\.less$/,
   	use: ['style-loader', 'css-loader', "less-loader"]
   }
   ```

3. 但是这样发现 css 代码没有分离出来, 所以还需要使用 extract-text-webpack-plugin 的配置, 分离出 css 代码

   ```js
   {
   	test: /\.less$/,
   	use: ExtractTextPlugin.extract({
   		fallback: "style-loader",
   		use: ['css-loader', "less-loader"]
   	})
   }
   ```

4. 观察打包后 style.css 中多了 less 文件里的样式代码

## 12，集成 postcss

### 1，什么是 postcss

是一个转换 CSS 代码的工具和插件 (postcss 转换 css 代码, 为了兼容不同的浏览器) 类似于 babel.js 把浏览器不兼容的 js 转换成兼容的 js 代码 (babel 转换 js 代码, 为了兼容不同浏览器) 注意它本身是一个工具, 和 less/sass 等预处理器不同, 它不能处理 css 代码而是靠各种插件来支持 css 在不同浏览器和环境下正确运行的

- 增加可读性, 会自动帮你添加特定浏览器厂商的前缀 (插件: **autoprefixer**)
- px 单位自动转 rem (插件: **postcss-pxtorem**)

1. 先下载 postcss-loader 和 postcss 到当前工程中 npm install postcss npm install postcss-loader@3

- postcss: 集成这个工具, 可以让它发挥它集成的翻译 css 的插件
- postcss-loader: 对 css 文件进行处理

2. 新建 webpack.config.js 同级的 postcss.config.js 配置文件
3. 去 webpack.config.js 中, 把 postcss 使用到 css 相关的加载器中

```js
{
	test: /\.css$/,
	use: ExtractTextPlugin.extract({
		fallback: "style-loader",
		use: [{
			loader: 'css-loader',
			options: { importLoaders: 1 }
		}, "postcss-loader"]
	})
	// importLoaders 用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。
},
```

### 2，autoprefixer

在 css 和 less 文件中, 准备一些代码自动补全前缀：

1.先下载此插件模块: npm i autoprefixer@9 2.postcss.config.js 配置如下:

```js
module.exports = {
  plugins: {
    // postcss在翻译css代码的时候, 需要使用哪些插件功能
    // 1. 写使用插件模块的名字, postcss会自己去require引入
    // 2. 必须配置浏览器列表才可以 自动添加前缀
    autoprefixer: {
      // 浏览器支持列表放到了package.json中browserslist中进行编写
    }
  }
};
```

package.json 的 browserslist 下设置

```js
"browserslist": [
    "defaults",
    "not ie < 11",
    "last 2 versions",
    "iOS 7",
    "last 3 iOS versions"
]
// defaults相当于 "> 5%", 国内浏览器使用率大于5%的
// not ie < 11  不兼容IE11以下的浏览器 (支持ie11)
// 支持最后2个版本
// iOS苹果手机操作系统, 支持ios7
// 支持最后3个IOS的版本 ios13, 12, 11
```

3. 打包观察生成的 style.css 文件中代码是否拥有浏览器兼容的前缀

### 3，postcss-pxtorem

浏览 && 画图, 解释 rem 如何适配的此插件是自动把(css/less..文件里 px 转换成适配的 rem 单位), 无需再手动计算了

1. 先下载此插件模块 npm i postcss-pxtorem
2. 在 postcss.config.js 中配置如下,

```js
'postcss-pxtorem': {
	rootValue: 16, // 这个值就是你看设计稿上基准字体是多少, 就写多少, 1rem=16px
	unitPrecision: 6, // 小数点几位
	propList: ['*'], // 指定需要转换rem的属性 例如: 'font-size' 'line-height' *代表所有属性
	mediaQuery: false, // 媒体查询的px是否转换
	minPixelValue: 0, // 小于指定数值不转换
	// 默认px识别大写小, 所以不写成px不转换
}
```

> 注意: 只对 css/less 文件内代码有效, 因为 webpack.config.js 中, 加载器使用了 postcss-loader

> 注意: 如果 html 中使用 px 转 rem, 可以安装插件, 来自动把 px 转换成 rem 使用

> 注意: html 的 font-size 不会自动随着网页的变化而变化

3. 在 index.html 模板文件中, 根据当前网页设置 html 的 fontSize, 来让所有 rem 单位在运行时得到真正的像素大小

## 13，压缩 css 文件

想要压缩打包后的 css 文件, 可以使用 optimize-css-assets-webpack-plugin, 先下载这个插件,在 webpack.config.js 中配置

```javascript
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
plugins: [
  // 新增
  new OptimizeCss()
];
```

## 14，打包assets

1. 需要引入 2 个加载器模块,
   - url-loader: `url-loader` 功能类似于 [`file-loader`](https://github.com/webpack-contrib/file-loader)，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL(base64 字符串)
   - file-loader: 产出, 寻找文件的引用位置
2. 准备工作: 注意打包的资源, 都要和入口文件产生直接/间接关系, 所以不要写在 index.html 模板文件中, 那样是不会被 webpack 处理的
   - assets 下准备 图片 和字体图标
   - 在 main.js 中, 创建标签, 使用图片/字体图标样式
     > 注意: webpack 认为, 图片也是一个模块, 所以才需要 loader 来解析图片, 所以图片需要 import/require 引入)
3. webpack.config.js 加载器配置:

```javascript
/*{
	test: /\.(png|jpg|jpeg|gif|svg)$/,
	use: [
		{
			loader: 'url-loader',
			options: { // 参数
				limit: 8192 // 8kb内的文件都转换成DataURL, 如果超出的都转换成base64字符串
			}
		}
	]
},
*/
// 上面options可以简写成下面?传参数的格式
{
	test: /\.(png|jpg|jpeg|gif|svg)$/, // 处理这些结尾的文件
                use: [
                    {   // options传参的方式被我改成了?传参
                        // ? 代表给加载器传入配置参数
                        // limit字段: 对打包的图片限制字节大小为8KB以内, 超出此限制,会被file-loader产生一个文件
                        // [name]: 代表直接使用打包目标文件的名字,
                        // [ext]: 代表直接使用打包目标文件的扩展名
                        // name字段: 代表给打包后的文件定义名字(可以使用[]这种规则)
                        // 8KB
            loader: 'url-loader?limit=8192&name=assetsDir/[name].[ext]'
         }
	]
}
// 如果处理字体图标需要引入这个
{
	test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
	loader: 'url-loader',
	options: {
		limit: 10000,
		name: 'fonts/[name].[hash:7].[ext]'
	}
}
```

4. 执行打包命令, 查看 dist 目录中和 index.html 中的效果

**总结:** 小于 limit 限制的 assets 下的图片资源, 都会被打包进 js 文件中, 先被 url-loader 转换成了 base64 字符串 (这种加密方式的字符串, 可以被 img 标签的 src 所接受, 但是一定要在 base64 加密的字符串前, 声明一个表示 data:image/png;base64, 后面跟 base64 字符串)

## 15.使用总结

​ 找插件/加载器, 下载插件/加载器模块, webpack.config.js 中进行配置, 编码/准备资源, 打包, 把打包后的资源部署到服务器上；

​ 部署: 配置环境和需要的各种软件参数等, 上传代码资源包

## 16，node 常用的方法/变量

- \_\_dirname (注意 2 个下划线): 代表当前文件所在文件夹的 绝对路径

- path.resolve: 合并 2 个路径

## 17，webpack 的作用是什么，谈谈你对它的理解

`答案`: 现在的前端网页功能丰富，特别是 SPA（single page web application 单页应用）技术流行后，JavaScript 的复杂度增加和需要一大堆依赖包，还需要解决 SCSS，Le…新增样式的扩展写法的编译工作。所以现代化的前端已经完全依赖于 WebPack 的辅助了。

现在最流行的三个前端框架，可以说和 webpack 已经紧密相连，框架官方都推出了和自身框架依赖的 webpack 构建工具。

· React.js+WebPack

· Vue.js+WebPack

· AngluarJS+WebPack

**webpack 的工作原理?**

`答案:` WebPack 可以看做是模块打包机：它做的事情是，分析你的项目结构，找到 JavaScript 模块以及其它的一些浏览器不能直接运行的拓展语言（Sass，TypeScript 等），并将其转换和打包为合适的格式供浏览器使用。在 3.0 出现后，Webpack 还肩负起了优化项目的责任。

**webpack 插件网址** https://www.webpackjs.com/plugins/

**webpack 加载器网址** https://www.webpackjs.com/loaders/
