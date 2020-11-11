# Cookie 的 SameSite 属性

## 前言

2 月份发布的 Chrome 80 版本中默认屏蔽了第三方的 Cookie，这导致了线上非常多的问题，着实推动了大家对 Cookie 的理解，所以很有可能会有相关的面试题，即便不是面试题，当问到 HTTP 相关内容时，不妨也扯到这件事情上，一能表明你对前端时事的跟进，二能借此引申到前端安全方面的内容，为你的面试加分。

本文就给大家介绍一下浏览器的 Cookie 以及这个“火热”的 SameSite 属性。

## HTTP 

一般我们都会说「HTTP 是一个无状态协议」，不过要注意这里的 HTTP 其实指的是 HTTP/1.x，而所谓无状态协议，简单的理解便是即使同一个客户端连续两次发送请求给服务器，服务器也识别不出这是同一个客户端发送的请求，这导致的问题就是比如你加了一个商品到购物车中，但因为识别不出是同一个客户端，你刷新页面就消失了。

## Cookie

为了解决 HTTP 无状态导致的问题，后面推出了 Cookie。

不过这样说可能会让你产生一些误解。首先无状态并不是不好，有优点，但也会导致一些问题。而 Cookie 的存在也不是为了解决通讯无状态的问题，只是为了解决客户端与服务端会话状态的问题，这个状态是指后端服务的状态而非通讯协议的状态。

### Cookie 介绍

我们看一下 Cookie，引用维基百科：

>   Cookie，类型为「小型文本文件」，指某些网站为了辨别用户身份而储存在用户本地终端上的数据。

作为一段一般不超过 4KB 的小型文本数据，它由一个名称（Name）、一个值（Value）和其他几个用于介绍控制 Cookie 有效期、安全性、使用范围的可选属性组成，这涉及的属性我们会在后面介绍。

### Cookie 的查看

我们可以在浏览器开发者工具中查看到当前页面的 Cookie，尽管我们是在浏览器中看到了 Cookie，这并不意味着 Cookie 文件只是存放在浏览器里。实际上，Cookie 相关的内容还可以存在本地文件中，就比如说 Max 下的 Chrome，存放目录就是 `~/Library/Application Support/Google/Chrome/Default` ，里面会有一个名为 Cookies 的数据库文件，你可以使用 sqlite 软件打开它。

存放在本地的好处就在于即使你关闭了浏览器，Cookie 依然可以生效。

### Cookie 的设置

简单来说：

1.  客户端发送 HTTP 请求
2.  服务器收到 HTTP 请求，在响应头里面添加一个 Set-Cookie 字段
3.  浏览器受到相应后保存下 Cookie
4.  之后对该服务器每一次请求中都通过 Cookie 字段将 Cookie 信息发送给服务器

### Cookie 的属性

#### Name/Value

用 JS 操作 Cookie 的时候注意对 Value 进行编码处理。

#### Expires

用于设置 Cookie 的过期时间。

当 Expires 缺省的时候，表示是会话性 Cookie。当 Cookie 为会话性时，值会保存在浏览器内存中，用户关闭浏览器时会失效。需要注意的是，部分浏览器提供了会话恢复功能，这种情况下即便关闭了浏览器，会话期 Cookie 也会被保留下来，就好像浏览器从来没有关闭一样。

与会话性 Cookie 相对的是持久性 Cookie，持久性 Cookie 会保存在用户的硬盘中，直至过期或者清除 Cookie。

这里值得注意的是，设定的日期和时间只和客户端相关，而不是服务端。

#### Max-Age

用于设置在 Cookie 失效之前需要经过的秒数。

Max-Age 可以为正数、负数、甚至是 0.

如果为正数，浏览器会将其持久化，即写到对应的 Cookie 文件中。

如果属性为负数，表示该 Cookie 只是一个会话性 Cookie。

当为 0 时，会立即删除这个 Cookie。

如果 Expires 和 Max-Age 同时存在时，Max-Age 优先级更高。

#### Domain

Domain 制定了 Cookie 可以送达的主机名。假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。

像淘宝首页设置的 Domain 就是 `.taobao.com` ，这样不论是 `a.taobao.com` 还是 `b.taobao.com` 都可以使用 Cookie。

这里需要注意的是，不能跨域设置 Cookie，这样设置是无效的。

#### Path

Path 指定了一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部。比如设置了 `Path=/docs` 下的资源会带 Cookie 首部， `/test` 则不会携带 Cookie 首部。

Domain 和 Path 标识共同定义了 Cookie 的作用域：即 Cookie 应该发送给哪些 URL。

#### Secure 属性

标记为 Secure 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端。使用 HTTPS 安全协议可以保护 Cookie 在浏览器和服务器之间传输过程不被窃取和篡改。

#### HTTPOnly

设置 HTTPOnly 属性可以防止客户端脚本通过 `document.cookie` 等方式访问 Cookie，有助于避免 XSS 攻击。

#### SameSite

这是一个非常值得讨论的内容。

##### 作用

SameSite 属性可以让 Cookie 在跨站请求是不会被发送，从而可以阻止跨站请求伪造（CSRF）。

##### 属性值

SameSite 可以有下面三种值：

1.  **Strict** ：仅允许一方请求携带 Cookie，即浏览器只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致；
2.  **Lax** ：允许部分第三方请求携带 Cookie；
3.  **None** ：无论是否跨站都会发送 Cookie。

之前默认是 None，Chorme80 之后默认是 Lax。

##### 跨站和跨域

首先要理解一点就是跨站和跨域是不同的。「同站（same-site）/跨站（cross-site）」和「第一方（first-party）/第三方（third-party）」是等价的。但是与浏览器同源策略（SOP）中的「同源（same-origin）/跨域（cross-origin）」是完全不同的概念。

同源策略的同源是指两个 URL 的协议 / 主机名 / 端口一致。同源策略作为浏览器的安全基石，其「同源」判断是比较严格的。

而相对来说，Cookie 中的「同站」判断就比较宽松：只要两个 URL 的 eTLD + 1 相同即可，不需要考虑协议和端口。其中 eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如：`.com` 、`.cn` 等等，eTLD + 1 表示有效顶级域名 + 二级域名，例如： `taobao.com` 等。

举个例子，`www.baidu.com` 和 `www.taobao.com` 是跨站， `www.a.taobao.com` 和 `www.b.taobao.com` 是同站， `a.github.io` 和 `b.github.io` 是跨站。

##### 改变

接下来看下从 None 改成 Lax 到底影响了哪些地方的 Cookie 发送：

| 请求类型  | 实例                                 | 以前        | Strict | Lax         | None        |
| --------- | ------------------------------------ | ----------- | ------ | ----------- | ----------- |
| 链接      | `<a href="..."></a>`                 | 发送 cookie | 不发送 | 发送 cookie | 发送 cookie |
| 预加载    | `<link rel="prerender" href="..."/>` | 发送 cookie | 不发送 | 发送 cookie | 发送 cookie |
| get 表单  | `<form method="GET" action="..."/>`  | 发送 cookie | 不发送 | 发送 cookie | 发送 cookie |
| post 表单 | `<form method="POST" action="..."/>` | 发送 cookie | 不发送 | 不发送      | 发送 cookie |
| iframe    | `<iframe src="..."></iframe>`        | 发送 cookie | 不发送 | 不发送      | 发送 cookie |
| AJAX      | `$.get("...")`                       | 发送 cookie | 不发送 | 不发送      | 发送 cookie |
| Image     | `<img src="..."/>`                   | 发送 cookie | 不发送 | 不发送      | 发送 cookie |

从表格中可以看到，对大部分 web 应用而言，Post 表单、iframe、ajax、image 这四种情况从跨站会发送第三方 Cookie 变成了不发送。

### Cookie 的作用

1.  会话状态管理（如用户登录状态、购物车、游戏分数或其他需要记录的信息）；
2.  个性化设置（如用户自定义设置、主题等）；
3.  浏览器行为跟踪（如跟踪分析用户行为等）。



