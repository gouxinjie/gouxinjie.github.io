import{_ as t,c as n,aO as a,o as i}from"./chunks/framework.Dupuxvm1.js";const k=JSON.parse('{"title":"优雅的vue2项目总体结构","description":"","frontmatter":{},"headers":[],"relativePath":"column/Vue/Vue2/优雅的vue2项目总体结构.md","filePath":"column/Vue/Vue2/优雅的vue2项目总体结构.md"}'),e={name:"column/Vue/Vue2/优雅的vue2项目总体结构.md"};function l(p,s,r,d,c,h){return i(),n("div",null,s[0]||(s[0]=[a(`<h1 id="优雅的vue2项目总体结构" tabindex="-1">优雅的vue2项目总体结构 <a class="header-anchor" href="#优雅的vue2项目总体结构" aria-label="Permalink to &quot;优雅的vue2项目总体结构&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><blockquote><p>在多人合作的 Vue 项目中，或多或少会使用到 vue-router / vuex / axios 等工具库。</p><p>本文在基于 vue-cli webpack模板 生成的目录结构基础上，建立一个<code>利于多人合作</code>、<code>扩展性强</code>、<code>高度模块化</code>的 vue 项目目录结构。</p></blockquote><p><strong>vue2的总体结构如下</strong></p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── build                           存放项目打包后的文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── node_modules 					项目依赖</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── public 							存放index.html和静态文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── idnex.html</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── images							存放图片</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── videos							存放视频</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── mock                            mock测试数据文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── hello.js</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── src                             项目源码目录    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── api  						存放项目的接口目录</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ 		└── myAxios.js					对axios的封装</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ 		└── login.js					其他接口方法</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	├── assets						存放css相关和icon字体图标之类的</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── resetCss  					全局样式和清除默认样式	</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── iocnFonts 					矢量图标以及静态图片</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	│── components 					存放全局组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── HelloWorld.vue 				每个组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│		└── </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">vue</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	├── config                       重要配置参数                  </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── index.js                    存放一些配置参数（比如接口代理路径，百度云秘钥等等）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	├── entry                       存放ts的类型约定（ts项目）                  </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── index.js                    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	│── plugins 					所需的第三方库（最好按需引入）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── elementUi.js  				element</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ui库</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── vantUi.js 					vant</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ui库</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	│── router						存放路由 </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── index.js					路由表及其配置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	│── stores							vuex状态管理仓库 </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── user.js							用户子模块							</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── login.js						登陆子模块						</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   	└── index.js						根模块root</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	│── utils						工具类</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│		└── tools.js					共用方法</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	│──views                         页面目录</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│       └── hello.vue</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│       └── login.vue</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│       └── </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.vue						其他页面</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	│──App.vue						设置路由出口 </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│	│──main.js						入口文件  </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .browserslistrc					针对浏览器的兼容性</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .env.test						测试环境配置文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .env.development				开发环境配置文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .env.production					生产环境配置文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .gitignore						忽略上传到git的文件,比如node_modules和build打包</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .prettierrc.json				统一代码风格，比如缩进</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .eslintrc.js					ESlint 语法检查，代码格式化，优化代码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── babel.config.js					转</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ES5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">语法和配置一些插件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── package.json                    npm包配置文件，里面定义了项目的npm脚本，依赖包等信息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">package-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lock.json               锁定包的版本，自动生成</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── vue.config.js					vue配置文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">README</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.md						项目说明文档，重要</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br></div></div><p>下面是项目结构的详细说明:</p><table tabindex="0"><thead><tr><th>目录/文件</th><th>说明</th></tr></thead><tbody><tr><td>build</td><td>项目最终的打包，分为测试环境和生产环境（根据.env进行配置）</td></tr><tr><td>node_modules</td><td>项目的依赖文件夹，npm init 或者 yarn init</td></tr><tr><td>public</td><td>可以看做静态文件夹，图片和视频都可以存放到这里，需要注意的是这个文件webpack打包不会对其处理，直接把文件复制到存放项目的工程目录下，项目中可以直接使用 / 来访问；</td></tr><tr><td>public/index.html</td><td>单页面应用入口文件，如果是开发移动端项目，可以在<code>head</code>区域加上你合适的<code>meta</code>头</td></tr><tr><td>mock</td><td>模拟后端的测试数据，项目初期时用到的</td></tr><tr><td>src</td><td>我们的开发目录，即项目涉及到的页面、样式、脚本都集中在此编写</td></tr><tr><td>src/api</td><td>存放项目的后端接口封装</td></tr><tr><td>src/assets</td><td>存放css相关和icon字体图标之类的</td></tr><tr><td>src/components</td><td>存放公共的组件</td></tr><tr><td>src/config</td><td>存放全局的配置子类的（比如接口代理路径，百度云秘钥等）</td></tr><tr><td>src/entry</td><td>存放ts的类型约定（ts项目中）</td></tr><tr><td>src/plugins</td><td>所需的第三方库（最好按需引入）</td></tr><tr><td>src/router</td><td>存放路由表及其配置</td></tr><tr><td>src/stores</td><td>vuex状态管理仓库（分为局部模块和根模块）</td></tr><tr><td>src/utils</td><td>存放工具类（比如防抖节流函数，字节转换函数）</td></tr><tr><td>src/views</td><td>页面目录，项目中的主要代码</td></tr><tr><td>src/App.vue</td><td>App.vue是项目的主组件，页面的入口文件,是vue页面资源的首加载项</td></tr><tr><td>src/main.js</td><td>默认为整个项目的入口文件，实例化vue、配置插件、全局组件、全局css、注入路由和vuex等等</td></tr><tr><td>.browserslistrc</td><td>指定了项目需要适配的浏览器范围。这个值会被 <a href="https://link.juejin.cn?target=https%3A%2F%2Fnew.babeljs.io%2Fdocs%2Fen%2Fnext%2Fbabel-preset-env.html" target="_blank" rel="noreferrer">@babel/preset-env</a>（使我们的 JavaScript 代码能够运行在当前和旧版本的浏览器或其他环境中的工具） 和 <a href="https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpostcss%2Fautoprefixer" target="_blank" rel="noreferrer">Autoprefixer</a> （浏览器前缀处理工具）用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。</td></tr><tr><td>.env.test</td><td>测试环境配置env</td></tr><tr><td>.env.development</td><td>开发环境配置env</td></tr><tr><td>.env.production</td><td>生产环境配置env</td></tr><tr><td>.gitignore</td><td>忽略上传到git的文件,比如node_modules和build打包文件</td></tr><tr><td>.prettierrc.json</td><td>统一不同开发者的代码风格，比如缩进</td></tr><tr><td>.eslintrc.js</td><td>ESlint 语法检查，代码格式化，优化代码</td></tr><tr><td>babel.config.js</td><td>转ES5语法和配置一些插件（element-ui按需引入需要配置一下）</td></tr><tr><td>package.json</td><td>每个项目的根目录下面，一般都有一个<code>package.json</code>文件，定义了这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。<code>npm install</code>命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境。我们以 vue-cli 生成的 package.json 为基本参考并适当的添加一些常见属性进行说明。</td></tr><tr><td>package-lock.json</td><td>锁定包的版本，自动生成</td></tr><tr><td>vue.config.js</td><td>vue配置文件，可以配置打包目录，项目部署的基础目录，配置代理，配置第三方插件....，<a href="https://blog.csdn.net/qq_43886365/article/details/127122615?ops_request_misc=&amp;request_id=cf0c207a521b4b16b9ded537efd3a365&amp;biz_id=&amp;utm_medium=distribute.pc_search_result.none-task-blog-2~blog~koosearch~default-1-127122615-null-null.268%5Ev1%5Econtrol&amp;utm_term=vue.config&amp;spm=1018.2226.3001.4450" target="_blank" rel="noreferrer">了解更多</a></td></tr><tr><td>README.md</td><td>项目说明文档，重要</td></tr></tbody></table><p><strong>注意</strong>：vue2和vue3项目结构是有一些差异的，但基本都是一样的，vue3的index.html文件放到了最外面，且vue3是用vite构建的，所以要配置vite.config.js，不懂的可以学习一下vite构建；</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">vite中文网： </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">https</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//vitejs.cn/</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="其他需要注意的" tabindex="-1">其他需要注意的 <a class="header-anchor" href="#其他需要注意的" aria-label="Permalink to &quot;其他需要注意的&quot;">​</a></h2><p><strong>1，package.json 里面的dependencies 和 devDependencies区别</strong>：</p><p><code>dependencies</code>字段指定了项目运行所依赖的模块，<code>devDependencies</code>指定项目开发所需要的模块。</p><p>比如dependencies 下的<code>core.js</code>包和<code>vue</code>包会被编译到最终生成的文件中，而 devDependencies 下的这些包不会被编译进去，因为这些提供的功能（语法转换、开发服务器、语法检查、vue的编译器）仅在开发阶段用到。</p><blockquote><p>其中，依赖模块的版本可以加上各种限定，主要有以下几种：</p></blockquote><ul><li><strong>指定版本：</strong> 比如<code>1.2.2</code>，遵循<code>大版本.次要版本.小版本</code>的格式规定，安装时只安装指定版本。</li><li><strong>波浪号+指定版本：</strong> 比如<code>~1.2.2</code>，表示安装1.2.x的最新版本（不低于1.2.2），但是不安装1.3.x，也就是说安装时不改变大版本号和次要版本号。</li><li><strong>插入号+指定版本：</strong> 比如<code>ˆ1.2.2</code>，表示安装1.x.x的最新版本（不低于1.2.2），但是不安装2.x.x，也就是说安装时不改变大版本号。需要注意的是，如果大版本号为0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。</li><li><strong>latest：</strong> 安装最新版本。</li></ul><p><strong>2，public文件夹</strong></p><p>任何放置在 <code>public</code> 文件夹的静态资源都会被简单的复制，而不经过 webpack（vue-cli依赖的打包工具）。可以通过相对路径来引用它们;</p><blockquote><p>推荐将资源作为你的模块依赖图的一部分导入，这样它们会通过 webpack 的处理并获得如下好处：</p></blockquote><ul><li>脚本和样式表会被压缩且打包在一起，从而避免额外的网络请求。</li><li>文件丢失会直接在编译时报错，而不是到了用户端才产生 404 错误。</li><li>最终生成的文件名包含了内容哈希，因此你不必担心浏览器会缓存它们的老版本。</li></ul><p>通常，我们只需要关注<code>public/index.html</code>这个文件，它会在构建过程中被注入处理后的 JavaScript 和 CSS 等的资源链接。同时，它也提供了 Vue 实例挂载的目标。</p>`,20)]))}const o=t(e,[["render",l]]);export{k as __pageData,o as default};
