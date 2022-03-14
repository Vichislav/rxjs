import {debounceTime, distinctUntilChanged, fromEvent, map, observable, Observable} from "rxjs";

// знак $ в конце слова это признак Observable
const search$ = new Observable<Event>(observer => {
  const search = document.getElementById("212");
  const stop = document.getElementById("stop");

  if (!search || !stop) {
    observer.error('Element does not exist on the page');
    return; // return пишем что бы не производить подписку на null (не идти дальше)
  }

  // @ts-ignore
  const onSearch = event => {
    console.log(123);
    chekSubscription();
    observer.next(event);
  };

  // @ts-ignore
  const onStop = event => {
    chekSubscription();
    observer.complete();
    clear();
  };

  search.addEventListener('input', onSearch);
  stop.addEventListener('click', onStop);

  const chekSubscription = () => {
    if (observer.closed) {
      clear();
    }
  };

  const clear = () => {
    search.removeEventListener('input', onSearch);
    stop.removeEventListener('click', onStop);
  };
});

//тоже самое чт вверху только реализовано при помощи RxJs
// fromEvent из элемента типа <Event>, на элементе document... хочу получить
//событие input. Observable<Event> это я так понял типизация search$
// @ts-ignore
//const search$ : Observable<Event> = fromEvent<Event>(document.getElementById('212'), 'input');

const searchSubscription = search$.pipe(
  map(event => {
    //здесь мы уточняем тип value как HTMLInputElement
    return (event.target as HTMLInputElement).value; // для того что бы возвращать слово а не букву
  }),
  // забирает значение с задержкой в 500 мили секунд
  debounceTime(500),
  //если длина введенного слова меньше 3 символов то оно равно пустой строке
  // отбразиться в input только тогда, когда символов будет 4 и более
  map(value => value.length > 3 ? value : ''),
  // что бы не повторять запрос при одном и том же слове
  distinctUntilChanged()
  // подписываемся на событие search$ (см вверх) получаем value и выводим его в консоль
).subscribe( value => {
  console.log(value);
});

setTimeout(() =>{
  console.log('unsubscribe');
  searchSubscription.unsubscribe();
}, 10000)


/*короткая запись subscribe */
/*search$.subscribe( value => {
    console.log(value);
  });*/

/*расширинная запись subscribe, не через value в начале
* а через next, позволяет дописать допом отслеживание ошибки
*  error и функцию завершения complete*/
/*search$.subscribe({
  next: value => {
    console.log(value);
    },
  error: err => console.log(err),
  complete: () => {
    console.log('Event end')
  }
});*/
