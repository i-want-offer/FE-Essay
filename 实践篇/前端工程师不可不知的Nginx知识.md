# 前端工程师不可不知的 Nginx 知识

## 历史背景

互联网的全球化导致了互联网的数据量快速增长，加上本世纪初摩尔定律在单核 CPU 上的失效，CPU 朝着多核方向发展，而 Apache 显然并没有做好多核架构的准备，它的一个进程同一时间只能处理一个连接，处理完一个请求后才能处理下一个，这无疑不能应对如今互联网上海量的用户。况且进程间切换的成本是非常高的。在这种背景下，Nginx 应运而生，可以轻松处理数百万、上千万的连接。

## Nginx 优势

*   高并发高性能
*   可扩展性好
*   高可靠性
*   热部署
*   开源许可证

## Nginx 主要应用场景

*   静态资源服务，通过本地文件系统提供服务
*   反向代理服务、负载均衡
*   API 服务、权限控制，减少应用服务器压力

## Nginx 配置文件和目录

通过 `rpm -ql nginx` 可以查看 Nginx 安装的配置文件和目录。

如图是我在某某云上安装的最新稳定版本的Nginx的配置文件及目录。

![img](http://hungryturbo.gitee.io/webcanteen/images/nginx.jpg?imageslim)

*   /etc/nginx/nginx.conf 核心配置文件
*   /etc/nginx/conf.d/default.conf 默认http服务器配置文件
*   /etc/nginx/fastcgi_params fastcgi配置
*   /etc/nginx/scgi_params scgi配置
*   /etc/nginx/uwsgi_params uwsgi配置
*   /etc/nginx/koi-utf
*   /etc/nginx/koi-win
*   /etc/nginx/win-utf 这三个文件是编码映射文件，因为作者是俄国人
*   /etc/nginx/mime.types 设置HTTP协议的Content-Type与扩展名对应关系的文件
*   /usr/lib/systemd/system/nginx-debug.service
*   /usr/lib/systemd/system/nginx.service
*   /etc/sysconfig/nginx
*   /etc/sysconfig/nginx-debug 这四个文件是用来配置守护进程管理的
*   /etc/nginx/modules 基本共享库和内核模块
*   /usr/share/doc/nginx-1.18.0 帮助文档
*   /usr/share/doc/nginx-1.18.0/COPYRIGHT 版权声明
*   /usr/share/man/man8/nginx.8.gz 手册
*   /var/cache/nginx Nginx的缓存目录
*   /var/log/nginx Nginx的日志目录
*   /usr/sbin/nginx 可执行命令
*   /usr/sbin/nginx-debug 调试执行可执行命令

关于 Nginx 的常用命令以及配置文件语法很容易就可以查到，本文不做赘述。下面从 Nginx 的功能以及实际场景触发看一看各个场景下 Nginx 可以提供给我们哪些配置项。

在此之前，我们先来明确两个概念：

## 正向代理 Forward proxy

>   正向代理的对象时客户端，服务端看不到真正的客户端。

![img](http://hungryturbo.gitee.io/webcanteen/images/%20forwardproxy.jpg?imageslim)

```nginx
resolver 8.8.8.8 # 谷歌的域名解析地址
server { 
  location / {     
    # 当客户端请求我的时候，我会把请求转发给它      
    # $http_host 要访问的主机名 $request_uri 请求路径      
    proxy_pass http://$http_host$request_uri;
  }
}
```

## 反向代理 Reverse proxy

>   反向代理的对象是服务端，客户端看不到真正的服务端。

![img](http://hungryturbo.gitee.io/webcanteen/images/reverseproxy.jpg?imageslim)

## 跨域

跨域是前端工程师都会面临的场景，跨域的解决方案有很多。不过要知道在生产中，要么使用 CORS，要么使用 Nginx 反向代理来解决跨域。在 Nginx 的配置文件中进行如下配置即可：

```nginx 
server {    
  listen   80;    
  server_name   localhost; # 用户访问 localhost，反向代理到 http://webcanteen.com    
  location / {        
    proxy_pass http://webcanteen.com    
  }
}
```

## Gzip

gzip 是互联网上非常普遍的一种数据压缩格式，对于纯文本来说可以压缩到原大小的 40%，可以节省大量的带宽。不过需要注意的是，启用 gzip 所需的 HTTP 最低版本是 1.1。

```nginx
location ~ .*\. (jpg|png|gif)$ {    
  gzip off; #关闭压缩    
  root /data/www/images;
}
location ~ .*\. (html|js|css)$ {    
  gzip on; #启用压缩    
  gzip_min_length 1k; # 超过1K的文件才压缩    
  gzip_http_version 1.1; # 启用gzip压缩所需的HTTP最低版本    
  gzip_comp_level 9; # 压缩级别，压缩比率越高，文件被压缩的体积越小    
  gzip_types text/css application/javascript; # 进行压缩的文件类型    
  root /data/www/html;
}
```

## 请求限制

对于大流量恶意的访问，会造成带宽的浪费，给服务器增加压力。往往对于同一 IP 的连接数以及并发数进行限制。

关于请求限制主要有两种类型：

*   limit_conn_module 连接频率限制
*   limit_req_module 请求频率限制

```nginx
# $binary_remote_addr 远程IP地址 zone 区域名称 10m内存区域大小
limit_conn_zone $binary_remote_addr zone=coon_zone:10m;
server {    
  # conn_zone 设置对应的共享内存区域 1是限制的数量 
  limit_conn conn_zone 1;
}
```

```nginx
# $binary_remote_addr 远程IP地址 zone 区域名称 10m内存区域大小 rate 为请求频率 1s 一次limit_req_zone $binary_remote_addr zone=req_zone:10m rate=1r/s;
server {    
  location / {        
    # 设置对应的共享内存区域 burst最大请求数阈值 nodelay不希望超过的请求被延迟        
    limit_req zone=req_zone burst=5 nodelay;   
  }
}
```

## 访问控制

关于访问控制主要有两种类型：

*   -http_access_module 基于 IP 的访问控制
*   -http_auth_basic_module 基于用户的信任登录

（基于用户的信任登录不是很安全，本文不做配置介绍）

以下是基于 IP 的访问控制：

```nginx
server {
  location ~ ^/index.html { 
    # 匹配 index.html 页面 除了 127.0.0.1 以外都可以访问  
    deny 127.0.0.1;  
    allow all; 
  }
}
```

## ab 命令

ab 命令全称为 Apache bench，是 Apache 自带的压力测试工具，也可以测试 Nginx、IIS 等其他 Web 服务器。

*   -n 总共的请求数
*   -c 并发的请求数

```shell
ab -n 1000 -c 5000 http://127.0.0.1/
```

## 防盗链

防盗链的原理就是根据请求头中 referer 得到网页来源，从而实现访问控制。这样可以防止网站资源被非法盗用，从而保证信息安全，减少带宽损耗，减轻服务器压力。

```nginx
location ~ .*\.(jpg|png|gif)$ { # 匹配防盗链资源的文件类型    
  # 通过 valid_referers 定义合法的地址白名单 $invalid_referer 不合法的返回403      
  valid_referers none blocked 127.0.0.1;    
  if ($invalid_referer) {        
    return 403;    
  }
}
```

## 负载均衡 Load Balance

当我们的网站需要解决高并发、海量数据问题时，就需要使用负载均衡来调度服务器。将请求合理的分发到应用服务器集群中的一台台服务器上。

![img](http://hungryturbo.gitee.io/webcanteen/images/loadbalance.jpg?imageslim)

Nginx 可以为我们提供负载均衡的能力，具体配置如下：

```nginx
# upstream 指定后端服务器地址
# weight 设置权重
# server 中会将 http://webcanteen 的请求转发到 upstream 池中
upstream webcanteen {    
  server 127.0.0.1:66 weight=10;    
  server 127.0.0.1:77 weight=1;    
  server 127.0.0.1:88 weight=1;}
server {    
  location / {        
    proxy_pass http://webcanteen    
  }
}
```

### 后端服务器状态

后端服务器支持一下的状态配置：

*   down：当前服务器不参与负载均衡
*   backup：当其他节点都无法使用时的备用服务器
*   max_fails：允许请求失败的次数，若到达就会休眠
*   fail_timeout：经过 max_fails 次失败后，服务器的暂停时间，默认为 10s
*   max_conns：限制每个服务器的最大接收连接数

```nginx
upstream webcanteen { 
  server 127.0.0.1:66 down; 
  server 127.0.0.1:77 backup; 
  server 127.0.0.1:88  max_fails=3 fail_timeout=10s; 
  server 127.0.0.1:99 max_conns=1000;
}
```

### 分配方式

*   轮询（默认），每个请求按照时间顺序轮流分配到不同的后端服务器，如果某台后端服务器宕机，Nginx 轮训列表会自动将它去除掉；
*   weight（加权轮询），轮询的加强版，weight 和访问几率成正比，主要用于后端服务器性能不均的场景；
*   ip_hash，每个请求按照访问 IP 的 hash 结果分配，这样每个访问可以固定访问一个后端服务器；
*   url_hash，按照访问 URL 的 hash 结果来分配请求，使得每个 URL 定向到同一个后端服务器上，主要应用于后端服务器为缓存时的场景；
*   自定义 hash，基于任意关键字作为 hash key 实现 hash 算法的负载均衡；
*   fair，按照后端服务器的响应时间来分配请求，响应时间短则优先分配。

