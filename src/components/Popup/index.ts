import { 
  Map as MapType,
  Popup as PopupType,
} from 'mapbox-gl';

import { IPopupParams } from '../../types';

import './index.css'

export default class Popup {
  map: MapType;
  popup: PopupType;

  private _content: string;
  private _coordinates: number[];
  private _element: HTMLElement;

  constructor(params: IPopupParams) {
    const {
      map,
      popup,
      content,
      coordinates,
    } = params;

    this.map = map;
    this.popup = popup;
    this._content = content;
    this._coordinates = coordinates;
    this._element = this.createElement();
  }

  get element(): HTMLElement {
    return this._element;
  }

  createElement(): HTMLElement {
    const element = document.createElement('div');
    element.textContent = this._content;

    return element;
  }

  openPopup() {
    this.activate();

    this.popup
      .setLngLat([
        this._coordinates[0] as number,
        this._coordinates[1] as number,
      ])
      .setDOMContent(this._element)
      .addTo(this.map);
  }

  closePopup() {
    this.deactivate();

    this.popup.remove();
  }

  activate() {
    this.element.classList.add('Popup_active');
  }

  deactivate() {
    this.element.classList.remove('Popup_active');
  }
}
