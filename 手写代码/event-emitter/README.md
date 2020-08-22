# 手写观察者

>   实现一个类可以完成事件 on，once，trigger，off

```typescript
interface Events {
    [key: string]: Handler[]
}

type Handler = (...args: any) => void

class EventEmitter {
  private events: Events = {}
  
  on(type: string, handler: Handler): void {
    this.events[type] = this.events[type] ?? []
    this.events[type].push(handler)
  }
  
  off(type: string): void {
		delete this.events[type]
  }
  
  once(type: string, handler: Hanlder): void {
    const fn = (...args: any): void => {
			handler(args)
      this.off(type)
    }
    this.on(type, fn)
  }
  
  trigger(type: string, ...rest: any): void {
    this.events[type]?.forEach(fn => {
    	fn(rest)
  	})
  }
}
```

