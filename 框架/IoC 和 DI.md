# 大纲

本文将从六个方面入手，全方位探索面向对象编程中的 **IoC（控制反转）**和 **DI（依赖注入）**的设计思想。

阅读完本文，你将了解以下内容：

- IoC 是什么，IoC 能解决什么问题；
- IoC 与 DI 之间的关系，未使用 DI 和使用了 DI 框架之间的区别；
- DI 在 Angular 和 NestJS 中的应用；
- 了解如何使用 TypeScript 实现一个 IoC 容器，并了解 **装饰器、反射** 的相关知识。

# 背景介绍

在介绍什么是 IoC 容器之前，我们来举一个日常工作中很常见的场景，即创建指定类的实例。

最简单的情形是该类没有依赖其他类，但现实往往是残酷的，我们在创建某个类的实例时，往往需要依赖不同类对应的实例。为了能够更好地理解上述内容，我们举一个例子。

一辆小汽车通常由 **发动机、底盘、车身和电气设备** 四大部分组成。大概的设计图纸如下：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200906104325.png)

我们来定义车的类：

1.  定义车身类

    ```typescript
    export default class Body {}
    ```

2.  定义地盘类

    ```typescript
    export default class Chassis {}
    ```

3.  定义引擎类

    ```typescript
    export default class Engine {
      start() {
        console.log("引擎启动");
      }
    }
    ```

4.  定义汽车类

    ```typescript
    import Body from "./body";
    import Chassis from "./chassis";
    import Engine from "./engine";

    export default class Car {
      private body: Body;
      private engine: Engine;
      private chassis: Chassis;

      constructor() {
        this.body = new Body();
        this.engine = new Engine();
        this.chassis = new Chassis();
      }

      run() {
        this.engine.start();
      }
    }
    ```

一切准备就绪，我们马上造一辆汽车：

```typescript
const car = new Car();
car.run(); // '引擎启动'
```

虽然汽车已经可以启动了，但是存在以下问题：

- 在造车的时候，你不能选择配置。比如说你想更换汽车的引擎的话，按照目前的方案，无法实现；
- 在汽车类内部，你需要在构造函数中手动创建汽车各个部件。

为了解决第一个问题，我们修改一下我们的汽车类：

```typescript
import Body from "./body";
import Chassis from "./chassis";
import Engine from "./engine";

export default class Car {
  private body: Body;
  private engine: Engine;
  private chassis: Chassis;

  constructor(body: Body, engine: Engine, chassis: Chassis) {
    this.body = body;
    this.engine = engine;
    this.chassis = chassis;
  }

  run() {
    this.engine.start();
  }
}

const engine = new Engine();
const chassis = new Chassis();
const body = new Body();

const newCar = new Car(body, engine, chassis);
newCar.run();
```

此时我们已经解决了上面提到的第一个问题，要解决第二个问题，我们要来了解一下 IoC（控制反转）的概念。

# IoC 是什么

IoC（Inversion of Control），即 **控制反转**。在开发中，IoC 意味着你设计的对象交给容器控制，而不是使用传统的方式，在对象内部直接控制。

如何理解 IoC 呢？理解好 IoC 的关键要明确 **谁控制谁，控制了什么，为什么是反转，哪些方面反转了**。

## 谁控制谁，控制了什么

在传统的程序设计中，我们直接在对象内部通过 new 的方式创建对象，是程序主动创建以来对象；**而 IoC 是有专门一个容器来创建这些对象，即由 IoC 容器控制对象的创建**；

- **谁控制谁**：当然是 IoC 容器控制了对象；
- **控制了什么**：主要是控制外部资源（依赖对象）获取。

## 为什么是反转了，哪些方面反转了

有反转就有正向，传统应用程序是由我们自己在程序中主动控制去获取以来对象，也就是正向；而反转则是由容器来帮忙 **创建以及注入依赖对象**。

- **为什么是反转**：因为由容器帮我们查找以及注入依赖对象，对象只是被动的接受依赖对象，所以是反转了；
- **哪些方面反转了**：依赖对象的获取被反转了。

# IoC 能做什么

IoC 不是一种技术，而是一种思想，是面向对象编程中的一种设计原则，可以用来降低计算机代码之间的耦合度。

传统应用程序都是由我们在类内部主动创建以来对象，从而导致类与类之间高耦合，难于测试。**有了 IoC 容器后，把创建和查找依赖对象的控制权交给容器，由容器注入组合对象，所以对象之间是松散耦合。** 这样也便于测试，利于功能复用，更重要的是使的程序的整个体系结构变得非常灵活。

其实 IoC 对变成带来的最大改变不是从代码上的，而是思想上的，发生了 **主从换位** 的变化。应用程序本来是老大，想要获取什么资源都是主动出击；但是在 IoC 思想中，应用程序变成了被动，被动等待 IoC 容器来创建并注入它所需的资源了。

# IoC 和 DI 之间的关系

对于控制反转来说，最常见的方式叫做 **DI（依赖注入，Dependency Injection）**。

组件之间的依赖关系由组件在运行期决定，形象的说，即由组件动态地将某个依赖关系注入到组件之中。**依赖注入的目的并非为软件系统带来更多功能，而是为了提升组件重用的频率，并为组件搭建一个灵活、可扩展的平台**。

理解 DI 的关键是 **谁依赖了谁，为什么需要依赖，谁注入了谁，注入了什么**：

- **谁依赖了谁**：当然是应用程序依赖 IoC 容器；
- **为什么需要依赖**：应用程序需要 IoC 容器来提供对象需要的外部资源（包括对象、资源、常量数据）；
- **谁注入谁**：很明显是 IoC 容器注入应用程序对象；
- **注入了什么**：注入某个对象所需要的外部资源（包括对象、资源、常量数据）。

那么 IoC 和 DI 有什么关系？其实它们是同一个概念的不同角度描述。

有了 IoC 容器，依赖关系就发生了改变，原有的依赖关系消失了，它们都变成依赖 IoC 容器，通过 IoC 容器来建立它们之间的关系。

## 未使用依赖注入框架

假设我们的服务 A 依赖于服务 B，那么当我们需要使用服务 A 的时候，我们需要先创建服务 B。具体流程如下图：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200906113000.png)

从上图可知，未使用依赖注入框架时，服务的使用者需要关心服务本身和其依赖的对象是如何创建而来的，且需要手动维护依赖关系。若服务本身依赖多个对象，这样就会增加使用难度和后期的维护成本。

## 使用依赖注入框架

使用依赖注入框架后，系统中的服务会统一注册到 IoC 容器中，如果服务有依赖其他的服务，也需要对依赖进行声明。当用户需要使用特定的服务时，IoC 容器会负责该服务及其依赖对象的创建与管理工作。具体工作流程如下：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200906113232.png)

# DI 的应用

DI 在前端和服务端都有相应的应用，比如前端领域的代表是 Angular，而在服务端 Node.js 领域中的代表是 NestJS。

## DI 在 Angular 中的应用

以前面汽车为例，我们可以把汽车、发动机、底盘和车身这些认为是一种 **服务**，所以它们会议服务提供者的形式注册到 DI 系统中。为了区分不同服务，我们需要使用不同的令牌（Token）来标记他们。接着我们会基于已注册的服务提供者创建注入器对象。

之后，当我们需要获取指定服务时，我们就可以通过该服务对应的令牌，从注入器对象中获取令牌对象对应的依赖对象。上述的流程具体如下图：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200906113829.png)

下面我们来看看 Angular 内置的 DI 系统如何 _造车_。

### car.service.ts

```typescript
import { Injectable, ReflectiveInjector } from "@angular/core";

// 配置Provider
@Injectable({
  providedIn: "root",
})
export class Body {}

@Injectable({
  providedIn: "root",
})
export class Chassis {}

@Injectable({
  providedIn: "root",
})
export class Engine {
  start() {
    console.log("引擎启动");
  }
}

@Injectable()
export default class Car {
  // 使用构造注入方式注入依赖对象
  constructor(
    private engine: Engine,
    private body: Body,
    private chassis: Chassis
  ) {}

  run() {
    this.engine.start();
  }
}

const injector = ReflectiveInjector.resolveAndCreate([
  Car,
  Engine,
  Chassis,
  Body,
]);

const car = injector.get(Car);
car.run();
```

以上代码中我们调用了 ReflectiveInjector 对象的 resolveAndCreate 方法手动创建注入器，然后根据车辆的 Token 来获取对应的依赖对象。通过观察上述代码，你可以发现我们已经不需要手动的管理和维护依赖对象了，这些脏活累活已经交给注入器来处理。

此外，如果要能正常获取汽车对象，我们还需要在 `app.module.ts` 文件声明 Car 对应的 Provider。

### app.module.ts

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import Car, { Body, Chassis, Engine } from "./car.service";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [{ provide: Car, deps: [Engine, Body, Chassis] }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## DI 在 NextJS 中的应用

NextJS 是构建高效，可扩展的 Node.js Web 应用程序框架。它是用现代的 JavaScript 或 TypeScript，并结合 OOP（面向对象编程），FP（函数式编程）和 FRP（函数响应式编程）的元素。

在底层，Next 使用了 Express，但也提供了与其它各种库的兼容，例如 Fastify，可以方便地使用各种第三方插件。

**NextJS 旨在提供一个开箱即用的应用程序体系结构，允许轻松创建高度可测试，可扩展，松散耦合且易于维护的应用程序。** 在 NextJS 中也为我们开发者提供了依赖注入的功能。

# 手写 IoC 容器

在手写 IoC 容器之前，我们需要了解一些前置知识。

## 装饰器

目前前端领域，装饰器的使用已经是非常普遍了，如果你写过 Angular 的代码，你对以下的代码一定不会陌生。

```typescript
@Injectable()
export class HttpService {
  constructor(private httpClient: HttpClient) {}
}
```

在以上代码中，我们使用了 Injectable 装饰器，该装饰器用于表示此类可以自动注入器依赖项。

装饰器是一个包装类、函数或方法并为其添加行为的函数。这对于定义与对象关联的元数据很有用。装饰器有以下四种分类：

- 类装饰器（Class decorators）
- 属性装饰器（Property decorators）
- 方法装饰器（Method decorators）
- 参数装饰器（Parameter decorators）

上面使用的 `@Injectable()` 装饰器属于类装饰器，在该类装饰器修饰的 HttpService 类中，我们通过构造注入的方式注入了用于处理 Http 请求的 HttpClient 依赖对象。

## 反射

以上的代码若设置编译目标为 ES5，则会生成以下代码：

```js
// 忽略__decorate函数等代码
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };

var HttpService = /** @class */ (function () {
  function HttpService(httpClient) {
    this.httpClient = httpClient;
  }
  var _a;
  HttpService = __decorate(
    [
      Injectable(),
      __metadata("design:paramtypes", [
        typeof (_a = typeof HttpClient !== "undefined" && HttpClient) ===
        "function"
          ? _a
          : Object,
      ]),
    ],
    HttpService
  );
  return HttpService;
})();
```

通过观察上述代码，我们可以发现 HttpService 构造函数中 httpClient 的类型被成功擦出，那么在运行时阶段是如何保证注入正确类型的依赖对象呢？

这里 TypeScript 使用 reflect-metadata 这个第三方库来存储额外的类型信息。

reflect-metadata 这个库提供了很多 API 用于操作元数据，我们只简单介绍几个常用的 API：

```js
// define metadata on an object or property
Reflect.defineMetadata(metadataKey, metadataValue, target);
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

// check for presence of a metadata key on the prototype chain of an object or property
let result = Reflect.hasMetadata(metadataKey, target);
let result = Reflect.hasMetadata(metadataKey, target, propertyKey);

// get metadata value of a metadata key on the prototype chain of an object or property
let result = Reflect.getMetadata(metadataKey, target);
let result = Reflect.getMetadata(metadataKey, target, propertyKey);

// delete metadata from an object or property
let result = Reflect.deleteMetadata(metadataKey, target);
let result = Reflect.deleteMetadata(metadataKey, target, propertyKey);

// apply metadata via a decorator to a constructor
@Reflect.metadata(metadataKey, metadataValue)
class C {
  // apply metadata via a decorator to a method (property)
  @Reflect.metadata(metadataKey, metadataValue)
  method() {}
}
```

对于上述的 API，我们只需要简单的了解即可，后续会详细介绍如何使用。

这里我们需要注意以下两个问题：

- 对于类或者函数，我们需要使用装饰器来修饰它们，这样才能保存元数据；
- 只有类、美剧或原始数据类型能被记录。接口和联合类型作为 _对象_ 出现。这是因为这些类型在编译后完全消失，而类却一直存在。

## 定义 Token 和 Provider

了解完装饰器与反射相关的知识后，我们开始实现 IoC 容器。

我们的 IoC 容器将使用两个主要的概念：令牌（Token）和提供者（Provider）。令牌事 IoC 容器所要创建对象的标识符，而提供者用于描述如何创建这些对象。

IoC 容器最小的公共接口如下所示：

```typescript
export class Container {
  addProvider<T>(provider: Provider<T>) {} // TODO
  inject<T>(type: Token<T>): T {} // TODO
}
```

接下来我们先来定义 Token：

```typescript
// type.ts
interface Type<T> extends Function {
  new (...args: any[]): T;
}

// provider.ts
class InjectionToken {
  constructor(public injectionIdentifier: string) {}
}

export type Token<T> = Type<T> | InjectionToken;
```

Token 类型是一个联合类型，既可以是一个函数类型也可以是 InjectionToken 类型。

定义完 Token 类型，接下来我们来定义三种不同类型的 Provider：

- ClassProvider：提供一个类，用于创建依赖对象；
- ValueProvider：提供一个已存在的值，作为依赖对象；
- FactoryProvider：提供一个工厂方法，用于创建依赖对象。

```typescript
// provider.ts
export type Factory<T> = () => T;

export interface BaseProvider<T> {
  provide: Token<T>;
}

export interface ClassProvider<T> extends BaseProvider<T> {
  useClass: Type<T>;
}

export interface ValueProvider<T> extends BaseProvider<T> {
  useValue: T;
}

export interface FactoryProvider<T> extends BaseProvider<T> {
  useFactory: Factory<T>;
}

export type Provider<T> =
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>;
```

为了区分这三种不同类型的 Provider，我们自定义了三个类型守卫函数：

```typescript
// provider.ts
export function isClassProvider<T>(
  provider: Provider<T>
): provider is ClassProvider<T> {
  return !!(provider as ClassProvider<T>).useClass;
}

export function isValueProvider<T>(
  provider: Provider<T>
): provider is ValueProvider<T> {
  return !!(provider as ValueProvider<T>).useValue;
}

export function isFactoryProvider<T>(
  provider: Provider<T>
): provider is FactoryProvider<T> {
  return !!(provider as FactoryProvider<T>).useFactory;
}
```

## 定义装饰器

对于类或函数，我们需要使用装饰器来修饰它们，这样才能保存元数据。因此，接下来我们分别创建 Injectable 和 Inject 装饰器。

### Injectable 装饰器

Injectable 装饰器用于表示此类可以自动注入其依赖项，该装饰器属于类装饰器。在 TypeScript 中，类装饰器的声明如下：

```typescript
declare type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void;
```

类装饰器顾名思义，就是用来修饰类的。它接受一个参数 `target: TFunction`，表示被装饰的类：

```typescript
/// Injectable.ts
import type { Type } from "./type";
import "reflect-metadata";

const INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_KEY");

export function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
    return target;
  };
}
```

在以上代码中，当调用完 Injectable 函数后，会返回一个新的函数。在新的函数中，我们使用 reflect-metadata 这个库提供的 defineMetaData API 来保存元信息，其中 defineMetaData API 的使用方式如下所示：

```js
// define metadata on an object or property
Reflect.defineMetadata(metadataKey, metadataValue, target);
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
```

Injectable 类装饰器使用方式也很简单，只需要在被装饰的类上方使用 `@Injectable()` 即可：

```typescript
@Injectable
export class HttpService {
  constructor(private httpClient: HttpClient) {}
}
```

以上例子中，我们注入的是 Type 类型的 HttpClient 对象。但实际项目中，往往会更加复杂，除了需要注入 Type 类型的依赖对象以外，我们还可能会注入其他类型的依赖对象，比如我们希望在 HttpService 服务中注入远程服务器的 API 地址。针对这种情况下，我们需要使用 Inject 装饰器。

### Inject 装饰器

Inject 装饰器输入参数装饰器，在 TypeScript 中的声明如下：

```typescript
declare type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) => void;
```

参数装饰器顾名思义，是用来装饰函数参数，它接收三个参数：

1.  `target: Object`：被装饰的类；
2.  `propertyKey: string | symbol`：方法名；
3.  `parameterIndex: number`：方法中参数的索引值。

Inject 装饰器的具体实现：

```typescript
import type { Token } from "./provider";
import "reflect-metadata";

const INJECT_METADATA_KEY = Symbol("INJECT_KEY");

export function Inject<T = any>(token: Token<T>) {
  return function (target: any, _: string | symbol, index: number) {
    Reflect.defineMetadata(
      INJECT_METADATA_KEY,
      token,
      target,
      `index-${index}`
    );
    return target;
  };
}
```

在以上代码中，当调用完 Inject 函数之后，会返回一个新的函数。在新的函数中，我们使用 reflect-metadata 这个库提供的 defineMetadata API 来保存参数相关的元信息。这里是保存 index 索引信息和 Token 信息。

定义完 Inject 装饰器，我们就可以利用它来注入我们前面所提到的远程服务器的 API 地址，具体的使用方式如下：

```typescript
const API_URL = new InjectionToken("apiUrl");

@Injectable()
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}
}
```

## 实现 IoC 容器

目前为止，我们已经定义了 Token、Provider、Injectable 和 Inject 装饰器。接下来我们来实现钱买你所提到的 IoC 容器的 API：

```typescript
export class Container {
  addProvider<T>(provider: Provider) {} // TODO
  inject<T>(type: Token<T>): T {} // TODO
}
```

### 实现 addProvider 方法

addProvider 方法的实现很简单，我们使用 Map 来存储 Token 与 Provider 之间的关系：

```typescript
export class Container {
  private providers = new Map<Token<any>, Provider<any>>();

  addProvider<T>(provider: Provider<T>) {
    this.assertInjectableIfClassProvider(provider);
    this.providers.set(provider.provide, provider);
  }
}
```

在 addProvider 方法内部除了把 Token 与 Provider 的对应信息保存到 providers 对象中以外，我们定义了一个 assertInjectableIfClassProvider 方法，用于确保添加的 ClassProvider 是可注入的：

```typescript
class Container {
  private assertInjectableIfClassProvider<T>(provider: Provider<T>) {
    if (isClassProvider(provider) && !isInjectable(provider.useClass)) {
      throw new Error(
        `Cannot provide ${this.getTokenName(
          provider.provide
        )} using class ${this.getTokenName(
          provider.useClass
        )}, ${this.getTokenName(provider.useClass)} isn't injectable`
      );
    }
  }
}
```

在这个方法中，我们使用了前面介绍的类型守卫函数来判断是否为 ClassProvider，如果是，在判断 ClassProvider 是否可注入：

```typescript
export function isInjectable<T>(target: Type<T>) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true;
}
```

如果添加的 Provider 是 ClassProvider，但 Provider 对应的类是不可注入的，则会抛出异常。为了让异常消息更加友好，也更加直观。我们定义了一个 `getTokenName` 方法来获取 Token 对应的名称：

```typescript
class x {
  private getTokenName<T>(token: Token<T>) {
    return token instanceof InjectionToken
      ? token.injectionIdentifier
      : token.name;
  }
}
```

现在我们已经实现了 Container 类的 `addProvider` 方法，这时我们就可以使用它来添加三种不同类型的 Provider：

```js
const container = new Container();
const input = { x: 200 };

class BasicClass {}
// 注册ClassProvider
container.addProvider({ provide: BasicClass, useClass: BasicClass });
// 注册ValueProvider
container.addProvider({ provide: BasicClass, useValue: input });
// 注册FactoryProvider
container.addProvider({ provide: BasicClass, useFactory: () => input });
```

需要注意的是，以上示例中注册三种不同类型的 Provider 使用的是同一个 Token 仅是为了演示而已。下面我们来实现 Container 类中核心的 inject 方法。

### 实现 inject 方法

在看 inject 方法的具体实现之前，我们先来看一下该方法所实现的功能：

```js
const container = new Container();
const input = { x: 200 };

container.addProvider({ provide: BasicClass, useValue: input });
const output = container.inject(BasicClass);
expect(input).toBe(output); // true
```

观察以上的测试用例可知，Container 类中 inject 方法所实现的功能就是根据 Token 获取与之对应的对象。在前面实现的 addProvider 方法中，我们把 Token 和该 Token 对应的 Provider 保存在 providers Map 对象中。所以在 inject 方法中，我们可以先从 providers 对象中获取该 Token 对应的 Provider 对象，然后在根据不同类型的 Provider 来获取其对应的对象。

好的，下面我们来看一下 inject 方法的具体实现：

```typescript
class x {
  inject<T>(type: Token<T>): T {
    let provider = this.providers.get(type);
    // 处理使用Injectable装饰器修饰的类
    if (provider === undefined && !(type instanceof InjectionToken)) {
      provider = { provide: type, useClass: type };
      this.assertInjectableIfClassProvider(provider);
    }
    return this.injectWithProvider(type, provider);
  }
}
```

在以上代码中，除了处理正常的流程之外。我们还处理一个特殊的场景，即没有使用 `addProvider` 方法注册 Provider，而是使用 Injectable 装饰器来装饰某个类。对于这个特殊场景，我们会根据传入的 type 参数来创建一个 provider 对象，然后进一步调用 `injectWithProvider` 方法来创建对象，该方法的具体实现如下：

```typescript
class x {
  private injectWithProvider<T>(type: Token<T>, provider?: Provider<T>): T {
    if (provider === undefined) {
      throw new Error(`No provider for type ${this.getTokenName(type)}`);
    }
    if (isClassProvider(provider)) {
      return this.injectClass(provider as ClassProvider<T>);
    } else if (isValueProvider(provider)) {
      return this.injectValue(provider as ValueProvider<T>);
    } else {
      return this.injectFactory(provider as FactoryProvider<T>);
    }
   }
}
```

在 `injectWithProvider` 方法内部，我们会使用前面定义的用于区分三种不同类型 Provider 的类型守卫函数来处理不同的 Provider。这里我们先来看一下最简单 ValueProvider，当发现注入的是 ValueProvider 类型时，则会调用 `injectValue` 方法来获取其对应的对象：

```typescript
// { provide: API_URL, useValue: 'https://www.semlinker.com/' }
class x {
  private injectValue<T>(valueProvider: ValueProvider<T>): T {
    return valueProvider.useValue;
  }
}
```

接着我们来看如何处理 FactoryProvider 类型的 Provider，如果发现是 FactoryProvider 类型时，则会调用 `injectFactory` 方法来获取其对应的对象，该方法的实现也很简单：

```typescript
// const input = { x: 200 };
// container.addProvider({ provide: BasicClass, useFactory: () => input });
class x {
  private injectFactory<T>(valueProvider: FactoryProvider<T>): T {
    return valueProvider.useFactory();
  }
}
```

最后我们来分析一下如何处理 ClassProvider，对于 ClassProvider 类说，通过 Provider 对象的 useClass 属性，我们就可以直接获取到类对应的构造函数。最简单的情形是该类没有依赖其他对象，但在大多数场景下，即将实例化的服务类是会依赖其他的对象的。所以在实例化服务类前，我们需要构造其依赖的对象。

那么现在问题来了，怎么获取类所依赖的对象呢？我们先来分析一下以下代码：

```typescript
const API_URL = new InjectionToken("apiUrl");

@Injectable()
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}
}
```

以上代码若设置编译的目标为 ES5，则会生成以下代码：

```js
// 已省略__decorate函数的定义
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };

var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };

var HttpService = /** @class */ (function () {
  function HttpService(httpClient, apiUrl) {
    this.httpClient = httpClient;
    this.apiUrl = apiUrl;
  }
  var _a;
  HttpService = __decorate(
    [
      Injectable(),
      __param(1, Inject(API_URL)),
      __metadata("design:paramtypes", [
        typeof (_a = typeof HttpClient !== "undefined" && HttpClient) ===
        "function"
          ? _a
          : Object,
        String,
      ]),
    ],
    HttpService
  );
  return HttpService;
})();
```

观察以上的代码会不会觉得有点晕？不要着急，阿宝哥会逐一分析 HttpService 中的两个参数。首先我们先来分析 `apiUrl` 参数：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200906162203.png)

在图中我们可以很清楚地看到，`API_URL` 对应的 Token 最终会通过 Reflect.defineMetadata API 进行保存，所使用的 Key 是 `Symbol('INJECT_KEY')`。而对于另一个参数即 httpClient，它使用的 Key 是 `"design:paramtypes"`，它用于修饰目标对象方法的参数类型。

除了 `"design:paramtypes"` 之外，还有其他的 `metadataKey`，比如 `design:type` 和 `design:returntype`，它们分别用于修饰目标对象的类型和修饰目标对象方法返回值的类型。

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200906162224.png)

由上图可知，HttpService 构造函数的参数类型最终会使用 `Reflect.metadata` API 进行存储。了解完上述的知识，接下来我们来定义一个 `getInjectedParams` 方法，用于获取类构造函数中声明的依赖对象，该方法的具体实现如下：

```typescript
type InjectableParam = Type<any>;
const REFLECT_PARAMS = "design:paramtypes";

class x {
  private getInjectedParams<T>(target: Type<T>) {
    // 获取参数的类型
    const argTypes = Reflect.getMetadata(REFLECT_PARAMS, target) as (
        | InjectableParam
        | undefined
    )[];
    if (argTypes === undefined) {
        return [];
    }
    return argTypes.map((argType, index) => {
      // The reflect-metadata API fails on circular dependencies, and will return undefined
      // for the argument instead.
      if (argType === undefined) {
        throw new Error(
          `Injection error. Recursive dependency detected in constructor for type ${target.name}
             with parameter at index ${index}`
        );
      }
      const overrideToken = getInjectionToken(target, index);
      const actualToken = overrideToken === undefined ? argType : overrideToken;
      let provider = this.providers.get(actualToken);
      return this.injectWithProvider(actualToken, provider);
    });
  }
}
```

因为我们的 Token 的类型是 `Type<T> | InjectionToken` 联合类型，所以在 `getInjectedParams` 方法中我们也要考虑 InjectionToken 的情形，因此我们定义了一个 `getInjectionToken` 方法来获取使用 `@Inject` 装饰器注册的 Token，该方法的实现很简单：

```typescript
export function getInjectionToken(target: any, index: number) {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target, `index-${index}`) as
    | Token<any>
    | undefined;
}
```

现在我们已经可以获取类构造函数中所依赖的对象，基于前面定义的 `getInjectedParams` 方法，我们就来定义一个 `injectClass` 方法，用来实例化 ClassProvider 所注册的类。

```typescript
// { provide: HttpClient, useClass: HttpClient }
class x {
  private injectClass<T>(classProvider: ClassProvider<T>): T {
    const target = classProvider.useClass;
    const params = this.getInjectedParams(target);
    return Reflect.construct(target, params);
  }
}
```

这时 IoC 容器中定义的两个方法都已经实现了，我们来看一下 IoC 容器的完整代码：

```typescript
// container.ts
type InjectableParam = Type<any>;

const REFLECT_PARAMS = "design:paramtypes";

export class Container {
  private providers = new Map<Token<any>, Provider<any>>();

  addProvider<T>(provider: Provider<T>) {
    this.assertInjectableIfClassProvider(provider);
    this.providers.set(provider.provide, provider);
  }

  inject<T>(type: Token<T>): T {
    let provider = this.providers.get(type);
    if (provider === undefined && !(type instanceof InjectionToken)) {
      provider = { provide: type, useClass: type };
      this.assertInjectableIfClassProvider(provider);
    }
    return this.injectWithProvider(type, provider);
  }

  private injectWithProvider<T>(type: Token<T>, provider?: Provider<T>): T {
    if (provider === undefined) {
      throw new Error(`No provider for type ${this.getTokenName(type)}`);
    }
    if (isClassProvider(provider)) {
      return this.injectClass(provider as ClassProvider<T>);
    } else if (isValueProvider(provider)) {
      return this.injectValue(provider as ValueProvider<T>);
    } else {
      // Factory provider by process of elimination
      return this.injectFactory(provider as FactoryProvider<T>);
    }
  }

  private assertInjectableIfClassProvider<T>(provider: Provider<T>) {
    if (isClassProvider(provider) && !isInjectable(provider.useClass)) {
      throw new Error(
        `Cannot provide ${this.getTokenName(
          provider.provide
        )} using class ${this.getTokenName(
          provider.useClass
        )}, ${this.getTokenName(provider.useClass)} isn't injectable`
      );
    }
  }

  private injectClass<T>(classProvider: ClassProvider<T>): T {
    const target = classProvider.useClass;
    const params = this.getInjectedParams(target);
    return Reflect.construct(target, params);
  }

  private injectValue<T>(valueProvider: ValueProvider<T>): T {
    return valueProvider.useValue;
  }

  private injectFactory<T>(valueProvider: FactoryProvider<T>): T {
    return valueProvider.useFactory();
  }

  private getInjectedParams<T>(target: Type<T>) {
    const argTypes = Reflect.getMetadata(REFLECT_PARAMS, target) as (
      | InjectableParam
      | undefined
    )[];
    if (argTypes === undefined) {
      return [];
    }
    return argTypes.map((argType, index) => {
      // The reflect-metadata API fails on circular dependencies, and will return undefined
      // for the argument instead.
      if (argType === undefined) {
        throw new Error(
          `Injection error. Recursive dependency detected in constructor for type ${target.name}
             with parameter at index ${index}`
        );
      }
      const overrideToken = getInjectionToken(target, index);
      const actualToken = overrideToken === undefined ? argType : overrideToken;
      let provider = this.providers.get(actualToken);
      return this.injectWithProvider(actualToken, provider);
    });
  }

  private getTokenName<T>(token: Token<T>) {
    return token instanceof InjectionToken
      ? token.injectionIdentifier
      : token.name;
  }
}
```

最后我们来简单测试一下我们前面开发的 IoC 容器，具体的测试代码如下所示：

```typescript
// container.test.ts
import { Container } from "./container";
import { Injectable } from "./injectable";
import { Inject } from "./inject";
import { InjectionToken } from "./provider";

const API_URL = new InjectionToken("apiUrl");

@Injectable()
class HttpClient {}

@Injectable()
class HttpService {
  constructor(
    private httpClient: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}
}

const container = new Container();

container.addProvider({
  provide: API_URL,
  useValue: "https://www.semlinker.com/",
});

container.addProvider({ provide: HttpClient, useClass: HttpClient });
container.addProvider({ provide: HttpService, useClass: HttpService });

const httpService = container.inject(HttpService);
console.dir(httpService);
```

以上代码成功运行后，控制台会输出以下结果：

```
HttpService {
  httpClient: HttpClient {},
  apiUrl: 'https://www.semlinker.com/' }
```

很明显该结果正是我们所期望的，这表示我们 IoC 容器已经可以正常工作了。当然在实际项目中，一个成熟的 IoC 容器还要考虑很多东西，如果小伙伴想在项目中使用的话，建议可以考虑使用 InversifyJS 这个库。
