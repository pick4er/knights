import { Map as MapType } from 'mapbox-gl';

import { IMarkerParams } from '../../types';
import MarkerPopupType from '../Popup';

import './index.css';

export default class Marker {
  readonly COLOR = 'rgba(255, 100, 100, 1)';
  readonly ACTIVE_COLOR = 'rgba(200, 0, 255, 1)';

  popup: MarkerPopupType;
  map: MapType;
  width: number;
  height: number;

  private _radius: number;
  private _element: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D | null;
  private _isActive: boolean;

  constructor(params: IMarkerParams) {
    const { 
      map,
      popup,
      width,
      height,
      radius = 10,
    } = params;

    this.map = map;
    this.popup = popup;
    this.width = width;
    this.height = height;
    this._radius = radius;
    this._isActive = false;
    this._element = this.createElement();
    this._context = this.element.getContext('2d');

    this.renderElement(this._radius);
  }

  get element(): HTMLCanvasElement {
    return this._element;
  }

  createElement(): HTMLCanvasElement {
    let canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;

    return canvas;
  }

  renderElement(radius: number) {
    const context = this._context;
    if (context === null) return;

    let color = this.COLOR;
    if (this._isActive) {
      color = this.ACTIVE_COLOR;
      this.element.classList.add('Marker_active');
    } else if (this.element.classList.contains('Marker_active')) {
      this.element.classList.remove('Marker_active');
    }

    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
  }

  activate(radius: number) {
    this._isActive = true;
    this.renderElement(radius);
    this.popup.openPopup();
    this.map.triggerRepaint();
  }

  deactivate() {
    this._isActive = false;
    this.renderElement(this._radius);
    this.popup.closePopup();
    this.map.triggerRepaint();
  }
}
