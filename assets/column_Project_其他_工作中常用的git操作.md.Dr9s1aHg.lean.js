import{_ as t,c as i,aO as a,o as n}from"./chunks/framework.Dupuxvm1.js";const e="/assets/git-1.C_ZPmFs3.png",l="/assets/git.qWSP4yLd.png",d="/assets/git-3.WBEcNZde.png",p="/assets/git-2.ZpxWZtnK.png",r="/assets/git-4.wrbZp1Ot.png",h="/assets/git-5.CFL1ZtWW.png",c="/assets/git-6.CKP2aoHY.png",o="/assets/git-7.DjST4RzF.png",g="/assets/git-8.AkhkD3yc.png",k="/assets/git-9.DXKNX59U.png",b="/assets/git-10.DYI4H0RF.png",_=JSON.parse('{"title":"工作中常用的git操作","description":"","frontmatter":{},"headers":[],"relativePath":"column/Project/其他/工作中常用的git操作.md","filePath":"column/Project/其他/工作中常用的git操作.md"}'),u={name:"column/Project/其他/工作中常用的git操作.md"};function F(m,s,y,C,v,B){return n(),i("div",null,s[0]||(s[0]=[a(`<h1 id="工作中常用的git操作" tabindex="-1">工作中常用的git操作 <a class="header-anchor" href="#工作中常用的git操作" aria-label="Permalink to &quot;工作中常用的git操作&quot;">​</a></h1><nav class="table-of-contents"><ul><li><a href="#git-常用命令汇总">git 常用命令汇总</a></li><li><a href="#业务场景一">业务场景一</a><ul><li><a href="#_1-1-把新的项目提交到新建的远程仓库中。-以gitee为例">1.1 把新的项目提交到新建的远程仓库中。 (以gitee为例)</a></li></ul></li><li><a href="#业务场景二">业务场景二</a><ul><li><a href="#_2-1-合并本地代码到主分支">2.1 合并本地代码到主分支</a></li><li><a href="#_2-2-合并主分支的代码到develop分支">2.2 合并主分支的代码到develop分支</a></li></ul></li><li><a href="#业务场景三">业务场景三</a><ul><li><a href="#_3-1-临时保存当前工作目录中的所有更改">3.1 临时保存当前工作目录中的所有更改</a></li></ul></li><li><a href="#业务场景四">业务场景四</a><ul><li><a href="#_4-1-修改仓库的远程地址">4.1 修改仓库的远程地址</a></li></ul></li><li><a href="#业务场景五">业务场景五</a><ul><li><a href="#_5-1-本地仓库同时关联多个远程仓库-gitee和github">5.1 本地仓库同时关联多个远程仓库（gitee和github）</a></li></ul></li><li><a href="#业务场景六">业务场景六</a><ul><li><a href="#_5-1-撤销某次提交">5.1 撤销某次提交</a></li><li><a href="#_5-2-撤销某次合并">5.2 撤销某次合并</a></li></ul></li></ul></nav><p>Git 是一个分布式版本控制系统，它允许开发者有效地协同工作，通过分支管理、变更追踪和历史记录等功能，确保代码的完整性和项目的协同效率，同时还支持错误回滚和代码审查。</p><h2 id="git-常用命令汇总" tabindex="-1">git 常用命令汇总 <a class="header-anchor" href="#git-常用命令汇总" aria-label="Permalink to &quot;git 常用命令汇总&quot;">​</a></h2><table tabindex="0"><thead><tr><th>命令类别</th><th>命令</th><th>描述</th></tr></thead><tbody><tr><td><strong>基本操作</strong></td><td><code>git init</code></td><td>初始化一个新的 Git 仓库</td></tr><tr><td></td><td><code>git status</code></td><td>显示工作目录和暂存区的状态</td></tr><tr><td></td><td><code>git status --short</code></td><td>以简短格式显示状态信息</td></tr><tr><td></td><td><code>git status --porcelain</code></td><td>以机器可读的格式显示状态信息</td></tr><tr><td></td><td><code>git branch</code></td><td>列出所有本地分支</td></tr><tr><td></td><td><code>git branch -a</code></td><td>列出所有本地和远程分支</td></tr><tr><td></td><td><code>git branch -v</code></td><td>列出所有本地分支及其最新提交信息</td></tr><tr><td></td><td><code>git log</code></td><td>显示提交历史</td></tr><tr><td></td><td><code>git log --oneline</code></td><td>以一行形式显示提交历史</td></tr><tr><td></td><td><code>git log --graph</code></td><td>以图形方式显示提交历史</td></tr><tr><td></td><td><code>gitk</code></td><td>图形化显示提交历史</td></tr><tr><td></td><td><code>git remote</code></td><td>列出所有远程仓库</td></tr><tr><td></td><td><code>git remote -v</code></td><td>详细列出所有远程仓库及其 URL</td></tr><tr><td></td><td><code>git config --list</code></td><td>列出所有 Git 配置项</td></tr><tr><td></td><td><code>git config user.name</code></td><td>查看用户名</td></tr><tr><td></td><td><code>git config user.email</code></td><td>查看邮箱地址</td></tr><tr><td><strong>文件操作</strong></td><td><code>git add &lt;file&gt;</code></td><td>添加指定文件到暂存区</td></tr><tr><td></td><td><code>git add .</code></td><td>添加所有已修改的文件到暂存区</td></tr><tr><td></td><td><code>git add -A</code></td><td>添加所有已修改的文件和未跟踪的新文件到暂存区</td></tr><tr><td></td><td><code>git reset &lt;file&gt;</code></td><td>从暂存区中取消暂存指定文件</td></tr><tr><td></td><td><code>git reset .</code></td><td>从暂存区中取消暂存所有文件</td></tr><tr><td></td><td><code>git reset --hard</code></td><td>取消所有暂存的更改，恢复到上次提交的状态</td></tr><tr><td></td><td><code>git commit -m &quot;Commit message&quot;</code></td><td>提交暂存区中的更改</td></tr><tr><td></td><td><code>git commit -am &quot;Commit message&quot;</code></td><td>提交所有已修改的文件，并添加到暂存区</td></tr><tr><td></td><td><code>git checkout -- &lt;file&gt;</code></td><td>撤销工作目录中的更改</td></tr><tr><td></td><td><code>git reset HEAD &lt;file&gt;</code></td><td>取消暂存区中的更改</td></tr><tr><td></td><td><code>git checkout &lt;commit&gt; &lt;file&gt;</code></td><td>恢复指定提交中的文件版本</td></tr><tr><td></td><td><code>git checkout &lt;branch&gt; &lt;file&gt;</code></td><td>从指定分支恢复文件版本</td></tr><tr><td><strong>分支操作</strong></td><td><code>git branch &lt;branch-name&gt;</code></td><td>创建新分支</td></tr><tr><td></td><td><code>git checkout -b &lt;branch-name&gt;</code></td><td>创建并切换到新分支</td></tr><tr><td></td><td><code>git switch -c &lt;branch-name&gt;</code></td><td>（Git 2.23+）创建并切换到新分支</td></tr><tr><td></td><td><code>git checkout &lt;branch-name&gt;</code></td><td>切换到指定分支</td></tr><tr><td></td><td><code>git switch &lt;branch-name&gt;</code></td><td>（Git 2.23+）切换到指定分支</td></tr><tr><td></td><td><code>git branch -d &lt;branch-name&gt;</code></td><td>删除已合并的本地分支</td></tr><tr><td></td><td><code>git branch -D &lt;branch-name&gt;</code></td><td>强制删除本地分支（即使未合并）</td></tr><tr><td></td><td><code>git merge &lt;branch-name&gt;</code></td><td>将指定分支合并到当前分支</td></tr><tr><td></td><td><code>git merge --no-commit &lt;branch-name&gt;</code></td><td>合并更改但不提交</td></tr><tr><td></td><td><code>git log --graph --oneline --decorate</code></td><td>以图形方式显示分支关系</td></tr><tr><td><strong>远程仓库操作</strong></td><td><code>git remote add &lt;name&gt; &lt;url&gt;</code></td><td>添加新的远程仓库</td></tr><tr><td></td><td><code>git fetch &lt;remote&gt;</code></td><td>从远程仓库获取最新的更改</td></tr><tr><td></td><td><code>git fetch &lt;remote&gt; &lt;branch&gt;</code></td><td>从远程仓库获取指定分支的更改</td></tr><tr><td></td><td><code>git pull &lt;remote&gt; &lt;branch&gt;</code></td><td>从远程仓库拉取更改并合并到当前分支</td></tr><tr><td></td><td><code>git pull</code></td><td>从默认远程仓库（通常是 <code>origin</code>）拉取并合并到当前分支</td></tr><tr><td></td><td><code>git push &lt;remote&gt; &lt;branch&gt;</code></td><td>将本地分支的更改推送到远程仓库</td></tr><tr><td></td><td><code>git push</code></td><td>将当前分支的更改推送到默认远程仓库（通常是 <code>origin</code>）</td></tr><tr><td></td><td><code>git push --set-upstream &lt;remote&gt; &lt;branch&gt;</code></td><td>设置远程分支的追踪关系，并推送更改</td></tr><tr><td></td><td><code>git push &lt;remote&gt; --delete &lt;branch&gt;</code></td><td>删除远程仓库中的分支</td></tr><tr><td><strong>其他常用命令</strong></td><td><code>git tag &lt;tag-name&gt;</code></td><td>创建新标签</td></tr><tr><td></td><td><code>git push &lt;remote&gt; &lt;tag-name&gt;</code></td><td>将标签推送到远程仓库</td></tr><tr><td></td><td><code>git tag</code></td><td>列出所有本地标签</td></tr><tr><td></td><td><code>git describe</code></td><td>显示最近的标签</td></tr><tr><td></td><td><code>git reset &lt;commit&gt;</code></td><td>将暂存区恢复到指定提交的状态</td></tr><tr><td></td><td><code>git reset --hard &lt;commit&gt;</code></td><td>将工作目录恢复到指定提交的状态</td></tr><tr><td></td><td><code>git reset --soft &lt;commit&gt;</code></td><td>只移动当前分支的指针，不改变暂存区或工作目录</td></tr><tr><td></td><td><code>git diff &gt; patchfile.patch</code></td><td>导出补丁文件</td></tr><tr><td></td><td><code>git apply patchfile.patch</code></td><td>应用补丁文件</td></tr><tr><td></td><td><code>git stash</code></td><td>暂存当前工作目录中的所有更改</td></tr><tr><td></td><td><code>git stash list</code></td><td>列出所有暂存记录</td></tr><tr><td></td><td><code>git stash apply</code></td><td>恢复暂存的更改</td></tr><tr><td></td><td><code>git stash pop</code></td><td>恢复暂存的更改并删除记录</td></tr></tbody></table><h2 id="业务场景一" tabindex="-1">业务场景一 <a class="header-anchor" href="#业务场景一" aria-label="Permalink to &quot;业务场景一&quot;">​</a></h2><h3 id="_1-1-把新的项目提交到新建的远程仓库中。-以gitee为例" tabindex="-1">1.1 把新的项目提交到新建的远程仓库中。 (以<code>gitee</code>为例) <a class="header-anchor" href="#_1-1-把新的项目提交到新建的远程仓库中。-以gitee为例" aria-label="Permalink to &quot;1.1 把新的项目提交到新建的远程仓库中。 (以\`gitee\`为例)&quot;">​</a></h3><div class="warning custom-block"><p class="custom-block-title">注意</p><p>新建的远程仓库里面必须是空的。如果生成了 <code>.gitignore</code> 和 <code>Readme.md</code> 文件，需要进行额外的操作，下面会讲到。</p></div><p>命令执行顺序：</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 1: 创建本地仓库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 2: 添加文件到仓库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> .</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;提交的备注信息&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 3: 关联远程仓库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> remote</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 你的远程仓库地址</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 4: 推送到远程仓库  master是分支名称,有的仓库默认分支是main 也可以新建分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## -u 这个选项用于设置当前本地分支与远程仓库中的某个分支建立追踪关系；后面直接可以使用 git push命令</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## origin 是代表远程仓库的名称，用于区分本地仓库</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><div class="tip custom-block"><p class="custom-block-title">提示</p><p><strong>-u</strong> 这个选项用于设置当前本地分支与远程仓库中的某个分支建立追踪关系；然后后面直接可以使用 git push命令 了</p><p><strong>origin</strong> 是代表远程仓库的名称，用于区分本地仓库</p></div><p>推送成功：如下图</p><p><img src="`+e+'" alt=""></p><p>如果执行上述命令<code>步骤 4</code>出现下面的错误：</p><p><img src="'+l+'" alt=""></p><p>这种情况说明你在初始化远程仓库时自动生成了 <code>.gitignore</code> 和 <code>Readme.md</code> 等文件，此时远程参考里面已经有提交记录了，而你本地却没有，所以会出现图上的错误。 <img src="'+d+`" alt=""></p><hr><p><strong>表明你的当前分支落后于远程分支 - 解决方案如下：</strong></p><p>1.先建立连接，执行：</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pull</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --allow-unrelated-histories</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>这个命令用于从远程仓库拉取最新的更改，并允许合并两个不相关的提交历史。就是把远程仓库中的更改合并到本地仓库中。</p><div class="tip custom-block"><p class="custom-block-title">提示</p><p>不要直接使用 <strong>git pull</strong> 命令，因为此时本地和远程两个分支可能是完全独立的，没有历史联系。</p><p>会直接报错：&#39;fatal: refusing to merge unrelated histories&#39;</p></div><p>2.解决可能的合并冲突:</p><p>这个步骤是远程合并到本地仓库的操作，如果有<strong>冲突</strong>，先解决冲突。 一般是因为远程仓库的文件和本地仓库的文件有相同的名字。</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 解决冲突后，添加解决后的文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">conflicted-fil</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 提交解决后的更改</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Resolve conflicts after pulling from origin/main&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>3.然后在执行</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>4.提交成功</p><p>提交成功：如下图: <img src="`+p+'" alt=""></p><p>如果不解决冲突直接执行：<code>git push -u origin master</code> 会出现下面的错误：</p><p><img src="'+r+`" alt=""></p><h2 id="业务场景二" tabindex="-1">业务场景二 <a class="header-anchor" href="#业务场景二" aria-label="Permalink to &quot;业务场景二&quot;">​</a></h2><h3 id="_2-1-合并本地代码到主分支" tabindex="-1">2.1 合并本地代码到主分支 <a class="header-anchor" href="#_2-1-合并本地代码到主分支" aria-label="Permalink to &quot;2.1 合并本地代码到主分支&quot;">​</a></h3><blockquote><p>场景描述：比如我现在在 <code>develop</code> 分支上开发，开发完成之后需要把我的代码合并到 <code>master</code> 主分支上. develop --&gt; master</p></blockquote><p>命令执行顺序：</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 1：确保develop分支的状态是干净的 如果有未提交的更改，要先提交</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> status</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 2: 先切换到 master 分支 并 拉取最新的master分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> checkout</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pull</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 3: 合并develop分支到maste</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> merge</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> develop</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 4: 解决冲突并提交 (如果有冲突，需要解决)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Merge develop into master&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤 5：推送更改到远程master分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><div class="tip custom-block"><p class="custom-block-title">git status命令</p><p>git status 命令用于显示工作目录和版本库的状态。这个命令可以帮助你了解当前工作目录中的文件状态，以及哪些文件已经准备好提交（commit）;如图：</p><p><img src="`+h+'" alt=""></p></div><p><strong>可以看一下我的操作流程：（截图如下）</strong></p><p>1，先提交develop分支上的内容</p><p><img src="'+c+'" alt=""></p><p>2，开始合并到远端master分支</p><p><img src="'+o+`" alt=""></p><h3 id="_2-2-合并主分支的代码到develop分支" tabindex="-1">2.2 合并主分支的代码到develop分支 <a class="header-anchor" href="#_2-2-合并主分支的代码到develop分支" aria-label="Permalink to &quot;2.2 合并主分支的代码到develop分支&quot;">​</a></h3><p>场景描述：比如我在 <code>develop</code> 分支上开发，如何操作才能拉取到主分支 <code>master</code> 的最新代码呢？</p><p><strong>其实这就是上面合并本地代码到主分支的逆向操作。</strong></p><p>命令执行顺序：</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤1、切换到主分支 并拉取最新的master分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> checkout</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pull</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤2、切换回自己的开发分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> checkout</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> develop</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤3、合并主分支代码，这样就拉取到最新的代码啦</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> merge</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="业务场景三" tabindex="-1">业务场景三 <a class="header-anchor" href="#业务场景三" aria-label="Permalink to &quot;业务场景三&quot;">​</a></h2><h3 id="_3-1-临时保存当前工作目录中的所有更改" tabindex="-1">3.1 临时保存当前工作目录中的所有更改 <a class="header-anchor" href="#_3-1-临时保存当前工作目录中的所有更改" aria-label="Permalink to &quot;3.1 临时保存当前工作目录中的所有更改&quot;">​</a></h3><blockquote><p>业务场景描述:我们有时会遇到这样的情况，正在dev分支开发新功能，做到一半时有人过来反馈一个bug，让马上解决，但是新功能做到了一半你又不想提交，这时就可以使用git stash命令先把当前进度（工作区和暂存区）保存起来，然后切换到另一个分支去修改bug，修改完提交后，再切回dev分支，使用git stash pop来恢复之前的进度继续开发新功能。</p></blockquote><p>命令执行顺序：</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤1、先临时储存当前分支的更改</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> checkout</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> stash</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤2、然后去解决bug...</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤3、解决bug之后，切回dev分支，恢复之前储存的更改，继续开发新功能</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> checkout</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> stash</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pop</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>操作截图如下：</p><p>1，先切换到dev分支，然后临时储存当前分支的更改，去解决bug</p><p><img src="`+g+'" alt=""></p><p>2，解决bug之后，切回dev分支，恢复之前储存的更改，继续开发新功能</p><p><img src="'+k+`" alt=""></p><div class="tip custom-block"><p class="custom-block-title">git stash相关命令</p><p>git stash save “test1” ：可以为本次存储起名字，方便以后查找使用</p><p>git stash pop：恢复具体某一次的版本，如果不指定stash_id，则默认恢复最新的存储进度</p><p>git stash apply：将堆栈中的内容应用到当前目录，不同于git stash pop，该命令不会将内容从堆栈中删除，也就说该命令能够将堆栈的内容多次应用到工作目录中，适应于多个分支的情况。</p><p>git stash drop [stash_id]：删除一个存储的进度。如果不指定stash_id，则默认删除最新的存储进度</p></div><h2 id="业务场景四" tabindex="-1">业务场景四 <a class="header-anchor" href="#业务场景四" aria-label="Permalink to &quot;业务场景四&quot;">​</a></h2><h3 id="_4-1-修改仓库的远程地址" tabindex="-1">4.1 修改仓库的远程地址 <a class="header-anchor" href="#_4-1-修改仓库的远程地址" aria-label="Permalink to &quot;4.1 修改仓库的远程地址&quot;">​</a></h3><blockquote><p>业务场景描述：由于服务器的变动，之前的git远程仓库链接不可用，迁移到新的仓库地址，需要修改本地仓库的远程地址。</p></blockquote><p>命令执行顺序：</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤1、查看当然的远程仓库地址</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> remote</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤2、修改远程仓库地址</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> remote</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> set-url</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 新的远程仓库地址</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤3、查看新的远程仓库地址</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> remote</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 步骤4、验证  没提示是最好的提示</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> fetch</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h2 id="业务场景五" tabindex="-1">业务场景五 <a class="header-anchor" href="#业务场景五" aria-label="Permalink to &quot;业务场景五&quot;">​</a></h2><h3 id="_5-1-本地仓库同时关联多个远程仓库-gitee和github" tabindex="-1">5.1 本地仓库同时关联多个远程仓库（gitee和github） <a class="header-anchor" href="#_5-1-本地仓库同时关联多个远程仓库-gitee和github" aria-label="Permalink to &quot;5.1 本地仓库同时关联多个远程仓库（gitee和github）&quot;">​</a></h3><blockquote><p>业务场景描述:我这边的项目是在gitee上面管理的，但我想也想在github上面也管理一份，这样方便我同事查看代码。也就是同时关联两个远程仓库。</p></blockquote><p>由于我之前已经关联了gitee的远程仓库，所以这次只需要关联github的远程仓库。</p><p>命令执行顺序：</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤1：添加github的远程仓库地址；由于我之前关联的gitee的远程仓库别名是origin，所以github的远程仓库为origin-github，区别一下</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> remote</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin-github</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 你的github远程仓库地址</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 步骤2：验证</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> remote</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>操作步骤如下： <img src="`+b+`" alt=""></p><p>下次提交代码时，需要同时推送到gitee和github两个仓库：</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 推送到gitee</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> origin-github</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> master</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 推送到github</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="业务场景六" tabindex="-1">业务场景六 <a class="header-anchor" href="#业务场景六" aria-label="Permalink to &quot;业务场景六&quot;">​</a></h2><h3 id="_5-1-撤销某次提交" tabindex="-1">5.1 撤销某次提交 <a class="header-anchor" href="#_5-1-撤销某次提交" aria-label="Permalink to &quot;5.1 撤销某次提交&quot;">​</a></h3><p>待续更新...</p><h3 id="_5-2-撤销某次合并" tabindex="-1">5.2 撤销某次合并 <a class="header-anchor" href="#_5-2-撤销某次合并" aria-label="Permalink to &quot;5.2 撤销某次合并&quot;">​</a></h3><p>待续更新...</p>`,77)]))}const f=t(u,[["render",F]]);export{_ as __pageData,f as default};
