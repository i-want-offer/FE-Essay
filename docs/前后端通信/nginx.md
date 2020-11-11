# NGINX 入门教程

## 初识 Nginx

作为一个前端，我相信你一定听说过 Nginx，因为它的被大范围采用。那么 Nginx 到底是什么？

>   “ Nginx 是一款轻量级的 HTTP 服务器，采用事件驱动的异步非阻塞处理方式框架，这让其具有极好的 IO 性能，时常用于服务端的 **反向代理** 和 **负载均衡** 。”

### Nginx 的优点

*   支持海量高并发：采用 IO 多路复用 epoll。官方测试 Nginx 能够支持5万并发链接，实际生产环境中可以支撑 2 - 4 万并发连接数；
*   内存消耗小：在主流服务器中 Nginx 目前是内存消耗最小的，比如我们使用 Nginx + PHP，在3万并发链接下，开启10个 Nginx 进程消耗150M内存；
*   免费使用并且可商业化：Nginx 是一个开源项目，其采用的协议允许开发者免费使用，并可用于商业；
*   配置文件简单：网络和程序配置通俗易懂，即使非专业运维也能看懂。

## Nginx 基本配置文件详解

### 查看 Nginx 的安装目录

安装完 Nginx 后，我们需要知道 Nginx 的配置文件都安装在了哪里，我们可以使用下面的命令进行查看：

```shell
nginx -t
```

这句话是 nginx 测试命令，执行命令后会打印出当前测试文件的结果，里面含有测试文件的绝对路径，测试文件和配置文件时放在一起的。

### nginx.conf 文件解读

nginx.confg 文件是 Nginx 总配置文件，在我们搭建服务器时经常调整文件。用编译器打开 nginx.conf 文件。

```nginx
# 运行用户，默认是 nginx，可以不进行设置
user nginx;
# nginx 进程，一般设置为和 CPU 核数相同
worker_processes 1;
# 错误日志存放目录
error_log /var/log/nginx/error.log warn;
# 进程 pid 存放位置
pid /var/run/nginx.pid;

events {
  worker_connections 1024; # 单个后台进程的最大并发数
}

http {
	include /etc/nginx/mime.types; # 文件扩展名与类型映射表
  default_type application/octet-stream; # 默认文件类型
  # 设置日志模式
  log_format main '$remote_addr - $remote_use [$time_local] "$request" '
    							'$status $body_bytes_sent "$http_referer" '
    							'"$http_user_agent" "$http_x-forwarded_for"';
  access_log /var/log/nginx/access.log main; # nginx 访问日志存放位置
  sendfile on; # 开启高效传输模式
  # tcp_nopush on; # 减少网络报文段的数量
  keepalive_timeout 65; # 保持连接的时间，也叫超时时间
  # gzip on; # 开启 gzip 压缩
  include /etc/nginx/conf.d/*.conf; # 包含的子配置项位置和文件
}
```

这里我们看到配置项中最后的一句话的作用是导入一个子配置项，所以我们再用编译器打开子配置项看看里面的内容。

```nginx
server {
  listen 80; # 配置监听端口
  server_name localhost; # 配置监听域名
  
  location / { # 配置监听子路由
    root /usr/share/nginx/html; # 服务默认启动目录
    index index.html index.htm; # 默认访问文件
  }
  
  # error_page 404   /404.html # 配置404页面
	error_page 500 502 503 504 /50x.html; # 错误状态码的显示页面，配置后需要重启
  location = /50x.html {
    root /usr/share/nginx/html;
  }
}
```

## Nginx 服务启动、停止

### 启动 Nginx 服务

默认情况下，nginx 并不会自动启动，需要我们进行手动启动。通常情况下，在安装完 Nginx 后，可以直接在命令行中执行以下命令即可启动 Nginx。

```shell
nginx
```

Nginx 的启动不会有任何语句上的提示，所以可以执行以下命令查看 Nginx 是否已经启动。

```shell
ps aux | grep nginx
```

由于 nginx 是启动一个后台服务，所以即使命令行退出之后仍然可以继续运行。

### 停止 Nginx 服务

停止 Nginx 服务方法有很多种，可以根据需求采用不一样的方法。

#### 立即停止服务

```shell
nginx -s stop
```

这种方式比较强硬，无论进程是否在工作，都会直接停止进程。

#### 从容停止服务

```shell
nginx -s quit
```

这种方式比较温和，需要进程完成当前工作再停止。

#### 杀死所有进程

```shell
killall nginx
```

这种方式也是比较野蛮，直接杀死进程。

### 重启 Nginx 服务

在重新编写或者修改 Nginx 配置文件后，都需要重新载入，这时候运行以下命令可以重启 Nginx 服务。

```shell
nginx -s reload
```

## 自定义错误页和访问设置

一个好的网站会武装到牙齿，任何错误都有给用户友好的提示。比如当网站遇到页面没有找到的时候，我们要提示页面没有找到，并给用户可返回性。错误的种类有很多，所以真正的好产品会给客户不同的返回结果。

### 多错误指向一个页面

在上面例子中的子配置我们可以看到下面这句话：

```nginx
server {
  error_page 500 502 503 504 /50x.html;
}
```

`error_page` 指令用于自定义错误页面，500、502、503、504 这些是 HTTP 状态码，当服务器返回的是上面的报错，就会自动返回网站中指定的 50x.html 文件进行处理。

### 单独为错误指定处理方式

有时候我们需要为某些错误类型单独表现出来，给用户更好的体验，所以就要为这些特殊的错误类型设置不同的页面，比如我们上面例子中的子配置中这句话：

```nginx
server {
  error_page 404 /404_error.html;
}
```

这时候，当服务器返回状态码404的时候，就会自动返回对应的 404_error.html 文件。

### 根据状态码进行转发

有时候，服务器在处理错误的时候，不仅可以只使用本地资源，还可以使用外部资源，比如说：

```nginx
server {
  error_page 404 http://demo.com;
}
```

这样，当服务器返回状态码404的时候，就会自动跳转到对应的地址上。

### 简单实现控制访问

有些时候，我们的服务器只允许特定主机访问，比如内部系统，这时候我们就需要针对访问的 IP 进行判断，可以直接在 `location` 中进行配置：

```nginx
server {
  location / {
    deny 123.4.56.78;
    allow 111.2.33.44;
  }
}
```

配置完成后，服务器就可以实现限制和允许访问。

## Nginx 访问权限详解

上文我们已经知道了 Nginx 实现访问控制的简单方法，但是 Nginx 的访问控制还是比较复杂的。

### 指令优先级

我们看一下代码：

```nginx
server {
  location / {
    allow 123.45.6.789;
    deny all;
  }
}
```

上面的配置中只允许了 `123.45.6.789` 进行访问，其他 IP 都是禁止访问的。但是如果我们把 deny 挪到 allow 前面，就会发现所有 IP 都被禁止访问了，这说明了一个问题：**就是在同一个块下的权限指令，先出现的设置会覆盖后出现的设置（即谁先触发，谁起作用）。**

### 复杂访问控制权限匹配

在工作中，访问权限的控制需求更加复杂，例如某个网站下的 img 目录是允许所有用户访问的，但是 admin 目录只允许内网进行访问，这时候如果仅仅依靠 allow 和 deny 是无法实现的，我们需要 location块来完成相关的需求匹配。

上面的需求配置如下：

```nginx
server {
  location = /img {
    allow all;
  }
  
  location = /admin {
    deny all;
  }
}
```

`=` 表示精确匹配，使用了 `=` 后是根据其后的模式进行精确匹配。

### 使用正则表达式设置访问权限

只有精确匹配有时是无法完成我们的需求的，比如我们要禁止所有访问 php 的请求，代码如下：

```nginx
server {
  location ~\.php$ {
    deny all;
  }
}
```

这时我们就不能访问所有 php 结尾的文件了。

## Nginx 设置虚拟主机

>   虚拟主机是指在一台物理主机服务器上划分出多个磁盘空间，每个磁盘空间都是一个虚拟主机，每台虚拟主机都可以对外提供 Web 服务，并且互不干扰。在外界看来，虚拟主机就是一台独立的服务器主机，这意味着用户能够利用虚拟主机把多个不同域名的网站部署在同一台服务器上。而不必为单个网站部署一台服务器。

配置虚拟主机可以基于端口号、基于 IP 和基于域名，目前我们先尝试基于端口号来设置虚拟主机。

### 基于端口号配置虚拟主机

基于端口号来配置虚拟主机是最简单的一种方式。原理就是利用 Nginx 监听多个端口，根据不同的端口来区分不同的网站。

我们既可以配置在主配置文件中，也可以配置在子配置文件里。一般情况下，我们为了维护的方便会进行拆分，这时候只需要在主配置文件里面引入。

修改配置文件中的 server 选项，这时候就会有两个 server：

```nginx
server {
  listen 8001;
  server_name localhost;
  root /usr/share/nginx/html/html8001;
  index index.html;
}
```

### 基于 IP 的虚拟主机

基于 IP 和基于端口的配置几乎一样，只是把 `server_name` 选项配置成指定的 IP 就可以了。

比如上面的配置可以修改为：

```nginx
server {
  listen 80;
  server_name 112.74.164.244;
  root /usr/share/nagix/html/html8001;
  index index.html;
}
```

### 基于域名的虚拟主机

在真实的上线环境中，一个网站是需要域名和公网 IP 才可以访问的，所以在实际工作中配置最多的就是基于域名的虚拟主机。

配置项和基于 IP 的虚拟主机类似，只是将 IP 替换成了域名：

```nginx
server {
  listen 80;
  server_name demo.com;
	
  location / {
    root /usr/share/nginx/html/html8001;
    index index.html;
  }
}
```

配置完成后采用平滑重启的方式进行重启即可在浏览器中访问。

## Nginx 反向代理的设置

反向代理是目前跨域请求、获取权限的一种最重要、最普遍的方式。

现代 Web 模式基本都是标准的 CS 结构，即Client端到Server端。那么代理就是在 Client 和 Server 之间增加一个提供特定功能的服务器，这个服务器就是我们说的代理服务器。

### 正向代理

刚开始上手可能比较难以理解反向代理中的反向是什么意思，所以我们先来理解正向代理。

作为中国大陆的程序员，我相信绝大多数的你们都应该翻过墙，而我们用的翻墙工具就是一个典型的正向代理工具，它会把我们不让访问的服务器的请求，代理到一个可以访问该网站的代理服务器上，一般叫Proxy服务器，在转发给客户，具体流程大致如下图：

![img](https://user-gold-cdn.xitu.io/2018/10/30/166c2616283a8ccb?imageslim)

简单来说就是你想访问目标服务器，但是你没有权限进行访问。这时候有一台代理服务器，这台代理服务器上恰好有权限访问目标服务器，而你也有权限可以访问代理服务器，这时候你就可以通过访问代理服务器，代理服务器访问目标服务器，把请求资源获取下来。

### 反向代理

目前基本所有的大型网站应用都是采用反向代理。

反向代理正好和正向代理相反，客户端直接向代理服务器发送请求，再由代理服务器统一将请求发送到自己设置好的内部服务器中。

具体的流程大致如下：

![img](https://user-gold-cdn.xitu.io/2018/10/30/166c261645e3c67f?imageslim)

通过图片对比，我们可以看出反向代理中，代理服务器代理的是服务端而不是客户端，即向外部客户端提供一个统一的代理入口，客户端的请求都要先经过这个代理服务器，具体访问哪个服务器是由代理服务器来控制的。

再简单点来说就是，一般代理指代理客户端，反向代理指代理服务端。

### 反向代理的用途和好处

*   **安全性**：正向代理的客户端能够在隐藏自身信息的同时访问任意网站，这给网络安全带来了极大的威胁。因此，我们必须把服务器保护起来，使用反向代理客户端只能通过外网访问代理服务器，并且用户并不知道自己访问的真实服务器是哪台，这提供了很好的安全保护；
*   **功能性**：反向代理的主要用途是为多个服务器提供负载均衡、缓存等功能。负载均衡就是一个网站的内容被部署在多台服务器上，可以把这些服务器看成一个集群，反向代理服务器可以将接收到的请求 *均匀地* 分配到这个集群的任意一台服务器上，从而实现服务器压力的平均分配，也叫负载均衡。

### 最简单的反向代理

假如我们要访问 `http://www.demo.com` 然后反向代理到 `http://www.demo1.com ` 上，我们需要对配置进行如下修改：

```nginx
server {
  listen 80;
  server_name www.demo.com;
  location / {
    proxy_pass www.demo1.com;
  }
}
```

这样我们就完成了一个最简单的反向代理。

### 常用反向代理指令

反向代理还有一些常用的指令：

*   `proxy_set_header` ：再将客户端请求发送给后端服务器之前，更改来自客户端的请求头信息；
*   `proxy_connect_timeout` ：配置 Nginx 与后端代理服务器尝试建立连接的超时时间；
*   `proxy_read_timeout` ：配置 Nginx 与后端服务器发出 read 请求后，等待相应的超时时间；
*   `proxy_send_timeout` ：配置 Nginx 与后端服务器发出 write 请求后，等待相应的超时时间；
*   `proxy_redirect` ：用于修改后端服务器返回的响应头中的 Location 和 Refresh。

## Nginx 适配 PC 或移动设备

目前几乎所有的网站应用都需要同时适配PC端和移动端，我们通常可以使用响应式或者是针对不同设备分配不同站点来实现。

响应式的好处在于一份代码解决所有场景，同时只是纯前端处理，因此不需要投入后端人力。但是它的缺点也是非常明显，由于是同一份代码，因此实现会非常不灵活，同时会让一份代码变得非常庞大，不利于维护。

基于以上原因，我们比较了解的大型网站都没有采用响应式设计，而是分别部署不同的站点，利用服务器判断来源然后返回不同的模版。

### `$http_user_agent` 的使用

Nginx 通过内置变量 `$http_user_agent` 可以获取请求客户端的 `userAgent` ，就可以判断当前访问客户的终端类型，进而返回不同的资源给客户端。

具体实现大概如下：

```nginx
server {
  listen 80;
  server_name www.demo.com;
	
  location / {
    root /usr/share/nginx/pc;
    if($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
      root /usr/share/nginx/mobile;
    }
    index index.html;
  }
}
```

## Nginx 开启 Gzip 压缩

Gzip 是一种网页压缩技术，经过压缩后，页面资源大小可以变为原来的 30% 甚至更小。更小的资源可以加快请求的速度，从而加快浏览器渲染页面的速度。Gzip 压缩是需要浏览器和服务器同时支持的。

### Gzip 配置项

*   `gzip` ：该指令用于开启或关闭 gzip 模块；
*   `gzip_types` ：设置压缩的文件类型；
*   `gzip_buffers` ：设置系统获取几个单位的缓存用于存储 gzip 的压缩结果数据流；
*   `gzip_comp_level` ：gzip 压缩比，压缩级别是 1 - 9，1 最低，9 最高。压缩级别越高压缩率越大，压缩时间越长；
*   `gzip_disable` ：可以通过该指令对一些特定的 `User-Agent` 不使用压缩功能；
*   `gzip_min_length` ：设置允许压缩的页面最小字节数，页面字节数从相应消息头的 `Content-length` 中进行获取；
*   `gzip_http_version` ：识别 HTTP 版本协议，value 可以是 1.1 或者 1.0；
*   `gzip_proxied` ：用于设置或禁用从代理服务器上收到相应内容 gzip 压缩；
*   `gzip_vary` ：用于在相应消息头中添加 `Vary: Accept-Encoding` ，是代理服务器根据请求头中的 `Accept-Encoding` 识别是否启用 gzip 压缩。

### Gzip 简单配置

```nginx
server {
  # ...
  gzip on;
  gzip_types text/plain application/javascript text/css;
  # ...
}
```

设置完成后，当客户端发送请求网页时，就会对文本、JavaScript 和 CSS 进行压缩输出。

