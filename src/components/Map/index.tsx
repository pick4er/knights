import React, { PureComponent } from 'react';
import mapboxgl from 'mapbox-gl';

import { 
  MAP_ACCESS_TOKEN,
  MAP_STYLE,
} from '../../utils/constants';

mapboxgl.accessToken = MAP_ACCESS_TOKEN;

type MapState = {
  map: object,
}

class Map extends PureComponent<{}, MapState> {
  state = {
    map: {},
  }

  componentDidMount() {
    this.initMapBox();
  }

  initMapBox() {
    this.setState({
      map: new mapboxgl.Map({
        container: 'map',
        style: MAP_STYLE,
      }),
    });
  }

  render() {
    return (
      <div />
    )
  }
}

export default Map;
