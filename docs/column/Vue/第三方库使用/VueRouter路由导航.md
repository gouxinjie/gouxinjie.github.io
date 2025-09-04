# 一文看懂 vueRouter 路由导航守卫

[[toc]]

## 导航守卫

::: tip 介绍正如其名，vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的。

本篇文章只介绍常用的路由守卫，像 beforeResolve，beforeRouteUpdate，beforeRouteLeave 这种不常用的不在介绍；

感兴趣的可以看一下官网：[vue-Router](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html) 
:::

## 导航守卫回调参数：

**注意**：以下介绍的路由守卫里面都会具一个有相同参数的回调函数，如下：

```javascript
router.beforeEach((to, from, next) => {
  // 返回 false 以取消导航
  return false;
});
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，每个守卫方法接收三个参数：

- `to: 即将要进入的目标`
- `from: 当前导航正要离开的路由`
- `next：他是重要的一个参数`

::: info 解释

1，但凡涉及到有 next 参数的钩子，必须调用 next() 才能继续往下执行下一个钩子，否则路由跳转等会停止。

2，如果要中断当前的导航要调用 next(false)。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。（主要用于登录验证不通过的处理） 

3，当然 next 可以这样使用，next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。意思是当前的导航被中断，然后进行一个新的导航。可传递的参数与 router.push 中选项一致。

4，在 beforeRouteEnter 钩子中 next((vm)=>{})内接收的回调函数参数为当前组件的实例 vm，这个回调函数在生命周期 mounted 之后调用，也就是，他是所有导航守卫和生命周期函数最后执行的那个钩子。

5，next(error): (v2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。

6，next 在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次， 但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错
:::


## 1，全局前置守卫（beforeEach ）

> `beforeEach`相当于大门的守卫，每个人（路由）进来之前都要检查一下，看是否符合条件，有权拒绝你进来；
> 
> 项目中我们经常会在这个守卫中判断用户是否登陆，没有登陆就直接跳到 login 页面去登陆，已登录过的可能还要检查 token 是否过期，否则也提示重新登陆，主要代码如下：
> 

::: warning 注意
next()函数必须要有 否则路由不会跳转，显示空白页；
:::


```javascript
// 如果想要使用路由守卫 先要配置路由和机型实例化
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

/* 全局前置守卫  */
router.beforeEach((to, from, next) => {
  //如果去的是登陆页就直接进
  if (to.path == "/login") {
    next();
    return;
  }
  //如果去的是其他页面，验证是否有token （说明登录成功） 不然直接跳登录页面
  if (localStorage.getItem("token")) {
    next();
    return;
  }
  next("/login"); //上面的不过的话 进入login页面
});
```

## 2，全局后置守卫（afterEach）

> `afterEach`是进入某个路由之后触发的钩子函数；通常有以下作用： 

1，修改 每个页面的 title ，首先在路由元中 meta 添加一个 title 属性，然后用`document.title=to.meta.title` 修改当前也买你的 title 

2,每次切换页面的时候，让页面滚动到最顶部；代码如下：

```javascript
/* 全局后置守卫 */
router.afterEach((to, from, nex) => {
  document.title = to.meta.title; // 1，修改当前页面的标题
  window.scrollTo(0, 0); // 2,每次切换页面的时候，让页面滚动到最顶部
});
```

## 3，路由独享守卫 （beforeEnter）

> `beforeEnter`路由独享守卫是写在每个路由里面的单独函数，每个路由都可以写，只在进入此路由时触发；通常我们在这个守卫里面判断想要进入此路由的这个人的身份；看符不符合或有没有权限进来；

```javascript
 	// 西瓜播放器页面 beforeEnter介绍
      {
        path: '/xgplayer',
        name: 'Xgplayer',
        meta: { title: '西瓜播放器' },
        component: () => import('../views/xgplayer/xgplayer.vue'),

        /* 路由独享守卫 只在进入路由时触发  不想让进可以直接 return false */
        beforeEnter: (to, from,next) => {
         if (to.path == '/login') {
              next()
         } else {
              alert('请登入');
              next('/login')
         	}
        },
      },
```

## 4，组件内部守卫 1（beforeRouteEnter）

> `beforeRouteEnter`是组件内部的守卫，写法与 mounted()周期函数同级；


> 我经常用来在进入组件的时候来判断是什么路由进来的，并相应的做一些处理；比如取一些缓存数据和请求数据；如下案例：
>  
::: warning 注意
beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。不过，你可以通过传一个回调给 next 来访问组件实例。

在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数；
:::

```javascript
  // 路由钩子函数
  beforeRouteEnter(to, from, next) {
    let { name } = from;
    //判断进来的路由
    if (name === "detailsQuery") {
      next((vm) => {
        let cacheObj = JSON.parse(localStorage.getItem("taskDetailsCache"));
        // 如果之前有缓存值 那么给入参赋缓存值 然后请求数据
        if (cacheObj) {
          vm.cacheObj = cacheObj;
          // 开始请求数据
          vm.queryParams.taskLevelOne = vm.cacheObj.taskLevelOne;
          vm.queryParams.taskLevelTwo = vm.cacheObj.taskLevelTwo;
          vm.queryParams.isAbandon = vm.cacheObj.isAssign;
          vm.queryParams.status = vm.cacheObj.isStatus;
          vm.queryParams.isVisit = vm.cacheObj.isVisit;
          // 请求数据
          vm.particularsQuery();
        }
      });
    } else {
      next(); // 必须要有next() 否则页面不会跳转
    }
  },
  methods:{
	  particularsQuery(){
	  		...请求接口
	  }
  }
```

## 5，组件内部守卫 2（beforeRouteUpdate）

> 未使用过，不在进行介绍；可以直接访问组件实例 `this`；

## 6，组件内部守卫 3（beforeRouteLeave）

> `beforeRouteLeave`在导航离开渲染该组件的对应路由时调用；与 `beforeRouteUpdate` 一样，它也可以直接访问组件实例 `this`；

::: tip 提示
这个 离开守卫 通常用来预防用户在还未保存修改前突然离开。该导航可以通过返回 false 来取消。
:::

```javascript
// 组件内部守卫3
beforeRouteLeave (to, from) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (!answer) return false
}

```

## 7，完整的导航解析流程

1.  导航被触发。
2.  在失活的组件里调用 beforeRouteLeave 守卫。
3.  调用全局的 beforeEach 守卫。
4.  在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
5.  在路由配置里调用 beforeEnter。
6.  在被激活的组件里调用 beforeRouteEnter。
7.  调用全局的 beforeResolve 守卫(2.5+)。
8.  导航被确认。
9.  调用全局的 afterEach 钩子。
10. 触发 DOM 更新。
11. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
