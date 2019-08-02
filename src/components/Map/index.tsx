import React from 'react';
import mapboxgl from 'mapbox-gl';

import { 
  MAP_ACCESS_TOKEN,
  MAP_STYLE,
} from '../../utils/constants';

mapboxgl.accessToken = MAP_ACCESS_TOKEN;

type MapProps = {
  knights: object[],
}

const Map: React.FC<MapProps> = ({ knights }) => {
  const [map, setMap] = React.useState({});

  React.useEffect(() => {
    setMap(
      new mapboxgl.Map({
        container: 'map',
        style: MAP_STYLE,
      }),
    );
  }, []);

  return (
    <div />
  )
}

export default Map;
