import React from 'react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';

import Marker from '../Marker';

import { 
  IKnight,
  IPulsingDot,
} from '../../types';
import { 
  MAP_ACCESS_TOKEN,
  MAP_STYLE,
} from '../../utils/constants';

mapboxgl.accessToken = MAP_ACCESS_TOKEN;

interface IMapProps {
  knights: IKnight[];
  hoveredKnight?: IKnight | null;
}

interface IMapState {
  map: MapType | null;
  setMap: any | null;
  markers: IRides | null;
  setMarkers: any | null;
  activatedMarkers: string[];
  setActivatedMarkers: any | null;
}

function encodeKnightsToGeoJson(knights: IKnight[]): any[] {
  return knights.map(knight => ({
    type: 'Feature',
    properties: {
      title: knight['end station name'],
      iconSize: [20, 20],
    },
    geometry: {
      type: 'Point',
      coordinates: [
        knight['end station longitude'], 
        knight['end station latitude'],
      ],
    },
  }));
}

function getPulsingDot(map: MapType): IPulsingDot {
  const size = 100;

  return {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    context: null,

    onAdd() {
      let canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },

    render() {
      let duration = 1000;
      let t = (performance.now() % duration) / duration;
       
      let radius = size / 2 * 0.3;
      let outerRadius = size / 2 * 0.7 * t + radius;
      let context = this.context;

      if (context === null) return false;

      // draw outer circle
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
      context.fill();

      // draw inner circle
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255, 100, 100, 1)';
      context.strokeStyle = 'white';
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();

      // update this image's data with data from the canvas
      this.data = context.getImageData(0, 0, this.width, this.height).data;

      // keep the map repainting
      map.triggerRepaint();

      // return `true` to let the map know that the image was updated
      return true;
    }
  }
}

interface IRides {
  [name: string]: any;
}

function getKnightId(knight: IKnight): string {
  return `${knight['bikeid']}-${knight['starttime']}`;
}

function mapOnLoad(state: IMapState, props: IMapProps) {
  return function loadHandler() {
    const { map, setMarkers } = state;
    const { knights } = props;
    const knightRides: IRides = {};

    if (map === null) return;

    knights.forEach(knight => {
      const startStationMarker = new Marker(knight, map);
      const endStationMarker = new Marker(knight, map);

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

    setMarkers(knightRides);
  }
}

function freeActivatedMarkers(state: IMapState, props: IMapProps): void {
  const { 
    markers,
    activatedMarkers, 
    setActivatedMarkers,
  } = state;

  if (markers === null) return;

  activatedMarkers.forEach(markerId => {
    markers[markerId].forEach((marker: IRides) => marker.deactivate());
  });
}

const Map: React.FC<IMapProps> = ({ 
  knights, 
  hoveredKnight = null,
}) => {
  const [map, setMap] = React.useState<MapType | null>(null);
  const [markers, setMarkers] = React.useState<IRides | null>(null);
  const [activatedMarkers, setActivatedMarkers] = React.useState<string[]>([]);

  const state = {
    map,
    setMap,
    markers,
    setMarkers,
    activatedMarkers,
    setActivatedMarkers,
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
    if (markers === null) return;
    if (hoveredKnight === null) {
      freeActivatedMarkers(state, props);
      return;
    };

    const hoveredKnightId = getKnightId(hoveredKnight);
    markers[hoveredKnightId].forEach((marker: IRides) => marker.activate());
    setActivatedMarkers(activatedMarkers.concat(hoveredKnightId));
  }, [hoveredKnight, markers]);

  return (
    <div />
  )
}

export default Map;
