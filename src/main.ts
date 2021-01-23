import { from, fromEvent, interval, Observable, of, Subject, throwError, timer } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, filter, map, mergeMap, pluck, skip, switchMap, take, takeUntil, tap } from 'rxjs/operators';

const observer = {
    next: (item: any) => {
        console.log(item);
        document.querySelector("#output").innerHTML += `<br /> next ${item}`;
    },
    complete: () => {
        document.querySelector("#output").innerHTML += `<br /> complete`;
    },
    error: () => {
        document.querySelector("#output").innerHTML += `<br /> error`;
    }
}
