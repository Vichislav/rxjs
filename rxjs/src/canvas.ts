import {fromEvent, map, pairwise, switchMap, takeUntil} from "rxjs";

// получаем обьект canvas как HTMLCanvasElement
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
//получаем контекст в 2d...
const cx = canvas.getContext('2d');
//задаем толщину линии отрисовки
if (cx != null) {
  cx.lineWidth = 4;
}
//интрефейс точки
interface Position {
  x: number;
  y: number;
}
//функция отрисовки линии
function drawLine([prev, next]: Position[]) {
  if (cx != null) {
    cx.beginPath(); //начать рисовать

    cx.moveTo(prev.x, prev.y); //начать с предыдущей точки
    cx.lineTo(next.x, next.y); //нарисовать в нужную точку
    cx.stroke();
  }
}

  //события которые нас интересуют
  // mousemove завели мышку на холст
  const mousemove$ = fromEvent<MouseEvent>(canvas, 'mousemove');
  // mousedown нажали на холст и двигаем
  const mousedown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
  // mouseup отпустили кнопку
  const mouseup$ = fromEvent<MouseEvent>(canvas, 'mouseup');
  // mouseout увели мышку с холста
  const mouseout$ = fromEvent<MouseEvent>(canvas, 'mouseout');

  const points$ = mousemove$.pipe(
    map<MouseEvent, Position>(({clientX, clientY}) => {
      //изначально рисовалась не под курсором из за отступов, исправлем это
      // при помощи getBoundingClientRect
      const {top, left} = canvas.getBoundingClientRect();
      return {
        x: clientX - left,
        y: clientY - top,
      };
  }),
    // оператор который комбинирует два последних значения Position в массив Position
  pairwise<Position>());

  // придействии mousedown нам нужно слушать mousemove, для чего используем метод
  // Rxjs switchMap
  mousedown$.pipe(
    switchMap(() =>points$.pipe(
      takeUntil(mouseout$), //условия выхода при уводе мышки
      takeUntil(mouseup$), //условия выхода при отжатии кнопки мыши
    ))
  ).subscribe(drawLine);


