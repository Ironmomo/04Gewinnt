class myClass {
    constructor(name) {
        this.name = name
    }

    speak() {
        console.log(`Hi this is ${this.name}`)
    }
}

const o1 = new myClass("sepp")
const o2 = new myClass("hans")

const array = [o1,o2]

const jsonData = JSON.stringify(array)

console.log(jsonData)

const arrayAfter = JSON.parse(jsonData)

arrayAfter.forEach(o => {
    Object.setPrototypeOf(o,myClass.prototype)
    o.speak()
})
