import { Map as MapType } from 'mapbox-gl';
import { IKnight } from '../../types';

function createElement(): HTMLElement {
  let el = document.createElement('div');
  el.className = 'Marker';
  el.style.backgroundImage = 'url(https://placekitten.com/g/10/10/)';
  el.style.width = '10px';
  el.style.height = '10px';

  return el;
}

export default class Marker {
  element: HTMLElement;
  knight: IKnight;
  map: MapType;

  constructor(knight: IKnight, map: MapType) {
    this.knight = knight;
    this.element = createElement();
    this.map = map;
  }

  activate(): void {
    const el = this.element;

    el.style.width = '50px';
    el.style.height = '50px';

    this.map.triggerRepaint();
  }

  deactivate(): void {
    const el = this.element;

    el.style.width = '10px';
    el.style.height = '10px';

    this.map.triggerRepaint();
  }
}
