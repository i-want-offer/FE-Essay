# 继承

>   js 的完美继承是寄生组合继承

```javascript
function Parent(name) {
  this.name = name
  this.sayName = function() {
    console.log(this.name)
  }
}

Parent.prototype.age =20
Parent.ptototype.sayAge = function() {
  console.log(this.age)
}

function Child(name) {
  Parent.call(this, name)
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
```

