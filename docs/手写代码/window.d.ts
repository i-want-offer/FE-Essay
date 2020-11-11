declare interface Function {
  Call(context: { fn: Function }, ...args: any): any;

  Apply(context: { fn: Function }, args: any[]): any;

  Bind(context: { fn: Function }, ...args: any): (...args: any) => any;
}

declare interface Window {
  fn: Function;
}

declare interface Object {
  __proto__: Object | null;
}
