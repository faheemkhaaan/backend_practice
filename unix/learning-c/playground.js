
const obj = { name: 'faheem' };

let n = 6;


function modify(o, n) {
    o.name = 'Faheem Khan';
    n = 6000;
}

console.log(obj)
console.log(n);

modify(obj, n);

console.log(obj)
console.log(n);
