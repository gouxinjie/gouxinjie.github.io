import{D as l,c,G as m,B as x,o as p}from"./chunks/framework.Dx7Rg_PH.js";const s=[{text:"uniApp",collapsed:!1,items:[{text:"页面常用的生命周期"},{text:"uniApp中使用pinia状态管理库与持久化"},{text:"自动按需引入组件(easycom)"}]},{text:"weixin",collapsed:!1,items:[{text:"微信小程序的登录流程"},{text:"微信小程序返回上一个页面并刷新数据"},{text:"微信小程序页面之间传参的几种方式"}]},{text:"alipay",collapsed:!1,items:[{text:"支付宝不支持将自定义组件当page使用"},{text:"支付宝小程序引导用户开启定位"}]}],d=(n,a=!1)=>(s.forEach(t=>{t.items.length>0&&(t.items=t.items.map((e,i)=>{const o=a?`${n}${t.text}/${e.text}`:`${n}${t.text}/${e.text}.md`,r=a?e.text:`${i+1}. ${e.text}`;return{...e,link:o,text:r}}))}),s),g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"column/miniProgram/index.md","filePath":"column/miniProgram/index.md"}'),f={name:"column/miniProgram/index.md"},u=Object.assign(f,{setup(n){const a=l(d("/column/miniProgram/",!0));return(t,e)=>{const i=x("SearchList");return p(),c("div",null,[m(i,{title:"小程序相关",data:a.value},null,8,["data"])])}}});export{g as __pageData,u as default};