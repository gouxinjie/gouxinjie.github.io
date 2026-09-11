const n=`# WebSocket 实时通信

[[toc]]

**WebSocket** 是一种在单个 TCP 连接上进行**全双工（Full-Duplex）通信**的网络协议。它打破了传统 HTTP “请求-响应”的单向限制，允许服务器主动向客户端推送数据，是构建实时 Web 应用（如在线聊天、实时看板、协同编辑、在线游戏）的标准方案。


### 一、 为什么需要 WebSocket？（对比传统 HTTP）

在 WebSocket 出现之前，前端为了实现“实时更新”效果，主要依赖以下 HTTP 变通方案：

* **轮询（Polling）**：客户端每隔几秒发一次 HTTP 请求。**缺点**：产生海量无用请求，浪费带宽和服务器资源。
* **长轮询（Long Polling）**：客户端发请求后，服务器挂起请求，直到有新数据才返回并断开，客户端随即发起新请求。**缺点**：频繁建立/销毁 HTTP 连接，延迟仍相对较高。
* **SSE（Server-Sent Events）**：基于 HTTP 的单向推送（服务器 -> 客户端）。**缺点**：不支持客户端向服务器双向实时发数据。

#### WebSocket 与 HTTP 的区别

| 特性 | HTTP / HTTPS | WebSocket |
| --- | --- | --- |
| **通信模式** | 单向（客户端发起，服务器响应） | **双向全双工**（任意一方均可随时发数据） |
| **协议头开销** | 每次请求均携带几百字节到几 KB 的 Header | 握手完成后，帧头部仅占 **2 ~ 10 字节** |
| **连接状态** | 无状态（通常短连接或 Keep-Alive 长连接） | **有状态**（长连接，持续保持网络管道） |
| **协议标识** | \`http://\` 或 \`https://\` | **\`ws://\`** 或 **\`wss://\`** (加密) |


### 二、 WebSocket 建立连接的过程（握手阶段）

WebSocket 并不是全新的底层传输协议，它**借助 HTTP 协议完成初始握手**，随后将连接升格（Upgrade）为 WebSocket 双向通道：

1. **客户端发起 Upgrade 请求（HTTP GET）**：
\`\`\`http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

\`\`\`


2. **服务器响应切换协议（状态码 101）**：
\`\`\`http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

\`\`\`


3. **建立连接**：握手成功后，HTTP 协议退出，改用 WebSocket 二进制帧协议进行持续的流式传输。


### 三、 原生 WebSocket 快速上手

#### 1. 前端（浏览器环境）

\`\`\`javascript
// 1. 创建 WebSocket 实例
const socket = new WebSocket('wss://example.com/socket');

// 2. 监听连接建立
socket.onopen = (event) => {
  console.log('WebSocket 连接成功！');
  // 向服务器发送数据
  socket.send(JSON.stringify({ type: 'bind', userId: 123 }));
};

// 3. 监听服务器推送的消息
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('收到服务器消息：', data);
};

// 4. 监听连接关闭与错误
socket.onclose = (event) => console.log('连接已关闭', event.code);
socket.onerror = (error) => console.error('通信发生错误', error);

// 5. 主动关闭连接
// socket.close();

\`\`\`

#### 2. 后端（Node.js / \`ws\` 库）

\`\`\`javascript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('有新的客户端连接');

  // 监听客户端发来的消息
  ws.on('message', (message) => {
    console.log('收到消息: %s', message);

    // 广播或单发给客户端
    ws.send(\`服务器已收到消息: \${message}\`);
  });
});

\`\`\`


### 四、 生产环境四大核心问题与防护策略

在真实业务开发中，光写 \`new WebSocket()\` 是远远不够的，必须处理网络波动、断连等异常。

#### 1. 心跳检测机制（Ping/Pong）

防止因网络中断、防火墙静默丢包导致连接“假死”。

* **做法**：客户端或服务端定时（如每 30 秒）发送一个轻量级的 \`ping\` 包，若在限定时间内没有收到 \`pong\` 回复，则判定连接断开并主动触发销毁重连。

#### 2. 断线自动重连（Reconnection）

网络抖动在移动端非常频繁，断开后需自动重新建立连接。

* **策略**：结合**指数退避算法（Exponential Backoff）**（如间隔 1s、2s、4s、8s... 重连），避免服务挂掉时数万客户端同时盲目重连引发缓存雪崩。

#### 3. 消息丢失与顺序保障（ACK & Seq）

WebSocket 传输是可靠的 TCP 字节流，但**应用层可能因掉线导致消息丢失**。

* **做法**：为每条消息分配唯一 ID，接收端收到后回发 \`ACK\` 确认；重连后客户端通过上传最后收到的 \`seq_id\` 向服务端拉取离线消息。

#### 4. 鉴权与安全

* **认证方式**：由于 WebSocket 握手是一个 HTTP 请求，可以在握手时带上 Cookie，或在连接 URL 参数中携带一次性 Token（如 \`wss://[site.com/ws?token=xxxx](https://site.com/ws?token=xxxx)\`）。
* **协议安全**：生产环境**必须**使用加密的 \`wss://\`（即 TLS 加密），防止中间人攻击及防火墙对非 80/443 端口流量的阻断。


### 五、 WebSocket vs Socket.IO vs SSE

* **Socket.IO**：并不是纯粹的 WebSocket，而是一个封装库。它在不支持 WebSocket 的旧环境回退到长轮询，内置了心跳、自动重连、房间分组（Rooms）等功能。**适合快速开发业务应用**。
* **SSE (Server-Sent Events)**：如果业务场景**只需要服务器向前端单向推送**（例如：股市行情、新闻推送、ChatGPT 打字机回答效果），使用轻量的 SSE 比 WebSocket 更简单且原生支持断线重连。
`;export{n as default};
