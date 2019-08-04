import { 
  Map as MapType,
  Popup as PopupType,
} from 'mapbox-gl';

import MarkerPopupType from '../components/Popup';
import MarkerType from '../components/Marker';

export interface IKnight {
  ['bikeid']: number;
  ['starttime']: string;
  ['tripduration']: number;
  ['birth year']: string;
  ['end station id']: number;
  ['end station latitude']: number;
  ['end station longitude']: number;
  ['end station name']: string;
  ['gender']: string;
  ['start station id']: number;
  ['start station latitude']: number;
  ['start station longitude']: number;
  ['start station name']: string;
  ['starttime']: string;
  ['stoptime']: string;
  ['tripduration']: number;
  ['usertype']: string;
}

export interface IGeoJsonKnight {
  type: string;
  properties: object;
  geometry: object;
}

export interface IMarkerParams {
  map: MapType;
  popup: MarkerPopupType;
  radius?: number;
  width: number;
  height: number;
}

export interface IRides {
  [name: string]: MarkerType[];
}

export interface IPopupParams {
  popup: PopupType;
  content: string;
  coordinates: number[];
  map: MapType;
}

export interface IMarkers {
  [name: string]: MarkerType,
}
