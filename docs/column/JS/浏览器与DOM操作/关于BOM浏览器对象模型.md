# 关于BOM浏览器对象模型

[[toc]]
## 引言

我们知道 JavaScript语言组成包括这三部分：核心（ECMA），文档对象模型（DOM），浏览器对象模型（BOM）；
![在这里插入图片描述](https://img-blog.csdnimg.cn/cb5f94666c1447a5a63757b460fbc1cc.png#pic_center =450x )


那么BOM又有五大对象：如图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f283fd5416aa4eeca7342495668aa9b5.png#pic_center =700x )


## 一、BOM介绍
`Bom：Brower object model`浏览器对象模型 ,一个浏览器的窗口就是一个window对象，定义了一套操作浏览器窗口的API，可以看做js的顶层对象。

**Bom主要由五大对象组成：**

 1. window:浏览器核心对象；
 2. location：包含当前页面的URL信息；
 3. history：history对象主要用于记录你当前窗口的历史记录；
 4. navigator：包含当前浏览器的信息，例如用的什么浏览器，操作系统版本等；
 5. screen：获取用户电脑的屏幕分辨率；


## 二、window对象
 
 window对象：指的是当前浏览器窗口，它是JS中的顶级对象，所有的全局变量都是window对象的属性，比如doument、alert()、setInterval()、setTimeout();

只要是window的属性和方法，在使用的时候都可以省略window;

例如：window.alert() 可以省略window写成alert()
例如：window.document 可以省略window写成document
例如：window.localStorage 和 window.sessionStorage 可以省略window
例如：window.console可以省略window
### window 对象下面的一些属性


 **1，window.name**
 
window.name属性是一个字符串，表示当前浏览器窗口的名字。窗口不一定需要名字，这个属性主要配合超链接和表单的target属性使用。

```javascript
window.name = 'Hello World!';
console.log(window.name)
// "Hello World!"
```

该属性只能保存字符串，如果写入的值不是字符串，会自动转成字符串。各个浏览器对这个值的储存容量有所不同，但是一般来说，可以高达几MB。只要浏览器窗口不关闭，这个属性是不会消失的；


 **2，window.closed，window.opener**
 
 window.closed属性返回一个布尔值，表示窗口是否关闭。

```javascript
window.closed // false
```
上面代码检查当前窗口是否关闭。这种检查意义不大，因为只要能运行代码，当前窗口肯定没有关闭。这个属性一般用来检查，使用脚本打开的新窗口是否关闭。

```javascript
var popup = window.open();
if ((popup !== null) && !popup.closed) {
  // 窗口仍然打开着
}
```

window.opener属性表示打开当前窗口的父窗口。如果当前窗口没有父窗口（即直接在地址栏输入打开），则返回null。

```javascript
window.open().opener === window // true
```
上面表达式会打开一个新窗口，然后返回true。

 **3，window.self，window.window**
 
 window.self和window.window属性都指向窗口本身。这两个属性只读。

```javascript
window.self === window // true
window.window === window // true
```
 **4，window.top，window.parent**
 
 window.top属性指向最顶层窗口，主要用于在框架窗口（frame）里面获取顶层窗口。
window.parent属性指向父窗口。如果当前窗口没有父窗口，window.parent指向自身。

```javascript
if (window.parent !== window.top) {
  // 表明当前窗口嵌入不止一层
}
```

对于不包含框架的网页，这两个属性等同于window对象。
 
 **5，window.status**
 
window.status属性用于读写浏览器状态栏的文本。但是，现在很多浏览器都不允许改写状态栏文本，所以使用这个方法不一定有效。

**6，window.devicePixelRatio**

window.devicePixelRatio属性返回一个数值，表示一个 CSS 像素的大小与一个物理像素的大小之间的比率。也就是说，它表示一个 CSS 像素由多少个物理像素组成。它可以用于判断用户的显示环境，如果这个比率较大，就表示用户正在使用高清屏幕，因此可以显示较大像素的图片。

**7，一些位置信息**

以下属性返回window对象的位置信息和大小信息。

（1）`window.screenX，window.screenY`
window.screenX和window.screenY属性，返回浏览器窗口左上角相对于当前屏幕左上角的水平距离和垂直距离（单位像素）。这两个属性只读。

（2） `window.innerHeight，window.innerWidth`
window.innerHeight和window.innerWidth属性，返回网页在当前窗口中可见部分的高度和宽度，即“视口”（viewport）的大小（单位像素）。这两个属性只读。

用户放大网页的时候（比如将网页从100%的大小放大为200%），这两个属性会变小。因为这时网页的像素大小不变（比如宽度还是960像素），只是每个像素占据的屏幕空间变大了，因为可见部分（视口）就变小了。

注意，这两个属性值包括滚动条的高度和宽度。

（3）`window.outerHeight，window.outerWidth`

window.outerHeight和window.outerWidth属性返回浏览器窗口的高度和宽度，包括浏览器菜单和边框（单位像素）。这两个属性只读。

（4）`window.scrollX，window.scrollY`

window.scrollX属性返回页面的水平滚动距离，window.scrollY属性返回页面的垂直滚动距离，单位都为像素。这两个属性只读。

注意，这两个属性的返回值不是整数，而是双精度浮点数。如果页面没有滚动，它们的值就是0；

（5）`window.pageXOffset，window.pageYOffset`

window.pageXOffset属性和window.pageYOffset属性，是window.scrollX和window.scrollY别名。

**8，一些组件属性**

组件属性返回浏览器的组件对象。这样的属性有下面几个。

window.locationbar：地址栏对象
window.menubar：菜单栏对象
window.scrollbars：窗口的滚动条对象
window.toolbar：工具栏对象
window.statusbar：状态栏对象
window.personalbar：用户安装的个人工具栏对象
这些对象的visible属性是一个布尔值，表示这些组件是否可见。这些属性只读。

```javascript
window.locationbar.visible
window.menubar.visible
window.scrollbars.visible
window.toolbar.visible
window.statusbar.visible
window.personalbar.visible
```
### window 对象常用的一些方法

**1，window.alert()，window.prompt()，window.confirm()**

（1）window.alert()

window.alert()方法弹出的对话框，只有一个“确定”按钮，往往用来通知用户某些信息。

```javascript
window.alert('Hello World');
```

用户只有点击“确定”按钮，对话框才会消失。对话框弹出期间，浏览器窗口处于冻结状态，如果不点“确定”按钮，用户什么也干不了。

window.alert()方法的参数只能是字符串，没法使用 CSS 样式，但是可以用\n指定换行。

```javascript
alert('本条提示\n分成两行');
```

（2）window.prompt()

window.prompt()方法弹出的对话框，提示文字的下方，还有一个输入框，要求用户输入信息，并有“确定”和“取消”两个按钮。它往往用来获取用户输入的数据。

```javascript
var result = prompt('您的年龄？', 25)
```

上面代码会跳出一个对话框，文字提示为“您的年龄？”，要求用户在对话框中输入自己的年龄（默认显示25）。用户填入的值，会作为返回值存入变量result。

window.prompt()的返回值有两种情况，可能是字符串（有可能是空字符串），也有可能是null。具体分成三种情况。

 1. 用户输入信息，并点击“确定”，则用户输入的信息就是返回值。
 2. 用户没有输入信息，直接点击“确定”，则输入框的默认值就是返回值。
 3. 用户点击了“取消”（或者按了 ESC 按钮），则返回值是null。

window.prompt()方法的第二个参数是可选的，但是最好总是提供第二个参数，作为输入框的默认值。

（3）window.confirm()

window.confirm()方法弹出的对话框，除了提示信息之外，只有“确定”和“取消”两个按钮，往往用来征询用户是否同意。

```javascript
var result = confirm('你最近好吗？');
```

上面代码弹出一个对话框，上面只有一行文字“你最近好吗？”，用户选择点击“确定”或“取消”。
confirm方法返回一个布尔值，如果用户点击“确定”，返回true；如果用户点击“取消”，则返回false。

```javascript
var okay = confirm('Please confirm this message.');
if (okay) {
  // 用户按下“确定”
} else {
  // 用户按下“取消”
}
```

confirm的一个用途是，用户离开当前页面时，弹出一个对话框，问用户是否真的要离开。

```javascript
window.onunload = function () {
  return window.confirm('你确定要离开当面页面吗？');
}
```

这三个方法都具有堵塞效应，一旦弹出对话框，整个页面就是暂停执行，等待用户做出反应。

**2，window.open(), window.close()，window.stop()**

（1）window.open()

window.open方法用于新建另一个浏览器窗口，类似于浏览器菜单的新建窗口选项。它会返回新窗口的引用，如果无法新建窗口，则返回null。

```javascript
var popup = window.open('somefile.html');
```

上面代码会让浏览器弹出一个新建窗口，网址是当前域名下的somefile.html。

open方法一共可以接受三个参数。

```javascript
window.open(url, windowName, [windowFeatures])
```

 1. url：字符串，表示新窗口的网址。如果省略，默认网址就是about:blank。
 2. windowName：字符串，表示新窗口的名字。如果该名字的窗口已经存在，则占用该窗口，不再新建窗口。如果省略，就默认使用_blank，表示新建一个没有名字的窗口。另外还有几个预设值，_self表示当前窗口，_top表示顶层窗口，_parent表示上一层窗口。
 3. windowFeatures：字符串，内容为逗号分隔的键值对（详见下文），表示新窗口的参数，比如有没有提示栏、工具条等等。如果省略，则默认打开一个完整
    UI 的新窗口。如果新建的是一个已经存在的窗口，则该参数不起作用，浏览器沿用以前窗口的参数。

（2）window.close()

window.close方法用于关闭当前窗口，一般只用来关闭window.open方法新建的窗口。

```javascript
popup.close()
```

该方法只对顶层窗口有效，iframe框架之中的窗口使用该方法无效。

（3）window.stop()

window.stop()方法完全等同于单击浏览器的停止按钮，会停止加载图像、视频等正在或等待加载的对象。

```javascript
window.stop()
```

（4）浏览器窗口从打开到关闭的三个过程

 1. window.onload:界面上所有内容加载完毕之后才触发这个事件
 2. window.onbeforeunload:界面在关闭之前会触发这个事件
 3. window.onunload:界面在关闭的那一瞬间会触发这个事件

```javascript
//由于我们script标签写在了body标签的上面，这行代码会在body内容还未加载的时候就执行
 console.log ( document.getElementById ( "p1" ) );//null  此时编译器还未解析p标签
 
 //1.window.onload：界面上所有内容加载完毕后会触发
    window.onload = function ( ) {
        // 由于编译器是从上往下解析html文件的，如果我们的js代码写在body前面，就有可能无法获取dom对
        console.log ( "当前界面全部加载完毕" );
        //window.onload无论写在界面什么位置都是等整个界面加载完毕之后才会执行
        console.log ( document.getElementById ( "p1" ) );
    }


    //2.window.onbeforeunload:界面在关闭前触发
      window.onbeforeunload = function () {
        /*  1.这个方法主要用于在界面关闭之前保存一些重要数据
         *   2.也可以弹出一个提示框挽留一下用户
         */
        //return 内容：浏览器会自动弹出一个挽留窗口
        //谷歌和火狐都会拦截这种恶心事，只有IE支持
        return "确定修改已经保存了吗？";
      };

    //3 window.onunload:界面关闭时触发
    window.onunload = function (  ) {
        console.log('界面正在关闭');
     }


```

## 三、location对象
 
 （1）location对象：包含当前页面的URL信息

 - url：统一资源定位符
 - url = 协议名（http） + ip地址（域名） + 端口号 + 资源路径
 - 暂时只需要知道location对象包含一个网页的网络url信息即可，具体的含义将在后面阶段学习网络的时候详细讲解

（2）location对象有三个常用的方法

 1. 打开新网页：location.assign('你要打开的新网页的url')
 2. 替换当前网页：location.replace('要替换的网页url')
 3. 刷新当前网页: location.reload()

```javascript
	//1.location对象信息查看
    console.log ( window.location );//location对象
    console.log(location.hash);//资源定位符（锚点定位）
    console.log(location.host);//主机   host = hostname + port
    console.log(location.hostname);//主机名（ip地址）
    console.log(location.port);//端口号
    console.log(location.href);//完整的url路径
    console.log(location.pathname);//资源路径
    console.log(location.protocol);//url的协议
    console.log(location.search);//url请求的参数

    //2.assign：打开新网页
    document.getElementById('assign').onclick = function (  ) {
        //会留下历史记录（可以回退）
        window.location.assign('http://www.itheima.com');
        //上面这行代码等价于下面这行代码
        //window.location.href = 'http://www.itheima.com';
    }
    //3.replace:替换当前网页
    document.getElementById('replace').onclick = function (  ) {
        //不会留下历史记录（不能回退）
        window.location.replace('http://www.itcast.com');
    }
    //4.刷新当前网页
    document.getElementById('reload').onclick = function (  ) {
        //相当于按了F5刷新当前网页
        window.location.reload();
    }
```
## 四、history对象

window.history属性指向 History 对象，它表示当前窗口的浏览历史。

**1，History.back()、History.forward()、History.go()**

 这三个方法用于在历史之中移动。

History.back()：移动到上一个网址，等同于点击浏览器的后退键。对于第一个访问的网址，该方法无效果。

History.forward()：移动到下一个网址，等同于点击浏览器的前进键。对于最后一个访问的网址，该方法无效果。

History.go()：接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址，比如go(1)相当于forward()，go(-1)相当于back()。如果参数超过实际存在的网址范围，该方法无效果；如果不指定参数，默认参数为0，相当于刷新当前页面。

```javascript
history.back();
history.forward();
history.go(-2);
```
history.go(0)相当于刷新当前页面。

```javascript
history.go(0); // 刷新当前页面
```
注意，移动到以前访问过的页面时，页面通常是从浏览器缓存之中加载，而不是重新要求服务器发送新的网页。

**2，History.pushState()**

History.pushState()方法用于在历史中添加一条记录。

```javascript
window.history.pushState(state, title, url)
```

该方法接受三个参数，依次为：

 1. `state`：一个与添加的记录相关联的状态对象，主要用于popstate事件。该事件触发时，该对象会传入回调函数。也就是说，浏览器会将这个对象序列化以后保留在本地，重新载入这个页面的时候，可以拿到这个对象。如果不需要这个对象，此处可以填null。
 2. `title`：新页面的标题。但是，现在所有浏览器都忽视这个参数，所以这里可以填空字符串。
 3. `url`：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。


假定当前网址是example.com/1.html，使用pushState()方法在浏览记录（History 对象）中添加一个新记录。

```javascript
var stateObj = { foo: 'bar' };
history.pushState(stateObj, 'page 2', '2.html');
```
**3，History.replaceState()**

History.replaceState()方法用来替换掉当前的历史记录，其他都与pushState()方法一模一样。

假定当前网页是example.com/example.html。

```javascript
history.pushState({page: 1}, 'title 1', '?page=1')
// URL 显示为 http://example.com/example.html?page=1
history.pushState({page: 2}, 'title 2', '?page=2');
// URL 显示为 http://example.com/example.html?page=2
history.replaceState({page: 3}, 'title 3', '?page=3');
// URL 显示为 http://example.com/example.html?page=3
history.back()
// URL 显示为 http://example.com/example.html?page=1
history.back()
// URL 显示为 http://example.com/example.html
history.go(2)
// URL 显示为 http://example.com/example.html?page=3
```
**4，popstate 事件**

每当同一个文档的浏览历史（即history对象）出现变化时，就会触发popstate事件。

`注意：`仅仅调用pushState()方法或replaceState()方法 ，并不会触发该事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用History.back()、History.forward()、History.go()方法时才会触发。另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

使用的时候，可以为popstate事件指定回调函数。

```javascript
window.onpopstate = function (event) {
  console.log('location: ' + document.location);
  console.log('state: ' + JSON.stringify(event.state));
};
// 或者
window.addEventListener('popstate', function(event) {
  console.log('location: ' + document.location);
  console.log('state: ' + JSON.stringify(event.state));
});
```
回调函数的参数是一个event事件对象，它的state属性指向pushState和replaceState方法为当前 URL 所提供的状态对象（即这两个方法的第一个参数）。上面代码中的event.state，就是通过pushState和replaceState方法，为当前 URL 绑定的state对象。

这个state对象也可以直接通过history对象读取。

```javascript
var currentState = history.state;
```

注意，页面第一次加载的时候，浏览器不会触发popstate事件。

## 五、navigator对象

window.navigator属性指向一个包含浏览器和系统信息的 Navigator 对象。脚本通过这个属性了解用户的环境信息。

```javascript
	console.log ( navigator );//navigator对象
    console.log ( navigator.appVersion );//当前浏览器版本信息
    console.log ( navigator.platform );//当前浏览器的硬件平台
    console.log ( navigator.userAgent );//当前浏览器信息

    //使用场景1：判断当前用户的操作系统是32位还是64位
    //谷歌和IE  64位显示WOW64    火狐显示Win64
    if(navigator.userAgent.indexOf('WOW64') != -1 || navigator.userAgent.indexOf('Win64') != -1){
        console.log ( "64位" );
    }else{
        console.log ( "32位" );
    }

    //使用场景2：判断用户当前使用哪种浏览器
    if(navigator.userAgent.indexOf('Chrome') != -1){
        console.log ( "谷歌浏览器" );
    }else if(navigator.userAgent.indexOf('Firefox') != -1){
        console.log ( "火狐浏览器" );
    }else{
        console.log ( "IE浏览器" );//也有可能是其他小众浏览器，可以忽略不计
    }
```

通过userAgent也可以大致准确地识别手机浏览器，方法就是测试是否包含`mobi`字符串。

```javascript
var ua = navigator.userAgent.toLowerCase();
if (/mobi/i.test(ua)) {
  // 手机浏览器
} else {
  // 非手机浏览器
}
```
## 六、screen对象

Screen 对象表示当前窗口所在的屏幕，提供显示设备的信息。window.screen属性指向这个对象。

该对象有下面的属性。

 1. `Screen.height`：浏览器窗口所在的屏幕的高度（单位像素）。除非调整显示器的分辨率，否则这个值可以看作常量，不会发生变化。显示器的分辨率与浏览器设置无关，缩放网页并不会改变分辨率。
 2. `Screen.width`：浏览器窗口所在的屏幕的宽度（单位像素）。
 3. `Screen.availHeight`：浏览器窗口可用的屏幕高度（单位像素）。因为部分空间可能不可用，比如系统的任务栏或者 Mac
    系统屏幕底部的 Dock 区，这个属性等于height减去那些被系统组件的高度。
 4. `Screen.availWidth`：浏览器窗口可用的屏幕宽度（单位像素）。
 5. `Screen.pixelDepth`：整数，表示屏幕的色彩位数，比如24表示屏幕提供24位色彩。
 6. `Screen.colorDepth`：Screen.pixelDepth的别名。严格地说，colorDepth
    表示应用程序的颜色深度，pixelDepth 表示屏幕的颜色深度，绝大多数情况下，它们都是同一件事。
 7. `Screen.orientation`：返回一个对象，表示屏幕的方向。该对象的type属性是一个字符串，表示屏幕的具体方向，landscape-primary表示横放，landscape-secondary表示颠倒的横放，portrait-primary表示竖放，portrait-secondary。

下面是Screen.orientation的例子。

```javascript
window.screen.orientation
// { angle: 0, type: "landscape-primary", onchange: null }
```

下面的例子保证屏幕分辨率大于 1024 x 768。

```javascript
if (window.screen.width >= 1024 && window.screen.height >= 768) {
  // 分辨率不低于 1024x768
}
```

下面是根据屏幕的宽度，将用户导向不同网页的代码。

```javascript
if ((screen.width <= 800) && (screen.height <= 600)) {
  window.location.replace('small.html');
} else {
  window.location.replace('wide.html');
}
```
