import React from 'react';
import debounce from 'lodash.debounce';

import Map from '../Map';
import List from '../List';

import { IKnight } from '../../types';
import { database } from '../../utils/firebase';
import './index.css';

interface IAppState {
  knights: any[];
  setKnights: any;
  hoveredKnight: IKnight | null;
  setHoveredKnight: any;
}

interface IKnightHandler {
  (knight: any): void;
}

let debouncedKnightHover: any;
let debouncedKnightsLeave: any;

function onKnightHover(state: IAppState): IKnightHandler {
  return function hoverHandler(knight) {
    state.setHoveredKnight(knight);
  }
}

function onKnightsLeave(state: IAppState): IKnightHandler {
  return function leaveHandler() {
    debouncedKnightHover.cancel();
    state.setHoveredKnight(null);
  }
}

const App: React.FC = () => {
  const [knights, setKnights] = React.useState([]);
  const [hoveredKnight, setHoveredKnight] = React.useState<IKnight | null>(null);

  const state = {
    knights,
    setKnights,
    hoveredKnight,
    setHoveredKnight,
  }

  React.useEffect(() => {
    debouncedKnightsLeave = debounce(onKnightsLeave(state), 300);
    debouncedKnightHover = debounce(onKnightHover(state), 500);
  }, []);

  React.useEffect(() => {
    const roadsRef = database
      .ref('/')
      .orderByKey()
      .limitToFirst(100);

    roadsRef
      .once('value')
      .then(snapshot => setKnights(snapshot.val()))
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <Map 
        knights={knights} 
        hoveredKnight={hoveredKnight}
      />
      <List 
        knights={knights} 
        onKnightHover={debouncedKnightHover} 
        onKnightsLeave={debouncedKnightsLeave}
      />
    </div>
  )
}

export default App;
