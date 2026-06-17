const e=`# SSE 流式传输实现 ai 聊天案例

[[toc]]

**效果如下：**

![](../images/stream.gif)

当前实现的流式接收最流行的方案是 \`Fetch API + ReadableStream\`;

不使用\`EventSource\`因为它有以下缺点：

1. 不支持自定义协议头
2. 不支持自定义状态码
3. 浏览器兼容性不够

另外还要介绍一下 \`@microsoft/fetch-event-source\` 这个库，它是微软官方提供的一个用于处理 SSE 流式传输的库。

## 一、Fetch API + ReadableStream 使用（推荐）

\`fetch\`接口返回的\`Response\`对象有一个 body 属性，它是一个\`ReadableStream\`对象。这个 \`ReadableStream\` 对象可以用来读取响应体中的流式数据。

\`ReadableStream.getReader()\` 创建一个读取器并将流锁定于其上。一旦流被锁定，其他读取器将不能读取它，直到它被释放 \`new TextDecoder()\` 它可以将从流中读取的二进制数据块逐步解码为可读的文本。

\`\`\`js
const response = await fetch("https://example.com/streaming-data");
const reader = response.body.getReader();
const decoder = new TextDecoder("utf-8");
\`\`\`

**完整使用案例如下：**

\`\`\`js
const response = await fetch('https://example.com/streaming-data');
const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');

let fullContent = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  fullContent += chunk;

  console.log('接收到的数据块:', chunk);
}

console.log('完整内容:', fullContent);

## 流式数据有时会被截断的处理 使用缓冲区
const response = await fetch('https://example.com/streaming-data');
const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');

let fullContent = '';
let buffer = ''; // 用于存储未解码的字节

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  // 解码当前数据块
  const chunk = decoder.decode(value, { stream: true });

  // 将缓冲区中的数据和当前数据块拼接
  buffer += chunk;

  // 检查是否有完整的数据行
  const lines = buffer.split('\\n');
  buffer = lines.pop(); // 保留最后一个不完整的行

  // 处理完整的数据行
  lines.forEach((line) => {
    if (line.startsWith("data: ")) {
      const data = line.substring(6);
      if (data === "[DONE]") return;

      try {
        const parsedData = JSON.parse(data);
        if (parsedData.choices && parsedData.choices[0].delta.content) {
          fullContent += parsedData.choices[0].delta.content;
          console.log('接收到的数据:', parsedData.choices[0].delta.content);
        }
      } catch (e) {
        console.error('解析流数据失败:', e);
      }
    }
  });
}
// 处理最后一个数据块
if (buffer) {
  try {
    const parsedData = JSON.parse(buffer);
    if (parsedData.choices && parsedData.choices[0].delta.content) {
      fullContent += parsedData.choices[0].delta.content;
      console.log('接收到的数据:', parsedData.choices[0].delta.content);
    }
  } catch (e) {
    console.error('解析流数据失败:', e);
  }
}
console.log('完整内容:', fullContent);
\`\`\`

## 二、EventSource 使用

一个 \`EventSource\` 实例会对 [HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) 服务器开启一个持久化的连接，以 \`text/event-stream\` 格式发送[事件](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Scripting/Events)，此连接会一直保持开启直到通过调用 [\`EventSource.close()\`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource/close) 关闭。

1. **EventSource** 会自动处理连接管理和消息解析（以 \`data:\` 开头的消息）
2. **EventSource** 不支持自定义 headers（如 Authorization header），这是主要限制

\`\`\`js
// EventSource使用案例
const eventSource = new EventSource(\`your-api-endpoint-with-query-params?token=YOUR_TOKEN\`);

eventSource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.choices?.[0]?.delta?.content) {
      fullContent += data.choices[0].delta.content;
      setCurrentStreamMessage((prev) => ({
        ...prev,
        content: fullContent
      }));
    }
  } catch (e) {
    console.error("解析消息失败:", e);
  }
};

eventSource.onerror = () => {
  eventSource.close();
  // 错误处理...
};

// 需要保存eventSource以便取消
controllerRef.current = eventSource;
\`\`\`

## 三、@microsoft/fetch-event-source 库使用

\`\`\`js
await fetchEventSource("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
  method: "POST", // ✅ 明确使用 POST
  openWhenHidden: true, // 🔥 禁止页面切回时自动重连
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer 0e106b363f1d4582afa20937c4f079ed.1tGO31LXjYb8G5bF",
    "X-Request-Id": generateUniqueId()
  },
  body: JSON.stringify({
    model: "glm-4-flash",
    messages: [
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: "user",
        content: input
      }
    ],
    stream: true
  }),
  onmessage(ev) {
    console.log("接收数据:", ev.data); // 接收数据
  },
  onerror(err) {
    console.error("SSE Error:", err);
    return null; // 🔥 关键：禁止重试
  }
});
\`\`\`
`;export{e as default};
