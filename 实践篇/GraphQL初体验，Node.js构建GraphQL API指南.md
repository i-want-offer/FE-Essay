# GraphQL 初体验，Node.js 构建 GraphQL API 指南

>   原文：[blog.heroku.com](blog.heroku.com)
>
>   作者：CHRIS CASTLE

## 前言

过去几年中，GraphQL 已经成为一种非常流行的 API 规范，该规范专注于使客户端（无论是客户端、前端还是第三方）的数据获取更加容易。

在传统的基于 REST 的 API 方法中，客户端发出请求，而服务端决定响应。

但是在 GraphQL 中，客户端可以精确地确定其从服务器获取的数据。

通过这种新的模式，客户端可以通过缩减响应来满足他们的需求，从而向服务期进行更高效地查询。 对于单页应用（SPA）或其他前端重度客户端应用，可以通过减少有效载荷大小来加快渲染时间。但是，与任何框架或语言一样，GraphQL 也需要权衡取舍。在本文中，我们将探讨使用 GraphQL 作为 API 查询语言的利弊，以及如何开始构建实现。

## 为什么选择 GraphQL

与任何技术决策一样，了解 GraphQL 为你的项目提供了哪些优势是很重要的，而不是简单地因为它是一个流行词而选择它。

考虑一个使用 API 连接到远程数据库的 Sass 应用程序。你想要呈现用户的个人资料页面，你可能需要进行一次 API GET 调用，以获取有关用户的信息，例如用户名或电子邮件。然后你可能需要进行另一个 API 调用以获取有关地址的信息，该信息存储在另一张表中。随着应用程序的发展，由于其构建方式的原因，你可能需要继续对不同位置进行更多的 API 调用。虽然每一个 API 调用都可以异步完成，但你也必须处理它们的响应，无论是错误、超时甚至暂停页面渲染，直到收到所有请求数据。综上所述，这些响应的有效载荷可能超过了渲染你当前页面的需要，而且每个 API 调用都有网络延迟，总的延迟加起来可能非常恐怖。

使用 GraphQL，你无需进行多个 API 调用（例如 `GET /user/:id` 和 `GET /user/:id/addresses` ），而是进行一次 API 调用并将查询提交到单个端点：

```js
`
	query {
		user(id: 1) {
			name
			email
			addresses {
				street
				city
				country
			}
		}
	}
`
```

然后，GraphQL 仅提供一个端点来查询所需的所有域逻辑。如果你的应用程序不断增大，你会发现自己在你的架构中添加了更多的存储结构 -- PostgreSQL 可能是存储用户信息的好地方，而 Redis 可能是存储其他种类信息的好地方 -- 对 GraphQL 端点的一次调用将解决所有这些不同的位置，并以他们所请求的数据响应客户端。

如果你不确定应用程序的需求以及将来如何存储数据，则 GraphQL 在这里也很有用。要修改查询，你只需要添加所需字段的名称，这极大简化了随着时间推移而发展你的应用程序的过程。

## 定义一个 GraphQL Schema

有各种编程语言的 GraphQL 服务器实现，但在你开始之前，你需要识别你的业务域中的对象，就像任何 API 一样。就像 REST API 可能会使用 JSON 模式一样，GraphQL 使用 SDL 或 Schema 定义语言来定义它的模式，这是一种描述 GraphQL API 可用的所有对象和字段的幂等方式。SDL 条目的一般格式如下：

```typescript
type $OBJECT_TYPE {
  $FIELD_NAME($ARGUMENTS): $FIELD_TYPE
}
```

让我们以前面的例子为基础，定义一下 user 和 address 的条目是什么样子的：

```typescript
type User {
	name: String
	email: String
	addresses: [Address]
}

type Address {
	street: String
	city: String
	country: String
}
```

user 定义了两个 String 字段，分别是 name 和 email，它还包括一个 addresses 的字段，它是 Addresses 对象的数组。Addresses 还定义了他自己的几个字段。（顺便说一下，GraphQL 模式不仅有对象，字段和标量类型，还有更多，你也可以合并接口，联合和参数以构建更复杂的模型，但本文中不会介绍）。

我们还需要定义一个类型，这是我们 GraphQL API 的入口点。你还记得，我们前面说过，GraphQL 查询的样子：

```js
`
	query {
		user(id: 1) {
			name
			email
			addresses {
				street
				city
				country
			}
		}
	}
`
```

该 query 字段属于一种特殊的保留类型，称为 Query，这里指定了获取对象的主要入口点。（还有用语求该对象的 Mutation 类型）在这里我们定义了一个 user 字段，该字段返回一个 User 对象，因此我们的架构也需要定义此字段：

```typescript
type Query {
	user(id: Int!): User
}

type User {
	// ...
}

type Address {
	// ...
}
```

根据你选择的语言，将此模式合并到服务器中的过程会有所不同，但通常将信息用作字符串就足够了。

```js
const fs = require('fs')
const { makeExecutableSchema } = require('graphql-tools')

let typeDefs = fs.readFileSync('schema.graphql', {
  encoding: 'utf8',
  flag: 'r'
})
```

## 设置解析器

Schema 设置了构建查询的方式，但建立 Schema 来定义数据模式只是 GraphQL 规范的一部分。另一部分涉及实际获取数据，这是通过使用解析器完成的，解析器是一个返回字段基础值的函数。

让我们看一下如何在 Node.js 中实现解析器。我们的目的是围绕着解析器如何与模式一起操作来巩固概念，所以我们不会围绕着如何设置数据存储来做太详细的介绍。在“现实世界“中，我们可能会用诸如 knex 之类的东西建立数据库连接，现在让我们设置一些虚拟数据。

```js
const users = {
  1: {
    name: "Luke",
    email: "luke@heroku.space",
    addresses: [
      {
        street: "1234 Rodeo Drive",
        city: "Los Angeles",
        country: "USA"
      }
    ]
  },
  2: {
    name: "Jane",
    email: "jane@heroku.space",
    addresses: [
      {
        street: "1234 Lincoln Place",
        city: "Brooklyn",
        country: "USA"
      }
    ]
  }
}
```

Node.js 中的 GraphQL 解析器相当于一个 Object，key 是要检索的字段名，value 是返回数据的函数。让我们从初始 user 按 id 查找的一个简单实例开始：

```js
const resolvers = {
  Query : {
    user(parent, { id }) {
      // 用户查找逻辑
    }
  }
}
```

这个解析器需要两个参数：一个代表父的对象（在最初的根查询中，这个对象通常是未使用的），一个包含传递给你的字段的参数的 JSON 对象。并非每个字段都具有参数，但是在这种情况下，我们将拥有参数，因为我们需要通过 ID 来检索其用户。该函数的其余部分很简单：

```js
const resolvers = {
  Query : {
    user(_, { id }) {
			return users[id]
    }
  }
}
```

你会注意到，我们没有明确定义 User 或 Addresses 的解析器，graphql-tools 包足够智能，可以自动为我们映射这些。如果我们选择的话，我们可以覆盖这些，但是我们已经定义了我们的类型定义和解析器，我们可以建立我们完整的模式：

```js
const schema = makeExecutableSchema({ typeDefs, resolvers })
```

## 运行服务器

最后，让我们来运行这个 demo 吧！因为我们使用的是 Express，所以我们可以使用 express-graphql 包来暴露我们的模式作为端点。该程序搞需要两个参数：schema 和根 value，它有一个可选参数 graphiql，我们将稍后讨论。

使用 GraphQL 中间件在你喜欢的端口上设置 Express 服务器，如下所示：

```js
const express = require('express')
const express_graphql = require('express_graphql')

const app = express()
app.use(
	'/graphql',
  express_graphql({
    schema,
    graphiql: true
  })
)
app.listen(5000, () => console.log('Express is now live at localhost:5000'))
```

将浏览器导航到 http://localhost:5000/graphql ，你应该会看到一种 IDE 界面。在左侧窗格中，你可以输入所需要的任何有效 GraphQL 查询，而在右侧获得结果。

这就是 `graphiql: true` 所提供的：一种方便的方式来测试你的查询，你可能不想再生产环境中公开她，但是它是测试变得容易很多。

GraphQL 的类型功能会给查询过程提供严格的校验，你甚至可以尝试请求不存在的字段。

只需要 Schema 表达几行清晰的代码，就可以在客户端和服务端之间建立强类型的契约，这样可以防止你的服务接受虚假数据，并向请求着清晰地表明错误。

## 性能考量

尽管 GraphQL 为你解决了很多问题，但它并不能解决构建 API 的所有固友问题。特别是缓存和授权两方面，只是需要一些预案来防止性能问题。GraphQL 规范并没有为实现这两种方法提供任何指导，这意味着构建它们的责任落在了你身上。

### 缓存

基于 REST 的 API 在缓存时不需要过度关注，因为它们可以构建在 Web 的其他部分使用现有 HTTP 头策略上。GraphQL 不具有这些缓存机制，这会对重复请求造成不必要的处理负担。考虑一下两个查询：

```js
query {
  user(id: 1) {
    name
  }
}

query {
  user(id: 1) {
    email
  }
}
```

在没有某种缓存的情况下，只是为了检索两个不同的列，会导致两个数据库查询来获取 ID 为 1 的 User。实际上，由于 GraphQL 还允许使用别名，因此一下查询有效，并且还执行两次查找：

```j
query {
	one: user(id: 1) {
		name
	}
	two: user(id: 2) {
		name
	}
}
```

第二个示例暴露了如何批处理查询的问题。为了高效快速，我们希望 GraphQL 以尽可能少的往返次数访问相同的数据库行。

dataloader 程序包旨在解决这两个问题。给定一个 ID 数组，我们将一次性从数据库中获取所有这些 ID；同样，后续对同一 ID 的调用也将从缓存中获取该项目。要使用 dataloader 来构建这些，我们需要两样东西。首先我们需要一个函数来加载所有请求的对象。在我们示例中看起来是这样：

```js
const DataLoader = require('dataloader')
const batchGetUserbyId = async ids => {
  // 在实际开发中，这里通常是数据库调用
  return ids.map(id => users[id])
}
// userLoader 现在是我们的批量加载功能
const userLoader = new DataLoader(batchGetUserbyId)
```

这里我们可以解决批处理的问题，要加载数据并使用缓存，我们将使用 load 方法的调用来替换之前的数据查找，并传入我们的 用户 ID：

```js
const resolvers = {
  Query: {
    user(_, { id }) {
      return userLoader.load(id)
    }
  }
}
```

### 授权

对于 GraphQL 来说，授权是一个完全不同的问题。简而言之，它是识别给定用户是否有权查看某些数据的过程。我们可以想象一下这样的场景：经过认证的用户可以执行查询来获取自己的地址信息，但应该无法获取其他用户的地址。

为了解决这个问题，我们需要修改解析器函数。除了字段的参数外，解析器还可以访问它的父节点，以及传入的特殊上下文值，这些值可以提供有关当前已认证用户的信息。因为我们知道地址是一个敏感字段，所以我们需要修改我们的字段，是对用户的调用不只是返回一个地址列表，而是实际调用一些业务逻辑来验证请求：

```js
const getAddresses = function(currUser, user) {
  if(currUser.id === user.id) {
    return user.addresses
  }
  return []
}

const resolvers = {
  Query: {
    user(_, { id }) {
      return users[id]
    }
  },
  User: {
    addresses(parentObj, {}, context) {
      return getAddresses(context.currUser, parentObj)
    }
  }
}
```

同样，我们不需要为每个 User 字段显示定义一个解析程序，只需要定义一个我们要修改的解析程序即可。

默认情况下，express-graphql 会将当前的 HTTP 请求作为上下文的值来传递，但在设置服务器时可以更改：

```js
app.use(
	'/graphql',
  express_graphql({
    schema,
    graphiql: true,
    context: {
      currUser: user // 经过身份验证的用户
    }
  })
)
```

## Schema 最佳实践

GraphQL 规范中缺少的一个方面是缺乏对版本控制模式的指导。随着应用程序的成长和变化，它们的 API 也会随之变化，很可能需要删除或修改 GraphQL 字段和对象。但这个缺点也是积极的：通过仔细设计你的 Graphql Schema，你可以避免在更容易实现（也更容易破坏）的 REST 端点中明显的陷阱，如命名的不一致和混乱的关系。

此外，你应该尽量将业务逻辑和解析器逻辑分开。你的业务逻辑应该是这个应用程序的单一事实来源。在解析器中执行验证检查是很有诱惑力的，但随着模式的增长，这将成为一种难以维持的策略。

## GraphQL 什么时候不合适？

GraphQL 不能像 REST 一样精确地满足 HTTP 通信的需求。例如，无论成功与否，GraphQL 仅制定一个状态码 200.在这个响应中会返回一个特殊的错误键，供客户端解析和识别出错，因此，错误处理可能会有些棘手。

同样，GraphQL 只是一个规范，他不会自动解决你的应用程序面临的每个问题。性能问题不会消失，数据库查询不会变的更快，总的来说，你需要重新思考关于你的 API 的一切：授权、日志、监控、缓存。版本化你的 GraphQL API 也可能是一个挑战，因为惯犯规范目前不支持处理中断的变化，这是构建任何软件不可避免的一部分。

