interface Handlers {
  get(val: any): void;

  set(newVal: any, oldVal: any): void;
}

class Observer<T extends { [key: string]: any } = {}> {
  private data: T;

  constructor(data: T) {
    this.data = data;
    this.proxyData();
  }

  observe(key: keyof T, handlers: Handlers): void {
    const value = this.data[key];

    Object.defineProperty(this.data, key, {
      get: () => {
        handlers.get(value);
        return value;
      },
      set: (val) => {
        if (val === value) return;
        handlers.set(val, value);
        this.data[key] = val;
      },
    });
  }

  private proxyData(): void {
    const keys = Object.keys(this.data);
    for (const key of keys) {
      Object.defineProperty(this, key, {
        get: () => {
          return this.data[key];
        },
        set: (val) => {
          this.data[key as keyof T] = val;
        },
      });
    }
  }
}
