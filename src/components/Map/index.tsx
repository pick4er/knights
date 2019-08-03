import React from 'react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';

import { 
  IKinght,
  IPulsingDot,
} from '../../types';
import { 
  MAP_ACCESS_TOKEN,
  MAP_STYLE,
} from '../../utils/constants';

mapboxgl.accessToken = MAP_ACCESS_TOKEN;

interface MapProps {
  knights: IKinght[];
  hoveredKnight?: object;
}

interface MapState {
  map: MapType | null;
  setMap: any | null;
}

function encodeKnightsToGeoJson(knights: IKinght[]): any[] {
  return knights.map(knight => ({
    type: 'Feature',
    properties: {
      title: knight['end station name'],
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

function onMapLoad(state: MapState, props: MapProps) {
  return function loadHandler() {
    const { map } = state;
    const { knights } = props;

    if (map === null) return;

    const geoJsonKnights = encodeKnightsToGeoJson(knights);

    map.addSource('knights', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: geoJsonKnights,
      },
    });

    map.addImage('pulsing-dot', getPulsingDot(map), { pixelRatio: 2 });

    map.addLayer({
      id: 'destinations',
      type: 'symbol',
      source: 'knights',
      layout: {
        'icon-image': 'pulsing-dot',
      }
    });
  }
}

const Map: React.FC<MapProps> = ({ 
  knights, 
  hoveredKnight = {},
}) => {
  const [map, setMap] = React.useState<MapType | null>(null);

  const state = {
    map,
    setMap,
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
  }, []);

  React.useEffect(() => {
    if (map === null) return;
    if (knights.length === 0) return;
    map.on('load', onMapLoad(state, props));
  }, [knights, map]);

  return (
    <div />
  )
}

export default Map;
