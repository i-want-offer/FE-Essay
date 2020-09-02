class Scheduler {
  private list: (() => Promise<void>)[] = [];
  private readonly maxCount: number;
  private index = 0;

  constructor(maxCount: number) {
    this.maxCount = maxCount;
  }

  add(fn: () => Promise<void>) {
    this.list.push(fn);
  }

  start() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }

  private request() {
    if (!this.list || !this.list.length || this.index >= this.maxCount) {
      return;
    }
    this.index++;
    const fn = this.list.shift()!;
    fn().then(() => {
      this.index--;
      this.request();
    });
  }
}

const scheduler = new Scheduler(2);

function timeout(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

function addTask(time: number, order: number) {
  scheduler.add(() =>
    timeout(time).then(() => {
      console.log(order);
    })
  );
}

addTask(1000, 1);
addTask(500, 2);
addTask(300, 3);
addTask(400, 4);
