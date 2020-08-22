# 手写 MVVM

>   实现简易版 MVVM

```typescript
interface Handlers {
    get(val): void
    set(newVal, oldVal): void
}

class Observer<T extends object = {}> {
    private data: T

    constructor(data: T) {
        this.data = data
        this.proxyData()
    }

    private proxyData(): void {
        const keys = Object.keys(this.data)
        for (const key of keys) {
            Object.defineProperty(this, key, {
                get: () => {
                    return this.data[key]
                },
                set: (val) => {
                    this.data[key] = val
                }
            })
        }
    }

    observe(key: keyof T, handlers: Handlers): void {
        const value = this.data[key]

        Object.defineProperty(this.data, key, {
            get: () => {
                handlers.get(value)
                return value
            },
            set: (val) => {
                if (val === value) return
                handlers.set(val, value)
                this.data[key] = val
            }
        })
    }
}
```

