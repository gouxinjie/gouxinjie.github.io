import{_ as t,c as e,aO as a,o as i}from"./chunks/framework.Dupuxvm1.js";const d="/assets/created.C7_PE-al.png",g=JSON.parse('{"title":"vue的生命周期和执行顺序","description":"","frontmatter":{},"headers":[],"relativePath":"column/Vue/Vue2/vue的生命周期和执行顺序.md","filePath":"column/Vue/Vue2/vue的生命周期和执行顺序.md"}'),n={name:"column/Vue/Vue2/vue的生命周期和执行顺序.md"};function p(r,s,l,h,o,c){return i(),e("div",null,s[0]||(s[0]=[a(`<h1 id="vue的生命周期和执行顺序" tabindex="-1">vue的生命周期和执行顺序 <a class="header-anchor" href="#vue的生命周期和执行顺序" aria-label="Permalink to &quot;vue的生命周期和执行顺序&quot;">​</a></h1><hr><p><strong>1，Vue 生命周期都有哪些？</strong></p><table tabindex="0"><thead><tr><th>序号</th><th>生命周期</th><th>描述</th></tr></thead><tbody><tr><td>1</td><td><code>beforecreate</code>创建前</td><td>vue实例初始化阶段，不可以访问data,methods； 此时打印出的this是undefined；</td></tr><tr><td>2</td><td><code>created</code>创建后</td><td>vue实例初始化完成，可以访问data，methods，但是节点尚未挂载，不能获取dom节点；</td></tr><tr><td>3</td><td><code>beforeMount</code>挂载前</td><td>实际上与created阶段类似，同样的节点尚未挂载，此时模板已经编译完成，但还没有被渲染至页面中（即为虚拟dom加载为真实dom）注意的是这是在视图渲染前最后一次可以更改数据的机会，不会触发其他的钩子函数；</td></tr><tr><td>4</td><td><code>mounted</code>挂载完成</td><td>这个阶段说说明模板已经被渲染成真实DOM，实例已经被完全创建好了；</td></tr><tr><td>5</td><td><code>beforeUpdate</code>更新前</td><td>data里面的数据改动会触发vue的响应式数据更新，也就是对比真实dom进行渲染的过程；</td></tr><tr><td>6</td><td><code>updated</code>更新完成</td><td>data中的数据更新完成，dom节点替换完成 ；</td></tr><tr><td>7</td><td><code>activited</code></td><td>在组件被激活时调⽤（使用了 <code>&lt;keep-alive&gt;</code> 的情况下）；</td></tr><tr><td>8</td><td><code>deactivated</code></td><td>在组件被销毁时调⽤（使用了 <code>&lt;keep-alive&gt;</code> 的情况下）；</td></tr><tr><td>9</td><td><code>beforeDestroy</code>销毁前</td><td>销毁前执行（$destroy方法被调用的时候就会执行）,一般在这里善后：清除计时器、监听等；</td></tr><tr><td>10</td><td><code>destroyed</code>销毁后</td><td>销毁后 （Dom元素存在，只是不再受vue控制）,卸载watcher，事件监听，子组件；</td></tr></tbody></table><p><strong>2，父子组件生命周期执行顺序</strong></p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  -&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父beforeCreate</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  -&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父created</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  -&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父beforeMount</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  -&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">子beforeCreate</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  -&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">子created</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  -&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">子beforeMount</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  -&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">子mounted</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  -&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父mounted</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><code>验证如下图</code>：</p><p><img src="`+d+'" alt="在这里插入图片描述"></p><p><strong>更新过程</strong></p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父beforeUpdate</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">子beforeUpdate</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">子updated</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父updated</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><strong>销毁过程</strong></p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父beforeDestroy</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">子beforeDestroy</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">子destroyed</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父destroyed</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><code>keep-alive</code>可以实现组件缓存，当组件切换时不会对当前组件进行卸载。</p><p><strong>使用keepAlive后生命周期变化（重要）：</strong></p><p>首次进入缓存页面：beforeRouteEnter --&gt; created --&gt; mounted --&gt; activated --&gt; deactivated 再次进入缓存页面：beforeRouteEnter --&gt; activated --&gt; deactivated</p><p><strong>注意：</strong> 配置了keepAlive的页面，在再次进入时不会重新渲染（第一次进来时会触发所有钩子函数），该页面内的组件同理不会再次渲染。</p><p>而这可能会导致该组件内的相关操作（那些每次都需要重新渲染页面的操作：如父子组件间的传值）不再生效。 这一点可能会导致一些莫名其妙而又无从查证的bug；</p>',17)]))}const u=t(n,[["render",p]]);export{g as __pageData,u as default};
