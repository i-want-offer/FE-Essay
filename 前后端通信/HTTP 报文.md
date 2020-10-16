# HTTP 报文

## 请求报文

一个 HTTP 请求报文由*请求行（request line）*、*请求头（header）*、*空行*和*请求数据* 4个部分组成。

### 请求行

包括请求方法字段、URL 字段和 HTTP 协议版本，如：GET /index.html HTTP/1.1

### 请求头

请求头由关键字 / 值组成，每行一对，关键字和值用英文冒号隔开

请求头部通知服务器有关于客户端请求的信息，典型的请求头有：

*   User-Agent：产生请求的浏览器类型
*   Accept：客户端可识别的内容类型列表
*   Host：请求的主机名，允许多个域名同处于一个 IP 地址，即虚拟主机
*   Content-Type：请求体的 MIME 类型（用于 POST 和 PUT 请求中），如：`Content-Type:application/x-www-form-urlencoded`
*   空行

最后一个请求头之后是空行，发送回车符和换行符，通知服务器以下不再有请求头

### 请求数据

请求数据不在 get 方法中使用，而是 post 方法中使用。post 方法适用于需要客户填写表单的场合，与请求数据相关的最常使用的请求头是 Content-Type 和 Content-Length



## 响应报文

响应报文由*状态行*、*响应头*、*空行*、*响应正文* 组成

