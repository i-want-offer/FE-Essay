# 零距离接触 WebSocket

## 什么是 WebSocket

### 定义

WebSocket 是一个持久化的网络通信协议，可以在单个 TCP 连接上进行 **全双工通讯** ，没有了 **Request** 和 **Response** 的概念，两者地位完全平等，连接一旦建立，客户端和服务端之间可以实时进行双向数据传输。

### 关联和区别

#### HTTP

1.  HTTP 是非持久协议，客户端想知道服务端的处理进度只能通过长轮询或者是 long poll 的方式，但是前者对服务器压力大，后者则会因为一直等待响应造成阻塞。

    ![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2308134eee1949129438e15b945792b9~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

2.  虽然 http1.1 默认开启了 keep-alive 长连接保持了这个 TCP 通道使得在一个 HTTP 连接中可以发送多个请求，接受多个响应，但是一个请求只能有一个响应，而且这个响应也是被动的，不能主动发起。

3.  WebSocket 虽然是独立于 HTTP 的一种协议，但是 WebSocket 必须依赖 HTTP 协议进行一次握手（在握手阶段是一样的），我手成功后，数据就直接从 TCP 通道传输，与 HTTP 无关了，可以用一张图理解两者有交集，但并不是全部。

    ![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93f1390c965f4bb28f97eeced69652d0~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

#### socket

1.  socket 也被称为套接字，与 HTTP 和 WebSocket 不一样，socket 不是协议，它是在程序层面上对传输层协议（可以主要理解为 TCP / IP）的接口封装。可以理解为一个能够提供端对端的通信的调用接口（API）。
2.  对于程序员而言，其需要在 A 端创建一个 socket 实例，并为这个实例提供其所要连接的 B 端的 IP 地址和端口号，而在 B 端创建另一个 socket 实例，并且绑定本地端口号来进行监听。当 A 和 B 建立连接后，双方就建立了一个端对端的 TCP 连接，从而可以进行双向通信。WebSocket 借鉴了 socket 的思想，为客户端和服务端之间提供了类似的双向通信机制。

### 应用场景

WebSocket 可以做弹幕、消息订阅、多玩家游戏、协同编辑、股票基金实时报价、视频会议、在线教育、聊天室等应用实时监听服务端变化。

## WebCocket 握手

*   WebSocket 握手请求报文

    ```http
    GET /chat HTTP/1.1
    Host: server.example.com
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
    Sec-WebSocket-Protocol: chat, superchat
    Sec-WebSocket-Version: 13
    Origin: http://example.com
    ```

    下面是与传统 HTTP 报文不同的地方：

    ```http
    Upgrade: websocket
    Connection: Upgrade
    ```

    表示发起的是 WebSocket 协议

    ```http
    Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
    Sec-WebSocket-Protocol: chat, superchat
    Sec-WebSocket-Version: 13
    ```

    `Sec-WebSocket-Key` 是由浏览器随机生成的，验证是否可以进行 WebSocket 通信，防止恶意或者无意的连接；

    `Sec-WebSocket-Protocol` 是用户自定义的字符串，用来标识服务所以需要的协议；

    `Sec-WebSocket-Version` 表示支持的 WebSocket 版本。

*   服务端响应

    ```http
    HTTP/1.1 101 
    Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
    Sec-WebSocket-Protocol: chat
    ```

    101 响应码 表示要转换协议。

    `Connection: Upgrade` 表示升级新协议请求。

    `Upgrade: websocket` 表示升级为 WebSocket 协议。

    `Sec-WebSocket-Accept` 是经过服务器确认，并加密过后的 `Sec-WebSocket-Key` ，用来证明客户端和服务端之间能够进行通信了。

    `Sec-WebSocket-Protocol` 表示最终使用的协议。

至此，客户端和服务器握手成功建立了 WebSocket 连接，HTTP 已经完成了他所有工作，接下来就是完全按照 WebSocket 协议进行通信。

## 关于 WebSocket 

### WebSocket 心跳

可能会有某些未知情况导致 socket 断开，而客户端和服务端却不知道，需要客户端定时发送一个 **心跳 ping** 让服务端知道自己在线，服务端也需要回复一个 **心跳 pong** 告诉客户端自己可用，否则视为断开。

### WebSocket 状态

WebSocket 对象中的 readyState 属性有四种状态：

*   0：表示正在连接
*   1：表示连接成功，可以通信了
*   2：表示连接正在关闭
*   3：表示连接已经关闭，或者打开连接失败

