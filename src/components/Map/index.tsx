import React from 'react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';

import Marker from '../Marker';
import Popup from '../Popup';

import { IRides, IKnight, IMarkers } from '../../types';
import { 
  MAP_ACCESS_TOKEN,
  MAP_STYLE,
} from '../../utils/constants';

import '../Popup/index.css';

mapboxgl.accessToken = MAP_ACCESS_TOKEN;

const MIN_ACTIVE_RADIUS = 12;
const MAX_ACTIVE_RADIUS = 30;

const WIDTH = 100;
const HEIGHT = 100;

const RADIUS = 10;

interface IMapProps {
  knights: IKnight[];
  hoveredKnight?: IKnight | null;
}

interface IMapState {
  map: MapType | null;
  setMap: any | null;
  rides: IRides | null;
  setRides: any | null;
  markers: IMarkers | null;
  setMarkers: any | null;
  activatedRides: string[];
  setActivatedRides: any | null;
  maxTripduration: number;
  minTripduration: number;
}

interface IMinMaxDurations {
  min: number;
  max: number;
}

function getKnightId(knight: IKnight): string {
  return `${knight['bikeid']}-${knight['starttime']}`;
}

function getMinMaxDurations(knights: IKnight[]): IMinMaxDurations {
  let max: number = 0;
  let min: number = 0;

  knights.forEach(({ tripduration }) => {
    if (tripduration >= max) max = tripduration;
    if (tripduration <= min) min = tripduration
  });

  return { max, min };
}

function getKnightActiveRadius(state: IMapState, props: IMapProps): number | null {
  const { hoveredKnight } = props;
  const { maxTripduration } = state;

  if (maxTripduration === 0) return 0;
  if (!hoveredKnight) return null;

  return MIN_ACTIVE_RADIUS + (hoveredKnight['tripduration'] * (MAX_ACTIVE_RADIUS / maxTripduration));
}

function mapOnLoad(state: IMapState, props: IMapProps) {
  return function loadHandler() {
    const { map, setRides, setMarkers } = state;
    const { knights } = props;

    const knightRides: IRides = {};
    const markers: IMarkers = {};

    if (map === null) return;

    const startPopup = new mapboxgl.Popup({ className: 'Popup_active' });
    const endPopup = new mapboxgl.Popup({ className: 'Popup_active' });

    knights.forEach((knight): void => {
      const startStationId = knight['start station id'];
      const endStationId = knight['end station id'];

      let startMarkerPopup;
      let startStationMarker;

      // remove duplicate markers
      if (!markers[startStationId]) {
        startMarkerPopup = new Popup({
          map: map,
          popup: startPopup,
          content: knight['start station name'],
          coordinates: [
            knight['start station longitude'] as number, 
            knight['start station latitude'] as number,
          ],
        });

        startStationMarker = new Marker({
          map, 
          width: WIDTH,
          height: HEIGHT,
          radius: RADIUS,
          popup: startMarkerPopup,
        });

        markers[startStationId] = startStationMarker;

        new mapboxgl.Marker({ element: startStationMarker.element })
          .setLngLat([
            knight['start station longitude'] as number, 
            knight['start station latitude'] as number,
          ])
          .addTo(map);
      } else {
        // to register a ride
        startStationMarker = markers[startStationId];
      }

      let endMarkerPopup;
      let endStationMarker;

      // remove duplicate markers
      if (!markers[endStationId]) {
        endMarkerPopup = new Popup({
          map: map,
          popup: endPopup,
          content: knight['end station name'],
          coordinates: [
            knight['end station longitude'] as number, 
            knight['end station latitude'] as number,
          ],
        });

        endStationMarker = new Marker({
          map, 
          width: WIDTH,
          height: HEIGHT,
          radius: RADIUS,
          popup: endMarkerPopup,
        });

        markers[endStationId] = endStationMarker;

        new mapboxgl.Marker({ element: endStationMarker.element })
          .setLngLat([
            knight['end station longitude'] as number,
            knight['end station latitude'] as number,
          ])
          .addTo(map);
      } else {
        // to register a ride
        endStationMarker = markers[endStationId];
      }

      knightRides[getKnightId(knight)] = [
        startStationMarker, 
        endStationMarker,
      ];
    });

    setRides(knightRides);
    setMarkers(markers);
  }
}

function deactivateRides(state: IMapState, props: IMapProps): void {
  const { 
    rides,
    activatedRides,
  } = state;

  if (rides === null) return;

  activatedRides.forEach(markerId => {
    rides[markerId].forEach((marker: Marker) => marker.deactivate());
  });
}

const Map: React.FC<IMapProps> = ({ 
  knights, 
  hoveredKnight = null,
}) => {
  const [map, setMap] = React.useState<MapType | null>(null);
  const [rides, setRides] = React.useState<IRides | null>(null);
  const [activatedRides, setActivatedRides] = React.useState<string[]>([]);
  const [markers, setMarkers] = React.useState<IMarkers | null>(null);
  const [maxTripduration, setMaxTripduration] = React.useState<number>(0);
  const [minTripduration, setMinTripduration] = React.useState<number>(0);

  const state = {
    map,
    setMap,
    rides,
    setRides,
    markers,
    setMarkers,
    activatedRides,
    setActivatedRides,
    maxTripduration,
    minTripduration,
  }

  const props = {
    knights,
    hoveredKnight,
  }

  React.useEffect(() => {
    setMap(
      new mapboxgl.Map({
        container: 'map',
        style: MAP_STYLE,
        center: [-74.0334588, 40.7162469],
        zoom: 12,
      })
    );
  }, []);

  React.useEffect(() => {
    return () => {
      if (map === null) return;
      map.remove();
    }
  }, [map]);

  React.useEffect(() => {
    const { min, max } = getMinMaxDurations(knights);

    setMaxTripduration(max);
    setMinTripduration(min);
  }, [knights]);

  React.useEffect(() => {
    const { map } = state;
    const { knights } = props;

    if (map === null) return;
    if (knights.length === 0) return;

    map.on('load', mapOnLoad(state, props));
  }, [state, props]);

  React.useEffect(() => {
    const { hoveredKnight } = props;
    const { rides, map } = state;

    deactivateRides(state, props);

    if (
      map === null ||
      rides === null ||
      hoveredKnight === null
    ) return;

    const activeRadius = getKnightActiveRadius(state, props);
    if (!activeRadius) return;

    const hoveredKnightId = getKnightId(hoveredKnight);

    rides[hoveredKnightId].forEach((marker: Marker) => marker.activate(activeRadius));
    setActivatedRides([hoveredKnightId]);
  }, [state, props]);

  return (
    <div />
  )
}

export default Map;
