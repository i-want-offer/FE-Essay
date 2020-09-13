# Graphql

## 什么是 Graphql

Graphql 是一种 API 查询语言。API 接口的返回值可以从静态变为动态，即调用者来声明接口返回什么数据，可以进一步解耦前后端。在 Graphql 中，预先定义好 Schema 和声明 Type 来达到动态获取接口的目的：

*   对接口模型的抽象通过 Type 来描述
*   对接口获取数据的逻辑是通过 Schema 来描述的



## 为什么要使用 Graphql

*   接口数量众多，维护成本高
*   接口扩展成本高
*   接口响应的数据格式无法预知
*   减少无用数据的请求，按需获取
*   强类型约束（API 的数据格式让前端来定义，而不是后端定义）



## 与 restful 相比，Graphql 的优势

### 较少的数据

你所使用的大部分后段数据都是某个数据库提供的，如果你直接使用 SQL 数据库，那么便会知道，请求所需字段而非所有字段会更高效。

在 rest 中，几乎不可能仅仅返回所需的字段，这样的后果便是后段返回了过多无用的字段，这导致了请求体包的体积过大，而 Graphql 因为是前端规定接口返回的字段，所以可以做到所需即所得，有效的控制了请求体的大小。

### 合并多个请求

Graphql 另一个令人称赞的地方就是，它可以合并多个请求。如果你曾使用 rest，那么你可能已经习惯了“痛苦之链”：

1.  我们需要展示一个小组，那么我们调用 `/team/:id` 接口
2.  `team` 里面有一个 `userIds` ，我们需要用这个字段去请求另一个接口 `/user/:id`
3.  我们还想展示 user 还加入了其它哪些小组，所以我们又一次调用了 `/team/:id` 这个接口，每个小组，每个用户一次

一旦数量增多，那么我们需要发送的请求数量便会大幅度增加。

而在 Graphql 中，我们可以这样做达到合并请求：

```js
const query = `
  query TEAM_USERS {
    team(id: $teamID) {
      users {
        edges {
          node {
            avatarURL
            displayName
            teams {
              edges {
                node {
                  displayName
                }
              }
            }
          }
        } 
      }
    }
  }
`
```

如此一来可以提高性能，在单个请求中完成，而不是递归调用三个不同的查询，从而降低前端应用程序中的代码复杂度。

### 订阅

Graphql 的最后一个优势是订阅 -- 进行查询或变动并自动获取更新的能力。通常，这是使用 WebSockets 在 Graphql 服务端实现的。

假设我们要使用 GraphQL 创建聊天应用，我们可能会执行以下的操作：

```js
const subscription = `
  subscription MESSAGES() {
    messagesSubscribe(last: 200) {
      edges {
        node {
          text
          author {
            avatarURL
            userName
          }
        }
      }
    }
  }
`
```

在我们的应用中，`messagesSubscribe.edges` 是一系列的消息，每次我们发送消息都会自动更新。否则我们必须很频繁发送请求，从而在短时间内产生数百个调用

使用订阅，建立连接后唯一传输的数据是发送和接收消息的时间（可能是建立连接本身的那一点数据）



## Type（数据模型的抽象）

Type 可以简单分为两种：

*   Scalar Type（标量模型）：内建的标量包含：String、Int、Float、Boolean、Enum
*   Object Type（对象类型）：感觉类似于 TS 的接口类型
*   Type Modifier（类型修饰符）：用于表明是否必填等



## Schema（模式）

定义了字段的类型，数据的结构，描述了接口数据请求的规则

### Query（查询、操作类型）

*   query（查询）：当获取数据时，选用 Query 类型
*   mutation（更改）：当尝试修改数据时，选用 mutation 类型
*   subscription（订阅）：当希望数据更改时，可以进行消息推送，选用 subscription 类型

## Resolver（解析函数）

提供相关 Query 所返回数据的逻辑。Query 和与之对应的 Resolver 是同名的，这样在 Graphql 才能对应起来。解析过程可能是递归的，只要遇到非标量类型，会尝试继续解析，如果遇到标量类型，那么解析完成，这个过程叫解析链

