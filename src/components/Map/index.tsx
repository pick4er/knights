import React from 'react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';

import Marker from '../Marker';
import Popup from '../Popup';

import { IRides, IKnight, IMarkers } from '../../types';
import { 
  MAP_ACCESS_TOKEN,
  MAP_STYLE,
} from '../../utils/constants';

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
}

function getKnightId(knight: IKnight): string {
  return `${knight['bikeid']}-${knight['starttime']}`;
}

function getMaxTripduration(knights: IKnight[]): number {
  let maxTripduration: number = 0;

  knights.forEach(({ tripduration }) => {
    if (tripduration >= maxTripduration) maxTripduration = tripduration;
  });

  return maxTripduration;
}

function getKnightActiveRadius(knight: IKnight, maxDuration: number): number {
  if (maxDuration === 0) return 0;
  return MIN_ACTIVE_RADIUS + (knight['tripduration'] * (MAX_ACTIVE_RADIUS / maxDuration));
}

function mapOnLoad(state: IMapState, props: IMapProps) {
  return function loadHandler() {
    const { map, setRides, setMarkers } = state;
    const { knights } = props;

    const knightRides: IRides = {};
    const markers: IMarkers = {};

    if (map === null) return;

    const startPopup = new mapboxgl.Popup();
    const endPopup = new mapboxgl.Popup();

    knights.forEach((knight): void => {
      const startStationId = knight['start station id'];
      const endStationId = knight['end station id'];

      let startMarkerPopup;
      let startStationMarker;

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
        startStationMarker = markers[startStationId];
      }

      let endMarkerPopup;
      let endStationMarker;

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
    setActivatedRides,
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

  const state = {
    map,
    setMap,
    rides,
    setRides,
    markers,
    setMarkers,
    activatedRides,
    setActivatedRides,
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

    return () => map!.remove();
  }, []);

  React.useEffect(() => {
    setMaxTripduration(
      getMaxTripduration(knights),
    );
  }, [knights]);

  React.useEffect(() => {
    if (map === null) return;
    if (knights.length === 0) return;

    map.on('load', mapOnLoad(state, props));
  }, [knights, map]);

  React.useEffect(() => {
    if (rides === null) return;
    if (hoveredKnight === null) return deactivateRides(state, props);

    const activeRadius = getKnightActiveRadius(hoveredKnight, maxTripduration);
    const hoveredKnightId = getKnightId(hoveredKnight);

    rides[hoveredKnightId].forEach((marker: Marker) => marker.activate(activeRadius));
    setActivatedRides(activatedRides.concat(hoveredKnightId));
  }, [hoveredKnight, rides]);

  return (
    <div />
  )
}

export default Map;
