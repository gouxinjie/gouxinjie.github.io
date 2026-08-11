
# 优雅的vue2项目总体结构


## 前言

> 在多人合作的 Vue 项目中，或多或少会使用到 vue-router / vuex / axios 等工具库。
> 
> 本文在基于 vue-cli webpack模板 生成的目录结构基础上，建立一个`利于多人合作`、`扩展性强`、`高度模块化`的 vue 项目目录结构。

**vue2的总体结构如下**
```js
├── build                           存放项目打包后的文件
├── node_modules 					项目依赖
├── public 							存放index.html和静态文件
│   ├── idnex.html
│   ├── images							存放图片
│   ├── videos							存放视频
├── mock                            mock测试数据文件
│   ├── hello.js
├── src                             项目源码目录    
│   ├── api  						存放项目的接口目录
│ 		└── myAxios.js					对axios的封装
│ 		└── login.js					其他接口方法
│	├── assets						存放css相关和icon字体图标之类的
│   	└── resetCss  					全局样式和清除默认样式	
│   	└── iocnFonts 					矢量图标以及静态图片
│	│── components 					存放全局组件
│   	└── HelloWorld.vue 				每个组件
│		└── ...vue
│	├── config                       重要配置参数                  
│   	└── index.js                    存放一些配置参数（比如接口代理路径，百度云秘钥等等）
│	├── entry                       存放ts的类型约定（ts项目）                  
│   	└── index.js                    
│	│── plugins 					所需的第三方库（最好按需引入）
│   	└── elementUi.js  				element-ui库
│   	└── vantUi.js 					vant-ui库
│	│── router						存放路由 
│   	└── index.js					路由表及其配置
│	│── stores							vuex状态管理仓库 
│   	└── user.js							用户子模块							
│   	└── login.js						登陆子模块						
│   	└── index.js						根模块root
│	│── utils						工具类
│		└── tools.js					共用方法
│	│──views                         页面目录
│       └── hello.vue
│       └── login.vue
│       └── ....vue						其他页面
│	│──App.vue						设置路由出口 
│	│──main.js						入口文件  
├── .browserslistrc					针对浏览器的兼容性
├── .env.test						测试环境配置文件
├── .env.development				开发环境配置文件
├── .env.production					生产环境配置文件
├── .gitignore						忽略上传到git的文件,比如node_modules和build打包
├── .prettierrc.json				统一代码风格，比如缩进
├── .eslintrc.js					ESlint 语法检查，代码格式化，优化代码
├── babel.config.js					转ES5语法和配置一些插件
├── package.json                    npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
├── package-lock.json               锁定包的版本，自动生成
├── vue.config.js					vue配置文件
├── README.md						项目说明文档，重要
```
下面是项目结构的详细说明:
| 目录/文件         | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| build             | 项目最终的打包，分为测试环境和生产环境（根据.env进行配置）   |
| node_modules      | 项目的依赖文件夹，npm init 或者  yarn init                   |
| public            | 可以看做静态文件夹，图片和视频都可以存放到这里，需要注意的是这个文件webpack打包不会对其处理，直接把文件复制到存放项目的工程目录下，项目中可以直接使用 / 来访问； |
| public/index.html | 单页面应用入口文件，如果是开发移动端项目，可以在`head`区域加上你合适的`meta`头 |
| mock              | 模拟后端的测试数据，项目初期时用到的                         |
| src               | 我们的开发目录，即项目涉及到的页面、样式、脚本都集中在此编写 |
| src/api           | 存放项目的后端接口封装                                       |
| src/assets        | 存放css相关和icon字体图标之类的                              |
| src/components    | 存放公共的组件                                               |
| src/config        | 存放全局的配置子类的（比如接口代理路径，百度云秘钥等）       |
| src/entry         | 存放ts的类型约定（ts项目中）                                 |
| src/plugins       | 所需的第三方库（最好按需引入）                               |
| src/router        | 存放路由表及其配置                                           |
| src/stores        | vuex状态管理仓库（分为局部模块和根模块）                     |
| src/utils         | 存放工具类（比如防抖节流函数，字节转换函数）                 |
| src/views         | 页面目录，项目中的主要代码                                   |
| src/App.vue       | App.vue是项目的主组件，页面的入口文件,是vue页面资源的首加载项 |
| src/main.js       | 默认为整个项目的入口文件，实例化vue、配置插件、全局组件、全局css、注入路由和vuex等等 |
| .browserslistrc   | 指定了项目需要适配的浏览器范围。这个值会被 [@babel/preset-env](https://link.juejin.cn?target=https%3A%2F%2Fnew.babeljs.io%2Fdocs%2Fen%2Fnext%2Fbabel-preset-env.html)（使我们的 JavaScript 代码能够运行在当前和旧版本的浏览器或其他环境中的工具） 和 [Autoprefixer](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpostcss%2Fautoprefixer) （浏览器前缀处理工具）用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。 |
| .env.test         | 测试环境配置env                                              |
| .env.development  | 开发环境配置env                                              |
| .env.production   | 生产环境配置env                                              |
| .gitignore        | 忽略上传到git的文件,比如node_modules和build打包文件          |
| .prettierrc.json  | 统一不同开发者的代码风格，比如缩进                           |
| .eslintrc.js      | ESlint 语法检查，代码格式化，优化代码                        |
| babel.config.js   | 转ES5语法和配置一些插件（element-ui按需引入需要配置一下）    |
| package.json      | 每个项目的根目录下面，一般都有一个`package.json`文件，定义了这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。`npm install`命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境。我们以 vue-cli 生成的 package.json 为基本参考并适当的添加一些常见属性进行说明。 |
| package-lock.json | 锁定包的版本，自动生成                                       |
| vue.config.js     | vue配置文件，可以配置打包目录，项目部署的基础目录，配置代理，配置第三方插件....，[了解更多](https://blog.csdn.net/qq_43886365/article/details/127122615?ops_request_misc=&request_id=cf0c207a521b4b16b9ded537efd3a365&biz_id=&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~koosearch~default-1-127122615-null-null.268%5Ev1%5Econtrol&utm_term=vue.config&spm=1018.2226.3001.4450) |
| README.md         | 项目说明文档，重要                                           |


**注意**：vue2和vue3项目结构是有一些差异的，但基本都是一样的，vue3的index.html文件放到了最外面，且vue3是用vite构建的，所以要配置vite.config.js，不懂的可以学习一下vite构建；

```js
vite中文网： https://vitejs.cn/
```

## 其他需要注意的


**1，package.json 里面的dependencies 和 devDependencies区别**：

`dependencies`字段指定了项目运行所依赖的模块，`devDependencies`指定项目开发所需要的模块。

比如dependencies 下的`core.js`包和`vue`包会被编译到最终生成的文件中，而 devDependencies 下的这些包不会被编译进去，因为这些提供的功能（语法转换、开发服务器、语法检查、vue的编译器）仅在开发阶段用到。

> 其中，依赖模块的版本可以加上各种限定，主要有以下几种：

- **指定版本：** 比如`1.2.2`，遵循`大版本.次要版本.小版本`的格式规定，安装时只安装指定版本。
- **波浪号+指定版本：** 比如`~1.2.2`，表示安装1.2.x的最新版本（不低于1.2.2），但是不安装1.3.x，也就是说安装时不改变大版本号和次要版本号。
- **插入号+指定版本：** 比如`ˆ1.2.2`，表示安装1.x.x的最新版本（不低于1.2.2），但是不安装2.x.x，也就是说安装时不改变大版本号。需要注意的是，如果大版本号为0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。
- **latest：** 安装最新版本。

**2，public文件夹**

任何放置在 `public` 文件夹的静态资源都会被简单的复制，而不经过 webpack（vue-cli依赖的打包工具）。可以通过相对路径来引用它们;

> 推荐将资源作为你的模块依赖图的一部分导入，这样它们会通过 webpack 的处理并获得如下好处：

- 脚本和样式表会被压缩且打包在一起，从而避免额外的网络请求。
- 文件丢失会直接在编译时报错，而不是到了用户端才产生 404 错误。
- 最终生成的文件名包含了内容哈希，因此你不必担心浏览器会缓存它们的老版本。



通常，我们只需要关注`public/index.html`这个文件，它会在构建过程中被注入处理后的 JavaScript 和 CSS 等的资源链接。同时，它也提供了 Vue 实例挂载的目标。

