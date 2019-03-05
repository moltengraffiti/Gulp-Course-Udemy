class Person {
    constructor (name){
        this.name=name;
    }
    hello(){
        if (typeof this.name==='string'){
            return 'Hello, my name is ' + this.name;
        }
        else{
            return 'Hello!';
        }
    }
}

var person1 = new Person('Samantha');

var name='Sam123';
document.write(Person.hello);