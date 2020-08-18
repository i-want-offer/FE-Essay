Libuv 是一个跨平台的异步 IO库，它结合了 UNIX 下的 libev 和 Windows 下的 IOCP 的特性，最早是由 Node.js 的作者开发，专门为 Node.js 提供多平台下的异步 IO 支持。Libuv 本身是由 C++ 语言实现的，Node.js 中的非阻塞 IO 以及事件循环的底层机制都是由 Libuv 实现的。

在 Windows 环境下，libuv 直接使用 Windows 的 IOCP 来实现 异步 IO。在非 Windows 环境下，libuv 使用多线程（线程池Thread pool）来模拟异步 IO。

