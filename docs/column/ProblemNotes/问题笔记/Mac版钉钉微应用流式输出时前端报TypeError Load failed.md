# 解决 Mac 版钉钉微应用流式输出中的 TypeError: Load failed 错误

## 一、问题描述

在 Mac 系统的钉钉微应用开发过程中，当等待后端流式数据输出时，前端控制台抛出 `TypeError: Load failed` 错误。这种错误通常发生在长时间等待后端响应的场景中，特别是在需要持续接收数据流的应用中。

## 二、问题分析

经过排查，发现这个问题的主要原因在于：微应用环境特殊性下，在长时间等待后端响应时，浏览器会自动断开连接，导致前端无法接收数据。

## 三、解决方案：后端添加心跳检测机制

最有效的解决方案是在流式传输过程中，后端定期发送心跳数据包，保持连接活跃状态。由于心跳包其实是发送的一段字符串，前端是不会处理这种格式的流失数据，只是保持常连接状态，从而避免断开连接。

### 3.1 后端 python 代码示例

```python
  elif stream_data["type"] == "heartbeat":
      # 处理心跳包 - 发送保持连接的空消息
      heartbeat_chunk = {
        "id": stream_data["data"]["message_id"],
        "object": "chat.completion.heartbeat",
        "created": stream_data["data"]["timestamp"],
        "message_id": stream_data["data"]["message_id"],
        "type": "heartbeat",
        "data": {
            "message": "connection_alive",
             "timestamp": stream_data["data"]["timestamp"]
             }
        }
        yield f"data: {json.dumps(heartbeat_chunk)}\n\n"

```

前端不用处理心跳包，只需要保持连接状态即可。