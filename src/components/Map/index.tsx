import React from 'react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';

import Marker from '../Marker';
import Popup from '../Popup';

import { IRides, IKnight } from '../../types';
import { 
  MAP_ACCESS_TOKEN,
  MAP_STYLE,
} from '../../utils/constants';

mapboxgl.accessToken = MAP_ACCESS_TOKEN;
const MIN_ACTIVE_RADIUS = 12;
const MAX_ACTIVE_RADIUS = 30;
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
    const { map, setRides } = state;
    const { knights } = props;
    const knightRides: IRides = {};

    if (map === null) return;

    const maxTripduration = getMaxTripduration(knights);
    const startPopup = new mapboxgl.Popup();
    const endPopup = new mapboxgl.Popup();

    knights.forEach(knight => {
      const activeRadius = getKnightActiveRadius(
        knight, 
        maxTripduration,
      );

      const startMarkerPopup = new Popup({
        map: map,
        popup: startPopup,
        content: knight['start station name'],
        coordinates: [
          knight['start station longitude'] as number, 
          knight['start station latitude'] as number,
        ],
      });
      const endMarkerPopup = new Popup({
        map: map,
        popup: endPopup,
        content: knight['end station name'],
        coordinates: [
          knight['end station longitude'] as number, 
          knight['end station latitude'] as number,
        ],
      });

      const startStationMarker = new Marker({
        map, 
        activeRadius,
        radius: RADIUS,
        popup: startMarkerPopup,
      });
      const endStationMarker = new Marker({
        map, 
        activeRadius,
        radius: RADIUS,
        popup: endMarkerPopup,
      });

      knightRides[getKnightId(knight)] = [
        startStationMarker, 
        endStationMarker,
      ];

      new mapboxgl.Marker({ element: startStationMarker.element })
        .setLngLat([
          knight['start station longitude'] as number, 
          knight['start station latitude'] as number,
        ])
        .addTo(map);

      new mapboxgl.Marker({ element: endStationMarker.element })
        .setLngLat([
          knight['end station longitude'] as number,
          knight['end station latitude'] as number,
        ])
        .addTo(map);
    });

    setRides(knightRides);
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

  const state = {
    map,
    setMap,
    rides,
    setRides,
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
    if (map === null) return;
    if (knights.length === 0) return;

    map.on('load', mapOnLoad(state, props));
  }, [knights, map]);

  React.useEffect(() => {
    if (rides === null) return;
    if (hoveredKnight === null) return deactivateRides(state, props);

    const hoveredKnightId = getKnightId(hoveredKnight);
    rides[hoveredKnightId].forEach((marker: Marker) => marker.activate());
    setActivatedRides(activatedRides.concat(hoveredKnightId));
  }, [hoveredKnight, rides]);

  return (
    <div />
  )
}

export default Map;
