// получаем обьект canvas как HTMLCanvasElement
import {fromEvent} from "rxjs";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
//получаем контекст в 2d...
const cx = canvas.getContext('2d');
//задаем толщину линии отрисовки
if (cx != null) {
  cx.lineWidth = 4;
}
interface Position {
  x: number;
  y: number;
}

function draawLine([prev, next]: Position[]) {
  if (cx != null) {
    cx.beginPath();

    cx.moveTo(prev.x, prev.y);
    cx.lineTo(next.x, next.y);
    cx.stroke();
  }

  const mousemove$ = fromEvent<MouseEvent>(canvas, 'mousemove');
  const mousedown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
  const mouseup$ = fromEvent<MouseEvent>(canvas, 'mouseup');
  const mouseout$ = fromEvent<MouseEvent>(canvas, 'mouseout');

}
