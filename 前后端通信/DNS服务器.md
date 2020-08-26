# DNS 服务器

## 为什么需要 DNS 服务器

网络通讯大部分是基于 TCP/IP 的，而 TCP/IP 是基于 IP地址的，所以计算机在网络上进行通讯时只能识别 IP地址而不能识别域名。

## DNS 作用

DNS 是域名系统，它所提供的服务是用来将主机名和域名转换为 IP地址的工作。

## 查询总览

假设运行在用户主机上的某些应用程序（如浏览器或者邮箱）需要将主机名转换为 IP地址。这些应用程序将调用 DNS 的客户端，并指明需要被转换的主机名。用户主机的 DNS 客户端接收到后，向网络中发送一个 DNS 查询报文，所有 DNS 请求和响应报文使用 UDP 数据包经过端口 53 发送，经过若干延迟后，用户主机上的 DNS 客户端接收到一个提供所希望映射的 DNS 响应报文。

## 设计模式

DNS 不采用单点的集中式设计模式，而是使用分布式集群的工作方式，是因为集中式设计会有单点故障、通信容量、远距离时间延迟、维护开销大等问题。

## 查询过程

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78c8775d0deb40ccbf8aa24d7116e55c~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

1.  检查浏览器中是否缓存过该域名对应的 IP 地址
2.  如果浏览器缓存中没有命中，将继续查找本级（操作系统）是否缓存过该 IP
3.  向本地域名解析服务系统发起域名解析的请求（一般是本地运营商的机房）
4.  向根域名解析服务器发起域名解析服务请求
5.  根域名服务器返回 gTLD 域名解析服务器地址
6.  向 gTLD 服务器发起解析请求
7.  gTLD 服务器接收请求并返回 Name Server 服务器（通常情况下就是你注册的域名服务器）
8.  Name Server 服务器返回 IP 地址给本地服务器
9.  本地服务器缓存解析结果
10.  返回解析结果给用户

## 分类

大致上说，DNS 服务器分成三类：根DNS服务器、顶级域DNS服务器、权威DNS服务器。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64ed948cd8a74d24a76c337d4b0032c6~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

还有另一类重要的 DNS，称为本地DNS服务器，一台本地DNS服务器严格来说并不属于该服务器的层次结构，但它对DNS层次结构很重要。

当主机发送DNS请求时，该请求被发往本地DNS服务器，它起代理作用，并将该请求转发到DNS服务器层次结构中。

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a3ae998bc7647d599a458fdf4c1e415~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

## 查询方式

在上述中，从请求主机到本地DNS服务器的查询是 **递归** 的，其余查询是 **迭代** 的。

DNS 提供了两种查询过程：

*   **递归查询**：在该模式下DNS服务器接收客户请求，必须使用一个准确的查询结果回复客户机，如果DNS服务器没有存储DNS值，那么该服务器会询问其他服务器，并将返回一个查询结果给客户机。
*   **迭代查询**：DNS服务器会向客户机提供其他能够解释查询请求的DNS服务器，当客户机发送查询时，DNS并不直接回复查询结果，而是告诉客户机，另一台DNS服务器的地址，客户再向这台DNS服务器提交请求，依次循环直接返回结果。

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb7f883feb8942c980ad1f840e8877cd~tplv-k3u1fbpfcp-zoom-1.image?imageslim)



