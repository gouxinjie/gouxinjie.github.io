/* html和css网址导航页面数据 **/
const siteData = [
  {
    title: "HTML相关",
    items: [
      {
        icon: "",
        name: "W3C-HTML5",
        desc: "w3c组织开源的HTML5开发文档",
        link: "https://www.w3.org/html/ig/zh/wiki/HTML5L"
      },
      {
        icon: "",
        name: "HTML指南",
        desc: "MDN的HTML指南",
        link: "https://developer.mozilla.org/zh-CN/docs/Web/HTML"
      },
      {
        icon: "",
        name: "HTML5产业联盟",
        desc: "HTML5中国产业联盟，是工信部下属单位，HTML5+规范",
        link: "https://www.html5plus.org/"
      },
      {
        icon: "",
        name: "Can I Use",
        desc: "检测桌面和移动浏览器支持HTML5，CSS3，SVG等的兼容性表",
        link: "https://caniuse.com/"
      },
      {
        icon: "",
        name: "HTML Living Standard",
        desc: "HTML最新标准文档",
        link: "https://html.spec.whatwg.org/"
      },
      {
        icon: "",
        name: "HTML Validator",
        desc: "W3C官方HTML验证器",
        link: "https://validator.w3.org/"
      },
      {
        icon: "",
        name: "HTML Reference",
        desc: "全面的HTML元素和属性参考",
        link: "https://htmlreference.io/"
      },
      {
        icon: "",
        name: "HTML DOM",
        desc: "HTML DOM参考手册",
        link: "https://www.w3schools.com/jsref/dom_obj_document.asp"
      },
      {
        icon: "",
        name: "HTML5 Boilerplate",
        desc: "专业的前端模板",
        link: "https://html5boilerplate.com/"
      },
      {
        icon: "",
        name: "HTML5 Test",
        desc: "测试浏览器对HTML5的支持程度",
        link: "https://html5test.com/"
      }
    ]
  },
  {
    title: "CSS综合",
    items: [
      {
        icon: "",
        name: "CSS开发指南",
        desc: "MDN-Web开发者指南-css开发指南",
        link: "https://developer.mozilla.org/zh-CN/docs/Learn/CSS"
      },
      {
        icon: "",
        name: "CSS Tricks",
        desc: "CSS技巧和教程大全",
        link: "https://css-tricks.com/"
      },
      {
        icon: "",
        name: "CSS Reference",
        desc: "全面的CSS属性参考",
        link: "https://cssreference.io/"
      },
      {
        icon: "",
        name: "browserhacks-浏览器hack大全",
        desc: "浏览器CSS和JS Hack 大全",
        link: "http://browserhacks.com/"
      },
      {
        icon: "",
        name: "Animate.css动画库",
        desc: "内置了很多典型的css3动画",
        link: "https://animate.style/"
      },
      {
        icon: "",
        name: "Hover.css",
        desc: "纯CSS3鼠标滑过效果动画库",
        link: "http://ianlunn.github.io/Hover/"
      },
      {
        icon: "",
        name: "Purgecss",
        desc: "删除未使用的 CSS 代码的工具",
        link: "https://www.purgecss.cn/"
      },
      {
        icon: "",
        name: "CSS Grid Generator",
        desc: "可视化CSS网格生成器",
        link: "https://cssgrid-generator.netlify.app/"
      },
      {
        icon: "",
        name: "Flexbox Froggy",
        desc: "Flex布局学习游戏",
        link: "https://flexboxfroggy.com/"
      },
      {
        icon: "",
        name: "Clippy",
        desc: "CSS clip-path生成器",
        link: "https://bennettfeely.com/clippy/"
      },
      {
        icon: "",
        name: "CSS Gradient",
        desc: "CSS渐变生成器",
        link: "https://cssgradient.io/"
      },
      {
        icon: "",
        name: "Neumorphism",
        desc: "新拟态风格生成器",
        link: "https://neumorphism.io/"
      },
      {
        icon: "",
        name: "CSS Stats",
        desc: "分析网站CSS统计数据",
        link: "https://cssstats.com/"
      }
    ]
  },
  {
    title: "CSS预处理器",
    items: [
      {
        icon: "",
        name: "Sass",
        desc: "世界上最成熟、稳定、强大的专业级 CSS 扩展语言",
        link: "https://sass.bootcss.com/"
      },
      {
        icon: "",
        name: "Less",
        desc: "一门向后兼容的 CSS 扩展语言",
        link: "https://less.bootcss.com/"
      },
      {
        icon: "",
        name: "Stylus",
        desc: "富于表现力、动态的、健壮的 CSS",
        link: "https://stylus-lang.com/"
      },
      {
        icon: "",
        name: "PostCSS",
        desc: "用JavaScript转换CSS的工具",
        link: "https://postcss.org/"
      },
      {
        icon: "",
        name: "SassMeister",
        desc: "在线Sass/Scss编译工具",
        link: "https://www.sassmeister.com/"
      },
      {
        icon: "",
        name: "CSSO",
        desc: "CSS优化器",
        link: "https://css.github.io/csso/csso.html"
      }
    ]
  },
  {
    title: "CSS原子化",
    items: [
      {
        icon: "",
        name: "Tailwind CSS",
        desc: "只需书写 HTML 代码，无需书写 CSS，即可快速构建美观的网站",
        link: "https://www.tailwindcss.cn/"
      },
      {
        icon: "",
        name: "UnoCSS",
        desc: "即时按需原子CSS引擎",
        link: "https://unocss.dev/"
      },
      {
        icon: "",
        name: "Windi CSS",
        desc: "下一代实用为先的CSS框架，它支持按需生成",
        link: "https://windicss.org/"
      },
      {
        icon: "",
        name: "Tachyons",
        desc: "快速构建响应式界面的CSS框架",
        link: "https://tachyons.io/"
      },
      {
        icon: "",
        name: "Bulma",
        desc: "基于Flexbox的现代CSS框架",
        link: "https://bulma.io/"
      }
    ]
  },
  {
    title: "CSS框架",
    items: [
      {
        icon: "",
        name: "Bootstrap",
        desc: "最流行的前端CSS框架",
        link: "https://getbootstrap.com/"
      },
      {
        icon: "",
        name: "Foundation",
        desc: "响应式前端框架",
        link: "https://get.foundation/"
      },
      {
        icon: "",
        name: "Materialize",
        desc: "基于Material Design的CSS框架",
        link: "https://materializecss.com/"
      },
      {
        icon: "",
        name: "Semantic UI",
        desc: "语义化的前端框架",
        link: "https://semantic-ui.com/"
      },
      {
        icon: "",
        name: "Pure.css",
        desc: "轻量级响应式CSS框架",
        link: "https://purecss.io/"
      }
    ]
  },
  {
    title: "CSS创新工具",
    items: [
      {
        icon: "",
        name: "CSS Scan",
        desc: "一键复制网页元素的CSS",
        link: "https://getcssscan.com/"
      },
      {
        icon: "",
        name: "Glassmorphism Generator",
        desc: "毛玻璃效果生成器",
        link: "https://ui.glass/generator/"
      },
      {
        icon: "",
        name: "Shape Divider",
        desc: "自定义形状分隔线生成器",
        link: "https://www.shapedivider.app/"
      },
      {
        icon: "",
        name: "CSS Filter Generator",
        desc: "CSS滤镜生成器",
        link: "https://www.cssfilters.co/"
      },
      {
        icon: "",
        name: "Keyframes App",
        desc: "可视化CSS动画编辑器",
        link: "https://keyframes.app/"
      }
    ]
  },
  {
    title: "图标库",
    items: [
      {
        icon: "",
        name: "Iconfont",
        desc: "国内功能很强大且图标内容很丰富的矢量图标库，提供矢量图标下载、在线存储、格式转换等功能",
        link: "https://www.iconfont.cn/"
      },
      {
        icon: "",
        name: "IconPark 图标库",
        desc: "字节跳动开源的高质量图标库，超过2000个图标，支持多主题和定制",
        link: "https://iconpark.oceanengine.com/official"
      },
      {
        icon: "",
        name: "Iconify 图标库",
        desc: "一个图标库，提供超过 1000 个图标，支持自定义图标和图标集",
        link: "https://iconify.design/"
      }
    ]
  }
];

export default siteData;
