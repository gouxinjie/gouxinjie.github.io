# AJAX 与 Axios 解析

## 一、AJAX 技术基础

### 1.1 什么是 AJAX？

`AJAX（Asynchronous JavaScript and XML）`是一种无需重新加载整个页面的情况下，能够更新部分网页的技术。核心对象是`XMLHttpRequest`。

```javascript
// 原生AJAX示例
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.example.com/data", true);
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.error("请求失败");
  }
};
xhr.onerror = function () {
  console.error("请求出错");
};
xhr.send();
```

### 1.2 AJAX 核心特点

- **异步通信**：不阻塞页面交互
- **局部更新**：无需刷新整个页面
- **多种数据格式**：支持 XML、JSON、HTML 等
- **事件驱动**：通过回调函数处理响应

## 二、Axios 库详解

### 2.1 Axios 简介

`Axios` 是一个基于 `Promise` 的 `HTTP` 客户端，适用于浏览器和 `Node.js `环境。

```bash
# 安装Axios
npm install axios
# 或通过CDN
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

### 2.2 基础使用

```javascript
// GET请求
axios
  .get("/user?ID=12345")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// POST请求
axios
  .post("/user", {
    firstName: "John",
    lastName: "Doe"
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

## 三、Axios 核心特性

### 3.1 请求配置

```javascript
axios({
  method: "post",
  url: "/user/12345",
  data: {
    firstName: "John",
    lastName: "Doe"
  },
  headers: { "X-Custom-Header": "foobar" },
  timeout: 1000,
  responseType: "json"
});
```

### 3.2 全局配置

```javascript
// 设置全局基础URL
axios.defaults.baseURL = "https://api.example.com";

// 设置全局请求头
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

// 设置POST默认Content-Type
axios.defaults.headers.post["Content-Type"] = "application/json";
```

### 3.3 拦截器机制

```javascript
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response.status === 401) {
      // 处理未授权情况
    }
    return Promise.reject(error);
  }
);
```

## 四、AJAX 与 Axios 对比

| 特性              | 原生 AJAX (XHR) | Axios             |
| ----------------- | --------------- | ----------------- |
| **语法**          | 回调函数        | Promise-based     |
| **浏览器支持**    | 所有主流浏览器  | 所有主流浏览器    |
| **请求取消**      | 原生支持        | 通过 cancel token |
| **JSON 自动转换** | 需要手动处理    | 自动转换          |
| **CSRF 防护**     | 需要手动实现    | 内置支持          |
| **上传进度**      | 支持            | 支持              |
| **HTTP 拦截**     | 不支持          | 拦截器机制        |
| **并发请求**      | 需要手动实现    | axios.all/spread  |

## 五、Axios 高级用法

### 5.1 并发请求

```javascript
function getUserAccount() {
  return axios.get("/user/12345");
}

function getUserPermissions() {
  return axios.get("/user/12345/permissions");
}

axios.all([getUserAccount(), getUserPermissions()]).then(
  axios.spread((acct, perms) => {
    // 两个请求都完成后执行
  })
);
```

### 5.2 取消请求

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get("/user/12345", {
    cancelToken: source.token
  })
  .catch((thrown) => {
    if (axios.isCancel(thrown)) {
      console.log("请求取消", thrown.message);
    } else {
      // 处理错误
    }
  });

// 取消请求
source.cancel("用户取消了请求");
```

### 5.3 文件上传与进度监控

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

axios.post("/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(percentCompleted);
  }
});
```

## 六、错误处理最佳实践

### 6.1 统一错误处理

```javascript
// 创建axios实例
const apiClient = axios.create({
  baseURL: "https://api.example.com"
});

// 响应拦截器统一处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 服务器返回了非2xx的响应
      switch (error.response.status) {
        case 401:
          // 跳转到登录页
          break;
        case 403:
          // 显示权限不足提示
          break;
        case 500:
          // 显示服务器错误
          break;
        default:
          console.error("请求错误:", error.message);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error("无响应:", error.message);
    } else {
      // 发送请求时出错
      console.error("请求设置错误:", error.message);
    }
    return Promise.reject(error);
  }
);
```

### 6.2 错误类型判断

```javascript
axios.get("/user/12345").catch((error) => {
  if (error.response) {
    // 请求已发出且服务器响应状态码不在2xx范围
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // 请求已发出但没有收到响应
    console.log(error.request);
  } else {
    // 发送请求时出现异常
    console.log("Error", error.message);
  }
  console.log(error.config);
});
```

## 七、Axios 请求封装

### 7.1、新建 myAxios.js 和 backend.js

`myAxios.js` 主要是对 `axios` 的封装，而 `backend.js` 是对后端状态码的判断；

**myAxios.js:**

```javascript
import Axios from "axios";
import { ErrorToken, GlobalResponseCode, BusinessResponseCode, ApiResult } from "@/api/backend";
import router from "@/router";

// 全局配置
const axios = Axios.create({
  timeout: 60 * 1000, // 超时时间 1分钟
  headers: { "Content-Type": "application/json;charset=UTF-8" } // axios默认的请求类型 json类型进行传输
});

/* 请求拦截处理token的情况 请求头里面可以随意添加属性 */
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authToken = token;
  }
  return config;
});

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    // 我们一般在这里处理，请求成功后的错误状态码 例如状态码是500，404，403
    return Promise.resolve(response);
  },
  (error) => {
    // 服务器响应发生错误时的处理
    Promise.reject(error);
  }
);

/* 定义类 */
/* 注意 get多次相同的请求会出现304  post就不会 */
class MyAxios {
  // 1，get请求
  get(url, params) {
    console.log("params", params);
    return this.request(axios.get(url, params));
  }
  // 2，post请求
  post(url, data) {
    return this.request(axios.post(url, data));
  }
  // 3，put请求
  put(url) {
    return this.request(axios.put(url));
  }

  /**统一响应封装 */
  async request(axiosRequest) {
    try {
      const res = await axiosRequest; // axios请求会返回一个promise所以此处使用await进行接收 如果有异常使用 try catch进行捕获
      // 请求失败的情况
      if (!res.data || res.data.code != "000000") {
        this.resCodePrompt(res.data.code);
        console.warn("SeverError", res);
        // 处理失败结果
        return new ApiResult().setError(res.data);
      }
      // 请求成功的处理
      return new ApiResult().setSuccess(res.data);
    } catch (error) {
      // TODO 这里需要验证失败的情况
      const res = error.response;
      // 根据状态吗进行提示
      this.resErrorPrompt(res);
      return new ApiResult().setNetworkError();
    }
  }

  /**效验返回码 */
  resCodePrompt(resCode) {
    // 判断是否是token的问题
    if (ErrorToken.includes(resCode)) {
      this.$message({ type: "error", message: "登录凭证无效，请重新登录" });
      router.push("/login");
    }
    // 判断不是token的问题
    const message = GlobalResponseCode[resCode] || BusinessResponseCode[resCode];
    if (message) {
      return this.$message({ type: "error", message: "登录凭证无效，请重新登录" });
    }
  }

  /**错误的返回码处理 */
  resErrorPrompt(res) {
    if (!res) {
      this.$message({ type: "error", message: "网络错误！" });
    } else if (res.status === 404) {
      this.$message({ type: "error", message: "找不到资源！" });
    } else if (res.status === 500) {
      this.$message({ type: "error", message: "内部错误！" });
    } else {
      // 其余统一提示状态码
      this.$message({ type: "error", message: `${res.status}` });
    }
  }
}

export const myAxios = new MyAxios();
```

**backend.js**

```javascript
/**结果封装 */
export class ApiResult {
  /**请求是否成功 */
  isSuccess = false;
  /**请求结果状态 */
  stu = RequestStu.success;
  /**状态码 */
  code = "000000";
  /**描述信息 */
  msg = "";
  /**请求结果数据 */
  data = null;

  /**后端返回成功 */
  setSuccess(res) {
    this.isSuccess = true;
    this.stu = RequestStu.success;
    this.msg = res.msg;
    this.data = res.data;
    this.code = res.code;
    console.log("this:", this);
    return this;
  }

  /** 后端返回失败 */
  setError(res) {
    this.stu = RequestStu.error;
    this.msg = res.msg;
    this.code = res.code;
    return this;
  }

  /** 网络错误 */
  setNetworkError() {
    this.stu = RequestStu.networkError;
    return this;
  }
}

/**错误响应吗 关于token验证的 */
export const ErrorToken = ["000002", "000003", "000004"];

/**全局响应码 000000--000100（包括000000和000100）*/
export const GlobalResponseCode = {
  /**成功*/
  "000000": "成功",
  /**请求失败 */
  "000001": "请求失败",
  /**令牌为空 */
  "000002": "请重新登录",
  /**令牌过期 */
  "000003": "请重新登录",
  /**令牌无效 */
  "000004": "请重新登录",
  /**非法请求 */
  "000005": "非法请求",
  /**参数非法 */
  "000006": "参数非法",
  /**参数为空 */
  "000007": "数据为空"
};

/**关于业务逻辑上的响应码 */
export const BusinessResponseCode = {
  /**账号不存在 */
  "000101": "账号信息有误,请确认",
  /**图片验证码不一致 */
  "000102": "图片验证码有误",
  /**短信验证码不一致 */
  "000103": "短信验证码错误",
  /**与保单绑定的手机号不一致 */
  "000104": "手机号有误,请确认",
  /**未勾选同意条款 */
  "000105": "请先勾选保单设计须知。",
  /**短信验证码获取频繁 */
  "000106": "短信验证码获取频繁",
  /**修改保单失败 */
  "000107": "修改失败",
  /**添加保单信息失败 */
  "000108": "添加保单信息失败",
  /**保单已存在 */
  "000109": "保单已存在",
  /**内部错误 */
  "000110": "内部错误",
  /**保单设计已完成 */
  "000111": "保单设计已完成",
  /**获取图片信息失败 */
  "000112": "获取图片失败,请刷新重试",
  "000113": "图片保存失败,请重试",
  "000114": "上传文件过大,请重新上传",
  "000115": "文件上传失败,请重新上传",
  "000116": "已参加该活动",
  "000117": "活动已结束",
  "000118": "参加的活动不存在"
};

/**请求状态 */
export const RequestStu = {
  /** 请求成功 */
  success: "success",
  /** 请求错误 */
  error: "error",
  /** 连接失败 */
  networkError: "networkError"
};
```

### 7.2、使用

**1，比如有一个登陆接口，我们需要封装一下：**

```javascript
import { myAxios } from "../myAxios";
const prefix = "/backend";
export default {
  /*  请求登录接口 get请求  普通的get请求和post请求 */
  queryLogin(mobileNo) {
    return myAxios.get(`${prefix}/api/user/login`, mobileNo);
  }
};
```

**2，然后再 vue 组件中请求这个接口：**

```javascript
 methods: {
    async handleLogin() {
      // 非空判断
      if (!this.loginForm.account || !this.loginForm.password) {
        return this.$message('账号或者密码不能为空！');
      }
      // 调用此接口  解构数据
      const { isSuccess, data, code } = await api.login.queryLogin({
        account: 'xinjie1',
        password: '123456789',
      });
      // 请求失败的处理
      if (!isSuccess) {
        return this.$message({ type: 'error', message: code });
      }
      // 请求成功的处理 data
      console.log(data)
    }
  }
```

**3，vue 配置接口代理，解决开发环境中的跨域问题；vue.config.js 配置如下：**

```javascript
// 服务端ip  需要代理的地址
const api = 'http://10.11.12.181:26341';
  /* 开发环境跨域情况的代理配置 */
  devServer: {
    /* 接口代理器设置 可以配置多个*/
    proxy: {
      '/backend': {
        // 实际访问的服务器地址
        target: api,
        // 控制服务器收到的请求头中Host字段的值  host就是主机名加端口号  实际上就是欺骗后端服务器
        changeOrigin: true,
        // 是否启用websockets
        ws: false,
        // 重写请求路径  开头是/api的替换为 空串
        pathRewrite: { '/api': '' },
      },
    },
  },
```

**4，如果是上传文件，需要使用 formData，接口封装需要处理一下：**

```javascript
import { myAxios } from "../myAxios";
const prefix = "/backend";
export default {
  /* formData 文件上传 */
  uploadImg(policyId, policyNo, file) {
    const formData = new FormData();
    formData.append("policyId", policyId.toString());
    formData.append("policyNo", policyNo);
    formData.append("uploadFile", file);
    // 添加文件上传的请求头
    const axiosConfig = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 10000, //超时时间
      // 表示允许在向服务器发送前，修改请求数据
      transformRequest: [
        function (data, headers) {
          return data;
        }
      ]
    };
    return myAxios.post(`${prefix}/api/user/uploadImg`, formData, { axiosConfig: axiosConfig });
  }
};
```
