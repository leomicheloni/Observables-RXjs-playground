# RXjs playground
## Introduction
This project is a set of step by steps examples meant to learn Observables theory using RXjs library.
## How to start
Type 
``` javascript
npm install
npm run start
```

The app will start running on port 4040

And follow up examples, put you code in **/src/main.ts**

# Observables 

## Theory
An observable is a way to work with **streams** of data, this data can have only one element and finish or an infinite number of elements.
Element come asyncronouly though.

For example, if you look at a highway from above you will see a stream of cars, but if you look at a parking lot you not.

So observables are objects with a some methods to retrieve elements from the stream, also, to know when there's some kind of error or if the stream is completed.

Another example on obsevables could be mouse movements, they occur randomly during time, and with no defined interval.

Angular uses observables as HTTP responses, since we start a HTTP call then we continue with other tasks untill HTTP response comes, then our observable tell us about it, after some time
HTTP stream finishes, then the observable is completed. (in case of Angular, in most cases reponses are array, but a stream of arrays with only one element, it is, the complete stream is finished after only one item is returnes, but this item is an array on itself, so this could be confunsing)

## Basics
Every observable object returns though **suscribe** an **observer** object, with three diferents methods:
 - next (it's executed with every new result from the stream)
 - complete (when the stream has no more results)
 - error (when an error ocurred, no next method will be called after that)

> We call this object observer

like this:

``` javascript
// creates an observable from the document.click event then suscribe to it
const buttonClickObs = fromEvent(document, "click");
buttonClickObs.subscribe(observer);
```
So you can create an object to get every result or just handle them

``` javascript
const observer = {
    next: (item : any) => {console.log("next " +  item)},
    complete: () => {console.log("complete")},
    error: () => {console.log("error")}
}

const buttonClickObs = fromEvent(document, "click");
buttonClickObs.subscribe(observer);
```

> You always need to suscribe to observable in order to start it

or just handle the three methos in order

``` javascript
const buttonClickObs = fromEvent(document, "click");
buttonClickObs.subscribe((item : any) => {
    console.log("next " +  item);
    },
    () => {
        console.log("complete")
    },
    () => {
        console.log("error")
    };
}
```

## Examples


### Create an observable from any event
``` javascript
// convert event into observable
// fromEvent(element, eventname);
const buttonClickObs = fromEvent(document, "click");
buttonClickObs.subscribe(data=>console.log(data));
```

``` javascript
// convert event into observable
// fromEvent(element, eventname);
const mouseMoveObs = fromEvent(document, "mousemove");
mouseMoveObs.subscribe(data=>console.log(data));
```

### Create an observable from any object

``` javascript
// of creates an observable from any object
const person = {
    name : "Leonardo"
};
const personObs : Observable<any> = of(person);
personObs.subscribe(observer); 
```
In this case the observable stream one and element the completes.

### Create an observable from an array
``` javascript
from([1,2,3,4,5,6,7,8,9,0]).subscribe(observer)
```

In this case the array is a stream that has ten element, the after stream all the elements in the array the **complete** method is called, since que stream has finished.

### Create an observable from a timer
``` javascript
// interval generates a sequence of number with a fixed interval, just like setInterval in Javascript. First element is emited inmediatly
interval(1000).subscribe(i=> console.log("interval: " + i));

// no interval, just 1 emition just like 'setTimeout' in Javascript
timer(5000).subscribe(observer);

// if you set initial duetime its behaves like and internval
// in this case first element after 1s, and then one every 2s
timer(1000, 2000).subscribe(observer);

// infinite
timer(5000, 1000).subscribe(observer);

``` 
### Operators
Operators intercept the stream an can modify them then re-send to next or not.

**pipe** operator is used to queue operators, like

``` javascript
// take only get a number of event under the current suscription, then ignore the others
buttonClickObs.pipe(take(1)).subscribe(observer);
```

``` javascript
// take only get a number of event under the current suscription, then ignore the others
buttonClickObs.pipe(skip(2)).subscribe(observer);
``` 

``` javascript
// filters elements based on any criteria (predicate)
var obsevable = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
obsevable.pipe(filter(i=>i>5)).subscribe(observer);
```

``` javascript
// generates an element in the stream every 1s, skips first 2 (skip operator), then changes the result to "this is.." with map operator

interval(1000).pipe(skip(2)).pipe(map(item=>"this is " + item )).subscribe(observer);
```

``` javascript
// proyects only some part of an obsevable result
let o = {
    name: "bob",
    lastname: "tables"
};

let observable = of(o);

observable.pipe(pluck("name")).subscribe(observer);
```

``` javascript
// tap can read response without any modification
from([1,2,3,4,5,6,7,8,9,0]).pipe(tap((i)=>console.log("TAP: " + i * 2))).subscribe(observer)

// map can alter response before send it to next
from([1,2,3,4,5,6,7,8,9,0]).pipe(map( (i)=> i * 2)).subscribe(observer)

// delay gets the complate stream and send to next after adding a delay
from([1,2,3,4,5,6,7,8,9,0]).pipe(delay(5000)).subscribe(observer)


// take alters resulting obsevable and completes it after a given number of element
interval(1000).pipe(take(10)).subscribe(observer);
```

Other operators:
 - while
 - skipWhile
 - takeUntil
 - select

### DebunceTime
// avoids the observable to emit until nothing is comming from source for a given time
``` javascript
let inputevent = fromEvent<any>(document.querySelector("input"), "input");
inputevent.pipe(map(i=>i.target.value)).pipe(debounceTime(400)).subscribe(observer);
```

### DistinctUntilChange

// filter values until change (by default compare values with === so refereces must be the same)
// you can pass a compare function to implement custom comparision

``` javascript
const source$ = from([1, 1, 2, 2, 3, 3]);

source$
  .pipe(distinctUntilChanged())
  .subscribe(observer);
```

### Advances stream manipulation

// Mergemap merges two observables into one
// waits for second observable to emit its values and pases first observable values to this
// we get values from secound observable
``` javascript

var obsevableButton = fromEvent(document.querySelector("#startButton"), "click");
var observableInterval = interval(1000);

obsevableButton.pipe(mergeMap((first)=> observableInterval.pipe(map(second => JSON.stringify( first ) + " | " +  second)))).subscribe(observer);

```

``` javascript
/// switch map uses two observables and can return second observable with every first observable next
/// or allows us to emit values after another observable emits a value
/// with every new value from the first observable the current suscription to the second is cacelled

// without switchmap
// triggers an interval when the user click a button
var button = document.querySelector('#startButton');
var obsevableButton = fromEvent(button, "click");
var observableInterval = interval(1000);

obsevableButton.subscribe(()=>{
    observableInterval.subscribe(observer);
});
// with this method we have a new suscription with every button click, but the previous suscription is still active
// with switchmap we can handle this
var button = document.querySelector('#startButton');
var obsevableButton = fromEvent(button, "click");
var observableInterval = interval(1000);

obsevableButton.pipe(switchMap(()=> observableInterval)).subscribe(observer);

// switch map just needs a secound observable as the return value, we can for sure read values from the first to do things, like
// (we alway receive values from the secound observable)

this.authsevice.getToken().pipe(
switchMap((authToken) => {
        let req : HttpRequest = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${authToken}`)
        });
        req.get(serviceUrl);
    })
);

// more examples

let $one : Observable<number> = interval(1000).pipe(take(10));
let $two : Observable<number> = timer(500, 1000).pipe(take(10));

$one.pipe(tap(i => console.log("$one " + i))).pipe(switchMap(elementsFromOne => {
    return $two;
})).subscribe(observer);

```

``` javascript
// in this exaple service2 calls service1 then gets the response and switches map to a new call using sevice1 responde, then returnes the new observalbe

let hasUpdated = service1.getPermissionSubscriptionState().pipe(
switchMap((userInfo) => {
    const serviceUrl = `${environment.backend.domain}/${userInfo.subscriptionStatus.userId}`;
    return this.update<boolean>(serviceUrl);
}));

```

### subject
un subject es una clase que controla aun observable con sus métodos next, complete y error; es, en efecto, un observer y observable al mismo tiempo.

``` javascript
// en este ejemplo se observan los clicks en document hasta que el botón #stopButton es presionado y finaliza el observable (subject) o #erroButton lo finaliza con error

let onStop = new Subject<void>();

fromEvent(document, "click").pipe(takeUntil(onStop)).subscribe(observer);

document.querySelector("#stopButton")?.addEventListener("click", ()=>{
    onStop.complete();
})

document.querySelector("#errorButton")?.addEventListener("click", ()=>{
    throwError("errorrr");
})

/// por ejemplo convertir un timer en un observable cada 10 segundos (Es solo un ejemplo)
// el botón #stopButton finaliza el subject y el observable

let subject = new Subject<boolean>();

subject.subscribe(observer);

let i = 0;
let ss = setInterval(()=>{
    i++;
    if(i === 10){
        i = 0;
        subject.next(true);
    }
}, 1000);

document.querySelector("#stopButton")?.addEventListener("click", ()=>{
    subject.complete();
})
```

## "Real world" examples:

### Create "something" to add to your observables so you can log them.


https://indepth.dev/posts/1222/create-a-taponce-custom-rxjs-operator
https://fireship.io/lessons/custom-rxjs-operators-by-example/
