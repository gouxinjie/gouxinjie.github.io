# JavaScript 中不同错误类型的精细化处理指南

[[toc]]
在 JavaScript 开发中，针对不同的错误类型采取相应的处理策略是构建健壮应用的关键。

## 错误类型识别基础

### 1. 使用 `instanceof` 操作符

```javascript
try {
  // 可能抛出错误的代码
  someUndefinedFunction();
} catch (error) {
  if (error instanceof ReferenceError) {
    console.log("引用错误：函数未定义");
  } else if (error instanceof TypeError) {
    console.log("类型错误");
  } else {
    console.log("其他错误：", error.message);
  }
}
```

### 2. 检查错误名称

```javascript
try {
  JSON.parse("无效的 JSON");
} catch (error) {
  switch (error.name) {
    case "SyntaxError":
      console.log("JSON 语法错误");
      break;
    case "TypeError":
      console.log("类型错误");
      break;
    default:
      console.log("未知错误类型:", error.name);
  }
}
```

## 针对不同错误类型的处理策略

### 1. TypeError 处理

```javascript
function safeAccess(obj, property) {
  try {
    return obj[property];
  } catch (error) {
    if (error instanceof TypeError) {
      // 对象为 null 或 undefined
      console.warn("无法访问属性：对象无效");
      return null;
    }
    throw error; // 重新抛出非类型错误
  }
}

// 使用示例
const result = safeAccess(null, "name"); // 返回 null 而不是抛出错误
```

### 2. ReferenceError 处理

```javascript
function checkVariableExists(variableName) {
  try {
    eval(`typeof ${variableName}`); // 谨慎使用 eval
    return true;
  } catch (error) {
    if (error instanceof ReferenceError) {
      return false;
    }
    throw error;
  }
}

// 更安全的方式（在全局作用域中检查）
function globalVariableExists(varName) {
  return varName in window; // 浏览器环境
}
```

### 3. SyntaxError 处理

```javascript
function safeJSONParse(jsonString, defaultValue = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn("JSON 解析失败，使用默认值");
      return defaultValue;
    }
    throw error;
  }
}

// 使用示例
const data = safeJSONParse("{无效的json}", { fallback: "data" });
```

### 4. RangeError 处理

```javascript
function createSafeArray(length, maxLength = 1000000) {
  try {
    if (length > maxLength) {
      throw new RangeError(`数组长度超过最大限制: ${maxLength}`);
    }
    return new Array(length);
  } catch (error) {
    if (error instanceof RangeError) {
      console.warn("数组长度过大，使用安全长度");
      return new Array(maxLength);
    }
    throw error;
  }
}
```

### 5. 网络请求错误处理

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;

      // 根据错误类型决定是否重试
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        console.warn("网络错误，重试中...");
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
}
```

## 创建错误处理工具函数

### 1. 错误类型分类器

```javascript
class ErrorHandler {
  static handle(error, context = "") {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      context,
      type: error.name,
      message: error.message,
      stack: error.stack
    };

    switch (error.name) {
      case "TypeError":
        return this.handleTypeError(errorInfo);
      case "ReferenceError":
        return this.handleReferenceError(errorInfo);
      case "SyntaxError":
        return this.handleSyntaxError(errorInfo);
      case "RangeError":
        return this.handleRangeError(errorInfo);
      case "NetworkError":
        return this.handleNetworkError(errorInfo);
      default:
        return this.handleUnknownError(errorInfo);
    }
  }

  static handleTypeError(errorInfo) {
    console.warn("类型错误处理:", errorInfo);
    // 发送到监控系统
    this.reportToMonitoring(errorInfo);
    return { success: false, error: "操作失败，请检查输入数据" };
  }

  static handleReferenceError(errorInfo) {
    console.error("引用错误:", errorInfo);
    // 开发环境下提供详细错误
    if (process.env.NODE_ENV === "development") {
      return { success: false, error: `开发错误: ${errorInfo.message}` };
    }
    return { success: false, error: "系统错误" };
  }

  static handleSyntaxError(errorInfo) {
    console.warn("语法错误:", errorInfo);
    return { success: false, error: "数据格式错误" };
  }

  static handleNetworkError(errorInfo) {
    console.warn("网络错误:", errorInfo);
    // 重试逻辑或用户提示
    return { success: false, error: "网络连接失败，请重试" };
  }

  static handleUnknownError(errorInfo) {
    console.error("未知错误:", errorInfo);
    this.reportToMonitoring(errorInfo);
    return { success: false, error: "系统发生未知错误" };
  }

  static reportToMonitoring(errorInfo) {
    // 发送错误信息到监控系统
    console.log("上报错误到监控系统:", errorInfo);
  }
}

// 使用示例
try {
  someRiskyOperation();
} catch (error) {
  const result = ErrorHandler.handle(error, "数据处理模块");
  showUserMessage(result.error);
}
```

### 2. Promise 错误处理封装

```javascript
function createSafeAsync(fn, errorHandler) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return errorHandler(error);
    }
  };
}

// 使用示例
const safeFetch = createSafeAsync(fetch, (error) => {
  if (error.name === "TypeError") {
    return { status: "network_error", message: "网络连接失败" };
  }
  return { status: "error", message: "请求失败" };
});

// 使用安全的 fetch
const result = await safeFetch("https://api.example.com/data");
```

### 3. React/Vue 组件中的错误处理

```javascript
// React 错误边界
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 根据错误类型返回不同的状态
    if (error instanceof TypeError) {
      return { hasError: true, errorType: "type", message: "渲染错误" };
    }
    return { hasError: true, errorType: "unknown", message: "未知错误" };
  }

  componentDidCatch(error, errorInfo) {
    // 错误上报
    ErrorHandler.handle(error, "React组件");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>出错了！</h2>
          {this.state.errorType === "type" && <p>请检查数据格式</p>}
          <button onClick={() => this.setState({ hasError: false })}>重试</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

## 实战：API 请求错误处理

```javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options
      });

      if (!response.ok) {
        throw this.createHttpError(response);
      }

      return await response.json();
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  createHttpError(response) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    error.name = "HttpError";
    error.status = response.status;
    return error;
  }

  handleApiError(error) {
    switch (error.name) {
      case "HttpError":
        return this.handleHttpError(error);
      case "TypeError":
        if (error.message.includes("Failed to fetch")) {
          return { error: "network_error", message: "网络连接失败" };
        }
        return { error: "client_error", message: "客户端错误" };
      case "SyntaxError":
        return { error: "parse_error", message: "响应解析失败" };
      default:
        return { error: "unknown_error", message: "未知错误" };
    }
  }

  handleHttpError(error) {
    switch (error.status) {
      case 400:
        return { error: "bad_request", message: "请求参数错误" };
      case 401:
        return { error: "unauthorized", message: "未授权" };
      case 404:
        return { error: "not_found", message: "资源未找到" };
      case 500:
        return { error: "server_error", message: "服务器错误" };
      default:
        return { error: "http_error", message: `HTTP错误: ${error.status}` };
    }
  }
}

// 使用示例
const api = new ApiClient("https://api.example.com");
const result = await api.request("/users");

if (result.error) {
  // 根据错误类型显示不同的用户提示
  switch (result.error) {
    case "network_error":
      showNotification("网络连接失败，请检查网络设置");
      break;
    case "unauthorized":
      redirectToLogin();
      break;
    default:
      showNotification("操作失败，请重试");
  }
}
```

## 总结

精细化错误处理的关键点：

1. **准确识别错误类型**：使用 `instanceof` 和错误名称检查
2. **分类处理**：为不同类型的错误制定不同的处理策略
3. **用户友好的反馈**：根据错误类型提供适当的用户提示
4. **错误上报**：记录和上报错误信息用于监控和调试
5. **优雅降级**：在可能的情况下提供备选方案
